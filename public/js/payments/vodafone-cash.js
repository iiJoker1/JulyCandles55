window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("receiptForm");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
    
      const formData = new FormData(form);
    
      try {
        const response = await fetch("/upload-vodafone-receipt", {
          method: "POST",
          body: formData,
        });
    
        const data = await response.json();
    
        if (response.ok && data.fileName) {
          // حفظ اسم الصورة في localStorage
          localStorage.setItem("vodafoneReceiptImage", `/uploads/vodafone/${data.fileName}`);
    
          // تحويل المستخدم لصفحة النجاح أو المتابعة
          window.location.href = "/success";
        } else {
          alert("حدث خطأ أثناء رفع الإيصال.");
        }
      } catch (err) {
        alert("فشل الاتصال بالسيرفر.");
        console.error(err);
      }
    });
});
