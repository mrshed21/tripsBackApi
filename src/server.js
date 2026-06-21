require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`🚀 الخادم يعمل على المنفذ ${PORT} في وضع ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 http://localhost:${PORT}/health`);
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    console.log(`\n⚠️  استلام إشارة ${signal}، جاري إيقاف الخادم...`);
    server.close(() => {
      console.log('✅ تم إيقاف الخادم بنجاح');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (err) => {
    console.error('❌ خطأ غير معالج:', err.message);
    server.close(() => process.exit(1));
  });
};

startServer();
