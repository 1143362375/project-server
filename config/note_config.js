/**
 * 云通信基础能力业务短信发送、查询详情以及消费消息
 */

const SMSClient = require('@alicloud/sms-sdk');

// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
const accessKeyId = 'LTAIaog0hofuL1IN';
const secretAccessKey = 'frV6rtOzRiQa8ZtPVvMCi6xjC105DZ';

//在云通信页面开通相应业务消息后，就能在页面上获得对应的queueName,不用填最后面一段
const queueName = 'Alicom-Queue-1092397003988387-';

//初始化sms_client
let smsClient = new SMSClient({ accessKeyId, secretAccessKey });

module.exports = smsClient;
