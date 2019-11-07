//All work done by Zane

$(document).ready(function (e) {
  // Read all existing tasks from the api and create new items for them on the page.
  queryAPI('GET', '/isSignedIn', {}, function(msg){
    var button = document.getElementById("sign");
    button.style.display = "none";
    var userButton = document.getElementById("user");
    userButton.style.display = "block";
    var logoutButton = document.getElementById("logout");
    logoutButton.style.display = "block";
  });
  queryAPI('GET', '/book', {}, setupFunction);

})


function setupFunction(books) {
  var url = document.URL;
  var queryStart = url.indexOf("=");
  var queryEnd = url.length + 1;
  var query = url.slice(queryStart + 1, queryEnd - 1);

  for (let row = 0; row < books.length; row++) {

    //console.log(tasks[row]);
    if(books[row].isbn == query){
    createBook(books[row]);
    }

  }



}

function searchFunction() {
  search = document.getElementById("mySearch").value;
  window.location.href = "store.html?=" + search;
}

function createBook(books) {
  var div = document.createElement("div");
  div.className = "card";

  var oImg = document.createElement("img");
  oImg.setAttribute('src', '../Images/' + books.imgsrc);
  div.append(oImg)
  var span = document.createElement('span');
  span.innerHTML += "<br/>"+ books.title;
  span.innerHTML += "<br/>"+ books.author;
  span.innerHTML += "<br/> $"+ books.price + "<br/>";
  span.innerHTML += "<br/>"+ books.description + "<br/><br/>";
  span.innerHTML += "<br/> In stock: "+ books.available + '<br/><br/>';
  div.append(span);
  var button = document.createElement('button');
  button.innerHTML += "Add to cart";
  div.append(button);
  button.addEventListener ("click", function() {
    addToCart(books.isbn);
  });
  var buy = document.createElement('button');
  buy.innerHTML += "Buy";
  div.append(buy);
  buy.addEventListener ("click", function() {
    buyBook(books.isbn);
  });
    $('#column-1').prepend(div);

}

function buyBook(isbn){
  window.location.href = "buy.html?=" + isbn;
}

function addToCart(isbn){
 var name = "zane";
  console.log(isbn);
    //$.put("/api/addCart", { "isbn": isbn}, function (){});
    queryAPI('GET', '/isSignedIn', {}, function(msg){

        queryAPI('PUT', '/addToCart', {isbn:isbn, id:msg.id}, function(){});
    });

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
      alert("You need to login first");
    }
  });
}
