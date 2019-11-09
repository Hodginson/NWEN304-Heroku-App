//*******(Mars)***************************/
//Password requirements done by Zane

$(document).ready(function(e) {

  /*  $('#signUp').button().click(
		function() {
			var username = $('#username').val();
      var email = $('#email').val();
      var password = $('#pass').val();
      var rePassword = $('#repass').val();
      console.log(userEmail);
      if(userEmail === '' || password ===''||rePassword===''){
           alert("Please Confirm your input");

      }
      if(password !== rePassword){
        alert("Please Confirm your Password");

      }

        queryAPI('POST', '/signUp', {
              username:userEmail,
              password: password
            }, function(){});

		});*/
    $('#cancel').button().click(
   function() {
       window.location = "home.html";
    });


}); // end ready

function signUpFunction(){
  var username = $('#username').val();
  var email = $('#email').val();
  var password = $('#pass').val();
  var rePassword = $('#repass').val();
  if($('pass').val.length<4){
  if(username === '' || email ==='' || password ===''||rePassword===''){
       alert("Please Confirm your input");

  }else if(password !== rePassword){
    alert("Please Confirm your Password");

  }else{
    alert("HELLO");
    /*queryAPI('POST', '/signUp', {
          username:username,
          email:email,
          password: password
        }, function(){});*/
  }
}
}

function queryAPI(method, path, data, callback) {
  console.log("Querying API");
  $.ajax({
    method: method,
    url: 'https://nwne304-group-17.herokuapp.com' + path,
    data: JSON.stringify(data),
    contentType: "application/json",
    dataType: "json",
    success: function (res) {
      console.log("API successfully queried!");
      console.log(res);
      callback(res);
    },
    error: function (res) {
      console.log("Error")
    }
  });
}
