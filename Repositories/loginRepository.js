const MongoDBConnection = require('../Model/database/connection');

class StudentRepository {
  constructor() {
    this.dbConnection = new MongoDBConnection();
    this.collection = null;
  }

  async init() {
    if (!this.collection) {
      await this.dbConnection.connect();
      const db = this.dbConnection.getDatabase();
      this.collection = db.collection('students');
    }
  }

  // find student by email
  async findByEmail(email) {
    try {
      await this.init();
      const student = await this.collection.findOne({ Email: email });
      return student;
    } catch (error) {
      console.error('Error finding student by email:', error);
      throw error;
    }
  }
}

module.exports = new StudentRepository();
