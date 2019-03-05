var express = require('express'),
   app = express(),
   mongoose = require('mongoose'),
   bodyParser = require('body-parser'),
   methodOverride = require('method-override'),
   moment = require('moment'),
   passport = require('passport'),
   LocalStrategy = require('passport-local');

//Models
var List = require('./models/lists');
var Todo = require('./models/todos');
var User = require('./models/users');

mongoose.connect(
   process.env.DATABASEURL || 'mongodb://localhost:27017/todo_app',
   {
      useNewUrlParser: true
   }
);

mongoose.set('useFindAndModify', false);

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
app.use(
   require('express-session')({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false
   })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
   res.locals.currentUser = req.user;
   next();
});

var updateList = function(id, res, next) {
   List.findByIdAndUpdate(id, { modifiedDate: Date.now() }, function(
      err,
      list
   ) {
      if (err) {
         console.log(err);
         res.send('Update list request failed');
      }
      next(id, res);
   });
};

var isLoggedIn = function(req, res, next) {
   if (req.isAuthenticated()) {
      return next();
   } else {
      res.redirect('/login');
   }
};

//Assumes list request
var isAuthor = function(req, res, next) {
   var author = '';
   List.findById(req.params.id, function(err, list) {
      if (err) {
         console.log(err);
         res.send('Could  not find user');
      } else {
         author = list.author.username;
         if (author === req.user.username) {
            return next();
         } else {
            res.send('You must be the author to do that');
         }
      }
   });
};

/////////////////////////////////////////////
//       USER AUTH
app.get('/login', function(req, res) {
   res.render('login');
});

app.post('/login', function(req, res) {
   passport.authenticate('local')(req, res, function() {
      res.redirect('/lists');
   });
});

app.get('/register', function(req, res) {
   res.render('register');
});

app.post('/register', function(req, res) {
   User.register(
      new User({ username: req.body.username }),
      req.body.password,
      function(err, user) {
         if (err) {
            console.log(err);
            res.redirect('/lists');
         } else {
            passport.authenticate('local')(req, res, function() {
               res.redirect('/lists');
            });
         }
      }
   );
});

app.get('/demo', function(req, res) {
   User.find({ username: new RegExp('anon-' + '*', 'i') }, function(
      err,
      users
   ) {
      if (err) {
         console.log(err);
         res.send('Delete user request failed');
      } else {
         req.body.username = 'anon-' + users.length;
         req.body.password = '123';
         User.register(
            new User({ username: req.body.username }),
            req.body.password,
            function(err, user) {
               if (err) {
                  console.log(err);
                  res.redirect('/lists');
               } else {
                  passport.authenticate('local')(req, res, function() {
                     res.redirect('/lists');
                  });
               }
            }
         );
      }
   });
});

app.get('/logout', function(req, res) {
   req.logout();
   res.redirect('/lists');
});

/////////////////////////////////////////////
//      ROUTES

//LANDING
app.get('/', function(req, res) {
   res.redirect('/lists');
});

/////////////////////////////////////////
//      todo CRUD ROUTES
//INDEX
//SHOW
//EDIT
//UPDATE
app.put('/lists/:id/todo/:todo_id', isLoggedIn, isAuthor, function(req, res) {
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
         updateList(req.params.id, res, function() {
            res.redirect('/lists/' + req.params.id);
         });
      }
   });
});

//NEW
//CREATE
app.post('/lists/:id/todo', isLoggedIn, isAuthor, function(req, res) {
   List.findById(req.params.id, function(err, list) {
      if (err) {
         console.log(err);
         res.send('Find list request failed');
      } else {
         Todo.create(
            {
               author: { id: req.user._id, username: req.user.username },
               title: req.body.title
            },
            function(err, todo) {
               if (err) {
                  console.log(err);
                  res.send('Create todo request failed');
               } else {
                  list.todos.push(todo._id);
                  list.save(function(err) {
                     updateList(req.params.id, res, function(id, res) {
                        res.redirect('/lists/' + id);
                     });
                  });
               }
            }
         );
      }
   });
});
//DELETE
app.delete('/lists/:id/todo/:todo_id', isLoggedIn, isAuthor, function(
   req,
   res
) {
   Todo.findById(req.params.todo_id, function(err, todo) {
      if (err) {
         console.log(err);
         res.send('Delete todo request failed');
      } else {
         todo.remove();
         updateList(req.params.id, res, function() {
            res.redirect('/lists/' + req.params.id);
         });
      }
   });
});

/////////////////////////////////////////
//      list CRUD ROUTES
//INDEX
app.get('/lists', isLoggedIn, function(req, res) {
   List.find({ 'author.username': req.user.username }, function(err, lists) {
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
app.get('/lists/new', isLoggedIn, function(req, res) {
   res.render('./lists/new');
});
//SHOW
app.get('/lists/:id', isLoggedIn, isAuthor, function(req, res) {
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
app.put('/lists/:id', isLoggedIn, isAuthor, function(req, res) {
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
app.post('/lists', isLoggedIn, function(req, res) {
   List.create(
      {
         author: { id: req.user._id, username: req.user.username },
         title: req.body.title
      },
      function(err, list) {
         if (err) {
            console.log(err);
            res.send('Create list request failed');
         } else {
            res.redirect('/lists');
         }
      }
   );
});

//DELETE
app.delete('/lists/:id', isLoggedIn, isAuthor, function(req, res) {
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
