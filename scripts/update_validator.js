require("dotenv").config();
const { MongoClient } = require("mongodb");

(async () => {
  const url = process.env.MONGO_URL || "mongodb://localhost:27017";
  const dbName = process.env.DB_NAME || "campusLearnDB";
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db(dbName);

    const result = await db.command({
      collMod: "students",
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: [
            "StudentID","DegreeID","FirstName","LastName",
            "Email","PasswordHash","Status","Online"
          ],
          additionalProperties: false,
          properties: {
            StudentID:   { bsonType: ["int","long","double"], minimum: 1 },
            DegreeID:    { bsonType: ["int","long","double"] },
            FirstName:   { bsonType: "string", minLength: 2, maxLength: 50 },
            LastName:    { bsonType: "string", minLength: 2, maxLength: 50 },
            Email:       { bsonType: "string", pattern: "^[0-9]+@student\\.belgiumcampus\\.ac\\.za$" },
            PasswordHash:{ bsonType: "string", minLength: 20, maxLength: 200 },
            Status:      { bsonType: "string", enum: ["Active","Inactive","Suspended"] },
            Online:      { bsonType: "bool" },
            CreatedAt:   { bsonType: "date" },
            UpdatedAt:   { bsonType: "date" }
          }
        }
      }
    });

    console.log("✅ Validator updated:", result);
  } catch (err) {
    console.error("❌ Error updating validator:", err);
  } finally {
    await client.close();
  }
})();
