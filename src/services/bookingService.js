const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Trip = require('../models/Trip');
const AppError = require('../utils/AppError');
const { getPaginationParams, buildPaginationMeta } = require('../utils/pagination');

const getAllBookings = async (query) => {
  const { page, limit, skip } = getPaginationParams(query);

  const filter = {};
  if (query.status) filter.bookingStatus = query.status;
  if (query.userId) filter.user = query.userId;
  if (query.tripId) filter.trip = query.tripId;

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate('user', 'fullName email phone')
      .populate('trip', 'departureCity arrivalCity departureDate departureTime price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Booking.countDocuments(filter),
  ]);

  return { bookings, meta: buildPaginationMeta(total, page, limit) };
};

const getMyBookings = async (userId, query) => {
  const { page, limit, skip } = getPaginationParams(query);

  const filter = { user: userId };
  if (query.status) filter.bookingStatus = query.status;

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate('trip', 'departureCity arrivalCity departureDate departureTime arrivalTime price status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Booking.countDocuments(filter),
  ]);

  return { bookings, meta: buildPaginationMeta(total, page, limit) };
};

const createBooking = async (userId, tripId, seats) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const trip = await Trip.findById(tripId).session(session);
    if (!trip) throw new AppError('الرحلة غير موجودة', 404);
    if (trip.status !== 'active') throw new AppError('هذه الرحلة غير متاحة للحجز', 400);
    if (new Date(trip.departureDate) < new Date()) throw new AppError('لا يمكن الحجز على رحلة منتهية', 400);
    if (trip.availableSeats < seats) {
      throw new AppError(`عدد المقاعد المتاحة (${trip.availableSeats}) أقل من المطلوب`, 400);
    }

    trip.availableSeats -= seats;
    await trip.save({ session });

    const totalPrice = trip.price * seats;
    const booking = await Booking.create(
      [{ user: userId, trip: tripId, seats, totalPrice, bookingStatus: 'confirmed' }],
      { session }
    );

    await session.commitTransaction();

    return (await Booking.findById(booking[0]._id).populate(
      'trip',
      'departureCity arrivalCity departureDate departureTime arrivalTime price'
    ));
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const cancelBooking = async (bookingId, userId, isAdmin = false) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.findById(bookingId).session(session);
    if (!booking) throw new AppError('الحجز غير موجود', 404);

    if (!isAdmin && booking.user.toString() !== userId.toString()) {
      throw new AppError('ليس لديك صلاحية لإلغاء هذا الحجز', 403);
    }

    if (booking.bookingStatus === 'cancelled') {
      throw new AppError('هذا الحجز ملغى مسبقاً', 400);
    }

    const trip = await Trip.findById(booking.trip).session(session);
    if (trip && trip.status !== 'completed') {
      trip.availableSeats += booking.seats;
      await trip.save({ session });
    }

    booking.bookingStatus = 'cancelled';
    await booking.save({ session });

    await session.commitTransaction();
    return booking;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getBookingStats = async () => {
  const [statusStats, revenueStats, topTrips] = await Promise.all([
    Booking.aggregate([
      { $group: { _id: '$bookingStatus', count: { $sum: 1 }, totalSeats: { $sum: '$seats' } } },
    ]),
    Booking.aggregate([
      { $match: { bookingStatus: 'confirmed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' }, totalBookings: { $sum: 1 } } },
    ]),
    Booking.aggregate([
      { $match: { bookingStatus: 'confirmed' } },
      { $group: { _id: '$trip', totalBookings: { $sum: 1 }, totalSeats: { $sum: '$seats' } } },
      { $sort: { totalBookings: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'trips', localField: '_id', foreignField: '_id', as: 'trip' } },
      { $unwind: '$trip' },
      {
        $project: {
          totalBookings: 1,
          totalSeats: 1,
          'trip.departureCity': 1,
          'trip.arrivalCity': 1,
          'trip.departureDate': 1,
        },
      },
    ]),
  ]);

  const stats = { byStatus: {}, revenue: 0, totalConfirmedBookings: 0, topTrips };
  statusStats.forEach((s) => { stats.byStatus[s._id] = { count: s.count, seats: s.totalSeats }; });
  if (revenueStats[0]) {
    stats.revenue = revenueStats[0].totalRevenue;
    stats.totalConfirmedBookings = revenueStats[0].totalBookings;
  }

  return stats;
};

module.exports = { getAllBookings, getMyBookings, createBooking, cancelBooking, getBookingStats };
