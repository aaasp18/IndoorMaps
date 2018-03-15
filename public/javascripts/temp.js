function onSignIn(googleUser) {
  console.log("amisha");
  
  let fetchData = { 
    method: 'GET', 
    body: googleUser,
    headers: new Headers()
  }

  fetch(url(login), fetchData).then(function(response) {
    console.log("res receirved");
  }).catch(function() {
  });
}