const serverless = require('serverless-http');
const express = require('express');
const exphbs  = require('express-handlebars');
const path = require('path');

const app = express();

// Set up Express to use Express-Handlebars with a common layout
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
// Note: Adjust the views path as needed. Here we're assuming views are one level up.
app.set('views', path.join(__dirname, '../../views'));

// Serve static assets from a public folder (optional)
app.use(express.static(path.join(__dirname, '../../public')));

// Define routes for your pages
app.get('/', (req, res) => {
  res.render('frontpage');
});

app.get('/history', (req, res) => {
  res.render('history');
});

app.get('/rules', (req, res) => {
  res.render('rules');
});

app.get('/settings', (req, res) => {
  res.render('settings');
});

// Export the wrapped Express app as a Netlify Function
module.exports.handler = serverless(app);
