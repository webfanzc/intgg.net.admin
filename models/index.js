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
require('./users')
require('./admin');
require('./stickers');
require('./droppacks');
require('./moneys');
exports.Materials = db.model('Materials');
exports.Setups = db.model('Setups');
exports.Droppacks = db.model("Droppacks");

exports.Admin = db.model('Admin');
exports.Stickers = db.model('Stickers');
exports.Users = db.model('Users');
exports.Moneys = db.model('Moneys');

exports.close = function(){
    db.close(function(){
        console.log('Close Mongodb !');
    });
};