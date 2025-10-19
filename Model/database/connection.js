const { MongoClient } = require('mongodb');
const { StudentSchema } = require('../DatabaseSchemas/NormalTables/StudentSchema');

class MongoDBConnection {
  constructor() {
    this.client = null;
    this.db = null;
    this.isConnected = false;
    this.connectionString = process.env.MONGO_URL || 'mongodb://localhost:27017';
    this.dbName = process.env.DB_NAME || 'campusLearnDB';
  }

  async connect() {
    try {
      if (this.isConnected) {
        return this.db;
      }

      this.client = new MongoClient(this.connectionString, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
      });

      await this.client.connect();
      this.db = this.client.db(this.dbName);
      this.isConnected = true;

      console.log('✅ Student Service MongoDB connected successfully');
      
      await this.setupStudentCollection();
      return this.db;
    } catch (error) {
      console.error('❌ Student Service MongoDB connection failed:', error);
      throw error;
    }
  }

  async setupStudentCollection() {
    try {
      const db = this.getDatabase();
      
      const collections = await db.listCollections({ name: 'students' }).toArray();
      
      if (collections.length === 0) {
        await db.createCollection('students', {
          validator: StudentSchema
        });
        console.log('✅ Students collection created with schema validation');
      } else {
        await db.command({
          collMod: 'students',
          validator: StudentSchema
        });
        console.log('✅ Students collection updated with schema validation');
      }

      await this.createIndexes();
      
    } catch (error) {
      console.error('❌ Student collection setup failed:', error);
      throw error;
    }
  }

  async createIndexes() {
    try {
      const db = this.getDatabase();
      
      // Unique index on StudentID
      await db.collection('students').createIndex({ StudentID: 1 }, { unique: true });
      
      // Unique index on Email
      await db.collection('students').createIndex({ Email: 1 }, { unique: true });
      
      // Indexes for common queries
      await db.collection('students').createIndex({ Status: 1 });
      await db.collection('students').createIndex({ Online: 1 });
      await db.collection('students').createIndex({ DegreeID: 1 });
      await db.collection('students').createIndex({ CreatedAt: -1 });
      
      // Compound indexes
      await db.collection('students').createIndex({ Status: 1, Online: 1 });
      await db.collection('students').createIndex({ DegreeID: 1, Status: 1 });
      
      console.log('✅ Student service indexes created');
    } catch (error) {
      console.error('❌ Student index creation failed:', error);
    }
  }

  async disconnect() {
    try {
      if (this.client) {
        await this.client.close();
        this.isConnected = false;
        this.db = null;
        this.client = null;
        console.log('✅ Student Service MongoDB disconnected');
      }
    } catch (error) {
      console.error('❌ Student Service MongoDB disconnect error:', error);
      throw error;
    }
  }

  getDatabase() {
    if (!this.isConnected) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  getStatus() {
    return {
      service: 'student-service',
      isConnected: this.isConnected,
      dbName: this.dbName
    };
  }
}

module.exports = MongoDBConnection;