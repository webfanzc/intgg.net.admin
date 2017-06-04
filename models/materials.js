/**
 * Created by rubinus on 2016/11/11.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
    name: {type: String},   //素材名
    position: {type: String},   //使用位置
    link: {type: String},   //跳转的外连地址
    type: {type: String},   //素材类型,mp3,mp4,audio
    content: {type: String}, //内容描述
    url: {type: String},    //上传的素材存储的url,为cdn的文件存储地址

    verified: {type: Number, enum: [0,1,2,3,4],default: 0},
    //是否认证过 0表示保存待审,1表示审核通过,2表示审核拒绝,3表示被系统强制封停

    createTime: {type: Number}, //创建时间 13位unix时间戳
    updateTime: {type: Number}, //更新时间 13位unix时间戳

    intid: {type: Schema.Types.ObjectId, ref: 'Users'}  //关联用户信息表,整个系统的id
});


schema.plugin(mongooseUniqueValidator);

mongoose.model('Materials', schema);