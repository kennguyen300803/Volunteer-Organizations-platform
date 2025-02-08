var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var eventsRouter = require('./routes/events');
var updatesRouter = require('./routes/updates');
var orgsRouter = require('./routes/orgs');
var managersRouter = require('./routes/managers');
var profileRouter = require('./routes/profile');
var adminsRouter = require('./routes/admins');
var authRouter = require('./routes/auth');

var mysql = require('mysql');
const { profile } = require('console');

var connectionPool = mysql.createPool({
    host: 'localhost',
    database: 'dtbs'
  });

var app = express();

app.use(function(req,res,next) {
    req.pool = connectionPool;
    next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// session ID middleware
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: "super secret string",
  secure: false
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/users', usersRouter);

app.use('/events', eventsRouter);
app.use('/updates', updatesRouter);
app.use('/orgs', orgsRouter);

app.use('/managers', managersRouter);
app.use('/profile', profileRouter);
app.use('/admins', adminsRouter);

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
  res.render('error', {title: "error page... sad!"});
});

module.exports = app;
