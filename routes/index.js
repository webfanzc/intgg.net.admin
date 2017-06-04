
var _ = require('underscore');

var messageRoutes = require('./messages');
var userRoutes = require('./user');
var authRouter = require('./auth');
var h5Router = require('./h5');
var materialsRouter = require('./materialsRouter');
var setupsRouter = require('./setupsRouter');
var config = require('../config');

exports.runApp = function(app){

    app.use('/user', userRoutes);

    app.use('/materials', materialsRouter); //素材
    app.use('/setups', setupsRouter);   //设置

    //ronghui test route
    app.get('/admin', function (req, res, next) {
        res.render('admin_index');
    });

    app.use('/', function (req, res, next) {
        res.render('index',_.extend(config.loginCallback,{appid: config.PC.appid}));
    });

};
