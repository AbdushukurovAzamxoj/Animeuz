import { getAnimelar, updateAnime } from "./firebase.js";

// Placeholder image for when no poster is provided
const PLACEHOLDER_POSTER = "https://firebasestorage.googleapis.com/v0/b/animeuz-base.appspot.com/o/assets%2Fanimeuz_placeholder.png?alt=media";

// ===== STATE MANAGEMENT =====
const State = {
  currentTab: 'popular',
  previousTab: 'popular',
  currentAnime: null,

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
  console.log("AnimeUZ initApp starting...");
  pageContent = document.getElementById('page-content');
  navBtns = document.querySelectorAll('.nav-btn');

  if (!pageContent) {
    console.warn("Retrying to find page-content in 500ms...");
    setTimeout(initApp, 500);
    return;
  }

  window.navigate = async function (tab, animeId = null) {
    console.log("Navigating to:", tab, animeId);
    try {
      if (tab !== 'detail') {
        State.previousTab = tab;
      }
      State.currentTab = tab;
      State.currentAnime = animeId;

      if (navBtns) {
        navBtns.forEach(btn => {
          btn.classList.toggle('active', btn.dataset.tab === tab);
        });
      }

      const bottomNav = document.getElementById('bottom-nav');
      if (bottomNav) bottomNav.style.display = animeId ? 'none' : 'flex';

      pageContent.style.animation = 'none';
      pageContent.offsetHeight;
      pageContent.style.animation = 'fadeIn 0.25s ease';

      pageContent.innerHTML = `<div class="search-empty"><p>Yuklanmoqda...</p></div>`;

      switch (tab) {
        case 'popular': await renderPopular(); break;
        case 'search': await renderSearch(); break;
        case 'saved': await renderSaved(); break;
        case 'profile': await renderProfile(); break;
        case 'detail': await renderDetail(animeId); break;
      }
    } catch (error) {
      console.error("Navigation error:", error);
      pageContent.innerHTML = `<div class="search-empty"><p style="color:red">Xatolik yuz berdi: ${error.message}</p></div>`;
    }
  }

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => window.navigate(btn.dataset.tab));
  });

  // Initial load
  await window.navigate('popular');
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
        <p>Hozircha animelar yo'q. Bazaga ma'lumot qo'shing.</p>
      </div>
    `;
    return;
  }

  const featured = animelar[0];
  const list = animelar.slice(1);

  pageContent.innerHTML = `
    <div class="featured-card" onclick="navigate('detail', '${featured.id}')">
      <img src="${featured.rasm || PLACEHOLDER_POSTER}" alt="${featured.nomi}" class="featured-img" />
      <div class="featured-overlay">
        <div class="featured-title">${featured.nomi}</div>
        <div class="featured-subtitle">Eng so'nggi qo'shilgan anime</div>
      </div>
    </div>

    <div class="section-container">
      <div class="section-header">
        <h2 class="section-title">Yangi qismlar</h2>
      </div>
      <div class="anime-grid">
        ${animelar.map(anime => animeCard(anime)).join('')}
      </div>
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

window.recordView = async function (id, currentViews) {
  await updateAnime(id, { kurishlar: (currentViews || 0) + 1 });
}

// ===== SEARCH PAGE =====
async function renderSearch() {
  const animelar = await getAnimelar();
  pageContent.innerHTML = `
    <div class="search-container">
      <div class="search-bar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px; color:var(--text-muted);"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" id="search-input" placeholder="Anime qidirish..." oninput="handleSearch(this.value)" />
      </div>
      <div id="search-results" class="anime-grid">
         ${animelar.map(anime => animeCard(anime)).join('')}
      </div>
    </div>
  `;
}

window.handleSearch = async function (query) {
  const animelar = await getAnimelar();
  const results = animelar.filter(a => a.nomi.toLowerCase().includes(query.toLowerCase()));
  const resultsContainer = document.getElementById('search-results');
  if (resultsContainer) {
    resultsContainer.innerHTML = results.length ? results.map(a => animeCard(a)).join('') : '<div class="search-empty"><p>Hech narsa topilmadi</p></div>';
  }
}

// ===== SAVED PAGE =====
async function renderSaved() {
  const savedIds = State.getSaved();
  const animelar = await getAnimelar();
  const savedAnimelar = animelar.filter(a => savedIds.includes(a.id));

  pageContent.innerHTML = `
    <div class="section-container">
      <h2 class="section-title">Saqlanganlar</h2>
      ${savedAnimelar.length ? `
        <div class="anime-grid">
          ${savedAnimelar.map(a => animeCard(a)).join('')}
        </div>
      ` : `<div class="search-empty"><p>Saqlangan animelar yo'q</p></div>`}
    </div>
  `;
}

// ===== PROFILE PAGE =====
async function renderProfile() {
  pageContent.innerHTML = `
    <div class="profile-container">
      <div class="profile-header">
        <div class="profile-avatar">U</div>
        <div class="profile-name">Foydalanuvchi</div>
      </div>
      <div class="profile-menu">
        <div class="profile-menu-item">
           <span>Tungi rejim</span>
           <div style="width:40px; height:20px; background:var(--accent); border-radius:10px;"></div>
        </div>
        <div class="profile-menu-item" onclick="window.location.href='/admin.html'">
           <span>Admin Panel</span>
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>
    </div>
  `;
}

// ===== DETAIL PAGE =====
async function renderDetail(animeId) {
  const animelar = await getAnimelar();
  const anime = animelar.find(a => a.id === animeId);
  if (!anime) return;

  const isSaved = State.isSaved(animeId);

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

window.toggleSaveAnime = function (id) {
  const isSaved = State.toggleSaved(id);
  const btn = document.getElementById('save-btn');
  if (btn) {
    btn.textContent = isSaved ? 'Saqlangan' : 'Saqlash';
    btn.className = `detail-action-btn ${isSaved ? 'saved' : 'secondary'}`;
  }
}

// Safer initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}