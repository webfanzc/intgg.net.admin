/**
 * Created with JetBrains WebStorm.
 * User: Rubinus
 * Date: 14-5-5
 * Time: 下午4:35
 */
var log4js = require('log4js');

// logger configure
log4js.configure({
    appenders: [
        { type: 'console' }
    ],
    replaceConsole: true
});

var Logger=function(name){
    var logger = log4js.getLogger(name);
    logger.setLevel("DEBUG");
    return logger;
}

module.exports = Logger();





