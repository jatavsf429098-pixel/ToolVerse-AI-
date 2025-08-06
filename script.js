
document.addEventListener("DOMContentLoaded", function () {
  const toolList = document.getElementById("tool-list");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");

  let tools = [];

  // Fetch tools from tools.json
  fetch("tools.json")
    .then((response) => response.json())
    .then((data) => {
      tools = data;
      renderCategories(tools);
      renderTools(tools);
    });

  // Render tool cards
  function renderTools(toolsToRender) {
    toolList.innerHTML = "";
    toolsToRender.forEach((tool) => {
      const toolCard = document.createElement("div");
      toolCard.className = "tool-card";
      toolCard.innerHTML = \`
        <h3>\${tool.name}</h3>
        <p>\${tool.description}</p>
        <a href="\${tool.link}" target="_blank">Visit Tool</a>
        <span class="category-tag">\${tool.category}</span>
      \`;
      toolList.appendChild(toolCard);
    });
  }

  // Render category filter options
  function renderCategories(tools) {
    const categories = ["All Categories", ...new Set(tools.map((t) => t.category))];
    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.toLowerCase();
      option.textContent = cat;
      categoryFilter.appendChild(option);
    });
  }

  // Filter tools on search
  searchInput.addEventListener("input", () => {
    filterAndRender();
  });

  // Filter tools on category selection
  categoryFilter.addEventListener("change", () => {
    filterAndRender();
  });

  function filterAndRender() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    const filteredTools = tools.filter((tool) => {
      const matchesCategory =
        selectedCategory === "all categories" || tool.category.toLowerCase() === selectedCategory;
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm) || tool.description.toLowerCase().includes(searchTerm);
      return matchesCategory && matchesSearch;
    });
    renderTools(filteredTools);
  }
});
