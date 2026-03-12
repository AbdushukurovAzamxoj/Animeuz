import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, orderBy, limit, onSnapshot, addDoc } from "firebase/firestore";
import TelegramBot from "node-telegram-bot-api";

// 1. Firebase Config (Sizniki bilan bir xil)
const firebaseConfig = {
    apiKey: "AIzaSyCXrNFToOoVC3XUUnZTaz_UjGF5VwOaQSo",
    authDomain: "animeuz-base.firebaseapp.com",
    projectId: "animeuz-base",
    storageBucket: "animeuz-base.firebasestorage.app",
    messagingSenderId: "665356056634",
    appId: "1:665356056634:web:9ae85be2be55580d119d03",
    measurementId: "G-8QG1TLL6HS"
};

// 2. Bot Sozlamalari (TOKEN va CHAT_ID ni o'zingiz qo'ying)
const TELEGRAM_TOKEN = '7519890311:AAFB5spaBpjiF8OXgtohFJ4yJMoyibX3c_Y'; // @BotFather dan olingan token
const CHAT_ID = '-1003788423881'; // Guruhingiz yoki Kanalingiz IDsi

// Firebase va Botni ishga tushirish
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

console.log("🚀 Bot ishga tushdi... Firebase'ni kuzatmoqdaman.");

// Bazani kuzatish (Real-time tracking)
let isInitialLoad = true;
const q = query(collection(db, "animelar"), orderBy("vaqti", "desc"), limit(1));

onSnapshot(q, (snapshot) => {
    if (isInitialLoad) {
        isInitialLoad = false;
        return; // Birinchi marta yuklanganda hamma narsani yubormasin
    }

    snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            const anime = change.doc.data();
            sendToTelegram(anime);
        }
    });
});

async function sendToTelegram(anime) {
    const message = `
🌟 <b>Yangi Anime Qo'shildi!</b>

🎬 <b>Nomi:</b> ${anime.nomi}
📅 <b>Vaqti:</b> ${new Date().toLocaleDateString('uz')}

👇 <b>Hozir ko'rish:</b>
`;

    try {
        await bot.sendPhoto(CHAT_ID, anime.rasm, {
            caption: message,
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "👁 Ko'rish (Saytda)", url: "https://animeuz-app.vercel.app/" },
                        { text: "📹 Videoni ko'rish", url: anime.url }
                    ]
                ]
            }
        });
        console.log(`✅ Telegram'ga yuborildi: ${anime.nomi}`);
    } catch (error) {
        console.error("❌ Telegram'ga yuborishda xato:", error.message);
    }
}

// 4. Telegram'dan Saytga qo'shish
bot.on('message', async (msg) => {
    const text = msg.text || msg.caption;
    if (!text) return;

    // Chat ID to'g'riligini tekshirish
    if (msg.chat.id.toString() !== CHAT_ID) return;

    let nomi, qism, link;

    // A) Video va sarlavha orqali (Format: Anime nomi [9-qism])
    if (msg.video) {
        // Regex: Matn ichidan nomi va qismini ajratish
        const regex = /(.+)\s*\[(.+)-qism\]/i;
        const match = text.match(regex);

        if (match) {
            nomi = match[1].trim();
            qism = match[2].trim();
            // Xabar havolasini avtomatik yaratish
            const cleanChatId = CHAT_ID.replace('-100', '');
            link = `https://t.me/c/${cleanChatId}/${msg.message_id}`;
        }
    }
    // B) Oddiy matn orqali (Format: Nomi | Qism | Link)
    else {
        const parts = text.split('|').map(p => p.trim());
        if (parts.length === 3) {
            [nomi, qism, link] = parts;
        }
    }

    // Agar ma'lumotlar topilgan bo'lsa, bazaga saqlash
    if (nomi && qism && link) {
        try {
            await addDoc(collection(db, "animelar"), {
                nomi: nomi,
                qism: qism,
                url: link,
                vaqti: new Date()
            });

            bot.sendMessage(CHAT_ID, `✨ <b>${nomi} (${qism}-qism)</b> saytga avtomatik qo'shildi!`, {
                parse_mode: 'HTML',
                reply_to_message_id: msg.message_id
            });
            console.log(`✨ Avtomatik qo'shildi: ${nomi}`);
        } catch (e) {
            console.error("❌ Firebase'ga saqlashda xato:", e);
        }
    }
});
