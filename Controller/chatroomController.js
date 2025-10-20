const ChatroomService = require("../Services/ChatroomService.js");

class ChatroomController {
  constructor() {
    this.chatroomService = new ChatroomService();
  }

  async getAllChatrooms(req, res) {
    const userId = req.user?.id; 
    const response = await this.chatroomService.getAllChatrooms(userId);
    res.json(response);
  }

  async getChatroom(req, res) {
    const userId = req.user?.id;
    const { chatroomId } = req.params;
    const response = await this.chatroomService.getChatroom(chatroomId, userId);
    res.json(response);
  }

  async createChatroom(req, res) {
    const userId = req.user?.id;
    const chatroomData = req.body;
    const response = await this.chatroomService.createChatroom(chatroomData, userId);
    res.json(response);
  }

  async joinChatroom(req, res) {
    const userId = req.user?.id;
    const { chatroomId } = req.params;
    const response = await this.chatroomService.joinChatroom(chatroomId, userId);
    res.json(response);
  }

  async leaveChatroom(req, res) {
    const userId = req.user?.id;
    const { chatroomId } = req.params;
    const response = await this.chatroomService.leaveChatroom(chatroomId, userId);
    res.json(response);
  }

  async getUserChatrooms(req, res) {
    const userId = req.user?.id;
    const response = await this.chatroomService.getUserChatrooms(userId);
    res.json(response);
  }

  async renderDashboard(req, res) {
    try {
      const userId = req.user?.id;
      const response = await this.chatroomService.getAllChatrooms(userId);
      const chatrooms = response.success ? response.data : [];
      res.render('studentDashboard', { chatrooms });
    } catch (error) {
      console.error('Error fetching chatrooms:', error);
      res.render('studentDashboard', { chatrooms: [] });
    }
  }

}

module.exports = new ChatroomController();
