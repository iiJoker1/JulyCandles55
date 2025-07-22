const express = require('express');
const router = express.Router();
const User = require('../models/User');

// جلب كل المستخدمين
router.get("/api/users", async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// تغيير الرول
router.put("/api/users/:id/role", async (req, res) => {
  const { role } = req.body;
  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ message: "دور غير صالح." });
  }
  try {
    await User.findByIdAndUpdate(req.params.id, { role });
    res.json({ message: "✅ تم تحديث الدور بنجاح" });
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ أثناء التحديث" });
  }
});

// ✅ تسجيل مستخدم جديد
router.post('/api/register', async (req, res) => {
  const { username, password, email, phone, role } = req.body;
  // const username = name;

  if (!username || !password || !email) {
    return res.status(400).json({ message: '❌ يرجى إدخال اسم المستخدم والبريد وكلمة المرور' });
  }

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: '❌ البريد الإلكتروني مسجل بالفعل' });
    }

    const newUser = new User({
      username,
      password,
      email,
      phone: phone || '',
      role: role || 'user'
    });

    await newUser.save();
    res.status(201).json({ message: '✅ تم إنشاء الحساب بنجاح' });
  } catch (err) {
    console.error('❌ خطأ أثناء إنشاء الحساب:', err);
    res.status(500).json({ message: 'حدث خطأ أثناء التسجيل' });
  }
});

module.exports = router;
