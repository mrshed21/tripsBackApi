const router = require('express').Router();
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/auth');
const { restrictTo } = require('../middlewares/roleCheck');
const { createUserRules, updateUserRules } = require('../validators/userValidator');

router.use(protect, restrictTo('admin'));

router.get('/', userController.getAllUsers);
router.post('/', createUserRules, userController.createUser);

router.get('/:id', userController.getUserById);
router.patch('/:id', updateUserRules, userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.patch('/:id/toggle-status', userController.toggleUserStatus);

module.exports = router;
