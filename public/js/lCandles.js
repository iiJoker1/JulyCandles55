// public/js/lCandles.js

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

if (bar) {
  bar.addEventListener("click", () => {
    nav.classList.add("active");
    cartIcon.style.display = "none";
    cartIcon2.style.display = "none";
  });
}

if (close) {
  close.addEventListener("click", () => {
    nav.classList.remove("active");
    cartIcon.style.display = "block";
    cartIcon2.style.display = "block";
  });
}

cartIcon.addEventListener("click", () => cart.classList.add("active"));
cartIcon2.addEventListener("click", () => cart.classList.add("active"));
cartClose.addEventListener("click", () => cart.classList.remove("active"));

let cartItemCount = 0;

const updateCartCount = (change) => {
  const cartItemCountBadge = document.querySelector(".cart-item-count");
  const cartItemCountBadge2 = document.querySelector(".cart-item-count2");
  cartItemCount += change;
  if (cartItemCount > 0) {
    cartItemCountBadge.style.visibility = "visible";
    cartItemCountBadge.textContent = cartItemCount;
    cartItemCountBadge2.style.visibility = "visible";
    cartItemCountBadge2.textContent = cartItemCount;
  } else {
    cartItemCountBadge.style.visibility = "hidden";
    cartItemCountBadge.textContent = "";
    cartItemCountBadge2.style.visibility = "hidden";
    cartItemCountBadge2.textContent = "";
  }
};

const addToCart = (productBox) => {
  const productImgSrc = productBox.querySelector("img").src;
  const productTitle = productBox.querySelector(".product-title").textContent;
  const productSpan = productBox.querySelector(".product-span").textContent;
  const productPrice = productBox.querySelector(".product-price").textContent;

  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const exists = cartItems.some(item => item.title === productTitle);
  if (exists) {
    alert("المنتج موجود بالفعل في السلة.");
    return;
  }

  const newItem = {
    id: Date.now(),
    image: productImgSrc,
    title: productTitle,
    span: productSpan,
    price: productPrice,
    quantity: 1
  };

  cartItems.push(newItem);
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  renderCartItems();
  updateTotalPrice();
};

const renderCartItems = () => {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  cartContent.innerHTML = "";
  cartItemCount = 0;

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
    cartItemCount += item.quantity;

    cartBox.querySelector(".cart-remove").addEventListener("click", () => {
      let currentCart = JSON.parse(localStorage.getItem("cartItems")) || [];
      currentCart = currentCart.filter(p => p.title !== item.title);
      localStorage.setItem("cartItems", JSON.stringify(currentCart));
      renderCartItems();
      updateCartCount(-item.quantity);
      updateTotalPrice();
    });

    cartBox.querySelector(".cart-quantity").addEventListener("click", (event) => {
      const numberElement = cartBox.querySelector(".number");
      let quantity = parseInt(numberElement.textContent);

      if (event.target.classList.contains("increment")) quantity++;
      if (event.target.classList.contains("decrement") && quantity > 1) quantity--;

      numberElement.textContent = quantity;

      const productId = parseInt(cartBox.getAttribute("data-id"));
      const updatedCart = (JSON.parse(localStorage.getItem("cartItems")) || []).map(p => {
        if (p.id === productId) p.quantity = quantity;
        return p;
      });
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      updateTotalPrice();
    });
  });

  updateCartCount(0);
};

const updateTotalPrice = () => {
  const totalPriceElement = document.querySelector(".total-price");
  const cartBoxes = cartContent.querySelectorAll(".cart-box");
  let total = 0;
  cartBoxes.forEach((cartBox) => {
    const price = cartBox.querySelector(".cart-price").textContent.replace("$", "");
    const quantity = cartBox.querySelector(".number").textContent;
    total += parseFloat(price) * parseInt(quantity);
  });
  totalPriceElement.textContent = `$${total.toFixed(2)}`;
};

viewYourCart?.addEventListener("click", () => window.location.href = "cart");

buyNowButton?.addEventListener("click", () => {
  const cartBoxes = cartContent.querySelectorAll(".cart-box");
  if (cartBoxes.length === 0) {
    alert("سلتك فاضية. أضف منتجات أولاً.");
    return;
  }
  const cartData = Array.from(cartBoxes).map(box => ({
    image: box.querySelector(".cart-img").src,
    title: box.querySelector(".cart-product-title").textContent,
    price: box.querySelector(".cart-price").textContent,
    quantity: box.querySelector(".number").textContent
  }));
  localStorage.setItem("checkoutCart", JSON.stringify(cartData));
  localStorage.removeItem("cartItems");
  cartItemCount = 0;
  updateCartCount(0);
  updateTotalPrice();
  window.location.href = "/checkout";
});


function fetchAndRender(category, containerSelector) {
  fetch(`/api/products?category=${category}`)
    .then(r => r.json())
    .then(products => renderProducts(products, containerSelector));
}

function renderProducts(products, selector) {
  const container = document.querySelector(selector);
  if (!container || !products) return;

  container.innerHTML = "";
  products.forEach(product => {
    const div = document.createElement("div");
    div.className = "pro";
    div.innerHTML = `
      <div class="product-box" style="cursor: pointer;">
        <div class="img-box">
          <img src="${product.image}" class="productImg">
        </div>
        <div class="des">
          <span class="product-span">${product.span || ''}</span>
          <h5 class="product-title">${product.name}</h5>
          <h4 class="product-price">$${product.price}</h4>
        </div>
        <button class="add-cart"><i class="fa-solid fa-cart-shopping"></i></button>
      </div>
    `;
    container.appendChild(div);

    // تفاصيل المنتج
    div.querySelector(".product-box").addEventListener("click", (e) => {
      if (!e.target.closest(".add-cart")) {
        window.location.href = `/product/${product._id}`;
      }
    });

    // إضافة للسلة
    div.querySelector(".add-cart").addEventListener("click", () => {
      addToCart(div.querySelector(".product-box"));
    });
  });
}

// عند تحميل الصفحة
window.addEventListener("DOMContentLoaded", () => {
  fetchAndRender("shop", ".pro-container");
});


window.addEventListener("DOMContentLoaded", () => {
  renderCartItems();
  updateTotalPrice();
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

        if (data.role === "admin") {
          const dashboardLink = document.querySelector('.dashboard-btn');
          dashboardLink.style.display = 'block';
        }
      }
    });
});

document.addEventListener("DOMContentLoaded", () => {
  const avatarDisplay = document.getElementById("avatar-display");
  const avatarMenu = document.getElementById("avatar-menu");

  if (avatarDisplay && avatarMenu) {
    avatarDisplay.addEventListener("click", (e) => {
      e.stopPropagation();
      avatarMenu.style.display = avatarMenu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", () => {
      avatarMenu.style.display = "none";
    });
  }
});
