window.addEventListener("DOMContentLoaded", () => {
    const success = document.getElementById("sc-container");
    const order = JSON.parse(localStorage.getItem("lastOrder"));

    if (!order || !order.items || order.items.length === 0) {
      // لو مفيش طلب فعلي
      window.location.href = "/"; // أو "/" حسب مسار صفحتك الرئيسية
      return;
    }

    const itemsHTML = order.items.map(item => `
      <div class="ordered-item">
        <img src="${item.image}" alt="${item.title}">
        <div class="info">
          <h3>${item.title}</h3>
          <p>الكمية: ${item.quantity}</p>
          <p>السعر: ${item.price}</p>
        </div>
      </div>
    `).join("");

    success.innerHTML = `
    <i class="fa-solid fa-circle-check success-icon"></i>
    <h1>تم تصعيد طلبك بنجاح ✅</h1>
    <p>شكراً لطلبك! سيتم التواصل معك من خلال مكالمه صوتيه او عبر رسالة واتساب لتأكيد الطلب، والتوصيل خلال يومين عمل.</p>

      <h2>تفاصيل الطلب:</h2>
      ${itemsHTML}
      <p class="total">الإجمالي: ${order.finalTotal} جنيه</p>
      <button class="sc-btn">العودة إلى الصفحة الرئيسية</button>
    `;

    document.querySelector('.sc-btn').addEventListener('click', backBtn)

    function backBtn() {
        window.location.href = '/'
        localStorage.removeItem("lastOrder");
    }

  });
  