/**
 * Created by rubinus on 2016/11/11.
 */

var express = require('express');
var setupsRouter = express.Router();

var jwt = require('jsonwebtoken');
var URL = require('url'),
    async = require('async'),
    _ = require('underscore'),
    moment = require('moment');
// var redisDaos = require('../lib/redis');
// var usersDao = require('../daos/usersDao');
var setupsDao = require('../daos/setupsDao');

var utils = require("../utils");
var config = require("../config");
// var logger = require("../Logger");

// var clientUserToken = utils.newRedisClient(config.userTokenRedisPort,config.userTokenRedisHost,5);


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

setupsRouter.use('/',function (req,res,next) {
    var params = URL.parse(req.url, true);
    var queryParams = req.query,
        token = queryParams.token;
    jwt.verify(token, 'secret', function(err,decoded) {
        if(err) {
            status = 505;

            return utils.resToClient(res, params, {status: status, msg: 'token is null'});
        }
        next();
    })
})

//查询设置
setupsRouter.get('/list', function (req, res, next) {
    var params = URL.parse(req.url, true);
    var queryParams = req.query,
        token = queryParams.token;
    queryParams.pageSize = queryParams.pageSize || 30;
    queryParams.pageNum = queryParams.pageNum || 1;

    var status = 400,
        errmsg = "";

    // logger.info('----req.body or query-----',req.body || req.query);


    if(errmsg){
        return utils.resToClient(res, params, {status: status, msg: errmsg});
    }


    async.auto({

        // checktoken: function(callback) {
        //     jwt.verify(token, 'secret', function(err,decoded) {
        //         if(err) {
        //             status = 505;
        //             return callback(new Error('token is null'))
        //         }
        //         callback(null);
        //
        //     })
        // },
        getInfoByintid: function (callback) {

            setupsDao.getSetupsList(null, null, queryParams ,function (err, reply) {
                var condition = {};
                if (err) {
                    status = 500;
                    return callback(err);
                }

                callback(null,reply);
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

//保存设置
setupsRouter.post('/save',function (req, res, next) {
    var params = URL.parse(req.url, true);
    var setupid = req.query._id;
    var body = req.body;
    //首先check用户的intid和token是否合法

    // logger.info('----req.body or query-----',req.body || req.query);


    var status = 400,
        errmsg = "";


    if (_.isEmpty(body)) {
        errmsg = "request body is empty.";
    }
    // if (_.isEmpty(body.name) || _.isEmpty(body.idtype) || _.isEmpty(body.idcard) || _.isEmpty(body.idphoto) || _.isEmpty(body.phone) || _.isEmpty(body.email)) {
    //     errmsg = "all input must be have.";
    // }

    if(typeof body.idphoto === "string"){
        body.idphoto = JSON.parse(body.idphoto);
    }
    body = _.omit(body, "createTime", "updateTime","intid","_id");
    // body.verified = 0; //只要点保存就是重新提交审核
    // body.verifiedMsg = "您提交的信息正在审核，请您耐心等待";


    if(errmsg){
        return utils.resToClient(res, params, {status: status, msg: errmsg});
    }

    var userSetup = {};
    async.auto({

        // checktoken: function(callback){
        //     jwt.verify(token, 'secret', function (err,decoded) {
        //         if(err){
        //             st
        //         }
        //     })
        // },
        updateToMongo : function (callback) {

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


        }
    }, function (err, results) {
        //logger.info(results,setupid,userSetup);

        if(err){
            return utils.resToClient(res, params, {status: status || 500, msg: err.message});
        }

        utils.resToClient(res,params,{status: 200, msg:"保存成功", hosts: config.HOSTS, data: results.updateToMongo || userSetup});

    });

});
module.exports = setupsRouter;