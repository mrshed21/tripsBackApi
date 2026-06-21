const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'المستخدم مطلوب'],
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: [true, 'الرحلة مطلوبة'],
    },
    seats: {
      type: Number,
      required: [true, 'عدد المقاعد مطلوب'],
      min: [1, 'يجب حجز مقعد واحد على الأقل'],
      max: [10, 'لا يمكن حجز أكثر من 10 مقاعد في مرة واحدة'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'السعر الإجمالي مطلوب'],
      min: [0, 'السعر الإجمالي لا يمكن أن يكون سالباً'],
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'confirmed',
    },
  },
  { timestamps: true }
);

bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ trip: 1, bookingStatus: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
