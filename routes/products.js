// routes/products.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Product = require('../models/Product');

// إعداد رفع الصور
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/images"),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });


// ✅ API: جلب منتج واحد بالـ ID (للـ fetch)
router.get("/api/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("❌ Error fetching product by ID:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ API: جلب المنتجات - إما الكل أو حسب category 
router.get("/api/products", async (req, res) => {
  try {
    const { category } = req.query;

    let query = {};


    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ error: "فشل في تحميل المنتجات" });
  }
});


// ✅ إضافة منتج جديد
router.post("/add-product", upload.single("image"), async (req, res) => {
  try {
    const { name, price, span, category } = req.body;
    const image = req.file ? "/images/" + req.file.filename : "";

    if (!name || !price || !category) {
      return res.status(400).send("يرجى ملء الحقول المطلوبة.");
    }
    

    const newProduct = new Product({
      name,
      price,
      span: span || "",
      image,
      category
    });

    await newProduct.save();
    res.send("✅ تم حفظ المنتج بنجاح!");
  } catch (err) {
    console.error("❌ Error saving product:", err);
    res.status(500).send("حدث خطأ أثناء حفظ المنتج.");
  }
});



// ✅ حذف منتج
router.post("/delete-product", async (req, res) => {
  try {
    const { deleteBy, value, category } = req.body;

    if (!deleteBy || !value || !category) {
      return res.status(400).send("يرجى إدخال جميع الحقول.");
    }

    let query = { category };

    if (deleteBy === "id") {
      query._id = value;
    } else if (deleteBy === "name") {
      query.name = value;
    }

    const result = await Product.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.send("❌ لم يتم العثور على المنتج المطلوب");
    }

    res.send("✅ تم حذف المنتج بنجاح");
  } catch (err) {
    console.error("❌ Error deleting product:", err);
    res.status(500).send("حدث خطأ أثناء الحذف.");
  }
});

module.exports = router;
