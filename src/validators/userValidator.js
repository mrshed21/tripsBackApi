const { body } = require('express-validator');
const validate = require('../middlewares/validate');

const createUserRules = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('الاسم الكامل مطلوب')
    .isLength({ min: 3, max: 100 }).withMessage('الاسم يجب أن يكون بين 3 و 100 حرف'),

  body('phone')
    .trim()
    .notEmpty().withMessage('رقم الهاتف مطلوب')
    .matches(/^[0-9]{10,15}$/).withMessage('رقم الهاتف يجب أن يكون بين 10 و 15 رقماً'),

  body('email')
    .trim()
    .notEmpty().withMessage('البريد الإلكتروني مطلوب')
    .isEmail().withMessage('البريد الإلكتروني غير صحيح')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('كلمة المرور مطلوبة')
    .isLength({ min: 8 }).withMessage('كلمة المرور يجب أن تكون 8 أحرف على الأقل'),

  body('role')
    .optional()
    .isIn(['admin', 'user']).withMessage('الدور يجب أن يكون admin أو user'),

  validate,
];

const updateUserRules = [
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('الاسم يجب أن يكون بين 3 و 100 حرف'),

  body('phone')
    .optional()
    .trim()
    .matches(/^[0-9]{10,15}$/).withMessage('رقم الهاتف يجب أن يكون بين 10 و 15 رقماً'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('البريد الإلكتروني غير صحيح')
    .normalizeEmail(),

  body('isActive')
    .optional()
    .isBoolean().withMessage('قيمة isActive يجب أن تكون true أو false'),

  body('role')
    .optional()
    .isIn(['admin', 'user']).withMessage('الدور يجب أن يكون admin أو user'),

  validate,
];

module.exports = { createUserRules, updateUserRules };
