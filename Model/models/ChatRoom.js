class ChatRoom {
    #chatRoomId;
    #title;
    #description;
    #createdByTutorId;
    #moduleId;

    constructor({ chatRoomId = 0, title = "", description = "", createdByTutorId = 0, moduleId = 0 } = {}) {
        this.#chatRoomId = chatRoomId;
        this.#title = title;
        this.#description = description;
        this.#createdByTutorId = createdByTutorId;
        this.#moduleId = moduleId;
    }

    // Behaviors
    createMessage(body) {}
    addParticipant(studentId) {}

    // Getters/Setters
    get chatRoomId() { return this.#chatRoomId; }
    set chatRoomId(chatRoomId) { this.#chatRoomId = chatRoomId; }

    get title() { return this.#title; }
    set title(title) { this.#title = title; }

    get description() { return this.#description; }
    set description(description) { this.#description = description; }

    get createdByTutorId() { return this.#createdByTutorId; }
    set createdByTutorId(createdByTutorId) { this.#createdByTutorId = createdByTutorId; }

    get moduleId() { return this.#moduleId; }
    set moduleId(moduleId) { this.#moduleId = moduleId; }
}

module.exports = ChatRoom;
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
