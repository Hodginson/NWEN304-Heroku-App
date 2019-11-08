//All work done by Zane
var searchItem;
var purchases
$(document).ready(function (e) {
  // Read all existing tasks from the api and create new items for them on the page.
    queryAPI('GET', '/isSignedIn', {}, function(msg){
      var button = document.getElementById("sign");
      button.style.display = "none";
      var userButton = document.getElementById("user");
      userButton.style.display = "block";
      var logoutButton = document.getElementById("logout");
      logoutButton.style.display = "block";
      purchases = msg.purchases;
    });

    queryAPI('GET', '/book', {}, setupFunction);

})

function setupFunction(books) {
  if(purchases == null){
    alert("you have nothing in your cart");
    window.location.href = "store.html";
  }
  var str = purchases.toString();
  var split = str.split(',');


  console.log(split);
  if(split[0] == ""){
    alert("you have nothing in your cart");
    window.location.href = "store.html";
  }

console.log("may:" + split[1]);
int i = 0;
for(let j = 0; j<split.length;j++){
  var s = parseInt(split[j])
  for (let row = 0; row < books.length; row++) {

    //console.log(books[row].isbn + ": purchases: " + s);
    if(books[row].isbn == s){
    price += books[row].price;
    createBook(books[row],i);
    i++;
    if(i==3){
      i=0;
    }
    }

  }
}
}

// load the books into the browse page -- Zane
  function createBook(books,i) {
    var div = document.createElement("div");
    div.className = "card";
    var oImg = document.createElement("img");
    oImg.setAttribute('src', '../Images/' + books.imgsrc);
    div.append(oImg)
    var span = document.createElement('span');
    span.innerHTML += "<br/>"+ books.title;
    span.innerHTML += "<br/> $"+ books.price + "<br/>";
    div.append(span);
    var button = document.createElement('button');
    button.innerHTML += "View Item";
    button.onclick = "view()";
    div.append(button);
    button.addEventListener ("click", function() {
      view(books.isbn);
    });
    if(i==0){
      $('#column-1').prepend(div);//
    } else if(i==1){
      $('#column-2').prepend(div);
    }else{
      $('#column-3').prepend(div);
    }
  }

  function ensure_only_letters_and_numbers(word){
  	return /^\w+$/.test(word);
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

function searchFunction() {
  search = document.getElementById("mySearch").value;
  window.location.href = "store.html?=" + search;
}

function view(title) {
  window.location.href = "Product.html?=" + title;
}
