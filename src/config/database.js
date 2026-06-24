const mongoose = require('mongoose');

// Cache the connection across serverless invocations (Vercel cold starts)
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    isConnected = true;
    console.log(`✅ MongoDB متصل: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ فشل الاتصال بقاعدة البيانات: ${error.message}`);
    // Don't call process.exit() in serverless — throw so the request returns 500
    throw error;
  }
};

module.exports = connectDB;
