const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.use(express.json()); // مهم عشان req.body تشتغل

router.use((req, res, next) => {
  if (!req.session.userData || req.session.userData.role !== "admin") {
    return res.status(401).json({ success: false, message: 'غير مصرح' });
  }
  next();
});



router.get('/discount-codes', (req, res) => {
  const filePath = path.join(__dirname, '../json/discount-codes.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'خطأ في قراءة الأكواد' });
    res.json(JSON.parse(data));
  });
});



// حذف كود خصم
router.post("/delete-discount", (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ success: false, message: "الكود غير موجود" });

  const filePath = path.join(__dirname, "../json/discount-codes.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ success: false, message: "فشل في قراءة الملف" });

    let discounts = JSON.parse(data);
    if (!discounts[code]) return res.status(404).json({ success: false, message: "الكود غير موجود" });

    delete discounts[code];

    fs.writeFile(filePath, JSON.stringify(discounts, null, 2), err => {
      if (err) return res.status(500).json({ success: false, message: "فشل في حفظ الملف" });
      res.json({ success: true, message: `تم حذف الكود ${code}` });
    });
  });
});

// إضافة كود خصم
router.post("/add-discount", (req, res) => {
    const { code, type, value } = req.body;
  
    // التحقق من الحقول المطلوبة
    if (!code || !type) {
      return res.status(400).json({ success: false, message: "يجب إدخال اسم الكود والنوع." });
    }
  
    const filePath = path.join(__dirname, "../json/discount-codes.json");
  
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) return res.status(500).json({ success: false, message: "فشل في قراءة الملف" });
  
      let discounts = {};
      try {
        discounts = JSON.parse(data);
      } catch (e) {
        return res.status(500).json({ success: false, message: "ملف الخصومات غير صالح" });
      }
  
      // التحقق إذا الكود موجود مسبقاً
      if (discounts[code]) {
        return res.status(400).json({ success: false, message: "الكود موجود بالفعل" });
      }
  
      // إضافة الكود الجديد
      discounts[code] = {
        type,
        value: value ? Number(value) : 0
      };
  
      fs.writeFile(filePath, JSON.stringify(discounts, null, 2), (err) => {
        if (err) return res.status(500).json({ success: false, message: "فشل في حفظ الكود" });
  
        res.json({ success: true, message: "تمت إضافة الكود بنجاح" });
      });
    });
  });

  ////////////

  const dailyGiftsPath = path.join(__dirname, "../json/daily-gifts.json");

  // استرجاع الرسائل الترويجية
  router.get("/daily-gifts", (req, res) => {
    fs.readFile(dailyGiftsPath, "utf8", (err, data) => {
      if (err) return res.status(500).json({ success: false, message: "فشل في قراءة الملف" });
  
      try {
        const messages = JSON.parse(data);
        res.json({ success: true, messages });
      } catch (e) {
        res.status(500).json({ success: false, message: "خطأ في تحويل البيانات" });
      }
    });
  });
  
  // إضافة رسالة
  router.post('/add-daily-gift', (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'الرسالة مطلوبة' });
  
    fs.readFile(dailyGiftsPath, 'utf8', (err, data) => {
      if (err) return res.status(500).json({ success: false, message: 'فشل في قراءة الملف' });
      let messages = JSON.parse(data);
      messages.push(message);
      fs.writeFile(dailyGiftsPath, JSON.stringify(messages, null, 2), err => {
        if (err) return res.status(500).json({ success: false, message: 'فشل في حفظ الملف' });
        res.json({ success: true, message: 'تمت إضافة الرسالة بنجاح' });
      });
    });
  });
  
  // حذف رسالة
  router.post('/delete-daily-gift', (req, res) => {
    const { index } = req.body;
    if (typeof index !== 'number') return res.status(400).json({ success: false, message: 'مؤشر غير صالح' });
  
    fs.readFile(dailyGiftsPath, 'utf8', (err, data) => {
      if (err) return res.status(500).json({ success: false, message: 'فشل في قراءة الملف' });
      let messages = JSON.parse(data);
      if (index < 0 || index >= messages.length) return res.status(404).json({ success: false, message: 'العنصر غير موجود' });
  
      messages.splice(index, 1);
      fs.writeFile(dailyGiftsPath, JSON.stringify(messages, null, 2), err => {
        if (err) return res.status(500).json({ success: false, message: 'فشل في حفظ الملف' });
        res.json({ success: true, message: 'تم حذف الرسالة بنجاح' });
      });
    });
  });
  
  

module.exports = router;
