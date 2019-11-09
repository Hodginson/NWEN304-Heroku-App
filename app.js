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


var loginRouter = require('./routes/login');
var homeRouter = require('./routes/home');
var storeRouter = require('./routes/store');
var cartRouter = require('./routes/cart');
var usersRouter = require('./routes/users');
var checkoutRouter = require('./routes/checkout');
var profileRouter = require('./routes/profile');
var loggedIn = false;
// const bcrypt = require('bcrypt');

var urlencodedParser= bodyParser.urlencoded({extended: false});
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
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
app.use('/profile', profileRouter);


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

//*******(Zane)******POST REQUEST*********************/
app.post('/signUp', function (req,res){

     console.log('Getting new user...');
     User.create({
         username: req.body.username,
         email: req.body.email,
         password: req.body.password
     })
     .then(user => {
         req.session.user = user.dataValues;
         res.send('1')
         res.redirect('/login');
     })
     .catch(error => {
         res.redirect('/signup');
     });


 })


//*******(Zane)******GET REQUEST*********************/
app.get('/isSignedIn', function(req, res){
    if(loggedIn){
      res.send(req.session.user);
    }else if(!loggedIn){
      res.send('0');
    }
});


 //*******(Zane)******GET REQUEST*********************/

 app.get('/book', function (req, res) {
   console.log('Getting books...');
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
   console.log("why:"+req.body.searchQuery); //for some reason this req.body.searchQuery is always undefined regardless of what is parsed
   console.log('Getting books...');
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

        req.session.user = null;
        res.clearCookie('user_sid');
        loggedIn = false;
        req.logout();
        req.session.destroy();
        req.session.save();
        //res.send('1');

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
  var int = parseInt(req.body.isbn);
  var username = req.body.username;
  const query = {

    text: "UPDATE users SET cart=array_cat(cart, ARRAY["+req.body.isbn+"]) WHERE username='"+req.body.username+"'",
    //text:'update books set sold=sold+1 where isbn='+req.body.isbn

  };
  pool.query(query, (err, queryResponse) => {
    if (err) {
      //print("Error getting books: " + err);
    } else {
      //console.log(queryResponse.rows);
          res.status(200).send("Added to cart");
    }
  });
  User.findOne({ where: { username:username } }).then(function (user) {
    req.session.user = user.dataValues
    req.session.save();
  });
});


//******Zane***** PUT Request*************/
app.put('/buyBook', function(req,res){
  const query = {
    text:'update books set sold=sold+1 where isbn='+req.body.isbn
  };
  pool.query(query, (err, queryResponse) => {
    if (err) {
      //print("Error getting books: " + err);
    } else {
      console.log(queryResponse.rows);
      res.status(200).send("Successfully bought book");
    }
  });

});

//******Zane***** PUT Request*************/
app.put('/addToPurchases', function(req,res){
  var int = parseInt(req.body.isbn);
  const query = {
    text: "UPDATE users SET purchases=array_cat(purchases, ARRAY["+req.body.isbn+"]) WHERE username='"+req.body.username+"'",
    //text:'update books set sold=sold+1 where isbn='+req.body.isbn
  };
  pool.query(query, (err, queryResponse) => {
    if (err) {
      //print("Error getting books: " + err);
    } else {
      console.log(queryResponse.rows);

      res.status(200).send("Added to Purchases");
    }
  });
  User.findOne({ where: { username:req.body.username } }).then(function (user) {
    req.session.user = user.dataValues
    req.session.save();
  });
});

//******Zane***** delete Request*************/
app.delete('/removeFromCart', function(req,res){
  var int = parseInt(req.body.isbn);
  var username = req.body.username;
  const query = {
    text: "UPDATE users SET cart=array_remove(cart, "+req.body.isbn+") WHERE username='"+req.body.username+"'",
  };
  pool.query(query, (err, queryResponse) => {
    if (err) {
      console.log("Error getting books: " + err);
    } else {
    //  console.log(queryResponse.rows);
    //  console.log(req.session.user.cart);
      res.status(200).send("Removded " + req.body.isbn + " from the cart");
    }
  });
  User.findOne({ where: { username:username } }).then(function (user) {
    req.session.user = user.dataValues
    req.session.save();
  });
});

//******Zane***** delete Request*************/
app.delete('/deleteCart', function(req,res){
  var username = req.body.username;
  const query = {
    text: "UPDATE users SET cart=null WHERE username='"+req.body.username+"'",
  };
  pool.query(query, (err, queryResponse) => {
    if (err) {
      console.log("Error getting books: " + err);
    } else {
      res.status(200).send("The cart is now empty");
    }
  });
  User.findOne({ where: { username:username } }).then(function (user) {
    req.session.user = user.dataValues
    req.session.save();
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
