// ===== ANIME DATA & STORAGE =====
import { VideoDB } from './db.js';

const DEFAULT_ANIME_DATA = [
  {
    id: 1,
    title: "Qora Klever",
    titleOriginal: "Black Clover",
    poster: "https://cdn.myanimelist.net/images/anime/2/88336l.jpg",
    year: 2017,
    rating: "13+",
    premium: false,
    freeEpisodes: 6,
    genres: ["Sehrgarlik", "Sarguzasht", "Shounen"],
    description: "Asta — sehrgarlik dunyosida tug'ilgan, ammo hech qanday sehrga ega bo'lmagan bola. U sehrgarlar imperatori bo'lish orzusi bilan Qora Buqa ritsarlar guruhiga qo'shiladi va eng kuchli sehrgarlar bilan bellashadi.",
    episodes: [
      { num: 1, title: "Asta va Yuno", duration: "24 daq" },
      { num: 2, title: "Sehrgarlar imtihoni", duration: "24 daq" },
      { num: 3, title: "Qora buqa guruhi", duration: "24 daq" },
      { num: 4, title: "Birinchi vazifa", duration: "24 daq" },
      { num: 5, title: "Dungeon kashfiyoti", duration: "24 daq" },
      { num: 6, title: "Sehrgar imperatori", duration: "24 daq" },
    ]
  },
  {
    id: 2,
    title: "Naruto",
    titleOriginal: "Naruto",
    poster: "https://cdn.myanimelist.net/images/anime/1141/142503l.jpg",
    year: 2002,
    rating: "13+",
    premium: false,
    freeEpisodes: 5,
    genres: ["Ninja", "Sarguzasht", "Shounen"],
    description: "Naruto Uzumaki — ichida kuchli tulki demoni yashiringan yosh ninja. U Hokage — qishloqning eng kuchli ninjasi bo'lish orzusida. Ammo buning uchun ko'p sinovlardan o'tishi kerak.",
    episodes: [
      { num: 1, title: "Naruto Uzumaki!", duration: "23 daq" },
      { num: 2, title: "Konohamaru", duration: "23 daq" },
      { num: 3, title: "Sasuke va Sakura", duration: "23 daq" },
      { num: 4, title: "Kakashi sensei sinovi", duration: "23 daq" },
      { num: 5, title: "Xatarli vazifa", duration: "23 daq" },
    ]
  },
  {
    id: 3,
    title: "Titan Hujumi",
    titleOriginal: "Attack on Titan",
    poster: "https://cdn.myanimelist.net/images/anime/10/47347l.jpg",
    year: 2013,
    rating: "16+",
    premium: false,
    freeEpisodes: 6,
    genres: ["Fantastika", "Dram", "Harakat"],
    description: "Insoniyat ulkan devorlar ortida yashaydi — tashqarida esa ulkan titanlar hukm suradi. Eren Yeager ona titanlar tomonidan o'ldirilganidan keyin titanlarni yo'q qilishga qasam ichadi.",
    episodes: [
      { num: 1, title: "Titanlar kelishi", duration: "25 daq" },
      { num: 2, title: "O'sha kun", duration: "25 daq" },
      { num: 3, title: "Umid nuri", duration: "25 daq" },
      { num: 4, title: "Birinchi jang", duration: "25 daq" },
      { num: 5, title: "Trost jangi", duration: "25 daq" },
      { num: 6, title: "Eren titanga aylanadi", duration: "25 daq" },
    ]
  },
  {
    id: 4,
    title: "Jujutsu Kaysen",
    titleOriginal: "Jujutsu Kaisen",
    poster: "https://cdn.myanimelist.net/images/anime/1171/109222l.jpg",
    year: 2020,
    rating: "16+",
    premium: true,
    freeEpisodes: 2,
    genres: ["Mistika", "Harakat", "Shounen"],
    description: "Itadori Yuji oddiy o'quvchi bo'lib, tasodifan la'natlangan barmoqni yutib oladi va eng kuchli la'natlangan ruh — Sukuna bilan birlashadi. Endi u jujutsu sehrgarlar maktabida o'qiy boshlaydi.",
    episodes: [
      { num: 1, title: "Ryomen Sukuna", duration: "24 daq" },
      { num: 2, title: "Sehrgarlar maktabi", duration: "24 daq" },
      { num: 3, title: "La'natlangan qo'g'irchoq", duration: "24 daq" },
      { num: 4, title: "Gojo Satoru", duration: "24 daq" },
      { num: 5, title: "La'natlangan ruhlar jangi", duration: "24 daq" },
    ]
  },
  {
    id: 5,
    title: "One Piece",
    titleOriginal: "One Piece",
    poster: "https://cdn.myanimelist.net/images/anime/1244/138851l.jpg",
    year: 1999,
    rating: "13+",
    premium: false,
    freeEpisodes: 5,
    genres: ["Qaroqchilar", "Sarguzasht", "Komediya"],
    description: "Monkey D. Luffy — rezina kuchlariga ega bo'lgan yosh yigit. U dengiz qaroqchilari qiroli bo'lish va \"One Piece\" xazinasini topish uchun o'z jamoasini yig'ib, sarguzashtga yo'l oladi.",
    episodes: [
      { num: 1, title: "Luffy sarguzashti", duration: "24 daq" },
      { num: 2, title: "Zoro — qilichboz", duration: "24 daq" },
      { num: 3, title: "Nami navigatori", duration: "24 daq" },
      { num: 4, title: "Usopp qo'shiladi", duration: "24 daq" },
      { num: 5, title: "Sanji — oshpaz", duration: "24 daq" },
    ]
  },
  {
    id: 6,
    title: "Demon Slayer",
    titleOriginal: "Kimetsu no Yaiba",
    poster: "https://cdn.myanimelist.net/images/anime/1286/99889l.jpg",
    year: 2019,
    rating: "16+",
    premium: true,
    freeEpisodes: 2,
    genres: ["Tarixiy", "Harakat", "Mistika"],
    description: "Tanjiro Kamado oilasi jinlar tomonidan qatl qilinganidan keyin, jinlarga qarshi kurashuvchilar safiga qo'shiladi. Uning yagona maqsadi — jinga aylangan singlisini inson holatiga qaytarish.",
    episodes: [
      { num: 1, title: "Shafqatsizlik", duration: "24 daq" },
      { num: 2, title: "Ustoz Urokodaki", duration: "24 daq" },
      { num: 3, title: "Tanlov sinovi", duration: "24 daq" },
      { num: 4, title: "Birinchi vazifa", duration: "24 daq" },
      { num: 5, title: "O'rmon jini", duration: "24 daq" },
    ]
  },
  {
    id: 7,
    title: "Dragon Ball Z",
    titleOriginal: "Dragon Ball Z",
    poster: "https://cdn.myanimelist.net/images/anime/1607/117271l.jpg",
    year: 1989,
    rating: "13+",
    premium: false,
    freeEpisodes: 5,
    genres: ["Harakat", "Sarguzasht", "Shounen"],
    description: "Son Goku — Yerning eng kuchli jangchisi. U doimo yangi dushmanlar bilan jang qiladi va o'z kuchlarini oshiradi. Dragon Ball Z — eng legendar anime seriyalaridan biri.",
    episodes: [
      { num: 1, title: "Gokuning akasi", duration: "23 daq" },
      { num: 2, title: "Sayyid jangchilari", duration: "23 daq" },
      { num: 3, title: "Vegeta kelishi", duration: "23 daq" },
      { num: 4, title: "Namek sayyorasi", duration: "23 daq" },
      { num: 5, title: "Super Saiyan", duration: "23 daq" },
    ]
  },
  {
    id: 8,
    title: "Death Note",
    titleOriginal: "Death Note",
    poster: "https://cdn.myanimelist.net/images/anime/9/9453l.jpg",
    year: 2006,
    rating: "16+",
    premium: true,
    freeEpisodes: 2,
    genres: ["Triller", "Mistika", "Psixologik"],
    description: "Light Yagami — daho talaba, u o'lim daftarini topadi. Daftarga yozilgan har qanday odam o'ladi. Light jinoyatchilarni yo'q qilish orqali yangi dunyo qurishga harakat qiladi.",
    episodes: [
      { num: 1, title: "Yangi dunyo", duration: "23 daq" },
      { num: 2, title: "Duel boshlanishi", duration: "23 daq" },
      { num: 3, title: "L ni qidirish", duration: "23 daq" },
      { num: 4, title: "Aql o'yini", duration: "23 daq" },
      { num: 5, title: "Taktika", duration: "23 daq" },
    ]
  },
  {
    id: 9,
    title: "Bleach",
    titleOriginal: "Bleach",
    poster: "https://cdn.myanimelist.net/images/anime/3/40451l.jpg",
    year: 2004,
    rating: "13+",
    premium: false,
    freeEpisodes: 5,
    genres: ["Harakat", "Sarguzasht", "Mistika"],
    description: "Ichigo Kurosaki — ruhlarni ko'ra oladigan o'smirboy. U Shinigami (o'lim xudosi) kuchlarini oladi va yovuz ruhlardan insonlarni himoya qilishga majbur bo'ladi.",
    episodes: [
      { num: 1, title: "Shinigami kuchi", duration: "24 daq", videoUrl: "https://vjs.zencdn.net/v/oceans.mp4" },
      { num: 2, title: "Birinchi jang", duration: "24 daq", videoUrl: "https://vjs.zencdn.net/v/oceans.mp4" },
      { num: 3, title: "Hollow dushmani", duration: "24 daq", videoUrl: "https://vjs.zencdn.net/v/oceans.mp4" },
      { num: 4, title: "Rukiya xotirasi", duration: "24 daq", videoUrl: "https://vjs.zencdn.net/v/oceans.mp4" },
      { num: 5, title: "Soul Society", duration: "24 daq", videoUrl: "https://vjs.zencdn.net/v/oceans.mp4" },
    ]
  }
];


function getAnimes() {
  try {
    const data = localStorage.getItem('animeuz_animes');
    if (!data) {
      localStorage.setItem('animeuz_animes', JSON.stringify(DEFAULT_ANIME_DATA));
      return DEFAULT_ANIME_DATA;
    }
    return JSON.parse(data);
  } catch {
    return DEFAULT_ANIME_DATA;
  }
}

let ANIME_DATA = getAnimes();


// ===== PREMIUM PLANS =====
const PLANS = [
  { id: 'monthly', name: "Oylik", price: 15000, duration: 30, label: "15,000 so'm / oy" },
  { id: 'quarterly', name: "3 Oylik", price: 39000, duration: 90, label: "39,000 so'm / 3 oy", popular: true },
  { id: 'yearly', name: "Yillik", price: 120000, duration: 365, label: "120,000 so'm / yil" },
];

// ===== STATE MANAGEMENT =====
const State = {
  currentTab: 'popular',
  currentAnime: null,
  currentEpisode: null,

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

  // --- User ---
  getUser() {
    try { return JSON.parse(localStorage.getItem('animeuz_user')); }
    catch { return null; }
  },
  setUser(user) {
    localStorage.setItem('animeuz_user', JSON.stringify(user));
    // Add to users registry
    const users = this.getAllUsers();
    if (!users.find(u => u.email === user.email)) {
      users.push({ ...user, joinedAt: new Date().toISOString() });
      localStorage.setItem('animeuz_users', JSON.stringify(users));
    }
  },
  logout() {
    localStorage.removeItem('animeuz_user');
  },
  getAllUsers() {
    try { return JSON.parse(localStorage.getItem('animeuz_users') || '[]'); }
    catch { return []; }
  },

  // --- Premium ---
  isPremiumUser() {
    const user = this.getUser();
    if (!user || !user.premium) return false;
    if (user.premiumExpiry && new Date(user.premiumExpiry) < new Date()) return false;
    return true;
  },
  activatePremium(planId) {
    const plan = PLANS.find(p => p.id === planId);
    if (!plan) return;
    const user = this.getUser();
    if (!user) return;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + plan.duration);
    user.premium = true;
    user.planId = planId;
    user.planName = plan.name;
    user.premiumExpiry = expiry.toISOString();
    this.setUser(user);
    // Update registry
    const users = this.getAllUsers();
    const idx = users.findIndex(u => u.email === user.email);
    if (idx > -1) { users[idx] = { ...users[idx], ...user }; localStorage.setItem('animeuz_users', JSON.stringify(users)); }
  },
  isEpisodeLocked(anime, epNum) {
    if (!anime.premium) return false;
    if (epNum <= anime.freeEpisodes) return false;
    return !this.isPremiumUser();
  },

  // --- Analytics ---
  trackView(animeId) {
    const views = this.getViews();
    views[animeId] = (views[animeId] || 0) + 1;
    localStorage.setItem('animeuz_views', JSON.stringify(views));
  },
  getViews() {
    try { return JSON.parse(localStorage.getItem('animeuz_views') || '{}'); }
    catch { return {}; }
  },
};

// ===== ROUTER =====
const pageContent = document.getElementById('page-content');
const navBtns = document.querySelectorAll('.nav-btn');

function navigate(tab, animeId = null, episodeNum = null) {
  // Always refresh data when navigating to ensure current state
  ANIME_DATA = getAnimes();

  State.currentTab = tab;
  State.currentAnime = animeId;
  State.currentEpisode = episodeNum;

  navBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });

  const nav = document.getElementById('bottom-nav');
  nav.style.display = animeId ? 'none' : 'flex';

  pageContent.style.animation = 'none';
  pageContent.offsetHeight;
  pageContent.style.animation = 'fadeIn 0.25s ease';

  switch (tab) {
    case 'popular': renderPopular(); break;
    case 'search': renderSearch(); break;
    case 'saved': renderSaved(); break;
    case 'profile': renderProfile(); break;
    case 'detail': renderDetail(animeId, episodeNum); break;
  }
}

navBtns.forEach(btn => {
  btn.addEventListener('click', () => navigate(btn.dataset.tab));
});

// ===== POPULAR PAGE =====
let heroIndex = 0;
const heroAnime = [ANIME_DATA[0], ANIME_DATA[2], ANIME_DATA[3], ANIME_DATA[5]];

function renderPopular() {
  const featured = heroAnime[heroIndex];
  const trending = ANIME_DATA.slice(0, 9);
  const recent = ANIME_DATA.slice(3);

  pageContent.innerHTML = `
    <div class="hero-banner" onclick="navigate('detail', ${featured.id})">
      <img id="hero-img-${featured.id}" src="${featured.poster}" alt="${featured.title}" />
      <div class="hero-gradient"></div>

      <div class="hero-info">
        <div class="hero-badge">${featured.rating}</div>
        ${featured.premium ? '<div class="hero-premium-tag">⭐ Premium</div>' : ''}
        <div class="hero-title">${featured.title}</div>
        <div class="hero-dots">
          ${heroAnime.map((_, i) => `<div class="hero-dot ${i === heroIndex ? 'active' : ''}"></div>`).join('')}
        </div>
      </div>
    </div>

    <div class="section-header">
      <div class="section-title">Trend</div>
    </div>
    <div class="anime-row">
      ${ANIME_DATA.map(a => animeCard(a)).join('')}
    </div>

    <div class="section-header">
      <div class="section-title">Mashhur</div>
    </div>
    <div class="anime-grid">
      ${trending.map(a => animeCard(a)).join('')}
    </div>

    <div class="section-header">
      <div class="section-title">Yangi qo'shilgan</div>
    </div>
    <div class="anime-grid">
      ${recent.map(a => animeCard(a)).join('')}
    </div>
  `;

  clearInterval(window._heroInterval);
  window._heroInterval = setInterval(() => {
    heroIndex = (heroIndex + 1) % heroAnime.length;
    if (State.currentTab === 'popular' && !State.currentAnime) {
      const banner = document.querySelector('.hero-banner');
      if (banner) {
        const f = heroAnime[heroIndex];
        banner.setAttribute('onclick', `navigate('detail', ${f.id})`);
        const heroImg = banner.querySelector('img');
        heroImg.id = `hero-img-${f.id}`;
        heroImg.src = f.poster;

        // If it's a local poster, initialize it
        if (f.hasLocalPoster) {
          VideoDB.getPoster(f.id).then(blob => {
            if (blob) heroImg.src = URL.createObjectURL(blob);
          });
        }

        banner.querySelector('.hero-title').textContent = f.title;
        banner.querySelector('.hero-badge').textContent = f.rating;
        const premTag = banner.querySelector('.hero-premium-tag');
        if (premTag) premTag.style.display = f.premium ? '' : 'none';
        banner.querySelectorAll('.hero-dot').forEach((dot, i) => {
          dot.classList.toggle('active', i === heroIndex);
        });
      }
    }
  }, 4000);
}

function animeCard(anime) {
  return `
    <div class="anime-card" onclick="navigate('detail', ${anime.id})">
      <div class="anime-card-poster">
        <img id="poster-img-${anime.id}" src="${anime.poster}" alt="${anime.title}" loading="lazy" />

        <div class="anime-card-ep-badge">${anime.episodes.length} ep</div>
        ${anime.premium ? '<div class="anime-card-premium-badge">⭐ Premium</div>' : ''}
      </div>
      <div class="anime-card-title">${anime.title}</div>
    </div>
  `;
}

// ===== SEARCH PAGE =====
function renderSearch() {
  pageContent.innerHTML = `
    <div class="search-container">
      <div class="page-title" style="padding:8px 0 16px;">Qidiruv</div>
      <div class="search-bar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" id="search-input" placeholder="Anime nomini kiriting..." autocomplete="off" />
      </div>
      <div class="search-results" id="search-results">
        ${renderAllAnimeList(ANIME_DATA)}
      </div>
    </div>
  `;

  const input = document.getElementById('search-input');
  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    const results = ANIME_DATA.filter(a =>
      a.title.toLowerCase().includes(query) ||
      a.titleOriginal.toLowerCase().includes(query)
    );
    document.getElementById('search-results').innerHTML = results.length
      ? renderAllAnimeList(results)
      : `<div class="search-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <p>Hech narsa topilmadi</p>
        </div>`;
  });

  setTimeout(() => input.focus(), 300);
}

function renderAllAnimeList(list) {
  return list.map(a => `
    <div class="search-result-item" onclick="navigate('detail', ${a.id})">
      <div class="search-result-poster">
        <img id="search-img-${a.id}" src="${a.poster}" alt="${a.title}" loading="lazy" />
      </div>

      <div class="search-result-info">
        <div class="search-result-title">${a.title} ${a.premium ? '<span class="premium-inline-badge">Premium</span>' : ''}</div>
        <div class="search-result-meta">${a.titleOriginal} · ${a.year} · ${a.episodes.length} epizod</div>
      </div>
    </div>
  `).join('');
}

// ===== SAVED PAGE =====
function renderSaved() {
  const savedIds = State.getSaved();
  const savedAnime = ANIME_DATA.filter(a => savedIds.includes(a.id));

  pageContent.innerHTML = `
    <div class="saved-container">
      <div class="saved-header">Sevimlilar</div>
      ${savedAnime.length ? `
        <div class="anime-grid">
          ${savedAnime.map(a => animeCard(a)).join('')}
        </div>
      ` : `
        <div class="saved-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <h3>Sevimlilar ro'yxati bo'sh</h3>
          <p>Yoqtirgan animalaringizni saqlang</p>
        </div>
      `}
    </div>
  `;
}

// ===== PROFILE PAGE =====
function renderProfile() {
  const user = State.getUser();

  if (!user) {
    renderAuth();
    return;
  }

  const savedCount = State.getSaved().length;
  const isPremium = State.isPremiumUser();
  const expiryDate = user.premiumExpiry ? new Date(user.premiumExpiry).toLocaleDateString('uz') : '';

  pageContent.innerHTML = `
    <div class="profile-container">
      <div class="profile-header-section">
        <div class="profile-avatar ${isPremium ? 'premium-avatar' : ''}">${user.name.charAt(0).toUpperCase()}</div>
        <div class="profile-name">${user.name} ${isPremium ? '<span class="premium-name-badge">⭐ Premium</span>' : ''}</div>
        <div class="profile-email">${user.email}</div>
      </div>

      ${isPremium ? `
        <div class="subscription-card">
          <div class="subscription-card-header">
            <span class="subscription-icon">⭐</span>
            <span>Premium faol</span>
          </div>
          <div class="subscription-details">
            <div class="subscription-plan">${user.planName || 'Premium'} tarif</div>
            <div class="subscription-expiry">Muddati: ${expiryDate}</div>
          </div>
        </div>
      ` : `
        <div class="upgrade-card" onclick="showPaymentModal()">
          <div class="upgrade-card-inner">
            <span class="upgrade-icon">⭐</span>
            <div>
              <div class="upgrade-title">Premium ga o'tish</div>
              <div class="upgrade-desc">Barcha animalarni cheksiz tomosha qiling</div>
            </div>
            <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>
      `}

      <div class="profile-stats">
        <div class="profile-stat">
          <div class="profile-stat-num">${savedCount}</div>
          <div class="profile-stat-label">Sevimlilar</div>
        </div>
        <div class="profile-stat">
          <div class="profile-stat-num">${ANIME_DATA.length}</div>
          <div class="profile-stat-label">Jami anime</div>
        </div>
        <div class="profile-stat">
          <div class="profile-stat-num">UZ</div>
          <div class="profile-stat-label">Til</div>
        </div>
      </div>

      <div class="profile-menu">
        <button class="profile-menu-item" onclick="navigate('saved')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          Sevimlilar
          <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <button class="profile-menu-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          Sozlamalar
          <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <button class="profile-menu-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          Ilova haqida
          <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      <div class="profile-menu">
        <button class="profile-menu-item danger" onclick="handleLogout()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Chiqish
        </button>
      </div>
    </div>
  `;
}

function renderAuth() {
  let isLogin = true;

  function render() {
    pageContent.innerHTML = `
      <div class="auth-container">
        <div class="auth-logo">
          <h1>AnimeUZ</h1>
          <p>O'zbek tilidagi anime</p>
        </div>
        <form class="auth-form" id="auth-form">
          ${!isLogin ? `<input class="auth-input" type="text" id="auth-name" placeholder="Ismingiz" required />` : ''}
          <input class="auth-input" type="email" id="auth-email" placeholder="Email" required />
          <input class="auth-input" type="password" id="auth-password" placeholder="Parol" required />
          <button type="submit" class="auth-btn">${isLogin ? 'Kirish' : 'Ro\'yxatdan o\'tish'}</button>
        </form>
        <div class="auth-toggle">
          ${isLogin
        ? 'Akkauntingiz yo\'qmi? <a id="auth-switch">Ro\'yxatdan o\'ting</a>'
        : 'Akkauntingiz bormi? <a id="auth-switch">Tizimga kiring</a>'}
        </div>
      </div>
    `;

    document.getElementById('auth-switch').addEventListener('click', () => {
      isLogin = !isLogin;
      render();
    });

    document.getElementById('auth-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('auth-email').value;
      const name = isLogin ? email.split('@')[0] : document.getElementById('auth-name').value;
      State.setUser({ name, email });
      navigate('profile');
    });
  }

  render();
}

window.handleLogout = function () {
  State.logout();
  navigate('profile');
};

// ===== PAYMENT MODAL =====
window.showPaymentModal = function (fromAnimeId = null) {
  const user = State.getUser();
  if (!user) {
    navigate('profile');
    return;
  }

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'payment-modal';
  overlay.innerHTML = `
    <div class="modal-sheet">
      <div class="modal-handle"></div>
      <div class="modal-header">
        <h2>Premium obuna</h2>
        <p>Barcha animalarni cheksiz tomosha qiling</p>
      </div>

      <div class="plans-list">
        ${PLANS.map(plan => `
          <label class="plan-option ${plan.popular ? 'popular' : ''}" data-plan="${plan.id}">
            <input type="radio" name="plan" value="${plan.id}" ${plan.popular ? 'checked' : ''} />
            <div class="plan-radio"></div>
            <div class="plan-info">
              <div class="plan-name">${plan.name} ${plan.popular ? '<span class="plan-popular-tag">Tavsiya</span>' : ''}</div>
              <div class="plan-price">${plan.label}</div>
            </div>
          </label>
        `).join('')}
      </div>

      <div class="payment-form">
        <div class="payment-section-title">To'lov ma'lumotlari</div>
        <input class="auth-input" type="text" placeholder="Karta raqami (0000 0000 0000 0000)" maxlength="19" id="card-number" />
        <div class="payment-row">
          <input class="auth-input" type="text" placeholder="MM/YY" maxlength="5" id="card-expiry" />
          <input class="auth-input" type="text" placeholder="CVV" maxlength="3" id="card-cvv" />
        </div>
        <input class="auth-input" type="text" placeholder="Karta egasi nomi" id="card-name" />
      </div>

      <button class="auth-btn payment-confirm-btn" id="confirm-payment">To'lash</button>
      <button class="modal-cancel" onclick="closePaymentModal()">Bekor qilish</button>
    </div>
  `;

  document.body.appendChild(overlay);

  // Animate in
  requestAnimationFrame(() => overlay.classList.add('active'));

  // Close on backdrop click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePaymentModal();
  });

  // Card number formatting
  const cardInput = document.getElementById('card-number');
  cardInput.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 16);
    e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
  });

  // Expiry formatting
  const expiryInput = document.getElementById('card-expiry');
  expiryInput.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
    e.target.value = v;
  });

  // Confirm payment
  document.getElementById('confirm-payment').addEventListener('click', () => {
    const selectedPlan = document.querySelector('input[name="plan"]:checked');
    if (!selectedPlan) return;

    const btn = document.getElementById('confirm-payment');
    btn.textContent = 'To\'lanmoqda...';
    btn.disabled = true;

    // Simulate payment processing
    setTimeout(() => {
      State.activatePremium(selectedPlan.value);
      closePaymentModal();

      // Show success toast
      showToast('Premium muvaffaqiyatli faollashtirildi! ⭐');

      // Refresh current page
      if (fromAnimeId) {
        navigate('detail', fromAnimeId);
      } else {
        navigate('profile');
      }
    }, 1500);
  });
};

window.closePaymentModal = function () {
  const modal = document.getElementById('payment-modal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
  }
};

// ===== TOAST =====
function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ===== ANIME DETAIL PAGE =====
function renderDetail(animeId, episodeNum = null) {
  const anime = ANIME_DATA.find(a => a.id === animeId);
  if (!anime) { navigate('popular'); return; }

  // Track view
  State.trackView(animeId);

  const isSaved = State.isSaved(anime.id);
  const activeEpNum = episodeNum || null;
  const animeEp = activeEpNum ? anime.episodes.find(e => e.num === activeEpNum) : null;
  const isLocked = activeEpNum ? State.isEpisodeLocked(anime, activeEpNum) : false;

  pageContent.innerHTML = `
    <div class="detail-page">
      <button class="detail-back" onclick="navigate('popular')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      </button>

      ${activeEpNum && !isLocked ? `
        <div class="video-player-container">
          <video controls autoplay id="anime-player">
            <source src="" type="video/mp4" />
            Brauzeringiz video teg'ini qo'llamaydi.
          </video>
        </div>
      ` : activeEpNum && isLocked ? `


        <div class="video-locked-container">
          <div class="locked-overlay">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="lock-icon-big"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <h3>Premium kontent</h3>
            <p>Bu epizodni ko'rish uchun Premium obunaga o'ting</p>
            <button class="auth-btn" onclick="showPaymentModal(${anime.id})" style="margin-top:12px;padding:10px 32px;">⭐ Premium olish</button>
          </div>
        </div>
      ` : `
        <div class="detail-poster">
          <img src="${anime.poster}" alt="${anime.title}" />
          <div class="detail-poster-gradient"></div>
        </div>
      `}

      <div class="detail-content">
        <div class="detail-title">${anime.title} ${anime.premium ? '<span class="premium-inline-badge">Premium</span>' : ''}</div>
        <div class="detail-meta">
          <span class="detail-badge">${anime.rating}</span>
          <span class="detail-year">${anime.year}</span>
          <span class="detail-episodes-count">${anime.episodes.length} epizod</span>
        </div>

        <div class="detail-actions">
          <button class="detail-action-btn primary" onclick="navigate('detail', ${anime.id}, 1)">
            <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Ko'rish
          </button>
          <button class="detail-action-btn ${isSaved ? 'saved' : 'secondary'}" onclick="toggleSaveAnime(${anime.id})" id="save-btn">
            <svg viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            ${isSaved ? 'Saqlangan' : 'Saqlash'}
          </button>
        </div>

        <div class="detail-genres">
          ${anime.genres.map(g => `<span class="detail-genre-tag">${g}</span>`).join('')}
        </div>

        <div class="detail-description">${anime.description}</div>
      </div>

      <div class="episodes-section">
        <div class="episodes-title">Epizodlar ${anime.premium ? `<span class="episodes-free-note">(${anime.freeEpisodes} ta bepul)</span>` : ''}</div>
        <div class="episode-list">
          ${anime.episodes.map(ep => {
    const locked = State.isEpisodeLocked(anime, ep.num);
    return `
              <button class="episode-item ${activeEp === ep.num ? 'active' : ''} ${locked ? 'locked' : ''}" onclick="${locked ? `showPaymentModal(${anime.id})` : `navigate('detail', ${anime.id}, ${ep.num})`}">
                <div class="episode-num">${ep.num}</div>
                <div class="episode-info">
                  <div class="episode-name">${ep.title}</div>
                  <div class="episode-duration">${ep.duration}</div>
                </div>
                <div class="episode-play-icon">
                  ${locked
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>'
      }
                </div>
              </button>
            `;
  }).join('')}
        </div>
      </div>
    </div>
  `;

  window.scrollTo(0, 0);

  // Set video source from IndexedDB if it exists
  if (activeEpNum && !isLocked) {
    setTimeout(async () => {
      const videoElement = document.getElementById('anime-player');
      if (videoElement) {
        const videoBlob = await VideoDB.getVideo(animeId, activeEpNum);
        if (videoBlob) {
          const videoURL = URL.createObjectURL(videoBlob);
          // Find the source or set directly
          const source = videoElement.querySelector('source');
          if (source) {
            source.src = videoURL;
            videoElement.load();
            videoElement.play().catch(e => console.log('Auto-play blocked or failed:', e));
          } else {
            videoElement.src = videoURL;
          }
        } else if (animeEp && animeEp.videoUrl) {
          // Fallback to static URL if blob is missing but URL exists (for default data)
          videoElement.src = animeEp.videoUrl;
          videoElement.load();
        }
      }
    }, 50);
  }
}


window.toggleSaveAnime = function (animeId) {
  const nowSaved = State.toggleSaved(animeId);
  const btn = document.getElementById('save-btn');
  if (btn) {
    btn.className = `detail-action-btn ${nowSaved ? 'saved' : 'secondary'}`;
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="${nowSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      ${nowSaved ? 'Saqlangan' : 'Saqlash'}
    `;
    btn.style.animation = 'pulse 0.3s ease';
    setTimeout(() => btn.style.animation = '', 300);
  }
};

// Make navigate available globally
window.navigate = navigate;

// ===== INIT =====
async function initializePosters() {
  for (const anime of ANIME_DATA) {
    if (anime.hasLocalPoster) {
      const posterBlob = await VideoDB.getPoster(anime.id);
      if (posterBlob) {
        const url = URL.createObjectURL(posterBlob);
        const imgs = document.querySelectorAll(`[id^="poster-img-${anime.id}"], [id^="hero-img-${anime.id}"], [id^="detail-img-${anime.id}"], [id^="search-img-${anime.id}"]`);
        imgs.forEach(img => img.src = url);
      }

    }
  }
}

// Wrap existing render functions to trigger poster initialization
const originalRenderPopular = renderPopular;
renderPopular = function () {
  originalRenderPopular();
  initializePosters();
};

const originalRenderSearch = renderSearch;
renderSearch = function () {
  originalRenderSearch();
  initializePosters();
};

const originalRenderSaved = renderSaved;
renderSaved = function () {
  originalRenderSaved();
  initializePosters();
};

const originalRenderDetail = renderDetail;
renderDetail = function (id, ep) {
  originalRenderDetail(id, ep);
  initializePosters();
};

navigate('popular');

