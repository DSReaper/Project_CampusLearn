const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const router = require('./Services/routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Views (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'View', 'view', 'pages'));

// Serve ALL static assets from /View so /css and /animation work
app.use(express.static(path.join(__dirname, 'View')));
app.use('/audio', express.static(path.join(__dirname, 'View', 'audio')));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true })); 

// for parsing application/x-www-form-urlencoded
app.use(express.json());

// Routes
app.get('/', router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
