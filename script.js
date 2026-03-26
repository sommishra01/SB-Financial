/* ============================================================
   GOOGLE SHEET FORM SUBMISSION
   ============================================================ */
const scriptURL = 'https://script.google.com/macros/s/AKfycbwEhzWuuHaiInoH6E2NXTUzvqYo4zqMzm0BI1pJ_ghIMpU5Q1By7o-XrgTtNQlbtcayDw/exec';
const form = document.forms['submit-to-google-sheet'];
const msg = document.getElementById("msg");

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
      .then(response => {
        msg.innerHTML = "Message sent successfully!";
        setTimeout(() => (msg.innerHTML = ""), 5000);
        form.reset();
      })
      .catch(error => {
        msg.innerHTML = "Something went wrong. Please try again.";
      });
  });
}

/* ============================================================
   MOBILE NAV TOGGLE
   ============================================================ */
const menuToggle = document.querySelector(".menu-toggle");
const navLinks   = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    if (navLinks) navLinks.classList.remove("open");
  });
});

/* ============================================================
   AOS INITIALIZATION
   ============================================================ */
if (typeof AOS !== 'undefined') {
  AOS.init({
    duration: 1000,
    once: true,
  });
}

/* ============================================================
   MUTUAL FUND LOGO TICKER
   ============================================================ */
window.addEventListener('load', function () {
  var track = document.getElementById('logoTrack');
  if (!track) return;

  var originals = Array.prototype.slice.call(track.querySelectorAll('.logo-item'));
  originals.forEach(function (item) {
    track.appendChild(item.cloneNode(true));
  });

  var pos = 0;
  var speed = 0.4;
  var paused = false;
  var halfWidth = 0;

  setTimeout(function () {
    halfWidth = track.scrollWidth / 2;
  }, 100);

  window.addEventListener('resize', function () {
    halfWidth = track.scrollWidth / 2;
  });

  track.addEventListener('mouseenter', function () { paused = true; });
  track.addEventListener('mouseleave', function () { paused = false; });

  function tick() {
    if (!paused && halfWidth > 0) {
      pos += speed;
      if (pos >= halfWidth) pos = 0;
      track.style.transform = 'translateX(-' + pos + 'px)';
    }
    requestAnimationFrame(tick);
  }

  tick();
});

/* ============================================================
   CALCULATORS PAGE
   Only runs if calculator elements exist on the page.
   ============================================================ */
(function () {

  /* ── Guard: exit immediately if not on calculators page ── */
  if (!document.getElementById('panel-sip')) return;

  /* ── Vanta Hero Background ── */
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

  /* ── Utilities ── */
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

  /* Sync all sliders on load */
  document.querySelectorAll('input[type="range"]').forEach(el => {
    syncSlider(el);
    el.addEventListener('input', () => syncSlider(el));
  });

  /* ── Tab Switching ── */
  const tabBtns = document.querySelectorAll('.calc-tab-btn');
  const panels  = document.querySelectorAll('.calc-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p  => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('panel-' + target).classList.add('active');
    });
  });

  /* ── Donut Chart Helper ── */
  const CIRC = 238.76;

  function updateDonut(investedId, returnsId, pctLabelId, invested, corpus) {
    const returns      = corpus - invested;
    const investedFrac = Math.max(0, Math.min(1, invested / corpus));
    const returnsFrac  = Math.max(0, Math.min(1, returns  / corpus));

    const arcInvested = document.getElementById(investedId);
    const arcReturns  = document.getElementById(returnsId);
    const pctLabel    = document.getElementById(pctLabelId);

    if (!arcInvested || !arcReturns || !pctLabel) return;

    arcInvested.setAttribute('stroke-dasharray',  `${investedFrac * CIRC} ${CIRC}`);
    arcInvested.setAttribute('stroke-dashoffset', '0');

    arcReturns.setAttribute('stroke-dasharray',  `${returnsFrac * CIRC} ${CIRC}`);
    arcReturns.setAttribute('stroke-dashoffset', `-${investedFrac * CIRC}`);

    pctLabel.textContent = Math.round(returnsFrac * 100) + '%';
  }

  /* ── SIP Calculator ── */
  function calcSIP() {
    const P = parseFloat(document.getElementById('sip-amt').value);
    const r = parseFloat(document.getElementById('sip-rate').value) / 100 / 12;
    const n = parseFloat(document.getElementById('sip-yrs').value) * 12;

    document.getElementById('sip-amt-val').textContent  = fmtPlain(P);
    document.getElementById('sip-rate-val').textContent = document.getElementById('sip-rate').value + '%';
    document.getElementById('sip-yrs-val').textContent  = document.getElementById('sip-yrs').value  + ' yrs';

    const corpus   = r === 0 ? P * n : P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const invested = P * n;
    const returns  = corpus - invested;

    document.getElementById('sip-r-monthly').textContent  = fmtPlain(P);
    document.getElementById('sip-r-invested').textContent = fmt(invested);
    document.getElementById('sip-r-returns').textContent  = fmt(returns);
    document.getElementById('sip-r-corpus').textContent   = fmt(corpus);

    updateDonut('sip-arc-invested', 'sip-arc-returns', 'sip-returns-pct', invested, corpus);
  }

  ['sip-amt', 'sip-rate', 'sip-yrs'].forEach(id => {
    document.getElementById(id).addEventListener('input', calcSIP);
  });
  calcSIP();

  /* ── Retirement Calculator ── */
  function calcRetirement() {
    const age    = parseFloat(document.getElementById('ret-age').value);
    const retAge = parseFloat(document.getElementById('ret-retage').value);
    const exp    = parseFloat(document.getElementById('ret-exp').value);
    const inf    = parseFloat(document.getElementById('ret-inf').value) / 100;
    const roi    = parseFloat(document.getElementById('ret-roi').value) / 100;

    document.getElementById('ret-age-val').textContent    = age    + ' yrs';
    document.getElementById('ret-retage-val').textContent = retAge + ' yrs';
    document.getElementById('ret-exp-val').textContent    = fmtPlain(exp);
    document.getElementById('ret-inf-val').textContent    = document.getElementById('ret-inf').value + '%';
    document.getElementById('ret-roi-val').textContent    = document.getElementById('ret-roi').value + '%';

    const yrsToRet      = Math.max(retAge - age, 1);
    const futMonthlyExp = exp * Math.pow(1 + inf, yrsToRet);
    const realReturn    = roi - inf;
    const corpus        = realReturn > 0.001
      ? (futMonthlyExp * 12) / realReturn
      : futMonthlyExp * 12 * 25;

    const r   = roi / 12;
    const n   = yrsToRet * 12;
    const sip = r === 0 ? corpus / n
      : corpus * r / ((Math.pow(1 + r, n) - 1) * (1 + r));

    document.getElementById('ret-r-yrs').textContent    = yrsToRet + ' years';
    document.getElementById('ret-r-futexp').textContent = fmt(futMonthlyExp);
    document.getElementById('ret-r-corpus').textContent = fmt(corpus);
    document.getElementById('ret-r-sip').textContent    = fmt(sip) + '/mo';
    document.getElementById('ret-r-curage').textContent = age;
    document.getElementById('ret-r-retage').textContent = retAge;

    const fill = document.querySelector('.timeline-fill');
    if (fill) {
      const pct = Math.min(100, Math.round((age / retAge) * 100));
      fill.style.width = pct + '%';
    }
  }

  ['ret-age', 'ret-retage', 'ret-exp', 'ret-inf', 'ret-roi'].forEach(id => {
    document.getElementById(id).addEventListener('input', calcRetirement);
  });
  calcRetirement();

  /* ── Goal Planning Calculator ── */
  function calcGoal() {
    const goal  = parseFloat(document.getElementById('goal-amt').value);
    const yrs   = parseFloat(document.getElementById('goal-yrs').value);
    const rate  = parseFloat(document.getElementById('goal-rate').value) / 100;
    const saved = parseFloat(document.getElementById('goal-saved').value);

    document.getElementById('goal-amt-val').textContent   = fmt(goal);
    document.getElementById('goal-yrs-val').textContent   = yrs + ' yrs';
    document.getElementById('goal-rate-val').textContent  = document.getElementById('goal-rate').value + '%';
    document.getElementById('goal-saved-val').textContent = fmt(saved);

    const n      = yrs * 12;
    const r      = rate / 12;
    const fvSaved   = saved > 0 ? saved * Math.pow(1 + rate, yrs) : 0;
    const remaining = Math.max(goal - fvSaved, 0);
    const sip       = remaining <= 0 ? 0
      : (r === 0 ? remaining / n
        : remaining * r / ((Math.pow(1 + r, n) - 1) * (1 + r)));

    document.getElementById('goal-r-target').textContent    = fmt(goal);
    document.getElementById('goal-r-saved').textContent     = fmt(fvSaved);
    document.getElementById('goal-r-remaining').textContent = fmt(remaining);
    document.getElementById('goal-r-sip').textContent       = fmt(sip) + '/mo';

    const coveragePct = Math.min(100, Math.round((fvSaved / goal) * 100));
    const fillEl      = document.getElementById('goal-progress-fill');
    const pctLabel    = document.getElementById('goal-coverage-pct');
    if (fillEl)   fillEl.style.width   = coveragePct + '%';
    if (pctLabel) pctLabel.textContent = coveragePct + '%';
  }

  ['goal-amt', 'goal-yrs', 'goal-rate', 'goal-saved'].forEach(id => {
    document.getElementById(id).addEventListener('input', calcGoal);
  });
  calcGoal();

  /* ── Goal Presets ── */
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const amtSlider = document.getElementById('goal-amt');
      const yrsSlider = document.getElementById('goal-yrs');
      amtSlider.value = btn.dataset.amt;
      yrsSlider.value = btn.dataset.yrs;
      syncSlider(amtSlider);
      syncSlider(yrsSlider);
      calcGoal();
    });
  });

})(); /* end calculator IIFE */
