/**
 * Created by gy104 on 17/8/1.
 */

var models = require('../models'),
    Stickers = models.Stickers;

var async = require('async'),
    _ = require('underscore'),
    moment = require('moment');

exports.findById = function(_id,callback){
    Stickers.findById(_id,function(err,doc){
        if(err){
            callback(err);
            return;
        }
        callback(null,doc);
    });
};

exports.getList = function(conditions, fields, page, callback) {
    var pageSize = +page.pageSize,
        start = pageSize * (page.pageNum - 1);
    async.auto({
        findItems: function(callback){
            var query = Stickers.find(conditions)
                .lean()
                .populate({
                    path: 'materialid',
                    select: 'name link url position content type verified'
                })
                .populate({
                    path: 'intid',
                    select: 'nickname'
                })
                .skip(start).limit(pageSize).sort({'createTime':-1});
            query.exec(function(err, data) {
                callback(err,data);
            })
        },
        itemCount: function(callback) {
            if(page.total) {
                return callback(null, page.total);
            }
            Stickers.count(conditions, function(err, count) {
                callback(err, count);
            })
        }
    },function (err, results) {
        if(err) {
            return callback(err, {});
        }
        var data = results.findItems,
            count = results.itemCount,
            result = {
                total: count,
                pageCount: Math.ceil(count / pageSize),
                data: data
            };
        callback(null, result);
    });
};

exports.findOne = function(conditions, fields, callback) {
    Stickers.findOne(conditions, fields || "-__v", function(err, doc) {
        callback(err, doc || {});
    })
}

exports.findOneAndUpdate = function(conditions, modifyFields, options, callback) {
    options = options || {
            new: true,
            fields: "-__v"
        };
    Stickers.findOneAndUpdate(conditions, modifyFields, options, function (err, obj) {
        callbackd(err, obj);
    })
}

exports.save = function (obj, callback) {
    var time = moment().valueOf();
    if(_.isEmpty(obj.createTime)){
        _.extend(obj,{createTime: time});
    }
    if(_.isEmpty(obj.updateTime)){
        _.extend(obj,{updateTime: time});
    }
    var stickers = new Stickers(obj);
    stickers.save(function(err,doc){
        if(err){
            callback(err);
            return;
        }
        callback(null,doc);
    });
}

exports.del = function(condition, options, callback) {
    if(_.isEmpty(options)) {
        options = {select: "_id intid"}
    }
    Stickers.findOneAndRemove(condition, options, function(err, doc) {
        callback(err, doc);
    })
}

exports.update = function(conditions, fields, options, callback) {
    var time = moment().valueOf();
    if(_.isEmpty(fields.updateTime)) {
        _.extend(fields, {updateTime: time});
    }
    if(_.isEmpty(options)) {
        options = {
            new: true,
            upsert: true
        };
    }
    Stickers.findOneAndUpdate(conditions, fields, options, function(err, doc) {
        callback(err, doc);
    })
}