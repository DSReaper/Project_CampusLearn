require("dotenv").config();
const { MongoClient } = require("mongodb");

(async () => {
  const url = process.env.MONGO_URL || "mongodb://localhost:27017";
  const client = new MongoClient(url);

  try {
    await client.connect();

    // list all databases
    const admin = client.db().admin();
    const dbs = await admin.listDatabases();

    console.log("📦 Databases found:");
    dbs.databases.forEach(db => console.log(` - ${db.name}`));

    // check if your target DB exists
    const dbName = process.env.DB_NAME || "campusLearnDB";
    const exists = dbs.databases.some(db => db.name === dbName);
    if (!exists) {
      console.log(`❌ Database '${dbName}' does NOT exist yet.`);
    } else {
      console.log(`✅ Database '${dbName}' exists.`);
      const db = client.db(dbName);

      // list all collections (tables)
      const collections = await db.listCollections().toArray();
      console.log("📁 Collections in this database:");
      if (collections.length === 0) console.log("   (no collections yet)");
      else collections.forEach(c => console.log(` - ${c.name}`));
    }
  } catch (err) {
    console.error("❌ Error checking database:", err);
  } finally {
    await client.close();
  }
})();
