var express = require('express'),
   app = express(),
   mongoose = require('mongoose'),
   bodyParser = require('body-parser'),
   methodOverride = require('method-override');

//Models
var List = require('./models/lists');
var Todo = require('./models/todos');
mongoose.connect(
   process.env.DATABASEURL || 'mongodb://localhost:27017/todo_app',
   {
      useNewUrlParser: true
   }
);

var moment = require('moment');

app.set('view engine', 'ejs');
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
   bodyParser.urlencoded({
      // to support URL-encoded bodies
      extended: true
   })
);
app.use(methodOverride('_method'));
app.use(express.static('public'));

var updateList = function(id, res) {
   List.findByIdAndUpdate(id, { modifiedDate: Date.now() }, function(
      err,
      list
   ) {
      if (err) {
         console.log(err);
         res.send('Update list request failed');
      }
   });
};
/////////////////////////////////////////////
//      ROUTES

//LANDING
app.get('/', function(req, res) {
   res.redirect('lists');
});

//LOGIN
app.get('/login', function(req, res) {
   res.render('login');
});

//SIGN UP
app.get('/register', function(req, res) {
   res.render('register');
});

/////////////////////////////////////////
//      todo CRUD ROUTES
//INDEX
//SHOW
//EDIT
//UPDATE
app.put('/lists/:id/todo/:todo_id', function(req, res) {
   update = {
      title: req.body.title,
      complete: req.body.complete,
      modifiedDate: Date.now()
   };
   Todo.findByIdAndUpdate(req.params.todo_id, update, function(err, todo) {
      if (err) {
         console.log(err);
         res.send('Update todo request failed');
      } else {
         updateList(req.params.id, res);
         res.redirect('/lists/' + req.params.id);
      }
   });
});

//NEW
//CREATE
app.post('/lists/:id/todo', function(req, res) {
   List.findById(req.params.id, function(err, list) {
      if (err) {
         console.log(err);
         res.send('Find list request failed');
      } else {
         Todo.create(
            {
               author: 'test',
               title: req.body.title
            },
            function(err, todo) {
               if (err) {
                  console.log(err);
                  res.send('Create todo request failed');
               } else {
                  list.todos.push(todo._id);
                  list.save();
                  updateList(req.params.id, res);
                  res.redirect('/lists/' + req.params.id);
               }
            }
         );
      }
   });
});
//DELETE
app.delete('/lists/:id/todo/:todo_id', function(req, res) {
   Todo.findById(req.params.todo_id, function(err, todo) {
      if (err) {
         console.log(err);
         res.send('Delete todo request failed');
      } else {
         todo.remove();
         updateList(req.params.id, res);
         res.redirect('/lists/' + req.params.id);
      }
   });
});

/////////////////////////////////////////
//      list CRUD ROUTES
//INDEX
app.get('/lists', function(req, res) {
   List.find({}, function(err, lists) {
      if (err) {
         console.log(err);
         res.send('Index list request failed');
      } else {
         res.render('./lists/index', {
            lists: lists,
            moment: moment
         });
      }
   });
});
//NEW
app.get('/lists/new', function(req, res) {
   res.render('./lists/new');
});
//SHOW
app.get('/lists/:id', function(req, res) {
   List.findById(req.params.id)
      .populate('todos')
      .exec(function(err, list) {
         if (err) {
            console.log(err);
            res.send('Show list request failed');
         } else {
            res.render('./lists/show', {
               list: list,
               moment: moment
            });
         }
      });
});
//EDIT

//UPDATE
app.put('/lists/:id', function(req, res) {
   update = {
      title: req.body.title,
      complete: req.body.complete,
      modifiedDate: Date.now()
   };
   List.findByIdAndUpdate(req.params.id, update, function(err, list) {
      if (err) {
         console.log(err);
         res.send('Update list request failed');
      } else {
         res.redirect('back');
      }
   });
});
//CREATE
app.post('/lists', function(req, res) {
   List.create(
      {
         author: req.body.author,
         title: req.body.title
      },
      function(err, list) {
         if (err) {
            console.log(err);
            res.send('Create list request failed');
         } else {
            res.redirect('/lists/' + list._id);
         }
      }
   );
});
//DELETE
app.delete('/lists/:id', function(req, res) {
   List.findById(req.params.id, function(err, list) {
      if (err) {
         console.log(err);
         res.send('Delete list request failed');
      } else {
         list.remove(function(err, list) {
            res.redirect('/lists');
         });
      }
   });
});

//DEFAULT ROUTE
app.get('*', function(req, res) {
   res.sendStatus(404);
});

app.listen(process.env.PORT || 3000, function(err) {
   if (err) {
      console.log(err);
   } else {
      console.log('Server is up');
   }
});
