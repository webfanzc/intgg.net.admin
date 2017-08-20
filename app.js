/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , juicer = require('juicer');
    juicer.set('strip',false);
    juicer.register('JSON', JSON);

var favicon = require('static-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var config = require('./config');
var indexRoutes = require('./routes');

global.__dirname = __dirname;

var app = express(),
    server = http.createServer(app);


// all environments
app.set('port', config.port);
app.set('views', __dirname + '/views');

app.engine('html', function(path, options, fn){
    fs.readFile(path, 'utf8', function(err, str){
        if (err) return fn(err);
        str = juicer(str, options);
        fn(null, str);
    });
});
app.set('view engine', 'html');
app.set('view options', {layout: false});

app.set('env', 'production');

app.use(favicon());
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded());
app.use(cookieParser('your secret here'));
app.use(express.static(__dirname + '/public'));

indexRoutes.runApp(app);
server.listen(app.get('port'), function(){
    console.log("Express server listening on port %d in %s mode", app.get('port'), app.get('env'));
});


