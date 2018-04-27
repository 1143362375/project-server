const router = require('koa-router')();
const user_router = require('./user_router');
const common_router = require('./common_router');

router.use('/users', user_router.routes(), user_router.allowedMethods());
router.use('/common', common_router.routes(), common_router.allowedMethods());
module.exports = router;
