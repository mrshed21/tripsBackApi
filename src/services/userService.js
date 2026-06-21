const User = require('../models/User');
const Booking = require('../models/Booking');
const AppError = require('../utils/AppError');
const { getPaginationParams, buildPaginationMeta } = require('../utils/pagination');

const getAllUsers = async (query) => {
  const { page, limit, skip } = getPaginationParams(query);

  const filter = {};
  if (query.search) {
    filter.$or = [
      { fullName: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
      { phone: { $regex: query.search, $options: 'i' } },
    ];
  }
  if (query.role) filter.role = query.role;
  if (query.isActive !== undefined) filter.isActive = query.isActive === 'true';

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return { users, meta: buildPaginationMeta(total, page, limit) };
};

const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new AppError('المستخدم غير موجود', 404);
  return user;
};

const createUser = async (data) => {
  const existing = await User.findOne({
    $or: [{ email: data.email }, { phone: data.phone }],
  });
  if (existing) {
    const field = existing.email === data.email ? 'البريد الإلكتروني' : 'رقم الهاتف';
    throw new AppError(`${field} مسجل مسبقاً`, 400);
  }
  return User.create(data);
};

const updateUser = async (id, data) => {
  const allowedFields = ['fullName', 'phone', 'email', 'role', 'isActive'];
  const filteredData = {};
  allowedFields.forEach((field) => {
    if (data[field] !== undefined) filteredData[field] = data[field];
  });

  const user = await User.findByIdAndUpdate(id, filteredData, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new AppError('المستخدم غير موجود', 404);
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new AppError('المستخدم غير موجود', 404);

  const activeBookings = await Booking.countDocuments({
    user: id,
    bookingStatus: 'confirmed',
  });
  if (activeBookings > 0) {
    throw new AppError(
      `لا يمكن حذف المستخدم لديه ${activeBookings} حجز نشط`,
      400
    );
  }

  await User.findByIdAndDelete(id);
};

const toggleUserStatus = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new AppError('المستخدم غير موجود', 404);
  user.isActive = !user.isActive;
  await user.save();
  return user;
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser, toggleUserStatus };
