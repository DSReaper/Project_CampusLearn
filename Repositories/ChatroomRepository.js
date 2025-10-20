"use strict";

const MongoDBConnection = require("../Model/database/connection.js");
const { ObjectId } = require("mongodb");

class ChatroomRepository extends IChatroomRepository {
  constructor() {
    this.connection = new MongoDBConnection();
    this.collectionName = "chatrooms";
  }

  async connect() {
    try {
      const db = await this.connection.connect();
      return db.collection(this.collectionName);
    } catch (error) {
      console.error("❌ ChatroomRepository connection failed:", error);
      throw error;
    }
  }

  async getAllChatrooms(userId = null) {
    let collection;
    try {
      collection = await this.connect();
      
      let query = {};
      
      // If userId is provided, show public rooms AND private rooms the user is member of
      if (userId) {
        const userObjectId = new ObjectId(userId);
        query = {
          $or: [
            { isPrivate: false }, // Public rooms
            { 
              isPrivate: true, 
              members: userObjectId // Private rooms user is member of
            }
          ]
        };
      }
      
      const chatrooms = await collection
        .find(query)
        .sort({ name: 1 })
        .toArray();

      console.log(`✅ Retrieved ${chatrooms.length} chatrooms`);
      return chatrooms;
    } catch (error) {
      console.error("❌ Error getting all chatrooms:", error);
      throw error;
    }
  }


  async getChatroomById(chatroomId, userId = null) {
    let collection;
    try {
      collection = await this.connect();
      
      const chatroomObjectId = new ObjectId(chatroomId);
      let query = { _id: chatroomObjectId };
      
      // If userId is provided, ensure user has access to private rooms
      if (userId) {
        const userObjectId = new ObjectId(userId);
        query = {
          _id: chatroomObjectId,
          $or: [
            { isPrivate: false }, // Public room
            { 
              isPrivate: true,
              members: userObjectId // User is member of private room
            }
          ]
        };
      }
      
      const chatroom = await collection.findOne(query);
      
      if (!chatroom) {
        throw new Error("Chatroom not found or access denied");
      }

      console.log(`✅ Retrieved chatroom: ${chatroom.name}`);
      return chatroom;
    } catch (error) {
      console.error("❌ Error getting chatroom by ID:", error);
      throw error;
    }
  }

  async getChatroomByName(chatroomName) {
    let collection;
    try {
      collection = await this.connect();
      
      const chatroom = await collection.findOne({ name: chatroomName });
      
      if (!chatroom) {
        throw new Error(`Chatroom '${chatroomName}' not found`);
      }

      console.log(`✅ Retrieved chatroom by name: ${chatroom.name}`);
      return chatroom;
    } catch (error) {
      console.error("❌ Error getting chatroom by name:", error);
      throw error;
    }
  }


  async getUserChatrooms(userId) {
    let collection;
    try {
      collection = await this.connect();
      
      const userObjectId = new ObjectId(userId);
      
      const chatrooms = await collection
        .find({ members: userObjectId })
        .sort({ name: 1 })
        .toArray();

      console.log(`✅ Retrieved ${chatrooms.length} chatrooms for user ${userId}`);
      return chatrooms;
    } catch (error) {
      console.error("❌ Error getting user chatrooms:", error);
      throw error;
    }
  }


  async isUserMember(chatroomId, userId) {
    let collection;
    try {
      collection = await this.connect();
      
      const chatroomObjectId = new ObjectId(chatroomId);
      const userObjectId = new ObjectId(userId);
      
      const chatroom = await collection.findOne({
        _id: chatroomObjectId,
        members: userObjectId
      });

      return !!chatroom;
    } catch (error) {
      console.error("❌ Error checking user membership:", error);
      throw error;
    }
  }


  async joinChatroom(chatroomId, userId) {
    let collection;
    try {
      collection = await this.connect();
      
      const chatroomObjectId = new ObjectId(chatroomId);
      const userObjectId = new ObjectId(userId);
      
      // First check if chatroom exists and isn't full
      const chatroom = await collection.findOne({ _id: chatroomObjectId });
      if (!chatroom) {
        throw new Error("Chatroom not found");
      }
      
      if (chatroom.members.length >= chatroom.maxMembers) {
        throw new Error("Chatroom is full");
      }
      
      // Check if user is already a member
      if (chatroom.members.some(member => member.equals(userObjectId))) {
        throw new Error("User is already a member of this chatroom");
      }
      
      const result = await collection.updateOne(
        { _id: chatroomObjectId },
        { 
          $addToSet: { members: userObjectId },
          $set: { updatedAt: new Date() }
        }
      );

      if (result.modifiedCount === 0) {
        throw new Error("Failed to join chatroom");
      }

      console.log(`✅ User ${userId} joined chatroom ${chatroomId}`);
      return result;
    } catch (error) {
      console.error("❌ Error joining chatroom:", error);
      throw error;
    }
  }


  async leaveChatroom(chatroomId, userId) {
    let collection;
    try {
      collection = await this.connect();
      
      const chatroomObjectId = new ObjectId(chatroomId);
      const userObjectId = new ObjectId(userId);
      
      const result = await collection.updateOne(
        { _id: chatroomObjectId },
        { 
          $pull: { members: userObjectId },
          $set: { updatedAt: new Date() }
        }
      );

      if (result.modifiedCount === 0) {
        throw new Error("Failed to leave chatroom or user was not a member");
      }

      console.log(`✅ User ${userId} left chatroom ${chatroomId}`);
      return result;
    } catch (error) {
      console.error("❌ Error leaving chatroom:", error);
      throw error;
    }
  }


  async createChatroom(chatroomData) {
    let collection;
    try {
      collection = await this.connect();
      
      // Set timestamps
      const now = new Date();
      const chatroom = {
        ...chatroomData,
        createdAt: now,
        updatedAt: now
      };
      
      // Ensure creator is in members
      if (!chatroom.members || !Array.isArray(chatroom.members)) {
        chatroom.members = [chatroom.createdBy];
      } else if (!chatroom.members.some(member => member.equals(chatroom.createdBy))) {
        chatroom.members.push(chatroom.createdBy);
      }
      
      const result = await collection.insertOne(chatroom);
      
      console.log(`✅ Created new chatroom: ${chatroom.name}`);
      return { ...chatroom, _id: result.insertedId };
    } catch (error) {
      console.error("❌ Error creating chatroom:", error);
      throw error;
    }
  }


  async searchChatrooms(searchTerm, userId = null) {
    let collection;
    try {
      collection = await this.connect();
      
      let query = {
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } }
        ]
      };
      
      // Apply access control if userId provided
      if (userId) {
        const userObjectId = new ObjectId(userId);
        query = {
          $and: [
            query,
            {
              $or: [
                { isPrivate: false },
                { 
                  isPrivate: true,
                  members: userObjectId
                }
              ]
            }
          ]
        };
      }
      
      const chatrooms = await collection
        .find(query)
        .sort({ name: 1 })
        .toArray();

      console.log(`✅ Found ${chatrooms.length} chatrooms matching '${searchTerm}'`);
      return chatrooms;
    } catch (error) {
      console.error("❌ Error searching chatrooms:", error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.connection.disconnect();
    } catch (error) {
      console.error("❌ Error disconnecting repository:", error);
    }
  }
}

module.exports = ChatroomRepository;