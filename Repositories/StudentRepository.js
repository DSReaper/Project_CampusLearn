const IStudentRepository = require("./IStudentRepository");
const MongoDBConnection = require("../Model/database/connection.js");
const bcrypt = require("bcrypt");

class StudentRepository extends IStudentRepository {
  constructor() {
    super();
    this.conn = new MongoDBConnection();
  }

  async findByEmailAndPassword(email, password) {
    await this.conn.connect();
    const db = this.conn.getDatabase();
    const student = await db.collection("students").findOne({ Email: email });
    if (!student || !student.Password) return null;

    const isMatch = await bcrypt.compare(String(password || ""), student.Password);
    return isMatch ? student : null;
  }

  async findByEmail(email) {
    await this.conn.connect();
    const db = this.conn.getDatabase();
    return db.collection("students").findOne({ Email: email });
  }

  async isTutor(studentID) {
    await this.conn.connect();
    const db = this.conn.getDatabase();
    const tutor = await db.collection("tutors").findOne({ StudentID: studentID });
    return !!tutor;
  }
}

module.exports = new StudentRepository();