
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const filterSelect = document.getElementById("categoryFilter");
  const tools = document.querySelectorAll(".tool-card");

  function filterTools() {
    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = filterSelect.value;

    tools.forEach((tool) => {
      const title = tool.querySelector("h3").textContent.toLowerCase();
      const category = tool.dataset.category;

      const matchesSearch = title.includes(searchText);
      const matchesCategory = selectedCategory === "all" || category === selectedCategory;

      tool.style.display = matchesSearch && matchesCategory ? "block" : "none";
    });
  }

  searchInput.addEventListener("input", filterTools);
  filterSelect.addEventListener("change", filterTools);
});
