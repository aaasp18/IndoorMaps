var isAuthenticated = function (req, res) {
  if(req.session.uid) {
    console.log("user logged in\n");
  } else {
    console.log("user logged out");
    return res.redirect("/");
  }
}

exports.isAuthenticated = isAuthenticated;