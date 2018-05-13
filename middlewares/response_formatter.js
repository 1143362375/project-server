/**
 * 在app.use(router)之前调用
 */
const ApiError = require('../app/error/ApiError');
const response_formatter = async ctx => {
  // 如果有返回数据，将返回数据添加到data
  // console.log(ctx.body);
    if (ctx.body && ctx.body.error ) {
      ctx.body = {
        code: 1000,
        success: true,
        error: ctx.body.error // 有错误输出
      };
    } else if (typeof ctx.body === 'object') {
      ctx.body = {
        code: 200,
        success: true,
        message: ctx.body.message,
        data: ctx.body.data // 无错误放到data中
      };
    }
};

const url_filter = pattern => {
  return async (ctx, next) => {
    const reg = new RegExp(pattern);
    try {
      // 先去执行路由
      await next();
    } catch (error) {
      // 如果异常类型是API异常并且通过正则验证的url，将错误信息添加到响应体中返回。
      if (error instanceof ApiError && reg.test(ctx.originalUrl)) {
        ctx.status = 200;
        ctx.body = {
          success: false,
          code: error.code,
          errorInfo: error.message
        };
      }
      // 继续抛，让外层中间件处理日志
      throw error;
    }

    // 通过正则的url进行格式化处理
    if (reg.test(ctx.originalUrl)) {
      response_formatter(ctx);
    }
  };
};

module.exports = url_filter;
