// Load JSON and display tools
document.addEventListener("DOMContentLoaded", () => {
  fetch("tools.json")
    .then((res) => res.json())
    .then((tools) => {
      displayTools(tools);
      populateCategories(tools);
      addSearchAndFilter(tools);
    })
    .catch((err) => console.error("Error loading tools.json:", err));
});

function displayTools(tools) {
  const container = document.getElementById("tool-list");
  container.innerHTML = "";

  tools.forEach((tool) => {
    const card = document.createElement("div");
    card.classList.add("tool-card");

    card.innerHTML = `
      <h3>${tool.name}</h3>
      <p>${tool.description}</p>
      <a href="${tool.link}" target="_blank">🔗 Visit Tool</a>
    `;

    container.appendChild(card);
  });
}

function populateCategories(tools) {
  const categories = new Set(tools.map((tool) => tool.category));
  const filter = document.getElementById("categoryFilter");

  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filter.appendChild(option);
  });
}

function addSearchAndFilter(tools) {
  const searchInput = document.getElementById("searchInput");
  const filter = document.getElementById("categoryFilter");

  const filterTools = () => {
    const query = searchInput.value.toLowerCase();
    const category = filter.value;

    const filtered = tools.filter((tool) => {
      const matchName = tool.name.toLowerCase().includes(query);
      const matchDesc = tool.description.toLowerCase().includes(query);
      const matchCat = category === "all" || tool.category === category;
      return (matchName || matchDesc) && matchCat;
    });

    displayTools(filtered);
  };

  searchInput.addEventListener("input", filterTools);
  filter.addEventListener("change", filterTools);
}
