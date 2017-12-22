/**
 * Created by rubinus on 2016/11/11.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({

    use: {type: Number, enum: [0,1],default: 1}, //是否在使用中 0表示停止使用,1表示正在使用中

    total: {type: Number},    //总金额,保存时单位是分

    redType: {type: Number, enum: [0,1],default: 0}, //红包金额的类型,0表示固定金额,1表示浮动金额
    minRed: {type: Number},    //最小金额,如果是固定金额,那么minRed=maxRed,保存时单位是分
    maxRed: {type: Number},    //最大金额,保存时单位是分
    weight: {type: Number},    //权重,越高出现概率越大0--9
    startTime: {type: Number}, //开始时间 13位unix时间戳
    endTime: {type: Number}, //结束时间 13位unix时间戳

    //定向投放
    sex: {type: Number,enum: [0,1,2],default: 0}, //0是不限 ,1男,2女
    minAge: {type: Number,default: 0},    //最小年龄
    maxAge: {type: Number,default: 0},    //最大年龄
    prinvce: {type: String},    //省份
    city: {type:String},    //城市

    verified: {type: Number, enum: [0,1,2,3,4],default: 0},
    //是否认证过 0表示保存待审,1表示审核通过,2表示审核拒绝,3表示被系统强制封停
    verifiedMsg: {type: String,default: ""}, //审核结果原因

    createTime: {type: Number}, //记录创建时间 13位unix时间戳
    updateTime: {type: Number}, //记录更新时间 13位unix时间戳

    materialid: {type: Schema.Types.ObjectId, ref: 'Materials'},  //关联素材表
    intid: {type: Schema.Types.ObjectId, ref: 'Users'}  //关联用户信息表,整个系统的id
});


schema.plugin(mongooseUniqueValidator);

mongoose.model('Crazygrab', schema);