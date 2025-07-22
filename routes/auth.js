const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const router = express.Router();
const User = require('../models/User'); // تأكد إن الموديل موجود

// صفحة تسجيل الدخول
router.get("/login", (req, res) => {
  if (req.session.user) return res.redirect("/home");
  res.sendFile(path.join(__dirname, "../public/login/login.html"));
});

// تسجيل الدخول
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });

    if (user) {
      req.session.userData = {
        _id: user._id,
        username: user.username,
        fatherName: user.fatherName || "",
        email: user.email,
        phone: user.phone || "",
        role: user.role || "user",
        avatar: user.avatar || null
      };
      req.session.user = user.email;
      return res.redirect("/home");
    } else {
      const loginPage = fs.readFileSync(path.join(__dirname, "../public/login/login.html"), "utf-8")
        .replace("%MESSAGE%", "<p style='color:red;display:block;'>❌ البريد الإلكتروني أو كلمة المرور غير صحيحة</p>");
      return res.send(loginPage);
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("خطأ في السيرفر.");
  }
});

// تسجيل الخروج
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// صفحة التسجيل
router.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login/register.html"));
});

// تنفيذ التسجيل
router.post("/register", async (req, res) => {
  const { username, fatherName, email, password, confirmPassword, phone, agree } = req.body;

  if (!username || !fatherName || !email || !password || !confirmPassword || !agree) {
    const registerPage = fs.readFileSync(path.join(__dirname, "../public/login/register.html"), "utf-8")
      .replace("%MESSAGE%", "<p style='color:red;display:block;'>❌ جميع الحقول مطلوبة ما عدا رقم الهاتف.</p>");
    return res.send(registerPage);
  }

  if (password !== confirmPassword) {
    const registerPage = fs.readFileSync(path.join(__dirname, "../public/login/register.html"), "utf-8")
      .replace("%MESSAGE%", "<p style='color:red;display:block;'>❌ كلمتا المرور غير متطابقتين.</p>");
    return res.send(registerPage);
  }

  const exists = await User.findOne({ email });
  if (exists) {
    const registerPage = fs.readFileSync(path.join(__dirname, "../public/login/register.html"), "utf-8")
      .replace("%MESSAGE%", "<p style='display:block;'>❌ هذا البريد الإلكتروني مسجل بالفعل: <a href='/login'>Login</a></p>");
    return res.send(registerPage);
  }

  const newUser = new User({
    username,
    fatherName,
    email,
    password,
    phone: phone || "",
    role: "user"
  });

  await newUser.save();

  const successPage = fs.readFileSync(path.join(__dirname, "../public/login/register.html"), "utf-8")
  .replace(
    "%MESSAGE%",
    `<div style="text-align: center;">
      <h4>✅ تم التسجيل بنجاح! سيتم تحويلك تلقائيًا لتسجيل الدخول خلال ثوانٍ...</h4>
      <p>أو يمكنك <a href='/login'>الضغط هنا لتسجيل الدخول يدويًا</a>.</p>
      <script>
        setTimeout(function() {
          window.location.href = '/login';
        }, 2000);
      </script>
    </div>`
  );
    res.send(successPage)

});

// بيانات الجلسة الحالية
router.get("/session-user", (req, res) => {
  if (req.session.userData) return res.json(req.session.userData);
  return res.json({});
});


// تخزين صور البروفايل
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads/avatars"),
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    const name = req.session.userData.email.replace(/[@.]/g, "_");
    cb(null, name + "." + ext);
  }
});
const upload = multer({ storage });

// صفحة إعدادات الحساب
router.get("/account-settings", (req, res) => {
  if (!req.session.userData) return res.redirect("/login");
  res.sendFile(path.join(__dirname, "../public/login/account-settings/account-settings.html"));
});

// تعديل الحساب
router.post("/update-account", upload.single("avatar"), async (req, res) => {
  try {
    if (!req.session.userData) {
      console.log("❌ لا يوجد بيانات في السيشن");
      return res.redirect("/login");
    }

    const userId = req.session.userData._id;
    const { username, fatherName, phone } = req.body;

    console.log("🟢 بيانات مرسلة:", req.body);
    console.log("📸 ملف الصورة:", req.file);

    let avatarPath = req.session.userData.avatar;
    if (req.file) {
      avatarPath = "/avatars/" + req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username,
        fatherName,
        phone,
        avatar: avatarPath,
      },
      { new: true }
    );

    if (!updatedUser) {
      console.log("❌ لم يتم العثور على المستخدم");
      return res.status(404).send("User not found");
    }

    // ✅ تحديث الجلسة
    req.session.userData = {
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      fatherName: updatedUser.fatherName,
      phone: updatedUser.phone,
    };

    console.log("✅ تم تحديث المستخدم:", req.session.userData);

    res.redirect("/home");
  } catch (err) {
    console.error("❌ خطأ أثناء تحديث الحساب:", err);
    res.status(500).send("حدث خطأ أثناء تحديث الحساب");
  }
});



module.exports = router;
