const express = require('express'); 
const { loginUser } = require('../Controller/loginController');
const { renderChat, chatAPI } = require('../Controller/chatController');
const { resetPasswordController } = require('../Controller/resetPasswordController');
const chatroomController = require('../Controller/chatroomController.js');
const authMiddleware = require('../Middleware/auth.js');

const router = express.Router();

// Default route — show login page first
router.get('/', (req, res) => res.render('login'));

// Auth routes
router.get('/login', (req, res) => res.render('login'));
router.post('/login', loginUser);
router.get("/forgot", (req, res) => res.render("forgotpassword"));
router.post("/reset-password", resetPasswordController);


// Dashboard routes
router.get(
  '/student/dashboard', authMiddleware,
  chatroomController.renderDashboard.bind(chatroomController)
);
router.get('/profile/settings', authMiddleware, (req, res) => res.render('profileSettings'));
router.get("/tutor/dashboard", authMiddleware, (req, res) => res.render("tutorDashboard"));

//search a chatroom 
router.get('/chatroom/search', chatroomController.searchChatrooms.bind(chatroomController));


// get chatrooms for a loggedin user
// router.get('/student/dashboard', async (req, res) => {
//   const chatrooms = await chatController.getUserChatrooms(req.session.userId);
//     res.render('studentDashboard', { chatrooms })
// });

// Chatbot routes
router.get('/chat', renderChat);
router.post('/api/chat', chatAPI);

//get chatrooms
router.get('/chatroom', async (req, res) => {
  try {
    const userId = req.session?.user?._id || req.session?.userId || null;
    const response = await chatroomController.chatroomService.getAllChatrooms(userId);

    // Send only array of chatrooms for frontend
    res.json(response.data || []);
  } catch (error) {
    console.error("Error fetching chatrooms:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// get a  chatroom by id
router.get('/chatroom/:chatroomId', authMiddleware, async (req, res) => {
  const { chatroomId } = req.params;
  const response = await chatroomController.getChatroom({ params: { chatroomId }, session: req.session });
  res.render('chatroom', { chatroom: response.data });
});

// create a chatroom (tutors)
router.post('/chatroomCreate', authMiddleware, async (req, res) => {
  const chatroomData = req.body;
  const response = await chatroomController.createChatroom({ body: chatroomData, session: req.session });
  res.json(response); // 
});


// join chatroom (students)
router.post('/chatroom/:chatroomId/join', async (req, res) => {
  chatroomController.joinChatroom(req, res);
});

// leave a chatroom
router.post('/chatroom/:chatroomId/leave', async (req, res) => {
  const { chatroomId } = req.params;
  const response = await chatroomController.leaveChatroom({ params: { chatroomId }, session: req.session });
  res.json(response); // 
});

router.get('/check-session', (req, res) => {
  res.json({
    session: req.session,
    user: req.user,
    sessionId: req.sessionID
  });
});

module.exports = router;
