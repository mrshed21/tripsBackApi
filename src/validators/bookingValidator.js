const { body } = require('express-validator');
const validate = require('../middlewares/validate');

const createBookingRules = [
  body('tripId')
    .notEmpty().withMessage('معرّف الرحلة مطلوب')
    .isMongoId().withMessage('معرّف الرحلة غير صحيح'),

  body('seats')
    .notEmpty().withMessage('عدد المقاعد مطلوب')
    .isInt({ min: 1, max: 10 }).withMessage('عدد المقاعد يجب أن يكون بين 1 و 10'),

  validate,
];

module.exports = { createBookingRules };
