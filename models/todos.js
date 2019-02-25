var mongoose = require('mongoose');
var List = require('./lists');

var todoSchema = new mongoose.Schema({
   text: String,
   author: String,
   creationDate: {
      type: Date,
      default: Date.now
   },
   modifiedDate: {
      type: Date,
      default: Date.now
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
