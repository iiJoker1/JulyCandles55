// ✅ عند تحميل الصفحة: جلب بيانات المستخدم وتعبئة الصفحة
window.addEventListener("DOMContentLoaded", () => {
  fetch("/session-user")
    .then(res => res.json())
    .then(data => {
      if (data.username) {
        // عرض بيانات المستخدم
        document.getElementById("display-name").textContent = data.username;
        document.getElementById("display-fatherName").textContent = data.fatherName || "غير متوفر";
        document.getElementById("display-email").textContent = data.email || "غير متوفر";
        document.getElementById("display-phone").textContent = data.phone || "غير متوفر";

        if (data.avatar) {
          document.getElementById("display-avatar").innerHTML = `<img src="${data.avatar}" class="avatar-img" alt="الصورة الشخصية"/>`;
        } else {
          document.getElementById("display-avatar").textContent = "لا توجد صورة";
        }

        // ملأ نموذج التعديل بالبيانات
        document.getElementById("edit-name").value = data.username;
        document.getElementById("edit-fatherName").value = data.fatherName || "";
        document.getElementById("edit-phone").value = data.phone || "";
      }

      // ✅ عرض الصورة أو أول حرف في الزاوية العليا
      const avatarContainer = document.getElementById("user-avatar");
      const avatarDisplay = document.getElementById("avatar-display");
      const loginBtn = document.getElementById("login-btn");

      if (loginBtn && avatarContainer) {
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

      // ✅ إظهار رابط لوحة التحكم إذا المستخدم أدمن
      if (data.role === "admin") {
        const dashboardLink = document.querySelector(".dashboard-btn");
        if (dashboardLink) {
          dashboardLink.style.display = "block";
        }
      }
    });

  // ✅ تفعيل تعديل البيانات
  const editBtn = document.getElementById("edit-btn");
  const editFormContainer = document.getElementById("edit-form-container");
  const userInfo = document.getElementById("user-info");
  const cancelEditBtn = document.getElementById("cancel-edit");

  if (editBtn && editFormContainer && userInfo && cancelEditBtn) {
    editBtn.addEventListener("click", () => {
      userInfo.style.display = "none";
      editBtn.style.display = "none";
      editFormContainer.style.display = "block";
    });

    cancelEditBtn.addEventListener("click", () => {
      editFormContainer.style.display = "none";
      userInfo.style.display = "block";
      editBtn.style.display = "block";
    });
  }

  // ✅ القائمة المنسدلة من الصورة الشخصية
  const avatarDisplay = document.getElementById("avatar-display");
  const avatarMenu = document.getElementById("avatar-menu");

  if (avatarDisplay && avatarMenu) {
    avatarDisplay.addEventListener("click", (e) => {
      e.stopPropagation(); // منع الغلق المباشر
      avatarMenu.style.display = avatarMenu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", () => {
      avatarMenu.style.display = "none";
    });
  }
});
