var createError = require('http-errors');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');
var errorHandler = require('errorhandler')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var express = require('express');
var User = require('./models/user');

var okta = require("@okta/okta-sdk-nodejs");
var ExpressOIDC = require("@okta/oidc-middleware").ExpressOIDC;

var loginRouter = require('./routes/login');
var homeRouter = require('./routes/home');
var storeRouter = require('./routes/store');
var cartRouter = require('./routes/cart');
var usersRouter = require('./routes/users');
var checkoutRouter = require('./routes/checkout');
var loggedIn = false;
// const bcrypt = require('bcrypt');

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
//app.set('view engine', 'jade');
app.engine('html', require('jade').renderFile);
app.set('view engine', 'html');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use('/', homeRouter);
app.use('/login', loginRouter);
app.use('/browse', storeRouter);
app.use('/users', usersRouter);
app.use('/cart', cartRouter);
app.use('/checkout', checkoutRouter);


app.use(session({
  key: 'userID',
  secret: 'something',
  resave: true,
  saveUnitialized: false,
  cookie: {
        expires: 600000
    }
}));

app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
});


function loginRequired(req, res, next) {
  if (!req.user) {
    return res.status(401).render("unauthenticated");
  }
  next();
}


//****************Zane(old login)Put REQUEST*********************/

     /*console.log(req.body.username);

    const query = {
     text:"SELECT username,password from users where username = '"+req.body.username+"'"
    }

    pool.query(query, (err, queryResponse) => {
      if (err) {
        console.log("Error login: " + err);
      } else {
        console.log(queryResponse.rows[0].username + ":" + queryResponse.rows[0].password);
        if(queryResponse.rows[0].password == req.body.password){
          res.send('1')
        }else{
          res.send('0')
        }*/
//        res.status(200).send(queryResponse.rows);
  //    }
  //});



//*******(Mars)******old password reset function*********************/
 // //reset password with email function :
 // app.get('/passReset', function (req,res){
 //
 //    console.log(req.body.userEmail);
 //
 //     const query = {
 //      text:"SELECT username,email from users where email = '"+req.body.userEmail+"'"
 //     }
 //
 //     pool.query(query, (err, queryResponse) => {
 //       if (err) {
 //         console.log("User doesn't exsit " + err);
 //         res.send(0);
 //       } else {
 //
 //       }
 //     });
 //
 //  })
//

//*******(Mars)******PUT REQUEST*********************/
 //password reset function locally
 app.put('/passReset', function (req,res){
    console.log(req.body.username);
     const query = {
      text:"UPDATE users set password='"+req.body.npass+"' where username = '"+req.body.username+"' and password = '"+ req.body.opass+"'"

      //text: "SELECT username,password from users where username = '"+req.body.username+"'"
     }

     pool.query(query, (err, queryResponse) => {
       if (err) {
         console.log("Error resetting password: " + err);
       } else {
         res.send('1');
        //  if(queryResponse.rows[0].password == req.body.opass){
        //      console.log("-----------------------------"+queryResponse.rows[0].password);
        //    res.send('1');
        //  }else{
        //    res.send('0');
        // }
       }
    });
    // if(exist == 1){
    //    console.log("exsit~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    //
    //     const query2 = {
    //      text:"UPDATE users set password='"+req.body.npass+"' where username = '"+req.body.username+"'"
    //     }
    //     pool.query(query2, (err, queryResponse) => {
    //       if(err){
    //         console.log("Error resetting password 2 : " + err);
    //       }else{
    //        res.send('1');
    //       }
    //     });
    // }
    })

//*******(Mars)******PUT REQUEST*********************/
    app.put('/forgetPass', function (req,res){

         console.log('Password forget...');

         const query = {
           text: "SELECT username,token,tokenExDate FROM users where email = '"+req.body.emailAdd+"'"
         };
         pool.query(query, (err, queryResponse) => {
           if (err) {
             console.log("Error getting books: " + err);
           } else {
             if(queryResponse.rows[0].tokenExDate != null && queryResponse.rows[0].tokenExDate ){

             }else{
               res.send('0');
             }
           }
         });
     })

//*******(Mars)******POST REQUEST*********************/
app.post('/signUp', function (req,res){

     console.log('Getting new user...');
     User.create({
         username: req.body.username,
         email: req.body.email,
         password: req.body.password
     })
     .then(user => {
         req.session.user = user.dataValues;
         res.redirect('/login');
     })
     .catch(error => {
         res.redirect('/signup');
     });


 })


//*******(Zane)******GET REQUEST*********************/
//isLoggedIn
app.get('/isSignedIn', function(req, res){

    if(loggedIn){
      res.send(req.session.user);
    }else if(!loggedIn){
      res.send('nope');
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
       console.log(req.session.user);
       //console.log(queryResponse.rows);
       res.status(200).send(queryResponse.rows);
     }
   });
 });

 //*******(Zane)******GET REQUEST*********************/

 app.get('/search', function (req, res) {
   console.log("why:"+req.body.searchQuery);
   console.log('Getting tasks...');
   const query = {
     text: "SELECT * FROM books where title Like='%"+req.body.searchQuery+"%'"
   };
   pool.query(query, (err, queryResponse) => {
     if (err) {
       console.log("Error getting books: " + err);
     } else {
       console.log(queryResponse.rows);
       console.log(req.body.searchString);
       res.status(200).send(queryResponse.rows);
     }
   });
 });

//*******(Zane)******GET REQUEST*********************/
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

//*******(Zane)******GET REQUEST*********************/
 app.get('/getCart', function (req, res) {
   console.log('Getting tasks...');
   const query = {
     text: "SELECT cart FROM users where username = '" + req.body.username + "'"
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

//*******(Zane)******GET REQUEST*********************/
 app.get('/logout', (req, res) => {

        //req.session.user = null;
        res.clearCookie('user_sid');
        loggedIn = false;
        res.send('yes');
        //res.redirect('/');

});





//******Zane***** POST Request*************/
app.post('/login', function (req,res){
  var username = req.body.username,
        password = req.body.password;
        User.findOne({ where: { username: username } }).then(function (user) {
            if (!user) {
                res.send('0');
            } else if (!user.validPassword(password)) {
                res.send('0');
            } else {
                console.log(req.session.user);
                req.session.user = user.dataValues;
                console.log(req.session.user);
                loggedIn = true;
                res.send('1');
            }
          })
      })

//******Zane***** PUT Request*************/
app.put('/addToCart', function(req,res){
  console.log('Getting tasks...');
  var int = parseInt(req.body.isbn);
  const query = {

    text: "UPDATE users SET cart=array_cat(cart, ARRAY["+req.body.isbn+"]) WHERE id="+req.body.id,
    //text:'update books set sold=sold+1 where isbn='+req.body.isbn

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


//******Zane***** PUT Request*************/
app.put('/buyBook', function(req,res){
  console.log('Getting tasks...');

  const query = {

    text:'update books set sold=sold+1 where isbn='+req.body.isbn

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
