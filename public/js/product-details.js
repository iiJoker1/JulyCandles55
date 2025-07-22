// public/js/product-details.js
const bar = document.getElementById("bar");
const close = document.getElementById("close");
const nav = document.getElementById("navbar");

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

const productId = window.location.pathname.split("/").pop();

fetch(`/api/product/${productId}`)
  .then((res) => res.json())
  .then((product) => {
    if (!product || product.error) {
      document.body.innerHTML = "<h1>Product not found</h1>";
      return;
    }

    let listProductHTML = document.querySelector(".pro-container1");
    listProductHTML.innerHTML = "";

    let newProduct = document.createElement("div");
    newProduct.style.display = "flex";
    newProduct.style.gap = "40px";
    newProduct.style.width = "100%";
    newProduct.style.flexWrap = "wrap";
    newProduct.setAttribute("data-id", product._id);

    newProduct.innerHTML = `
      <div class="product-left">
        <img id="product-img" src="${product.image}" alt="Product Image" />
        <div class="stars">
          <i class="fas fa-star"></i>
          <i class="fas fa-star"></i>
          <i class="fas fa-star"></i>
          <i class="fas fa-star-half-alt"></i>
          <i class="far fa-star"></i>
        </div>
      </div>
      <div class="product-right">
        <h2 class="product-title" id="product-title">${product.name}</h2>
        <span class="product-span">Size: <span class="yellow">${
          product.span || "Normal"
        }</span></span>
        <p class="product-description" id="product-description">Description: <span class="dark">${
          product.description || "no description"
        }</span></p>
        <h3 class="product-price" id="product-price">$${product.price}</h3>
        <div class="cart-quantity">
          <button id="decrement">-</button>
          <span class="number">1</span>
          <button id="increment">+</button>
        </div>
        <button class="add-cart1 btn-buy1">Add To Cart</button>
        <button id="favorite-btn">Add To Favorite ❤️</button>
        <div id="popup"></div>

      </div>
    `;

    const addButton = newProduct.querySelector(".add-cart1");
    addButton.addEventListener("click", () => {
      addToCart();
    });

    newProduct
      .querySelector(".cart-quantity")
      .addEventListener("click", (event) => {
        const numberElement = newProduct.querySelector(".number");
        let quantity = parseInt(numberElement.textContent);

        if (event.target.id === "increment") quantity++;
        if (event.target.id === "decrement" && quantity > 1) quantity--;

        numberElement.textContent = quantity;

        const productId = parseInt(newProduct.getAttribute("data-id"));
        let updatedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
        updatedCart = updatedCart.map((p) => {
          if (p._id === productId) p.quantity = quantity;
          return p;
        });

        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        renderCartItems();
        updateTotalPrice();
      });

    listProductHTML.appendChild(newProduct);

    // بعد ما الصفحة ترسم العناصر

    fetch("/session-user")
      .then((res) => res.json())
      .then((data) => {
        const userEmail = data?.email;
        const favoriteBtn = document.getElementById("favorite-btn");
        const popup = document.getElementById("popup");

        if (!favoriteBtn || !popup) {
          console.warn("العناصر المطلوبة غير موجودة في الصفحة.");
          return;
        }

        if (!userEmail) {
          favoriteBtn.textContent = "سجل الدخول للأضافه الي المفضله";
          favoriteBtn.classList.add("disabled");
          return;
        }

        const currentProduct = {
          id: product._id,
          name: product.name,
          image: product.image,
          description: product.description,
          price: product.price,
        };

        function getFavorites() {
          return (
            JSON.parse(localStorage.getItem(`favorites_${userEmail}`)) || []
          );
        }

        function saveFavorites(favorites) {
          localStorage.setItem(
            `favorites_${userEmail}`,
            JSON.stringify(favorites)
          );
        }

        function isFavorite(productId) {
          const favorites = getFavorites();
          return favorites.some((p) => p._id === productId);
        }

        function updateFavoriteButton() {
          if (isFavorite(currentProduct._id)) {
            favoriteBtn.textContent = "Remove From Favorite ❌";
          } else {
            favoriteBtn.textContent = "Add To Favorite ❤️";
          }
        }

        function showPopup(message) {
          popup.textContent = message;
          popup.classList.add("show");
          setTimeout(() => {
            popup.classList.remove("show");
          }, 2000);
        }

        favoriteBtn.addEventListener("click", () => {
          let favorites = getFavorites();

          if (isFavorite(currentProduct._id)) {
            favorites = favorites.filter((p) => p._id !== currentProduct._id);
            showPopup("تمت الإزالة من المفضلة ❌");
          } else {
            favorites.push(currentProduct);
            showPopup("تمت الإضافة إلى المفضلة ❤️");
          }

          saveFavorites(favorites);
          updateFavoriteButton();
        });

        updateFavoriteButton();
      });
  })
  .catch((err) => {
    document.body.innerHTML = "<h1>Error loading product</h1>";
  });

var cartIcon = document.querySelector("#cart-icon");
var cartIcon2 = document.querySelector("#cart-icon2");
var cart = document.querySelector(".cart2");
var cartClose = document.querySelector("#cart-close2");

cartIcon?.addEventListener("click", () => cart.classList.add("active"));
cartIcon2?.addEventListener("click", () => cart.classList.add("active"));
cartClose?.addEventListener("click", () => cart.classList.remove("active"));

window.addEventListener("DOMContentLoaded", () => {
  fetch("/session-user")
    .then((res) => res.json())
    .then((data) => {
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
        const dashboardLink = document.querySelector(".dashboard-btn");
        dashboardLink.style.display = "block";
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
      avatarMenu.style.display =
        avatarMenu.style.display === "block" ? "none" : "block";
    });

    // إخفاء القائمة عند الضغط خارجها
    document.addEventListener("click", () => {
      avatarMenu.style.display = "none";
    });
  }
});

const cartContent = document.querySelector(".cart-content");
const addToCart = () => {
  const productImgSrc = document.querySelector("#product-img")?.src;
  const productTitle = document.querySelector("#product-title")?.textContent;
  const productSpan = document.querySelector(".product-span")?.textContent;
  const productPrice = document.querySelector("#product-price")?.textContent;
  const productQuantity = document.querySelector(".number")?.textContent || "1";

  if (!productImgSrc || !productTitle || !productPrice) {
    console.error("Missing product info");
    return;
  }

  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  const exists = cartItems.some((item) => item.title === productTitle);
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
    quantity: parseInt(productQuantity),
  };

  cartItems.push(newItem);
  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  renderCartItems();
  updateTotalPrice();
  updateCartCount(0);
};

function renderCartItems() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  cartContent.innerHTML = "";
  cartItemCount = 0;

  cartItems.forEach((item) => {
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
          <button id="decrement">-</button>
          <span class="number">${item.quantity}</span>
          <button id="increment">+</button>
        </div>
      </div>
      <i class="fa-solid fa-trash cart-remove"></i>
    `;

    cartContent.appendChild(cartBox);
    cartItemCount += parseInt(item.quantity);

    cartBox.querySelector(".cart-remove").addEventListener("click", () => {
      let currentCart = JSON.parse(localStorage.getItem("cartItems")) || [];
      currentCart = currentCart.filter((p) => p.title !== item.title);
      localStorage.setItem("cartItems", JSON.stringify(currentCart));
      renderCartItems();
      updateCartCount(-item.quantity);
      updateTotalPrice();
    });

    cartBox
      .querySelector(".cart-quantity")
      .addEventListener("click", (event) => {
        const numberElement = cartBox.querySelector(".number");
        let quantity = parseInt(numberElement.textContent);

        if (event.target.id === "increment") quantity++;
        if (event.target.id === "decrement" && quantity > 1) quantity--;

        numberElement.textContent = quantity;

        const productId = parseInt(cartBox.getAttribute("data-id"));
        let updatedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
        updatedCart = updatedCart.map((p) => {
          if (p._id === productId) p.quantity = quantity;
          return p;
        });

        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        renderCartItems();
        updateTotalPrice();
      });
  });

  updateCartCount(0);
}

const updateTotalPrice = () => {
  const totalPriceElement = document.querySelector(".total-price");
  const cartBoxes = cartContent.querySelectorAll(".cart-box");
  let total = 0;
  cartBoxes.forEach((cartBox) => {
    const priceElement = cartBox.querySelector(".cart-price");
    const quantityElement = cartBox.querySelector(".number");
    const price = parseFloat(priceElement.textContent.replace("$", ""));
    const quantity = parseInt(quantityElement.textContent);
    total += price * quantity;
  });
  totalPriceElement.textContent = `$${total}`;
};

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

const buyNowButton = document.querySelector(".btn-buy2");
const viewYourCart = document.querySelector(".btn-view-cart");
viewYourCart?.addEventListener("click", handleViewCart);

function handleViewCart() {
  window.location.href = "/cart";
}

buyNowButton.addEventListener("click", () => {
  const cartBoxes = cartContent.querySelectorAll(".cart-box");
  if (cartBoxes.length === 0) {
    alert("سلتك فاضية. أضف منتجات أولاً.");
    return;
  }

  const cartData = [];
  cartBoxes.forEach((cartBox) => {
    cartData.push({
      image: cartBox.querySelector(".cart-img").src,
      title: cartBox.querySelector(".cart-product-title").textContent,
      price: cartBox.querySelector(".cart-price").textContent,
      quantity: cartBox.querySelector(".number").textContent,
    });
  });

  // ✅ فقط نحفظ البيانات لصفحة الدفع
  localStorage.setItem("checkoutCart", JSON.stringify(cartData));
  localStorage.removeItem("cartItems");

  // ✅ لا نسجل الطلب هنا إطلاقًا

  // الذهاب لصفحة الدفع
  window.location.href = "/checkout";

  cartItemCount = 0;
  updateCartCount(0);
  updateTotalPrice();
});

fetch("/api/products")
  .then((res) => res.json())
  .then((products) => {
    const suggestionsContainer = document.querySelector(
      ".suggestions-container"
    );

    const currentProductId = productId; // ده المفروض string لو جاى من URL

    products.forEach((product) => {
      if (product._id === currentProductId) return; // تجاهل المنتج الحالي

      const productDiv = document.createElement("div");
      productDiv.classList.add("suggestion-product");

      productDiv.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <span>$${product.price}</span>
        <a href="/product/${product._id}">عرض المنتج</a>
      `;

      suggestionsContainer.appendChild(productDiv);
    });
  })
  .catch((err) => {
    console.error("فشل تحميل المنتجات:", err);
  });

