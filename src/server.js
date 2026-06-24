require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

// ── Vercel serverless ──────────────────────────────────────────────────────
// Vercel imports this file and calls module.exports(req, res) per request.
// We connect to MongoDB before forwarding to Express (connection is cached).
module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};

// ── Local development ──────────────────────────────────────────────────────
// When run directly (`node src/server.js`) start a real HTTP server.
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  connectDB().then(() => {
    const server = app.listen(PORT, () => {
      console.log(`🚀 الخادم يعمل على المنفذ ${PORT} في وضع ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 http://localhost:${PORT}/health`);
    });

    const shutdown = (signal) => {
      console.log(`\n⚠️  استلام إشارة ${signal}، جاري إيقاف الخادم...`);
      server.close(() => process.exit(0));
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  }).catch((err) => {
    console.error('❌ فشل بدء الخادم:', err.message);
    process.exit(1);
  });
}
