import { getAnimelar, updateAnime } from "./firebase.js";

// Placeholder image for when no poster is provided
const PLACEHOLDER_POSTER = "https://firebasestorage.googleapis.com/v0/b/animeuz-base.appspot.com/o/assets%2Fanimeuz_placeholder.png?alt=media";

// ===== STATE MANAGEMENT =====
const State = {
  currentTab: 'popular',
  previousTab: 'popular',
  currentAnime: null,

  // --- Saved ---
  getSaved() {
    try { return JSON.parse(localStorage.getItem('animeuz_saved') || '[]'); }
    catch { return []; }
  },
  toggleSaved(animeId) {
    const saved = this.getSaved();
    const idx = saved.indexOf(animeId);
    if (idx > -1) saved.splice(idx, 1);
    else saved.push(animeId);
    localStorage.setItem('animeuz_saved', JSON.stringify(saved));
    return saved.includes(animeId);
  },
  isSaved(animeId) {
    return this.getSaved().includes(animeId);
  },
};

// ===== ROUTER =====
let pageContent;
let navBtns;

async function initApp() {
  pageContent = document.getElementById('page-content');
  navBtns = document.querySelectorAll('.nav-btn');

  if (!pageContent) {
    console.error("Xatolik: 'page-content' elementi topilmadi!");
    return;
  }

  window.navigate = async function (tab, animeId = null) {
    try {
      if (tab !== 'detail') {
        State.previousTab = tab;
      }
      State.currentTab = tab;
      State.currentAnime = animeId;

      navBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
      });

      const bottomNav = document.getElementById('bottom-nav');
      if (bottomNav) bottomNav.style.display = animeId ? 'none' : 'flex';

      pageContent.style.animation = 'none';
      pageContent.offsetHeight;
      pageContent.style.animation = 'fadeIn 0.25s ease';

      switch (tab) {
        case 'popular': await renderPopular(); break;
        case 'search': await renderSearch(); break;
        case 'saved': await renderSaved(); break;
        case 'profile': await renderProfile(); break;
        case 'detail': await renderDetail(animeId); break;
      }
    } catch (error) {
      console.error("Navigatsiya xatosi:", error);
      pageContent.innerHTML = `<div class="search-empty"><p>Xatolik yuz berdi. Iltimos saifani yangilang.</p></div>`;
    }
  }

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => window.navigate(btn.dataset.tab));
  });

  // Start the app
  window.navigate('popular');
}

window.goBack = function () {
  window.navigate(State.previousTab);
};

// ===== POPULAR PAGE =====
async function renderPopular() {
  const animelar = await getAnimelar();

  if (animelar.length === 0) {
    pageContent.innerHTML = `
      <div class="search-empty">
        <p>Hali animelar yo'q</p>
      </div>
    `;
    return;
  }

  const featured = animelar[0];

  pageContent.innerHTML = `
    <div class="hero-banner" onclick="navigate('detail', '${featured.id}')">
      <img src="${featured.rasm || PLACEHOLDER_POSTER}" alt="${featured.nomi}" />
      <div class="hero-gradient"></div>
      <div class="hero-info">
        <div class="hero-badge">${featured.qism ? featured.qism + '-qism' : 'Yangi'}</div>
        <div class="hero-title">${featured.nomi}</div>
      </div>
    </div>

    <div class="section-header">
      <div class="section-title">Yangi qo'shilgan</div>
    </div>
    <div class="anime-grid">
      ${animelar.map(a => animeCard(a)).join('')}
    </div>
  `;
}

function animeCard(anime) {
  return `
    <div class="anime-card ${anime.premium ? 'premium-card' : ''}" onclick="navigate('detail', '${anime.id}')">
      <div class="anime-card-poster">
        <img src="${anime.rasm || PLACEHOLDER_POSTER}" alt="${anime.nomi}" loading="lazy" />
        ${anime.premium ? `<div class="premium-badge-top">Premium</div>` : ''}
        ${anime.qism ? `<div class="anime-card-ep-badge">${anime.qism}-qism</div>` : ''}
      </div>
      <div class="anime-card-title">${anime.nomi}</div>
    </div>
  `;
}

// Track views
window.recordView = async function (id, currentViews) {
  await updateAnime(id, { kurishlar: (currentViews || 0) + 1 });
}

// ===== SEARCH PAGE =====
async function renderSearch() {
  const animelar = await getAnimelar();

  pageContent.innerHTML = `
    <div class="search-container">
      <div class="page-title" style="padding:8px 0 16px;">Qidiruv</div>
      <div class="search-bar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" id="search-input" placeholder="Anime nomini kiriting..." autocomplete="off" />
      </div>
      <div class="search-results" id="search-results">
        ${renderResultList(animelar)}
      </div>
    </div>
  `;

  const input = document.getElementById('search-input');
  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    const results = animelar.filter(a => a.nomi.toLowerCase().includes(query));
    document.getElementById('search-results').innerHTML = results.length
      ? renderResultList(results)
      : `<div class="search-empty"><p>Hech narsa topilmadi</p></div>`;
  });
}

function renderResultList(list) {
  return list.map(a => `
    <div class="search-result-item" onclick="navigate('detail', '${a.id}')">
      <div class="search-result-poster">
        <img src="${a.rasm || PLACEHOLDER_POSTER}" alt="${a.nomi}" loading="lazy" />
      </div>
      <div class="search-result-info">
        <div class="search-result-title">${a.nomi} ${a.qism ? `(${a.qism}-qism)` : ''}</div>
      </div>
    </div>
  `).join('');
}

// ===== SAVED PAGE =====
async function renderSaved() {
  const animelar = await getAnimelar();
  const savedIds = State.getSaved();
  const savedAnime = animelar.filter(a => savedIds.includes(a.id));

  pageContent.innerHTML = `
    <div class="saved-container">
      <div class="saved-header">Sevimlilar</div>
      ${savedAnime.length ? `
        <div class="anime-grid">
          ${savedAnime.map(a => animeCard(a)).join('')}
        </div>
      ` : `
        <div class="saved-empty">
          <p>Sevimlilar ro'yxati bo'sh</p>
        </div>
      `}
    </div>
  `;
}

// ===== PROFILE PAGE =====
function renderProfile() {
  pageContent.innerHTML = `
    <div class="profile-container">
      <div class="profile-header-section">
        <div class="profile-avatar">A</div>
        <div class="profile-name">Foydalanuvchi</div>
      </div>
      <div class="profile-menu">
        <button class="profile-menu-item" onclick="navigate('saved')">Sevimlilar</button>
      </div>
    </div>
  `;
}

// ===== DETAIL PAGE =====
async function renderDetail(animeId) {
  const animelar = await getAnimelar();
  const anime = animelar.find(a => a.id === animeId);

  if (!anime) { window.navigate('popular'); return; }

  const isSaved = State.isSaved(anime.id);

  pageContent.innerHTML = `
    <div class="detail-page">
      <button class="detail-back" onclick="window.goBack()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:24px; height:24px;"><polyline points="15 18 9 12 15 6"/></svg>
      </button>

      <div class="detail-poster">
        <img src="${anime.rasm || PLACEHOLDER_POSTER}" alt="${anime.nomi}" />
        <div class="detail-poster-gradient"></div>
        ${anime.premium ? `<div class="premium-detail-badge">PREMIUM</div>` : ''}
      </div>

      <div class="detail-content">
        <div class="detail-title">${anime.nomi} ${anime.qism ? `(${anime.qism}-qism)` : ''}</div>
        <div class="detail-actions">
           <a href="${anime.url}" target="_blank" onclick="recordView('${anime.id}', ${anime.kurishlar || 0})" class="detail-action-btn primary" style="text-decoration:none; display:flex; align-items:center; justify-content:center;">
            <svg viewBox="0 0 24 24" fill="currentColor" style="width:20px; margin-right:8px;"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Ko'rish (Telegram)
          </a>
          <button class="detail-action-btn ${isSaved ? 'saved' : 'secondary'}" onclick="toggleSaveAnime('${anime.id}')" id="save-btn">
            ${isSaved ? 'Saqlangan' : 'Saqlash'}
          </button>
        </div>
        <div class="detail-description">Ushbu anime ${anime.qism ? anime.qism + '-qismi' : ''} Firebase bazasidan yuklandi. Ko'rish tugmasini bosib videoni tomosha qilishingiz mumkin. ${anime.kurishlar ? `<br><small style="color:var(--text-muted)">${anime.kurishlar} marta ko'rilgan</small>` : ''}</div>
      </div>
    </div>
  `;
}

window.toggleSaveAnime = function (animeId) {
  const nowSaved = State.toggleSaved(animeId);
  const btn = document.getElementById('save-btn');
  if (btn) {
    btn.className = `detail-action-btn ${nowSaved ? 'saved' : 'secondary'}`;
    btn.textContent = nowSaved ? 'Saqlangan' : 'Saqlash';
  }
};

// Start the app
initApp();