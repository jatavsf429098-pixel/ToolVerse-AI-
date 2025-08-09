/* script.js
   Loads tools.json, renders UI, supports search, category filter, language toggle,
   top-5 lists (by tags), and prominent links.
   Drop this file into same folder as index.html and tools.json.
*/

/* -------- Configuration & i18n -------- */
const TOOLS_JSON = 'tools.json'; // path to data file

const I18N = {
  en: {
    tagline: 'Discover the best AI tools — video, image, voice, writing and more.',
    all: 'All Categories',
    prominent: 'Special / Prominent Links',
    featured: 'Featured Top Lists',
    top5_video_gen: 'Top 5 Video Generator Websites',
    top5_img2vid: 'Top 5 Image → Video Websites',
    top5_text2voice: 'Top 5 Text → Voice Websites',
    all_resources: 'All AI Tools',
    note: 'Tip: Edit tools.json to add or update tools.',
    visit: 'Visit',
    demo: 'Demo'
  },
  hi: {
    tagline: 'वीडियो, इमेज, वॉइस और राइटिंग के लिए श्रेष्ठ AI टूल खोजें।',
    all: 'सभी श्रेणियाँ',
    prominent: 'प्रमुख लिंक',
    featured: 'फ़ीचर की गई टॉप लिस्ट्स',
    top5_video_gen: 'शीर्ष 5 वीडियो जनरेशन वेबसाइट्स',
    top5_img2vid: 'शीर्ष 5 इमेज → वीडियो वेबसाइट्स',
    top5_text2voice: 'शीर्ष 5 टेक्स्ट → वॉइस वेबसाइट्स',
    all_resources: 'सभी AI टूल',
    note: 'सुझाव: tools.json को संपादित कर टूल जोड़ें या बदलें।',
    visit: 'खोलें',
    demo: 'डेमो'
  }
};

let state = {
  tools: [],
  lang: 'en',
  categories: []
};

/* -------- Helper DOM getters -------- */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* -------- Fetch and initialize -------- */
async function loadToolsJson() {
  try {
    const res = await fetch(TOOLS_JSON, {cache: 'no-store'});
    if (!res.ok) throw new Error(`Failed to fetch ${TOOLS_JSON}: ${res.status}`);
    const data = await res.json();
    state.tools = Array.isArray(data) ? data : [];
    buildCategories();
    applyI18n();
    renderProminent();
    renderTopLists();
    renderToolsGrid();
  } catch (err) {
    console.error(err);
    const grid = $('#toolsGrid');
    if (grid) grid.innerHTML = `<div class="card"><p style="color:#b91c1c">Unable to load tools.json — check console for details.</p></div>`;
  }
}

/* -------- Internationalization (small UI items) -------- */
function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (I18N[state.lang] && I18N[state.lang][key]) {
      el.textContent = I18N[state.lang][key];
    }
  });
}

/* -------- Build category dropdown from JSON -------- */
function buildCategories() {
  const categories = new Set();
  state.tools.forEach(t => { if (t.category) categories.add(t.category); });
  state.categories = Array.from(categories).sort();
  const sel = $('#categorySelect');
  if (!sel) return;
  sel.innerHTML = '';
  const optAll = document.createElement('option');
  optAll.value = 'all';
  optAll.textContent = I18N[state.lang].all;
  sel.appendChild(optAll);
  state.categories.forEach(cat => {
    const o = document.createElement('option');
    o.value = cat;
    o.textContent = cat;
    sel.appendChild(o);
  });
}

/* -------- Render prominent special links (the 3 required) -------- */
function renderProminent() {
  const required = [
    'https://pindown.io/',
    'https://fastdl.app/en',
    'https://vd6s.com/en'
  ];
  const grid = $('#prominentGrid');
  if (!grid) return;
  grid.innerHTML = '';
  required.forEach(url => {
    const tool = state.tools.find(t => t.url && t.url.replace(/\/+$/, '') === url.replace(/\/+$/, ''));
    const card = document.createElement('article');
    card.className = 'prominent-card card';
    const title = document.createElement('h3');
    title.textContent = (tool && tool.name) ? tool.name : url.replace(/^https?:\/\/(www\.)?/, '');
    const desc = document.createElement('p');
    desc.textContent = (tool && tool.description) ? tool.description : '';
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.className = 'btn';
    a.textContent = I18N[state.lang].visit;
    card.appendChild(title); card.appendChild(desc); card.appendChild(a);
    grid.appendChild(card);
  });
}

/* -------- Render top lists: derive by tags or category keywords -------- */
function renderTopLists() {
  const pick = (tagOrCat) => {
    const lower = tagOrCat.toLowerCase();
    // prefer explicit tags, then category match, then substring match
    return state.tools.filter(t =>
      (t.tags && t.tags.map(x=>x.toLowerCase()).includes(lower)) ||
      (t.category && t.category.toLowerCase().includes(lower)) ||
      (t.description && t.description.toLowerCase().includes(lower))
    ).slice(0,5);
  };

  const videoGen = pick('video-gen');
  const img2vid  = pick('img2vid');
  const text2voice = pick('text2voice');

  populateList('#topVideoGen', videoGen);
  populateList('#topImg2Vid', img2vid);
  populateList('#topText2Voice', text2voice);
}

function populateList(sel, items) {
  const ul = document.querySelector(sel);
  if (!ul) return;
  ul.innerHTML = '';
  if (!items.length) {
    ul.innerHTML = `<li class="empty">${I18N[state.lang].note}</li>`;
    return;
  }
  items.forEach(it => {
    const li = document.createElement('li');
    li.className = 'resource-item';
    const left = document.createElement('div');
    left.className = 'ri-left';
    const name = document.createElement('strong');
    name.textContent = it.name;
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = it.description || '';
    left.appendChild(name);
    left.appendChild(meta);

    const right = document.createElement('div');
    const a = document.createElement('a');
    a.className = 'btn';
    a.href = it.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = I18N[state.lang].visit;
    right.appendChild(a);

    li.appendChild(left);
    li.appendChild(right);
    ul.appendChild(li);
  });
}

/* -------- Render the tools grid (cards) -------- */
function renderToolsGrid(filtered = null) {
  const grid = $('#toolsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const list = filtered || state.tools;
  if (!list.length) {
    grid.innerHTML = `<div class="card"><p style="color:#6b7280">${I18N[state.lang].note}</p></div>`;
    return;
  }

  list.forEach(tool => {
    const card = document.createElement('article');
    card.className = 'tool-card card';
    if (tool.background) card.style.background = tool.background;
    card.dataset.category = tool.category || 'Uncategorized';

    const title = document.createElement('h3');
    title.textContent = tool.name;

    const desc = document.createElement('p');
    desc.textContent = tool.description || '';

    const actions = document.createElement('div');
    actions.className = 'card-actions';
    const visit = document.createElement('a');
    visit.className = 'btn';
    visit.href = tool.url;
    visit.target = '_blank';
    visit.rel = 'noopener';
    visit.textContent = I18N[state.lang].visit;

    actions.appendChild(visit);

    if (tool.demo) {
      const demo = document.createElement('a');
      demo.className = 'btn secondary';
      demo.href = tool.demo;
      demo.target = '_blank';
      demo.rel = 'noopener';
      demo.textContent = I18N[state.lang].demo;
      actions.appendChild(demo);
    }

    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(actions);
    grid.appendChild(card);
  });
}

/* -------- Search + category filters -------- */
function applyFilters() {
  const q = ($('#searchInput').value || '').trim().toLowerCase();
  const cat = ($('#categorySelect').value || 'all');

  const filtered = state.tools.filter(t => {
    const text = ((t.name||'') + ' ' + (t.description||'') + ' ' + (t.category||'') + ' ' + (t.tags||[]).join(' ')).toLowerCase();
    const matchQ = q === '' || text.includes(q);
    const matchC = (cat === 'all') || (t.category === cat);
    return matchQ && matchC;
  });

  renderToolsGrid(filtered);
}

/* -------- Wire UI events -------- */
function wireEvents() {
  const si = $('#searchInput');
  const cs = $('#categorySelect');
  const ls = $('#langSelect');

  si.addEventListener('input', () => applyFilters());
  cs.addEventListener('change', () => applyFilters());
  ls.addEventListener('change', (e) => {
    state.lang = e.target.value;
    applyI18n();
    buildCategories();
    renderProminent();
    renderTopLists();
    renderToolsGrid();
  });
}

/* -------- Initialize app -------- */
function init() {
  // Ensure DOM elements exist
  if (!$('#toolsGrid')) {
    // If HTML structure differs, create a container
    const main = document.querySelector('.main-content') || document.body;
    const grid = document.createElement('div');
    grid.id = 'toolsGrid';
    main.appendChild(grid);
  }
  wireEvents();
  loadToolsJson();
}

/* Run */
document.addEventListener('DOMContentLoaded', init);
