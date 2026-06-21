const router = require('express').Router();
const tripController = require('../controllers/tripController');
const { protect } = require('../middlewares/auth');
const { restrictTo } = require('../middlewares/roleCheck');
const { createTripRules, updateTripRules } = require('../validators/tripValidator');

// مسارات عامة — يتطلب تسجيل دخول للتمييز بين admin و user
router.get('/', protect, tripController.getAllTrips);
router.get('/:id', protect, tripController.getTripById);

// مسارات الأدمن فقط
router.post('/', protect, restrictTo('admin'), createTripRules, tripController.createTrip);
router.patch('/:id', protect, restrictTo('admin'), updateTripRules, tripController.updateTrip);
router.delete('/:id', protect, restrictTo('admin'), tripController.deleteTrip);

module.exports = router;
