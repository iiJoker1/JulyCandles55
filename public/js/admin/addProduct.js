// js/admin/addProduct.js
const categorySelect = document.getElementById("category-select");
const candleOptions = document.getElementById("candle-options");
const form = document.querySelector("form");

categorySelect.addEventListener("change", () => {
  if (categorySelect.value === "candles") {
    candleOptions.style.display = "block";
  }
});

