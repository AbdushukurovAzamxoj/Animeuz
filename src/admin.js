import { getAnimes, addAnime, deleteAnime, getTrendingAnimes, getUsers, uploadVideo } from './db.js';

document.addEventListener('DOMContentLoaded', () => {

  // ===== ADMIN LOGIN LOGIC =====
  const adminLoginOverlay = document.getElementById('adminLoginOverlay');
  const adminLayout = document.getElementById('adminLayout');
  const adminLoginForm = document.getElementById('adminLoginForm');

  // Check login state
  if (sessionStorage.getItem('AnimeUZ_Admin_Logged') === 'true') {
    adminLoginOverlay.style.display = 'none';
    adminLayout.style.display = 'flex';
  } else {
    adminLoginOverlay.style.display = 'flex';
    adminLayout.style.display = 'none';
  }

  // Handle Login Submission
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('adminUser').value;
      const pass = document.getElementById('adminPass').value;

      if (user === 'admin' && pass === 'admin123') {
        sessionStorage.setItem('AnimeUZ_Admin_Logged', 'true');
        adminLoginOverlay.style.display = 'none';
        adminLayout.style.display = 'flex';
      } else {
        alert("Xatolik! Login yoki parol noto'g'ri.");
        document.getElementById('adminPass').value = '';
      }
    });
  }

  // Handle Logout
  const logoutBtn = document.querySelector('.logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('AnimeUZ_Admin_Logged');
    });
  }
  // ===== TAB SWITCHING =====
  const navItems = document.querySelectorAll('.nav-item[data-target]');
  const viewSections = document.querySelectorAll('.view-section');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(nav => nav.classList.remove('active'));
      viewSections.forEach(sec => sec.classList.remove('active'));
      item.classList.add('active');
      const targetId = item.getAttribute('data-target');
      document.getElementById(targetId).classList.add('active');
    });
  });

  // ===== FALLBACK MOCK DATA =====
  const mockTrending = [
    { id: 'mock1', title: 'Solo Leveling', rating: 9.8, status: 'Faol', season: 1, episode: 12, poster_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=100&auto=format&fit=crop' },
    { id: 'mock2', title: 'Jujutsu Kaisen', rating: 9.7, status: 'Faol', season: 2, episode: 24, poster_url: 'https://images.unsplash.com/photo-1614590740683-1629d6d5ef66?q=80&w=100&auto=format&fit=crop' },
    { id: 'mock3', title: 'Demon Slayer', rating: 9.5, status: 'Faol', season: 4, episode: 10, poster_url: 'https://images.unsplash.com/photo-1578632292335-df3f370faa4e?q=80&w=100&auto=format&fit=crop' },
  ];

  const mockUsers = [
    { id: 'u1', name: 'Azamxoja', email: 'azam@gmail.com', created_at: '2026-04-06', status: 'Aktiv' },
    { id: 'u2', name: 'Sardor', email: 'sardobek@mail.ru', created_at: '2026-04-05', status: 'Aktiv' },
    { id: 'u3', name: 'Dilshod', email: 'dilsho_99@gmail.com', created_at: '2026-04-02', status: 'Blok' },
  ];

  const trendingTableBody = document.getElementById('trendingTableBody');
  const usersTableBody = document.getElementById('usersTableBody');

  // ===== RENDER TRENDING =====
  async function renderTrending() {
    let animes = [];
    
    try {
      animes = await getTrendingAnimes();
    } catch (e) {
      console.warn('Supabase ulanmagan, mock data ishlatiladi:', e.message);
    }

    // Agar Supabase'dan data kelmasa, mock ishlatamiz
    if (!animes || animes.length === 0) {
      animes = mockTrending;
    }

    trendingTableBody.innerHTML = animes.map(anime => `
      <tr>
        <td><img src="${anime.poster_url || 'https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=100&auto=format&fit=crop'}" class="table-img" alt="poster"></td>
        <td><strong>${anime.title}</strong><br><small>Sezon ${anime.season || '-'} / Qism ${anime.episode || '-'}</small></td>
        <td>⭐ ${anime.rating || 'N/A'}</td>
        <td><span class="status-badge active">Faol</span></td>
        <td>
          <div class="table-row-actions">
            <button class="btn-action edit" title="Tahrirlash"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
            <button class="btn-action delete" data-id="${anime.id}" title="O'chirish"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
          </div>
        </td>
      </tr>
    `).join('');

    // Delete event listeners
    document.querySelectorAll('.btn-action.delete').forEach(btn => {
      btn.addEventListener('click', async () => {
        const animeId = btn.dataset.id;
        if (animeId.startsWith('mock')) {
          alert('Bu demo anime — o\'chirish faqat Supabase ulanganda ishlaydi.');
          return;
        }
        if (confirm('Rostdan ham o\'chirmoqchimisiz?')) {
          const success = await deleteAnime(animeId);
          if (success) {
            alert('Anime o\'chirildi!');
            renderTrending();
          }
        }
      });
    });
  }

  // ===== RENDER USERS =====
  async function renderUsers() {
    let users = [];

    try {
      users = await getUsers();
    } catch (e) {
      console.warn('Supabase ulanmagan, mock users ishlatiladi:', e.message);
    }

    if (!users || users.length === 0) {
      users = mockUsers;
    }

    usersTableBody.innerHTML = users.map(u => `
      <tr>
        <td><strong>${u.name || u.email?.split('@')[0] || 'Noma\'lum'}</strong></td>
        <td>${u.email || '-'}</td>
        <td>${u.created_at ? new Date(u.created_at).toLocaleDateString('uz') : '-'}</td>
        <td><span class="status-badge ${u.status === 'Blok' ? 'pending' : 'active'}">${u.status || 'Aktiv'}</span></td>
      </tr>
    `).join('');
  }

  renderTrending();
  renderUsers();

  // ===== ADD ANIME FORM =====
  const addAnimeForm = document.getElementById('addAnimeForm');

  // Form Submit
  addAnimeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('animeTitle').value;
    const season = document.getElementById('animeSeason').value;
    const episode = document.getElementById('animeEpisode').value;
    const rawVideoUrl = document.getElementById('animeVideoUrl').value;
    const btnSubmit = document.getElementById('btnSubmitAdd');

    // Funksiya: Ssilkani tahlil qilib, ishlaydigan holatga keltiradi
    const extractUrl = (str) => {
      let finalUrl = str.trim();
      
      // 1. Agar iframe tagi bo'lsa, src qismini olamiz
      if (finalUrl.includes('<') && finalUrl.includes('src=')) {
        const match = finalUrl.match(/src="([^"]+)"/) || finalUrl.match(/src='([^']+)'/);
        finalUrl = match ? match[1] : finalUrl;
      }

      // 2. Doodstream ssilkasini embed holatiga o'tkazish (/d/ -> /e/)
      if (finalUrl.includes('dood') && finalUrl.includes('/d/')) {
        finalUrl = finalUrl.replace('/d/', '/e/');
      }

      return finalUrl;
    };

    const videoUrl = extractUrl(rawVideoUrl);
    // Poster tanlanmaganda standart rasm ishlatiladi
    const defaultPoster = "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?q=80&w=800&auto=format&fit=crop";

    btnSubmit.disabled = true;
    btnSubmit.innerHTML = "Bazaga yozilmoqda...";

    // Anime ma'lumotini bazaga qo'shish
    try {
      const newAnime = await addAnime({
        title,
        season: parseInt(season),
        episode: parseInt(episode),
        video_url: videoUrl,
        poster_url: defaultPoster,
        genres: [],
        rating: 0,
        description: ''
      });

      if (newAnime) {
        alert("✅ Anime bazaga muvaffaqiyatli qo'shildi!");
      } else {
        alert("✅ Anime demo tarzda qo'shildi! (Supabase ulanganda bazaga yoziladi)");
      }
    } catch (err) {
      console.warn('Bazaga yozishda xato (demo rejim):', err.message);
      alert("✅ Anime demo tarzda qo'shildi!");
    }

    // Reset form
    setTimeout(() => {
      addAnimeForm.reset();
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = "Bazaga Qo'shish";
      document.querySelector('[data-target="dashboard"]').click();
      renderTrending();
    }, 1000);
  });

});
