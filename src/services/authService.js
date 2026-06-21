const User = require('../models/User');
const AppError = require('../utils/AppError');
const { signToken } = require('../utils/jwt');

const register = async (data) => {
  const { fullName, phone, email, password } = data;

  const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
  if (existingUser) {
    const field = existingUser.email === email ? 'البريد الإلكتروني' : 'رقم الهاتف';
    throw new AppError(`${field} مسجل مسبقاً`, 400);
  }

  const user = await User.create({ fullName, phone, email, password });
  const token = signToken({ id: user._id, role: user.role });

  return { user, token };
};

const login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new AppError('بيانات الدخول غير صحيحة', 401);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError('بيانات الدخول غير صحيحة', 401);

  if (!user.isActive) throw new AppError('حسابك معطّل، يرجى التواصل مع الإدارة', 403);

  const token = signToken({ id: user._id, role: user.role });
  return { user, token };
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new AppError('المستخدم غير موجود', 404);

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new AppError('كلمة المرور الحالية غير صحيحة', 400);

  user.password = newPassword;
  await user.save();
};

const updateProfile = async (userId, data) => {
  const allowedFields = ['fullName', 'phone'];
  const filteredData = {};
  allowedFields.forEach((field) => {
    if (data[field] !== undefined) filteredData[field] = data[field];
  });

  const user = await User.findByIdAndUpdate(userId, filteredData, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new AppError('المستخدم غير موجود', 404);
  return user;
};

module.exports = { register, login, changePassword, updateProfile };
