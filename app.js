var express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser');

app.set('view engine', 'ejs');

/////////////////////////////////////////////
//      ROUTES

//LANDING
app.get('/', function (req, res) {
	res.render('index');
});

//LOGIN
app.get('/login', function (req, res) {
	res.render('login');
});

//SIGN UP
app.get('/register', function (req, res) {
	res.render('register');
});

/////////////////////////////////////////
//      todo CRUD ROUTES
//INDEX
//SHOW
//EDIT
//UPDATE
//NEW
//CREATE
//DELETE

/////////////////////////////////////////
//      list CRUD ROUTES
//INDEX
//SHOW
//EDIT
//UPDATE
//NEW
//CREATE
//DELETE

app.listen(process.env.PORT || 3000, function (err) {
	if (err) {
		console.log(err);
	} else {
		console.log('Server is up');
	}
});