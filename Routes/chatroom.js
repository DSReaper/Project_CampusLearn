const express = require('express'); 
const chatroomRouter = express.Router();

//Chatroom imports
const {
  getActiveChatrooms,
  getMessages,
  sendMessage,
  deleteMessage
} = require('../Controller/chatroomController');

chatroomRouter.get('/api/chatroom', (req, res) => res.render('chatroom'));
chatroomRouter.get('/api/chatroom/active', getActiveChatrooms);
chatroomRouter.get('/api/chatroom/messages/:chatroomId', getMessages);
chatroomRouter.post('/api/chatroom/messages/:chatroomId', sendMessage);
chatroomRouter.delete('/api/chatroom/messages/:messageId', deleteMessage);

module.exports = {
  chatroomRouter
};