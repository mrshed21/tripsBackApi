const User = require('../models/User');
const AppError = require('../utils/AppError');
const { verifyToken } = require('../utils/jwt');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('يرجى تسجيل الدخول للوصول إلى هذه الخدمة', 401));
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('المستخدم غير موجود', 401));
    }

    if (!user.isActive) {
      return next(new AppError('حسابك معطّل، يرجى التواصل مع الإدارة', 403));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { protect };
