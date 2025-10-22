const { ObjectId } = require("mongodb");
const ChatroomService = require("../Services/ChatroomService.js");
const MongoDBConnection = require("../Model/database/connection.js");
const { session, use } = require("passport");


class ChatroomController {
  constructor() {
    this.chatroomService = new ChatroomService();
    this.conn = new MongoDBConnection();

    this.sendMessage = this.sendMessage.bind(this);
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
    let client;
    try {
      
      const chatroomId = req.params.chatroomId;
      const userId = req.user?._id || req.user?.id || req.session?.userId || req.session?.user?._id || req.session?.user?.id;

      console.log(`User ${userId} is attempting to join chatroom ${chatroomId} in controller.`);
      console.log("Session data:", req.session);
      console.log("User data from req.user:", req.user);

      if (!chatroomId || chatroomId === undefined || chatroomId === null) {
        return res.status(400).json({ success: false, message: "Chatroom ID is required." + chatroomId });
      }

      if (!userId || userId === undefined || userId === null) {
        return res.status(401).json({ success: false, message: "User must be logged in to join a chatroom.", debug : {session: req.session, user: req.user} });
      }

      client = await this.conn.connect();
      const db = this.conn.getDatabase();
      const chatroomsCol = db.collection("chatrooms");

      const chatroom = await chatroomsCol.findOne({ _id: new ObjectId(chatroomId) });
      if (!chatroom) {
        return res.status(404).json({ success: false, message: "Chatroom not found." });
      }

      // Add user to members if not already
      const isMember = chatroom.members.some(memberId => memberId.toString() === userId.toString());
      if (!isMember) {
        await chatroomsCol.updateOne(
          { _id: new ObjectId(chatroomId) },
          { $push: { members: new ObjectId(userId) } }
        );
      }

      return res.json({ success: true });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Server error." });
    } finally {
      try {
        await this.conn.disconnect();
      } catch {}
    }
  }async joinChatroom(req, res) {
  let client;
  try {
    const chatroomId = req.params.chatroomId;
    const userId = req.session.user?._id; // Use session user

    console.log(`🔄 Join Chatroom - ChatroomID: ${chatroomId}, UserID: ${userId}`);
    console.log('Session data:', req.session);

    if (!chatroomId) {
      return res.status(400).json({ success: false, message: "Chatroom ID is required." });
    }

    if (!userId) {
      return res.status(401).json({ success: false, message: "User must be authenticated." });
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(chatroomId)) {
      return res.status(400).json({ success: false, message: "Invalid Chatroom ID format." });
    }

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid User ID format." });
    }

    client = await this.conn.connect();
    const db = this.conn.getDatabase();
    const chatroomsCol = db.collection("chatrooms");

    const chatroom = await chatroomsCol.findOne({ _id: new ObjectId(chatroomId) });
    if (!chatroom) {
      return res.status(404).json({ success: false, message: "Chatroom not found." });
    }

    // Add user to members if not already
    const isMember = chatroom.members.some(memberId => memberId.toString() === userId.toString());
    if (!isMember) {
      await chatroomsCol.updateOne(
        { _id: new ObjectId(chatroomId) },
        { 
          $push: { members: new ObjectId(userId) },
          $set: { updatedAt: new Date() }
        }
      );
      console.log(`User ${userId} joined chatroom ${chatroomId}`);
    } else {
      console.log(`ℹUser ${userId} is already a member of chatroom ${chatroomId}`);
    }

    return res.json({ 
      success: true, 
      message: "Successfully joined chatroom",
      data: {
        chatroomId: chatroomId,
        chatroomName: chatroom.name
      }
    });

  } catch (err) {
    console.error("Error in joinChatroom:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  } finally {
    try {
      if (this.conn) {
        await this.conn.disconnect();
      }
    } catch (disconnectError) {
      console.error("Error disconnecting:", disconnectError);
    }
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

      console.log(`Controller: Searching for chatrooms with term "${searchTerm}"`);

      const response = await this.chatroomService.searchChatrooms(searchTerm, userId);

      if (response.success) {
        res.json(response.data);
      } else {
        res.status(400).json({ error: response.error || "No results found" });
      }
    } catch (error) {
      console.error("Controller: Error in searchChatrooms:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  
 async renderChatroom(req, res) {
  const chatroomId = req.params.chatroomId;
  const userId = req.session.user._id;

  console.log("🔹 renderChatroom called:", { chatroomId, userId });

  try {
    const result = await this.chatroomService.getChatroomWithMessages(chatroomId, userId);

    if (!result.success) {
      return res.status(404).send(result.error);
    }

    res.render("chatroom", {
      chatroom: result.data,
      messages: result.data.messages,
      userId
    });
  } catch (error) {
    console.error("Error rendering chatroom:", error);
    res.status(500).send("Internal server error");
  }
}

  async sendMessage(req, res) {
      const { chatroomId } = req.params;
      const { body } = req.body;
      const userId = req.session.user?._id;

      if (!chatroomId || !body?.trim()) {
          return res.status(400).json({ success: false, message: "Chatroom ID and message required" });
      }
      if (!userId) {
          return res.status(401).json({ success: false, message: "Login required" });
      }

      try {
          const result = await this.chatroomService.sendMessage(chatroomId, userId, body);
          res.json(result);
      } catch (error) {
          console.error("Error sending message:", error);
          res.status(500).json({ success: false, error: error.message });
      }
  }

}


module.exports = new ChatroomController();
