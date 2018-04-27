/**
 * API错误名称
 */
var ApiErrorNames = {
  UNKNOW_ERROR: 'unknowError',
  USER_REGISTER: {
    USER_EXIST: 'useExist',
    USER_DESABLE: 'userDesabled',
    CODE_ERROR: 'codeError'
  },
  USER_LOGIN: {
    USER_NOT_EXIST: 'useNotExist',
    USER_DESABLE: 'userDesabled',
    NOT_LOGIN: 'notLogin'
  }
};

/**
 * API错误名称对应的错误信息
 */
const error_map = new Map();

error_map.set(ApiErrorNames.UNKNOW_ERROR, {
  code: -1,
  message: '未知错误'
});
error_map.set(ApiErrorNames.USER_REGISTER.USER_EXIST, {
  code: 101,
  message: '该用户名已经被注册！'
});
error_map.set(ApiErrorNames.USER_REGISTER.USER_DESABLE, {
  code: 101,
  message: '用户名或密码无效！'
});
error_map.set(ApiErrorNames.USER_REGISTER.CODE_ERROR, {
  code: 101,
  message: '验证码错误！'
});
error_map.set(ApiErrorNames.USER_LOGIN.USER_NOT_EXIST, {
  code: 101,
  message: '用户名或密码不存在！'
});
error_map.set(ApiErrorNames.USER_LOGIN.NOT_LOGIN, {
  code: 101,
  message: '登录信息失效，请重新登录!'
});
//根据错误名称获取错误信息
ApiErrorNames.getErrorInfo = error_name => {
  var error_info;

  if (error_name) {
    error_info = error_map.get(error_name);
  }

  //如果没有对应的错误信息，默认'未知错误'
  if (!error_info) {
    error_name = UNKNOW_ERROR;
    error_info = error_map.get(error_name);
  }

  return error_info;
};

module.exports = ApiErrorNames;
