var express = require('express');
var router = express.Router();

var firebase = require("firebase");

// // Initialize Firebase
var config = {
  apiKey: "AIzaSyB4IYLbkUq1KOhMYVus1WoPy4wxgmeHm0A",
  authDomain: "datastore-9fd58.firebaseapp.com",
  databaseURL: "https://datastore-9fd58.firebaseio.com",
  projectId: "datastore-9fd58",
  storageBucket: "datastore-9fd58.appspot.com",
  messagingSenderId: "152034815125"
  };
firebase.initializeApp(config);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.get('/login', function(req, res, next) {
  console.log("\n\nlogin called " + req.body);
  onSignIn(req.body);
  // res.render('login');
});

function onSignIn(googleUser) {
  console.log('Google Auth Response', googleUser);
  // We need to register an Observer on Firebase Auth to make sure auth is initialized.
  var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
    unsubscribe();
    // Check if we are already signed-in Firebase with the correct user.
    if (!isUserEqual(googleUser, firebaseUser)) {
      // Build Firebase credential with the Google ID token.
      console.log("user " + googleUser);
      var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.getAuthResponse().id_token);
      // Sign in with credential from the Google user.
      firebase.auth().signInWithCredential(credential).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
    } else {
      console.log('User already signed-in Firebase.');
    }
  });
}


module.exports = router;



