
document.addEventListener("DOMContentLoaded", () => {
  const toolList = document.getElementById("tool-list");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");

  let tools = [];

  // Fetch tools.json
  fetch("tools.json")
    .then((response) => response.json())
    .then((data) => {
      tools = data;
      populateCategories(data);
      displayTools(data);
    })
    .catch((error) => {
      toolList.innerHTML = "<p>Error loading tools.json</p>";
      console.error("Error loading tools:", error);
    });

  function populateCategories(data) {
    const categories = [...new Set(data.map((tool) => tool.category))];
    categories.sort();
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  }

  function displayTools(toolsToShow) {
    toolList.innerHTML = "";
    if (toolsToShow.length === 0) {
      toolList.innerHTML = "<p>No tools found.</p>";
      return;
    }

    toolsToShow.forEach((tool) => {
      const card = document.createElement("div");
      card.className = "tool-card";

      card.innerHTML = `
        <h3>${tool.name}</h3>
        <p>${tool.description}</p>
        <span class="tag">${tool.category}</span>
        <a href="${tool.url}" target="_blank" class="visit-btn">Visit Tool</a>
      `;
      toolList.appendChild(card);
    });
  }

  function filterTools() {
    const keyword = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filtered = tools.filter((tool) => {
      const matchesKeyword =
        tool.name.toLowerCase().includes(keyword) ||
        tool.description.toLowerCase().includes(keyword);
      const matchesCategory =
        selectedCategory === "all" || tool.category === selectedCategory;
      return matchesKeyword && matchesCategory;
    });

    displayTools(filtered);
  }

  searchInput.addEventListener("input", filterTools);
  categoryFilter.addEventListener("change", filterTools);
});
