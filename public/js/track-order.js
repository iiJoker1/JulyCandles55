function trackOrder() {
    const id = parseInt(document.getElementById("order-id").value);
    const resultDiv = document.getElementById("result");
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    const order = orders.find(o => o.id === id);

    if (!order) {
      resultDiv.innerHTML = "<p>❌ لم يتم العثور على طلب بهذا الرقم.</p>";
      return;
    }

    resultDiv.innerHTML = `
      <p><strong>الاسم:</strong> ${order.customer?.name || "غير معروف"}</p>
      <p><strong>الهاتف:</strong> ${order.customer?.phone || "غير متوفر"}</p>
      <p><strong>العنوان:</strong> ${order.customer?.address || "غير متوفر"}</p>
      <p><strong>تاريخ الطلب:</strong> ${order.date || "غير متوفر"}</p>
      <p><strong>الحالة:</strong> ${order.status || "تحت المراجعة"}</p>
      <h4>المنتجات:</h4>
      ${order.items.map(item => `
        <div style="margin-bottom: 10px;">
          <strong>${item.title}</strong> - ${item.quantity} × ${item.price}
        </div>
      `).join("")}
      <p><strong>الإجمالي:</strong> ${order.total} جنيه</p>
      ${order.discountCode ? `<p><strong>تم استخدام كود الخصم:</strong> ${order.discountCode}</p>` : ""}
      ${order.finalTotal ? `<p><strong>الإجمالي بعد الخصم:</strong> ${order.finalTotal} جنيه</p>` : ""}
    `;
  }