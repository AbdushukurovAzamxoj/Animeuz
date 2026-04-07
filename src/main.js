import { supabase, getAnimes, getTrendingAnimes } from './db.js';

// ===== GLOBAL STATE =====
let ANIME_DATA = [];
let heroData = [];

// ===== DOM ELEMENTS =====
const navbar = document.getElementById('navbar');
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const searchToggle = document.getElementById('searchToggle');
const searchWrap = document.getElementById('searchWrap');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const toast = document.getElementById('toast');
const btnLogin = document.getElementById('btnLogin');

// User Menu
const userMenu = document.getElementById('userMenu');
const userAvatarBtn = document.getElementById('userAvatarBtn');
const userDropdown = document.getElementById('userDropdown');
const userEmailDisplay = document.getElementById('userEmailDisplay');
const adminLink = document.getElementById('adminLink');
const btnLogout = document.getElementById('btnLogout');

// Sections
const heroSlider = document.getElementById('heroSlider');
const heroTitle = document.getElementById('heroTitle');
const heroDesc = document.getElementById('heroDesc');
const heroMeta = document.getElementById('heroMeta');
const heroDots = document.getElementById('heroDots');
const btnWatch = document.getElementById('btnWatch');
const btnAdd = document.getElementById('btnAdd');

const trendingTrack = document.getElementById('trendingTrack');
const animeGrid = document.getElementById('animeGrid');
const topList = document.getElementById('topList');
const noResults = document.getElementById('noResults');

// Modal
const modalBackdrop = document.getElementById('modalBackdrop');
const modalInner = document.getElementById('modalInner');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const body = document.body;

// ===== STATE =====
let currentSlide = 0;
let slideInterval;

// ===== INIT =====
async function init() {
  await checkAuth();
  
  // Ma'lumotlarni bazadan yuklash
  try {
    const fetchedAnimes = await getAnimes();
    if (fetchedAnimes && fetchedAnimes.length > 0) {
      ANIME_DATA = fetchedAnimes;
      // Hero slaydlar uchun animelarni ajratish (agar bayroq bo'lmasa, dastlabki 3 tasini olamiz)
      heroData = ANIME_DATA.filter(a => a.hero) || ANIME_DATA.slice(0, 3);
      if (heroData.length === 0) heroData = ANIME_DATA.slice(0, 3);
    }
  } catch (err) {
    console.error("Ma'lumotlarni yuklashda xatolik:", err);
  }

  if (heroData.length > 0) {
    renderHeroSlides();
    updateHeroContent();
  }
  
  renderTrending();
  renderCatalog(ANIME_DATA);
  renderTopRated();
  startSlider();
  setupEventListeners();
}

// ===== AUTH =====
async function checkAuth() {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    btnLogin.classList.add('hidden');
    userMenu.classList.remove('hidden');
    userEmailDisplay.textContent = user.email;
    
    // Admin tekshiruvi (oddiy usul, xohlasangiz baza orqali ham bo'ladi)
    if (user.email === 'admin@anime.uz' || user.email.includes('admin')) {
      adminLink.classList.remove('hidden');
    }
  } else {
    btnLogin.classList.remove('hidden');
    userMenu.classList.add('hidden');
  }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  // Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.add('scrolled'); // keep dark glass
    }
    
    // Active Links
    let current = '';
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 150) {
        current = section.getAttribute('id');
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.dataset.section === current) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Menu
  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      mobileMenu.classList.remove('active');
      body.style.overflow = '';
    });
  });

  // Search Toggle
  searchToggle.addEventListener('click', () => {
    searchWrap.classList.toggle('active');
    if (searchWrap.classList.contains('active')) {
      searchInput.focus();
    }
  });

  // Click outside to close search
  document.addEventListener('click', (e) => {
    if (!searchWrap.contains(e.target)) {
      searchWrap.classList.remove('active');
    }
  });

  // Search Input
  searchInput.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    if (!val) {
      searchResults.innerHTML = '';
      return;
    }
    
    const results = ANIME_DATA.filter(a => a.title.toLowerCase().includes(val));
    if (results.length === 0) {
      searchResults.innerHTML = '<div style="padding: 1rem; color: #a0a0b0;">Hech narsa topilmadi...</div>';
    } else {
      searchResults.innerHTML = results.slice(0, 5).map(anime => `
        <div class="search-item" onclick="openModal('${anime.id}')">
          <img src="${anime.img}" alt="${anime.title}">
          <div class="search-item-info">
            <h4>${anime.title}</h4>
            <span>★ ${anime.rating}</span>
          </div>
        </div>
      `).join('');
    }
  });

  // Genre Filters
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const genre = chip.dataset.genre;
      
      if (genre === 'all') {
        renderCatalog(ANIME_DATA);
      } else {
        const filtered = ANIME_DATA.filter(a => a.genres.includes(genre));
        renderCatalog(filtered);
      }
    });
  });

  // Hero Buttons
  btnWatch.addEventListener('click', () => {
    openModal(heroData[currentSlide].id);
  });

  btnAdd.addEventListener('click', () => {
    showToast("Ro'yxatga qo'shildi!");
  });

  // Discovery Button
  const btnDiscovery = document.getElementById('btnDiscovery');
  if (btnDiscovery) {
    btnDiscovery.addEventListener('click', () => {
      if (ANIME_DATA.length === 0) {
        showToast("Hozircha animelar yo'q!");
        return;
      }
      const randomIdx = Math.floor(Math.random() * ANIME_DATA.length);
      const randomAnime = ANIME_DATA[randomIdx];
      showToast("Siz uchun ajoyib anime topdik! ✨");
      setTimeout(() => {
        openModal(randomAnime.id);
      }, 500);
    });
  }

  btnLogin.addEventListener('click', () => {
    window.location.href = 'login.html';
  });

  // User Profile
  if (userAvatarBtn) {
    userAvatarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!userMenu.contains(e.target)) {
        userDropdown.classList.remove('active');
      }
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      await supabase.auth.signOut();
      window.location.reload();
    });
  }

  // Hero Navigation
  document.getElementById('slidePrev').addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + heroData.length) % heroData.length;
    updateHeroContent();
    resetSlider();
  });

  document.getElementById('slideNext').addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % heroData.length;
    updateHeroContent();
    resetSlider();
  });

  // Modal Close
  modalCloseBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  // Video Modal Close
  const videoCloseBtn = document.getElementById('videoCloseBtn');
  const videoModal = document.getElementById('videoModal');
  if (videoCloseBtn) {
    videoCloseBtn.addEventListener('click', closeVideoPlayer);
  }
  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeVideoPlayer();
    });
  }
}

// ===== HERO SLIDER =====
function renderHeroSlides() {
  heroSlider.innerHTML = heroData.map((data, index) => `
    <div class="hero-slide ${index === 0 ? 'active' : ''}" style="background-image: url('${data.banner}')" id="slide-${index}"></div>
  `).join('');

  heroDots.innerHTML = heroData.map((_, index) => `
    <div class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>
  `).join('');

  document.querySelectorAll('.dot').forEach(dot => {
    dot.addEventListener('click', (e) => {
      currentSlide = parseInt(e.target.dataset.index);
      updateHeroContent();
      resetSlider();
    });
  });
}

function updateHeroContent() {
  // Update BG
  document.querySelectorAll('.hero-slide').forEach((slide, idx) => {
    slide.classList.toggle('active', idx === currentSlide);
  });
  
  // Update Dots
  document.querySelectorAll('.dot').forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentSlide);
  });

  // Update Content
  const anime = heroData[currentSlide];
  
  const contentEl = document.getElementById('heroContent');
  contentEl.style.animation = 'none';
  contentEl.offsetHeight; // trigger reflow
  contentEl.style.animation = null;

  heroTitle.textContent = anime.title;
  heroDesc.textContent = anime.desc;
  heroMeta.innerHTML = `
    <div class="meta-item rating">★ ${anime.rating || 0}</div>
    <div class="meta-item quality">${anime.quality || 'HD'}</div>
    <div class="meta-item episodes">Ep: ${anime.episode || 1}</div>
  `;
}

function startSlider() {
  slideInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % heroData.length;
    updateHeroContent();
  }, 6000);
}

function resetSlider() {
  clearInterval(slideInterval);
  startSlider();
}

// ===== RENDERERS =====
function createAnimeCard(anime) {
  return `
    <div class="anime-card" onclick="openModal('${anime.id}')">
      <div class="card-img-wrap">
        <img src="${anime.poster_url || anime.img}" alt="${anime.title}" loading="lazy" />
        <div class="card-overlay">
          <div class="card-top">
            <span class="episodes">${anime.episode || 1} Qism</span>
            <span class="rating">★ ${anime.rating || 0}</span>
          </div>
          <div class="play-btn-overlay">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
          <div class="card-bottom">
            <h3 class="card-title">${anime.title}</h3>
            <div class="card-genres">${anime.genres ? anime.genres.join(' • ') : 'Anime'}</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderTrending() {
  const trending = ANIME_DATA.filter(a => a.trending);
  trendingTrack.innerHTML = trending.map(createAnimeCard).join('');
}

function renderCatalog(data) {
  if (data.length === 0) {
    animeGrid.innerHTML = '';
    noResults.classList.remove('hidden');
  } else {
    noResults.classList.add('hidden');
    animeGrid.innerHTML = data.map(createAnimeCard).join('');
  }
}

function renderTopRated() {
  const sorted = [...ANIME_DATA].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating)).slice(0, 6);
  topList.innerHTML = sorted.map((anime, idx) => `
    <div class="top-item" onclick="openModal(${anime.id})">
      <div class="top-rank">${idx + 1}</div>
      <img src="${anime.img}" alt="${anime.title}" class="top-img" loading="lazy" />
      <div class="top-info">
        <h4>${anime.title}</h4>
        <p>${anime.genres.join(', ')}</p>
        <div class="top-stats">
          <span class="rating">★ ${anime.rating}</span>
          <span>${anime.episodes} Qism</span>
        </div>
      </div>
    </div>
  `).join('');
}

// ===== MODAL =====
window.openModal = function(id) {
  const anime = ANIME_DATA.find(a => a.id === id);
  if (!anime) return;

  const bgImage = anime.poster_url || anime.banner || anime.img;

  modalInner.innerHTML = `
    <div class="modal-banner">
      <img src="${bgImage}" alt="${anime.title}">
    </div>
    <div class="modal-content">
      <img src="${anime.poster_url || anime.img}" alt="${anime.title}" class="modal-poster">
      <div class="modal-info">
        <h2>${anime.title}</h2>
        <div class="modal-meta">
          <span>⭐️ ${anime.rating || 0} Reyting</span>
          <span>📺 ${anime.episode || 1} Qism</span>
          <span>📀 ${anime.quality || 'HD'}</span>
          <span>🎭 ${anime.genres ? anime.genres.join(', ') : 'Anime'}</span>
        </div>
        <p class="modal-desc">${anime.desc || 'Tavsif mavjud emas.'}</p>
        <div class="modal-actions">
          <button class="btn-watch" onclick="playAnime('${anime.id}')">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            Tomosha qilish
          </button>
          <button class="btn-add" onclick="showToast('Ro\\'yxatga qo\\'shildi')">
            <span>+</span> Saqlash
          </button>
        </div>
      </div>
    </div>
  `;

  modalBackdrop.classList.add('active');
  body.style.overflow = 'hidden';
  searchWrap.classList.remove('active'); // Close search if open
}

function closeModal() {
  modalBackdrop.classList.remove('active');
  body.style.overflow = '';
}

window.playAnime = function(id) {
  const anime = ANIME_DATA.find(a => a.id === id);
  if (!anime || !anime.video_url) {
    showToast("Video manzili topilmadi!");
    return;
  }

  const videoModal = document.getElementById('videoModal');
  const videoContainer = document.getElementById('videoContainer');
  
  // Close details modal
  closeModal();

  let playerHtml = '';
  let url = anime.video_url.trim();

  // Doodstream ssilkasini avto-to'g'rilash (barcha domenlar uchun: dood.to, dood.so, d0000d.com va h.k.)
  if (url.includes('/d/') && (url.includes('dood') || url.includes('d0000d') || url.includes('ds2play'))) {
    url = url.replace('/d/', '/e/');
  }

  // Agar ssilka iframe ko'rinishida bo'lsa yoki mashhur embed provayderlar bo'lsa
  // Yoki ssilka .mp4/.mkv/.m3u8 bilan tugamasa, uni embed deb hisoblaymiz (ehtimoliy xavfsizroq yo'l)
  const embedKeywords = ['<iframe', 'dood', 'd0000d', 'ds2play', 'youtube.com/embed', 'uqload', 'streamwish', 'voe', 'vidoza', 'upstream', 'filemoon', 'embed'];
  const isDirectFile = url.toLowerCase().match(/\.(mp4|mkv|mov|webm|avi|m3u8)/);
  const isEmbed = embedKeywords.some(key => url.toLowerCase().includes(key)) || !isDirectFile;

  if (isEmbed) {
    let src = url;
    if (url.includes('<iframe')) {
      const match = url.match(/src="([^"]+)"/) || url.match(/src='([^']+)'/);
      src = match ? match[1] : url;
    }
    // Embed player uchun "sandbox" va "allow" atributlarini qo'shamiz (xavfsizlik va autoplay uchun)
    playerHtml = `<iframe src="${src}" allowfullscreen="true" scrolling="no" frameborder="0" allow="autoplay; encrypted-media"></iframe>`;
  } else {
    // Haqiqiy to'g'ridan-to'g'ri video fayl bo'lsa
    playerHtml = `
      <video controls autoplay playsinline style="width: 100%; height: 100%; background: #000;">
        <source src="${url}" type="video/mp4">
        Sizning brauzeringiz videoni qo'llab-quvvatlamaydi.
      </video>
    `;
  }

  videoContainer.innerHTML = playerHtml;
  videoModal.classList.add('active');
  body.style.overflow = 'hidden';
}

window.closeVideoPlayer = function() {
  const videoModal = document.getElementById('videoModal');
  const videoContainer = document.getElementById('videoContainer');
  videoModal.classList.remove('active');
  videoContainer.innerHTML = ''; // Stop video playback
  body.style.overflow = '';
}

// ===== UTILS =====
window.showToast = function(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Particle basic effect
function createParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.style.position = 'absolute';
    p.style.width = Math.random() * 5 + 'px';
    p.style.height = p.style.width;
    p.style.background = Math.random() > 0.5 ? 'var(--primary)' : 'var(--accent)';
    p.style.borderRadius = '50%';
    p.style.opacity = Math.random() * 0.5;
    p.style.top = Math.random() * 100 + '%';
    p.style.left = Math.random() * 100 + '%';
    p.style.boxShadow = `0 0 10px ${p.style.background}`;
    p.style.animation = `float ${10 + Math.random() * 20}s infinite linear`;
    container.appendChild(p);
  }
}

const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0% { transform: translate(0, 0) rotate(0deg); }
    100% { transform: translate(${Math.random() * 200 - 100}px, -1000px) rotate(360deg); }
  }
`;
document.head.appendChild(style);

init();
createParticles();