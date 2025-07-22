const mongoose = require('mongoose');
const User = require('./models/User'); // مسار الموديل الصحيح

mongoose.connect('mongodb+srv://july-candles:173920123123@cluster0.nsfs425.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log("✅ متصل بقاعدة البيانات");

  const result = await User.deleteMany({});
  console.log(`🗑️ تم حذف ${result.deletedCount} مستخدم`);

  mongoose.disconnect();
})
.catch(err => {
  console.error("❌ فشل الاتصال بقاعدة البيانات:", err);
});
