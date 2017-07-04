var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Item = require('./item');

var schema = new Schema({
    key: { type: String, required: true },
    type: { type: String, required: true },
    value: { type: String, required: true },
    item: { type: Schema.Types.ObjectId, ref: 'Item' }
});        

module.exports = mongoose.model('DataFramePart', schema);