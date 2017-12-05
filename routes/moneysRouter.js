/**
 * Created by rubinus on 2016/11/11.
 */

var express = require('express');
var moneysRouter = express.Router();
var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId;

var jwt = require('jsonwebtoken');
var URL = require('url'),
    async = require('async'),
    _ = require('underscore'),
    moment = require('moment');

// var redisDaos = require('../lib/redis');
// var usersDao = require('../daos/usersDao');
var moneysDao = require('../daos/moneysDao');

var utils = require("../utils");
var config = require("../config");

moneysRouter.use('/',function (req,res,next) {
    var params = URL.parse(req.url, true);
    var queryParams = req.query,
        token = queryParams.token;
    jwt.verify(token, 'secret', function(err,decoded) {
        if(err) {
            var status = 505;

            return utils.resToClient(res, params, {status: status, msg: 'token is 佛挡杀佛 null'});
        }
        next();
    })
});

// var clientUserToken = utils.newRedisClient(config.userTokenRedisPort,config.userTokenRedisHost,5);

//查询交易分页列表
moneysRouter.get('/list', function (req, res, next) {
    var params = URL.parse(req.url, true);
    var queryParams = req.query;
    var intid = queryParams.intid,
        token = queryParams.token,
        date = queryParams.date,
        tradeNumber = queryParams.tradeNumber,
        tradeType = queryParams.tradeType;
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

            if(!_.isEmpty(tradeType)){
                _.extend(condition,{tradeType:tradeType * 1});
            }
            if(!_.isEmpty(tradeNumber)){
                _.extend(condition,{tradeNumber: tradeNumber})
            }
            if(!_.isEmpty(date)){
                var endDate = moment(date).add(1,"d");
                var st = moment(date).valueOf();
                var et = moment(endDate).valueOf();
                _.extend(condition,{createTime:{$gte: st, $lte:et}});
            }
            moneysDao.getList(condition, null,queryParams, function (err, result) {
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

//保存交易
moneysRouter.post('/save',function (req, res, next) {
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
    //if (_.isEmpty(body.tradeType)) {
    //    errmsg = "money tradeType must be have.";
    //}
    if(errmsg){
        return utils.resToClient(res, params, {status: status, msg: errmsg});
    }

    body = _.omit(body,"invoiceInfo","createTime", "updateTime","intid","_id");


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
            _.extend(body,{intid: ObjectId(intid)}); //把当前用户放进mate的intid字段中
            moneysDao.save(body,function(err,reply){
                if (err) {  //内部服务错误
                    status = 500;
                    return callback(err);
                }
                if (_.isEmpty(reply)) { //保存失败
                    return callback(new Error("save money trade is fail."));
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

moneysRouter.get("/get",function(req,res,next) {
    var params = URL.parse(req.url, true);
    var queryParams = req.query;
    var intid = queryParams.intid,
        token = queryParams.token;
    var sourceId = queryParams.sourceId;
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
        checkAccount: ["checktoken", function(result, callback){
            var condition = {intid: intid};
            if(!_.isEmpty(sourceId)) {
                _.extend(condition, {sourceId: sourceId});
            }
            moneysDao.findOne(condition,null,function(err, reply) {
                if(err) {
                    status = 500;
                    return callback(err);
                }
                if(_.isEmpty(reply)) {
                    status = 404;
                    return callback(new Error('money is null'));
                }
                callback(null, reply);
            })

        }],
    }, function (err, results) {

        if(err){
            return utils.resToClient(res, params, {status: status, msg: err.message});
        }


        var data = results.checkAccount;
        utils.resToClient(res, params, {status: 200,hosts: config.HOSTS, data: data});

    });
});

// 查询余额

moneysRouter.get('/account',function(req, res, next){
    var params = URL.parse(req.url, true);
    var queryParams = req.query;
    var intid = queryParams.intid,
        tradeSuccess = queryParams.tradeSuccess;
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
        checkAccount: ["checktoken", function(result, callback){
            var condition = {intid: intid};
            if(!_.isEmpty(tradeSuccess)){
                _.extend(condition,{tradeSuccess: tradeSuccess});
            }
            moneysDao.findOne(condition,null,function(err, reply) {
                if(err) {
                    status = 500;
                    return callback(err);
                }
                if(_.isEmpty(reply)) {
                    return callback(null);
                }
                callback(null, tradeSuccess);
            })

        }],
        getInfoByintid: ["checktoken", "checkAccount", function (result, callback) {

            var condition = {intid: mongoose.Types.ObjectId(intid),tradeDrop:1};

            moneysDao.moneySum(condition,function(err, result) {
                //logger.info(condition,result);
                if (err) {
                    status = 500;
                    return callback(err);
                }

                callback(null,result[0] || {});
            });

        }]
    }, function (err, results) {

        if(err){
            return utils.resToClient(res, params, {status: status, msg: err.message});
        }

        var data = results.getInfoByintid;
        var tradeSuc = results.checkAccount;
        _.extend(data, {tradeSuccess: tradeSuc});
        console.log(data);
        utils.resToClient(res, params, {status: 200,hosts: config.HOSTS, data: data});

    });
});

moneysRouter.get('/accountDrop',function(req, res, next){
    var params = URL.parse(req.url, true);
    var queryParams = req.query;
    var intid = queryParams.intid,
        tradeSuccess = queryParams.tradeSuccess;
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
        getInfoByintid: ["checktoken", function (result, callback) {

            var condition = {intid: mongoose.Types.ObjectId(intid),tradeDrop: 2};

            moneysDao.moneySum(condition,function(err, result) {
                //logger.info(condition,result);
                if (err) {
                    status = 500;
                    return callback(err);
                }

                callback(null,result[0] || {});
            });

        }]
    }, function (err, results) {

        if(err){
            return utils.resToClient(res, params, {status: status, msg: err.message});
        }

        var data = results.getInfoByintid;
        var tradeSuc = results.checkAccount;
        _.extend(data, {tradeSuccess: tradeSuc});
        console.log(data);
        utils.resToClient(res, params, {status: 200,hosts: config.HOSTS, data: data});

    });
});

//更新交易
moneysRouter.post('/update',function (req, res, next) {
    var params = URL.parse(req.url, true);
    var intid = req.query.intid,
        token = req.query.token,
        moneyid = req.query._id;
    var body = req.body;

    //首先check用户的intid和token是否合法

    logger.info('----req.body or query-----',req.body || req.query);

    console.log(body);

    var status = 400,
        errmsg = "";

    if (_.isEmpty(intid) || _.isEmpty(token)) {
        errmsg = "intid or token is empty.";
    }
    if (_.isEmpty(moneyid)){
        errmsg = "droppack _id is empty";
    }
    if (_.isEmpty(body)) {
        errmsg = "request body is empty.";
    }
    if(errmsg){
        return utils.resToClient(res, params, {status: status, msg: errmsg});
    }

    body = _.omit(body,"createTime", "updateTime","intid","_id");

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
            moneysDao.findById(moneyid,function(err,reply){
                //logger.info(err,reply);
                if (err) {  //内部服务错误
                    status = 500;
                    return callback(err);
                }
                if (_.isEmpty(reply)) {  //不存在
                    status = 404;
                    return callback(new Error("droppack is not exist."));
                }
                if (reply.intid != intid) {  //不是当前用户的投放包
                    status = 401;
                    return callback(new Error("droppack is not match this user can't be update."));
                }
                callback(null,reply);
            });
        }],
        saveToMongo: ["checkintid",function (result, callback) {
            moneysDao.update({_id: moneyid},body,null,function(err,reply){
                if (err) {  //内部服务错误
                    status = 500;
                    return callback(err);
                }
                if (_.isEmpty(reply)) { //保存失败
                    return callback(new Error("update droppack is fail."));
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

//删除投放包
moneysRouter.post('/del',function (req, res, next) {
    var params = URL.parse(req.url, true);
    var intid = req.query.intid,
        moneysid = req.query._id || "";
    var sourceId = req.query.sourceId;

    //首先check用户的intid和token是否合法
    // logger.info('----req.body or query-----',req.body || req.query);

    var status = 400,
        errmsg = "";
    //
    if (_.isEmpty(intid) || _.isEmpty(sourceId)) {
        errmsg = "intid or token is empty.";
    }
    // if (_.isEmpty(dropcenterid)) {
    //     errmsg = "droppack _id must be have.";
    // }
    if(errmsg){
        return utils.resToClient(res, params, {status: status, msg: errmsg});
    }
    var money = {};
    async.auto({
        checkintid: function (callback) {
            // var condition = {intid: intid};
            // if(!_.isEmpty(sourceId)) {
            //     _.extend(condition, {sourceId: sourceId});
            // }
            // moneysDao.findOne(condition,null,function(err, reply) {
            //     if(err) {
            //         status = 500;
            //         return callback(err);
            //     }
            //     if(_.isEmpty(reply)) {
            //         return callback(null);
            //     }
            //     money = reply;
            //     callback(null, reply);
            // })
            var condition = {intid: intid};
            if(!_.isEmpty(sourceId)) {
                _.extend(condition,{sourceId: sourceId})
            }
            // logger.info('------',result.checkintid);
            moneysDao.del(condition,null,function(err,reply){
                if (err) {  //内部服务错误
                    status = 500;
                    return callback(err);
                }
                if (_.isEmpty(reply)) { //删除失败
                    return callback(new Error("del droppack is fail."));
                }
                callback(null,reply);
            });
        },
        // saveToMongo:["checkintid", function (result, callback) {
        //     var condition = {_id: money._id};
        //     if(!_.isEmpty(sourceId)) {
        //         _.extend(condition,{sourceId: sourceId})
        //     }
        //     // logger.info('------',result.checkintid);
        //     moneysDao.del(condition,null,function(err,reply){
        //         if (err) {  //内部服务错误
        //             status = 500;
        //             return callback(err);
        //         }
        //         if (_.isEmpty(reply)) { //删除失败
        //             return callback(new Error("del droppack is fail."));
        //         }
        //         callback(null,reply);
        //     });
        // }],
    }, function (err, results) {

        if(err){
            return utils.resToClient(res, params, {status: status || 500, msg: err.message});
        }

        utils.resToClient(res,params,{status: 200, data: results.saveToMongo, msg:"删除成功"});

    });

});

module.exports = moneysRouter;