$(document).ready(function(e) {

  /*  $("#login").button().click(function(){
    var email = $('#email').val();
    var pass = $("#pass").val();
    console.log(email +" / " + pass);
    if(email === '' || pass ===''){
        alert("Please Confirm your input");
    }
    queryAPI('POST', '/login', {
      username:email,
      password: pass
    }, function(){});

  })*/

    $('#cancel').button().click(
    function() {
       window.location = "home.html";
    });
}); // end ready

function loginFunction(){
  var email = $('#email').val();
  var pass = $("#pass").val();
  if(email === '' || pass ===''){
      alert("Please Confirm your input");
  }else{
  queryAPI('POST', '/login', {
    username:email,
    password: pass
  }, function(msg){
    if(msg == '1'){
      alert("Logged in");
    }else{
      alert("Not logged in");
    }
  });
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
