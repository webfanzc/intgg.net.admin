/**
 * Created by rubinus on 2016/10/26.
 */
var redis = require('redis');
var jwt = require('jsonwebtoken');

var redisCluster = require('thunk-redis');

var config = require("../config"),
    _ = require('underscore'),
    moment = require('moment');

//创建redis 3.0 cluster client function
var redisCluster = require('thunk-redis');
var redisClusterClient = exports.createRedisClusterClient = function(clusterConfig){
    var cluster = redisCluster.createClient(clusterConfig);
    cluster.on('error', function (err) {
        console.log("Redis cluster " + err);
    });
    return cluster;
};

//创建单机redis
var createRedisClient = exports.createRedisClient = function (port, host) {
    var client = redis.createClient(port, host);
    client.on("error", function (err) {
        console.log("Error " + err);
    });
    return client;
};

exports.newRedisClient = function (redisPort, redisHost, selectDB) {
    if (config.useRedisCluster && config.useRedisCluster === 1) { //用集群
        return redisClusterClient(config.redisCluster);
    } else {  //用单点
        var rClient = createRedisClient(redisPort || config.redisPort, redisHost || config.redisHost);
        rClient.select(selectDB || 0, function () {
            //console.log('。。。。。。');
        });
        return rClient;
    }
};

exports.getClientIP = function(req){
    var ipAddress;
    var headers = req.headers;
    var forwardedIpsStr = headers['x-real-ip'] || headers['x-forwarded-for'];
    forwardedIpsStr ? ipAddress = forwardedIpsStr : ipAddress = null;
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
};

exports.resToClient = function(res,params,buffer){
    res.writeHead(200, {"Content-Type": "application/json;charset=utf-8"});
    if (params.query && params.query.callback) {
        var str =  params.query.callback + '(' + JSON.stringify(buffer) + ')';//jsonp
        res.end(str);
    } else {
        res.end(JSON.stringify(buffer));//普通的json
    }
};

exports.getTurnByAreaHour = function(area,hour){

    //if(true){
    //    return 4;
    //}

    var turn = 4,caseContion = 4;
    if(hour >= 0 && hour < 6){
        caseContion = 2;
    }else if(hour >= 6 && hour < 10){
        caseContion = 3;
    }else if(hour >= 10 && hour < 15){
        caseContion = 4;
    }else if(hour >= 15 && hour < 20){
        caseContion = 5;
    }else if(hour >= 20 && hour < 24){
        caseContion = 6;
    }

    switch (caseContion){
        case 2 :
            turn = 2;
            break;
        case 3 :
            turn = 3;
            break;
        case 4 :
            turn = 4;
            break;
        case 5 :
            turn = 5;
            break;
        case 6 :
            turn = 6;
            break;
        default:
            turn = 4;
    }

    return turn;

};

var getTimeByGrid = exports.getTimeByGrid = function(date,hour,turn,grid){

    /**
     * date 日期: 2017-05-15
     * hour 小时: 0 1 2 3 4 ----- 22 23点
     * turn 当前小时总共几轮: [2,3,4,5,6]
     * grid 格子: 当前小时内所占的格子 3 也就是所在的轮次,默认从0开始
     */

    if(!_.isNumber(hour) || hour < 0 || hour > 23){
        return null;
    }

    var gridArr = [6,5,4,3,2];
    if(!_.isNumber(turn)|| !_.contains(gridArr,turn)){
        return null;
    }
    //每小时6 5 4 3 2个格式子

    if(!_.isNumber(grid) || grid < 0 || grid >= turn){
        return null;
    }

    var actime = 60 / turn; //每轮互动时长10,12,15,20,30分钟

    var hourTime = hour == 0 ? 0 : hour * 60,
        gridTime = (grid + 1) * actime;

    var endMin = hourTime + gridTime,
        beginMin = endMin - actime;

    var currDate = moment(date),
        currDate1 = moment(date),
        end = currDate.add(endMin,"m"),
        begin = currDate1.add(beginMin,"m"),
        endTime = end.valueOf(),
        startTime = begin.valueOf(),
        endTimeDis = end.format("YYYY-MM-DD HH:mm:ss"),
        startTimeDis = begin.format("YYYY-MM-DD HH:mm:ss");

    var resObj = {
        startTime: startTime,
        endTime: endTime,
        startTimeDis: startTimeDis,
        endTimeDis: endTimeDis
    };
    return resObj;
};

exports.checkToken = function(req,res,next){
    var token = req.query.token;
    jwt.verify(token, "123456", function (err, decoded) {
        if (err) {  //检验token是否有效
            res.redirect("/");
            return;
        }
        next();
    });
};

exports.randomString = function (len){
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = chars.length;
    var tmp = '';
    for(var i = 0; i<len; i++){
        tmp += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return tmp
};