async function fetchStats() {
    try {
        fetch("/stats")
        .then((res) => res.json())
        .then((data) => {
          console.log(data); // مثلاً: { orders: 10, total: 123 }
          // هنا كود العرض في الصفحة
  
      document.getElementById('total-products').textContent = data.totalProducts;
      document.getElementById('candles-count').textContent = data.candles;
      document.getElementById('perfumes-count').textContent = data.perfumes;
      document.getElementById('handmade-count').textContent = data.handmade;
      document.getElementById('total-orders').textContent = data.orders;
      document.getElementById('total-sales').textContent = data.totalSales.toFixed(2) + " L.E";
        })

    } catch (err) {
      console.error("خطأ في تحميل الإحصائيات:", err);
    }
  }
  
  fetchStats();
  