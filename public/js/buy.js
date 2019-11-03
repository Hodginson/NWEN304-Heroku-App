$(document).ready(function (e) {
  // Read all existing tasks from the api and create new items for them on the page.

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


function createBook(books) {
  var para = document.createElement("p");
  para.innerHTML += books.title;
  para.href = "product.html?=" + books.isbn;
    $('#products').prepend(para);

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
