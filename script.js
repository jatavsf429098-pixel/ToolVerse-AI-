let tools = [];

async function loadTools() {
  const res = await fetch('tools.json');
  tools = await res.json();
  populateCategories();
  displayTools(tools);
}

function displayTools(data) {
  const container = document.getElementById('toolsContainer');
  container.innerHTML = "";

  data.forEach(tool => {
    const card = document.createElement('div');
    card.className = "tool-card";
    card.innerHTML = `
      <h3>${tool.name}</h3>
      <p>${tool.description}</p>
      <button onclick="window.open('${tool.link}', '_blank')">Visit</button>
    `;
    container.appendChild(card);
  });
}

function populateCategories() {
  const select = document.getElementById('categoryFilter');
  const categories = ["all", ...new Set(tools.map(t => t.category))];
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    select.appendChild(option);
  });
}

document.getElementById('searchBox').addEventListener('input', () => {
  filterTools();
});
document.getElementById('categoryFilter').addEventListener('change', () => {
  filterTools();
});

function filterTools() {
  const search = document.getElementById('searchBox').value.toLowerCase();
  const category = document.getElementById('categoryFilter').value;

  const filtered = tools.filter(tool => {
    const matchSearch = tool.name.toLowerCase().includes(search);
    const matchCategory = category === "all" || tool.category === category;
    return matchSearch && matchCategory;
  });

  displayTools(filtered);
}

loadTools();
