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

var cartIcon = document.querySelector("#cart-icon");
var cartIcon2 = document.querySelector("#cart-icon2");
var cart = document.querySelector(".cart2");
var cartClose = document.querySelector("#cart-close2");

cartIcon.addEventListener("click", () => cart.classList.add("active"));
cartIcon2.addEventListener("click", () => cart.classList.add("active"));
cartClose.addEventListener("click", () => cart.classList.remove("active"));

const viewYourCart = document.querySelector(".btn-view-cart");
  viewYourCart?.addEventListener("click", handleViewCart);

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
        
          avatarDisplay.innerHTML = ""; // مهم عشان يمسح أي محتوى سابق
        
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
  
// gift section 
document.addEventListener("DOMContentLoaded", () => {
  fetch("/session-user")
    .then(res => res.json())
    .then(data => {
      if (!data || !data.email) return;

      const userEmail = data.email;
      const giftKey = `lastGiftTime_${userEmail}`;
      const lastGiftTime = parseInt(localStorage.getItem(giftKey)) || 0;
      const now = Date.now();

      const giftBox = document.getElementById("gift-box");
      const openGiftBtn = document.getElementById("open-gift");
      const giftResult = document.getElementById("gift-result");

      // ✅ تحقق قبل إظهار الزر
      if (now - lastGiftTime < 86400000) {
        // لو فاتش 24 ساعة → اخفي الزر
        giftBox.style.display = "none";
        return;
      }

      // ✅ لو مر أكثر من 24 ساعة → أظهر الزر
      giftBox.style.display = "block";

      openGiftBtn.addEventListener("click", () => {
        fetch("/random-gift")
          .then(res => {
            if (res.status === 401) {
              giftResult.textContent = "❌ يجب تسجيل الدخول.";
              return;
            }
            return res.json();
          })
          .then(data => {
            if (!data || !data.gift) return;

            // ✅ عرض الهدية
            giftResult.textContent = `✅ هديتك: ${data.gift.label || data.gift}`;
            openGiftBtn.style.display = "none";
            localStorage.setItem(giftKey, Date.now().toString());
            localStorage.setItem(`dailyGift_${userEmail}`, JSON.stringify(data.gift));

            // ✅ إخفاء الزر بعد الفتح
            setTimeout(() => {
              giftBox.style.display = "none";
            }, 10000)

          })
      });
    });
});
