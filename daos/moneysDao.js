/**
 * Created by rubinus on 2016/11/11.
 */

var models = require('../models'),
    Moneys = models.Moneys;

var async = require('async'),
    _ = require('underscore'),
    moment = require('moment');

exports.findById = function(_id,callback){
    Moneys.findById(_id,function(err,doc){
        if(err){
            callback(err);
            return;
        }
        callback(null,doc);
    });
};

exports.getList = function (conditions, fields, page, callback) {
    var pageSize = +page.pageSize,
        start = pageSize * (page.pageNum - 1);
    async.auto({
        findItems: function (callback) {
            var query = Moneys.find(conditions, fields || "-intid -__v")
                .lean().skip(start).limit(pageSize).sort({"createTime": -1});
            query.exec(function (err, data) {
                callback(err, data);
            });
        },
        itemCount: function (callback) {
            if (page.total) {
                return callback(null, page.total);
            }
            Moneys.count(conditions, function (err, count) {
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

exports.moneySum = function (conditions, callback) {
    Moneys.aggregate([
        //{$project:{scoreType:1,intid: 1,score: 1}},
        {$match: conditions},
        {$group: {_id: "$intid", balance: {$sum: "$tradeNumber"}}}
    ], function (err, result) {
        callback(err, result);
    });
};

exports.findOne = function (conditions, fields, callback) {
    Moneys.findOne(conditions, fields || "-__v", function (err, doc) {
        callback(err, doc || {});
    });
};

exports.findOneAndUpdate = function (conditions, modifyFields, options, callback) {
    options = options || {
            new: true,
            fields: "-__v"
        };
    Moneys.findOneAndUpdate(conditions, modifyFields, options, function (err, obj) {
        callback(err, obj);
    });
};

exports.save = function(obj,callback){
    var time = moment().valueOf();
    if(_.isEmpty(obj.createTime)){
        _.extend(obj,{createTime: time});
    }
    if(_.isEmpty(obj.updateTime)){
        _.extend(obj,{updateTime: time});
    }
    var money = new Moneys(obj);
    money.save(function(err,doc){
        if(err){
            callback(err);
            return;
        }
        callback(null,doc);
    });
};

exports.del = function (condition, options, callback) {
    if (_.isEmpty(options)) {
        options = {select: "intid"};
    }
    Moneys.findOneAndRemove(condition, options, function (err, doc) {
        callback(err, doc);
    });
};
exports.update = function (conditions, fields, options, callback) {
    var time = moment().valueOf();
    if(_.isEmpty(fields.updateTime)){
        _.extend(fields,{updateTime: time});
    }
    if (_.isEmpty(options)) {
        options = {
            new: true,
            upsert: true
            //fields: "_id"
        };
    }
    Moneys.findOneAndUpdate(conditions, fields, options, function (err, doc) {
        callback(err, doc);
    });
};