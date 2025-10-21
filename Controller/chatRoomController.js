const Chatroom = require('../Model/Mongoose_Schema_models/chatroom');
const Message = require('../Model/Mongoose_Schema_models/Message');



exports.getActiveChatrooms = async (req, res) => {
  try {
    const chatrooms = await Chatroom.find({ participants: req.user._id });
    res.status(200).json(chatrooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chatroom: req.params.chatroomId })
      .populate('sender', 'name email') // optional: enrich with sender info
      .sort({ createdAt: 1 }); // chronological order
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const { chatroomId } = req.params;

    const chatroom = await Chatroom.findById(chatroomId);
    if (!chatroom || !chatroom.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Access denied to this chatroom' });
    }

    const message = new Message({
      chatroom: chatroomId,
      sender: req.user._id,
      body: content
    });

    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this message' });
    }

    await message.deleteOne();
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};