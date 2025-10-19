const IStudentRepository=require('./IStudentRepository')
const MongoDBConnection = require('../Model/database/connection');

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
      this.collection = db.collection('Student');
    }
  }


  // find student by email and password
  async findByEmailAndPassword(email, password) {
    try {
      await this.init();
      const student = await this.collection.findOne({ Email: email, Password: password });
      return student;
    } catch (error) {
      console.error('Error finding student by email and password:', error);
      throw error;
    }
  }
}

module.exports = new StudentRepository();
