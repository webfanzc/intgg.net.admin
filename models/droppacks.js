/**
 * Created by rubinus on 2016/11/11.
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
    packname: {type: String},

    brand: {type: String}, //推广品牌   非必填,默认以用户自己的setups
    brandlogo: {type: String}, //品牌logo 非必填,默认以用户自己的setups

    configInfo: {type: Object},
    prizesInfo: {type: Object},

    classType: {type: String, index: true},  //种类  家具,汽车 用于点播中

    verified: {type: Number, enum: [0,1],default: 0}, //是否认证过 0表示提交审核中,1表示审核成功,2表示认证失败
    verifiedMsg: {type: String,default: ""}, //审核结果原因

    createTime: {type: Number}, //创建时间 13位unix时间戳
    updateTime: {type: Number}, //更新时间 13位unix时间戳

    intid: {type: Schema.Types.ObjectId, ref: 'Users'}  //关联用户信息表,整个系统的id
});


schema.plugin(mongooseUniqueValidator);

mongoose.model('Droppacks', schema);