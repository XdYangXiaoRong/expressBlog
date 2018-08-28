var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var settings = require('./settings');
var flash = require('connect-flash');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

/**
 * 数据库连接代码,得写在app.use('/', indexRouter)（运用路由）之前
 */
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.use(session({
  secret:settings.cookieSecret,
  key:settings.db,//cookie name
  cookie:{maxAge:1000*60*60*24*30},//30 days
  store:new MongoStore({
    db:settings.db,
    host:settings.host,
    port:settings.port
  })
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(flash())
app.set('port',process.env.PORT || 3000);

app.use(logger('dev'));
app.use(express.json());
/**
 * bodyParser.urlencoded 用来解析 request 中 body的 urlencoded字符， 只支持utf-8的编码的字符,也支持自动的解析gzip和 zlib。
  返回的对象是一个键值对，当extended为false的时候，键值对中的值就为'String'或'Array'形式，为true的时候，则可为任何数据类型。
 */
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


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
