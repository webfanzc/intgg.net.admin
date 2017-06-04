/**
 * Created by rubinus on 2016/11/11.
 */

var express = require('express');
var setupsRouter = express.Router();

var URL = require('url'),
    async = require('async'),
    _ = require('underscore'),
    moment = require('moment');

var redisDaos = require('../lib/redis');
var usersDao = require('../daos/usersDao');
var setupsDao = require('../daos/setupsDao');

var utils = require("../utils");
var config = require("../config");
var logger = require("../Logger");

var clientUserToken = utils.newRedisClient(config.userTokenRedisPort,config.userTokenRedisHost,5);


//async.auto({
//    checktoken: function(callback){
//
//    },
//    getTicket: ["checktoken",function (result, callback) {
//        callback(null);
//
//    }],
//    createQrcode: ["getTicket",function (result, callback) {
//        callback(null);
//
//    }],
//    saveRedis: ["createQrcode",function (result, callback) {
//        callback(null);
//
//    }]
//},function(err,results){
//
//});

//查询设置
setupsRouter.get('/get', function (req, res, next) {
    var params = URL.parse(req.url, true);
    var queryParams = req.query;
    var intid = queryParams.intid,
        token = queryParams.token;

    var status = 400,
        errmsg = "";

    logger.info('----req.body or query-----',req.body || req.query);


    if (_.isEmpty(intid) || _.isEmpty(token)) {
        errmsg = "intid or token is empty.";
    }
    if(errmsg){
        return utils.resToClient(res, params, {status: status, msg: errmsg});
    }


    async.auto({
        checktoken: function (callback) {
            redisDaos.getHashObj(clientUserToken,"TOKEN:" + intid,function(err,reply){
                if(err){
                    status = 500;
                    return callback(err);
                }
                if(_.isEmpty(reply) || _.isUndefined(reply)){
                    status = 505;
                    return callback(new Error("cache token is empty."));
                }
                if(reply.token !== token){
                    status = 505;
                    return callback(new Error("token is invalid."));
                }

                callback(null);
            });
        },
        getInfoByintid: ["checktoken",function (result, callback) {

            setupsDao.findOne({intid: intid}, null, function (err, result) {
                if (err) {
                    status = 500;
                    return callback(err);
                }

                var currTime = moment().valueOf();
                if(result.expireTime && currTime > result.expireTime){
                    result.verified = 3;
                    result.verifiedMsg = "您的认证信息已过期,请重新提交审核资料";
                }
                callback(null,result);
            });

        }]
    }, function (err, results) {

        if(err){
            return utils.resToClient(res, params, {status: status, msg: err.message});
        }

        var data = results.getInfoByintid;
        if(_.isEmpty(data)){
            status = 404;
        }else{
            status = 200;
        }

        utils.resToClient(res, params, {status: status, data: data, hosts: config.HOSTS});

    });


});

//保存设置
setupsRouter.post('/save',function (req, res, next) {
    var params = URL.parse(req.url, true);
    var intid = req.query.intid,
        token = req.query.token,
        setupid = req.query._id;
    var body = req.body;
    //首先check用户的intid和token是否合法

    logger.info('----req.body or query-----',req.body || req.query);

    var status = 400,
        errmsg = "";

    if (_.isEmpty(intid) || _.isEmpty(token)) {
        errmsg = "intid or token is empty.";
    }
    if (_.isEmpty(body)) {
        errmsg = "request body is empty.";
    }
    if (_.isEmpty(body.name) || _.isEmpty(body.idtype) || _.isEmpty(body.idcard) || _.isEmpty(body.idphoto) || _.isEmpty(body.phone) || _.isEmpty(body.email)) {
        errmsg = "all input must be have.";
    }

    if(typeof body.idphoto === "string"){
        body.idphoto = JSON.parse(body.idphoto);
    }
    body = _.omit(body,"verifiedMsg", "expireTime", "createTime", "updateTime","intid","_id");
    body.verified = 0; //只要点保存就是重新提交审核
    body.verifiedMsg = "您提交的信息正在审核，请您耐心等待";


    if(_.isEmpty(body.idphoto)){
        errmsg = "idphoto must be have a value.";
    }

    if(errmsg){
        return utils.resToClient(res, params, {status: status, msg: errmsg});
    }

    var userSetup = {};
    async.auto({
        checktoken: function (callback) {
            redisDaos.getHashObj(clientUserToken,"TOKEN:" + intid,function(err,reply){
                if(err){
                    status = 500;
                    return callback(err);
                }
                if(_.isEmpty(reply) || _.isUndefined(reply)){
                    status = 505;
                    return callback(new Error("cache token is empty."));
                }
                if(reply.token !== token){
                    status = 505;
                    return callback(new Error("token is invalid."));
                }

                callback(null);
            });
        },
        checkintid: ["checktoken",function (result, callback) {
            usersDao.findById(intid,function(err,reply){
                //logger.info(err,reply);
                if (err) {  //内部服务错误
                    status = 500;
                    return callback(err);
                }
                if (_.isEmpty(reply)) {  //用户不存在
                    status = 404;
                    return callback(new Error("user is not exist."));
                }
                callback(null,reply);
            });
        }],
        checkidcard: ["checkintid", function(result,callback){
            var condition = {idcard: body.idcard,idtype: body.idtype};
            if(!_.isEmpty(setupid)){
                condition = {_id: setupid};
            }
            setupsDao.findOne(condition,null,function(err,reply){
                if (err) {  //内部服务错误
                    status = 500;
                    return callback(err);
                }
                if(_.isEmpty(reply)){ //添加
                    callback(null,"add");
                }else{  //更新
                    if(reply.intid != intid){
                        return callback(new Error("setup is not match this user can't be update."));
                    }
                    userSetup = reply;
                    callback(null,"update");
                }
            });
        }],
        saveToMongo: ["checkidcard",function (result, callback) {
            if(result.checkidcard === "add" && _.isEmpty(setupid)){
                _.extend(body,{intid: intid}); //把当前用户放进setups的intid字段中
                setupsDao.save(body,function(err,reply){
                    if (err) {  //内部服务错误
                        status = 500;
                        return callback(err);
                    }
                    if (_.isEmpty(reply)) { //保存失败
                        return callback(new Error("save is fail."));
                    }
                    callback(null,reply);
                });
            }else{
                callback(null);
            }

        }],
        updateToMongo: ["checkidcard","saveToMongo",function (result, callback) {
            if(result.checkidcard === "update"){
                if(_.isEmpty(setupid)){
                    return callback(new Error("_id is lost."));
                }
                body = _.omit(body,"idtype");   //如果是更新就不能改变idtype的类型

                setupsDao.update({_id: setupid},body,null,function(err,reply){
                    if (err) {  //内部服务错误
                        status = 500;
                        return callback(err);
                    }
                    if (_.isEmpty(reply)) { //保存失败
                        return callback(new Error("update is fail."));
                    }
                    callback(null,reply);
                });
            }else{
                callback(null);
            }

        }]
    }, function (err, results) {
        //logger.info(results,setupid,userSetup);

        if(err){
            return utils.resToClient(res, params, {status: status || 500, msg: err.message});
        }

        utils.resToClient(res,params,{status: 200, msg:"保存成功", hosts: config.HOSTS, data: results.saveToMongo || results.updateToMongo || userSetup});

    });

});

module.exports = setupsRouter;