import { supabase } from './db.js';
import { signInWithGoogle } from './db.js';

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const stepForm = document.getElementById('stepForm');
  const stepCode = document.getElementById('stepCode');
  const mainForm = document.getElementById('mainForm');
  const sentEmailEl = document.getElementById('sentEmail');
  const formTitle = document.getElementById('formTitle');
  const formDesc = document.getElementById('formDesc');
  const btnVerify = document.getElementById('btnVerify');
  const btnResend = document.getElementById('btnResend');
  const btnBack = document.getElementById('btnBack');
  const otpBoxes = document.querySelectorAll('.otp-box');
  const googleBtn = document.querySelector('.btn-social.google');
  
  // Tabs
  const authTabs = document.querySelectorAll('.auth-tab');
  const btnSubmitForm = document.getElementById('btnSubmitForm');
  const passwordContainer = document.getElementById('password').closest('.input-group');

  let currentEmail = '';
  let currentPassword = '';
  let authMode = 'register'; // 'register' yoki 'login'

  // Tab switching logic
  authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      authTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      authMode = tab.dataset.tab;

      if (authMode === 'login') {
        formTitle.textContent = "Tizimga kirish";
        formDesc.textContent = "Email va parolingizni kiritib profilingizga kiring.";
        btnSubmitForm.innerHTML = `Kirish <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
        document.getElementById('passwordLabel').textContent = "Parolingizni kiriting";
      } else {
        formTitle.textContent = "Xush kelibsiz!";
        formDesc.textContent = "Yangi akkaunt yaratish uchun ro'yxatdan o'ting.";
        btnSubmitForm.innerHTML = `Ro'yxatdan o'tish <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
        document.getElementById('passwordLabel').textContent = "Parol o'ylab toping";
      }
    });
  });

  // Main Form Submit (Register / Login)
  mainForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    currentEmail = document.getElementById('email').value;
    currentPassword = document.getElementById('password').value;
    
    const originalHTML = btnSubmitForm.innerHTML;
    btnSubmitForm.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;animation:spin 1s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg> Kutib turing...';
    btnSubmitForm.disabled = true;

    try {
      if (authMode === 'register') {
        // RO'YXATDAN O'TISH
        const { data, error } = await supabase.auth.signUp({
          email: currentEmail,
          password: currentPassword,
        });

        if (error) throw error;
        
        // Agar foydalanuvchi yaratilib, emailni tasdiqlash talab etilsa
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          try {
            // Demak user bor. Agar tasdiqlanmagan bo'lsa, kodni qayta jo'natamiz:
            await supabase.auth.resend({ type: 'signup', email: currentEmail });
            showCodeStep();
            return;
          } catch(resendErr) {
            // Agar u allaqachon tasdiqlab bo'lgan bo'lsa:
            alert("Bunday email allaqachon ro'yxatdan o'tgan! Iltimos, tepadan 'Kirish' tugmasini bosib kiring.");
            btnSubmitForm.innerHTML = originalHTML;
            btnSubmitForm.disabled = false;
            return;
          }
        }

        // Yangi user uchun emailga kod ketdi
        showCodeStep();
      } else {
        // TIZIMGA KIRISH (Login)
        const { error } = await supabase.auth.signInWithPassword({
          email: currentEmail,
          password: currentPassword,
        });

        if (error) throw error;

        // Muvaffaqiyatli login -> bosh sahifaga
        btnSubmitForm.innerHTML = "Muvaffaqiyatli! ✅";
        btnSubmitForm.style.background = 'var(--success)';
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
      }
    } catch (err) {
      console.error('Xatolik:', err);
      btnSubmitForm.innerHTML = originalHTML;
      btnSubmitForm.disabled = false;

      if (err.message?.includes('Invalid API')) {
        alert("Supabase kalitlari to'g'ri sozlanganiga ishonch hosil qiling.");
      } else if (err.message?.includes('Invalid login credentials')) {
        alert("Email yoki parol noto'g'ri (yoki pochta hali tasdiqlanmagan)!");
      } else {
        alert("Xatolik: " + err.message);
      }
    }
  });

  function showCodeStep() {
    stepForm.classList.add('hidden');
    stepCode.classList.remove('hidden');
    sentEmailEl.textContent = currentEmail;
    formTitle.textContent = 'Kodni kiriting';
    formDesc.textContent = 'Emailingizga yuborilgan 8 xonali tasdiqlash kodini kiriting';
    
    setTimeout(() => otpBoxes[0].focus(), 300);
  }

  // ===== OTP INPUT LOGIC =====
  otpBoxes.forEach((box, idx) => {
    box.addEventListener('input', (e) => {
      const val = e.target.value;
      if (!/^\d$/.test(val)) {
        e.target.value = ''; return;
      }
      box.classList.add('filled');
      if (val && idx < otpBoxes.length - 1) {
        otpBoxes[idx + 1].focus();
      }

      const code = getOtpCode();
      if (code.length === 8) verifyCode(code);
    });

    box.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !box.value && idx > 0) {
        otpBoxes[idx - 1].focus();
        otpBoxes[idx - 1].value = '';
        otpBoxes[idx - 1].classList.remove('filled');
      }
    });

    box.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 8);
      pasteData.split('').forEach((char, i) => {
        if (otpBoxes[i]) {
          otpBoxes[i].value = char;
          otpBoxes[i].classList.add('filled');
        }
      });
      if (pasteData.length === 8) verifyCode(pasteData);
    });
  });

  function getOtpCode() {
    return Array.from(otpBoxes).map(b => b.value).join('');
  }

  // ===== STEP 2: Kodni tasdiqlash (faqat Register uchun) =====
  btnVerify.addEventListener('click', () => {
    const code = getOtpCode();
    if (code.length < 8) {
      otpBoxes.forEach(b => {
        if (!b.value) b.classList.add('error');
        setTimeout(() => b.classList.remove('error'), 500);
      });
      return;
    }
    verifyCode(code);
  });

  async function verifyCode(code) {
    const originalHTML = btnVerify.innerHTML;
    btnVerify.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;animation:spin 1s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg> Tekshirilmoqda...';
    btnVerify.disabled = true;

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: currentEmail,
        token: code,
        type: 'signup' // Ro'yxatdan o'tish kodini tekshirish
      });

      if (error) throw error;

      formTitle.textContent = '✅ Tasdiqlandi!';
      formDesc.textContent = "Tizimda muvaffaqiyatli ro'yxatdan o'tdingiz. Yo'naltirilmoqda...";
      btnVerify.innerHTML = '✓ Muvaffaqiyatli!';
      btnVerify.style.background = 'var(--success)';

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);

    } catch (err) {
      console.error('Tasdiqlash xatolik:', err);
      btnVerify.innerHTML = originalHTML;
      btnVerify.disabled = false;
      
      otpBoxes.forEach(b => {
        b.classList.add('error');
        b.classList.remove('filled');
        setTimeout(() => b.classList.remove('error'), 500);
      });

      if (err.message?.includes('Token')) {
        alert('Kod noto\'g\'ri yoki eskirgan. Qayta urinib ko\'ring.');
      } else {
        alert('Xatolik: ' + err.message);
      }
    }
  }

  // ===== QAYTA YUBORISH =====
  btnResend.addEventListener('click', async () => {
    btnResend.textContent = 'Yuborilmoqda...';
    btnResend.disabled = true;

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: currentEmail,
      });

      if (error) throw error;
      
      btnResend.textContent = 'Yuborildi! ✓';
      setTimeout(() => {
        btnResend.textContent = 'Qayta yuborish';
        btnResend.disabled = false;
      }, 5000);

      otpBoxes.forEach(b => { b.value = ''; b.classList.remove('filled'); });
      otpBoxes[0].focus();

    } catch (err) {
      btnResend.textContent = 'Qayta yuborish';
      btnResend.disabled = false;
      alert('Yuborishda xatolik: ' + err.message);
    }
  });

  // ===== ORQAGA =====
  btnBack.addEventListener('click', () => {
    stepCode.classList.add('hidden');
    stepForm.classList.remove('hidden');
    formTitle.textContent = "Xush kelibsiz!";
    formDesc.textContent = "Yangi akkaunt yaratish uchun ro'yxatdan o'ting.";
    
    const btn = document.getElementById('btnSubmitForm');
    btn.innerHTML = `Ro'yxatdan o'tish <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
    btn.disabled = false;

    otpBoxes.forEach(b => { b.value = ''; b.classList.remove('filled', 'error'); });
  });

  // ===== GOOGLE =====
  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      try {
        await signInWithGoogle();
      } catch (err) {
        alert('Google kirish xatolik: ' + err.message);
      }
    });
  }
});
