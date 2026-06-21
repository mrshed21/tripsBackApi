const authService = require('../services/authService');
const { sendSuccess } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const { user, token } = await authService.register(req.body);
    sendSuccess(res, 201, 'تم إنشاء الحساب بنجاح', { user, token });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    sendSuccess(res, 200, 'تم تسجيل الدخول بنجاح', { user, token });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    sendSuccess(res, 200, 'تم جلب بيانات المستخدم بنجاح', { user: req.user });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user._id, currentPassword, newPassword);
    sendSuccess(res, 200, 'تم تغيير كلمة المرور بنجاح');
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(req.user._id, req.body);
    sendSuccess(res, 200, 'تم تحديث الملف الشخصي بنجاح', { user });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, changePassword, updateProfile };
