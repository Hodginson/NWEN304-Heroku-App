var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var body = require('body-parser');
var exports = module.exports = {};
var pg = require('pg').native;
var connectionString = "postgres://rybgtwaenxzadm:Ia_YiG0ih5FblKPT71enEMI4z-@ec2-54-243-236-70.compute-1.amazonaws.com:5432/d6map6onq4uhlg";
var client = new pg.Client(connectionString);
client.connect();
app.use(body.urlencoded({extended:true}));
app.use(body.json());

//Search Function - Zane

exports.search = function(re, res){
  var query = req.query.query;
  if(query == undefined || q == null || !ensure_only_letters_and_numbers(query)){
    res.setHeader('Cache-control','public, max-age=31557600');
    res.render('index', {user: req.user})
    return;
  }
  //allows for multiple words to be passed in one variable
  for(var i = 0, len = query.length; i!=len; i++){
    if(query.charAt(i) == '_'){
      query = query.substr(0, i) + ' ' + query.substr(i + 1);
    }
  }
  var error = false;
  var query = client.query("select * from books where title ilike '%"+q+"%' or author ilike '%"+q+"%' genre ilike '%"+q+"%'", function(err){
    if(err){
      res.status(500).send("Could not search in database.");
      error = true;
    }
  });
  if(error){
    return;
  }
  res.status(200);
  handle_query(query,req, res, 'id');

}

//get the books
exports.get_me_something = function(req, res){
	var array = sanitize_url(req.url);
	if(array == null){
		//The url was invalid
		res.status(400).send("Invalid url.");
		return;
	}
	var error = false;
	var query;
	if(array.length == 1){
		//url is for a specific genre
		query = client.query("select * from books where genre='" + array[0]+"'", function(err, rows, fields){
			if(err){
				res.status(404).send("Sorry, we can't find that.");
				error = true;
			}
		});
	} else if(array.length == 2){
		//looking at all of the books
		query = client.query("select * from books", function(err, rows, fields){
			if(err){
				res.status(404).send("Sorry, we can't find that.");
				error = true;
			}
		});
	}
	if(error){
		return;
	}
	res.statusCode = 200;
	handle_query(query,req, res, array[0]);
}

//helpers

function sanitize_url(url){
	var queries_removed = url.split('?');
	var leading_slash_removed = queries_removed[0].slice(1);
	var path = leading_slash_removed.split('/');
	if(path[path.length - 1] == ""){
		path = path.slice(0,-1);
	}
	return test_path(path);
}

function test_path(path){
	for(var i = 0; i < path.length; i++){
		if(path[i] == undefined || !ensure_only_letters_and_numbers(path[i])){
			return null;
		}
	}
	return path;
}

function ensure_only_letters_and_numbers(word){
	return /^\w+$/.test(word);
}

function handle_query(query, req, res, tableID){
	var query_results = [];
	query.on('row', function(row){
		query_results.push(JSON.stringify(row));
	});
	query.on('end', function(){
		res.setHeader('Cache-Control', 'public, max-age=31557600');
		res.render('display', {user: req.user, kart: false, results: query_results, table: tableID})
	});
}
