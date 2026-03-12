// ===== ADMIN PANEL =====
import { VideoDB } from './db.js';

const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin123';

// ===== DATA HELPERS =====
function getAnimes() {
  try {
    const data = localStorage.getItem('animeuz_animes');
    if (!data) return []; // Should be initialized by main.js, but defensive here
    return JSON.parse(data);
  } catch { return []; }
}

function saveAnimes(animes) {
  localStorage.setItem('animeuz_animes', JSON.stringify(animes));
}

let ANIME_DATA = getAnimes();


const PLANS = [
  { id: 'monthly', name: "Oylik", price: 15000 },
  { id: 'quarterly', name: "3 Oylik", price: 39000 },
  { id: 'yearly', name: "Yillik", price: 120000 },
];

const app = document.getElementById('admin-app');
let currentPage = 'dashboard';

// ===== STATE HELPERS =====
function getUsers() {
  try { return JSON.parse(localStorage.getItem('animeuz_users') || '[]'); } catch { return []; }
}

function getViews() {
  try { return JSON.parse(localStorage.getItem('animeuz_views') || '{}'); } catch { return {}; }
}

function getSaved() {
  try { return JSON.parse(localStorage.getItem('animeuz_saved') || '[]'); } catch { return []; }
}

function getTotalViews() {
  const views = getViews();
  return Object.values(views).reduce((s, v) => s + v, 0);
}

function getPremiumUsers() {
  return getUsers().filter(u => u.premium && u.premiumExpiry && new Date(u.premiumExpiry) > new Date());
}

function getEstimatedRevenue() {
  const premUsers = getPremiumUsers();
  let total = 0;
  premUsers.forEach(u => {
    const plan = PLANS.find(p => p.id === u.planId);
    if (plan) total += plan.price;
  });
  return total;
}

function formatPrice(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " so'm";
}

// ===== LOGIN =====
function renderLogin() {
  app.innerHTML = `
    <div class="admin-login">
      <div class="admin-login-card">
        <h1>AnimeUZ</h1>
        <p class="subtitle">Admin Panel</p>
        <form id="admin-login-form">
          <input class="admin-input" type="email" id="admin-email" placeholder="Admin emailni kiriting" autocomplete="off" required />
          <input class="admin-input" type="password" id="admin-pass" placeholder="Admin parolini kiriting" autocomplete="off" required />
          <button type="submit" class="admin-login-btn">Kirish</button>
          <p class="admin-error" id="admin-error">Email yoki parol noto'g'ri</p>
        </form>
      </div>
    </div>
  `;

  document.getElementById('admin-login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('admin-email').value;
    const pass = document.getElementById('admin-pass').value;
    if (email === ADMIN_EMAIL && pass === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true');
      renderDashboardLayout();
    } else {
      document.getElementById('admin-error').classList.add('show');
    }
  });
}

// ===== DASHBOARD LAYOUT =====
function renderDashboardLayout() {
  app.innerHTML = `
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <div class="admin-sidebar-logo">
          <h2>AnimeUZ</h2>
          <span>Admin Panel</span>
        </div>
        <nav>
          <button class="admin-nav-item active" data-page="dashboard">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Dashboard
          </button>
          <button class="admin-nav-item" data-page="anime">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
            Anime
          </button>
          <button class="admin-nav-item" data-page="users">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Foydalanuvchilar
          </button>
          <button class="admin-nav-item" data-page="revenue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Daromad
          </button>
        </nav>
        <div class="admin-sidebar-footer">
          <button class="admin-logout-btn" id="admin-logout">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Chiqish
          </button>
        </div>
      </aside>
      <main class="admin-main" id="admin-content"></main>
    </div>
  `;

  // Nav clicks
  document.querySelectorAll('.admin-nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-nav-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPage = btn.dataset.page;
      renderPage();
    });
  });

  // Logout
  document.getElementById('admin-logout').addEventListener('click', () => {
    sessionStorage.removeItem('admin_auth');
    renderLogin();
  });

  renderPage();
}

function renderPage() {
  ANIME_DATA = getAnimes(); // Refresh data
  switch (currentPage) {
    case 'dashboard': renderDashboard(); break;
    case 'anime': renderAnimeTable(); break;
    case 'users': renderUsersTable(); break;
    case 'revenue': renderRevenue(); break;
  }
}

// ===== DASHBOARD =====
function renderDashboard() {
  const content = document.getElementById('admin-content');
  const users = getUsers();
  const premiumUsers = getPremiumUsers();
  const totalViews = getTotalViews();
  const views = getViews();
  const saved = getSaved();
  const revenue = getEstimatedRevenue();

  // Top anime by views
  const animeByViews = ANIME_DATA.map(a => ({
    ...a,
    views: views[a.id] || 0,
    saves: saved.filter(id => id === a.id).length
  })).sort((a, b) => b.views - a.views);

  content.innerHTML = `
    <div class="admin-page-header">
      <div class="admin-page-title">Dashboard</div>
      <div class="admin-page-subtitle">AnimeUZ platformasi statistikasi</div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-card-label">Jami foydalanuvchilar</span>
          <div class="stat-card-icon users">👥</div>
        </div>
        <div class="stat-card-value">${users.length}</div>
        <div class="stat-card-change">Ro'yxatdan o'tgan</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-card-label">Premium a'zolar</span>
          <div class="stat-card-icon premium">⭐</div>
        </div>
        <div class="stat-card-value">${premiumUsers.length}</div>
        <div class="stat-card-change">Faol obuna</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-card-label">Jami ko'rishlar</span>
          <div class="stat-card-icon views">👁️</div>
        </div>
        <div class="stat-card-value">${totalViews}</div>
        <div class="stat-card-change">Barcha animalar bo'yicha</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-card-label">Daromad</span>
          <div class="stat-card-icon revenue">💰</div>
        </div>
        <div class="stat-card-value">${formatPrice(revenue)}</div>
        <div class="stat-card-change">Premium obunalardan</div>
      </div>
    </div>

    <div class="admin-table-container">
      <div class="admin-table-header">
        <span class="admin-table-title">Top anime (ko'rishlar bo'yicha)</span>
        <span class="admin-table-badge">${ANIME_DATA.length} ta anime</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Anime</th>
            <th>Ko'rishlar</th>
            <th>Epizodlar</th>
            <th>Tur</th>
          </tr>
        </thead>
        <tbody>
          ${animeByViews.map((a, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>
                <div class="table-anime-cell">
                  <div class="table-anime-poster"><img src="${a.poster}" alt="" /></div>
                  <span>${a.title}${a.premium ? '<span class="table-premium-badge">Premium</span>' : ''}</span>
                </div>
              </td>
              <td>${a.views}</td>
              <td>${a.episodes}</td>
              <td>${a.premium ? '<span class="table-status-active">Premium</span>' : '<span class="table-status-free">Bepul</span>'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ===== ANIME TABLE =====
function renderAnimeTable() {
  const content = document.getElementById('admin-content');
  const views = getViews();
  const saved = getSaved();

  const animeList = ANIME_DATA.map(a => ({
    ...a,
    views: views[a.id] || 0,
    saveCount: saved.filter(id => id === a.id).length
  }));

  content.innerHTML = `
    <div class="admin-page-header">
      <div class="admin-page-title">Anime boshqaruvi</div>
      <div class="admin-page-subtitle">Barcha animalar va ularning statistikasi</div>
    </div>

    <div class="admin-table-container">
      <div class="admin-table-header">
        <span class="admin-table-title">Animalar ro'yxati</span>
        <button class="admin-add-btn" onclick="renderAddAnimeForm()">+ Yangi anime</button>
        <span class="admin-table-badge">${ANIME_DATA.length} ta</span>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Anime</th>
            <th>Original nomi</th>
            <th>Ko'rishlar</th>
            <th>Saqlanganlar</th>
            <th>Epizodlar</th>
            <th>Tur</th>
            <th>Amallar</th>
          </tr>
        </thead>
        <tbody>
          ${animeList.map(a => `
            <tr>
              <td>${a.id}</td>
              <td>
                <div class="table-anime-cell">
                  <div class="table-anime-poster"><img src="${a.poster}" alt="" /></div>
                  <span>${a.title}</span>
                </div>
              </td>
              <td style="color: var(--text-muted)">${a.titleOriginal}</td>
              <td>${a.views}</td>
              <td>${a.saveCount}</td>
              <td>${a.episodes.length || a.episodes}</td>
              <td>${a.premium ? '<span class="table-status-active">Premium</span>' : '<span class="table-status-free">Bepul</span>'}</td>
              <td>
                <div class="table-actions">
                  <button class="action-btn-sm toggle ${a.premium ? 'premium' : ''}" onclick="togglePremium(${a.id})" title="Premium holatini o'zgartirish">
                    ${a.premium ? '⭐' : '☆'}
                  </button>
                  <button class="action-btn-sm delete" onclick="deleteAnime(${a.id})" title="O'chirish">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          `).join('')}

        </tbody>
      </table>
    </div>
  `;
}

// ===== USERS TABLE =====
function renderUsersTable() {
  const content = document.getElementById('admin-content');
  const users = getUsers();

  content.innerHTML = `
    <div class="admin-page-header">
      <div class="admin-page-title">Foydalanuvchilar</div>
      <div class="admin-page-subtitle">Ro'yxatdan o'tgan foydalanuvchilar</div>
    </div>

    <div class="admin-table-container">
      <div class="admin-table-header">
        <span class="admin-table-title">Foydalanuvchilar ro'yxati</span>
        <span class="admin-table-badge">${users.length} ta</span>
      </div>
      ${users.length ? `
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Ism</th>
              <th>Email</th>
              <th>Premium</th>
              <th>Tarif</th>
              <th>Ro'yxatdan o'tgan</th>
            </tr>
          </thead>
          <tbody>
            ${users.map((u, i) => {
    const isPrem = u.premium && u.premiumExpiry && new Date(u.premiumExpiry) > new Date();
    const joinDate = u.joinedAt ? new Date(u.joinedAt).toLocaleDateString('uz') : '—';
    return `
                <tr>
                  <td>${i + 1}</td>
                  <td>${u.name}</td>
                  <td style="color: var(--text-muted)">${u.email}</td>
                  <td>${isPrem ? '<span class="table-status-active">⭐ Ha</span>' : '<span class="table-status-free">Yo\'q</span>'}</td>
                  <td>${isPrem && u.planName ? u.planName : '—'}</td>
                  <td style="color: var(--text-muted)">${joinDate}</td>
                </tr>
              `;
  }).join('')}
          </tbody>
        </table>
      ` : `
        <div style="padding:40px;text-align:center;color:var(--text-muted);">
          <p>Hali foydalanuvchilar yo'q</p>
        </div>
      `}
    </div>
  `;
}

// ===== REVENUE =====
function renderRevenue() {
  const content = document.getElementById('admin-content');
  const premUsers = getPremiumUsers();
  const revenue = getEstimatedRevenue();

  const planBreakdown = PLANS.map(plan => {
    const count = premUsers.filter(u => u.planId === plan.id).length;
    return { ...plan, count, total: count * plan.price };
  });

  content.innerHTML = `
    <div class="admin-page-header">
      <div class="admin-page-title">Daromad</div>
      <div class="admin-page-subtitle">Premium obunalar daromadi</div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-card-label">Jami daromad</span>
          <div class="stat-card-icon revenue">💰</div>
        </div>
        <div class="stat-card-value">${formatPrice(revenue)}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-card-label">Premium a'zolar</span>
          <div class="stat-card-icon premium">⭐</div>
        </div>
        <div class="stat-card-value">${premUsers.length}</div>
      </div>
    </div>

    <div class="admin-table-container">
      <div class="admin-table-header">
        <span class="admin-table-title">Tarif rejalari bo'yicha</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Tarif</th>
            <th>Narxi</th>
            <th>Obunchilar</th>
            <th>Jami daromad</th>
          </tr>
        </thead>
        <tbody>
          ${planBreakdown.map(p => `
            <tr>
              <td><strong>${p.name}</strong></td>
              <td>${formatPrice(p.price)}</td>
              <td>${p.count}</td>
              <td class="revenue-card-value gold">${formatPrice(p.total)}</td>
            </tr>
          `).join('')}
          <tr>
            <td colspan="3"><strong>Jami</strong></td>
            <td class="revenue-card-value gold"><strong>${formatPrice(revenue)}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

// ===== ANIME ACTIONS =====
window.togglePremium = function (id) {
  const animes = getAnimes();
  const idx = animes.findIndex(a => a.id === id);
  if (idx > -1) {
    animes[idx].premium = !animes[idx].premium;
    saveAnimes(animes);
    renderPage();
  }
};

window.deleteAnime = function (id) {
  if (!confirm('Haqiqatan ham bu animeni o\'chirmoqchimisiz?')) return;
  const animes = getAnimes();
  const filtered = animes.filter(a => a.id !== id);
  saveAnimes(filtered);

  // Delete associated videos and posters from IndexedDB
  VideoDB.deleteAnimeVideos(id).catch(err => console.error('Video o\'chirishda xatolik:', err));
  VideoDB.deletePoster(id).catch(err => console.error('Poster o\'chirishda xatolik:', err));

  renderPage();
};



window.renderAddAnimeForm = function () {
  const content = document.getElementById('admin-content');
  content.innerHTML = `
    <div class="admin-page-header">
      <div class="admin-page-title">Yangi anime qo'shish</div>
      <button class="admin-back-btn" onclick="currentPage='anime';renderPage()">← Orqaga</button>
    </div>

    <div class="admin-form-card">
      <form id="add-anime-form">
        <div class="form-grid">
          <div class="form-group">
            <label>Anime nomi</label>
            <input type="text" id="add-title" placeholder="Masalan: Naruto" required />
          </div>
          <div class="form-group">
            <label>Original nomi</label>
            <input type="text" id="add-original" placeholder="Masalan: Naruto Shippuden" required />
          </div>
          <div class="form-group">
            <label>Poster yuklash</label>
            <input type="file" id="add-poster" accept="image/*" required />
          </div>

          <div class="form-group">
            <label>Yil</label>
            <input type="number" id="add-year" value="2024" required />
          </div>
          <div class="form-group">
            <label>Reyting</label>
            <input type="text" id="add-rating" value="13+" required />
          </div>
          <div class="form-group">
            <label>Epizodlar soni</label>
            <input type="number" id="add-episodes" value="12" required />
          </div>
          <div class="form-group">
            <label>Bepul epizodlar</label>
            <input type="number" id="add-free" value="2" required />
          </div>
          <div class="form-group">
            <label>Premium</label>
            <select id="add-premium">
              <option value="false">Bepul</option>
              <option value="true">Premium</option>
            </select>
          </div>
          <div class="form-group">
            <label>Video yuklash (Gallerydan)</label>
            <input type="file" id="add-video" accept="video/*" required />
            <small style="color: #888; margin-top: 4px; display: block;">Video faylni tanlang (MP4 tavsiya etiladi)</small>
          </div>
        </div>


        <div class="form-group">
          <label>Tavsif</label>
          <textarea id="add-desc" rows="4" placeholder="Anime haqida qisqacha..." required></textarea>
        </div>
        <div class="form-group">
          <label>Janrlar (vergul bilan ajrating)</label>
          <input type="text" id="add-genres" placeholder="Sarguzasht, Harakat, Shounen" required />
        </div>
        <button type="submit" class="admin-submit-btn">Saqlash</button>
      </form>
    </div>
  `;

  document.getElementById('add-anime-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const animes = getAnimes();
    const newId = animes.length ? Math.max(...animes.map(a => a.id)) + 1 : 1;

    const epCount = parseInt(document.getElementById('add-episodes').value);
    const videoFile = document.getElementById('add-video').files[0];
    const posterFile = document.getElementById('add-poster').files[0];
    const episodes = [];

    for (let i = 1; i <= epCount; i++) {
      episodes.push({ num: i, title: `${i}-qism`, duration: "24 daq", hasLocalVideo: true });
    }


    const newAnime = {
      id: newId,
      title: document.getElementById('add-title').value,
      titleOriginal: document.getElementById('add-original').value,
      poster: posterFile ? URL.createObjectURL(posterFile) : '', // Temporal URL for session
      hasLocalPoster: true,
      year: parseInt(document.getElementById('add-year').value),

      rating: document.getElementById('add-rating').value,
      premium: document.getElementById('add-premium').value === 'true',
      freeEpisodes: parseInt(document.getElementById('add-free').value),
      genres: document.getElementById('add-genres').value.split(',').map(s => s.trim()),
      description: document.getElementById('add-desc').value,
      episodes: episodes
    };

    animes.push(newAnime);
    saveAnimes(animes);

    // Save poster to IndexedDB
    if (posterFile) {
      VideoDB.savePoster(newAnime.id, posterFile)
        .catch(err => console.error('Poster saqlashda xatolik:', err));
    }

    // Save video to IndexedDB for all episodes
    if (videoFile) {
      for (let i = 1; i <= epCount; i++) {
        VideoDB.saveVideo(newAnime.id, i, videoFile)
          .catch(err => console.error(`Qism ${i} videosini saqlashda xatolik:`, err));
      }
    }

    currentPage = 'anime';
    renderPage();
  });
};


// ===== INIT =====
if (sessionStorage.getItem('admin_auth') === 'true') {
  renderDashboardLayout();
} else {
  renderLogin();
}

