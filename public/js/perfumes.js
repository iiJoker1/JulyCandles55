// Elements
const bar = document.getElementById("bar");
const close = document.getElementById("close");
const nav = document.getElementById("navbar");
const cartIcon = document.querySelector("#cart-icon");
const cartIcon2 = document.querySelector("#cart-icon2");
const cart = document.querySelector(".cart2");
const cartClose = document.querySelector("#cart-close2");
const cartContent = document.querySelector(".cart-content");
const buyNowButton = document.querySelector(".btn-buy2");
const viewYourCart = document.querySelector(".btn-view-cart");

let cartItemCount = 0;
let products = [];

// Init
window.addEventListener("DOMContentLoaded", () => {
  setupNavEvents();
  setupCartEvents();
  fetchProducts();
  renderCartItems();
  updateTotalPrice();
});

// Functions
function setupNavEvents() {
  if (bar) bar.addEventListener("click", () => nav.classList.add("active"));
  if (close) close.addEventListener("click", () => nav.classList.remove("active"));
}

function setupCartEvents() {
  cartIcon?.addEventListener("click", () => cart.classList.add("active"));
  cartIcon2?.addEventListener("click", () => cart.classList.add("active"));
  cartClose?.addEventListener("click", () => cart.classList.remove("active"));
  buyNowButton?.addEventListener("click", handleBuyNow);
  viewYourCart?.addEventListener("click", handleViewCart);
}

function fetchProducts() {
  fetch('/api/products?category=perfumes')
    .then(res => res.json())
    .then(data => {
      products = data;
      renderProducts();
    });
}


function renderProducts() {
  const listProductHTML = document.querySelector('.pro-container');
  listProductHTML.innerHTML = '';

  products.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('pro');
    productDiv.innerHTML = `
      <div class="product-box">
        <div class="img-box">
          <img src="${product.image}" class="productImg">
        </div>
        <div class="des">
          <span class="product-span">${product.span}</span>
          <h5 class="product-title">${product.name}</h5>
          <h4 class="product-price">$${product.price}</h4>
        </div>
        <button class="add-cart"><i class="fa-solid fa-cart-shopping"></i></button>
      </div>
    `;

    listProductHTML.appendChild(productDiv);
    const box = productDiv.querySelector(".product-box");
    box.addEventListener("click", (event) => {
        if (!event.target.closest('.add-cart')) {
            window.location.href = `/product/${product._id}`;
        }
    });
  });

  document.querySelectorAll(".add-cart").forEach(button => {
    button.addEventListener("click", event => {
      const productBox = event.target.closest(".product-box");
      addToCart(productBox);
    });

  });
}

function addToCart(productBox) {
  const productTitle = productBox.querySelector(".product-title").textContent;
  const productImgSrc = productBox.querySelector("img").src;
  const productSpan = productBox.querySelector(".product-span").textContent;
  const productPrice = productBox.querySelector(".product-price").textContent;

  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  if (cartItems.some(item => item.title === productTitle)) {
    alert("المنتج موجود بالفعل في السلة.");
    return;
  }

  cartItems.push({
    id: Date.now(),
    image: productImgSrc,
    title: productTitle,
    span: productSpan,
    price: productPrice,
    quantity: 1
  });

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  renderCartItems();
  updateTotalPrice();
}

function renderCartItems() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  cartContent.innerHTML = '';

  cartItems.forEach(item => {
    const cartBox = document.createElement("div");
    cartBox.classList.add("cart-box");
    cartBox.setAttribute("data-id", item.id);

    cartBox.innerHTML = `
      <img src="${item.image}" class="cart-img">
      <div class="cart-detail">
        <h2 class="cart-product-title">${item.title}</h2>
        <span>${item.span}</span>
        <span class="cart-price">${item.price}</span>
        <div class="cart-quantity">
          <button class="decrement">-</button>
          <span class="number">${item.quantity}</span>
          <button class="increment">+</button>
        </div>
      </div>
      <i class="fa-solid fa-trash cart-remove"></i>
    `;

    cartContent.appendChild(cartBox);

    cartBox.querySelector(".cart-remove").addEventListener("click", () => removeFromCart(item.id));
    cartBox.querySelector(".increment").addEventListener("click", () => updateQuantity(item.id, 1));
    cartBox.querySelector(".decrement").addEventListener("click", () => updateQuantity(item.id, -1));
  });

  updateCartCount();
}

function removeFromCart(id) {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  cartItems = cartItems.filter(item => item.id !== id);
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  renderCartItems();
  updateTotalPrice();
}

function updateQuantity(id, change) {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  cartItems = cartItems.map(item => {
    if (item.id === id) {
      item.quantity = Math.max(1, item.quantity + change);
    }
    return item;
  });

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  renderCartItems();
  updateTotalPrice();
}

function updateTotalPrice() {
  const cartBoxes = cartContent.querySelectorAll(".cart-box");
  let total = 0;

  cartBoxes.forEach(cartBox => {
    const price = parseFloat(cartBox.querySelector(".cart-price").textContent.replace("$", ""));
    const quantity = parseInt(cartBox.querySelector(".number").textContent);
    total += price * quantity;
  });

  document.querySelector(".total-price").textContent = `$${total.toFixed(2)}`;
}

function updateCartCount() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const badge1 = document.querySelector(".cart-item-count");
  const badge2 = document.querySelector(".cart-item-count2");

  if (cartItemCount > 0) {
    badge1.style.visibility = "visible";
    badge2.style.visibility = "visible";
    badge1.textContent = badge2.textContent = cartItemCount;
  } else {
    badge1.style.visibility = "hidden";
    badge2.style.visibility = "hidden";
    badge1.textContent = badge2.textContent = '';
  }
}

function handleBuyNow() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  if (cartItems.length === 0) {
    alert("سلتك فاضية. أضف منتجات أولاً.");
    return;
  }

  localStorage.setItem("checkoutCart", JSON.stringify(cartItems));
  localStorage.removeItem("cartItems");

  window.location.href = "/checkout";
}

function handleViewCart() {

  window.location.href = "cart";
}


window.addEventListener("DOMContentLoaded", () => {
  fetch("/session-user")
    .then(res => res.json())
    .then(data => {
      if (data.username) {
        const avatarContainer = document.getElementById("user-avatar");
        const avatarDisplay = document.getElementById("avatar-display");
          const loginBtn = document.getElementById("login-btn");

          loginBtn.style.display = "none";

        avatarContainer.style.display = "inline-block";

        if (data.avatar) {
          const img = document.createElement("img");
          img.src = data.avatar;
          img.alt = "الصورة الشخصية";
          avatarDisplay.appendChild(img);
        } else {
          avatarDisplay.textContent = data.username.charAt(0).toUpperCase();
        }
      }
        if (data.role === "admin") {
          const dashboardLink = document.querySelector('.dashboard-btn');
          dashboardLink.style.display = 'block';
          // document.getElementById("navbar").appendChild(dashboardLink);
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
