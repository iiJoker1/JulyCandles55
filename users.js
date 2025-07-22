const mongoose = require('mongoose');
const User = require('./models/User');

// الاتصال بقاعدة البيانات
mongoose.connect('mongodb+srv://july-candles:173920123123@cluster0.nsfs425.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', async () => {
  console.log("✅ Connected to DB");

  try {
    const users = await User.find({});
    users.forEach(user => {
      console.log(`${user.username} - ${user._id}`);
    });

    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error fetching users:", err.message);
  }
});
