var express = require('express');
var adminRouter = express.Router();
var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types,ObjectId;

var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var URL = require('url'),
    async = require('async'),
    _ = require('underscore'),
    moment = require('moment');

var adminDao = require('../daos/adminDao');

var utils = require('../utils');
var config = require("../config")

adminRouter.post('/signin', function (req, res, next) {
    // var user = new User({
    //     firstName: req.body.firstName,
    //     lastName: req.body.lastName,
    //     password: bcrypt.hashSync(req.body.password, 10),
    //     email: req.body.email
    // });

    var params = req.params;
    var body = req.body;
    body.password = bcrypt.hashSync(body.password, 10);
    var status = 400,
        errmsg = "";
    console.log(body);

    async.auto({
        saveToMongo: function(callback) {
            adminDao.save(body, function(err, reply){
                if(err) {
                    status = 401;
                    return callback(err);
                }
                if(_.isEmpty(reply)) {
                    status = 404;
                    return callback(new Error('user save is fail'));
                }
                callback(null, reply);

            })
        }

    },function(err,results){
        if(err){
            return utils.resToClient(res, params, {status: status || 500, msg: err.message});
        }

        utils.resToClient(res,params,{status: 200, data: results.saveMate, hosts: config.HOSTS, msg:"保存成功"});

    })
    // user.save(function(err, result) {
    //     if (err) {
    //         return res.status(500).json({
    //             title: 'An error occurred',
    //             error: err
    //         });
    //     }
    //     res.status(201).json({
    //         message: 'User created',
    //         obj: result
    //     });
    // });
});

adminRouter.post('/login', function(req, res, next) {
    var params = URL.parse(req.url, true);
    var body = req.body;

    var status = 400,
        errmsg = "";

    if(_.isEmpty(body.username) || _.isEmpty(body.password)) {
        errmsg = '用户名和密码不能为空'
    }
    if(errmsg) {
        return utils.resToClient(res,params, {status: status, msg: errmsg});
    }
    async.auto({
        saveToMongo: function(callback){
            adminDao.findOne({username: body.username}, function(err, reply){
                if(err) {
                    status = 500;
                    return callback(err);
                }
                if(_.isEmpty(reply)) {
                    status = 401;
                    return callback(new Error('当前用户不存在'));
                }
                if(!bcrypt.compareSync(body.password, reply.password)) {
                    status = 401;
                    return callback(new Error('密码错误'));
                }
                callback(null, reply);
            })
        }
    },function(err, result){
        if(err) {
            return utils.resToClient(res,params, {status: status || 500, msg: err.message})
        }
        var token = jwt.sign({admin: result.saveToMongo},'secret',{expiresIn: 7200});
        utils.resToClient(res,params, {status: 200, msg: "登录成功", hosts: config.HOSTS, data:result.saveToMongo,token: token} )
    })
    // userDao.findOne({email: body.email}, function(err, user) {
    //     if (err) {
    //         return res.status(500).json({
    //             title: 'An error occurred',
    //             error: err
    //         });
    //     }
    //     if (!user) {
    //         return res.status(401).json({
    //             title: 'Login failed',
    //             error: {message: 'Invalid login credentials'}
    //         });
    //     }
    //     if (!bcrypt.compareSync(req.body.password, user.password)) {
    //         return res.status(401).json({
    //             title: 'Login failed',
    //             error: {message: 'Invalid login credentials'}
    //         });
    //     }
    //     var token = jwt.sign({user: user}, 'secret', {expiresIn: 7200});
    //     res.status(200).json({
    //         message: 'Successfully logged in',
    //         token: token,
    //         userId: user._id
    //     });
    // });
});


adminRouter.get('/list', function (req, res, next) {
    var params = URL.parse(req.url, true);
    var queryParams = req.query;
    queryParams.pageSize = queryParams.pageSize || 30;
    queryParams.pageNum = queryParams.pageNum || 1;
    var status = 400,
        errmsg = "";

    // logger.info('----req.body or query-----',req.body || req.query);


    if(errmsg){
        return utils.resToClient(res, params, {status: status, msg: errmsg});
    }


    async.auto({
        getInfoByintid: function (callback) {

            adminDao.getSetupsList(null, null, queryParams ,function (err, result) {
                var condition = {};
                if (err) {
                    status = 500;
                    return callback(err);
                }

                callback(null,result);
            });

        }
    }, function (err, results) {

        if(err){
            return utils.resToClient(res, params, {status: status, msg: err.message});
        }

        var data = results.getInfoByintid;
        _.extend(data, {status: 200,hosts: config.HOSTS});

        utils.resToClient(res, params, data);

    });


});


//删除素材
adminRouter.post('/del',function (req, res, next) {
    var params = URL.parse(req.url, true);
    var intid = req.query.intid,
        token = req.query.token,
        materialid = req.query._id || "";

    //首先check用户的intid和token是否合法


    async.auto({

        saveToMongo:function (callback) {
            adminDao.del({_id:materialid},null,function(err,reply){
                if (err) {  //内部服务错误
                    status = 500;
                    return callback(err);
                }
                if (_.isEmpty(reply)) { //删除失败
                    return callback(new Error("del material is fail."));
                }
                callback(null,reply);
            });
        }
    }, function (err, results) {

        if(err){
            return utils.resToClient(res, params, {status: status || 500, msg: err.message});
        }

        utils.resToClient(res,params,{status: 200, data: results.saveToMongo, msg:"删除成功"});

    });

});


module.exports = adminRouter;
