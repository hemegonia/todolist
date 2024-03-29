var mongoose = require('mongoose');
var Todo = require('./todos');

var listSchema = new mongoose.Schema({
   title: String,
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
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Todo'
      }
   ],
   complete: {
      type: Boolean,
      default: false
   },
   author: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      username: String
   }
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
