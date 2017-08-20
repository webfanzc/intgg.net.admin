/**
 * Created by gy104 on 17/8/18.
 */

var models = require('../models'),
    Admin = models.Admin;

var async = require('async'),
    _ = require('underscore'),
    moment = require('moment');

exports.save = function(obj, callback) {
    var time = moment().valueOf();
    if(_.isEmpty(obj.createTime)) {
        _.extend(obj,{createTime: time});
    }
    if(_.isEmpty(obj.updateTime)) {
        _.extend(obj,{updateTime: time});
    }

    var admin = new Admin(obj);
    admin.save(function(err,doc){
        if(err) {
            callback(err);
            return;
        }
        callback(null,doc);
    })
}


exports.getSetupsList = function (conditions, fields, page, callback) {
    var pageSize = +page.pageSize,
        start = pageSize * (page.pageNum - 1);
    async.auto({
        findItems: function (callback) {
            var query = Admin.find(conditions, fields || "-intid -__v")
                .lean().skip(start).limit(pageSize).sort({"createTime": -1});
            query.exec(function (err, data) {
                callback(err, data);
            });
        },
        itemCount: function (callback) {
            if (page.total) {
                return callback(null, page.total);
            }
            Admin.count(conditions, function (err, count) {
                callback(err, count);
            });
        }
    }, function (err, results) {
        if (err) {
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


exports.update = function(condition, fields, options, callback){
    var time = moment().valueOf();
    if(_.isEmpty(fields.updateTime)){
        _.extend(fields,{updateTime: time});
    }

    if(_.isEmpty(options)) {
        options = {
            new: true,
            upsert: true
        };
    }
    Admin.findOneAndUpdate(condition,fields, options, function(err,doc){
        callback(err,doc);
    })
}

exports.del = function(condition, options, callback){
    if(_.isEmpty(options)) {
        options = {select: "_id intid"};
    }
    Admin.findOneAndRemove(condition,options, function(err,doc){
        callback(err, doc);
    })
}

exports.findOne = function(condition, callback) {
    Admin.findOne(condition, function(err, doc){
        callback(err,doc || {});
    })
}