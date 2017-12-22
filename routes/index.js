
var _ = require('underscore');

// var messageRoutes = require('./messages');
// var userRoutes = require('./user');
// var authRouter = require('./auth');
// var h5Router = require('./h5');
var materialsRouter = require('./materialsRouter');
var setupsRouter = require('./setupsRouter');
var adminRouter = require('./adminRouter');
var stickerRouter = require('./stickersRouter');
var droppacksRouter = require('./droppacksRouter');
var moneysRouter = require('./moneysRouter');
var crazygrabRouter = require('./crazygrabRouter');
var config = require('../config');

exports.runApp = function(app){
    //
    // app.use('/user', userRoutes);

    app.use('/materials', materialsRouter); //素材
    app.use('/setups', setupsRouter);   //设置
    app.use('/admin',adminRouter); // 后台登录注册
    app.use('/sticker', stickerRouter); // 贴片审核
    app.use('/droppacks',droppacksRouter);  // 投放包审核
    app.use('/moneys',moneysRouter);
    app.use('/crazygrab',crazygrabRouter);
    // //ronghui test route
    // app.get('/admin', function (req, res, next) {
    //     res.render('admin_index');
    // });

    app.use('/', function (req, res, next) {
        res.render('index',_.extend(config.loginCallback,{appid: config.PC.appid}));
    });

};
