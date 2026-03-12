import { addAnime, getAnimelar, deleteAnime, updateAnime, getAdminStats } from "./firebase.js";

// ===== UI ELEMENTS =====
const tabs = document.querySelectorAll(".admin-nav-item");
const contents = document.querySelectorAll(".admin-tab-content");
const animeForm = document.querySelector("#anime-form");
const animeListTable = document.querySelector("#anime-list-table");

// Stats elements
const statTotalAnime = document.querySelector("#stat-total-anime");
const statTotalViews = document.querySelector("#stat-total-views");
const statTotalUsers = document.querySelector("#stat-total-users");
const statActiveSubs = document.querySelector("#stat-active-subs");

// ===== TAB SWITCHING =====
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        const targetTab = tab.dataset.tab;

        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        contents.forEach(content => {
            content.style.display = content.id === `tab-${targetTab}` ? "block" : "none";
        });

        if (targetTab === "dashboard") loadStats();
        if (targetTab === "animelar") loadAnimeList();
    });
});

// ===== DASHBOARD STATS =====
async function loadStats() {
    const stats = await getAdminStats();
    const animelar = await getAnimelar();

    if (stats) {
        statTotalAnime.textContent = stats.totalAnime;
        statTotalViews.textContent = stats.totalViews;
        statTotalUsers.textContent = stats.totalUsers;
        statActiveSubs.textContent = stats.activeSubs;
    }

    renderTrends(animelar);
}

function renderTrends(animelar) {
    const trendsList = document.querySelector("#trends-list");
    if (!trendsList) return;

    // Eng ko'p ko'rilgan 5 tasini olish
    const top5 = [...animelar]
        .filter(a => a.kurishlar > 0)
        .sort((a, b) => (b.kurishlar || 0) - (a.kurishlar || 0))
        .slice(0, 5);

    if (top5.length === 0) {
        trendsList.innerHTML = `<p style="color:var(--text-muted); font-size:13px;">Hali ko'rishlar statistikasi mavjud emas.</p>`;
        return;
    }

    trendsList.innerHTML = top5.map((a, i) => `
        <div class="trend-item">
            <span class="trend-rank">#${i + 1}</span>
            <span class="trend-name">${a.nomi}</span>
            <span class="trend-views">${a.kurishlar} ta ko'rish</span>
        </div>
    `).join("");
}

// ===== ANIME LIST MANAGEMENT =====
async function loadAnimeList() {
    if (!animeListTable) return;

    animeListTable.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px;">Yuklanmoqda...</td></tr>`;

    const animelar = await getAnimelar();

    if (animelar.length === 0) {
        animeListTable.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px;">Animelar mavjud emas.</td></tr>`;
        return;
    }

    animeListTable.innerHTML = animelar.map(anime => `
        <tr>
            <td style="font-weight:600;">
                ${anime.nomi}
                <button class="edit-link" onclick="handleEditName('${anime.id}', '${anime.nomi}')">✏️</button>
            </td>
            <td>${anime.qism}-qism</td>
            <td>
                <span class="status-badge ${anime.premium ? 'premium' : 'standard'}">
                    ${anime.premium ? 'Premium' : 'Standard'}
                </span>
            </td>
            <td>${anime.kurishlar || 0} marta</td>
            <td>
                <div style="display:flex; gap:8px;">
                    <button class="action-btn toggle" onclick="handlePremiumToggle('${anime.id}', ${anime.premium})">
                        ${anime.premium ? 'Std qil' : 'Prem qil'}
                    </button>
                    <button class="action-btn delete" onclick="handleDelete('${anime.id}')">
                        O'chirish
                    </button>
                </div>
            </td>
        </tr>
    `).join("");
}

// ===== GLOBAL ACTIONS =====
window.handleEditName = async (id, oldName) => {
    const newName = prompt("Yangi nomni kiriting:", oldName);
    if (newName && newName.trim() !== oldName) {
        const success = await updateAnime(id, { nomi: newName.trim() });
        if (success) {
            alert("Nom o'zgartirildi!");
            loadAnimeList();
        }
    }
};

window.handleDelete = async (id) => {
    if (confirm("Haqiqatdan ham ushbu animeni o'chirmoqchimisiz?")) {
        const success = await deleteAnime(id);
        if (success) {
            alert("O'chirildi!");
            loadAnimeList();
            loadStats();
        }
    }
};

window.handlePremiumToggle = async (id, currentStatus) => {
    const success = await updateAnime(id, { premium: !currentStatus });
    if (success) {
        loadAnimeList();
        loadStats();
    }
};

// ===== ADD NEW ANIME =====
if (animeForm) {
    animeForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const submitBtn = animeForm.querySelector("button[type='submit']");
        submitBtn.disabled = true;
        submitBtn.textContent = "Yuklanmoqda...";

        const nomi = document.querySelector("#nomi").value.trim();
        const link = document.querySelector("#link").value.trim();
        const qism = document.querySelector("#qism").value;

        try {
            const success = await addAnime(nomi, link, qism);
            if (success) {
                alert("Anime muvaffaqiyatli qo'shildi!");
                animeForm.reset();
            } else {
                alert("Xatolik yuz berdi.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Baza'ga yuklash";
        }
    });
}

// Initial load
loadStats();