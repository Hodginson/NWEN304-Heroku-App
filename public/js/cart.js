//all work done by Zane

var username;
var query;
var cart;
var price = 0.0;
$(document).ready(function (e) {
  // Read all existing tasks from the api and create new items for them on the page.
  queryAPI('GET', '/isSignedIn', {}, function(msg){
    var button = document.getElementById("sign");
    button.style.display = "none";
    var userButton = document.getElementById("user");
    userButton.style.display = "block";
    var logoutButton = document.getElementById("logout");
    logoutButton.style.display = "block";
    username = msg.username;
    cart = msg.cart;
    console.log("cart: " + msg.cart);
    var url = document.URL;
    var queryStart = url.indexOf("=");
    var queryEnd = url.length + 1;
    query = url.slice(queryStart + 1, queryEnd - 1);
    queryAPI('GET', '/book', {}, setupFunction);

  });



})

function setupFunction(books) {
  var x = cart.toString();
  var split = x.split(',');
  if(split.length==0){
    alert("you have nothing in your cart");
    window.location.href = "store.html";
  }

  console.log(split);
  if(split[0] == ""){
    alert("you have nothing in your cart");
    window.location.href = "store.html";
  }

console.log("may:" + split[1]);
for(let j = 0; j<split.length;j++){
  var s = parseInt(split[j])
  for (let row = 0; row < books.length; row++) {

    console.log(books[row].isbn + ": Cart: " + s);
    if(books[row].isbn == s){
    price += books[row].price;
    createBook(books[row]);
    }

  }
}
}


function createBook(books) {
  var para = document.createElement("p");
  var a = document.createElement('a');
  a.innerHTML += books.title;
  a.href = "Product.html?=" + books.isbn;
  para.append(a);
  var span = document.createElement('span');
  span.className = "price";
  span.innerHTML = "    $" + books.price;
  para.append(span);
  var button = document.createElement('button');
  button.innerHTML += "Remove Item";
  para.append(button);
  button.addEventListener ("click", function() {
    queryAPI('DELETE', '/removeFromCart', {isbn:books.isbn, username:username}, function(){});
    window.location.href = "cart.html";
  });
    $('#products').prepend(para);
    var total = document.getElementById("price")
    total.innerHTML = "$" + price;

}

function searchFunction() {
  search = document.getElementById("mySearch").value;
  window.location.href = "store.html?=" + search;
}

function buyBook(){
  alert("Thank you for your purchase");
  window.location.href = "store.html";
  var x = cart.toString();
  var split = x.split(',');
  if(split[0] == 0){
    alert("you have nothing in your cart");
    window.location.href = "store.html";
  }
  for(let row = 0; row<split.length;row++){
    var cartISBN = parseInt(split[row])
    queryAPI('PUT', '/buyBook', {isbn:cartISBN}, function(){});
    queryAPI('PUT', '/addToPurchases', {isbn:cartISBN, username:username}, function(){});
  }
  queryAPI('DELETE', '/deleteCart', {username:username}, function(){});
  alert("Thank you for purchasing from our store");
  window.location.href = "store.html";

}

function logoutFunction(){
  queryAPI('GET', '/logout', {}, function(msg){});
  alert('you have logged out');
  window.location.href = "store.html";
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
