/**
 * Created by gy104 on 17/8/1.
 */
var express = require('express');
var stickersRouter = express.Router();
var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId;

var jwt = require('jsonwebtoken');
var URL = require('url'),
    async = require('async'),
    _ = require('underscore'),
    moment = require('moment');

var stickersDao = require('../daos/stickersDao');
var utils = require("../utils");
var config = require("../config");


stickersRouter.use('/',function (req,res,next) {
    var params = URL.parse(req.url, true);
    var queryParams = req.query,
        token = queryParams.token;
    jwt.verify(token, 'secret', function(err,decoded) {
        if(err) {
            status = 505;

            return utils.resToClient(res, params, {status: status, msg: 'token is  null'});
        }
        next();
    })
})

// 查询贴片列表

stickersRouter.get('/list', function(req, res, next) {
    var params = URL.parse(req.url, true);
    var queryParams = req.query;
    var total = queryParams.total,
        verified = queryParams.verified;
        date = queryParams.date;
    queryParams.pageSize = queryParams.pageSize || 30;
    queryParams.pageNum = queryParams.pageNum || 1;

    var status = 400,
        errmsg = "";



    if (!_.isEmpty(date) && !moment(date, 'YYYY-MM-DD', true).isValid()) {
        errmsg = "the date is not valid.";
    }

    if(errmsg) {
        return utils.resToClient(res, params, {status: status, msg: errmsg});
    }

    async.auto({
        getInfoByintid: function(callback) {
            var condition = {};
            // if(verified == 0) {
            //     _.extend(condition, {verified: 0})
            // }else {
            //     _.extend(condition,{verified: {$gte: verified}})
            // }
            if(!_.isEmpty(date)){
                var endDate = moment(date).add(1,"d");
                var st = moment(date).valueOf();
                var et = moment(endDate).valueOf();
                _.extend(condition,{createTime:{$gte: st, $lte:et}});
            }
            if(!_.isEmpty(total)) {
                _.extend(condition, {total: total})
            }
            stickersDao.getList(condition, null, queryParams, function(err, result){
                if(err) {
                    status = 500;
                    return callback(err);
                }
                callback(null, result);
            })
        }
    },function (err,results) {
        if(err) {
            return utils.resToClient(res, params, {status: status, msg: err.message});
        }

        var data = results.getInfoByintid;
        _.extend(data, {status: 200, hosts: config.HOSTS});
        utils.resToClient(res,params,data);
    });

});

stickersRouter.get('/get', function(req, res, next) {
    var params = URL.parse(req.url, true);
    var queryParams = req.query;
    var intid = queryParams.intid,
        materialid = queryParams.materialid,
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
        getInfoByintid: ['checktoken', function(result, callback) {

            stickersDao.findOne({intid: intid, materialid: materialid}, null, function(err,result) {
                if(err) {
                    status = 500;
                    return callback(err);
                }
                callback(null, result);
            })
        }]
    }, function(err, results) {
        if(err) {
            return utils.resToClient(res, params, {status: status, msg: err.message})
        }

        var data = results.getInfoByintid;
        if(_.isEmpty(data)) {
            status = 404;
        }else {
            status = 200;
        }
        utils.resToClient(res, params, {status: status, data: data, hosts: config.HOSTS});
    })
})

// 保存素材到贴片

stickersRouter.post('/save', function(req, res, next) {
    var params = URL.parse(req.url, true);

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
    if (_.isEmpty(body.materialid) || _.isEmpty(body.total)) {
        errmsg = "all input must be have.";
    }
    var userSetup = {};
    var materialid = body.materialid;

    body = _.omit(body, 'materialid', "createTime", "updateTime", "intid", "_id");

    body.verified = 0; //  添加就是待审核状态
    body.verifiedMsg = ''; //  添加审核信息；

    if(errmsg) {
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
        checkid: ["checkintid", function(result,callback){
            var condition = {intid: intid,materialid:materialid};
            stickersDao.findOne(condition,null,function(err,reply){
                if (err) {  //内部服务错误
                    status = 503;
                    return callback(err);
                }
                if(_.isEmpty(reply)){ //添加
                    callback(null,"add");
                }else{  //更新
                    if(reply.intid != intid){
                        return callback(new Error("sticker is not match this user can't be update."));
                    }
                    userSetup = reply;
                    callback(null,"update");
                }
            });
        }],

        saveToMongo: ["checkid", function(result, callback) {
            if(result.checkid === 'add' && !_.isEmpty(materialid)) {
                _.extend(body, {intid: intid,materialid: materialid});  // 把当前用户放进sticker的intid和materialid 字段中
                stickersDao.save(body, function(err, reply) {
                    if(err) {
                        status = 507;
                        return callback(err);
                    }
                    if(_.isEmpty(reply)) {
                        return callback(new Error("save is fail"));
                    }
                    callback(null, reply);
                })
            }else {
                callback(null);
            }
        }],

        updateToMongo: ["checkid", "saveToMongo", function(result, callback) {
            if(result.checkid === 'update') {
                if(_.isEmpty(materialid)) {
                    return callback(new Error('material is lost'));
                }
                body = _.omit(body, "use");
                stickersDao.update({intid: intid, materialid: materialid}, body, null, function(err, reply){
                    if(err) {  // 内部服务错误
                        status = 500;
                        return callback(err);
                    }
                    if(_.isEmpty(reply)) {
                        return callback(new Error("update is fail"));
                    }
                    callback(null, reply);
                })
            }else {
                callback(null);
            }
        }]


    },function(err, results) {
        if(err) {
            return utils.resToClient(res, params, {status: status || 500, msg: err.message});
        }
        utils.resToClient(res, params, {status: 200, msg: "保存成功", hosts: config.HOSTS,data: results.saveToMongo || results.updateToMongo || userSetup})
    });
});


//更新
stickersRouter.post('/update',function (req, res, next) {
    var params = URL.parse(req.url, true);
    var stickerid = req.query._id;
    var body = req.body;

    //首先check用户的intid和token是否合法


    var status = 400,
        errmsg = "";
    if (_.isEmpty(stickerid)){
        errmsg = "stickerid _id is empty";
    }
    if (_.isEmpty(body)) {
        errmsg = "request body is empty.";
    }
    if(errmsg){
        return utils.resToClient(res, params, {status: status, msg: errmsg});
    }

    body = _.omit(body,"materialid","createTime", "updateTime", "intid","_id");

    async.auto({

        saveToMongo: function (callback) {
            stickersDao.update({_id: stickerid},body,null,function(err,reply){
                if (err) {  //内部服务错误
                    status = 500;
                    return callback(err);
                }
                if (_.isEmpty(reply)) { //保存失败
                    return callback(new Error("update crazygrab is fail."));
                }
                callback(null,reply);
            });
        }
    }, function (err, results) {

        if(err){
            return utils.resToClient(res, params, {status: status || 500, msg: err.message});
        }

        utils.resToClient(res,params,{status: 200, data: results.saveToMongo, hosts: config.HOSTS, msg:"更新成功"});

    });

});

stickersRouter.post('/del',function (req, res, next) {
    var params = URL.parse(req.url, true);
    var materialid = req.query.materialid;
        stickersid = req.query._id || "";

    //首先check用户的intid和token是否合法

    var status = 400,
        errmsg = "";
    if(_.isEmpty(stickersid)) {
        errmsg = "_id is nul";
    }
    if(errmsg){
        return utils.resToClient(res, params, {status: status, msg: errmsg});
    }

    async.auto({
        saveToMongo:function (callback) {
            var condition = {};
            if(!_.isEmpty(stickersid)) {
                _.extend(condition,{_id: stickersid})
            }
            if(!_.isEmpty(materialid)) {
                _.extend(condition,{materialid: materialid})
            }
            stickersDao.del(condition,null,function(err,reply){
                if (err) {  //内部服务错误
                    status = 500;
                    return callback(err);
                }
                if (_.isEmpty(reply)) { //删除失败
                    return callback(new Error("del sticker is fail."));
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
module.exports = stickersRouter;