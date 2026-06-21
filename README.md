# 🚌 نظام حجز الرحلات بين المحافظات

Backend API متكامل لنظام حجز رحلات الأتوبيس بين المحافظات، مبني بـ Node.js + Express.js + MongoDB.

---

## ⚡ التشغيل السريع

### 1. المتطلبات
- Node.js >= 18
- MongoDB (محلي أو Atlas)

### 2. التثبيت
```bash
npm install
```

### 3. إعداد متغيرات البيئة
```bash
cp .env.example .env
# عدّل قيم .env حسب بيئتك
```

### 4. إنشاء أول أدمن + بيانات تجريبية
```bash
npm run seed
```

### 5. تشغيل الخادم
```bash
# وضع التطوير
npm run dev

# وضع الإنتاج
npm start
```

الخادم يعمل على: `http://localhost:5000`

---

## 📋 متغيرات البيئة

| المتغير | الوصف | القيمة الافتراضية |
|---------|-------|------------------|
| `PORT` | منفذ الخادم | `5000` |
| `NODE_ENV` | بيئة التشغيل | `development` |
| `MONGO_URI` | رابط MongoDB | `mongodb://localhost:27017/trip-booking-system` |
| `JWT_SECRET` | مفتاح JWT السري | — |
| `JWT_EXPIRES_IN` | مدة صلاحية التوكن | `7d` |
| `ADMIN_EMAIL` | إيميل الأدمن الأول | `admin@trips.com` |
| `ADMIN_PASSWORD` | كلمة مرور الأدمن | `Admin@123456` |

---

## 🗂️ هيكل المشروع

```
src/
├── config/          # إعدادات قاعدة البيانات والثوابت
├── models/          # Mongoose Models (User, Trip, Booking)
├── controllers/     # معالجات الطلبات
├── services/        # المنطق التجاري (Business Logic)
├── routes/          # تعريف المسارات
├── middlewares/     # Auth, RoleCheck, ErrorHandler, Validate
├── validators/      # express-validator rules
├── utils/           # AppError, response, pagination, jwt
├── app.js           # إعداد Express
└── server.js        # نقطة الدخول
```

---

## 🔐 المصادقة

جميع المسارات المحمية تتطلب إرسال التوكن في الـ Header:

```
Authorization: Bearer <token>
```

---

## 📡 API Reference

### Authentication

| Method | Endpoint | الوصف | Auth |
|--------|----------|-------|------|
| `POST` | `/api/auth/register` | تسجيل مستخدم جديد | ❌ |
| `POST` | `/api/auth/login` | تسجيل الدخول | ❌ |
| `GET` | `/api/auth/me` | بيانات المستخدم الحالي | ✅ |
| `PATCH` | `/api/auth/update-profile` | تعديل الملف الشخصي | ✅ |
| `PATCH` | `/api/auth/change-password` | تغيير كلمة المرور | ✅ |

#### POST /api/auth/register
```json
{
  "fullName": "محمد أحمد",
  "phone": "01012345678",
  "email": "user@example.com",
  "password": "Password123"
}
```

#### POST /api/auth/login
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

---

### Users (Admin Only)

| Method | Endpoint | الوصف |
|--------|----------|-------|
| `GET` | `/api/users` | قائمة جميع المستخدمين |
| `GET` | `/api/users/:id` | بيانات مستخدم محدد |
| `POST` | `/api/users` | إنشاء مستخدم جديد |
| `PATCH` | `/api/users/:id` | تعديل مستخدم |
| `DELETE` | `/api/users/:id` | حذف مستخدم |
| `PATCH` | `/api/users/:id/toggle-status` | تفعيل/تعطيل حساب |

#### Query Parameters للبحث والتصفية
```
GET /api/users?search=محمد&role=user&isActive=true&page=1&limit=10
```

---

### Trips

| Method | Endpoint | الوصف | Auth |
|--------|----------|-------|------|
| `GET` | `/api/trips` | عرض الرحلات المتاحة | ✅ User/Admin |
| `GET` | `/api/trips/:id` | تفاصيل رحلة | ✅ User/Admin |
| `POST` | `/api/trips` | إنشاء رحلة | ✅ Admin |
| `PATCH` | `/api/trips/:id` | تعديل رحلة | ✅ Admin |
| `DELETE` | `/api/trips/:id` | حذف رحلة | ✅ Admin |

#### Query Parameters للبحث
```
GET /api/trips?departureCity=القاهرة&arrivalCity=الإسكندرية&date=2026-07-01&page=1&limit=10
```

#### POST /api/trips
```json
{
  "departureCity": "القاهرة",
  "arrivalCity": "الإسكندرية",
  "departureDate": "2026-07-15",
  "departureTime": "08:00",
  "arrivalTime": "11:00",
  "price": 150,
  "totalSeats": 40,
  "description": "رحلة مريحة مكيفة"
}
```

---

### Bookings

| Method | Endpoint | الوصف | Auth |
|--------|----------|-------|------|
| `GET` | `/api/bookings` | جميع الحجوزات | ✅ Admin |
| `GET` | `/api/bookings/stats` | إحصائيات الحجوزات | ✅ Admin |
| `GET` | `/api/bookings/my-bookings` | حجوزاتي | ✅ User |
| `POST` | `/api/bookings` | حجز رحلة | ✅ User |
| `PATCH` | `/api/bookings/:id/cancel` | إلغاء حجز | ✅ User/Admin |

#### POST /api/bookings
```json
{
  "tripId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "seats": 2
}
```

---

## 📊 نموذج الاستجابة

### نجاح
```json
{
  "success": true,
  "message": "تم جلب البيانات بنجاح",
  "data": { ... },
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### خطأ
```json
{
  "success": false,
  "message": "رسالة الخطأ هنا"
}
```

---

## 🛡️ الأمان

- **Helmet** — HTTP Security Headers
- **Rate Limiting** — 100 طلب / 15 دقيقة، و10 محاولات دخول / 15 دقيقة
- **bcryptjs** — تشفير كلمات المرور (salt rounds = 12)
- **JWT** — مصادقة بتوكن
- **Mongoose Transactions** — لعمليات الحجز وضمان Atomicity
- **Input Validation** — express-validator على جميع المدخلات

---

## 🧪 اختبار الـ API

استيراد ملف `postman_collection.json` في Postman:
1. افتح Postman
2. Import → Upload Files
3. اختر `postman_collection.json`
4. عدّل متغير `baseUrl` إلى `http://localhost:5000`
