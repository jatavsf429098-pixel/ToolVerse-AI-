/* script.js — loads tools.json, renders UI, search, category & language toggle.
   Place script.js in same folder as index.html and tools.json.
*/

/* --------- Configuration & state --------- */
const TOOLS_JSON = 'tools.json'; // relative path to JSON
const state = {
  tools: [],
  lang: 'en',
  categories: new Set()
};

/* Translation strings for small UI text (English + Hindi) */
const I18N = {
  'en': {
    tagline: 'Discover the best AI tools for video, image, audio, and more.',
    popular: 'Prominent AI Sites',
    featured: 'Featured Top Lists',
    top5_video_gen: 'Top 5 Video Generation Websites',
    top5_img2vid: 'Top 5 Image → Video Websites',
    top5_text2voice: 'Top 5 Text → Voice Websites',
    all_resources: 'All Resources',
    note: 'Tip: Use search and categories to find tools fast.',
    all: 'All Categories',
    visit: 'Visit',
    demo: 'Demo'
  },
  'hi': {
    tagline: 'वीडियो, इमेज और ऑडियो के लिए बेस्ट AI टूल खोजें।',
    popular: 'प्रमुख AI साइटें',
    featured: 'शॉर्टलिस्टेड टॉप लिस्ट',
    top5_video_gen: 'शीर्ष 5 वीडियो जनरेशन वेबसाइट्स',
    top5_img2vid: 'शीर्ष 5 इमेज → वीडियो वेबसाइट्स',
    top5_text2voice: 'शीर्ष 5 टेक्स्ट → वॉइस वेबसाइट्स',
    all_resources: 'सभी संसाधन',
    note: 'सुझाव: टूल खोजने के लिए सर्च और कैटेगरी का उपयोग करें।',
    all: 'सभी कैटेगरी',
    visit: 'खोलें',
    demo: 'डेमो'
  }
};

/* --------- Utility DOM selectors --------- */
const dom = {
  prominentGrid: () => document.getElementById('prominentGrid'),
  listVideoGen: () => document.getElementById('list-video-gen'),
  listImg2Vid: () => document.getElementById('list-img2vid'),
  listText2Voice: () => document.getElementById('list-text2voice'),
  toolsGrid: () => document.getElementById('toolsGrid'),
  categorySelect: () => document.getElementById('categorySelect'),
  searchInput: () => document.getElementById('searchInput'),
  langSelect: () => document.getElementById('langSelect')
};

/* --------- Fetch JSON and initialize UI --------- */
async function loadTools() {
  try {
    const res = await fetch(TOOLS_JSON, {cache: "no-store"});
    if (!res.ok) throw new Error('Failed to fetch tools.json: ' + res.status);
    const data = await res.json();
    state.tools = Array.isArray(data) ? data : [];
    buildCategoryList();
    renderAll();
  } catch (err) {
    console.error(err);
    document.getElementById('toolsContainer').innerHTML = `<p style="color:#b91c1c">Failed to load tools.json — check the console.</p>`;
  }
}

/* --------- Build categories from JSON --------- */
function buildCategoryList() {
  state.categories.clear();
  state.tools.forEach(t => {
    if (t.category) state.categories.add(t.category);
  });

  const select = dom.categorySelect();
  // Clear existing options except 'all'
  select.innerHTML = `<option value="all" data-i18n="all">${I18N[state.lang].all}</option>`;
  state.categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
}

/* --------- Render helpers --------- */
function clearChildren(el){ while(el.firstChild) el.removeChild(el.firstChild); }

/* Prominent (the three main links you wanted to show) */
function renderProminent() {
  const grid = dom.prominentGrid();
  clearChildren(grid);
  // Prefer to show these exact ones first (if present)
  const preferred = ['https://pindown.io/','https://fastdl.app/en','https://vd6s.com/en/'];
  preferred.forEach(url => {
    const tool = state.tools.find(t => t.url === url);
    if (tool) {
      grid.appendChild(makeProminentCard(tool));
    } else {
      // If not in JSON, still show link card
      const fallback = { name: url.replace(/^https?:\/\//,''), url, description: '' };
      grid.appendChild(makeProminentCard(fallback));
    }
  });
}

/* Card creation */
function makeProminentCard(tool) {
  const card = document.createElement('article');
  card.className = 'prominent-card';
  const title = document.createElement('h3');
  title.textContent = tool.name || 'External';
  const p = document.createElement('p');
  p.textContent = tool.description || '';
  const actions = document.createElement('div');
  actions.className = 'actions';
  const visit = document.createElement('a');
  visit.className = 'btn';
  visit.target = '_blank';
  visit.rel = 'noopener';
  visit.href = tool.url;
  visit.textContent = I18N[state.lang].visit;
  actions.appendChild(visit);

  card.appendChild(title);
  card.appendChild(p);
  card.appendChild(actions);
  return card;
}

/* Render lists (top 5) by category filter tags in JSON */
function renderTopLists() {
  // Use tags or category values in JSON — this implementation filters by tool.topList tags
  const videoGen = state.tools.filter(t => (t.tags||[]).includes('video-gen') || (t.category||'').toLowerCase().includes('video')).slice(0,5);
  const img2vid = state.tools.filter(t => (t.tags||[]).includes('img2vid') || (t.category||'').toLowerCase().includes('image')).slice(0,5);
  const text2voice = state.tools.filter(t => (t.tags||[]).includes('text2voice') || (t.category||'').toLowerCase().includes('voice')).slice(0,5);

  populateList(dom.listVideoGen(), videoGen);
  populateList(dom.listImg2Vid(), img2vid);
  populateList(dom.listText2Voice(), text2voice);
}

function populateList(containerEl, list) {
  clearChildren(containerEl);
  if (!list.length) {
    containerEl.innerHTML = `<li style="color:${'#6b7280'}">${I18N[state.lang].note}</li>`;
    return;
  }
  list.forEach(item => {
    const li = document.createElement('li');
    const left = document.createElement('div');
    left.className = 'left';
    const name = document.createElement('strong');
    name.textContent = item.name;
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = item.description || '';
    left.appendChild(name);
    left.appendChild(meta);

    const right = document.createElement('div');
    const a = document.createElement('a');
    a.href = item.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.className = 'btn';
    a.textContent = I18N[state.lang].visit;
    right.appendChild(a);

    li.appendChild(left);
    li.appendChild(right);
    containerEl.appendChild(li);
  });
}

/* Render all resources grid */
function renderToolsGrid(filtered = null) {
  const grid = document.getElementById('toolsGrid');
  clearChildren(grid);
  const list = filtered || state.tools;
  if (!list.length) {
    grid.innerHTML = `<p style="color:#6b7280">${I18N[state.lang].note}</p>`;
    return;
  }

  list.forEach(tool => {
    const card = document.createElement('article');
    card.className = 'tool-card';
    card.dataset.category = tool.category || 'Uncategorized';

    const titleWrap = document.createElement('div');
    titleWrap.className = 'title';
    const title = document.createElement('h3');
    title.textContent = tool.name;
    titleWrap.appendChild(title);

    const desc = document.createElement('p');
    desc.textContent = tool.description || '';

    const actions = document.createElement('div');
    actions.className = 'actions';

    const visit = document.createElement('a');
    visit.className = 'btn';
    visit.href = tool.url;
    visit.target = '_blank';
    visit.rel = 'noopener';
    visit.textContent = I18N[state.lang].visit;

    // If the JSON item provides a demo or embed link, show a secondary button
    if (tool.demo) {
      const demo = document.createElement('a');
      demo.className = 'btn secondary';
      demo.href = tool.demo;
      demo.target = '_blank';
      demo.rel = 'noopener';
      demo.textContent = I18N[state.lang].demo;
      actions.appendChild(demo);
    }

    actions.appendChild(visit);

    card.appendChild(titleWrap);
    card.appendChild(desc);
    card.appendChild(actions);

    grid.appendChild(card);
  });
}

/* --------- Search + filter logic --------- */
function applyFilters() {
  const query = dom.searchInput().value.trim().toLowerCase();
  const cat = dom.categorySelect().value;

  const filtered = state.tools.filter(t => {
    const text = ((t.name||'') + ' ' + (t.description||'') + ' ' + (t.category||'') + ' ' + (t.tags||[]).join(' ')).toLowerCase();
    const matchesQuery = query === '' || text.includes(query);
    const matchesCat = cat === 'all' || (t.category || '') === cat;
    return matchesQuery && matchesCat;
  });

  renderToolsGrid(filtered);
}

/* --------- Language switcher (English/Hindi) --------- */
function applyLanguage() {
  const lang = state.lang;
  // small UI strings
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (I18N[lang] && I18N[lang][key]) el.textContent = I18N[lang][key];
  });
  // rebuild category select labels
  buildCategoryList();
  renderAll(); // re-render content so button labels are localized
}

/* --------- Render everything --------- */
function renderAll() {
  renderProminent();
  renderTopLists();
  renderToolsGrid();
}

/* --------- Event wiring --------- */
function wireEvents() {
  dom.searchInput().addEventListener('input', () => applyFilters());
  dom.categorySelect().addEventListener('change', () => applyFilters());
  dom.langSelect().addEventListener('change', (e) => {
    state.lang = e.target.value;
    applyLanguage();
  });
}

/* --------- Initialize app --------- */
function init() {
  // Ensure DOM placeholders exist
  if (!dom.prominentGrid() || !dom.toolsGrid()) {
    // Create missing containers for older templates
    if (!dom.prominentGrid()) document.getElementById('prominentGrid')?.remove();
  }
  wireEvents();
  loadTools();
}

/* Run init after DOM ready */
document.addEventListener('DOMContentLoaded', init);
