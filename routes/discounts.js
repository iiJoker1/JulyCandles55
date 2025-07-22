const express = require('express');
const router = express.Router();
const DiscountCode = require('../models/DiscountCode'); // تأكد أن الموديل موجود

// ✅ جلب كل أكواد الخصم
router.get('/discount-codes', async (req, res) => {
  try {
    const codes = await DiscountCode.find();
    res.json(codes);
  } catch (err) {
    console.error("Error fetching discount codes:", err);
    res.status(500).json({ error: 'فشل في تحميل أكواد الخصم' });
  }
});

// ✅ إضافة كود خصم جديد
router.post('/add-discount', async (req, res) => {
  const { code, type, value } = req.body;

  if (!code || !type || !value) {
    return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
  }

  try {
    const exists = await DiscountCode.findOne({ code });
    if (exists) {
      return res.status(400).json({ error: 'الكود موجود بالفعل' });
    }

    const newCode = new DiscountCode({ code, type, value });
    await newCode.save();

    res.json({ message: '✅ تم إضافة الكود بنجاح' });
  } catch (err) {
    console.error("Error adding discount code:", err);
    res.status(500).json({ error: 'فشل في إضافة الكود' });
  }
});

// ✅ حذف كود خصم
router.post('/delete-discount', async (req, res) => {
  const { code } = req.body;

  if (!code) return res.status(400).json({ error: 'يرجى إدخال الكود' });

  try {
    const result = await DiscountCode.deleteOne({ code });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: '❌ الكود غير موجود' });
    }

    res.json({ message: '✅ تم الحذف بنجاح' });
  } catch (err) {
    console.error("Error deleting discount code:", err);
    res.status(500).json({ error: 'فشل في حذف الكود' });
  }
});

module.exports = router;
