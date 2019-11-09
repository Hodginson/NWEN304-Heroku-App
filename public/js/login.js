
$(document).ready(function(e) {

    $('#cancel').button().click(
    function() {
       window.location = "index.html";
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
      window.location.href= "index.html";
    }else{
      alert("Login failed");
    }
  });
}
}

function searchFunction() {
  search = document.getElementById("mySearch").value;
  window.location.href = "store.html?=" + search;
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
      callback(res);
    },
    error: function (res) {
      console.log("Error")
    }
  });
}
