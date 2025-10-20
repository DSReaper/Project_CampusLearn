"use strict";

const fs = require("fs");
const path = require("path");
const MongoDBConnection = require("../Model/database/connection.js");
const { ObjectId } = require("mongodb");

const CHATROOMS_JSON = path.resolve("Model/data/chatrooms.json");
const DEFAULT_CREATOR = "578039";

// Only allow fields in the schema
const ALLOWED_KEYS = new Set([
  "name",
  "description",
  "createdBy",
  "members",
  "isPrivate",
  "maxMembers",
  "createdAt",
  "updatedAt"
]);

function validateRequiredFields(doc) {
  for (const k of [
    "name",
    "description",
    "createdBy"
  ]) {
    if (!(k in doc)) throw new Error(`Missing required field "${k}"`);
  }
}

function validateNameUnique(doc, existingNames) {
  if (existingNames.has(doc.name)) {
    throw new Error(`Chatroom name "${doc.name}" already exists`);
  }
  existingNames.add(doc.name);
}

function processCreatorField(doc) {
  if (doc.createdBy && typeof doc.createdBy === 'string') {
    try {
      doc.createdBy = new ObjectId(doc.createdBy);
    } catch (e) {
      throw new Error(`Invalid createdBy ObjectId: "${doc.createdBy}"`);
    }
  } else if (!doc.createdBy) {
    // Use default creator if none provided
    doc.createdBy = new ObjectId(DEFAULT_CREATOR);
  }
}

function processMembersField(doc) {
  if (!doc.members || !Array.isArray(doc.members)) {
    doc.members = [doc.createdBy]; // Default to creator as member
  } else {
    // Convert string member IDs to ObjectId
    doc.members = doc.members.map(member => {
      if (typeof member === 'string') {
        try {
          return new ObjectId(member);
        } catch (e) {
          throw new Error(`Invalid member ObjectId: "${member}"`);
        }
      }
      return member;
    });
    
    // Ensure creator is in members
    if (!doc.members.some(member => member.equals(doc.createdBy))) {
      doc.members.push(doc.createdBy);
    }
  }
}

function setDefaultValues(doc) {
  if (typeof doc.isPrivate !== 'boolean') {
    doc.isPrivate = false;
  }
  if (typeof doc.maxMembers !== 'number' || doc.maxMembers < 1) {
    doc.maxMembers = 50;
  }
  // Set timestamps
  const now = new Date();
  doc.createdAt = now;
  doc.updatedAt = now;
}

function stripUnknownKeys(doc) {
  for (const k of Object.keys(doc)) {
    if (!ALLOWED_KEYS.has(k)) delete doc[k];
  }
}

(async () => {
  const conn = new MongoDBConnection();

  try {
    await conn.connect();
    const db = conn.getDatabase();
    const col = db.collection("chatrooms");
    console.log("✅ Connected to database");

    // Check if chatrooms collection exists and create validator if needed
    const collections = await db.listCollections({ name: "chatrooms" }).toArray();
    if (collections.length === 0) {
      console.log("ℹ️  Chatrooms collection doesn't exist, it will be created on first insert");
    }

    // Use provided JSON file or fallback to default chatrooms
    let docs;
    if (fs.existsSync(CHATROOMS_JSON)) {
      docs = JSON.parse(fs.readFileSync(CHATROOMS_JSON, "utf8"));
      console.log(`📁 Loaded ${docs.length} chatrooms from file`);
    } else {
      console.log("ℹ️  No chatrooms.json found, using default chatrooms");
      docs = [
        {
          name: "General",
          description: "General discussion for all students",
          isPrivate: false,
          maxMembers: 100
        },
        {
          name: "Programming",
          description: "Discuss programming languages and projects",
          isPrivate: false,
          maxMembers: 50
        },
        {
          name: "Mathematics",
          description: "Help with math problems and concepts",
          isPrivate: false,
          maxMembers: 50
        },
        {
          name: "Science",
          description: "Physics, Chemistry, Biology discussions",
          isPrivate: false,
          maxMembers: 50
        },
        {
          name: "Study Group",
          description: "Collaborative study sessions",
          isPrivate: false,
          maxMembers: 30
        },
        {
          name: "Gaming",
          description: "Video games and esports",
          isPrivate: false,
          maxMembers: 50
        },
        {
          name: "Music",
          description: "Share and discuss music",
          isPrivate: false,
          maxMembers: 50
        },
        {
          name: "Private Study",
          description: "Invite-only study group",
          isPrivate: true,
          maxMembers: 10
        }
      ];
    }

    if (!Array.isArray(docs) || docs.length === 0)
      throw new Error("Chatrooms data must be a non-empty array");

    const ready = [];
    let skipped = 0;
    const existingNames = new Set();

    // First, check for existing chatroom names to avoid duplicates
    const existingChatrooms = await col.find({}, { projection: { name: 1 } }).toArray();
    existingChatrooms.forEach(chatroom => existingNames.add(chatroom.name));

    for (const raw of docs) {
      try {
        // Clone to avoid mutating original
        const doc = { ...raw };

        // Strict to schema
        stripUnknownKeys(doc);

        // Validate + transforms
        validateRequiredFields(doc);
        validateNameUnique(doc, existingNames);
        processCreatorField(doc);
        processMembersField(doc);
        setDefaultValues(doc);

        ready.push(doc);
      } catch (e) {
        skipped++;
        console.warn(
          `⚠️ Skipped chatroom "${raw.name ?? "unknown"}": ${e.message}`
        );
      }
    }

    if (ready.length === 0) {
      console.log("No valid chatrooms to insert.");
      process.exit(0);
    }

    const res = await col.insertMany(ready, { ordered: false });
    console.log(
      `🎉 Inserted ${res.insertedCount} chatrooms (skipped ${skipped})`
    );

    // Display inserted chatrooms
    console.log("\n📋 Inserted chatrooms:");
    ready.forEach(chatroom => {
      console.log(`   • ${chatroom.name} - ${chatroom.description}`);
    });

  } catch (err) {
    console.error("❌ Import failed:", err.message || err);
    if (err.writeErrors?.length) {
      for (const e of err.writeErrors.slice(0, 5)) {
        console.error(`   • ${e.errmsg}`);
      }
      const dups = err.writeErrors.filter((e) => e.code === 11000).length;
      console.error(`   • Duplicate key errors: ${dups}`);
      console.error(
        `   • Other write errors: ${err.writeErrors.length - dups}`
      );
    }
    process.exit(1);
  } finally {
    try {
      await conn.disconnect();
    } catch {}
  }
})();