// 数据连接配置
const Client = require('mysql-pro');
const client = new Client({
  mysql: {
    user: 'zhangchi',
    password: '123456',
    database: 'testDB',
    host: '140.143.249.137'
  }
});

module.exports = client;
