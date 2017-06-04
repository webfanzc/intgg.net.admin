
var _ = require('underscore');

var messageRoutes = require('./messages');
var userRoutes = require('./user');
var authRouter = require('./auth');
var h5Router = require('./h5');
var dashboardRouter = require('./dashboard');
var uploadRouter = require('./uploadRouter');
var materialsRouter = require('./materialsRouter');
var setupsRouter = require('./setupsRouter');
var interactionsRouter = require('./interactionsRouter');
var droppacksRouter = require('./droppacksRouter');
var dropcenterRouter = require('./dropcenterRouter');
var ondemandRouter = require('./ondemandRouter');
var crazygrabRouter = require('./crazygrabRouter');
var config = require('../config');

exports.runApp = function(app){

    app.use('/message', messageRoutes);

    app.use('/user', userRoutes);

    app.use('/auth', authRouter);

    app.use('/h5', h5Router);

    app.use('/dashboard', dashboardRouter);

    app.use('/upload', uploadRouter);

    app.use('/materials', materialsRouter); //素材
    app.use('/setups', setupsRouter);   //设置
    app.use('/interactions', interactionsRouter); //互动答题和投票
    app.use('/droppacks', droppacksRouter); //投放包
    app.use('/dropcenter', dropcenterRouter); //投放中心
    app.use('/ondemand', ondemandRouter); //投放中心
    app.use('/crazygrab', crazygrabRouter); //疯抢

    //ronghui test route
    app.get('/admin', function (req, res, next) {
        res.render('admin_index');
    });

    app.use('/', function (req, res, next) {
        res.render('index',_.extend(config.loginCallback,{appid: config.PC.appid}));
    });

};
