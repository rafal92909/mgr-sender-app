var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name: {type: String, required: true},
    desc: {type: String, required: true}    
});

module.exports = mongoose.model('Item', schema);