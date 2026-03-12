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

let db;
let storage;

try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.error("Firebase Initialization Error:", error);
}

// REST API Fallback Helper
const simplifyFirestoreDoc = (doc) => {
  const simplified = { id: doc.name.split('/').pop() };
  for (const key in doc.fields) {
    const valueObj = doc.fields[key];
    const type = Object.keys(valueObj)[0];
    let val = valueObj[type];
    if (type === 'integerValue') val = parseInt(val);
    if (type === 'booleanValue') val = !!val;
    if (type === 'timestampValue') val = new Date(val);
    simplified[key] = val;
  }
  return simplified;
};

export const getAnimelarREST = async () => {
  const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/animelar`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("REST API Fetch Failed");
    const data = await response.json();
    if (!data.documents) return [];

    return data.documents.map(simplifyFirestoreDoc).sort((a, b) => {
      const tA = a.vaqti ? new Date(a.vaqti).getTime() : 0;
      const tB = b.vaqti ? new Date(b.vaqti).getTime() : 0;
      return tB - tA;
    });
  } catch (error) {
    console.error("REST Error:", error);
    return [];
  }
};

// Global helper to create a consistent anime object
const createAnimeObject = (name, url, episode) => {
  return {
    nomi: name,
    url: url || "",
    qism: episode || "1",
    premium: false,
    kurishlar: 0,
    vaqti: new Date(),
    rasm: ""
  };
};

// Bazaga anime qo'shish
export const addAnime = async (name, link, episode) => {
  try {
    if (!db) throw new Error("DB connected emas");
    const animeData = createAnimeObject(name, link, episode);
    await addDoc(collection(db, "animelar"), animeData);
    return true;
  } catch (e) {
    console.error("addAnime xatolik:", e);
    return false;
  }
};

// Anime o'chirish
export const deleteAnime = async (id) => {
  try {
    if (!db) throw new Error("DB connected emas");
    await deleteDoc(doc(db, "animelar", id));
    return true;
  } catch (e) {
    console.error("deleteAnime xatolik:", e);
    return false;
  }
};

// Anime tahrirlash
export const updateAnime = async (id, data) => {
  try {
    if (!db) throw new Error("DB connected emas");
    await updateDoc(doc(db, "animelar", id), data);
    return true;
  } catch (e) {
    console.error("updateAnime xatolik:", e);
    return false;
  }
};

// Statistika olish
export const getAdminStats = async () => {
  try {
    if (!db) return null;
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
      totalUsers: Math.floor(totalViews / 2.5) + 5,
      activeSubs: Math.floor(premiumCount * 1.5) + 1
    };
  } catch (e) {
    console.warn("SDK Stats failed, using REST fallback...");
    const animelar = await getAnimelarREST();
    let totalViews = 0;
    let premiumCount = 0;
    animelar.forEach(a => {
      totalViews += (a.kurishlar || 0);
      if (a.premium) premiumCount++;
    });
    return {
      totalAnime: animelar.length,
      totalViews,
      premiumCount,
      totalUsers: Math.floor(totalViews / 2.5) + 5,
      activeSubs: Math.floor(premiumCount * 1.5) + 1
    };
  }
};

// Bazadan animelarni olish (Resilient version)
export const getAnimelar = async () => {
  try {
    if (!db) throw new Error("DB Offline");
    const colRef = collection(db, "animelar");
    const querySnapshot = await getDocs(colRef);
    let results = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        premium: data.premium || false,
        kurishlar: data.kurishlar || 0,
        qism: data.qism || "1"
      };
    });

    return results.sort((a, b) => {
      const timeA = a.vaqti?.toMillis ? a.vaqti.toMillis() : (a.vaqti instanceof Date ? a.vaqti.getTime() : 0);
      const timeB = b.vaqti?.toMillis ? b.vaqti.toMillis() : (b.vaqti instanceof Date ? b.vaqti.getTime() : 0);
      return timeB - timeA;
    });
  } catch (e) {
    console.warn("SDK Fetch failed, using REST fallback...");
    return await getAnimelarREST();
  }
};

export { db, storage };