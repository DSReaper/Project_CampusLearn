const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  createdByTutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module",
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Behavior: Add participant
chatRoomSchema.methods.addParticipant = async function (studentId) {
  if (!this.participants.includes(studentId)) {
    this.participants.push(studentId);
    await this.save();
  }
};

// Behavior: Create message
chatRoomSchema.methods.createMessage = async function (body, senderId) {
  const Message = mongoose.model("Message");
  const message = new Message({
    chatroom: this._id,
    sender: senderId,
    content: body
  });
  await message.save();
  return message;
};

module.exports = mongoose.model("ChatRoom", chatRoomSchema);