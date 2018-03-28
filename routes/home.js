var express = require('express');
var router = express.Router();
var auth = require('./helper.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.query.uid);
  uid = req.query.uid;
  auth.isAuthenticated(req, res);

  res.render('home/homepage', { title: 'home', uid : uid });
});

module.exports = router;
