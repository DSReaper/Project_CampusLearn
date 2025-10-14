const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const db = require('./Model/database/connection');
db.connect();


const app = express();
const PORT = process.env.PORT || 3001;

// Views (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'View', 'view', 'pages'));

app.use(express.static(path.join(__dirname, 'View')));
app.use('/audio', express.static(path.join(__dirname, 'View', 'audio')));
app.use('/icons', express.static(path.join(__dirname, 'View', 'icons')));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true })); 

// for parsing application/x-www-form-urlencoded
app.use(express.json());

// Route
app.get('/', (_, res) => res.render('login'));

app.get('/forgot', (req, res) => {
  res.render('forgotpassword');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
