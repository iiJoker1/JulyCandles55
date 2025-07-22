const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// ✅ تأكد من وجود مجلد "vodafone-receipts"
const uploadDir = path.join(__dirname, '..', 'uploads', 'vodafone-receipts');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ إعداد multer لتخزين الملفات
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// ✅ رفع إيصال فودافون كاش
router.post('/vodafone-receipt', upload.single('receipt'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: '❌ لم يتم رفع الملف' });
  }

  res.json({
    success: true,
    message: '✅ تم رفع الإيصال بنجاح',
    fileName: req.file.filename,
    filePath: `/uploads/vodafone-receipts/${req.file.filename}`
  });
});

module.exports = router;
