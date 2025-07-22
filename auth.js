const mongoose = require('mongoose');
const User = require('./models/User');

// الاتصال بقاعدة البيانات
mongoose.connect('mongodb+srv://july-candles:173920123123@cluster0.nsfs425.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', async () => {
  try {
    const userId = ('6878761f2b7c8106d4076fad', '687ab3832796910dc4388c44', '6879b3ed72097b0eb4ee3947'); // حط هنا الـ ID اللي طلع
    const user = await User.findById(userId);
    if (!user) {
      console.log("❌ المستخدم غير موجود");
      return;
    }

    user.role = 'admin';
    await user.save();
    console.log(`✅ Done Added Admin Roles To ${user.username} ${user.fatherName}`);

    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
});
