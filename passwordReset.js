$(document).ready(function(e) {
    
    $('#reset').button().click(
		function() {
			var userEmail = $('#email').val();
            var password = $('#pass').val();
            var cPassword = $('#cpass').val();
            console.log(userEmail);
            if(userEmail === '' || password ===''||cPassword===''){
               alert("Please Confirm your input");
            }
            if(password !== cPassword){
               alert("Please Confirm your Password");
            }
            $.post("/passwordReset",{"username":userEmail,"password":password}, function (data, status) {})
		});
    $('#cancel').button().click(
   function() {
       window.location = "home.html";
    });

    $('#confirm').button().click(
		function() {
			var userEmail = $('#email').val();
            console.log(userEmail);
            if(userEmail === ''){
               alert("Please Confirm your input");
            }
           
            $.post("/passwordReset",{"username":userEmail,"password":password}, function (data, status) {})
		});
	
}); // end ready
