window.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem("checkoutCart")) || [];
    const cartDiv = document.getElementById("cart-checkout");
    const totalPriceDiv = document.getElementById("total-price");

    let total = 0;
  
    // عرض المنتجات في صفحة الدفع
    cart.forEach(item => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("cart-item");

      itemDiv.innerHTML = `
        <img src="${item.image}" alt="صورة المنتج" />
        <div class="cart-info">
          <h4 class="item-title">${item.title}</h4>
          <p class="cart-details">الكمية: ${item.quantity}</p>
          <p class="cart-details">السعر: ${item.price}</p>
        </div>
      `;
  
      cartDiv.appendChild(itemDiv);
      total += parseFloat(item.price.replace(/[^\d.]/g, "")) * item.quantity;
    });
  
    totalPriceDiv.textContent = `الإجمالي: ${total} جنيه`;
  
    const confirmBtn = document.getElementById("confirm");
    const cancelBtn = document.getElementById("cancel");
    const editBtn = document.getElementById("edit");

    
    document.getElementById("payment-method").addEventListener("change", function () {
      const selected = this.value;
      document.getElementById("vodafone-info").style.display = selected === "vodafone" ? "block" : "none";
    });
  
    // ✅ تخزين الطلب فقط بعد التأكيد
    if (confirmBtn) {
      confirmBtn.addEventListener("click", () => {
        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;
        const address = document.getElementById("address").value;
  
        if (!name || !phone || !address) {
          alert("يرجى ملء جميع البيانات.");
          return;
        }

        // تحقق من صحة رقم الهاتف
    if ((!phone.startsWith("010") && !phone.startsWith("012")) || phone.length !== 11) {
      alert("📞 يرجى كتابة رقم هاتف صحيح يبدأ بـ 010 أو 012 ويتكون من 11 رقم.");
      return;
    }

    
    // const discountedTotal = total - (total * discountValue / 100);

    const paymentMethod = document.getElementById("payment-method").value;
    const paymentPhone = document.getElementById("payment-phone").value;
    const paymentImage = localStorage.getItem("vodafoneReceiptImage"); // قراءة اسم الصورة

    const order = {
      id: Date.now(),
      customer: { name, phone, address },
      items: cart,
      total: total,
      finalTotal: discountType === "percent"
        ? (total - (total * discountValue / 100)).toFixed(2)
        : total,
      discountCode: appliedCode,
      discountType: discountType,
      status: "قيد التنفيذ",
      paymentMethod: paymentMethod,
      paymentPhone: paymentPhone || null,
      paymentImage: paymentImage || null,
      date: new Date().toLocaleString()
    };
    
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    



  
        // مسح السلة بعد التخزين
        localStorage.removeItem("checkoutCart");
        localStorage.removeItem("cartItems");
  
        // alert("✅ تم تأكيد الطلب. سيتم التواصل عبر الواتساب أو عبر مكالمة صوتيه لإتمام عملية الشراء.");
        localStorage.setItem("lastOrder", JSON.stringify(order));
        const method = document.getElementById("payment-method").value;
        if (method === "vodafone") {
          window.location.href = "/vodafone-cash";
        orders.push(order);
        localStorage.setItem("orders", JSON.stringify(orders));
        } else if (method === "cash") {
        orders.push(order);
        localStorage.setItem("orders", JSON.stringify(orders));
          window.location.href = "/success";
        }else {
          alert("يرجى اختيار وسيلة الدفع");
        }
        // window.location.href = "/success"; 
      });
    }
  
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        window.location.href = "/canceled";
      });
    }

    
    if (editBtn) {
      editBtn.addEventListener("click", () => {
        window.location.href = "/cart";
      });
    }


    let discountType = null;
    let discountValue = 0;
    let appliedCode = null;
    let discountCodes = [];
    
    fetch("/discount-codes")
      .then(res => res.json())
      .then(data => {
        discountCodes = data;
      })
      .catch(err => {
        console.error("فشل تحميل أكواد الخصم", err);
      });
    
    document.getElementById("apply-discount").addEventListener("click", () => {
      const input = document.getElementById("discount-code").value.trim().toUpperCase();
      const message = document.getElementById("discount-message");
      const usedCodes = JSON.parse(localStorage.getItem("usedDiscountCodes")) || [];
    
      const code = discountCodes.find(c => c.code.toUpperCase() === input);

    
      if (!code) {
        message.textContent = "❌ الكود غير صالح.";
        message.style.color = "red";
        return;
      }
    
      if (usedCodes.includes(input)) {
        message.textContent = "❌ تم استخدام هذا الكود من قبل.";
        message.style.color = "red";
        return;
      }
    
      discountType = code.type;
      discountValue = code.value;
      appliedCode = input;
      usedCodes.push(input);
      localStorage.setItem("usedDiscountCodes", JSON.stringify(usedCodes));
    
      if (discountType === "percent") {
        message.textContent = `✅ تم تطبيق خصم بنسبة ${discountValue}%`;
      } else if (discountType === "free_shipping") {
        message.textContent = "✅ تم تطبيق كود التوصيل المجاني";
      } else if (discountType === "gift_product") {
        message.textContent = "تم تطبيق كود مرفق هديه";
      }
    
      message.style.color = "green";
      updateTotalWithDiscount();
    });
    
    
    function updateTotalWithDiscount() {
      let final = total;
    
      if (discountType === "percent") {
        final = total - (total * discountValue / 100);
        document.getElementById("total-price").textContent = `الإجمالي بعد الخصم: ${final.toFixed(2)} جنيه`;
      } else if (discountType === "shipping") {
        document.getElementById("total-price").textContent = `الإجمالي: ${final.toFixed(2)} جنيه (يشمل توصيل مجاني 🚚)`;
      } else if (discountType === "gift_product") {
        document.getElementById("total-price").textContent = `الإجمالي: ${final.toFixed(2)} جنيه (مع مرفق هديه)`;
      }
    }
    




  
  });
  