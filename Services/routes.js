const express = require('express'); 
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const MongoDBConnection = require('../Model/database/connection');
const dbConnection = new MongoDBConnection();
dbConnection.connect().catch(console.error);

const router = express()

router.get('/login', (req, res) => {
    fs.readFile( __dirname + "login.ejs")
        .then(contents => {
            res.render(contents)
            res.writeHead(200);
            res.send(contents);
        }).catch(err => {
            res.writeHead(500);
            res.end(err);
            return;
        });
});

/*
    Email required -> client side
    Password required -> client side

    Email domain must be @belgiumcampus.ac.za -> server side
    Valid campus email and password -> server side
*/

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    //patterns for email validation
    const lecturer_pattern = /^[^\s@]+@belgiumcampus\.ac\.za$/;
    const student_pattern = /^[^\s@]+@student.belgiumcampus\.ac\.za$/;


    //Check if email matches either pattern amnd identify user type
    let role = null;
    if (lecturer_pattern.test(email)) {
        role = 'lecturer';
    } else if (student_pattern.test(email)) {
        role = 'student';
    } else {
        return res.status(400).send('Invalid email domain. Please use a @belgiumcampus.ac.za or @student.belgiumcampus.ac.za email.');
    }


    try {
        const db = dbConnection.getDb(); // Assumes getDb() returns the connected DB instance
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ email, role });

        if (!user) {
            return res.status(401).send('User not found or role mismatch.');
        }

        const isMatch = password === user.password;

        if (!isMatch) {
            return res.status(401).send('Incorrect password.');
        }

        // Redirect based on role
        if (role === 'lecturer') {
            return res.redirect('/lecturer-dashboard');
        } else {
            return res.redirect('/student-dashboard');
        }

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).send('Internal server error.');
    }

});

module.exports = router;