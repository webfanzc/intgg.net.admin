var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
    nickname: {type: String},
    headimgurl: {type: String},
    city: {type: String},
    province: {type: String},
    country: {type: String},
    sex: {type: String},

    phone: {type: String},
    email: {type: String},

    // authid: {type: Schema.Types.ObjectId, ref: 'UsersAuth'}  //关联用户信息表,整个系统的id
});


schema.plugin(mongooseUniqueValidator);

mongoose.model('Users', schema);