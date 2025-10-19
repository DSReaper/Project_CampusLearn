"use strict";

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

    // if user not found, return null
    if (!student || !student.Password) return null;

    // compare plain password with hashed password
    const isMatch = await bcrypt.compare(
      String(password || ""),
      student.Password
    );
    return isMatch ? student : null;
  }
}

// Export a single instance
module.exports = new StudentRepository();
