// public/js/admin.js
document.getElementById("add-product-form").addEventListener("submit", async function(e) {
    e.preventDefault();
  
    const name = document.getElementById("product-name").value;
    const price = document.getElementById("product-price").value;
    const image = document.getElementById("product-image").value;
  
    try {
      const response = await fetch('/add-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, price, image })
      });
  
      const data = await response.json();
      alert(data.message);
      this.reset();
    } catch (error) {
      console.error('❌ خطأ:', error);
      alert('حدث خطأ أثناء إضافة المنتج.');
    }
  });
  