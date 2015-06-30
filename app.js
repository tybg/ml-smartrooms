/// <reference path="typings/node/node.d.ts"/>
/// <reference path="typings/express/express.d.ts"/>
/// <reference path="typings/socket.io/socket.io.d.ts"/>

var express = require('express');
var validator = require('express-validator');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('localhost/smartrooms');

var app = express();
var io = require('socket.io')();
io.serveClient(false);
app.io = io;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index_routes')());
app.use('/rooms', require('./routes/rooms_routes')(app.io));
app.use('/bookings', require('./routes/bookings_routes')(app.io));
//app.use('/users', require('./routes/users'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        res.status(500).send({ error: err });
    } else {
        next(err);
    }
}
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    var errObj = (app.get('env') === 'development') ? {
        message: err.message,
        error: err
    } : 
    // production error handler
    // no stacktraces leaked to user
    {
        message: err.message,
        error: {}
    };
    
    res.send(errObj);
});


module.exports = app;
