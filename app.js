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

// middleware function to check for logged-in users
function sessionChecker (req, res, next){
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');
    } else {
        next();
    }
};

/*app.use(oidc.router);

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
});*/

function loginRequired(req, res, next) {
  if (!req.user) {
    return res.status(401).render("unauthenticated");
  }
  next();
}



/*app.route('/login')
    .get(sessionChecker, (req, res) => {
        app.use('/login', loginRouter)
    })
    .post((req, res) => {
        var username = req.body.username,
            password = req.body.password;

        User.findOne({ where: { username: username } }).then(function (user) {
            if (!user) {
                res.redirect('/login');
            } else if (!user.validPassword(password)) {
                res.redirect('/login');
            } else {
                req.session.user = user.dataValues;
                co
                res.redirect('/dashboard');
            }
        });
    });*/
//login function :
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
                res.send('1');
            }
          })
      })
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
 //password reset function locally
 app.put('/passReset', function (req,res){

    console.log(req.body.username);
    var exsit = 0;
     const query = {
      text:"SELECT username,password from users where username = '"+req.body.username+"'"
     }

     pool.query(query, (err, queryResponse) => {
       if (err) {
         console.log("Error resetting password: " + err);
         res.send(0);
       } else {
           if(queryResponse != undefined){
             //console.log("qr:  "+queryResponse.rows[0].username);
               exsit = 1;
           }else {
             res.send(0);
           }
       }
 //        res.status(200).send(queryResponse.rows);
    });
      if(exsit == 1){
        console.log("user exsit !");
        const query2 = {
         text:"UPDATE into users set password='"+req.body.opass+"' where username = '"+req.body.username+"'"
        }
        pool.query(query2, (err, queryResponse) => {
          if (err) {
            console.log("Error resetting password 2: " + err);
            res.send(0);
          } else {
             res.send('1')
          }
        });
      }
    })




// register
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
 /*app.route('/signup')
     .get(sessionChecker, (req, res) => {
         res.sendFile(__dirname + '/public/signup.html');
     })
     .post((req, res) => {
         User.create({
             username: req.body.username,
             email: req.body.email,
             password: req.body.password
         })
         .then(user => {
             req.session.user = user.dataValues;
             res.redirect('/store');
         })
         .catch(error => {
             res.redirect('/signup');
         });
     });*/


//isLoggedIn
app.get('/isSignedIn', async (req, res) => {
  try {
          res.send(req.session.user.id);




      console.log();
      // Need a way to send the users email through here? Hmm
      //res.send(req.user.username); // someone currently logged in
      //client.release();

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
       console.log(req.session.user);
       //console.log(queryResponse.rows);
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



//******Zane***** PUT Request*************/
app.put('/addToCart', function(req,res){
  console.log('Getting tasks...');
  var int = parseInt(req.body.isbn);
  const query = {

    text: "UPDATE users SET cart=array_cat(cart, ARRAY["+req.body.isbn+"]) WHERE username='"+req.body.user+"'",
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
