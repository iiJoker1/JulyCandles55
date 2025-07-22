const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const fs = require('fs');


const app = express();
app.use(cookieParser());


mongoose.connect("mongodb+srv://july-candles:173920123123@cluster0.nsfs425.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});


app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: true
}));


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/avatars', express.static(path.join(__dirname, 'uploads/avatars')));


app.use((req, res, next) => {
  const lang = req.cookies.language || 'ar'; 
  const langFilePath = path.join(__dirname, 'public', 'langs', `${lang}.json`);
  fs.readFile(langFilePath, 'utf8', (err, data) => {
    if (err) return next();
    try {
      res.locals.translations = JSON.parse(data);
    } catch (e) {
      res.locals.translations = {};
    }
    next();
  });
});


const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const discountRoutes = require('./routes/discounts');
const giftRoutes = require('./routes/gifts');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/upload');
const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shop');
const contact = require('./routes/contact');


app.use(contact);
app.use(productRoutes);
app.use(userRoutes);
app.use(discountRoutes);
app.use(giftRoutes);
app.use(adminRoutes);
app.use(uploadRoutes);
app.use(authRoutes);
app.use(shopRoutes);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});