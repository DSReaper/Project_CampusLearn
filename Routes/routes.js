const express = require('express'); 
const { loginUser } = require('../Controller/loginController');
const { renderChat, chatAPI } = require('../Controller/chatController');
const { resetPasswordController } = require('../Controller/resetPasswordController');

const router = express.Router();

// Default route — show login page first
router.get('/', (req, res) => res.render('login'));

// Auth routes
router.get('/login', (req, res) => res.render('login'));
router.post('/login', loginUser);
router.get("/forgot", (req, res) => res.render("forgotpassword"));
router.post("/reset-password", resetPasswordController);


// Dashboard routes
router.get('/student/dashboard', (req, res) => res.render('studentDashboard'));
router.get('/profile/settings', (req, res) => res.render('profileSettings'));
router.get("/tutor/dashboard", (req, res) => res.render("tutorDashboard"));

// Chatbot routes
router.get('/chat', renderChat);
router.post('/api/chat', chatAPI);

module.exports = router;
