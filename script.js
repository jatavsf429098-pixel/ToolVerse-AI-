// script.js

let tools = [];
const toolList = document.getElementById('tool-list');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');

// Fetch tools from JSON
fetch('tools.json')
  .then(response => response.json())
  .then(data => {
    tools = data;
    populateCategoryFilter(tools);
    displayTools(tools);
  });

// Populate category filter dropdown
function populateCategoryFilter(tools) {
  const categories = [...new Set(tools.map(tool => tool.category))];
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Render tool cards
function displayTools(filteredTools) {
  toolList.innerHTML = '';
  filteredTools.forEach(tool => {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.innerHTML = `
      <img src="${tool.image}" alt="${tool.name}" />
      <h2>${tool.name}</h2>
      <p>${tool.description}</p>
      <span class="category">${tool.category}</span>
      <div class="tags">${tool.tags.map(tag => `<span>#${tag}</span>`).join(' ')}</div>
      <a href="${tool.link}" target="_blank">Visit Tool</a>
    `;
    toolList.appendChild(card);
  });
}

// Filter tools
function filterTools() {
  const searchValue = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;
  const filtered = tools.filter(tool => {
    const matchSearch =
      tool.name.toLowerCase().includes(searchValue) ||
      tool.category.toLowerCase().includes(searchValue) ||
      tool.tags.some(tag => tag.toLowerCase().includes(searchValue));
    const matchCategory =
      selectedCategory === 'all' || tool.category === selectedCategory;
    return matchSearch && matchCategory;
  });
  displayTools(filtered);
}

searchInput.addEventListener('input', filterTools);
categoryFilter.addEventListener('change', filterTools);
