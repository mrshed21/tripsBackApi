const AppError = require('../utils/AppError');

const handleCastError = (err) =>
  new AppError(`قيمة غير صحيحة للحقل: ${err.path}`, 400);

const handleDuplicateKey = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const fieldNames = { email: 'البريد الإلكتروني', phone: 'رقم الهاتف' };
  const label = fieldNames[field] || field;
  return new AppError(`${label} مسجل مسبقاً`, 400);
};

const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((e) => e.message);
  return new AppError(messages[0], 400);
};

const handleJWTError = () =>
  new AppError('رمز المصادقة غير صحيح، يرجى تسجيل الدخول مجدداً', 401);

const handleJWTExpiredError = () =>
  new AppError('انتهت صلاحية رمز المصادقة، يرجى تسجيل الدخول مجدداً', 401);

const errorHandler = (err, req, res, next) => {
  let error = { ...err, message: err.message };

  if (err.name === 'CastError') error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateKey(err);
  if (err.name === 'ValidationError') error = handleValidationError(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  const statusCode = error.statusCode || 500;
  const message =
    error.isOperational ? error.message : 'حدث خطأ داخلي في الخادم';

  if (process.env.NODE_ENV === 'development') {
    return res.status(statusCode).json({
      success: false,
      message,
      stack: err.stack,
    });
  }

  return res.status(statusCode).json({ success: false, message });
};

module.exports = errorHandler;
