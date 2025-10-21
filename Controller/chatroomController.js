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
  try {
    const chatroomId = req.params.chatroomId; // make sure this matches your route
    const userId = req.user?._id; // or req.user?.id

    if (!chatroomId) {
      return res.status(400).json({ success: false, message: "Chatroom ID is required." });
    }

    const chatroom = await Chatroom.findById(chatroomId); // import Chatroom model at top
    if (!chatroom) {
      return res.status(404).json({ success: false, message: "Chatroom not found." });
    }

    // Add user to members if not already
    if (!chatroom.members.includes(userId)) {
      chatroom.members.push(userId);
      await chatroom.save();
    }

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
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
      console.log("Logged-in user:", userId);
      const response = await this.chatroomService.getAllChatrooms(userId);
      console.log(" ChatroomService response:", response);

      const chatrooms = response.success ? response.data : [];
      console.log("Chatrooms passed to EJS:", chatrooms);

      res.render("studentDashboard", { chatrooms });
    } catch (error) {
      console.error("Error fetching chatrooms:", error);
      res.render("studentDashboard", { chatrooms: [] });
    }
  }

  async searchChatrooms(req, res) {
    try {
      const searchTerm = req.query.q || "";
      const userId = req.user?.id || null;

      console.log(`🔍 Controller: Searching for chatrooms with term "${searchTerm}"`);

      const response = await this.chatroomService.searchChatrooms(searchTerm, userId);

      if (response.success) {
        res.json(response.data);
      } else {
        res.status(400).json({ error: response.error || "No results found" });
      }
    } catch (error) {
      console.error("❌ Controller: Error in searchChatrooms:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }


}

module.exports = new ChatroomController();
