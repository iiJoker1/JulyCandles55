let orders = JSON.parse(localStorage.getItem("orders")) || [];
const ordersList = document.getElementById("orders-list");
let filteredStatus = 'all';

function renderOrders() {
  ordersList.innerHTML = "";
  const summary = document.getElementById("summary");

  if (orders.length === 0) {
    ordersList.innerHTML = "<p class='no-orders'>لا توجد طلبات بعد.</p>";
    summary.textContent = "";
    return;
  }

  let filteredOrders = filteredStatus === 'all' ? orders : orders.filter(order => order.status === filteredStatus);

  let total = 0;
  let count = filteredOrders.length;

  filteredOrders.forEach((order, index) => {
    const customer = order.customer || {};

    if (!order.status) {
      order.status = "تحت المراجعه";
    }


    const div = document.createElement("div");
    div.classList.add("order");
    div.innerHTML = `
  <h3>#${order.id}</h3>
  <p><strong>Name:</strong> ${order.customer.name || "غير متوفر"}</p>
  <p><strong>Phone:</strong> ${order.customer.phone || "غير متوفر"}</p>
  <p><strong>Adress:</strong> ${order.customer.address || "غير متوفر"}</p>
  <p><strong>Order Date:</strong> ${order.date || "غير متوفر"}</p>
  <p><strong>Status:</strong> <span class="order-status status-${order.status.replace(/ /g, '\\ ')}">${order.status}</span></p>

  <h4>Orders:</h4>
  ${order.items.map(item => `
    <div class="item">
      <img src="${item.image}" alt="">
      <div>
        <strong>${item.title}</strong> - ${item.price} × ${item.quantity}
      </div>
    </div>
  `).join("")}

  <p><strong>Sale:</strong> 
    ${
      order.discountCode
        ? order.discountType === "shipping"
          ? `Free Delivery (${order.discountCode}) 🚚`
          : `Sale Code: (${order.discountCode})`
        : "No Code Sale"
    }
  </p>

  <p><strong>Total:</strong> ${order.total || "0"} L.E</p>

  ${
    order.discountCode && order.discountType !== "shipping"
      ? `<p><strong>Total After Sale:</strong> ${order.finalTotal || order.total} L.E</p>`
      : ""
  }

  <p><strong>Payment Method:</strong> ${order.paymentMethod || "غير متوفر"}</p>

        <p><strong>Payment Phone:</strong> ${order.paymentPhone || "غير متوفر"}</p>
        
        

  <div class="buttons">
    <button class="preparing" onclick="markAsPreparing(${index})">جاري التحضير</button>
    <button class="delivered" onclick="markAsDelivered(${index})">تم التسليم ✅</button>
    <button class="cancel" onclick="cancelOrder(${index})">إلغاء الطلب ❌</button>
    <button onclick="printOrder(${index})">طباعة الفاتورة</button>
  </div>
`;


    ordersList.appendChild(div);

    total += parseFloat(order.total || 0);
  });

  summary.textContent = `عدد الطلبات: ${count} | إجمالي الطلبات: ${total.toFixed(2)} L.E`;
}

function markAsPreparing(index) {
  orders[index].status = "جاري التحضير";
  localStorage.setItem("orders", JSON.stringify(orders));
  renderOrders();
}

function markAsDelivered(index) {
  orders[index].status = "تم التسليم";
  localStorage.setItem("orders", JSON.stringify(orders));
  renderOrders();
}

function cancelOrder(index) {
  const confirmed = confirm(`هل أنت متأكد من إلغاء الطلب رقم #${orders[index].id}؟`);
  if (confirmed) {
    orders[index].status = "تم الإلغاء";
    localStorage.setItem("orders", JSON.stringify(orders));
    renderOrders();
  }
}

function printOrder(index) {
  const order = orders[index];
  const printWindow = window.open('', '', 'height=600,width=800');
  printWindow.document.write('<html><head><title>فاتورة الطلب</title></head><body>');
  printWindow.document.write(`<h2>ORder Number: #${order.id}</h2>`);
  printWindow.document.write(`<p><strong>Name:</strong> ${order.customer?.name || ''}</p>`);
  printWindow.document.write(`<p><strong>Phone:</strong> ${order.customer?.phone || ''}</p>`);
  printWindow.document.write(`<p><strong>Adress:</strong> ${order.customer?.address || ''}</p>`);
  printWindow.document.write(`<p><strong>Order Date:</strong> ${order.date}</p>`);
  printWindow.document.write('<h4>Orders:</h4>');
  printWindow.document.write(`${order.items.map(item => `
  <div class="item">
    <img src="${item.image}" alt="">
    <div>
      <strong>${item.title}</strong> - ${item.price} × ${item.quantity}
    </div>
  </div>
`).join("")}
<p><strong>Sale:</strong> 
${
order.discountCode
? order.discountType === "shipping"
  ? `Free Delevry (${order.discountCode}) 🚚`
  : `Sale Code: (${order.discountCode})`
: "No Code Used."
}
</p>
<p><strong>Total:</strong> ${order.total || "0"} L.E</p>
${
order.discountCode && order.discountType !== "shipping"
? `<p><strong>Total After Sale:</strong> ${order.finalTotal || order.total} L.E</p>`
: ""
}`);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();
}

function filterOrders(status) {
  filteredStatus = status;
  renderOrders();
}

document.getElementById("clear-orders").addEventListener("click", () => {
  const confirmDelete = confirm("هل أنت متأكد من مسح جميع الطلبات؟");
  if (confirmDelete) {
    orders = [];
    localStorage.removeItem("orders");
    renderOrders();
  }
});

renderOrders();