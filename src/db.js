import { createClient } from '@supabase/supabase-js';

// =============================================
// TODO: Quyidagi 2 ta qiymatni o'zingizning 
// Supabase hisobingizdan olingan kalitlar bilan almashtiring!
//
// 1. https://supabase.com ga kiring
// 2. "New Project" bosing → nom bering (masalan: animeuz)
// 3. Settings → API bo'limiga o'ting
// 4. "Project URL" va "anon public" kalitini nusxalang
// =============================================

const SUPABASE_URL = 'https://dhrzrredotvbyjhjigxa.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_la_i7GDeYDPB-DLy3KmjTw_1dvOALqs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =============================================
// DATABASE HELPER FUNCTIONS
// =============================================

// ----- ANIMELAR -----

// Barcha animelarni olish
export async function getAnimes() {
  const { data, error } = await supabase
    .from('animes')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Animelarni olishda xatolik:', error);
    return [];
  }
  return data || [];
}

// Yangi anime qo'shish
export async function addAnime({ title, season, episode, video_url, poster_url, genres, rating, description }) {
  const { data, error } = await supabase
    .from('animes')
    .insert([{ title, season, episode, video_url, poster_url, genres, rating, description }])
    .select();
  
  if (error) {
    console.error('Anime qo\'shishda xatolik:', error);
    return null;
  }
  return data?.[0];
}

// Animeni o'chirish
export async function deleteAnime(id) {
  const { error } = await supabase
    .from('animes')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Anime o\'chirishda xatolik:', error);
    return false;
  }
  return true;
}

// Trenddagi animelarni olish (rating bo'yicha tartiblangan)
export async function getTrendingAnimes() {
  const { data, error } = await supabase
    .from('animes')
    .select('*')
    .order('rating', { ascending: false })
    .limit(10);
  
  if (error) {
    console.error('Trendlarni olishda xatolik:', error);
    return [];
  }
  return data || [];
}

// ----- FOYDALANUVCHILAR -----

// Barcha foydalanuvchilarni olish
export async function getUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Foydalanuvchilarni olishda xatolik:', error);
    return [];
  }
  return data || [];
}

// ----- VIDEO YUKLASH (STORAGE) -----

// Videoni Supabase Storage ga yuklash
export async function uploadVideo(file, fileName) {
  const { data, error } = await supabase
    .storage
    .from('videos')  // Storage bucket nomi
    .upload(`animes/${fileName}`, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Video yuklashda xatolik:', error);
    return null;
  }

  // Public URL qaytarish
  const { data: urlData } = supabase
    .storage
    .from('videos')
    .getPublicUrl(`animes/${fileName}`);

  return urlData?.publicUrl || null;
}

// ----- AUTH -----

// Google orqali kirish
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/index.html'
    }
  });
  if (error) {
    console.error('Google login xatolik:', error);
    return null;
  }
  return data;
}

// Email orqali Magic Link yuborish
export async function signInWithEmail(email) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      emailRedirectTo: window.location.origin + '/index.html'
    }
  });
  if (error) {
    console.error('Email login xatolik:', error);
    return null;
  }
  return data;
}

// Hozirgi foydalanuvchini olish
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Chiqish
export async function signOutUser() {
  await supabase.auth.signOut();
}

// Auth o'zgarishlarini kuzatish
export function onAuthChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}
