import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";

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

// Bazaga anime qo'shish
export const addAnime = async (name, link, image) => {
  try {
    await addDoc(collection(db, "animelar"), {
      nomi: name,
      url: link,
      rasm: image,
      vaqti: new Date()
    });
    return true;
  } catch (e) {
    console.error("Xato:", e);
    return false;
  }
};

// Bazadan animelarni olish
export const getAnimelar = async () => {
  const q = query(collection(db, "animelar"), orderBy("vaqti", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};