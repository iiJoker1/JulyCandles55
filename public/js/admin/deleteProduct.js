const categorySelect = document.getElementById("category-select");
    const candleOptions = document.getElementById("candle-options");

    categorySelect.addEventListener("change", () => {
      candleOptions.style.display = categorySelect.value === "candles" ? "block" : "none";
    });