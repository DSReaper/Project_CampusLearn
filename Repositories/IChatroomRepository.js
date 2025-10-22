class IChatroomRepository {
  constructor() {
    
  }

  async connect() {
    
  }

  async getAllChatrooms(userId = null) {
    
  }


  async getChatroomById(chatroomId, userId = null) {
    
  }

  async getChatroomByName(chatroomName) {
    
  }


  async getUserChatrooms(userId) {
    
  }


  async isUserMember(chatroomId, userId) {

  }


  async joinChatroom(chatroomId, userId) {
    
  }


  async leaveChatroom(chatroomId, userId) {
    
  }


  async createChatroom(chatroomData) {
    
  }


  async searchChatrooms(searchTerm, userId = null) {
    
  }

  async disconnect() {
  }
  async getMessagesByChatroom(chatroomId) {}
  
  async addMessage({ chatroomId, userId, body, createdAt }) {}
}

module.exports = IChatroomRepository;