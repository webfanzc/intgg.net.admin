/**
 * Created by rubinus on 14-9-25.
 */
module.exports = {
    loggerType: 'DEBUG',
    systemType: '开发',
    port:  3001,

    mongodb: {
        mongos: false,
        str: 'mongodb://intggnet:intggnet@139.224.62.107:27027/intggnet',
        opts: {
            server: { poolSize: 5 }
//            replset: {strategy: 'ping', rs_name: 'ali'}
        }
    },

    delOnlyOneCode: false, //不删除一次性code

    useAlioss: true, //使用ali云的oss  正式上改为:true

    HOSTS: {
        mateHost: "http://mate.intgg.cn/", //存储素材的cdnhost

    },

    H5: { //公众号
        appid: "wx86e37f49af9d311f",
        secret: "ececef7acb8fa87464ebe683e77ede23"
    },
    PC: {   //微信open平台 网站应用
        appid: "wx4232ef00ca53d59f",
        secret: "ae5f1532d1c74a7b943bf33da1c4ccc0"
    },
    access_token_appid: [ "TOKEN", "SYSTEM", "$appid"].join(":"),

    jwtSecret: "123456",
    jwtExpiresIn: 60,

    loginCallback: {
        redirect_uri: "http://dev.intgg.cn/wxauth/callback?redirect_uri=http://dev.intgg.net/auth",
        state: "pc",
        scope: "snsapi_login"
    },

    useRedisCluster: 0,
    redisCluster:[
        '10.105.244.190:7000',
        '10.105.253.107:7000',
        '10.105.252.90:7000'
        //'10.105.203.21:7000',
        //'10.105.249.140:7000'
    ],

    usersMasterHost: '139.224.62.107', //db7存放了所有摇一摇用户信息,db8存放了用户名称模糊查询所用
    usersMasterPort: 6383,            //单独的实体机做主

    usersSlaveHost: '139.224.62.107', //db7存放了所有摇一摇用户信息,db8存放了用户名称模糊查询所用
    usersSlavePort: 6383,            //从库供查询用户信息接口使用

    wxtokenRedisHost: '139.224.62.107', //139.224.62.107
    wxtokenRedisPort: 6383,

    qrcodeRedisHost: '139.224.62.107',  //微信二维码验证code,登录auth
    qrcodeRedisPort: 6383,

    userTokenRedisHost: '139.224.62.107',  //用户token
    userTokenRedisPort: 6383,

    timerRedisHost:'139.224.62.107',   //定时器,自动拍
    timerRedisPort:6383,
    timerDB: "15",


    // 404  500 错误处理页面
    errorPage:'http://a.h5.mtq.tvm.cn/tishi/index.html',





};
