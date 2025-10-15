const express = require('express'); 

const MongoDBConnection = require('../Model/database/connection');
const dbConnection = new MongoDBConnection();
dbConnection.connect().catch(console.error);

const { login } = require('../Services/loginController');

const router = express().Router();

app.get('/', (_, res) => res.render('login'));
router.get('/login', (req, res) => res.render(contents));


router.post('/login', login);

app.get('/forgot', (req, res) => res.render('forgotpassword'));

module.exports = router;