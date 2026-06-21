const userService = require('../services/userService');
const { sendSuccess } = require('../utils/response');

const getAllUsers = async (req, res, next) => {
  try {
    const { users, meta } = await userService.getAllUsers(req.query);
    sendSuccess(res, 200, 'تم جلب قائمة المستخدمين بنجاح', { users }, meta);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    sendSuccess(res, 200, 'تم جلب بيانات المستخدم بنجاح', { user });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    sendSuccess(res, 201, 'تم إنشاء المستخدم بنجاح', { user });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    sendSuccess(res, 200, 'تم تحديث بيانات المستخدم بنجاح', { user });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    sendSuccess(res, 200, 'تم حذف المستخدم بنجاح');
  } catch (error) {
    next(error);
  }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await userService.toggleUserStatus(req.params.id);
    const msg = user.isActive ? 'تم تفعيل الحساب بنجاح' : 'تم تعطيل الحساب بنجاح';
    sendSuccess(res, 200, msg, { user });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser, toggleUserStatus };
