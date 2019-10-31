<script src="http://code.jquery.com/jquery-1.11.1.min.js"></script>
$(document).ready(function (e) {
  // Read all existing tasks from the api and create new items for them on the page.
  queryAPI('GET', '/browse', {}, loadBooks);
  $('#add-todo')
    .button({
      icons: {
        primary: 'ui-icon-circle-plus'
      }
    })
    .click(function () {
      $('#new-todo').dialog('open')
    })

  $('#new-todo').dialog({
    modal: true,
    autoOpen: false,
    buttons: {
      'Add Task': function () {
        var taskName = $('#task').val()
        if (taskName === '') {
          return false
        }

        // Create a task entry in the database using the RESTful API and then create the task in the page using the callback function.
        queryAPI('POST', '/create-task', {
          item: taskName
        }, createTask);

        $(this).dialog('close')
        // Clear the text from the task name field.
        $('#task').val('')
      },
      Cancel: function () {
        $(this).dialog('close')
      }
    }
  })

  $('#confirm-delete').dialog({
    modal: true,
    autoOpen: false,
    buttons: {
      Confirm: function () {
        $(this).dialog('close')
        deleteTask();
      },
      Cancel: function () {
        $(this).dialog('close')
      }
    }
  })

  var $taskBeingEdited
  $('#edit-task').dialog({
    modal: true,
    autoOpen: false,
    buttons: {
      Confirm: function () {
        var taskName = $('#new-task').val()
        if (taskName === '') {
          return false
        }
        $taskBeingEdited.find('.task').text(taskName)
        const id = $taskBeingEdited.data('id');
        queryAPI('PATCH', '/update-task', {
          id: id,
          item: taskName
        }, function () {});
        $(this).dialog('close')
        // Clear the text from the task name field.
        $('#new-task').val('')
      },
      Cancel: function () {
        $(this).dialog('close')
      }
    }
  })

  $('#todo-list').on('click', '.done', function () {
    var $taskItem = $(this).parent('li')
    $taskItem.slideUp(250, function () {
      var $this = $(this)
      $this.detach()
      $('#completed-list').prepend($this)
      const id = $this.data('id');
      queryAPI('PATCH', '/done', {
        id: id
      }, function () {});
      $this.slideDown()
    })
  })

  $('.sort-list').on('click', '.edit', function () {
    $taskBeingEdited = $(this).parent('li')
    $('#new-task').val($taskBeingEdited.find('.task').text())
    $('#edit-task').dialog('open')
  })

  $('.sort-list').sortable({
    connectWith: '.sort-list',
    cursor: 'pointer',
    placeholder: 'ui-state-highlight',
    cancel: '.delete,.done, .edit',
    start: function (event, ui) {
      // Save the completed state of the task when it has started to be dragged.
      ui.item.data('completedOnStartDrag', ui.item.parent('#completed-list').length != 0);
    },
    stop: function (event, ui) {
      const completedOnStartDrag = ui.item.data('completedOnStartDrag');
      const completedOnEndDrag = ui.item.parent('#completed-list').length != 0;
      // If there was a change of task completion state after dragging, update the database.
      if (completedOnStartDrag != completedOnEndDrag) {
        const id = ui.item.data('id');
        console.log('id: ' + id);
        if (completedOnEndDrag) {
          queryAPI('PATCH', '/done', {
            id: id
          }, function () {});
        } else {
          queryAPI('PATCH', '/ongoing', {
            id: id
          }, function () {});
        }
      }
    }
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
