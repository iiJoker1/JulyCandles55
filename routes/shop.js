const express = require('express');
const path = require('path');
const router = express.Router();

// ✨ وظيفة مساعدة لإرسال الملفات بعد تحميل الترجمة
function sendPage(res, filePath) {
  res.sendFile(path.join(__dirname, '..', 'public', ...filePath));
}

// ✅ الصفحات العامة (غير محمية)

// الصفحة الرئيسية
router.get(['/', '/home'], (req, res) => sendPage(res, ['pages', 'home.html']));

// من نحن
router.get('/about', (req, res) => sendPage(res, ['pages', 'about.html']));

// المدونة
router.get('/blog', (req, res) => sendPage(res, ['pages', 'blog.html']));

// تفاصيل مقالة
router.get('/blog-details', (req, res) => sendPage(res, ['pages', 'blog-details.html']));

// اتصل بنا
router.get('/contact', (req, res) => sendPage(res, ['pages', 'contact.html']));

// سياسة الخصوصية
router.get('/privacy-policy', (req, res) => sendPage(res, ['pages', 'privacy-policy.html']));

// ✅ صفحات المتجر
// router.get('/shop', (req, res) => sendPage(res, ['pages', 'shop', 'shop.html']));
router.get('/shop', (req, res) => sendPage(res, ['pages', 'shop', 'candles.html']));
// router.get('/shop/handmade', (req, res) => sendPage(res, ['pages', 'shop', 'handmade.html']));
// router.get('/shop/perfumes', (req, res) => sendPage(res, ['pages', 'shop', 'perfumes.html']));

// تفاصيل منتج
router.get('/product/:id', (req, res) => sendPage(res, ['pages', 'shop', 'product.html']));

// ✅ السلة والدفع
router.get('/cart', (req, res) => sendPage(res, ['pages', 'cart', 'view-cart.html']));
router.get('/checkout', (req, res) => sendPage(res, ['pages', 'cart', 'checkout.html']));
router.get('/track-order', (req, res) => sendPage(res, ['pages', 'cart', 'track-order.html']));

// ✅ المفضلة
router.get('/my-whitelist', (req, res) => sendPage(res, ['pages', 'shop', 'whitelist.html']));

// ✅ صفحات نجاح أو فشل الطلب
router.get('/success', (req, res) => sendPage(res, ['pages', 'success-canceled', 'success.html']));
router.get('/canceled', (req, res) => sendPage(res, ['pages', 'success-canceled', 'cancel.html']));

// ✅ صفحة الدفع عبر فودافون كاش
router.get('/vodafone-cash', (req, res) => sendPage(res, ['pages', 'cart', 'payments', 'vodafone-cash.html']));

module.exports = router;
