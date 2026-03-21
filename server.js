require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Home
app.get('/', (req, res) => {
  res.render('index', { title: 'ResumeForge AI - Beat ATS with AI' });
});

// About
app.get('/about', (req, res) => {
  res.render('about', { title: 'About Us - ResumeForge AI' });
});

// FAQ
app.get('/faq', (req, res) => {
  res.render('faq', { title: 'FAQ - ResumeForge AI' });
});

// Contact
app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact Us - ResumeForge AI' });
});

// Terms
app.get('/terms', (req, res) => {
  res.render('terms', { title: 'Terms of Service - ResumeForge AI' });
});

app.listen(PORT, () => {
  console.log(`🚀 ResumeForge AI running on http://localhost:${PORT}`);
});