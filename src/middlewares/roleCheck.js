const AppError = require('../utils/AppError');

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('ليس لديك صلاحية للوصول إلى هذه الخدمة', 403));
    }
    next();
  };
};

module.exports = { restrictTo };
