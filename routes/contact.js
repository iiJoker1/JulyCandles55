// routes/contact.js
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "يرجى تعبئة جميع الحقول." });
  }

  // إعداد الـ Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "belalghanane@gmail.com", // ✨ بريدك الجيميل
      pass: "rolg zirz harv nibg",    // ✨ كلمة مرور تطبيق الجيميل
    },
  });

  const mailOptions = {
    from: email,
    to: "belalghanane@gmail.com", // ✨ البريد الذي سيستلم الرسائل
    subject: `رسالة جديدة من ${name}`,
    text: `
      الاسم: ${name}
      البريد: ${email}
      الرسالة: ${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "تم إرسال الرسالة بنجاح ✅" });
  } catch (error) {
    console.error("❌ فشل إرسال الرسالة:", error);
    res.status(500).json({ message: "حدث خطأ أثناء الإرسال." });
  }
});

module.exports = router;
