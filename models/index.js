/**
 * Created with JetBrains WebStorm.
 * User: Rubinus
 * Date: 13-05-30
 * Time: 下午10:42
 */
var mongoose = require('mongoose');
var config = require('../config');

var db = mongoose.createConnection(config.mongodb.str, config.mongodb.opts, function (error) {
    if (error) {
        console.error('connect to MongoDB error: ', error);
        process.exit(1);
    }
});


require('./materials');
require('./setups');

require('./user');

exports.Materials = db.model('Materials');
exports.Setups = db.model('Setups');

exports.User = db.model('User');

exports.close = function(){
    db.close(function(){
        console.log('Close Mongodb !');
    });
};