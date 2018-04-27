/**
 * 开发环境的配置内容
 */

module.exports = {
  env: 'development', // 环境名称
  port: 3000, // 服务端口号
  mysql_url: '', // 数据库地址
  redis_url: '140.143.249.137', // redis地址
  redis_port: '6379', // redis端口号
  redis_maxAge: '600',
  sessionConfig: {
    key: 'koa:sess' /** (string) cookie key (default is koa:sess) */,
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 18000,
    overwrite: true /** (boolean) can overwrite or not (default true) */,
    httpOnly: true /** (boolean) httpOnly or not (default true) */,
    signed: true /** (boolean) signed or not (default true) */,
    rolling: false /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */,
    renew: false /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
  }
};
