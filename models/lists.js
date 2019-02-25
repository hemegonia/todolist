var mongoose = require('mongoose');
var Todo = require('./todos');

var listSchema = new mongoose.Schema({
   name: String,
   author: String,
   description: {
      type: String,
      default: ''
   },
   creationDate: {
      type: Date,
      default: Date.now
   },
   modifiedDate: {
      type: Date,
      default: Date.now
   },
   todos: [
      {
         type: mongoose.Schema.ObjectId,
         ref: 'Todo'
      }
   ]
});

listSchema.pre('remove', function(next) {
   Todo.deleteMany(
      {
         _id: {
            $in: this.todos
         }
      },
      next
   );
});

var List = mongoose.model('List', listSchema);

module.exports = List;
