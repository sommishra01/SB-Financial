   document.addEventListener('DOMContentLoaded', function () {

  /* ============================================================
     GOOGLE SHEET FORM SUBMISSION (SAFE VERSION)
     ============================================================ */
  const form = document.forms['submit-to-google-sheet'];
  const msg = document.getElementById("msg");
  const phoneField = document.querySelector("#fullphone");

  if (form && msg) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      msg.innerHTML = "Sending...";

      try {
        if (phoneField && typeof phoneInput !== "undefined") {
          phoneField.value = phoneInput.getNumber();
        }

        await fetch('https://script.google.com/macros/s/AKfycbwEhzWuuHaiInoH6E2NXTUzvqYo4zqMzm0BI1pJ_ghIMpU5Q1By7o-XrgTtNQlbtcayDw/exec', {
          method: 'POST',
          body: new FormData(form)
        });

        msg.innerHTML = "✅ Message sent successfully!";
        form.reset();

        setTimeout(() => msg.innerHTML = "", 4000);

      } catch (error) {
        msg.innerHTML = "❌ Something went wrong. Try again.";
      }
    });
  }

  /* ============================================================
     MOBILE NAV TOGGLE (WORKS ON ALL PAGES)
     ============================================================ */
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  /* ============================================================
     AOS INITIALIZATION
     ============================================================ */
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 1000, once: true });
  }

  /* ============================================================
     MUTUAL FUND LOGO TICKER
     ============================================================ */
  const track = document.getElementById('logoTrack');
  if (track) {
    const originals = Array.from(track.querySelectorAll('.logo-item'));
    originals.forEach(item => track.appendChild(item.cloneNode(true)));

    let pos = 0;
    const speed = 0.4;
    let paused = false;
    let halfWidth = 0;

    setTimeout(() => { halfWidth = track.scrollWidth / 2; }, 100);
    window.addEventListener('resize', () => { halfWidth = track.scrollWidth / 2; });

    track.addEventListener('mouseenter', () => paused = true);
    track.addEventListener('mouseleave', () => paused = false);

    function tick() {
      if (!paused && halfWidth > 0) {
        pos += speed;
        if (pos >= halfWidth) pos = 0;
        track.style.transform = `translateX(-${pos}px)`;
      }
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* ============================================================
     CALCULATORS PAGE (SAFE GUARD)
     ============================================================ */
  if (!document.getElementById('panel-sip')) return;

  /* ── Vanta Background ── */
  if (typeof VANTA !== 'undefined' && document.getElementById('vanta-bg')) {
    VANTA.NET({
      el: '#vanta-bg',
      mouseControls: true,
      touchControls: true,
      color: 0x305f72,
      backgroundColor: 0x101820,
      points: 10,
      maxDistance: 20,
      spacing: 18,
    });
  }

  /* ── Utility Functions ── */
  function fmt(n) {
    if (n >= 1e7) return '₹' + (n / 1e7).toFixed(2) + ' Cr';
    if (n >= 1e5) return '₹' + (n / 1e5).toFixed(2) + ' L';
    return '₹' + Math.round(n).toLocaleString('en-IN');
  }

  function fmtPlain(n) {
    return '₹' + Math.round(n).toLocaleString('en-IN');
  }

  function syncSlider(el) {
    const min = parseFloat(el.min);
    const max = parseFloat(el.max);
    const val = parseFloat(el.value);
    const pct = ((val - min) / (max - min) * 100).toFixed(1) + '%';
    el.style.setProperty('--pct', pct);
  }

  document.querySelectorAll('input[type="range"]').forEach(el => {
    syncSlider(el);
    el.addEventListener('input', () => syncSlider(el));
  });

  /* ── SIP Calculator ── */
  function calcSIP() {
    const P = +document.getElementById('sip-amt').value;
    const r = +document.getElementById('sip-rate').value / 100 / 12;
    const n = +document.getElementById('sip-yrs').value * 12;

    const corpus = r === 0 ? P * n : P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const invested = P * n;

    document.getElementById('sip-r-corpus').textContent = fmt(corpus);
    document.getElementById('sip-r-invested').textContent = fmt(invested);
    document.getElementById('sip-r-returns').textContent = fmt(corpus - invested);
  }

  ['sip-amt', 'sip-rate', 'sip-yrs'].forEach(id => {
    document.getElementById(id).addEventListener('input', calcSIP);
  });
  calcSIP();

}); 
