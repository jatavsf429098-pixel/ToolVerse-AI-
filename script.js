// script.js

const toolListContainer = document.getElementById('tool-list');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const scrollToTopBtn = document.getElementById('scrollToTopBtn');
const darkModeToggle = document.getElementById('darkModeToggle');
const languageSelector = document.getElementById('languageSelector');
const submitToolForm = document.getElementById('submitToolForm');
const copyToolsBtn = document.getElementById('copyToolsBtn');
const downloadToolsBtn = document.getElementById('downloadToolsBtn');

let tools = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

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
  toolsToRender.forEach((tool, index) => {
    const card = document.createElement('div');
    card.className = 'tool-card';
    const isFavorite = favorites.includes(tool.name);

    card.innerHTML = `
      <div class="tool-header">
        <h3>${tool.name}</h3>
        <span class="fav-btn" data-name="${tool.name}" title="Save Tool">${isFavorite ? '⭐' : '☆'}</span>
      </div>
      <p>${tool.description}</p>
      <a href="${tool.link}" target="_blank">Visit Tool</a>
    `;
    toolListContainer.appendChild(card);
  });

  attachFavoriteListeners();
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
  filterTools();
});

// Filter by category
categoryFilter.addEventListener('change', () => {
  filterTools();
});

function filterTools() {
  const keyword = searchInput.value.toLowerCase();
  const selected = categoryFilter.value;
  const filtered = tools.filter(tool =>
    (tool.name.toLowerCase().includes(keyword) || tool.description.toLowerCase().includes(keyword)) &&
    (selected === 'all' || tool.category.toLowerCase() === selected)
  );
  renderTools(filtered);
}

// Scroll to Top
window.onscroll = () => {
  scrollToTopBtn.style.display = document.documentElement.scrollTop > 200 ? 'block' : 'none';
};

scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Dark Mode
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  darkModeToggle.textContent = isDark ? '☀️ Light' : '🌙 Dark';
  localStorage.setItem('darkMode', isDark);
});

window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    darkModeToggle.textContent = '☀️ Light';
  }
});

// Language Switcher (future expansion)
languageSelector.addEventListener('change', () => {
  const selectedLang = languageSelector.value;
  alert(`Language switched to: ${selectedLang} (Not fully implemented)`);
});

// Favorite Tool Handling
function attachFavoriteListeners() {
  document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      if (favorites.includes(name)) {
        favorites = favorites.filter(n => n !== name);
        btn.textContent = '☆';
      } else {
        favorites.push(name);
        btn.textContent = '⭐';
      }
      localStorage.setItem('favorites', JSON.stringify(favorites));
    });
  });
}

// Submit Tool
submitToolForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newTool = {
    name: document.getElementById('toolName').value,
    description: document.getElementById('toolDesc').value,
    link: document.getElementById('toolLink').value,
    category: document.getElementById('toolCategory').value
  };
  tools.push(newTool);
  populateCategories(tools);
  renderTools(tools);
  submitToolForm.reset();
  alert("Tool submitted successfully!");
});

// Copy/Export Tools
copyToolsBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(JSON.stringify(tools, null, 2)).then(() => {
    alert("Tool list copied to clipboard!");
  });
});

downloadToolsBtn.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(tools, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tools.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});
