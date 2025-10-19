const fs = require("fs");
const path = require("path");
const { Int32, Long } = require("mongodb");
const MongoDBConnection = require("../Model/database/connection.js");

const IDS_PATH = path.resolve("Model/data/tutors.json");

function toBsonInt(n) {
  if (!Number.isInteger(n)) throw new Error(`Not an integer: ${n}`);
  return n >= -2147483648 && n <= 2147483647
    ? new Int32(n)
    : Long.fromNumber(n);
}

const TutorValidator = {
  $jsonSchema: {
    bsonType: "object",
    title: "Tutor",
    description: "Schema for tutor entity (a student who acts as a tutor)",
    required: ["TutorID", "StudentID"],
    additionalProperties: false,
    properties: {
      _id: { bsonType: "objectId" },
      TutorID: {
        bsonType: ["int", "long"],
        minimum: 1,
        description: "Primary key for tutor",
      },
      StudentID: {
        bsonType: ["int", "long"],
        description: "FK to students.StudentID",
      },
    },
  },
};

(async () => {
  const conn = new MongoDBConnection();
  try {
    if (!fs.existsSync(IDS_PATH)) {
      throw new Error(`File not found: ${IDS_PATH}`);
    }
    const ids = JSON.parse(fs.readFileSync(IDS_PATH, "utf8"));
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error(
        "tutors.json must be a non-empty array of StudentIDs (integers)."
      );
    }

    await conn.connect();
    const db = conn.getDatabase();

    // Ensure tutors collection with validator + indexes
    const exists = await db.listCollections({ name: "tutors" }).toArray();
    if (exists.length === 0) {
      await db.createCollection("tutors", { validator: TutorValidator });
      console.log("✅ tutors collection created with schema validation");
    } else {
      await db.command({ collMod: "tutors", validator: TutorValidator });
      console.log("✅ tutors collection updated with schema validation");
    }
    await db.collection("tutors").createIndex({ TutorID: 1 }, { unique: true });
    await db
      .collection("tutors")
      .createIndex({ StudentID: 1 }, { unique: true });

    const studentsCol = db.collection("students");
    const tutorsCol = db.collection("tutors");

    let ok = 0,
      skipped = 0,
      missing = 0;

    for (const rawId of ids) {
      try {
        // Check student exists
        const studentIdInt = Number(rawId);
        if (!Number.isInteger(studentIdInt))
          throw new Error(`Invalid StudentID: ${rawId}`);
        const student = await studentsCol.findOne({
          StudentID: toBsonInt(studentIdInt),
        });
        if (!student) {
          missing++;
          console.warn(`⚠️ No student found with StudentID=${rawId}`);
          continue;
        }

        // TutorID = StudentID (simple, unique, integer)
        const doc = {
          TutorID: toBsonInt(studentIdInt),
          StudentID: toBsonInt(studentIdInt),
        };

        await tutorsCol.updateOne(
          { StudentID: doc.StudentID },
          { $setOnInsert: doc },
          { upsert: true }
        );
        ok++;
      } catch (e) {
        skipped++;
        console.warn(`Skipped ${rawId}: ${e.message}`);
      }
    }

    console.log(
      `🎉 Tutors upserted: ${ok} | missing students: ${missing} | skipped: ${skipped}`
    );
  } catch (err) {
    console.error("❌ Tutor import failed:", err.message || err);
    process.exit(1);
  } finally {
    try {
      await conn.disconnect();
    } catch {}
  }
})();
