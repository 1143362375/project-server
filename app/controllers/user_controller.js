/*
   CREATE BY ZHANGCHI 2018.04.20
 */
const ApiError = require('../error/ApiError');
const ApiErrorNames = require('../error/ApiErrorNames');
// 引入数据库
const sql = require('../../config/mySql_config');
// 引入id编码
const uuid = require('node-uuid');
const createId = uuid.v1();
// 引入redis
const cache = require('../../utils/cache');

/* 用户注册
** @param  userName  string
** @param  password  string
** @param  verificationCode  string
**/
exports.registerUser = async (ctx, next) => {
  // console.log('registerUser', ctx.request.body);
  const requestBody = ctx.request.body;
  // 验证码是否正确标识
  let codeFlag = true;
  const data = {
    nickName: requestBody.nickName,
    userName: requestBody.userName,
    password: requestBody.password,
    verificationCode: requestBody.verificationCode
  };
  // 异步操作进行redis查询
  await cache.get(data.userName, (err, val) => {
    if (val) {
      console.log('这是redis', val);
      if (val === data.verificationCode) codeFlag = true;
    } else {
      console.log('这是redis错误', err);
    }
  });

  // 通过mySql的异步查询结果后，使用redis的查询结果，这样保证了异步的正确
  if (data.userName && data.password) {
    console.log('查询成功',data);
    
    await sql.startTransaction();
    const result = await sql.executeTransaction(
      'select * from user_base where user_name = ?;',
      [data.userName]
    );
    if (result[0]) {
      console.log('查询成功');
      throw new ApiError(ApiErrorNames.USER_REGISTER.USER_EXIST);
    } else {
      console.log('暂无数据');
      if (codeFlag) {
        // 向用户基础信息表插入数据
        await sql.executeTransaction(
          'insert into user_base (id, user_name, password) values (?,?,?);',
          [createId, data.userName, data.password]
        );
        // 向用户详情表插入一条数据
        await sql.executeTransaction(
          'insert into user_info (id, phone_number, nick_name) values (?,?,?);',
          [createId, data.userName, data.nickName]
        );
        ctx.body = {
          message: '注册成功！！'
        };
        // 注册成功删除验证码
        cache.del(data.userName);
        console.log('数据库插入成功');
      } else {
        throw new ApiError(ApiErrorNames.USER_REGISTER.CODE_ERROR);
      }
      await sql.stopTransaction();
    }
  } else {
    throw new ApiError(ApiErrorNames.USER_REGISTER.USER_DESABLE);
  }
};

// 获取用户基本信息
exports.getUserInfo = async (ctx, next) => {
  const useId = ctx.session.userId;
  if (useId) {
    await sql.startTransaction();
    const result = await sql.executeTransaction(
      'select * from user_info where id = ?;',
      [useId]
    );
    if (result[0]) {
      ctx.body = {
        data: result[0],
        message: '查询成功！'
      };
    } else {
      throw new ApiError(ApiErrorNames.USER_REGISTER.USER_DESABLE);
    }
  } else {
    throw new ApiError(ApiErrorNames.USER_LOGIN.NOT_LOGIN);
  }
};

// 用户登录
exports.login = async (ctx, next) => {
  const requestBody = ctx.request.body;
  const data = {
    userName: requestBody.userName,
    password: requestBody.password
  };
  console.log('登录信息',data)
  // ctx.body = {
  //   message: '接口成功!'
  // };
  // 查询名称是否重复
  if (data.userName && data.password) {
    console.log('登录信息')    
    await sql.startTransaction();
    const result = await sql.executeTransaction(
      'select id, password from user_base where user_name = ?;',
      [data.userName]
    );
    console.log('失败', result[0]);
    if(result[0]){
      if (result[0].password === data.password) {
        console.log('查询成功:', result[0]);
        // ctx.cookies.set('userId', result[0].id);
        ctx.body = {
          message: '登录成功！！'
        };
        // 将用户信息存储到redis中
        ctx.session.userId = result[0].id;
        // cache.setex('userId', result[0].id, 1800, (err, res) => {
        //   // do something
        //   console.log(res);
        // });
        await sql.stopTransaction();
      } 
    } else {
      console.log('失败');
      throw new ApiError(ApiErrorNames.USER_LOGIN.USER_NOT_EXIST);
    }
  } else {
    throw new ApiError(ApiErrorNames.USER_REGISTER.USER_DESABLE);
  }
};

// 退出登录
exports.logout = async (ctx, next) => {
  // console.log('session::', ctx.session);
  // 删除用户seesion基本信息
  delete ctx.session.userId;
  ctx.body = {
    message: '退出登陆成功！'
  };
};
