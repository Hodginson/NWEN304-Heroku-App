//All work done by Zane
var searchItem;
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
    queryAPI('GET', '/book', {}, loadBooks);

})

  function loadBooks(books) {
    var url = document.URL;
    var queryStart = url.indexOf("=");
    var queryEnd = url.length + 1;
    var query = url.slice(queryStart + 1, queryEnd - 1);
    var split = query.split('%20');
    var searchString = split.join(' ');

    console.log(searchString);
    //ensure_only_letters_and_numbers(query);
    var i = 0;
    let matches = books.filter(books => books.title.includes(searchString))
    let author = books.filter(books => books.author.includes(searchString))
    let genre = books.filter(books => books.genre.includes(searchString))
    for(let row = 0; row < author.length; row++){
      matches.push(author[row]);
    }
    for(let row = 0; row < genre.length; row++){
      matches.push(genre[row]);
    }
    console.log(matches);
    if(queryStart == -1){
      for (let row = 0; row < books.length; row++) {

        createBook(books[row],i);
        i+=1;
        if(i==3){
          i =0;
        }
      }

    }
    if(queryStart > -1){
      for (let row = 0; row < matches.length; row++) {

        createBook(matches[row],i);
        i+=1;
        if(i==3){
          i =0;
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
      $('#column-1').append(div);
    } else if(i==1){
      $('#column-2').prepend(div);
    }else{
      $('#column-3').prepend(div);
    }
  }

  function ensure_only_letters_and_numbers(word){
  	return /^\w+$/.test(word);
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
  //queryAPI('GET', '/search', {search:mySearch}, loadBooks);
  window.location.href = "store.html?=" + search;
}
function view(title) {
  window.location.href = "Product.html?=" + title;
}
