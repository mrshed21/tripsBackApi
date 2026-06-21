const router = require('express').Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { registerRules, loginRules, changePasswordRules } = require('../validators/authValidator');
const { updateUserRules } = require('../validators/userValidator');

router.post('/register', registerRules, authController.register);
router.post('/login', loginRules, authController.login);
router.get('/me', protect, authController.getMe);
router.patch('/update-profile', protect, updateUserRules, authController.updateProfile);
router.patch('/change-password', protect, changePasswordRules, authController.changePassword);

module.exports = router;
