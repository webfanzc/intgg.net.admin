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


require('./users');
require('./usersauth');
require('./materials');
require('./setups');
require('./interactions');
require('./droppacks');
require('./dropcenter');    //投放中心
require('./ondemands');    //投放中心
require('./crazygrab');    //疯抢

require('./user');
require('./message');

exports.Users = db.model('Users');
exports.UsersAuth = db.model('UsersAuth');
exports.Materials = db.model('Materials');
exports.Setups = db.model('Setups');
exports.Interactions = db.model('Interactions');
exports.Droppacks = db.model('Droppacks');
exports.Dropcenter = db.model('Dropcenter');
exports.Ondemands = db.model('Ondemands');
exports.Crazygrab = db.model('Crazygrab');

exports.User = db.model('User');
exports.Message = db.model('Message');

exports.close = function(){
    db.close(function(){
        console.log('Close Mongodb !');
    });
};