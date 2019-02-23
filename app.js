var express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser');

//Models
var List = require('./models/lists');
var Todo = require('./models/todos');

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
app.post('/lists/:id/todo', function (req, res) {
	List.findById(req.params.id, function (err, list) {
		if (err) {
			console.log(err);
			res.send('Find list request failed');
		} else {
			Todo.create({
				author: req.body.author,
				text: req.body.text
			}, function (err, todo) {
				if (err) {
					console.log(err);
					res.send('Create todo request failed');
				} else {
					list.todos.push(todo._id);
					list.save();
					res.redirect('/lists/' + req.params.id);
				}
			});
		}
	});

});
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
			res.render('./lists/index', {
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
	List.findById(req.params.id).
	populate('todos').
	exec(function (err, list) {
		if (err) {
			console.log(err);
			res.send('Show list request failed');
		} else {
			console.log(list);
			res.render('./lists/show', {
				list: list
			});
		}
	});

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
	res.sendStatus(404);
});

app.listen(process.env.PORT || 3000, function (err) {
	if (err) {
		console.log(err);
	} else {
		console.log('Server is up');
	}
});