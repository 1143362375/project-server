const router = require('koa-router')();
const userController = require('../../app/controllers/user_controller');

router.post('/getUserInfo', userController.getUserInfo);
router.post('/registerUser', userController.registerUser);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

module.exports = router;
