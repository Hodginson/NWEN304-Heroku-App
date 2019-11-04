$(document).ready(function(e) {

    $('#cancel').button().click(
   function() {
       window.location = "home.html";
    });
    //for the email password reset function :
    // $('#confirm').button().click(
		// function() {
		// 	var userEmail = $('#email').val();
    //         console.log(userEmail);
    //         if(userEmail === ''){
    //            alert("Please Confirm your input");
    //         }
    //
    //         $.post("/passwordReset",{"username":userEmail,"password":password}, function (data, status) {})
		// });

}); // end ready
//
function resetFunction(){
  var email = $('#email').val();
  var opassword = $('#opass').val();
  var password = $('#pass').val();
  var cPassword = $('#cpass').val();
  if(password === '' || cPassword ==='' ||email ===''||opassword===''){
      alert("Please Confirm your input");
  }else if(opassword===password){
      alert("New password cannot be the same as the origin one!");
  }else{
  queryAPI('PUT', '/passReset', {
    username:email,
    opass: opassword,
    npass: password,
  }, function(msg){
    if(msg == '1'){
      alert("You password has been reset!");
      window.location = "home.html";
    }else{
      alert("Password reset failed!");
    }
  });
}
}

//  with email !~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// function resetFunction(){
//   var email = $('#email').val();
//   if(email ===''){
//       alert("Please Confirm your input");
//   }else{
//   queryAPI('GET', '/passReset', {
//     userEmail:email,
//   }, function(msg){
//     if(msg == '1'){
//       alert("Done! Check your email!");
//       window.location = "home.html";
//     }else{
//       alert("Password reset failed!");
//     }
//   });
// }
// }
//


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
      console.log("Error:"+res);
    }
  });
}
