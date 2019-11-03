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
app.use(express.static(__dirname + '/public'));
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
  res.render('index')
});

app.get('/browse', (req, res) => res.render('browse'));
app.get('/login', (req, res) => res.render('../01-login/gglogin'));
app.get('/register', (req, res) => res.render('register'));

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


// register
app.post('/register', function (req,res){

     console.log('Getting new user...');

    const query = ("insert into users (username,password) values("+req.body.username+"', "+req.body.password+");");

    pool.query(query, (err, queryResponse) => {
      if (err) {
        console.log("Error creating new user: " + err);
      } else {
        res.status(201).send(queryResponse.rows[0]);
      }
    });

 })


// password reset  //need to use the user ID !!!!!!!!!!!!!!!!!!!
app.post('/passwordReset', function (req,res){

  console.log('Setting a new password...');

 const query = ("update into users set password="+req.body.password+" where username="+req.body.username+");");

 pool.query(query, (err, queryResponse) => {
   if (err) {
     console.log("Error creating new user: " + err);
   } else {
     res.status(201).send(queryResponse.rows[0]);
   }
 });

})


//login
app.post('/login', async(req, res)=>{
  var email = req.body.email;
  var pass = req.body.pass;
  var id = "";
  try{
    const client = await pool.connect();
    const result = await client.query(`SELECT UserID, username FROM Users WHERE username='${email}'`);
    const results = { results: result ? result.rows : null };

    if(results.results.length == 0 ){
      res.status(200).send(false);
      client.release;
      return;
    }

    results.results.forEach(element => {
      id = UserID;
    })

    const match = await bcrypt.compareSync(pass,(err, equal) =>{
      if(err){
        console.log(err);
      } else {
        if(equal){
          console.log("success")
        }else{
          console.log("wrong Password")
        }
      }
    })

    if(match){
      res.status(200).send(results);
      client.release;
      return;
    }else{
      res.status(200).send(false);
      client.release;
      return;
    }
  }catch(err){
    console.log(err);
    res.send("Error "+err);
  }
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
