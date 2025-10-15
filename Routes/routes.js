const express = require('express'); 
const { loginUser } = require('../Controller/loginController');
const { renderChat, chatAPI } = require('../Controller/chatController');

const router = express.Router();

// Load Chatbot first (for testing)
router.get('/', renderChat);

// Chatbot routes
router.get('/chat', renderChat);
router.post('/api/chat', chatAPI);

// Existing auth routes (still accessible)
router.get('/login', (req, res) => res.render('login'));
router.post('/login', loginUser);
router.get('/forgot', (req, res) => res.render('forgotpassword'));

module.exports = router;
