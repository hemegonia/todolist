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
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
	extended: true
}));

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
	List.find({}, function (err, lists) {
		if (err) {
			console.log(err);
			res.send('Index list request failed');
		} else {
			res.render('/lists/index', {
				lists: lists
			});
		}
	});
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
	List.create({
		author: req.body.author,
		name: req.body.name
	}, function (err) {
		if (err) {
			console.log(err);
			res.send('Create list request failed');
		} else {
			res.redirect('/lists');
		}
	});
});

//DELETE

//DEFAULT ROUTE
app.get('*', function (req, res) {
	res.send("ERROR 404");
});

app.listen(process.env.PORT || 3000, function (err) {
	if (err) {
		console.log(err);
	} else {
		console.log('Server is up');
	}
});