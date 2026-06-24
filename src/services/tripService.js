const Trip = require('../models/Trip');
const Booking = require('../models/Booking');
const AppError = require('../utils/AppError');
const { getPaginationParams, buildPaginationMeta } = require('../utils/pagination');

const getAllTrips = async (query, isAdmin = false) => {
  const { page, limit, skip } = getPaginationParams(query);

  const filter = {};

  if (!isAdmin) {
    filter.status = 'active';
    filter.departureDate = { $gte: new Date() };
  } else {
    if (query.status) filter.status = query.status;
  }

  if (query.departureCity) {
    filter.departureCity = { $regex: query.departureCity, $options: 'i' };
  }
  if (query.arrivalCity) {
    filter.arrivalCity = { $regex: query.arrivalCity, $options: 'i' };
  }
  if (query.date) {
    const startOfDay = new Date(query.date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(query.date);
    endOfDay.setHours(23, 59, 59, 999);
    filter.departureDate = { $gte: startOfDay, $lte: endOfDay };
  }

  const [trips, total] = await Promise.all([
    Trip.find(filter)
      .populate('createdBy', 'fullName email')
      .sort({ departureDate: 1, departureTime: 1 })
      .skip(skip)
      .limit(limit),
    Trip.countDocuments(filter),
  ]);

  return { trips, meta: buildPaginationMeta(total, page, limit) };
};

const getTripById = async (id) => {
  const trip = await Trip.findById(id).populate('createdBy', 'fullName email');
  if (!trip) throw new AppError('الرحلة غير موجودة', 404);
  return trip;
};

const createTrip = async (data, adminId) => {
  return Trip.create({
    ...data,
    availableSeats: data.totalSeats,
    createdBy: adminId,
  });
};

const updateTrip = async (id, data) => {
  const trip = await Trip.findById(id);
  if (!trip) throw new AppError('الرحلة غير موجودة', 404);

  if (data.totalSeats !== undefined && data.totalSeats < trip.totalSeats - trip.availableSeats) {
    throw new AppError('لا يمكن تقليل المقاعد الإجمالية أقل من عدد المقاعد المحجوزة', 400);
  }

  if (data.totalSeats !== undefined) {
    const bookedSeats = trip.totalSeats - trip.availableSeats;
    data.availableSeats = data.totalSeats - bookedSeats;
  }

  Object.assign(trip, data);
  await trip.save();
  return trip;
};

const deleteTrip = async (id) => {
  const trip = await Trip.findById(id);
  if (!trip) throw new AppError('الرحلة غير موجودة', 404);

  const activeBookings = await Booking.countDocuments({
    trip: id,
    bookingStatus: 'confirmed',
  });
  if (activeBookings > 0) {
    throw new AppError(
      `لا يمكن حذف الرحلة، يوجد ${activeBookings} حجز نشط عليها`,
      400
    );
  }

  await Trip.findByIdAndDelete(id);
};

module.exports = { getAllTrips, getTripById, createTrip, updateTrip, deleteTrip };
