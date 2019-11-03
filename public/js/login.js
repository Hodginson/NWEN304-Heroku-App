$(document).ready(function(e) {

    $("#login").button().click(function(){
    var username = $('#email').val();
    var password = $("#pass").val();
    console.log(username +" / " + password);
    if(username === '' || password ===''){
        alert("Please Confirm your input");
    }
    queryAPI('POST', '/login', {
      username:userEmail,
      password: password
    }, function(){});

  })

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
