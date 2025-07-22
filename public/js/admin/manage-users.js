fetch("/api/users")
.then(res => res.json())
.then(users => {
  const tbody = document.querySelector("#users-table tbody");
  users.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user._id}</td>
      <td>${user.username}</td>
      <td>${user.fatherName || "-"}</td>
      <td>${user.email}</td>
      <td>
        <select onchange="changeRole('${user._id}', this.value)">
          <option value="user" ${user.role === "user" ? "selected" : ""}>User</option>
          <option value="admin" ${user.role === "admin" ? "selected" : ""}>Admin</option>
        </select>
      </td>
    `;
    tbody.appendChild(row);
  });
});

function changeRole(userId, newRole) {
fetch(`/api/users/${userId}/role`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ role: newRole })
})
.then(res => res.json())
.then(data => {
  alert(data.message || "تم تحديث الدور.");
});
}