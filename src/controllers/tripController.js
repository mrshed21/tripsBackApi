const tripService = require('../services/tripService');
const { sendSuccess } = require('../utils/response');

const getAllTrips = async (req, res, next) => {
  try {
    const isAdmin = req.user?.role === 'admin';
    const { trips, meta } = await tripService.getAllTrips(req.query, isAdmin);
    sendSuccess(res, 200, 'تم جلب قائمة الرحلات بنجاح', { trips }, meta);
  } catch (error) {
    next(error);
  }
};

const getTripById = async (req, res, next) => {
  try {
    const trip = await tripService.getTripById(req.params.id);
    sendSuccess(res, 200, 'تم جلب بيانات الرحلة بنجاح', { trip });
  } catch (error) {
    next(error);
  }
};

const createTrip = async (req, res, next) => {
  try {
    const trip = await tripService.createTrip(req.body, req.user._id);
    sendSuccess(res, 201, 'تم إنشاء الرحلة بنجاح', { trip });
  } catch (error) {
    next(error);
  }
};

const updateTrip = async (req, res, next) => {
  try {
    const trip = await tripService.updateTrip(req.params.id, req.body);
    sendSuccess(res, 200, 'تم تحديث الرحلة بنجاح', { trip });
  } catch (error) {
    next(error);
  }
};

const deleteTrip = async (req, res, next) => {
  try {
    await tripService.deleteTrip(req.params.id);
    sendSuccess(res, 200, 'تم حذف الرحلة بنجاح');
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllTrips, getTripById, createTrip, updateTrip, deleteTrip };
