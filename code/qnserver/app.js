var createError = require('http-errors');
var express = require('express');
var path = require('path');
var ejs = require('ejs');
var session = require('express-session');
var logger = require('morgan');
var bodyParser = require("body-parser");
var cors = require('cors');

var designRouter = require('./routes/design');
var answerRouter = require('./routes/answer');

var app = express();

var corsOptions = {
  origin: 'http://localhost:8080'
};

app.use(session({
  secret: 'qnmaker123',
  cookie: ('name', 'value', {path: '/api', httpOnly: true, secure: false, maxAge: 1000 * 3600 * 24 * 3}),
  resave: true,
  saveUninitialized: true,
  rolling: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.__express);
app.set('view engine', 'html');

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/design', designRouter);
app.use('/api/answer', answerRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
