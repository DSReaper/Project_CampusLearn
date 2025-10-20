const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  notificationID: {
    type: Number,
    default: 0
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  lecturerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["email", "push"],
    default: "email"
  },
  isRead: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

notificationSchema.methods.sendEmailNotification = function () {
  // Implement email logic here
  console.log(`Email sent to user ${this.userID} from lecturer ${this.lecturerID}: ${this.message}`);
};

notificationSchema.methods.triggerPushNotification = function () {
  // Implement push logic here
  console.log(`Push notification triggered for user ${this.userID}: ${this.message}`);
};

module.exports = mongoose.model("Notification", notificationSchema);