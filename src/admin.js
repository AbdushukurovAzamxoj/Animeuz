import { addAnime } from "./firebase.js";

const form = document.querySelector("#anime-form");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nomi = document.querySelector("#nomi").value;
    const link = document.querySelector("#link").value;
    const rasm = document.querySelector("#rasm").value;

    console.log("Yuborilmoqda...");

    const success = await addAnime(nomi, link, rasm);

    if (success) {
      alert("Anime bazaga muvaffaqiyatli qo'shildi!");
      form.reset();
    } else {
      alert("Xatolik! Internetni yoki firebase.js ni tekshiring.");
    }
  });
}