const Express = require('express');
const BodyParser = require('body-parser');
var path = require('path');
const {
  Pool
} = require('pg');

const app = Express();
const port = process.env.PORT || 5432;

const pool = new Pool({
  connectionString: "postgres://tlytmbyzzcydfw:113545f7066f32de88f12a258e21e6b35647288147ebb4062332187c065ec1d4@ec2-174-129-194-188.compute-1.amazonaws.com:5432/dcadl9s1e5frsb",
  ssl: true,
});

app.use(BodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(function (req, res, next) { //what we want to allow
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-AllowHeaders');
  // Pass to the middlelayer
  next();
});

pool.connect();

app.listen(port, function () {
  console.log('Listening on port ' + port);
});

app.get('/',function(req,res){
  res.render('browse')
});



// Get all tasks.
app.get('/book', function (req, res) {
  console.log('Getting tasks...');
  const query = {
    text: "SELECT * FROM books"
  };
  pool.query(query, (err, queryResponse) => {
    if (err) {
      console.log("Error getting books: " + err);
    } else {
      console.log(queryResponse.rows);
      res.status(200).send(queryResponse.rows);
    }
  });
});

app.get('/search', function (req, res) {
  const someStr = req.body.search
  //someStr = someStr.slice(1, -1);
  const query = {
    text: "SELECT * FROM books WHERE title ~* '" + somestr + "'"

    //text: "SELECT * FROM books WHERE title LIKE '%"+someStr+"%'"// or author like '%"+req.body.search+"%' genre like '%"+req.body.search+"%'"
  };
  pool.query(query, (err, queryResponse) => {
    if (err) {
      console.log("Error getting books: " + err);
    } else {
      console.log(queryResponse.rows);

      res.status(200).send(queryResponse.rows);
    }
  });
});

app.get('/product', function (req, res) {
  console.log('Getting tasks...');
  const query = {
    text: "SELECT * FROM books"
  };
  pool.query(query, (err, queryResponse) => {
    if (err) {
      console.log("Error getting books: " + err);
    } else {
      console.log(queryResponse.rows);
      res.status(200).send(queryResponse.rows);
    }
  });
});

// Update a task details.
app.patch('/add-to-cart', function (req, res) {
  console.log("upadting task " + req.body.isbn + " to \'" + req.body.title + "\'...");
  const query = {
    text: "UPDATE books SET item = '" + req.body.item + "' WHERE id = \'" + req.body.id + "\'",
  };
  pool.query(query, (err, queryResponse) => {
    if (err) {
      console.log("Error updating task, id:" + req.body.id + ": " + err);
    } else {
      res.status(200).send(queryResponse);
    }
  });
});

// Create a new task.
app.post('/create-task', function (req, res) {
  const taskDetails = req.body.item;
  console.log('Creating task \'' + taskDetails + '\'...');
  const query = {
    text: "INSERT INTO todo(item, completed) VALUES($1, $2) RETURNING *",
    values: [taskDetails, false]
  };
  pool.query(query, (err, queryResponse) => {
    if (err) {
      console.log("Error creating new task: " + err);
    } else {
      res.status(201).send(queryResponse.rows[0]);
    }
  });
});

// Sets a task as incomplete.
app.patch('/ongoing', function (req, res) {
  setState(req, res, false);
});

// Sets a task as complete.
app.patch('/done', function (req, res) {
  setState(req, res, true);
});

// Delete a task.
app.delete('/delete-task', function (req, res) {
  console.log("Deleting task " + req.body.id + "...");
  const query = {
    text: "DELETE FROM todo WHERE id = " + req.body.id,
  };
  pool.query(query, (err, queryResponse) => {
    if (err) {
      console.log("Error deleting task " + req.body.id + ": " + err);
    } else {
      res.status(200).send(queryResponse);
    }
  });
});

//To see if the task is yet to be done
function setState(req, res, state) {
  console.log("Setting task " + req.body.id + " as " + (state ? "complete...":"incomplete..."));
  const query = {
    text: "UPDATE todo SET completed = " + state + " WHERE id = " + req.body.id,
  };
  pool.query(query, (err, queryResponse) => {
    if (err) {
      console.log("Error setting task as " + (state ? "complete:":"incomplete:") + err);
    } else {
      res.status(200).send(queryResponse);
    }
  });
}
