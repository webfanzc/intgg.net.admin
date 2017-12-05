/**
 * Created by rubinus on 2016/11/11.
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
    tradeNumber: {type: Number}, //交易数额
    tradeNo: {type: String}, //  订单号
    tradeType: {type: Number, enum: [1,2],default: 1}, //1表示充值,2表示提现, 3 直播投放，4 直播退回， 5 点播投放，6 点播退回
    tradeChannel: {type: Number, enum: [1,2],default: 1}, //通道:1表示微信,2表示支付宝
    wxTradeNo: {type: String}, // 微信订单号
    invoiceInfo: {type: Object}, // 发票信息
    openID: {type: String}, //  支付的用户的openid;
    tradeDrop: {type: Number, enum: [1,2],default:1}, // 1表示正常金额，2 表示锁定金额、
    // dropcenterid: {type: String}, //  投放中心的格子标记；
    // ondemandid: {type:String},  // 点播记录的格子
    tradeSuccess: {type: String}, // 支付成功返回的字段
    verified: {type: Number, enum: [0,1],default: 0}, //是否审核提现 0表示提交审核中,1表示审核成功,2表示审核失败
    verifiedMsg: {type: String,default: ""}, //审核结果原因
    sourceId:{type: String}, // 存放各种交易类型的id， 投放中心的id,
    createTime: {type: Number}, //创建记录时间 13位unix时间戳
    updateTime: {type: Number}, //审批提现更新记录时间 13位unix时间戳
    tradeid: {type: Number}, // 唯一表示轮询account
    intid: {type: Schema.Types.ObjectId, ref: 'Users'}  //关联用户信息表,整个系统的id
});


schema.plugin(mongooseUniqueValidator);

mongoose.model('Moneys', schema);