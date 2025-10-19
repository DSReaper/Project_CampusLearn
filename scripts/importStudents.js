"use strict";

const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const MongoDBConnection = require("../Model/database/connection.js");
const { Int32, Long } = require("mongodb");

const STUDENTS_JSON = path.resolve("Model/data/students.json");
const EMAIL_DOMAIN = "student.belgiumcampus.ac.za";
const SALT_ROUNDS = 10;

// only allow fields in your schema
const ALLOWED_KEYS = new Set([
  "StudentID",
  "DegreeID",
  "FirstName",
  "LastName",
  "Email",
  "Password",
  "Status",
  "Online",
]);

function validateRequiredFields(doc) {
  for (const k of [
    "StudentID",
    "DegreeID",
    "FirstName",
    "LastName",
    "Email",
    "Status",
    "Online",
  ]) {
    if (!(k in doc)) throw new Error(`Missing required field "${k}"`);
  }
  if (!["Active", "Inactive", "Suspended"].includes(doc.Status)) {
    throw new Error(`Invalid Status "${doc.Status}"`);
  }
}

function validateEmailMatchesId(doc) {
  const expected = `${doc.StudentID}@${EMAIL_DOMAIN}`;
  if (doc.Email !== expected) {
    throw new Error(`Email mismatch: "${doc.Email}" ≠ "${expected}"`);
  }
}

// Coerce numeric IDs to BSON int/long (so $jsonSchema with bsonType:"int"/"long" passes)
function toBsonInt(n) {
  if (Number.isInteger(n) && n >= -2147483648 && n <= 2147483647)
    return new Int32(n);
  if (Number.isInteger(n)) return Long.fromNumber(n);
  throw new Error(`Value "${n}" is not an integer`);
}

async function hashPasswordIfNeeded(doc) {
  if (!doc.Password) return; // Password not required in your schema
  if (/^\$2[aby]\$/.test(doc.Password)) return; // already bcrypt
  doc.Password = await bcrypt.hash(doc.Password, SALT_ROUNDS);
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
    const col = db.collection("students");
    console.log("✅ Connected & validator ready");

    if (!fs.existsSync(STUDENTS_JSON))
      throw new Error(`File not found: ${STUDENTS_JSON}`);
    const docs = JSON.parse(fs.readFileSync(STUDENTS_JSON, "utf8"));
    if (!Array.isArray(docs) || docs.length === 0)
      throw new Error("students.json must be a non-empty array");

    const ready = [];
    let skipped = 0;

    for (const raw of docs) {
      try {
        // clone to avoid mutating original
        const doc = { ...raw };

        // strict to schema
        stripUnknownKeys(doc);

        // validate + transforms
        validateRequiredFields(doc);
        validateEmailMatchesId(doc);

        // numeric coercion
        doc.StudentID = toBsonInt(doc.StudentID);
        doc.DegreeID = toBsonInt(doc.DegreeID);

        await hashPasswordIfNeeded(doc);

        ready.push(doc);
      } catch (e) {
        skipped++;
        console.warn(
          `⚠️ Skipped StudentID=${raw.StudentID ?? "unknown"}: ${e.message}`
        );
      }
    }

    if (ready.length === 0) {
      console.log("No valid documents to insert.");
      process.exit(0);
    }

    const res = await col.insertMany(ready, { ordered: false });
    console.log(
      `🎉 Inserted ${res.insertedCount} students (skipped ${skipped})`
    );
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
