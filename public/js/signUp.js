$(document).ready(function(e) {

    $('#signUp').button().click(
		function() {
			var userEmail = $('#email').val();
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


		});
    $('#cancel').button().click(
   function() {
       window.location = "home.html";
    });


}); // end ready

function queryAPI(method, path, data, callback) {
  console.log("Querying API");
  $.ajax({
    method: method,
    url: 'https://nwne304-group-17.herokuapp.com' + path,
    data: data,
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
