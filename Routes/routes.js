const express = require('express'); 
const {login} = require('../Controllers/loginController');

const router = express.Router();

router.get('/', (_, res) => res.render('login'));

router.get('/login', (req, res) => res.render('login'));

router.post('/login', login);

router.get('/forgot', (req, res) => res.render('forgotpassword'));

module.exports = router;
