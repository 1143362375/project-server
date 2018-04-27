// 引入redis
const cache = require('../../utils/cache');
// 引入短信接口
const smsClient = require('../../config/note_config');
// 随机数生成
const utils = require('../../utils');

// 发送短信验证吗
exports.getVerificationCode = async (ctx, next) => {
  const requestBody = ctx.request.body;
  const code = utils.randomWord(false, 6);
  const data = {
    phoneNumber: requestBody.phoneNumber
  };
  console.log('code', code);
  console.log('phone', data.phoneNumber);
  //发送短信
  await smsClient
    .sendSMS({
      PhoneNumbers: data.phoneNumber,
      SignName: '张驰',
      TemplateCode: 'SMS_133006244',
      TemplateParam: `{"code":"${code}"}`
    })
    .then(
      function(res) {
        let { Code } = res;
        if (Code === 'OK') {
          //处理返回参数
          cache.setex(data.phoneNumber, code, 'default', (err, res) => {
            // do something
            console.log(res);
          });
          ctx.body = {
            message: '验证码发送成功！'
          };
        }
        console.log('短信发送结果：', res);
      },
      function(err) {
        console.log('短信发送错误：', err);
      }
    );
};

// 测试使用页面
exports.index = async (ctx, next) => {
  await ctx.render('index', {
    title: '测试登录页面!'
  });
};

//
exports.index2 = async (ctx, next) => {
  ctx.body = {
    message: '没有登录！'
  };
};
