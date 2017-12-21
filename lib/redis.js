/**
 * Created by rubinus on 14-8-26.
 */

var _ = require("underscore"),
    config = require('../config');

//取hash值
exports.getHashObj = function (client, id, callback) {
    if(config.useRedisCluster === 1){
        client.hgetall(id)(function (err, reply) {
            if (err) {
                console.log("---------getHashObj---------", err.message);
                return callback(null);
            }
            callback(err,reply);
        });
    }else{
        client.hgetall(id, function (err, reply) {
            if (err) {
                console.log("---------getHashObj---------", err.message);
                return callback(null);
            }
            callback(err,reply);
        });
    }

};

//设置hash
exports.setHashObj = function (client, key, obj, callback) {
    if(config.useRedisCluster === 1){
        client.hmset(key, obj)(function (error, reply) {
            if (reply == "OK") {
                if(obj.expire_seconds){
                    client.expire(key,obj.expire_seconds);
                }            }
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }else{
        client.hmset(key, obj, function (error, reply) {
            if (reply == "OK") {
                if(obj.expire_seconds){
                    client.expire(key,obj.expire_seconds);
                }
            }
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }

};

//设置hash
exports.setHashObjByTimestamp = function (client, key, obj, callback) {
    if(config.useRedisCluster === 1){
        client.hmset(key, obj)(function (error, reply) {
            if (reply == "OK") {
                if(obj.timestamp){
                    client.expireat(key,obj.timestamp);
                }            }
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }else{
        client.hmset(key, obj, function (error, reply) {
            if (reply == "OK") {
                if(obj.timestamp){
                    client.expireat(key,obj.timestamp);
                }
            }
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }

};


exports.setCountHashObj = function (client, id, obj, callback) {
    if(config.useRedisCluster === 1){
        client.hmset(id, obj)(function (error, reply) {
            if (reply == "OK") {
                client.expire(id, 60 * 60 * 24 * 15);
            }
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }else{
        client.hmset(id, obj, function (error, reply) {
            if (reply == "OK") {
                client.expire(id, 60 * 60 * 24 * 15);
            }
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }

};

var setDataToHash = exports.setDataToHash = function (client, key, content, callback) {
    if(config.useRedisCluster === 1){
        client.hmset(key, content)(function (err, reply) {
            if (err) {
                console.log("---------setDataToHash---------", err.message);
            }
            callback(err, reply);
        });
    }else{
        client.hmset(key, content, function (err, reply) {
            if (err) {
                console.log("---------setDataToHash---------", err.message);
            }
            callback(err, reply);
        });
    }

};

//删除hash fields
exports.delHashFields = function (client, key, fields, callback) {
    if(config.useRedisCluster === 1){
        client.hdel(key, fields)(function (error, reply) {
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }else{
        client.hdel(key, fields, function (error, reply) {
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }

};

//删除key
var delKey = exports.delKey = function (client, id, callback) {
    if(config.useRedisCluster === 1){
        client.del(id)(function (error, reply) {
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }else{
        client.del(id, function (error, reply) {
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }

};

//设置list
exports.setListKey = function (client, key, value, callback) {
    if(config.useRedisCluster === 1){
        client.rpush(key, value)(function (error, reply) {
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }else{
        client.rpush(key, value, function (error, reply) {
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }

};

//取list
exports.getListKey = function (client, key, callback) {
    if(config.useRedisCluster === 1){
        client.lpop(key)(function (error, reply) {
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }else{
        client.lpop(key, function (error, reply) {
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }

};

//倒序取sorted-set
exports.getDescSet = function (client, key, obj, callback) {
    if(config.useRedisCluster === 1){
        client.zrevrange(key, obj.start, obj.end, obj.score)(function (error, reply) {
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }else{
        client.zrevrange(key, obj.start, obj.end, obj.score, function (error, reply) {
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }

};
//倒序取sorted-set
exports.getDescSet2 = function (client, key, obj, callback) {
    if(config.useRedisCluster === 1){
        client.zrevrange(key, obj.start, obj.end)(function (error, reply) {
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }else{
        client.zrevrange(key, obj.start, obj.end, function (error, reply) {
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }

};
//升序取sorted-set
exports.getAscSet = function (client, key, obj, callback) {
    if(config.useRedisCluster === 1){
        client.zrange(key, obj.start, obj.end, obj.score)(function (error, reply) {
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }else{
        client.zrange(key, obj.start, obj.end, obj.score, function (error, reply) {
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }

};
//set总数
exports.getSetCount = function (client, key, callback) {
    if(config.useRedisCluster === 1){
        client.zcard(key)(function (error, reply) {
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }else{
        client.zcard(key, function (error, reply) {
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }

};
exports.getSortedSet = function (client, key, obj, callback) {
    if(config.useRedisCluster === 1){
        client.zrange(key, obj.start, obj.end)(function (error, reply) {
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }else{
        client.zrange(key, obj.start, obj.end, function (error, reply) {
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }

};
//设置sorted-set
exports.setSortSet = function (client, _id, score, obj, callback) {
    if(config.useRedisCluster === 1){
        client.zadd(_id, score, obj)(function (error, reply) {
            if (!error) {
                client.expire(_id, 60 * 60 * 24);
            }
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }else{
        client.zadd(_id, score, obj, function (error, reply) {
            if (!error) {
                client.expire(_id, 60 * 60 * 24);
            }
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }

};

exports.addDataToSortedSet = function (client, args, callback) {
    if(config.useRedisCluster === 1){
        client.zadd(args)(function (err, replay) {
            if (err) {
                console.log('---------addDataToSortedSet zadd---------', err.message);
            }
            callback(null, replay);
        });
    }else{
        client.zadd(args, function (err, replay) {
            if (err) {
                console.log('---------addDataToSortedSet zadd---------', err.message);
            }
            callback(null, replay);
        });
    }

};

//删除sorted-set中的元素
exports.rmSortSet = function (client, _id, obj, callback) {
    if(config.useRedisCluster === 1){
        client.zrem(_id, obj)(function (error, reply) {
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }else{
        client.zrem(_id, obj, function (error, reply) {
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }

};

//根据keys 查询hashobjs
exports.getSearchHashObjs = function (client, keys, callback) {
    if(config.useRedisCluster === 1){
        client.hgetall(keys)(function (error, reply) {
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }else{
        client.hgetall(keys, function (error, reply) {
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }

};

//模糊查询keys
exports.getSearchKeys = function (client, searchkey, callback) {
    if(config.useRedisCluster === 1){
        client.keys(searchkey)(function (error, reply) {
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }else{
        client.keys(searchkey, function (error, reply) {
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }

};
//查询sortset 是否存在member
exports.checkSortset = function (client, key, member, callback) {
    if(config.useRedisCluster === 1){
        client.zrank(key, member)(function (error, reply) {
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }else{
        client.zrank(key, member, function (error, reply) {
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }

};

exports.setKey = function (client, key, member, callback) {
    if(config.useRedisCluster === 1){
        client.set(key, member)(function (error, reply) {
            if (error) {
                console.log("---------setKey---------", error.message);
            }
            callback(reply);
        });
    }else{
        client.set(key, member, function (error, reply) {
            if (error) {
                console.log("---------setKey---------", error.message);
            }
            callback(reply);
        });
    }

};

var getKey = exports.getKey = function (client, key, callback) {
    if(config.useRedisCluster === 1){
        client.get(key)(function (error, reply) {
            if (typeof callback === 'function') {
                callback(reply);
            }
        });
    }else{
        client.get(key, function (error, reply) {
            if (typeof callback === 'function') {
                callback(reply);
            }
        });
    }

};

exports.setexKey = function (client, key, time, obj, callback) {
    if(config.useRedisCluster === 1){
        client.setex(key, time, obj)(function (error, reply) {
            if (!error) {
                callback(reply);
            } else {
                callback(null);
            }
        });
    }else{
        client.setex(key, time, obj, function (error, reply) {
            if (!error) {
                callback(reply);
            } else {
                callback(null);
            }
        });
    }
};

//获取与该Key关联的Set中所有的成员
exports.getSmembers = function (client, key, callback) {
    if(config.useRedisCluster === 1){
        client.smembers(key)(function (error, reply) {
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }else{
        client.smembers(key, function (error, reply) {
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }

};

//保存wx_token 到 set
exports.setRemove = function (client, key, member, callback) {
    if(config.useRedisCluster === 1){
        client.srem(key, member)(function (error, reply) {
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }else{
        client.srem(key, member, function (error, reply) {
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }

};

//查询 set中的 wx_token
exports.setSismember = function (client, key, member, callback) {
    if(config.useRedisCluster === 1){
        client.sismember(key, member)(function (error, reply) {
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }else{
        client.sismember(key, member, function (error, reply) {
            if (typeof callback === 'function') {
                callback(error, reply);
            }
        });
    }

};



exports.pushGroupList = function (client, key, obj, callback) {
    if(config.useRedisCluster === 1){
        client.rpush(key, JSON.stringify(obj))(function (error, reply) {
            if (typeof callback === 'function') {
                callback(reply);
            }
        });
    }else{
        client.rpush(key, JSON.stringify(obj), function (error, reply) {
            if (typeof callback === 'function') {
                callback(reply);
            }
        });
    }

};


exports.existsKey = function(client,key,callback){
    if(config.useRedisCluster === 1){
        client.exists(key)(function(error,reply){
            if(!error && reply >0){
                callback(reply);
            }else{
                callback(null);
            }
        });
    }else{
        client.exists(key,function(error,reply){
            if(!error && reply >0){
                callback(reply);
            }else{
                callback(null);
            }
        });
    }

};

//保存wx_token 到 set
exports.setAdd = function (client, key, member, callback) {
    if(config.useRedisCluster === 1){
        client.sadd(key, member.obj)(function (error, reply) {

            if (reply == "OK") {
                console.log(reply);
                if(member.timestamp){
                    client.expireat(key,member.timestamp);
                }
            }
            if (typeof callback === 'function') {
                callback(reply);
            }
        });
    }else{
        client.sadd(key, member.obj, function (error, reply) {
            if (reply == 1) {

                if(member.timestamp){
                    client.expireat(key,member.timestamp);
                }
            }
            if (typeof callback === 'function') {
                callback(reply);
            }
        });
    }

};

//查询 set中的 wx_token
exports.setSismember = function(client,key,member,callback){
    client.sismember(key,member,function(error,reply){
        if(!error){
            if(callback && typeof callback === 'function'){
                callback(reply);
            }else{
                callback(null);
            }
        }
    });
};


exports.pushGroupList = function (client,key,obj,callback) {
    client.rpush(key,JSON.stringify(obj),function(error,reply){
        if(!error){
            if(callback && typeof callback === 'function'){
                callback(reply);
            }
        }else{
            callback(null);
        }
    });
}