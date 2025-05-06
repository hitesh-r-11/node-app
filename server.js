const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 2200;

// Dummy user store
const users = [
  { username: 'admin', password: '1234' },
  { username: 'test', password: 'abcd' }
];

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  if (req.session.user) {
    res.send(`<h2>Welcome ${req.session.user.username}!</h2><a href="/logout">Logout</a>`);
  } else {
    res.redirect('/login.html');
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const matchedUser = users.find(u => u.username === username && u.password === password);

  if (matchedUser) {
    req.session.user = matchedUser;
    res.redirect('/');
  } else {
    res.send('<h3>Login failed. <a href="/login.html">Try again</a></h3>');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login.html');
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
