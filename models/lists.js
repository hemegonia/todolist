var mongoose = require('mongoose');

var listSchema = new mongoose.Schema({
    name: String,
    author: String,
    description: {
        type: String,
        default: ""
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    modifiedDate: {
        type: Date,
        default: Date.now
    },
    todos: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Todo'
    }]
});

var List = mongoose.model('List', listSchema);

module.exports = List;