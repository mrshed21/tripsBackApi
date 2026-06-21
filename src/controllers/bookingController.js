const bookingService = require('../services/bookingService');
const { sendSuccess } = require('../utils/response');

const getAllBookings = async (req, res, next) => {
  try {
    const { bookings, meta } = await bookingService.getAllBookings(req.query);
    sendSuccess(res, 200, 'تم جلب قائمة الحجوزات بنجاح', { bookings }, meta);
  } catch (error) {
    next(error);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    const { bookings, meta } = await bookingService.getMyBookings(req.user._id, req.query);
    sendSuccess(res, 200, 'تم جلب حجوزاتك بنجاح', { bookings }, meta);
  } catch (error) {
    next(error);
  }
};

const createBooking = async (req, res, next) => {
  try {
    const { tripId, seats } = req.body;
    const booking = await bookingService.createBooking(req.user._id, tripId, seats);
    sendSuccess(res, 201, 'تم تأكيد الحجز بنجاح', { booking });
  } catch (error) {
    next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const booking = await bookingService.cancelBooking(req.params.id, req.user._id, isAdmin);
    sendSuccess(res, 200, 'تم إلغاء الحجز بنجاح', { booking });
  } catch (error) {
    next(error);
  }
};

const getBookingStats = async (req, res, next) => {
  try {
    const stats = await bookingService.getBookingStats();
    sendSuccess(res, 200, 'تم جلب إحصائيات الحجوزات بنجاح', { stats });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllBookings, getMyBookings, createBooking, cancelBooking, getBookingStats };
