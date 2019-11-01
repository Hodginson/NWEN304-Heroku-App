var query;
$(document).ready(function (e) {
  // Read all existing tasks from the api and create new items for them on the page.
  var url = document.URL;
  var queryStart = url.indexOf("=");
  console.log(queryStart);
  if(queryStart==-1){
    console.log("what");
    queryAPI('GET', '/book', {}, loadBooks);
  }else if(queryStart!=-1){
    var queryEnd = url.length + 1;
    query = url.slice(queryStart + 1, queryEnd - 1);
    console.log(query);
    queryAPI('GET', '/search', {search:query}, loadBooks);
  }


})

  function loadBooks(books) {
    for (let row = 0; row < books.length-2; row+=3) {
      //console.log(tasks[row]);

      createBook(books[row],0);
      createBook(books[row+1],1);
      createBook(books[row+2],2);
    }
  }
// load the books into the browse page -- Zane
  function createBook(books,i) {
    var div = document.createElement("div");
    div.className = "card";

    var oImg = document.createElement("img");
    oImg.setAttribute('src', 'Images/' + books.imgsrc);
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



function queryAPI(method, path, data, callback) {
  console.log("Querying API");
      console.log(JSON.stringify(query));
  $.ajax({
    method: method,
    url: 'https://nwne304-group-17.herokuapp.com' + path,
    data: JSON.stringify(data),
    contentType: "application/json",
    dataType: "json",
    success: function (res) {
      console.log("API successfully queried!");
      console.log(res + "hi");
      callback(res);
    },
    error: function (res) {
      console.log("Error")
    }
  });
}

function searchFunction() {

  var search = document.getElementById("mySearch").value;
  window.location.href = "Browse.html?=" + search;
  console.log(search);
}
function view(title) {
  window.location.href = "Product.html?=" + title;

}
