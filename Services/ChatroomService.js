"use strict";

const ChatroomRepository = require("../Repositories/ChatroomRepository.js");

class ChatroomService {
  constructor() {
    this.chatroomRepository = new ChatroomRepository();
  }


  async getAllChatrooms(userId = null) {
    try {
      console.log(`🔄 ChatroomService: Getting all chatrooms for user ${userId || 'anonymous'}`);
      
      const chatrooms = await this.chatroomRepository.getAllChatrooms(userId);
      
      // Transform data for frontend if needed
      const transformedChatrooms = chatrooms.map(chatroom => ({
        id: chatroom._id,
        name: chatroom.name,
        description: chatroom.description,
        isPrivate: chatroom.isPrivate,
        memberCount: chatroom.members.length,
        maxMembers: chatroom.maxMembers,
        createdAt: chatroom.createdAt,
        canJoin: userId ? !chatroom.members.some(member => member.toString() === userId) && chatroom.members.length < chatroom.maxMembers : false
      }));

      return {
        success: true,
        data: transformedChatrooms,
        count: transformedChatrooms.length,
        message: `Found ${transformedChatrooms.length} chatrooms`
      };
    } catch (error) {
      console.error("❌ ChatroomService: Error getting all chatrooms:", error);
      return {
        success: false,
        error: error.message,
        data: [],
        count: 0
      };
    } finally {
      await this.chatroomRepository.disconnect();
    }
  }


  async getChatroom(chatroomId, userId = null) {
    try {
      console.log(`🔄 ChatroomService: Getting chatroom ${chatroomId} for user ${userId || 'anonymous'}`);
      
      const chatroom = await this.chatroomRepository.getChatroomById(chatroomId, userId);
      
      if (!chatroom) {
        return {
          success: false,
          error: "Chatroom not found or access denied",
          data: null
        };
      }

      // Transform data for frontend
      const transformedChatroom = {
        id: chatroom._id,
        name: chatroom.name,
        description: chatroom.description,
        isPrivate: chatroom.isPrivate,
        members: chatroom.members,
        memberCount: chatroom.members.length,
        maxMembers: chatroom.maxMembers,
        createdBy: chatroom.createdBy,
        createdAt: chatroom.createdAt,
        updatedAt: chatroom.updatedAt,
        isMember: userId ? chatroom.members.some(member => member.toString() === userId) : false
      };

      return {
        success: true,
        data: transformedChatroom,
        message: `Retrieved chatroom: ${chatroom.name}`
      };
    } catch (error) {
      console.error("❌ ChatroomService: Error getting chatroom:", error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    } finally {
      await this.chatroomRepository.disconnect();
    }
  }


  async createChatroom(chatroomData, userId) {
    try {
      console.log(`🔄 ChatroomService: Creating new chatroom for user ${userId}`);
      
      if (!userId) {
        return {
          success: false,
          error: "User must be authenticated to create chatrooms"
        };
      }

      // Validate required fields
      if (!chatroomData.name || !chatroomData.description) {
        return {
          success: false,
          error: "Chatroom name and description are required"
        };
      }

      // Prepare chatroom data
      const newChatroom = {
        name: chatroomData.name.trim(),
        description: chatroomData.description.trim(),
        createdBy: userId,
        isPrivate: chatroomData.isPrivate || false,
        maxMembers: chatroomData.maxMembers || 50,
        members: [userId] // Creator is automatically a member
      };

      const createdChatroom = await this.chatroomRepository.createChatroom(newChatroom);
      
      // Transform response
      const transformedChatroom = {
        id: createdChatroom._id,
        name: createdChatroom.name,
        description: createdChatroom.description,
        isPrivate: createdChatroom.isPrivate,
        memberCount: createdChatroom.members.length,
        maxMembers: createdChatroom.maxMembers,
        createdAt: createdChatroom.createdAt
      };

      return {
        success: true,
        data: transformedChatroom,
        message: `Successfully created chatroom: ${createdChatroom.name}`
      };
    } catch (error) {
      console.error("❌ ChatroomService: Error creating chatroom:", error);
      
      // Handle duplicate name error
      if (error.code === 11000 || error.message.includes('duplicate')) {
        return {
          success: false,
          error: "A chatroom with this name already exists"
        };
      }
      
      return {
        success: false,
        error: error.message
      };
    } finally {
      await this.chatroomRepository.disconnect();
    }
  }


  async joinChatroom(chatroomId, userId) {
    try {
      console.log(`🔄 ChatroomService: User ${userId} joining chatroom ${chatroomId}`);
      
      if (!userId) {
        return {
          success: false,
          error: "User must be authenticated to join chatrooms"
        };
      }

      // First check if user can access the chatroom
      const chatroom = await this.chatroomRepository.getChatroomById(chatroomId, userId);
      if (!chatroom) {
        return {
          success: false,
          error: "Chatroom not found or access denied"
        };
      }

      // Check if user is already a member
      const isMember = await this.chatroomRepository.isUserMember(chatroomId, userId);
      if (isMember) {
        return {
          success: false,
          error: "You are already a member of this chatroom"
        };
      }

      // Check if chatroom is full
      if (chatroom.members.length >= chatroom.maxMembers) {
        return {
          success: false,
          error: "This chatroom is full"
        };
      }

      // Join the chatroom
      await this.chatroomRepository.joinChatroom(chatroomId, userId);

      return {
        success: true,
        message: `Successfully joined ${chatroom.name}`,
        data: {
          chatroomId: chatroomId,
          chatroomName: chatroom.name
        }
      };
    } catch (error) {
      console.error("❌ ChatroomService: Error joining chatroom:", error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      await this.chatroomRepository.disconnect();
    }
  }


  async leaveChatroom(chatroomId, userId) {
    try {
      console.log(`🔄 ChatroomService: User ${userId} leaving chatroom ${chatroomId}`);
      
      if (!userId) {
        return {
          success: false,
          error: "User must be authenticated to leave chatrooms"
        };
      }

      // Check if user is a member
      const isMember = await this.chatroomRepository.isUserMember(chatroomId, userId);
      if (!isMember) {
        return {
          success: false,
          error: "You are not a member of this chatroom"
        };
      }

      // Get chatroom info before leaving
      const chatroom = await this.chatroomRepository.getChatroomById(chatroomId);
      
      // Leave the chatroom
      await this.chatroomRepository.leaveChatroom(chatroomId, userId);

      return {
        success: true,
        message: `Successfully left ${chatroom.name}`,
        data: {
          chatroomId: chatroomId,
          chatroomName: chatroom.name
        }
      };
    } catch (error) {
      console.error("❌ ChatroomService: Error leaving chatroom:", error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      await this.chatroomRepository.disconnect();
    }
  }


  async getUserChatrooms(userId) {
    try {
      console.log(`🔄 ChatroomService: Getting chatrooms for user ${userId}`);
      
      if (!userId) {
        return {
          success: false,
          error: "User ID is required",
          data: [],
          count: 0
        };
      }

      const chatrooms = await this.chatroomRepository.getUserChatrooms(userId);
      
      // Transform data for frontend
      const transformedChatrooms = chatrooms.map(chatroom => ({
        id: chatroom._id,
        name: chatroom.name,
        description: chatroom.description,
        isPrivate: chatroom.isPrivate,
        memberCount: chatroom.members.length,
        maxMembers: chatroom.maxMembers,
        createdAt: chatroom.createdAt,
        isOwner: chatroom.createdBy.toString() === userId
      }));

      return {
        success: true,
        data: transformedChatrooms,
        count: transformedChatrooms.length,
        message: `Found ${transformedChatrooms.length} chatrooms you're a member of`
      };
    } catch (error) {
      console.error("❌ ChatroomService: Error getting user chatrooms:", error);
      return {
        success: false,
        error: error.message,
        data: [],
        count: 0
      };
    } finally {
      await this.chatroomRepository.disconnect();
    }
  }


  async searchChatrooms(searchTerm, userId = null) {
    try {
      console.log(`🔄 ChatroomService: Searching chatrooms for '${searchTerm}'`);
      
      if (!searchTerm || searchTerm.trim().length < 2) {
        return {
          success: false,
          error: "Search term must be at least 2 characters long",
          data: [],
          count: 0
        };
      }

      const chatrooms = await this.chatroomRepository.searchChatrooms(searchTerm.trim(), userId);
      
      // Transform data for frontend
      const transformedChatrooms = chatrooms.map(chatroom => ({
        id: chatroom._id,
        name: chatroom.name,
        description: chatroom.description,
        isPrivate: chatroom.isPrivate,
        memberCount: chatroom.members.length,
        maxMembers: chatroom.maxMembers,
        createdAt: chatroom.createdAt,
        canJoin: userId ? !chatroom.members.some(member => member.toString() === userId) && chatroom.members.length < chatroom.maxMembers : false
      }));

      return {
        success: true,
        data: transformedChatrooms,
        count: transformedChatrooms.length,
        message: `Found ${transformedChatrooms.length} chatrooms matching '${searchTerm}'`
      };
    } catch (error) {
      console.error("❌ ChatroomService: Error searching chatrooms:", error);
      return {
        success: false,
        error: error.message,
        data: [],
        count: 0
      };
    } finally {
      await this.chatroomRepository.disconnect();
    }
  }


  async checkChatroomAccess(chatroomId, userId) {
    try {
      console.log(`🔄 ChatroomService: Checking access for user ${userId} to chatroom ${chatroomId}`);
      
      const chatroom = await this.chatroomRepository.getChatroomById(chatroomId, userId);
      
      if (!chatroom) {
        return {
          success: false,
          error: "Access denied or chatroom not found",
          hasAccess: false
        };
      }

      const isMember = await this.chatroomRepository.isUserMember(chatroomId, userId);
      
      return {
        success: true,
        hasAccess: true,
        isMember: isMember,
        data: {
          id: chatroom._id,
          name: chatroom.name,
          isPrivate: chatroom.isPrivate
        }
      };
    } catch (error) {
      console.error("❌ ChatroomService: Error checking chatroom access:", error);
      return {
        success: false,
        error: error.message,
        hasAccess: false
      };
    } finally {
      await this.chatroomRepository.disconnect();
    }
  }
}

module.exports = ChatroomService;