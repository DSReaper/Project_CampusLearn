// Repositories/StudentRepository.js
const bcrypt = require("bcrypt");
const { Int32 } = require("bson"); // <-- add this
const IStudentRepository = require("./IStudentRepository");
const MongoDBConnection = require("../Model/database/connection");

class StudentRepository extends IStudentRepository {
  constructor() {
    super();
    this.dbConnection = new MongoDBConnection();
    this.collection = null;
  }

  async init() {
    if (!this.collection) {
      await this.dbConnection.connect();
      const db = this.dbConnection.getDatabase();
      this.collection = db.collection("students"); // ensure plural
    }
  }

  async findByEmail(email) {
    await this.init();
    return this.collection.findOne({ Email: email });
  }

  async createStudent({
    StudentID,
    DegreeID,
    FirstName,
    LastName,
    Email,
    Password,
    Status = "Active",
    Online = false,
  }) {
    await this.init();

    // validations
    if (!Email || !/@student\.belgiumcampus\.ac\.za$/i.test(Email)) {
      throw new Error(
        "Invalid email format. Must end with @student.belgiumcampus.ac.za"
      );
    }
    if (!Password || Password.length < 8) {
      throw new Error("Password must be at least 8 characters long.");
    }
    if (!FirstName || !LastName) {
      throw new Error("First name and last name are required.");
    }

    // cast numeric fields to BSON Int32 to satisfy bsonType: "int"
    const sid = new Int32(Number(StudentID));
    const did = new Int32(Number(DegreeID));

    const PasswordHash = await bcrypt.hash(Password, 10);
    const now = new Date();

    const doc = {
      StudentID: sid,
      DegreeID: did,
      FirstName,
      LastName,
      Email,
      PasswordHash,
      Status, // must be one of: Active | Inactive | Suspended
      Online: !!Online,
      CreatedAt: now,
      UpdatedAt: now,
    };

    const res = await this.collection.insertOne(doc);
    console.log(`✅ Created student ${FirstName} (${Email})`);
    return { _id: res.insertedId, ...doc };
  }
}

module.exports = new StudentRepository();
