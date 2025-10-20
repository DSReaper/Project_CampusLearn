const { MongoClient } = require('mongodb');
const { StudentSchema } = require('../DatabaseSchemas/NormalTables/StudentSchema');
const { ChatroomSchema } = require('../DatabaseSchemas/NormalTables/ChatRoomsChatSchema');

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
      await this.setupChatroomCollection();
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

  async setupChatroomCollection() {
    try {
      const db = this.getDatabase();
      
      const collections = await db.listCollections({ name: 'chatrooms' }).toArray();
      
      if (collections.length === 0) {
        await db.createCollection('chatrooms', {
          validator: ChatroomSchema
        });
        console.log('✅ Chatrooms collection created with schema validation');
      } else {
        await db.command({
          collMod: 'chatrooms',
          validator: ChatroomSchema
        });
        console.log('✅ Chatrooms collection updated with schema validation');
      }

      await this.createChatroomIndexes();
      
    } catch (error) {
      console.error('❌ Chatroom collection setup failed:', error);
      throw error;
    }
  }


  async createStudentIndexes() {
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

  async createChatroomIndexes() {
    try {
      const db = this.getDatabase();
      
      // Unique index on name
      await db.collection('chatrooms').createIndex({ name: 1 }, { unique: true });
      console.log('✅ Created unique index on chatroom name');
      
      // Index on createdBy for faster queries
      await db.collection('chatrooms').createIndex({ createdBy: 1 });
      console.log('✅ Created index on createdBy');
      
      // Index on members for membership queries
      await db.collection('chatrooms').createIndex({ members: 1 });
      console.log('✅ Created index on members');
      
      // Index on isPrivate for filtering
      await db.collection('chatrooms').createIndex({ isPrivate: 1 });
      console.log('✅ Created index on isPrivate');
      
      // Compound index for common queries
      await db.collection('chatrooms').createIndex({ isPrivate: 1, members: 1 });
      console.log('✅ Created compound index on isPrivate and members');
      
      // Index for createdAt for sorting
      await db.collection('chatrooms').createIndex({ createdAt: -1 });
      console.log('✅ Created index on createdAt');
      
    } catch (error) {
      console.error('❌ Chatroom index creation failed:', error);
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