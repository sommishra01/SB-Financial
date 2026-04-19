document.addEventListener('DOMContentLoaded', function () {

  /* ============================================================
     GOOGLE SHEET FORM SUBMISSION
     ============================================================ */
  const scriptURL = 'https://script.google.com/macros/s/AKfycbwEhzWuuHaiInoH6E2NXTUzvqYo4zqMzm0BI1pJ_ghIMpU5Q1By7o-XrgTtNQlbtcayDw/exec';

  const form = document.forms['submit-to-google-sheet'];
  const msg = document.getElementById('msg');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (msg) msg.innerHTML = "Sending...";

      try {
        const phoneField = document.querySelector("#fullphone");
        if (phoneField && typeof phoneInput !== 'undefined') {
          phoneField.value = phoneInput.getNumber();
        }

        await fetch(scriptURL, {
          method: 'POST',
          body: new FormData(form)
        });

        if (msg) msg.innerHTML = "✅ Message sent successfully!";
        form.reset();

        setTimeout(() => {
          if (msg) msg.innerHTML = "";
        }, 4000);

      } catch (error) {
        if (msg) msg.innerHTML = "❌ Something went wrong. Try again.";
      }
    });
  }

  /* ============================================================
     MOBILE NAV TOGGLE
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
     VANTA HERO BACKGROUND
     ============================================================ */
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

  /* ============================================================
     AOS ANIMATION
     ============================================================ */
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 1000, once: true });
  }

  /* ============================================================
     LOGO TICKER (HOME PAGE)
     ============================================================ */
  const track = document.getElementById('logoTrack');

  if (track) {
    const items = [...track.children];

    items.forEach(item => {
      track.appendChild(item.cloneNode(true));
    });

    let pos = 0;
    const speed = 0.4;
    let paused = false;

    track.addEventListener('mouseenter', () => paused = true);
    track.addEventListener('mouseleave', () => paused = false);

    function animateTicker() {
      if (!paused) {
        pos += speed;
        if (pos >= track.scrollWidth / 2) pos = 0;
        track.style.transform = `translateX(-${pos}px)`;
      }
      requestAnimationFrame(animateTicker);
    }

    animateTicker();
  }

  /* ============================================================
     CALCULATORS PAGE LOGIC
     ============================================================ */
  if (document.getElementById('panel-sip')) {

    /* ===== Utility Functions ===== */
    function fmt(n) {
      if (n >= 1e7) return '₹' + (n / 1e7).toFixed(2) + ' Cr';
      if (n >= 1e5) return '₹' + (n / 1e5).toFixed(2) + ' L';
      return '₹' + Math.round(n).toLocaleString('en-IN');
    }

    function fmtPlain(n) {
      return '₹' + Math.round(n).toLocaleString('en-IN');
    }

    function syncSlider(el) {
      const min = +el.min;
      const max = +el.max;
      const val = +el.value;
      const pct = ((val - min) / (max - min)) * 100;
      el.style.setProperty('--pct', pct + '%');
    }

    document.querySelectorAll('input[type="range"]').forEach(el => {
      syncSlider(el);
      el.addEventListener('input', () => syncSlider(el));
    });

    /* ===== SIP Calculator ===== */
    function calcSIP() {
      const P = +document.getElementById('sip-amt').value;
      const r = +document.getElementById('sip-rate').value / 100 / 12;
      const n = +document.getElementById('sip-yrs').value * 12;

      document.getElementById('sip-amt-val').textContent = fmtPlain(P);
      document.getElementById('sip-rate-val').textContent = document.getElementById('sip-rate').value + '%';
      document.getElementById('sip-yrs-val').textContent = document.getElementById('sip-yrs').value + ' yrs';

      const corpus = r === 0 ? P * n : P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      const invested = P * n;

      document.getElementById('sip-r-monthly').textContent = fmtPlain(P);
      document.getElementById('sip-r-invested').textContent = fmt(invested);
      document.getElementById('sip-r-returns').textContent = fmt(corpus - invested);
      document.getElementById('sip-r-corpus').textContent = fmt(corpus);
    // ===== DONUT CHART UPDATE =====
const returns = corpus - invested;
const circumference = 2 * Math.PI * 38;

const investedPct = invested / corpus;
const returnsPct = returns / corpus;

// Invested arc
const investedOffset = circumference * (1 - investedPct);
const investedArc = document.getElementById("sip-arc-invested");

investedArc.style.strokeDasharray = circumference;
investedArc.style.strokeDashoffset = investedOffset;

// Returns arc
const returnsOffset = circumference * (1 - returnsPct);
const returnsArc = document.getElementById("sip-arc-returns");

returnsArc.style.strokeDasharray = circumference;
returnsArc.style.strokeDashoffset = returnsOffset;

// Rotate returns arc to start after invested
returnsArc.style.transform = `rotate(${investedPct * 360}deg)`;
returnsArc.style.transformOrigin = "50% 50%";

// Center % text
document.getElementById("sip-returns-pct").innerText =
  Math.round(returnsPct * 100) + "%";
    
    }

    ['sip-amt','sip-rate','sip-yrs'].forEach(id => {
      document.getElementById(id).addEventListener('input', calcSIP);
    });

    calcSIP();

    /* ===== Tab Switching ===== */
    document.querySelectorAll('.calc-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.calc-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.calc-panel').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
      });
    });

    /* ===== Retirement Calculator ===== */
    function calcRetirement() {
      const age = +document.getElementById('ret-age').value;
      const retAge = +document.getElementById('ret-retage').value;
      const exp = +document.getElementById('ret-exp').value;
      const inf = +document.getElementById('ret-inf').value / 100;
      const roi = +document.getElementById('ret-roi').value / 100;

      document.getElementById('ret-age-val').textContent = age + ' yrs';
      document.getElementById('ret-retage-val').textContent = retAge + ' yrs';
      document.getElementById('ret-exp-val').textContent = fmtPlain(exp);
      document.getElementById('ret-inf-val').textContent = document.getElementById('ret-inf').value + '%';
      document.getElementById('ret-roi-val').textContent = document.getElementById('ret-roi').value + '%';

      const yrs = Math.max(retAge - age, 1);
      const futureExp = exp * Math.pow(1 + inf, yrs);
      const realReturn = roi - inf;

      const corpus = realReturn > 0.001
        ? (futureExp * 12) / realReturn
        : futureExp * 12 * 25;

      const r = roi / 12;
      const n = yrs * 12;

      const sip = r === 0 ? corpus / n
        : corpus * r / ((Math.pow(1 + r, n) - 1) * (1 + r));

      document.getElementById('ret-r-yrs').textContent = yrs + ' years';
      document.getElementById('ret-r-futexp').textContent = fmt(futureExp);
      document.getElementById('ret-r-corpus').textContent = fmt(corpus);
      document.getElementById('ret-r-sip').textContent = fmt(sip) + '/mo';

      document.getElementById('ret-r-curage').textContent = age;
      document.getElementById('ret-r-retage').textContent = retAge;

      const fill = document.querySelector('.timeline-fill');
      if (fill) fill.style.width = Math.min(100, (age / retAge) * 100) + '%';
    }

    ['ret-age','ret-retage','ret-exp','ret-inf','ret-roi'].forEach(id => {
      document.getElementById(id).addEventListener('input', calcRetirement);
    });

    calcRetirement();

    /* ===== Goal Calculator ===== */
    function calcGoal() {
      const goal = +document.getElementById('goal-amt').value;
      const yrs = +document.getElementById('goal-yrs').value;
      const rate = +document.getElementById('goal-rate').value / 100;
      const saved = +document.getElementById('goal-saved').value;

      document.getElementById('goal-amt-val').textContent = fmt(goal);
      document.getElementById('goal-yrs-val').textContent = yrs + ' yrs';
      document.getElementById('goal-rate-val').textContent = document.getElementById('goal-rate').value + '%';
      document.getElementById('goal-saved-val').textContent = fmt(saved);

      const fvSaved = saved * Math.pow(1 + rate, yrs);
      const remaining = Math.max(goal - fvSaved, 0);

      const r = rate / 12;
      const n = yrs * 12;

      const sip = remaining <= 0 ? 0 :
        (r === 0 ? remaining / n :
          remaining * r / ((Math.pow(1 + r, n) - 1) * (1 + r)));

      document.getElementById('goal-r-target').textContent = fmt(goal);
      document.getElementById('goal-r-saved').textContent = fmt(fvSaved);
      document.getElementById('goal-r-remaining').textContent = fmt(remaining);
      document.getElementById('goal-r-sip').textContent = fmt(sip) + '/mo';

      const pct = Math.min(100, (fvSaved / goal) * 100);
      document.getElementById('goal-progress-fill').style.width = pct + '%';
      document.getElementById('goal-coverage-pct').textContent = Math.round(pct) + '%';
    }

    ['goal-amt','goal-yrs','goal-rate','goal-saved'].forEach(id => {
      document.getElementById(id).addEventListener('input', calcGoal);
    });

    calcGoal();

    /* ===== Goal Presets ===== */
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('goal-amt').value = btn.dataset.amt;
        document.getElementById('goal-yrs').value = btn.dataset.yrs;

        syncSlider(document.getElementById('goal-amt'));
        syncSlider(document.getElementById('goal-yrs'));

        calcGoal();
      });
    });

  }

});
