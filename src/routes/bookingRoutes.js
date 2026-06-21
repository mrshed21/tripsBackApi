const router = require('express').Router();
const bookingController = require('../controllers/bookingController');
const { protect } = require('../middlewares/auth');
const { restrictTo } = require('../middlewares/roleCheck');
const { createBookingRules } = require('../validators/bookingValidator');

router.use(protect);

// مسارات المستخدم
router.get('/my-bookings', bookingController.getMyBookings);
router.post('/', createBookingRules, bookingController.createBooking);
router.patch('/:id/cancel', bookingController.cancelBooking);

// مسارات الأدمن
router.get('/', restrictTo('admin'), bookingController.getAllBookings);
router.get('/stats', restrictTo('admin'), bookingController.getBookingStats);

module.exports = router;
