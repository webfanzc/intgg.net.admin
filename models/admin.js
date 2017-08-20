var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
    password: {type: String, required: true},
    createTime: {type: Number},
    username: {type: String, required: true, unique: true},
});

schema.plugin(mongooseUniqueValidator);

mongoose.model('Admin', schema);