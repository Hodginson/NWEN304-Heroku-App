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
            $.post("/signUp",{"username":userEmail,"password":password}, function (data, status) {})
		});
    $('#cancel').button().click(
   function() {
       window.location = "home.html";
    });


}); // end ready
