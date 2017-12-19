/**
 * Created by gy104 on 17/8/1.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({

    total: {type: Number},  //贴片金额
    startDate: {type: String}, // 开始日期
    endDate: {type: String}, // 结束日期
    isStart: {type: Number, enum: [0,1]},  // 是否启用 0表示未启用，
    createTime: {type: Number},  // 创建时间
    updateTime: {type: Number},  // 更新时间
    verified: {type: Number, enum: [0,1,2,3,4],default: 0},
    //是否认证过 0表示保存待审,1表示审核通过,2表示审核拒绝,3表示被系统强制封停
    verifiedMsg: {type: String,default: ""}, //审核结果原因
    materialid: {type: Schema.Types.ObjectId, ref: 'Materials'},  // 关联素材表
    intid: {type: Schema.Types.ObjectId, ref: 'Users'}  // 关联用户信息表，整个系统的id

});

schema.plugin(mongooseUniqueValidator);

mongoose.model('Stickers', schema);