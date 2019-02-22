var mongoose = require('mongoose');

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

var Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;