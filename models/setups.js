/**
 * Created by rubinus on 2016/11/11.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var IdphotoSchema = new Schema({
    _id: false,//Mongoose to not create a new ObjectId
    id: {type: Number, index: true},
    photo: {type: String}
});

var schema = new Schema({
    name: {type: String}, //个人或公司组织名
    phone: {type: String,index: true}, //手机号
    email: {type: String,index: true}, //email邮箱

    idtype: {type: Number, index: true}, //主体类型 0个人,1公司
    idcard: {type: String, index: true}, //身份证,执照
    idphoto: {type: [IdphotoSchema],default: []},  //对应的数组图片
    brand: {type: String}, //推广品牌
    brandlogo: {type: String}, //品牌logo

    verified: {type: Number, enum: [0,1,2,3,4],default: 0},
    //是否认证过 0表示没有认证,1表示认证通过,2表示认证失败,3表示认证过期（接口调用时自动赋值）,4表示账号被冻结（登录除外）
    verifiedMsg: {type: String,default: ""}, //审核结果原因

    expireTime: {type: Number,default: 0}, //认证的过期时间 13位unix时间戳

    createTime: {type: Number}, //创建时间 13位unix时间戳
    updateTime: {type: Number}, //更新时间 13位unix时间戳

    intid: {type: Schema.Types.ObjectId, ref: 'Users'}  //关联用户信息表,整个系统的id
});


schema.plugin(mongooseUniqueValidator);

mongoose.model('Setups', schema);