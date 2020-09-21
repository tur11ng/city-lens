const express = require('express');
const path = require('path');
// var favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const {indexRouter, userRouter, adminRouter} = require('./route');
const app = express();

//app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use(cors())
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json({limit: '100mb', type: 'application/json'}));
app.use(cookieParser());
//app.use(express.static('public'));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

// app.use(fileUpload({
//     limits: { fileSize: 100 * 1024 * 1024 },
// }));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);

//Middleware functions are executed sequentially,
//therefore the order of middleware inclusion is important.
// app.use('/', function (req, res, next) {
//     res.status(404);
// });

app.use('/', function (err, req, res, next) {
    res.status(err.status || 500);
    res.send('Error');
});

module.exports = app;
