// script.js

const toolListContainer = document.getElementById('tool-list');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

let tools = [];

// Fetch tools from JSON
fetch('tools.json')
  .then((response) => response.json())
  .then((data) => {
    tools = data;
    populateCategories(tools);
    renderTools(tools);
  });

// Render tools
function renderTools(toolsToRender) {
  toolListContainer.innerHTML = '';
  toolsToRender.forEach((tool) => {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.innerHTML = `
      <h3>${tool.name}</h3>
      <p>${tool.description}</p>
      <a href="${tool.link}" target="_blank">Visit Tool</a>
    `;
    toolListContainer.appendChild(card);
  });
}

// Populate category dropdown
function populateCategories(tools) {
  const categories = ['All', ...new Set(tools.map(t => t.category))];
  categoryFilter.innerHTML = '';
  categories.forEach((cat) => {
    const option = document.createElement('option');
    option.value = cat.toLowerCase();
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

// Search functionality
searchInput.addEventListener('input', () => {
  const keyword = searchInput.value.toLowerCase();
  const filtered = tools.filter(tool =>
    tool.name.toLowerCase().includes(keyword) ||
    tool.description.toLowerCase().includes(keyword)
  );
  renderTools(filtered);
});

// Filter by category
categoryFilter.addEventListener('change', () => {
  const selected = categoryFilter.value;
  if (selected === 'all') {
    renderTools(tools);
  } else {
    const filtered = tools.filter(tool => tool.category.toLowerCase() === selected);
    renderTools(filtered);
  }
});

// Scroll to Top button
window.onscroll = () => {
  scrollToTopBtn.style.display = document.documentElement.scrollTop > 200 ? 'block' : 'none';
};

scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
