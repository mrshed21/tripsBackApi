require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Trip = require('./src/models/Trip');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ متصل بقاعدة البيانات');
};

const seedAdmin = async () => {
  const existing = await User.findOne({ role: 'admin' });
  if (existing) {
    console.log('⚠️  يوجد أدمن مسبقاً:', existing.email);
    return existing;
  }

  const admin = await User.create({
    fullName: process.env.ADMIN_NAME || 'مدير النظام',
    email: process.env.ADMIN_EMAIL || 'admin@trips.com',
    phone: process.env.ADMIN_PHONE || '01000000000',
    password: process.env.ADMIN_PASSWORD || 'Admin@123456',
    role: 'admin',
    isActive: true,
  });

  console.log('✅ تم إنشاء الأدمن:', admin.email);
  return admin;
};

const seedTrips = async (adminId) => {
  const count = await Trip.countDocuments();
  if (count > 0) {
    console.log(`⚠️  يوجد ${count} رحلة مسبقاً، تم تخطي إنشاء الرحلات`);
    return;
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  const trips = [
    {
      departureCity: 'القاهرة',
      arrivalCity: 'الإسكندرية',
      departureDate: tomorrow,
      departureTime: '08:00',
      arrivalTime: '11:00',
      price: 150,
      totalSeats: 40,
      description: 'رحلة مريحة بين القاهرة والإسكندرية',
      status: 'active',
      createdBy: adminId,
    },
    {
      departureCity: 'القاهرة',
      arrivalCity: 'أسوان',
      departureDate: tomorrow,
      departureTime: '20:00',
      arrivalTime: '08:00',
      price: 350,
      totalSeats: 35,
      description: 'رحلة ليلية مكيفة',
      status: 'active',
      createdBy: adminId,
    },
    {
      departureCity: 'الإسكندرية',
      arrivalCity: 'القاهرة',
      departureDate: nextWeek,
      departureTime: '09:00',
      arrivalTime: '12:00',
      price: 150,
      totalSeats: 40,
      status: 'active',
      createdBy: adminId,
    },
    {
      departureCity: 'القاهرة',
      arrivalCity: 'الأقصر',
      departureDate: nextWeek,
      departureTime: '21:00',
      arrivalTime: '07:00',
      price: 300,
      totalSeats: 30,
      description: 'رحلة سياحية فاخرة',
      status: 'active',
      createdBy: adminId,
    },
  ];

  await Trip.insertMany(trips);
  console.log(`✅ تم إنشاء ${trips.length} رحلات تجريبية`);
};

const run = async () => {
  try {
    await connectDB();
    const admin = await seedAdmin();
    await seedTrips(admin._id);
    console.log('\n🎉 تم تشغيل السيد بنجاح!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 البريد: ${process.env.ADMIN_EMAIL || 'admin@trips.com'}`);
    console.log(`🔑 كلمة المرور: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } catch (error) {
    console.error('❌ خطأ في السيد:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 تم قطع الاتصال بقاعدة البيانات');
    process.exit(0);
  }
};

run();
