/**
 * Created by rubinus on 2016/11/11.
 */

var express = require('express');
var materialRouter = express.Router();
var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId;


var URL = require('url'),
    async = require('async'),
    _ = require('underscore'),
    moment = require('moment');

var redisDaos = require('../lib/redis');
var usersDao = require('../daos/usersDao');
var materialsDao = require('../daos/materialsDao');

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

//查询素材分页列表
materialRouter.get('/list', function (req, res, next) {
    var params = URL.parse(req.url, true);
    var queryParams = req.query;
    var intid = queryParams.intid,
        token = queryParams.token,
        type = queryParams.type,
        position = queryParams.position,
        date = queryParams.date,
        name = queryParams.name;
        queryParams.pageSize = queryParams.pageSize || 30;
        queryParams.pageNum = queryParams.pageNum || 1;

    var status = 400,
        errmsg = "";

    logger.info('----req.body or query-----',req.body || req.query);



    if (_.isEmpty(intid) || _.isEmpty(token)) {
        errmsg = "intid or token is empty.";
    }

    if (!_.isEmpty(date) && !moment(date, 'YYYY-MM-DD', true).isValid()) {
        errmsg = "the date is not valid.";
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

            var condition = {intid:intid};
            if(!_.isEmpty(type)){
                _.extend(condition,{type:type})
            }
            if(!_.isEmpty(position)){
                _.extend(condition,{position:position})
            }
            if(!_.isEmpty(name)){
                var regstr = new RegExp(name,"gi");
                _.extend(condition,{name:regstr});
            }
            if(!_.isEmpty(date)){
                var endDate = moment(date).add(1,"d");
                var st = moment(date).valueOf();
                var et = moment(endDate).valueOf();
                _.extend(condition,{createTime:{$gte: st, $lte:et}});
            }
            materialsDao.getList(condition, null,queryParams, function (err, result) {
                //logger.info(condition,result);
                if (err) {
                    status = 500;
                    return callback(err);
                }

                callback(null,result);
            });

        }]
    }, function (err, results) {

        if(err){
            return utils.resToClient(res, params, {status: status, msg: err.message});
        }

        var data = results.getInfoByintid;
        _.extend(data, {status: 200,hosts: config.HOSTS});

        utils.resToClient(res, params, data);

    });


});

//保存素材
materialRouter.post('/save',function (req, res, next) {
    var params = URL.parse(req.url, true);
    var intid = req.query.intid,
        token = req.query.token;
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
    if (_.isEmpty(body.name) || _.isEmpty(body.url)) {
        errmsg = "material name and url must be have.";
    }
    if(errmsg){
        return utils.resToClient(res, params, {status: status, msg: errmsg});
    }

    body = _.omit(body,"createTime", "updateTime","verified", "intid","_id");


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
        saveMate: ["checkintid",function (result, callback) {
            _.extend(body,{intid: intid}); //把当前用户放进mate的intid字段中
            materialsDao.save(body,function(err,reply){
                if (err) {  //内部服务错误
                    status = 500;
                    return callback(err);
                }
                if (_.isEmpty(reply)) { //保存失败
                    return callback(new Error("save material is fail."));
                }
                callback(null,reply);
            });
        }]
    }, function (err, results) {

        if(err){
            return utils.resToClient(res, params, {status: status || 500, msg: err.message});
        }

        utils.resToClient(res,params,{status: 200, data: results.saveMate, hosts: config.HOSTS, msg:"保存成功"});

    });

});

//更新素材
materialRouter.post('/update',function (req, res, next) {
    var params = URL.parse(req.url, true);
    var intid = req.query.intid,
        token = req.query.token,
        materialid = req.query._id;
    var body = req.body;

    //首先check用户的intid和token是否合法

    logger.info('----req.body or query-----',req.body || req.query);

    var status = 400,
        errmsg = "";

    if (_.isEmpty(intid) || _.isEmpty(token)) {
        errmsg = "intid or token is empty.";
    }
    if (_.isEmpty(materialid)){
        errmsg = "material _id is empty";
    }
    if (_.isEmpty(body)) {
        errmsg = "request body is empty.";
    }
    if (_.isEmpty(body.name) || _.isEmpty(body.url)) {
        errmsg = "material name and url must be have.";
    }
    if(errmsg){
        return utils.resToClient(res, params, {status: status, msg: errmsg});
    }

    body = _.omit(body,"createTime", "updateTime","verified", "intid","_id");

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
            materialsDao.findById(materialid,function(err,reply){
                //logger.info(err,reply);
                if (err) {  //内部服务错误
                    status = 500;
                    return callback(err);
                }
                if (_.isEmpty(reply)) {  //不存在
                    status = 404;
                    return callback(new Error("material is not exist."));
                }
                if (reply.intid != intid) {  //不是当前用户的素材
                    status = 401;
                    return callback(new Error("material is not match this user can't be update."));
                }
                callback(null,reply);
            });
        }],
        saveToMongo: ["checkintid",function (result, callback) {
            materialsDao.update({_id: materialid},body,null,function(err,reply){
                if (err) {  //内部服务错误
                    status = 500;
                    return callback(err);
                }
                if (_.isEmpty(reply)) { //保存失败
                    return callback(new Error("update material is fail."));
                }
                callback(null,reply);
            });
        }]
    }, function (err, results) {

        if(err){
            return utils.resToClient(res, params, {status: status || 500, msg: err.message});
        }

        utils.resToClient(res,params,{status: 200, data: results.saveToMongo, hosts: config.HOSTS, msg:"更新成功"});

    });

});

//删除素材
materialRouter.post('/del',function (req, res, next) {
    var params = URL.parse(req.url, true);
    var intid = req.query.intid,
        token = req.query.token,
        materialid = req.query._id || "";

    //首先check用户的intid和token是否合法

    logger.info('----req.body or query-----',req.body || req.query);

    var status = 400,
        errmsg = "";

    if (_.isEmpty(intid) || _.isEmpty(token)) {
        errmsg = "intid or token is empty.";
    }
    if (_.isEmpty(materialid)) {
        errmsg = "material _id must be have.";
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
        checkintid: ["checktoken",function (result, callback) {
            materialsDao.findById(materialid,function(err,reply){
                logger.info(err,reply);
                if (err) {  //内部服务错误
                    status = 500;
                    return callback(err);
                }
                if (_.isEmpty(reply)) {  //不存在
                    status = 404;
                    return callback(new Error("material is not exist."));
                }
                if (reply.intid != intid) {  //不是当前用户的素材
                    status = 401;
                    return callback(new Error("material is not match this user can't be deleted."));
                }
                callback(null,reply);
            });
        }],
        saveToMongo: ["checkintid",function (result, callback) {
            materialsDao.del({_id:materialid},null,function(err,reply){
                if (err) {  //内部服务错误
                    status = 500;
                    return callback(err);
                }
                if (_.isEmpty(reply)) { //删除失败
                    return callback(new Error("del material is fail."));
                }
                callback(null,reply);
            });
        }]
    }, function (err, results) {

        if(err){
            return utils.resToClient(res, params, {status: status || 500, msg: err.message});
        }

        utils.resToClient(res,params,{status: 200, data: results.saveToMongo, msg:"删除成功"});

    });

});

module.exports = materialRouter;