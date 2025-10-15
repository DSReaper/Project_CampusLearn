const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const router = require('./Routes/routes');

const MongoDBConnection = require('./Model/database/connection');
const dbConnection = new MongoDBConnection();
dbConnection.connect().catch(console.error);

require('dotenv').config();
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

// Router middleware
app.use('/', router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
