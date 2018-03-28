function onSignIn(googleUser) {
 
  var fetchData = { 
    method: 'POST', 
    body: googleUser.getAuthResponse().id_token,
    headers: new Headers()
  }

  console.log(fetchData);
  $.post( "/login",{token: fetchData.body})
    .done(function(data){
      console.log(data);
      uid = data.uid;
      redirectUrl = data.redirectUrl + "?uid=" + uid;
      console.log("uid " + uid);
      window.location = redirectUrl;
    });
}