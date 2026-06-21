const { body } = require('express-validator');
const validate = require('../middlewares/validate');

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const createTripRules = [
  body('departureCity')
    .trim()
    .notEmpty().withMessage('مدينة المغادرة مطلوبة'),

  body('arrivalCity')
    .trim()
    .notEmpty().withMessage('مدينة الوصول مطلوبة')
    .custom((value, { req }) => {
      if (value === req.body.departureCity) {
        throw new Error('مدينة المغادرة ومدينة الوصول يجب أن تكونا مختلفتين');
      }
      return true;
    }),

  body('departureDate')
    .notEmpty().withMessage('تاريخ المغادرة مطلوب')
    .isISO8601().withMessage('صيغة التاريخ غير صحيحة')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('تاريخ المغادرة يجب أن يكون في المستقبل');
      }
      return true;
    }),

  body('departureTime')
    .notEmpty().withMessage('وقت المغادرة مطلوب')
    .matches(timeRegex).withMessage('صيغة وقت المغادرة غير صحيحة (HH:MM)'),

  body('arrivalTime')
    .notEmpty().withMessage('وقت الوصول مطلوب')
    .matches(timeRegex).withMessage('صيغة وقت الوصول غير صحيحة (HH:MM)'),

  body('price')
    .notEmpty().withMessage('سعر التذكرة مطلوب')
    .isFloat({ min: 0 }).withMessage('السعر يجب أن يكون رقماً موجباً'),

  body('totalSeats')
    .notEmpty().withMessage('إجمالي عدد المقاعد مطلوب')
    .isInt({ min: 1 }).withMessage('عدد المقاعد يجب أن يكون رقماً صحيحاً موجباً'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('الوصف يجب أن لا يتجاوز 500 حرف'),

  validate,
];

const updateTripRules = [
  body('departureCity').optional().trim().notEmpty().withMessage('مدينة المغادرة لا يمكن أن تكون فارغة'),
  body('arrivalCity').optional().trim().notEmpty().withMessage('مدينة الوصول لا يمكن أن تكون فارغة'),
  body('departureDate').optional().isISO8601().withMessage('صيغة التاريخ غير صحيحة'),
  body('departureTime').optional().matches(timeRegex).withMessage('صيغة وقت المغادرة غير صحيحة (HH:MM)'),
  body('arrivalTime').optional().matches(timeRegex).withMessage('صيغة وقت الوصول غير صحيحة (HH:MM)'),
  body('price').optional().isFloat({ min: 0 }).withMessage('السعر يجب أن يكون رقماً موجباً'),
  body('totalSeats').optional().isInt({ min: 1 }).withMessage('عدد المقاعد يجب أن يكون رقماً صحيحاً موجباً'),
  body('status').optional().isIn(['active', 'cancelled', 'completed']).withMessage('حالة الرحلة غير صحيحة'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('الوصف يجب أن لا يتجاوز 500 حرف'),
  validate,
];

module.exports = { createTripRules, updateTripRules };
