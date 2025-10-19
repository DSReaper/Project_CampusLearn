require("dotenv").config();
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");

(async () => {
  const url = process.env.MONGO_URL || "mongodb://localhost:27017";
  const dbName = process.env.DB_NAME || "campusLearnDB";
  const client = new MongoClient(url, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 8000,
  });

  try {
    await client.connect();
    const db = client.db(dbName);
    const students = db.collection("students");

    console.log("✅ Connected to MongoDB");

    // Generate bcrypt hashes for passwords
    const hashZac = await bcrypt.hash("Zac#2025", 10);
    const hashKagiso = await bcrypt.hash("Kagiso#2025", 10);
    const hashManissha = await bcrypt.hash("Manissha#2025", 10);
    const hashTiago = await bcrypt.hash("Tiago#2025", 10);

    const now = new Date();

    const data = [
      {
        StudentID: 578039,
        DegreeID: 101,
        FirstName: "Zac",
        LastName: "Myburgh",
        Email: "578039@student.belgiumcampus.ac.za",
        PasswordHash: hashZac,
        Status: "Active",
        Online: false,
        CreatedAt: now,
        UpdatedAt: now,
      },
      {
        StudentID: 600836,
        DegreeID: 102,
        FirstName: "Kagiso",
        LastName: "Sebati",
        Email: "600836@student.belgiumcampus.ac.za",
        PasswordHash: hashKagiso,
        Status: "Active",
        Online: false,
        CreatedAt: now,
        UpdatedAt: now,
      },
      {
        StudentID: 577639,
        DegreeID: 103,
        FirstName: "Manissha",
        LastName: "Packary",
        Email: "577639@student.belgiumcampus.ac.za",
        PasswordHash: hashManissha,
        Status: "Active",
        Online: false,
        CreatedAt: now,
        UpdatedAt: now,
      },
      {
        StudentID: 600286,
        DegreeID: 104,
        FirstName: "Tiago",
        LastName: "Luiz",
        Email: "600286@student.belgiumcampus.ac.za",
        PasswordHash: hashTiago,
        Status: "Active",
        Online: false,
        CreatedAt: now,
        UpdatedAt: now,
      },
    ];

    // Upsert (insert or update if already exists)
    for (const doc of data) {
      await students.updateOne(
        { Email: doc.Email },
        { $set: doc },
        { upsert: true }
      );
      console.log(`✅ Added/updated ${doc.FirstName} (${doc.Email})`);
    }

    console.log("🎉 All student data inserted successfully!");
  } catch (err) {
    console.error("❌ Error inserting data:", err);
  } finally {
    await client.close();
  }
})();
