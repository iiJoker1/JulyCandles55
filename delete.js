const mongoose = require('mongoose');
const Product = require('./models/Product'); // تأكد من مسار الموديل الصحيح

// الاتصال بقاعدة البيانات
mongoose.connect('mongodb+srv://july-candles:173920123123@cluster0.nsfs425.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('✅ Connected to MongoDB');

  try {
    const result = await Product.deleteMany({});
    console.log(`🗑️ Deleted ${result.deletedCount} products from the database.`);
  } catch (err) {
    console.error('❌ Error deleting products:', err);
  } finally {
    mongoose.disconnect();
  }

}).catch(err => {
  console.error('❌ Connection error:', err);
});
