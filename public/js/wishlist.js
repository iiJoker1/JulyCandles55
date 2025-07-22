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



document.addEventListener("DOMContentLoaded", () => {
    fetch("/session-user")
      .then(res => res.json())
      .then(user => {
        if (!user || !user.email) {
          document.getElementById("wishlist-container").innerHTML = `<p style="text-align:center;">يجب <a href="/login">تسجيل الدخول</a> لرؤية المفضلة.</p>`;
          return;
        }
  
        const favorites = JSON.parse(localStorage.getItem(`favorites_${user.email}`)) || [];
  
        const container = document.getElementById("wishlist-container");
        const emptyMsg = document.getElementById("wishlist-empty");
  
        if (favorites.length === 0) {
          emptyMsg.style.display = "block";
          return;
        }
  
        favorites.forEach(product => {
            if (!product || !product.id || !product.name || !product.image) return; // تجاهل العناصر الناقصة

          const card = document.createElement("div");
          card.className = "wishlist-card";
  
          card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <a href="/product/${product.id}" style="text-decoration: none; color: rgb(213, 162, 33);">عرض المنتج</a>
          `;
  
          container.appendChild(card);
        });
      })
      .catch(error => {
        console.error("حدث خطأ:", error);
      });
  });
  