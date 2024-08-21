// 引入环境变量
require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var app = express();
var ejs = require('ejs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var WeChatAuth = require('./module/wechat');
var autoReply = require('./module/wechat/autoReply');
const glob = require('glob');
app.get("/", (req, res)=>{
  WeChatAuth(req, res)
})
app.post("/", (req, res)=>{
  autoReply(req, res)
})
// 使用 glob 模块寻找指定文件夹下的所有 .js 文件
glob.sync('./routes/*.js', { cwd: __dirname, }).forEach(function(route) {
  app.use("/"+route.replace('routes/', '').replace('.js', ''), require("./"+route));
});
// // view engine setup

//配置ejs视图的目录
app.set("views", __dirname + "/web");    //    '/web代表存放视图的目录'
app.engine("html", ejs.__express);
//启动视图引擎
app.set('view engine','html')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//公众号配置完成后打开可展示主页
//app.use(express.static(path.join(__dirname, 'web')));

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
// app.listen(3000, ()=>{
//   console.log("服务器启动成功")
// })
module.exports = app;
