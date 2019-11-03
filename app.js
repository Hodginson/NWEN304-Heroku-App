var createError = require('http-errors');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');
var errorHandler = require('errorhandler')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var express = require('express');


var okta = require("@okta/okta-sdk-nodejs");
var ExpressOIDC = require("@okta/oidc-middleware").ExpressOIDC;

var loginRouter = require('./routes/login');
var homeRouter = require('./routes/home');
var storeRouter = require('./routes/store');
var cartRouter = require('./routes/cart');
var usersRouter = require('./routes/users');
var checkoutRouter = require('./routes/checkout');


var urlencodedParser= bodyParser.urlencoded({extended: false});
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});


var oktaClient = new okta.Client({
  orgUrl: 'https://dev-310068.oktapreview.com',
  token: '00bJYd0L3NzL4txuaD70VRA-FPr-QwxWiiNz2I3090'
});

const oidc = new ExpressOIDC({
  issuer: "https://dev-310068.oktapreview.com/oauth2/default",
  client_id: '0oah94rgl2BfrVS4e0h7',
  client_secret: 'bMglTnK7d8Lyj3iAHS0pRiUO0y-rBiwXA6J4W8oR',
  redirect_uri: 'https://fathomless-tor-48342.herokuapp.com/users/callback',
  scope: "openid profile",
  routes: {
    login: {
      path: "/users/login"
    },
    callback: {
      path: "/users/callback",
      defaultRedirect: "/store"
    }
  }
});
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRouter);
app.use('/login', loginRouter);
app.use('/browse', storeRouter);
app.use('/users', usersRouter);
app.use('/cart', cartRouter);
app.use('/checkout', checkoutRouter);


app.use(session({
  secret: '7b23f897hy34ybrrxiuhbfdrfgs',
  resave: true,
  saveUnitialized: false
}));
app.use(oidc.router);

app.use((req, res, next) => {
  if (!req.userinfo) {
    return next();
  }

  oktaClient.getUser(req.userinfo.sub)
    .then(user => {
      req.user = user;
      res.locals.user = user;
      next();
    }).catch(err => {
      next(err);
    });
});

function loginRequired(req, res, next) {
  if (!req.user) {
    return res.status(401).render("unauthenticated");
  }
  next();
}



/**
app.get('/', (req, res) => res.sendFile('public/login.html', { root : __dirname}));

//
// /* PASSPORT SETUP */
//
//
// const passport = require('passport');
// app.use(passport.initialize());
// app.use(passport.session());
//
// app.get('/success', (req, res) => res.send("Welcome "+req.query.username+"!!"));
// app.get('/error', (req, res) => res.send("error logging in"));
//
// passport.serializeUser(function(user, cb) {
//   cb(null, user.id);
// });
//
// passport.deserializeUser(function(id, cb) {
//   User.findById(id, function(err, user) {
//     cb(err, user);
//   });
// });
//
//
//
//
// /** MONGOOSE SETUP HELP **/
//
//
// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/MyDatabase', function (err, res) {
//   if (err) {
//   console.log ('ERROR connecting to: ' + "database" + '. ' + err);
//   } else {
//   console.log ('Succeeded connected to: ' + "database");
//   }
// });
//
// const Schema = mongoose.Schema;
// const UserDetail = new Schema({
//       username: String,
//       password: String
//     });
// const UserDetails = mongoose.model('userInfo', UserDetail, 'userInfo');
//
//
//
//
//
//
// /* PASSPORT LOCAL AUTHENTICATION */
//
//
// const LocalStrategy = require('passport-local').Strategy;
//
// passport.use(new LocalStrategy(
//   function(username, password, done) {
//       UserDetails.findOne({
//         username: username
//       }, function(err, user) {
//         if (err) {
//           return done(err);
//         }
//
//         if (!user) {
//           return done(null, false);
//         }
//
//         if (user.password != password) {
//           return done(null, false);
//         }
//         return done(null, user);
//       });
//   }
// ));
//
// app.post('/',
//   passport.authenticate('local', { failureRedirect: '/error' }),
//   function(req, res) {
//     res.redirect('/success?username='+req.user.username);
//   });
//
//


/* ********************************************* */

// register
app.post('/signUp', function (req,res){

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



//isLoggedIn (Andy)
app.get('/api/logged', async (req, res) => {
  try {
     if(!req.user){
       res.send('0');
      }
      console.log();
      // Need a way to send the users email through here? Hmm
      res.send(req.user.profile.firstName); // someone currently logged in
      client.release();

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});


 //*******(Zane)******GET REQUEST*********************/

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

 app.get('/recommend', function (req, res) {
   console.log('Getting tasks...');
   const query = {
     text: "SELECT * FROM books ORDER BY sold desc limit 3"
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


app.get('/api/products', async (req, res) => {
  try {
    const client = await pool.connect()
    var result = await client.query('SELECT * FROM cart_table;');
    if (!result) {
      return res.send('No data found');
      }else{
      result.rows.forEach(row=>{
      console.log(row);
      });
      }

  res.send(result.rows);
  client.release();

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});


 //*******SEAN DB******GET REQUEST (item_table)*********************/
 app.get('/api/items', async (req, res) => {
  try {
    const client = await pool.connect()
    var result = await client.query('SELECT * FROM item_table;');

    if (!result) {
      return res.send('No data found');
      }else{
      result.rows.forEach(row=>{
      console.log(row);
      });
      }

  res.send(result.rows);
  client.release();

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});



 //*******SEAN DB****** Delete REQUEST (cart_table)*********************/
app.delete('/api/items',urlencodedParser, async (req,res)=>{
  try {
    const client = await pool.connect();
    var result = await client.query("DELETE FROM cart_table WHERE cart_id="+999+" AND item_id="+req.body.item_id+";");


    if (!result) {
         return res.send("DELETION Failure");
       } else {
         console.log("successful");
       }
       res.send(result.rows);
       client.release();
     } catch (err) {
       console.error(err);
       res.send("Error " + err);
  }
 });


  //*******Andy DB for Zihui's clear database****** Delete REQUEST (cart_table)*********************/
app.delete('/api/clear',urlencodedParser, async (req,res)=>{
  try {
    const client = await pool.connect();
    var result = await client.query('delete from cart_table;');
    if (!result) {
         return res.send("DELETION Failure");
       } else {
         console.log("successful");
       }
       res.send(result.rows);
       client.release();
     } catch (err) {
       console.error(err);
       res.send("Error " + err);
  }
 });



//******Andy DB***** PUT Request*************/
app.put('/addToCart', function(req,res){
  console.log('Getting tasks...');
  var int = parseInt(req.body.isbn);
  const query = {
    text: "update users set cart=array_cat(cart,ARRAY[$1]) Where username='zane'",req.body.isbn
  };
  pool.query(query, (err, queryResponse) => {
    if (err) {
      //print("Error getting books: " + err);
    } else {
      console.log(queryResponse.rows);
      res.status(200).send(queryResponse.rows);
    }
  });

});





//******Andy DB*****POST Request*************/
app.post('/api/products',urlencodedParser, async (req,res)=>{
  try {
    const client = await pool.connect();

    var r= await client.query('select item_id from  cart_table where item_id='+req.body.item_id+';');
    if((r.rows).length==0){
      var result = await client.query('insert into cart_table values ('+req.body.cart_id+', '+req.body.item_id+', '+req.body.item_quantity+');' );
    }else{  //if there are rows with same item_id
      var old_value= await client.query('select item_quantity from cart_table where item_id='+req.body.item_id+';');
      res.send(old_value);
    }
    if (!result) {
         return res.send("POST Failure");
       } else {
         console.log("successful");
       }
       res.send(result.rows);
       client.release();
     } catch (err) {
       console.error(err);
       res.send("Error " + err);
  }
 });





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});






module.exports = app;
