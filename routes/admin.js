const express = require('express');
const path = require('path');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order'); 

// ✅ ميدل وير لحماية الأدمن
function isAdmin(req, res, next) {
  if (!req.session.userData || req.session.userData.role !== "admin") {
    return res.sendFile(path.join(__dirname, '..', 'public', 'login', 'login.html'));
  }
  next();
}

// ✅ صفحة لوحة التحكم الرئيسية
router.get("/dashboard", isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'admin.html'));
});

// ✅ صفحة إضافة منتج
router.get("/add-product", isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'add-product.html'));
});

// ✅ صفحة حذف منتج
router.get("/delete-product", isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'delete-product.html'));
});

// ✅ صفحة إدارة الخصومات
router.get("/manage-discounts", isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'manage-discounts.html'));
});

// ✅ صفحة إدارة الهدايا اليومية
router.get("/manage-daily-gifts", isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'manage-daily-gifts.html'));
});

// ✅ صفحة الطلبات
router.get("/orders", isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'orders.html'));
});

// ✅ إحصائيات لوحة التحكم من MongoDB
router.get("/stats", isAdmin, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const candles = await Product.countDocuments({ category: "candles" });
    const perfumes = await Product.countDocuments({ category: "perfumes" });
    const handmade = await Product.countDocuments({ category: "handmade" });

    // في انتظار ربط الطلبات الحقيقي
    const orders = await Order.countDocuments(); // لو عندك موديل orders
    const totalSales = 0; // احسبه لاحقًا من الطلبات

    res.json({
      totalProducts,
      candles,
      perfumes,
      handmade,
      orders,
      totalSales,
      activeProducts: totalProducts
    });
  } catch (err) {
    console.error("Error loading stats:", err);
    res.status(500).json({ error: "فشل في تحميل الإحصائيات" });
  }
});

// عرض صفحة الأشخاص
router.get("/manage-users", async (req, res) => {
  const users = await User.find({});
  res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'manage-users.html'));

});

module.exports = router;
