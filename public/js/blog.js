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

document.getElementById("contact-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const data = {
    name: form.name.value,
    email: form.email.value,
    message: form.message.value
  };

  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await response.json();

  alert(result.message);
  if (response.ok) form.reset();
});