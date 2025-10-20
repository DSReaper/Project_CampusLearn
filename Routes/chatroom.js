const express = require('express'); 
const chatroomRouter = express.Router();
const auth = require('../MiddleWare/JWTAuth');

//Chatroom imports
const {
  getActiveChatrooms,
  getMessages,
  sendMessage,
  deleteMessage
} = require('../Controller/chatroomController');

chatroomRouter.get('/api/chatroom', (req, res) => res.render('chatroom'));
chatroomRouter.get('/api/chatroom/active', auth, getActiveChatrooms);
chatroomRouter.get('/api/chatroom/messages/:chatroomId', auth, getMessages);
chatroomRouter.post('/api/chatroom/messages/:chatroomId', auth, sendMessage);
chatroomRouter.delete('/api/chatroom/messages/:messageId', auth, deleteMessage);

module.exports = {
  chatroomRouter
};