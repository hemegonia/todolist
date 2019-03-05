var mongoose = require('mongoose');
var List = require('./lists');

var todoSchema = new mongoose.Schema({
   title: String,
   creationDate: {
      type: Date,
      default: Date.now
   },
   modifiedDate: {
      type: Date,
      default: Date.now
   },
   complete: {
      type: Boolean,
      default: false
   },
   author: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      username: String
   }
});

todoSchema.pre('remove', function(next) {
   var todo = this;
   todo.model('List').updateMany(
      {
         todos: {
            $in: todo._id
         }
      },
      {
         $pull: {
            todos: todo._id
         }
      },
      next
   );
});

var Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
