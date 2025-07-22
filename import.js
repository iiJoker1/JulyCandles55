const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// موديلات Mongoose
const Product = require('./models/Product');
const DiscountCode = require('./models/DiscountCode');
const GiftMessage = require('./models/GiftMessage');
const User = require('./models/User');

// الاتصال بقاعدة البيانات
mongoose.connect('mongodb+srv://july-candles:173920123123@cluster0.nsfs425.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
  importAllData();
}).catch(err => {
  console.error('❌ Connection error:', err);
});

// مسارات الملفات
const basePath = path.join(__dirname, 'public', 'json');

async function importAllData() {
  try {
    // 🕯️ استيراد المنتجات
    const productFiles = ['candles.json', 'handmade.json', 'perfumes.json'];
    for (let file of productFiles) {
      const raw = fs.readFileSync(path.join(basePath, file));
      const data = JSON.parse(raw);
      const category = file.replace('.json', '');
      const products = data.map(p => ({
        ...p,
        category
      }));
      
      await Product.insertMany(products);
      console.log(`📦 Imported ${products.length} from ${file}`);
    }

    // 🎁 استيراد رسائل الهدايا
    const gifts = JSON.parse(fs.readFileSync(path.join(basePath, 'daily-gifts.json')));
    await GiftMessage.insertMany(gifts.map(msg => ({ message: msg })));
    console.log(`🎁 Imported ${gifts.length} gift messages`);

    // 🏷️ استيراد أكواد الخصم
    const discountCodes = JSON.parse(fs.readFileSync(path.join(basePath, 'discount-codes.json')));
    await DiscountCode.insertMany(discountCodes);
    console.log(`🏷️ Imported ${discountCodes.length} discount codes`);

    // 👤 استيراد المستخدمين
    const users = JSON.parse(fs.readFileSync(path.join(basePath, 'login', 'user-accounts.json')));
    await User.insertMany(users);
    console.log(`👤 Imported ${users.length} users`);

    console.log('✅ All data imported successfully.');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Import failed:', err);
    mongoose.disconnect();
  }
}
