const bar = document.getElementById("bar");
const close = document.getElementById("close");
const nav = document.getElementById("navbar");

if (bar) {
    bar.addEventListener("click", () => {
        nav.classList.add("active");
    });
  }
  
  if (close) {
  close.addEventListener("click", () => {
      nav.classList.remove("active");
  });
  }


  window.addEventListener("DOMContentLoaded", () => {
    fetch("/session-user")
      .then(res => res.json())
      .then(data => {
        const loginBtn = document.getElementById("login-btn");
        const avatarContainer = document.getElementById("user-avatar");
        const loginMessage = document.getElementById("login-required-message");
        const cartElements = document.querySelectorAll('#cart-container, .cart-total, .cart-actions');
  
        if (data.username) {
          // تسجيل الدخول ظاهر
          loginBtn.style.display = "none";
          avatarContainer.style.display = "inline-block";
          if (data.avatar) {
            const img = document.createElement("img");
            img.src = data.avatar;
            img.alt = "الصورة الشخصية";
            document.getElementById("avatar-display").appendChild(img);
          } else {
            document.getElementById("avatar-display").textContent = data.username.charAt(0).toUpperCase();
          }
  
          // أظهر السلة
          cartElements.forEach(el => el.style.display = 'block');
          loginMessage.style.display = 'none';
          renderCart();
        } else {
          // لم يسجل الدخول
          loginMessage.style.display = 'flex';
          cartElements.forEach(el => el.style.display = 'none');
        }
  
        if (data.role === "admin") {
          document.querySelector('.dashboard-btn').style.display = 'block';
        }
      });
  });
  
  
  document.addEventListener("DOMContentLoaded", () => {
    const avatarDisplay = document.getElementById("avatar-display");
    const avatarMenu = document.getElementById("avatar-menu");
  
    if (avatarDisplay && avatarMenu) {
      avatarDisplay.addEventListener("click", (e) => {
        e.stopPropagation(); // يمنع إغلاق القائمة مباشرة
        avatarMenu.style.display = avatarMenu.style.display === "block" ? "none" : "block";
      });
  
      // إخفاء القائمة عند الضغط خارجها
      document.addEventListener("click", () => {
        avatarMenu.style.display = "none";
      });
    }
  });



const cartContainer = document.getElementById('cart-container');
const totalPriceElement = document.getElementById('total-price');
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

function renderCart() {
  cartContainer.innerHTML = '';

  if (cartItems.length === 0) {
    cartContainer.innerHTML = "<p style='text-align:center;'>سلة المشتريات فارغة.</p>";
    totalPriceElement.textContent = "$0";
    return;
  }
  let total = 0;

  cartItems.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div class="cart-details">
        <h3>${item.title}</h3>
        <p>السعر: ${item.price}</p>
        <div class="cart-controls">
          <button onclick="updateQuantity(${item.id}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity(${item.id}, 1)">+</button>
          <i class="fas fa-trash delete-item" onclick="deleteItem(${item.id})"></i>
        </div>
      </div>
    `;
    cartContainer.appendChild(cartItem);

    // احسب الإجمالي
    const priceWithoutDollar = parseFloat(item.price.replace('$', ''));
    total += priceWithoutDollar * item.quantity;
  });

  totalPriceElement.textContent = `$${total.toFixed(2)}`;
}

function updateQuantity(id, change) {
  cartItems = cartItems.map(item => {
    if (item.id === id) {
      item.quantity += change;
      if (item.quantity < 1) item.quantity = 1;
    }
    return item;
  });
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  renderCart();
}

function deleteItem(id) {
  cartItems = cartItems.filter(item => item.id !== id);
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  renderCart();
}

document.getElementById('buy-all').addEventListener('click', () => {
  if (cartItems.length === 0) {
    alert("سلتك فاضية. أضف منتجات أولاً.");
    return;
  }

  // نحضر البيانات من cartItems مش من الصفحة
  const cartData = cartItems.map(item => ({
    image: item.image,
    title: item.title,
    price: item.price,
    quantity: item.quantity
  }));

  // نحفظ البيانات لصفحة الدفع
  localStorage.setItem("checkoutCart", JSON.stringify(cartData));
  // localStorage.removeItem("cartItems");

  // نروح لصفحة الدفع
  window.location.href = 'checkout';
});



document.getElementById('clear-cart').addEventListener('click', () => {
  if (cartItems.length === 0) {
    alert("سلتك فاضية. أضف منتجات أولاً.");
    return;
  }
  if (confirm('هل أنت متأكد أنك تريد مسح كل المنتجات؟')) {
    cartItems = [];
    localStorage.removeItem('cartItems');
    renderCart();
  }
});

document.getElementById('go-shop').addEventListener('click', () => {
  window.location.href = 'candles';
});

renderCart();