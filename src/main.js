import { getAnimelar, updateAnime } from "./firebase.js";

// Placeholder image
const PLACEHOLDER_POSTER = "https://firebasestorage.googleapis.com/v0/b/animeuz-base.appspot.com/o/assets%2Fanimeuz_placeholder.png?alt=media";

// ===== DEBUG ON-SCREEN =====
function debugLog(msg, color = "white") {
  console.log("DEBUG:", msg);
  const debugDiv = document.getElementById('debug-console');
  if (debugDiv) {
    debugDiv.innerHTML += `<div style="color:${color}; margin-bottom:5px;">> ${msg}</div>`;
    debugDiv.scrollTop = debugDiv.scrollHeight;
  }
}

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
  debugLog("Sayt ishga tushmoqda...");

  pageContent = document.getElementById('page-content');
  navBtns = document.querySelectorAll('.nav-btn');

  if (!pageContent) {
    debugLog("Xatolik: #page-content topilmadi, 500ms kutamiz...", "yellow");
    setTimeout(initApp, 500);
    return;
  }

  debugLog("Navigatsiya funksiyasi yuklanmoqda...");

  window.navigate = async function (tab, animeId = null) {
    debugLog(`Navigatsiya: ${tab} ${animeId ? animeId : ''}`);
    try {
      if (tab !== 'detail') State.previousTab = tab;
      State.currentTab = tab;
      State.currentAnime = animeId;

      if (navBtns) {
        navBtns.forEach(btn => {
          btn.classList.toggle('active', btn.dataset.tab === tab);
        });
      }

      const bottomNav = document.getElementById('bottom-nav');
      if (bottomNav) bottomNav.style.display = animeId ? 'none' : 'flex';

      pageContent.innerHTML = `<div class="search-empty"><p>Yuklanmoqda...</p></div>`;

      // Hozirgi rendering
      switch (tab) {
        case 'popular': await renderPopular(); break;
        case 'search': await renderSearch(); break;
        case 'saved': await renderSaved(); break;
        case 'profile': await renderProfile(); break;
        case 'detail': await renderDetail(animeId); break;
      }
    } catch (error) {
      debugLog("Navigatsiya xatosi: " + error.message, "red");
      pageContent.innerHTML = `<div class="search-empty"><p style="color:red">Xatolik: ${error.message}</p></div>`;
    }
  }

  if (navBtns) {
    navBtns.forEach(btn => {
      btn.addEventListener('click', () => window.navigate(btn.dataset.tab));
    });
  }

  // Boshlanish
  await window.navigate('popular');
  debugLog("Sayt muvaffaqiyatli yuklandi ✅", "lime");
}

// Global xato ushlagich
window.onerror = function (msg, url, line) {
  debugLog(`KOD XATOSI: ${msg} (${line}-qator)`, "red");
  return false;
};

// INITIALIZE
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// ===== PAGES =====
async function renderPopular() {
  debugLog("Animelar olinmoqda...");

  // Firebase timeout 5 soniya
  const firebasePromise = getAnimelar();
  const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Firebase javob bermadi (Timeout)")), 5000));

  try {
    const animelar = await Promise.race([firebasePromise, timeoutPromise]);
    debugLog(`Topildi: ${animelar.length} ta anime`);

    if (animelar.length === 0) {
      pageContent.innerHTML = `<div class="search-empty"><p>Hozircha animelar yo'q. Admin panelga o'tib qo'shing.</p><button onclick="window.location.href='/admin.html'" style="margin-top:10px; padding:10px; background:var(--accent); border:none; border-radius:8px; color:white; cursor:pointer;">Admin Panelga o'tish</button></div>`;
      return;
    }

    const featured = animelar[0];
    pageContent.innerHTML = `
      <div class="featured-card" onclick="navigate('detail', '${featured.id}')">
        <img src="${featured.rasm || PLACEHOLDER_POSTER}" alt="${featured.nomi}" class="featured-img" />
        <div class="featured-overlay">
          <div class="featured-title">${featured.nomi}</div>
          <div class="featured-subtitle">So'nggi qo'shilgan</div>
        </div>
      </div>
      <div class="section-container">
        <div class="section-header"><h2 class="section-title">Hamma animelar</h2></div>
        <div class="anime-grid">
          ${animelar.map(a => animeCard(a)).join('')}
        </div>
      </div>
    `;
  } catch (error) {
    debugLog("Firebase xatosi: " + error.message, "orange");
    pageContent.innerHTML = `<div class="search-empty"><p style="color:orange">Baza bilan bog'lanishda xato: ${error.message}</p></div>`;
  }
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

window.goBack = function () {
  window.navigate(State.previousTab);
};

// ... Boshqa rendering funksiyalari (Search, Saved, etc.) ...
async function renderSearch() {
  const animelar = await getAnimelar();
  pageContent.innerHTML = `<div class="search-container"><div class="search-bar"><input type="text" id="search-input" placeholder="Qidirish..." oninput="handleSearch(this.value)" /></div><div id="search-results" class="anime-grid">${animelar.map(a => animeCard(a)).join('')}</div></div>`;
}
async function renderSaved() {
  const savedIds = State.getSaved();
  const animelar = await getAnimelar();
  const saved = animelar.filter(a => savedIds.includes(a.id));
  pageContent.innerHTML = `<div class="section-container"><h2 class="section-title">Saqlanganlar</h2><div class="anime-grid">${saved.map(a => animeCard(a)).join('')}</div></div>`;
}
async function renderProfile() {
  pageContent.innerHTML = `<div class="profile-container"><div class="profile-header"><div class="profile-avatar">U</div></div><div class="profile-menu"><div class="profile-menu-item" onclick="window.location.href='/admin.html'"><span>Admin Panel</span></div></div></div>`;
}
async function renderDetail(animeId) {
  const animelar = await getAnimelar();
  const anime = animelar.find(a => a.id === animeId);
  if (!anime) return;
  const isSaved = State.isSaved(animeId);
  pageContent.innerHTML = `<div class="detail-page"><button class="detail-back" onclick="window.goBack()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:24px;"><polyline points="15 18 9 12 15 6"/></svg></button><div class="detail-poster"><img src="${anime.rasm || PLACEHOLDER_POSTER}" /><div class="detail-poster-gradient"></div></div><div class="detail-content"><div class="detail-title">${anime.nomi}</div><div class="detail-actions"><a href="${anime.url}" target="_blank" onclick="recordView('${anime.id}', ${anime.kurishlar || 0})" class="detail-action-btn primary">Ko'rish</a><button class="detail-action-btn ${isSaved ? 'saved' : 'secondary'}" onclick="toggleSaveAnime('${anime.id}')" id="save-btn">${isSaved ? 'Saqlangan' : 'Saqlash'}</button></div></div></div>`;
}
window.handleSearch = async function (query) {
  const animelar = await getAnimelar();
  const results = animelar.filter(a => a.nomi.toLowerCase().includes(query.toLowerCase()));
  const container = document.getElementById('search-results');
  if (container) container.innerHTML = results.map(a => animeCard(a)).join('');
}
window.toggleSaveAnime = function (id) {
  const isSaved = State.toggleSaved(id);
  const btn = document.getElementById('save-btn');
  if (btn) {
    btn.textContent = isSaved ? 'Saqlangan' : 'Saqlash';
    btn.className = `detail-action-btn ${isSaved ? 'saved' : 'secondary'}`;
  }
}