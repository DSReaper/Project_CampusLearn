const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chatroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatRoom",
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  body: {
    type: String,
    required: true
  },
  materialId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Material", // optional: if you have a material model
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Optional behaviors
messageSchema.methods.attachMaterial = function (materialId) {
  this.materialId = materialId;
  return this.save();
};

messageSchema.statics.displayMessages = async function (chatroomId) {
  return this.find({ chatroom: chatroomId }).sort({ createdAt: 1 });
};

module.exports = mongoose.model("Message", messageSchema);
