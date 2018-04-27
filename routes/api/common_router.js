const router = require('koa-router')();
const commonUtils = require('../../app/controllers/common_utils');

router.post('/getVerificationCode', commonUtils.getVerificationCode);
router.get('/love', commonUtils.index);
router.get('/', commonUtils.index2);
module.exports = router;
