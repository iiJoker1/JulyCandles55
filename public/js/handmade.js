// https://chatgpt.com/c/680bae30-e6e0-8013-886f-1e09562709f5
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

var cartIcon = document.querySelector("#cart-icon");
var cartIcon2 = document.querySelector("#cart-icon2");
var cart = document.querySelector(".cart2");
var cartClose = document.querySelector("#cart-close2");

cartIcon.addEventListener("click", () => cart.classList.add("active"));
cartIcon2.addEventListener("click", () => cart.classList.add("active"));
cartClose.addEventListener("click", () => cart.classList.remove("active"));



let products = null;


fetch('/api/products?category=handmade')
.then(response => response.json())
.then(data => {
    products = data;
    addDataToHTML();
})

function addDataToHTML() {
    let listProductHTML = document.querySelector('.pro-container');
    listProductHTML.innerHTML = '';

    if (products != null) {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('pro');
            newProduct.innerHTML = `
                <div class="product-box">
                    <div class="img-box">
                        <img src="${product.image}" class="productImg">
                    </div>
                    <div class="des">
                        <span class="product-span">${product.category || ''}</span>
                        <h5 class="product-title">${product.name}</h5>
                        <h4 class="product-price">$${product.price}</h4>
                    </div>
                    <button class="add-cart"><i class="fa-solid fa-cart-shopping"></i></button>
                </div>
            `;
            listProductHTML.appendChild(newProduct);
            const box = newProduct.querySelector(".product-box");
    box.addEventListener("click", (event) => {
        if (!event.target.closest('.add-cart')) {
            window.location.href = `/product/${product._id}`;
        }
    });
        });

        

        // إعادة ربط الأحداث بعد توليد العناصر
        const addCartButtons = document.querySelectorAll(".add-cart");
        addCartButtons.forEach(button => {
            button.addEventListener("click", (event) => {
                const productBox = event.target.closest(".product-box");
                addToCart(productBox);
            });
        });
    }
}





const cartContent = document.querySelector(".cart-content");
const addToCart = (productBox) => {
    const productImgSrc = productBox.querySelector("img").src;
    const productTitle = productBox.querySelector(".product-title").textContent;
    const productSpan = productBox.querySelector(".product-span").textContent;
    const productPrice = productBox.querySelector(".product-price").textContent;
  
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  
    // تأكد المنتج مش موجود مسبقًا
    const exists = cartItems.some(item => item.title === productTitle);
    if (exists) {
      alert("المنتج موجود بالفعل في السلة.");
      return;
    }
  
    const newItem = {
        id: Date.now(), // ID فريد
        image: productImgSrc,
        title: productTitle,
        span: productSpan,
        price: productPrice,
        quantity: 1
      };
  
    cartItems.push(newItem);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  
    renderCartItems(); // إعادة بناء السلة
    updateTotalPrice();
  };

  window.addEventListener("DOMContentLoaded", () => {
    renderCartItems(); // عرض العناصر المحفوظة
    updateTotalPrice();
  });

  
  function renderCartItems() {
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
                  <button id="decrement">-</button>
                  <span class="number">${item.quantity}</span>
                  <button id="increment">+</button>
              </div>
          </div>
          <i class="fa-solid fa-trash cart-remove"></i>
        `;
  
      cartContent.appendChild(cartBox);
      cartItemCount += item.quantity;
  
      // حذف منتج
      cartBox.querySelector(".cart-remove").addEventListener("click", () => {
        let currentCart = JSON.parse(localStorage.getItem("cartItems")) || [];
        currentCart = currentCart.filter(p => p.title !== item.title);
        localStorage.setItem("cartItems", JSON.stringify(currentCart));
        renderCartItems();
        updateCartCount(-item.quantity);
        updateTotalPrice();
      });
  
      // تغيير الكمية
      cartBox.querySelector(".cart-quantity").addEventListener("click", (event) => {
        const numberElement = cartBox.querySelector(".number");
        let quantity = parseInt(numberElement.textContent);
  
        if (event.target.id === "increment") quantity++;
        if (event.target.id === "decrement" && quantity > 1) quantity--;
  
        numberElement.textContent = quantity;
  
        // تحديث الكمية في localStorage
        const productId = parseInt(cartBox.getAttribute("data-id"));

let updatedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
updatedCart = updatedCart.map(p => {
  if (p.id === productId) p.quantity = quantity;
  return p;
});

  
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        renderCartItems();
        updateTotalPrice();
      });
    });
  
    updateCartCount(0); // لإعادة عرض العدد
  }
  
  

const updateTotalPrice = () => {
    const totalPriceElement = document.querySelector(".total-price");
    const cartBoxes = cartContent.querySelectorAll(".cart-box");
    let total = 0;
    cartBoxes.forEach((cartBox) => {
        const priceElement = cartBox.querySelector(".cart-price");
        const quantityElement = cartBox.querySelector(".number");
        const price = priceElement.textContent.replace("$", "");
        const quantity = quantityElement.textContent;
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

    window.location.href = "cart";
  }
buyNowButton.addEventListener("click", () => {
  
    const cartBoxes = cartContent.querySelectorAll(".cart-box");
    if (cartBoxes.length === 0) {
      alert("سلتك فاضية. أضف منتجات أولاً.");
      return;
    }
  
    const cartData = [];
    cartBoxes.forEach(cartBox => {
      cartData.push({
        image: cartBox.querySelector(".cart-img").src,
        title: cartBox.querySelector(".cart-product-title").textContent,
        price: cartBox.querySelector(".cart-price").textContent,
        quantity: cartBox.querySelector(".number").textContent
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
  