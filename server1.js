const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const app = express();
const router = express.Router();
const multer = require("multer");

const mongoose = require("mongoose");

app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: true
}));

mongoose.connect("mongodb+srv://july-candles:173920123123@cluster0.nsfs425.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

const productRoutes = require("./routes/products");
const userRoutes = require("./routes/users");
const discountRoutes = require("./routes/discountCodes");
const giftRoutes = require("./routes/giftMessages");



app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/discount-codes", discountRoutes);
app.use("/api/gift-messages", giftRoutes);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); 
app.use(session({ secret: 'my-secret-key', resave: false, saveUninitialized: true }));





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


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'home.html'));
})



// صفحة تم طلب الطلب
app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'success-canceled', 'success.html'));
})


// صفحة لم يتم طلب الطلب
app.get('/canceled', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'success-canceled', 'cancel.html'));
})


app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// حماية صفحة الطلبات
app.get('/admin/orders', (req, res) => {
  if (!req.session.userData || req.session.userData.role !== "admin") {
    return res.sendFile(path.join(__dirname, 'public', 'login', 'login.html'))
  } else if(req.session.userData || req.session.userData.role == "admin") {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'orders.html'));

  }
});

// لما الزائر يروح لـ /
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'home.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'about.html'));
});

app.get('/blog', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'blog.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'contact.html'));
});

app.get('/privacy-policy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'privacy-policy.html'));
});

app.get('/blog-details', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'blog-details.html'));
});


// shop
app.get('/shop', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'shop', 'shop.html'));
});

app.get('/shop/candles', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'shop', 'candles.html'));
});

app.get('/shop/handmade', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'shop', 'handmade.html'));
});

app.get('/shop/perfumes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'shop', 'perfumes.html'));
});

// cart
app.get('/checkout', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'cart', 'checkout.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'cart', 'view-cart.html'));
});

// whitelist
app.get('/my-whitelist', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'shop', 'whitelist.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/home`);
});


// add-product
// إعداد رفع الصورة
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// صفحة الإضافة
app.get("/admin", (req, res) => {
  if (!req.session.userData || req.session.userData.role !== "admin") {
    return res.sendFile(path.join(__dirname, 'public', 'login', 'login.html'))
  } else if(req.session.userData || req.session.userData.role == "admin") {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'admin.html'));
  }
  // if (req.session.isAdmin) {
  //   res.sendFile(path.join(__dirname, 'public', 'admin', 'add-product.html'));
  // } else {
  //   res.redirect('/admin-login');
  // }
});

app.get('/admin/add-product', (req,res) => {
  if (!req.session.userData || req.session.userData.role !== "admin") {
    return res.sendFile(path.join(__dirname, 'public', 'login', 'login.html'))
  } else if(req.session.userData || req.session.userData.role == "admin") {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'add-product.html'));

  }
})

app.get('/admin/delete-product', (req,res) => {
  if (!req.session.userData || req.session.userData.role !== "admin") {
    return res.sendFile(path.join(__dirname, 'public', 'login', 'login.html'))
  } else if(req.session.userData || req.session.userData.role == "admin") {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'delete-product.html'));

  }
})

// استقبال بيانات المنتج
app.post("/admin/add-product", upload.single("image"), (req, res) => {
  const { name, price, span, category, candleType } = req.body;
  const image = req.file ? "/images/" + req.file.filename : "";

  if (!name || !price || !category) {
    return res.status(400).send("الرجاء ملء الحقول المطلوبة.");
  }

  let filePath = "";
  const product = {
    id: 1,
    name,
    price,
    span: span || "",
    image
  };

  app.use("/json", express.static(path.join(__dirname, "json")));


  // تحديد مسار الملف المناسب
  if (category === "candles") {
    const typeMap = {
      large: "public/json/candles.json",
      small: "public/json/scandles.json",
      jar: "public/json/jarcandles.json",
      sheep: "public/json/sheepcandles.json"
    };
    filePath = typeMap[candleType];
    if (!filePath) return res.status(400).send("يرجى اختيار نوع الشمعة.");
  } else if (category === "perfumes") {
    filePath = "public/json/perfumes.json";
  } else if (category === "handmade") {
    filePath = "public/json/handmade.json";
  }

  // قراءة الملف وتحديث ID تلقائي
  fs.readFile(filePath, "utf-8", (err, data) => {
    let products = [];

    if (!err && data) {
      try {
        products = JSON.parse(data);
      } catch (e) {
        console.error("خطأ في قراءة JSON");
      }
    }

    const maxId = products.reduce((max, p) => Math.max(max, p.id || 0), 0);
    product.id = maxId + 1;

    products.push(product);

    fs.writeFile(filePath, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        console.error("فشل الحفظ", err);
        return res.status(500).send("حدث خطأ في حفظ المنتج.");
      }

      res.send("<h2>✅ تم حفظ المنتج بنجاح!</h2><a href='/add-product'>إضافة منتج آخر</a>");
    });
  });
});

//////////////

// delete prodcut 
app.get("/admin/delete-product", (req, res) => {
  if (!req.session.userData || req.session.userData.role !== "admin") {
    return res.status(403).send("🚫 ممنوع الدخول - صلاحيات غير كافية");
  } else if(req.session.userData || req.session.userData.role == "admin") {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'delete-product.html'));

  }
});


app.post("/admin/delete-product", (req, res) => {
  const { deleteBy, value, category, candleType } = req.body;

  if (!value || !category || !deleteBy) {
    return res.status(400).send("يرجى إدخال جميع الحقول المطلوبة.");
  }

  // تحديد الملف الصحيح
  let filePath = "";
  if (category === "candles") {
    const typeMap = {
      large: "public/json/candles.json",
      small: "public/json/scandles.json",
      jar: "public/json/jarcandles.json",
      sheep: "public/json/sheepcandles.json"
    };
    filePath = typeMap[candleType];
    if (!filePath) return res.status(400).send("يرجى اختيار نوع الشمعة.");
  } else if (category === "perfumes") {
    filePath = "public/json/perfumes.json";
  } else if (category === "handmade") {
    filePath = "public/json/handmade.json";
  }

  // قراءة البيانات وحذف العنصر
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) return res.status(500).send("تعذر قراءة الملف.");

    let products = [];
    try {
      products = JSON.parse(data);
    } catch (e) {
      return res.status(500).send("خطأ في تنسيق البيانات.");
    }

    const filtered = products.filter(p => {
      if (deleteBy === "id") return String(p.id) !== value;
      else return p.name !== value;
    });

    if (filtered.length === products.length) {
      return res.send("<h3>❌ لم يتم العثور على المنتج المطلوب</h3><a href='/delete-product'>رجوع</a>");
    }

    fs.writeFile(filePath, JSON.stringify(filtered, null, 2), err => {
      if (err) return res.status(500).send("خطأ في الحذف.");
      res.send("<h3>✅ تم حذف المنتج بنجاح</h3><a href='/delete-product'>رجوع</a>");
    });
  });
});

///// dashboard

app.get('/api/admin/stats', (req, res) => {
  try {
    // تحميل كل الملفات المطلوبة
    const allProducts = JSON.parse(fs.readFileSync(path.join(__dirname, 'public/json/products.json')));
    const candles1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'public/json/candles.json')));
    const candles2 = JSON.parse(fs.readFileSync(path.join(__dirname, 'public/json/scandles.json')));
    const candles3 = JSON.parse(fs.readFileSync(path.join(__dirname, 'public/json/jarcandles.json')));
    const candles4 = JSON.parse(fs.readFileSync(path.join(__dirname, 'public/json/sheepcandles.json')));
    const perfumes = JSON.parse(fs.readFileSync(path.join(__dirname, 'public/json/perfumes.json')));
    const handmade = JSON.parse(fs.readFileSync(path.join(__dirname, 'public/json/handmade.json')));

    // حساب الأعداد
    const stats = {
      totalProducts: allProducts.length,
      candles: candles1.length + candles2.length + candles3.length + candles4.length,
      perfumes: perfumes.length,
      handmade: handmade.length,
      orders: 0, // هنخليها لاحقًا
      totalSales: 0, // هنسيبها لاحقًا
      activeProducts: allProducts.length
    };

    res.json(stats);
  } catch (err) {
    console.error("Error reading stats files:", err);
    res.status(500).json({ error: "فشل في تحميل الإحصائيات" });
  }
});



// user login

// صفحة تسجيل الدخول
app.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect("/home"); // ✅ بالفعل مسجل دخول
  }
  res.sendFile(path.join(__dirname, "public/login/login.html"));
});

// التحقق من بيانات الدخول
app.post("/login", (req, res) => {

  const { email, password } = req.body;
  
  const users = JSON.parse(fs.readFileSync(
    path.join(__dirname, "public", "json", "login", "user-accounts.json"),
    "utf-8"
  ));
  


  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    // ناجح
    req.session.userData = {
      name: user.name,
      fatherName: user.fatherName || "",
      email: user.email,
      phone: user.phone || "",
      role: user.role || "user",
      avatar: user.avatar || null
    };
    
    req.session.user = user.email; // ✅ خزّنه في session
    res.redirect("/home");
  } else {
    // فشل
    const loginPage = fs.readFileSync("public/login/login.html", "utf-8")
      .replace("%MESSAGE%", "<p style='color:red;display:block;'>❌ البريد الإلكتروني أو كلمة المرور غير صحيحة</p>");
    res.send(loginPage);
  }
});

/////////////////////

// user register 

// صفحة إنشاء الحساب
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public/login/register.html"));
});



app.post("/register", (req, res) => {
  const { name, fatherName, email, password, confirmPassword, phone, agree } = req.body;
  

  if (!name || !fatherName || !email || !password || !confirmPassword || !agree) {
    const registerPage = fs.readFileSync("public/login/register.html", "utf-8")
    .replace("%MESSAGE%", "<p style='color:red;display:block;'>❌ ا❌ جميع الحقول مطلوبة ما عدا رقم الهاتف.</p>");
    return res.send(registerPage);
  }

  if (password !== confirmPassword) {
    const registerPage = fs.readFileSync("public/login/register.html", "utf-8")
    .replace("%MESSAGE%", "<p style='color:red;display:block;'>❌ كلمتا المرور غير متطابقتين.</p>")
    return res.send(registerPage);
  }

  const usersPath = path.join(__dirname, "public", "json", "login", "user-accounts.json");
  let users = [];

  if (fs.existsSync(usersPath)) {
    users = JSON.parse(fs.readFileSync(usersPath, "utf-8"));
  }

  const exists = users.find(u => u.email === email);
  if (exists) {
    const registerPage = fs.readFileSync("public/login/register.html", "utf-8")
  .replace("%MESSAGE%", "<p style='display:block;'>❌ هذا البريد الإلكتروني مسجل بالفعل: <a href='/login'>Login</a></p>.");
  return res.send(registerPage)
  }

  users.push({ name, fatherName, email, password, phone });
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), "utf-8");
  const registerPage = fs.readFileSync("public/login/register.html", "utf-8")
  .replace("%MESSAGE%", "<p style='display:block;'><h2>✅ تم التسجيل بنجاح! يمكنك <a href='/login'>تسجيل الدخول</a>.</h2></p>");
  res.send(registerPage)
});





app.get("/session-user", (req, res) => {
  if (req.session.userData) {
    return res.json(req.session.userData);
  } else {
    return res.json({});
  }
});




// إعداد التخزين للصور
const storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/avatars");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    const name = req.session.userData.email.replace(/[@.]/g, "_");
    cb(null, name + "." + ext);
  }
});
const upload2 = multer({ storage: storage2 });

const usersFilePath = path.join(__dirname, "json", "login", "user-accounts.json");

// صفحة إعدادات الحساب
app.get("/account-settings", (req, res) => {
  if (!req.session.userData) return res.redirect("/login");
  res.sendFile(path.join(__dirname, "public/login/account-settings/account-settings.html"));
});

app.use("/avatars", express.static(path.join(__dirname, "uploads","avatars")));


// تعديل بيانات الحساب
app.post("/update-account", upload2.single("avatar"), (req, res) => {
  if (!req.session.userData) return res.redirect("/login");

  const { name, fatherName, phone } = req.body;
  const avatarFile = req.file;

  const usersPath = path.join(__dirname, "public", "json", "login", "user-accounts.json");
  let users = [];

  if (fs.existsSync(usersPath)) {
    users = JSON.parse(fs.readFileSync(usersPath, "utf-8"));
  }

  // console.log("🧠 جلسة المستخدم:", req.session.userData);

  const userIndex = users.findIndex(u => u.email === req.session.userData.email);
  if (userIndex === -1) {
    console.log("❌ لم يتم العثور على الإيميل:", req.session.userData.email);
    return res.send("❌ لم يتم العثور على الحساب.");
  }

  // تحديث البيانات
  users[userIndex].name = name;
  users[userIndex].fatherName = fatherName;
  users[userIndex].phone = phone || "";

  if (avatarFile) {
    users[userIndex].avatar = "/avatars/" + avatarFile.filename;
  }

  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), "utf-8");

  res.send("<h3>✅ تم حفظ التعديلات بنجاح! <a href='/home'>العودة</a></h3>");
});


app.get('/track-order', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'cart', 'track-order.html'));

})

// gift section 

app.get("/api/random-gift", (req, res) => {
  if (!req.session.userData) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const giftsPath = path.join(__dirname, "public", "json", "daily-gifts.json");
  const gifts = JSON.parse(fs.readFileSync(giftsPath, "utf-8"));
  const random = gifts[Math.floor(Math.random() * gifts.length)];
  res.json({ gift: random });
});


const candles = JSON.parse(
  fs.readFileSync(path.join(__dirname, "public", "json", "candles.json"), "utf-8")
);

const scandles = JSON.parse(
  fs.readFileSync(path.join(__dirname, "public", "json", "scandles.json"), "utf-8")
);

const jarcandles = JSON.parse(
  fs.readFileSync(path.join(__dirname, "public", "json", "jarcandles.json"), "utf-8")
);

const sheepcandles = JSON.parse(
  fs.readFileSync(path.join(__dirname, "public", "json", "sheepcandles.json"), "utf-8")
);

const perfumes = JSON.parse(
  fs.readFileSync(path.join(__dirname, "public", "json", "perfumes.json"), "utf-8")
);

const handmade = JSON.parse(
  fs.readFileSync(path.join(__dirname, "public", "json", "handmade.json"), "utf-8")
);

// دمج الكل في مصفوفة واحدة (أو حسب ما تحتاج)
const productsData = [
  ...candles,
  ...scandles,
  ...jarcandles,
  ...sheepcandles,
  ...perfumes,
  ...handmade
];

app.get('/api/product/:id', (req, res) => {
  const productId = req.params.id;
  const product = productsData.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
});

// آخر حاجة: صفحة التفاصيل
app.get('/product/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'shop', 'product.html'));
});


app.get('/admin/manage-discounts', (req, res) => {
  if (!req.session.userData || req.session.userData.role !== "admin") {
    return res.sendFile(path.join(__dirname, 'public', 'login', 'login.html'))
  } else if(req.session.userData || req.session.userData.role == "admin") {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'manage-discounts.html'))
  }
})

app.get('/admin/manage-daily-gifts', (req, res) => {
  res.redirect('/daily-gifts')
})

app.get('/daily-gifts', (req, res) => {
  if (!req.session.userData || req.session.userData.role !== "admin") {
    return res.sendFile(path.join(__dirname, 'public', 'login', 'login.html'))
  } else if(req.session.userData || req.session.userData.role == "admin") {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'manage-daily-gifts.html'))
  }
})

const adminRoutes = require('./public/routes/admin');
app.use("/api", adminRoutes); // لو ملف الراوتر اسمه admin.js
app.use('/admin', adminRoutes);


// payment

app.get('/vodafone-cash', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'cart', 'payments', 'vodafone-cash.html'))

})


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// إنشاء مجلد للرفع إذا مش موجود
const uploadDir = path.join(__dirname, "uploads", "/vodafone-receipts");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// إعداد multer
const storage3 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});
const upload3 = multer({ storage: storage3 });


// خدمة الملفات الثابتة
app.use(express.static("public")); // لو حاطط vodafone-cash.html في مجلد public

// راوت رفع الإيصال
app.post("/upload-vodafone-receipt", upload.single("receipt"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "لم يتم رفع الملف" });
  }

  // إرسال اسم الصورة كاستجابة
  res.json({ success: true, fileName: req.file.filename });
});
