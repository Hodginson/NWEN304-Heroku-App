$(document).ready(function (e) {
  // Read all existing tasks from the api and create new items for them on the page.
    queryAPI('GET', '/recommend', {}, loadBooks);
})

function loadBooks(books) {

    for (let row = 0; row < books.length; row++) {

      createBook(books[row],i);
      i+=1;
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
