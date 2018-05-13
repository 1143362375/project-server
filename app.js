const Koa = require('koa');
const Router = require('koa-router');
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
// 引入session
const session = require('koa-session');
const app = new Koa();
// log工具
const logUtil = require('./utils/log');
const router = new Router();
// 格式化引入路由
const api = require('./routes/api/index');
// 中间件格式话输出
const response_formatter = require('./middlewares/response_formatter');
// // 引入socket.io
// const io = require('socket.io')(app);
const config = require('./config/development');
const logoConsloe = require('./config/logoConsole');
app.keys = ['zhangchi keys']; //KOA-SESSION 需要的cookies的key不然会报错
// error handler
onerror(app);

// middlewares
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text']
  })
);
app.use(json());
// app.use(logger());
// logger
//
app.use(session(config.sessionConfig, app));

app.use(require('koa-static')(__dirname + '/public'));

app.use(
  views(__dirname + '/views', {
    extension: 'pug'
  })
);
app.use(async (ctx, next) => {
  console.log('session', ctx.session);
  // if (ctx.url!== '/api/users/login' && !ctx.session.userId) {
  //   // 没有登录自动跳转登录页面
  //   ctx.url = '/login';
  //   // ctx.session.userId;
  // }
  // 响应开始时间
  const start = new Date();
  // 响应间隔时间
  let ms;
  try {
    // 开始进入到下一个中间件
    await next();

    ms = new Date() - start;
    // 记录响应日志
    logUtil.logResponse(ctx, ms);
  } catch (error) {
    ms = new Date() - start;
    // 记录异常日志
    logUtil.logError(ctx, error, ms);
  }
});

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});
// socke.io
// io.on('connection', (socket) => {
//   console.log("首次连接 " + socket.id + " 的客户端.");
//   // 群聊
//   socket.on('sendGroupMsg', function (data) {
//     socket.broadcast.emit('receiveGroupMsg', data);
//   });

//   // 上线
//   socket.on('online', name => {
//     socket.broadcast.emit('online', name)
//   });
// })


// 返回数据格式化
app.use(response_formatter('^/api'));

// 引入路由
router.use('/api', api.routes(), api.allowedMethods());
app.use(router.routes());
logoConsloe.logo();
module.exports = app;
