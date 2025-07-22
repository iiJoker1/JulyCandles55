// routes/gifts.js
const express = require('express');
const router = express.Router();
const GiftMessage = require('../models/GiftMessage'); // تأكد أن الموديل موجود

// ✅ جلب كل الهدايا
router.get('/daily-gifts', async (req, res) => {
  try {
    const gifts = await GiftMessage.find();
    res.json({ success: true, messages: gifts.map(g => g.message) });

  } catch (err) {
    console.error("Error fetching gifts:", err);
    res.status(500).json({ error: 'فشل في تحميل الهدايا' });
  }
});

// ✅ إضافة هدية جديدة
router.post('/add-daily-gift', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'يرجى كتابة رسالة الهدية' });
  }

  try {
    const newGift = new GiftMessage({ message });
    await newGift.save();
    res.json({ message: '✅ تم إضافة الهدية بنجاح' });
  } catch (err) {
    console.error("Error adding gift:", err);
    res.status(500).json({ error: 'فشل في إضافة الهدية' });
  }
});

// ✅ حذف هدية
router.post('/delete-daily-gift', async (req, res) => {
  const { index } = req.body;

  if (index === undefined) {
    return res.status(400).json({ error: 'يرجى إرسال رقم الرسالة (index)' });
  }

  try {
    const allGifts = await GiftMessage.find();
    const giftToDelete = allGifts[index];
    if (!giftToDelete) {
      return res.status(404).json({ error: '❌ لم يتم العثور على الرسالة' });
    }

    await GiftMessage.deleteOne({ _id: giftToDelete._id });

    res.json({ message: '✅ تم حذف الرسالة بنجاح' });
  } catch (err) {
    console.error("Error deleting gift:", err);
    res.status(500).json({ error: 'فشل في حذف الرسالة' });
  }
});


// ✅ اختيار هدية عشوائية (تُستخدم عند طلب جديد)
router.get('/random-gift', async (req, res) => {
  try {
    const count = await GiftMessage.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const randomGift = await GiftMessage.findOne().skip(randomIndex);
    res.json({ gift: randomGift.message || "لا توجد هدايا حالياً" });
  } catch (err) {
    console.error("Error selecting random gift:", err);
    res.status(500).json({ error: 'فشل في اختيار الهدية' });
  }
});

module.exports = router;
