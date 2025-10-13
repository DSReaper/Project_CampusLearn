const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Views (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'View', 'view', 'pages'));

// Serve ALL static assets from /View so /css and /animation work
app.use(express.static(path.join(__dirname, 'View')));
app.use('/audio', express.static(path.join(__dirname, 'View', 'audio')));

// Route
app.get('/', (_, res) => res.render('login'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
