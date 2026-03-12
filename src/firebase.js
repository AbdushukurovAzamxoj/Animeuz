import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, orderBy, limit } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCXrNFToOoVC3XUUnZTaz_UjGF5VwOaQSo",
  authDomain: "animeuz-base.firebaseapp.com",
  projectId: "animeuz-base",
  storageBucket: "animeuz-base.firebasestorage.app",
  messagingSenderId: "665356056634",
  appId: "1:665356056634:web:9ae85be2be55580d119d03",
  measurementId: "G-8QG1TLL6HS"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Bazaga anime qo'shish
export const addAnime = async (name, link, episode) => {
  try {
    await addDoc(collection(db, "animelar"), {
      nomi: name,
      url: link,
      qism: episode,
      premium: false,
      kurishlar: 0,
      vaqti: new Date()
    });
    return true;
  } catch (e) {
    console.error("Xato:", e);
    return false;
  }
};

// Anime o'chirish
export const deleteAnime = async (id) => {
  try {
    await deleteDoc(doc(db, "animelar", id));
    return true;
  } catch (e) {
    console.error("O'chirishda xato:", e);
    return false;
  }
};

// Anime tahrirlash (masalan: Premium toggle yoki nomini o'zgartirish)
export const updateAnime = async (id, data) => {
  try {
    await updateDoc(doc(db, "animelar", id), data);
    return true;
  } catch (e) {
    console.error("Yangilashda xato:", e);
    return false;
  }
};

// Statistika olish
export const getAdminStats = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "animelar"));
    let totalViews = 0;
    let premiumCount = 0;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      totalViews += (data.kurishlar || 0);
      if (data.premium) premiumCount++;
    });

    return {
      totalAnime: querySnapshot.size,
      totalViews,
      premiumCount,
      totalUsers: Math.floor(totalViews / 3) + 7, // Hozircha taxminiy userlar soni
      activeSubs: Math.floor(premiumCount * 1.2) + 2 // Taxminiy obuna bo'lganlar
    };
  } catch (e) {
    console.error("Statistika olishda xato:", e);
    return null;
  }
};

// Bazadan animelarni olish
export const getAnimelar = async () => {
  const q = query(collection(db, "animelar"), orderBy("vaqti", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};