var express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser');

//Models
var List = require('./models/lists');

mongoose.connect('mongodb://localhost:27017/todo_app', {
	useNewUrlParser: true
});

app.set('view engine', 'ejs');
bodyParser.urlencoded({
	extended: true
});

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
app.get('/lists', function (req, res) {
	res.render('./lists/index');
});
//NEW
app.get('/lists/new', function (req, res) {
	res.render('./lists/new');
});
//SHOW
app.get('/lists/:id', function (req, res) {
	res.send(req.params.id);
});
//EDIT
//UPDATE

//CREATE
app.post('/lists', function (req, res) {
	// res.send("SUBMITTED NEW LIST REQUEST");

});
//DELETE

app.listen(process.env.PORT || 3000, function (err) {
	if (err) {
		console.log(err);
	} else {
		console.log('Server is up');
	}
});