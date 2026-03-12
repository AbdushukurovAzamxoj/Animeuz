import { getAnimelar } from "./firebase.js";

const container = document.querySelector("#anime-container");

const renderAnimelar = async () => {
  if (!container) return;

  const animelar = await getAnimelar();
  container.innerHTML = "";

  animelar.forEach(anime => {
    const card = `
      <div class="card">
        <img src="${anime.rasm}" alt="${anime.nomi}" style="width:100%">
        <h3>${anime.nomi}</h3>
        <a href="${anime.url}" target="_blank" class="play-btn">Ko'rish</a>
      </div>
    `;
    container.innerHTML += card;
  });
};

renderAnimelar();