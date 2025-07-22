document.addEventListener("DOMContentLoaded", loadDiscountCodes);

function loadDiscountCodes() {
  const codesList = document.getElementById("codes-list");
  const noCodes = document.getElementById("no-codes");
  const message = document.getElementById("message");

  fetch("/discount-codes")
    .then(res => res.json())
    .then(codes => {
      codesList.innerHTML = ""; // مسح القديم

      if (!codes || codes.length === 0) {
        noCodes.style.display = 'block';
        return;
      }

      noCodes.style.display = 'none';

      codes.forEach(codeObj => {
        const card = document.createElement("div");
        card.className = "code-card";
        card.innerHTML = `
          <h3>${codeObj.code}</h3>
          <p>النوع: ${getTypeName(codeObj.type)}</p>
          <p>القيمة: ${codeObj.value ?? "-"}</p>
          <button onclick="deleteCode('${codeObj.code}')">حذف</button>
        `;
        codesList.appendChild(card);
      });
    })
    .catch(err => {
      console.error("فشل في تحميل أكواد الخصم:", err);
      message.style.display = 'block';
      message.innerText = "⚠️ فشل في تحميل الأكواد.";
    });
}

function getTypeName(type) {
  switch (type) {
    case "percent": return "خصم";
    case "shipping": return "توصيل مجاني";
    case "gift_product": return "منتج هدية";
    default: return "غير معروف";
  }
}


function deleteCode(code) {
  if (!confirm(`هل أنت متأكد من حذف الكود: ${code}؟`)) return;

  fetch("/delete-discount", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code })
  })
    .then(res => res.json())
    .then(result => {
      const message = document.getElementById("message");
      message.style.display = 'block';

      if (result.success) {
        message.style.color = 'green';
        message.innerText = result.message;
        loadDiscountCodes();
      } else {
        message.style.color = 'red';
        message.innerText = result.message || "حدث خطأ أثناء الحذف";
      }
    });
}

document.getElementById("add-code-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = document.getElementById('message');
  const form = e.target;

  const code = form.code.value.trim();
  const type = form.type.value;
  const value = form.value.value.trim();

  const res = await fetch("/add-discount", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, type, value })
  });

  const result = await res.json();

  message.style.display = 'block';
  if (result.success) {
    message.style.color = 'green';
    message.innerText = `تم إضافة الكود: ${code}`;
    
    form.reset();
    loadDiscountCodes();
  } else {
    message.style.color = 'red';
    message.innerText = result.message || "فشل في إضافة الكود.";
  }
});

  
  