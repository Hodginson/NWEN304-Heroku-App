const Express = require('express');
const BodyParser = require('body-parser');
const {
  Pool
} = require('pg');

const app = Express();
const port = process.env.PORT || 5000;

const pool = new Pool({
  connectionString: "postgres://hmwrrladplnxbm:52cc755255837add4d9aa96e6f7528a75d5fbbee5d16be8c01b058895f8c000e@ec2-54-235-92-244.compute-1.amazonaws.com:5432/d166o09cksv49j",
  ssl: true,
});

app.use(BodyParser.json());


app.use(function (req, res, next) { //what we want to allow
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-AllowHeaders');
  // Pass to the middlelayer
  next();
});

pool.connect();

app.listen(port, function () {
  console.log('Listening on port 5000!');
});

// Get all tasks.
app.get('/todo', function (req, res) {
  console.log('Getting tasks...');
  const query = {
    text: "SELECT * FROM todo"
  };
  pool.query(query, (err, queryResponse) => {
    if (err) {
      console.log("Error getting tasks: " + err);
    } else {
      console.log(queryResponse.rows);
      res.status(200).send(queryResponse.rows);
    }
  });
});

// Update a task details.
app.patch('/update-task', function (req, res) {
  console.log("upadting task " + req.body.id + " to \'" + req.body.item + "\'...");
  const query = {
    text: "UPDATE todo SET item = '" + req.body.item + "' WHERE id = \'" + req.body.id + "\'",
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
