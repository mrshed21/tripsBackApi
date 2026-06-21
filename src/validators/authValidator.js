const { body } = require('express-validator');
const validate = require('../middlewares/validate');

const registerRules = [
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
    .isLength({ min: 8 }).withMessage('كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم'),

  validate,
];

const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('البريد الإلكتروني مطلوب')
    .isEmail().withMessage('البريد الإلكتروني غير صحيح')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('كلمة المرور مطلوبة'),

  validate,
];

const changePasswordRules = [
  body('currentPassword')
    .notEmpty().withMessage('كلمة المرور الحالية مطلوبة'),

  body('newPassword')
    .notEmpty().withMessage('كلمة المرور الجديدة مطلوبة')
    .isLength({ min: 8 }).withMessage('كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم'),

  validate,
];

module.exports = { registerRules, loginRules, changePasswordRules };
