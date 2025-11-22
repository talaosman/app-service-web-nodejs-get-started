var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My Clinic Portal' });
});

router.get('/about', function(req, res) {
  res.render('about', { title: 'About' });
});

router.get('/contact', function(req, res) {
  res.render('contact', { title: 'Contact' });
});

router.post('/contact', function(req, res) {
  // Here you can handle contact form submissions
  res.send('Thank you for contacting us!');
});

module.exports = router;
