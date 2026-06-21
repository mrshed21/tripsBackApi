const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    departureCity: {
      type: String,
      required: [true, 'مدينة المغادرة مطلوبة'],
      trim: true,
    },
    arrivalCity: {
      type: String,
      required: [true, 'مدينة الوصول مطلوبة'],
      trim: true,
    },
    departureDate: {
      type: Date,
      required: [true, 'تاريخ المغادرة مطلوب'],
    },
    departureTime: {
      type: String,
      required: [true, 'وقت المغادرة مطلوب'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'صيغة الوقت غير صحيحة (HH:MM)'],
    },
    arrivalTime: {
      type: String,
      required: [true, 'وقت الوصول مطلوب'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'صيغة الوقت غير صحيحة (HH:MM)'],
    },
    price: {
      type: Number,
      required: [true, 'سعر التذكرة مطلوب'],
      min: [0, 'السعر يجب أن يكون أكبر من 0'],
    },
    totalSeats: {
      type: Number,
      required: [true, 'إجمالي عدد المقاعد مطلوب'],
      min: [1, 'يجب أن يكون هناك مقعد واحد على الأقل'],
    },
    availableSeats: {
      type: Number,
      min: [0, 'عدد المقاعد المتاحة لا يمكن أن يكون سالباً'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'الوصف يجب أن لا يتجاوز 500 حرف'],
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'completed'],
      default: 'active',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// تعيين المقاعد المتاحة تساوي الإجمالي عند الإنشاء
tripSchema.pre('save', function (next) {
  if (this.isNew) {
    this.availableSeats = this.totalSeats;
  }
  next();
});

tripSchema.index({ departureCity: 1, arrivalCity: 1, departureDate: 1 });
tripSchema.index({ status: 1 });

module.exports = mongoose.model('Trip', tripSchema);
