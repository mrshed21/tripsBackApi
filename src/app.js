const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const errorHandler = require('./middlewares/errorHandler');
const AppError = require('./utils/AppError');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const tripRoutes = require('./routes/tripRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(cors());

// Request logging (dev only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'طلبات كثيرة جداً، يرجى المحاولة بعد 15 دقيقة' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Auth rate limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'محاولات دخول كثيرة جداً، يرجى المحاولة بعد 15 دقيقة' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'الخادم يعمل بشكل طبيعي', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/bookings', bookingRoutes);

// 404 handler
app.all('*', (req, res, next) => {
  next(new AppError(`المسار ${req.originalUrl} غير موجود`, 404));
});

// Global error handler
app.use(errorHandler);

module.exports = app;
