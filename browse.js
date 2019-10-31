$(document).ready(function (e) {
  // Read all existing tasks from the api and create new items for them on the page.
  queryAPI('GET', '/books', {}, loadBooks);

})

  function loadBooks(books) {
    for (let row = 0; row < books.length; row++) {
      //console.log(tasks[row]);
      i = 1;
      createBook(books[row]);
      i+=1;
    }
  }

  function createTask(books) {
    var div = document.createElement("div");
    div.className = "card";


    var span = document.createElement('span');
    span.innerHTML += "<br/>"+ books.title;

    div.append(span);
    var oImg = document.createElement("img");
    oImg.setAttribute('src', 'https://www.bookmestatic.net.nz/images/activities/4321_image1_monteiths%20brewery%20tour%203.jpg');
    div.append(oImg)
    $('#column-1').prepend(div);
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
