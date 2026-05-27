import { Router } from 'express';
import { body } from 'express-validator';
import {
  changePassword,
  login,
  loginAdmin,
  loginCustomer,
  loginSuperAdmin,
  me,
  registerCustomer,
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { authRateLimit } from '../middlewares/securityMiddleware.js';

const router = Router();

const loginValidators = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isString().isLength({ min: 8, max: 128 }).withMessage('Password is invalid'),
];

router.post('/login', authRateLimit, loginValidators, validate, login);
router.post('/login/admin', authRateLimit, loginValidators, validate, loginAdmin);
router.post('/login/super-admin', authRateLimit, loginValidators, validate, loginSuperAdmin);
router.post('/login/customer', authRateLimit, loginValidators, validate, loginCustomer);
router.post(
  '/register/customer',
  authRateLimit,
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 120 }),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('phone').optional().trim().isLength({ max: 40 }),
    body('company').optional().trim().isLength({ max: 140 }),
    body('password')
      .isString()
      .isLength({ min: 8, max: 128 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
      .withMessage('Password must contain uppercase, lowercase, and a number'),
  ],
  validate,
  registerCustomer
);
router.get('/me', protect, me);
router.post(
  '/change-password',
  protect,
  [
    body('currentPassword').isString().isLength({ min: 8, max: 128 }),
    body('newPassword')
      .isString()
      .isLength({ min: 8, max: 128 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
  ],
  validate,
  changePassword
);

export default router;
