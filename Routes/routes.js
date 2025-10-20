const express = require('express'); 
const { loginUser } = require('../Controller/loginController');
const { renderChat, chatAPI } = require('../Controller/chatController');
const { resetPasswordController } = require('../Controller/resetPasswordController');
const chatroomController = require('../Controller/chatroomController.js');

const router = express.Router();

// Default route — show login page first
router.get('/', (req, res) => res.render('login'));

// Auth routes
router.get('/login', (req, res) => res.render('login'));
router.post('/login', loginUser);
router.get("/forgot", (req, res) => res.render("forgotpassword"));
router.post("/reset-password", resetPasswordController);


// Dashboard routes
// router.get('/student/dashboard', (req, res) => res.render('studentDashboard'));
router.get(
  '/student/dashboard',
  chatroomController.renderDashboard.bind(chatroomController)
);
router.get('/profile/settings', (req, res) => res.render('profileSettings'));
router.get("/tutor/dashboard", (req, res) => res.render("tutorDashboard"));

// get chatrooms for a loggedin user
// router.get('/student/dashboard', async (req, res) => {
//   const chatrooms = await chatController.getUserChatrooms(req.session.userId);
//     res.render('studentDashboard', { chatrooms })
// });

// Chatbot routes
router.get('/chat', renderChat);
router.post('/api/chat', chatAPI);

//chatroom routes
// get a  chatroom by id
router.get('/chatroom/:chatroomId', async (req, res) => {
  const { chatroomId } = req.params;
  const response = await chatroomController.getChatroom({ params: { chatroomId }, session: req.session });
  res.render('chatroom', { chatroom: response.data });
});

// create a chatroom (tutors)
router.post('/chatrooms', async (req, res) => {
  const chatroomData = req.body;
  const response = await chatroomController.createChatroom({ body: chatroomData, session: req.session });
  res.json(response); // 
});

// join chatroom (students)
router.post('/chatrooms/:chatroomId/join', async (req, res) => {
  const { chatroomId } = req.params;
  const response = await chatroomController.joinChatroom({ params: { chatroomId }, session: req.session });
  res.json(response); // 
});

// leave a chatroom
router.post('/chatrooms/:chatroomId/leave', async (req, res) => {
  const { chatroomId } = req.params;
  const response = await chatroomController.leaveChatroom({ params: { chatroomId }, session: req.session });
  res.json(response); // 
});


module.exports = router;
