var express = require('express');
var router = express.Router();

var firebase = require("firebase");

// Initialize Firebase
var config = {
  apiKey: "AIzaSyB4IYLbkUq1KOhMYVus1WoPy4wxgmeHm0A",
  authDomain: "datastore-9fd58.firebaseapp.com",
  databaseURL: "https://datastore-9fd58.firebaseio.com",
  projectId: "datastore-9fd58",
  storageBucket: "datastore-9fd58.appspot.com",
  messagingSenderId: "152034815125"
  };
firebase.initializeApp(config);


/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('main');
});

router.post('/login', function(req, res, next) {
  verifyWithFirebase(req.body.token).then(function(data){
    console.log(" uid " + firebase.auth().currentUser.uid);
    uid = firebase.auth().currentUser.uid;
    req.session.uid = uid;
    res.send({uid: uid, redirectUrl: "/home"});
  }).catch(function(err){
    console.log(err);
  });
});

function verifyWithFirebase(id_token) {
  // Build Firebase credential with the Google ID token.
  var credential = firebase.auth.GoogleAuthProvider.credential(id_token);

  // Sign in with credential from the Google user.
  return firebase.auth().signInWithCredential(credential);
}

router.post('/logout', function(req, res) {
  firebase.auth().signOut().then(function() {
    req.session.destroy();
    res.send({status:200});
  }).catch(function(error) {
    // An error happened.
    res.send({status:500});
  });
});

module.exports = router;



