require("dotenv").config();
const { MongoClient } = require("mongodb");

(async () => {
  const url = process.env.MONGO_URL || "mongodb://localhost:27017";
  const dbName = process.env.DB_NAME || "campusLearnDB";
  const client = new MongoClient(url);
  await client.connect();
  const db = client.db(dbName);

  const info = await db.command({
    listCollections: 1,
    filter: { name: "students" }
  });

  console.log(
    JSON.stringify(
      info.cursor.firstBatch[0]?.options?.validator || "❌ No validator set",
      null,
      2
    )
  );

  await client.close();
})();
