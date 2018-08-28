var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var debug = require('debug');

var settings = require('./settings'); 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
//设置views文件夹为存放视图文件的目录， 即存放模板文件的地方,__dirname 为全局变量,存储当前正在执行的脚本所在的目录。
app.set('views', path.join(__dirname, 'views'));
// 设置视图模板引擎为jade
app.set('view engine', 'jade');
//设置端口
// app.set('port',process.env.PORT || 3005);

app.use(logger('dev'));//加载日志中间件
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// indexRouter(app);
app.listen(app.get('port'),function(){
  debug('Express server listening on port ' + app.get('port'))
  console.log(2333,'Express server listening on port ' + app.get('port'))
})
// 捕获404错误，并转发到错误处理器（catch 404 and forward to error handler）
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
  res.render('error',{
    message:err.message,
    error:err
  });
});

module.exports = app;
