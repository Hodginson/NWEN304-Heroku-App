var query;

$(document).ready(function (e) {
  // Read all existing tasks from the api and create new items for them on the page.
  queryAPI('GET', '/isSignedIn', {}, function(msg){
    if(msg!=0){
    var button = document.getElementById("sign");
    button.style.display = "none";
    var userButton = document.getElementById("user");
    userButton.style.display = "block";
    var logoutButton = document.getElementById("logout");
    logoutButton.style.display = "block";
    username = msg.username;
  }
  });
  var url = document.URL;
  var queryStart = url.indexOf("=");
  var queryEnd = url.length + 1;
  query = url.slice(queryStart + 1, queryEnd - 1);
  queryAPI('GET', '/book', {}, setupFunction);

})

function setupFunction(books) {


  for (let row = 0; row < books.length; row++) {

    //console.log(tasks[row]);
    if(books[row].isbn == query){
    createBook(books[row]);
    }

  }
}


function createBook(books) {
  var para = document.createElement("p");
  var a = document.createElement('a');
  a.innerHTML += books.title;
  a.href = "product.html?=" + books.isbn;
  para.append(a);
  var span = document.createElement('span');
  span.className = "price";
  span.innerHTML = "    $" + books.price;
  para.append(span);
    $('#products').prepend(para);
    var price = document.getElementById("price")
    price.innerHTML += "$" + books.price;
}

function buyBook(){
  queryAPI('PUT', '/buyBook', {isbn:query}, function(){});
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
      console.log(res);
      callback(res);
    },
    error: function (res) {
      console.log("Error")
    }
  });
}
