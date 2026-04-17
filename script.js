document.addEventListener('DOMContentLoaded', function () {

  /* ============================================================
     GOOGLE SHEET FORM SUBMISSION
     ============================================================ */
  var scriptURL = 'https://script.google.com/macros/s/AKfycbwEhzWuuHaiInoH6E2NXTUzvqYo4zqMzm0BI1pJ_ghIMpU5Q1By7o-XrgTtNQlbtcayDw/exec';
  var form = document.forms['submit-to-google-sheet'];
  var msg  = document.getElementById('msg');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then(function () {
          msg.innerHTML = 'Message sent successfully!';
          setTimeout(function () { msg.innerHTML = ''; }, 5000);
          form.reset();
        })
        .catch(function () {
          msg.innerHTML = 'Something went wrong. Please try again.';
        });
    });
  }
const form = document.forms['submit-to-google-sheet'];
const msg = document.getElementById("msg");
const phoneField = document.querySelector("#fullphone");

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  msg.innerHTML = "Sending...";

  try {
    phoneField.value = phoneInput.getNumber();

    const response = await fetch('https://script.google.com/macros/s/AKfycbwEhzWuuHaiInoH6E2NXTUzvqYo4zqMzm0BI1pJ_ghIMpU5Q1By7o-XrgTtNQlbtcayDw/exec', {
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

  /* ============================================================
     MOBILE NAV TOGGLE
     ============================================================ */
  var menuToggle = document.querySelector('.menu-toggle');
  var navLinks   = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
  }

  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (navLinks) navLinks.classList.remove('open');
    });
  });

  /* ============================================================
     AOS INITIALIZATION
     ============================================================ */
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 1000, once: true });
  }

  /* ============================================================
     MUTUAL FUND LOGO TICKER
     ============================================================ */
  var track = document.getElementById('logoTrack');
  if (track) {
    var originals = Array.prototype.slice.call(track.querySelectorAll('.logo-item'));
    originals.forEach(function (item) {
      track.appendChild(item.cloneNode(true));
    });

    var pos       = 0;
    var speed     = 0.4;
    var paused    = false;
    var halfWidth = 0;

    setTimeout(function () { halfWidth = track.scrollWidth / 2; }, 100);
    window.addEventListener('resize', function () { halfWidth = track.scrollWidth / 2; });

    track.addEventListener('mouseenter', function () { paused = true;  });
    track.addEventListener('mouseleave', function () { paused = false; });

    (function tick() {
      if (!paused && halfWidth > 0) {
        pos += speed;
        if (pos >= halfWidth) pos = 0;
        track.style.transform = 'translateX(-' + pos + 'px)';
      }
      requestAnimationFrame(tick);
    })();
  }

  /* ============================================================
     CALCULATORS PAGE
     Guard: only runs if the calculator panels exist on this page
     ============================================================ */
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

  /* ── Utility: Indian currency format ── */
  function fmt(n) {
    if (n >= 1e7) return '₹' + (n / 1e7).toFixed(2) + ' Cr';
    if (n >= 1e5) return '₹' + (n / 1e5).toFixed(2) + ' L';
    return '₹' + Math.round(n).toLocaleString('en-IN');
  }

  function fmtPlain(n) {
    return '₹' + Math.round(n).toLocaleString('en-IN');
  }

  /* ── Utility: sync slider fill colour ── */
  function syncSlider(el) {
    var min = parseFloat(el.min);
    var max = parseFloat(el.max);
    var val = parseFloat(el.value);
    var pct = ((val - min) / (max - min) * 100).toFixed(1) + '%';
    el.style.setProperty('--pct', pct);
  }

  document.querySelectorAll('input[type="range"]').forEach(function (el) {
    syncSlider(el);
    el.addEventListener('input', function () { syncSlider(el); });
  });

  /* ── Tab switching ── */
  var tabBtns = document.querySelectorAll('.calc-tab-btn');
  var panels  = document.querySelectorAll('.calc-panel');

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = btn.getAttribute('data-tab');
      tabBtns.forEach(function (b) { b.classList.remove('active'); });
      panels.forEach(function  (p) { p.classList.remove('active'); });
      btn.classList.add('active');
      document.getElementById('panel-' + target).classList.add('active');
    });
  });

  /* ── Donut chart ── */
  var CIRC = 238.76;

  function updateDonut(investedId, returnsId, pctLabelId, invested, corpus) {
    var returns      = corpus - invested;
    var investedFrac = Math.max(0, Math.min(1, invested / corpus));
    var returnsFrac  = Math.max(0, Math.min(1, returns  / corpus));

    var arcInvested = document.getElementById(investedId);
    var arcReturns  = document.getElementById(returnsId);
    var pctLabel    = document.getElementById(pctLabelId);

    if (!arcInvested || !arcReturns || !pctLabel) return;

    arcInvested.setAttribute('stroke-dasharray',  (investedFrac * CIRC) + ' ' + CIRC);
    arcInvested.setAttribute('stroke-dashoffset', '0');
    arcReturns.setAttribute('stroke-dasharray',   (returnsFrac  * CIRC) + ' ' + CIRC);
    arcReturns.setAttribute('stroke-dashoffset',  '-' + (investedFrac * CIRC));
    pctLabel.textContent = Math.round(returnsFrac * 100) + '%';
  }

  /* ── SIP Calculator ── */
  function calcSIP() {
    var P = parseFloat(document.getElementById('sip-amt').value);
    var r = parseFloat(document.getElementById('sip-rate').value) / 100 / 12;
    var n = parseFloat(document.getElementById('sip-yrs').value) * 12;

    document.getElementById('sip-amt-val').textContent  = fmtPlain(P);
    document.getElementById('sip-rate-val').textContent = document.getElementById('sip-rate').value + '%';
    document.getElementById('sip-yrs-val').textContent  = document.getElementById('sip-yrs').value  + ' yrs';

    var corpus   = r === 0 ? P * n : P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    var invested = P * n;

    document.getElementById('sip-r-monthly').textContent  = fmtPlain(P);
    document.getElementById('sip-r-invested').textContent = fmt(invested);
    document.getElementById('sip-r-returns').textContent  = fmt(corpus - invested);
    document.getElementById('sip-r-corpus').textContent   = fmt(corpus);

    updateDonut('sip-arc-invested', 'sip-arc-returns', 'sip-returns-pct', invested, corpus);
  }

  ['sip-amt', 'sip-rate', 'sip-yrs'].forEach(function (id) {
    document.getElementById(id).addEventListener('input', calcSIP);
  });
  calcSIP();

  /* ── Retirement Calculator ── */
  function calcRetirement() {
    var age    = parseFloat(document.getElementById('ret-age').value);
    var retAge = parseFloat(document.getElementById('ret-retage').value);
    var exp    = parseFloat(document.getElementById('ret-exp').value);
    var inf    = parseFloat(document.getElementById('ret-inf').value) / 100;
    var roi    = parseFloat(document.getElementById('ret-roi').value) / 100;

    document.getElementById('ret-age-val').textContent    = age    + ' yrs';
    document.getElementById('ret-retage-val').textContent = retAge + ' yrs';
    document.getElementById('ret-exp-val').textContent    = fmtPlain(exp);
    document.getElementById('ret-inf-val').textContent    = document.getElementById('ret-inf').value + '%';
    document.getElementById('ret-roi-val').textContent    = document.getElementById('ret-roi').value + '%';

    var yrsToRet      = Math.max(retAge - age, 1);
    var futMonthlyExp = exp * Math.pow(1 + inf, yrsToRet);
    var realReturn    = roi - inf;
    var corpus        = realReturn > 0.001
      ? (futMonthlyExp * 12) / realReturn
      : futMonthlyExp * 12 * 25;

    var r   = roi / 12;
    var n   = yrsToRet * 12;
    var sip = r === 0 ? corpus / n
      : corpus * r / ((Math.pow(1 + r, n) - 1) * (1 + r));

    document.getElementById('ret-r-yrs').textContent    = yrsToRet + ' years';
    document.getElementById('ret-r-futexp').textContent = fmt(futMonthlyExp);
    document.getElementById('ret-r-corpus').textContent = fmt(corpus);
    document.getElementById('ret-r-sip').textContent    = fmt(sip) + '/mo';
    document.getElementById('ret-r-curage').textContent = age;
    document.getElementById('ret-r-retage').textContent = retAge;

    var fill = document.querySelector('.timeline-fill');
    if (fill) fill.style.width = Math.min(100, Math.round((age / retAge) * 100)) + '%';
  }

  ['ret-age', 'ret-retage', 'ret-exp', 'ret-inf', 'ret-roi'].forEach(function (id) {
    document.getElementById(id).addEventListener('input', calcRetirement);
  });
  calcRetirement();

  /* ── Goal Planning Calculator ── */
  function calcGoal() {
    var goal  = parseFloat(document.getElementById('goal-amt').value);
    var yrs   = parseFloat(document.getElementById('goal-yrs').value);
    var rate  = parseFloat(document.getElementById('goal-rate').value) / 100;
    var saved = parseFloat(document.getElementById('goal-saved').value);

    document.getElementById('goal-amt-val').textContent   = fmt(goal);
    document.getElementById('goal-yrs-val').textContent   = yrs + ' yrs';
    document.getElementById('goal-rate-val').textContent  = document.getElementById('goal-rate').value + '%';
    document.getElementById('goal-saved-val').textContent = fmt(saved);

    var n         = yrs * 12;
    var r         = rate / 12;
    var fvSaved   = saved > 0 ? saved * Math.pow(1 + rate, yrs) : 0;
    var remaining = Math.max(goal - fvSaved, 0);
    var sip       = remaining <= 0 ? 0
      : (r === 0 ? remaining / n
        : remaining * r / ((Math.pow(1 + r, n) - 1) * (1 + r)));

    document.getElementById('goal-r-target').textContent    = fmt(goal);
    document.getElementById('goal-r-saved').textContent     = fmt(fvSaved);
    document.getElementById('goal-r-remaining').textContent = fmt(remaining);
    document.getElementById('goal-r-sip').textContent       = fmt(sip) + '/mo';

    var coveragePct = Math.min(100, Math.round((fvSaved / goal) * 100));
    var fillEl      = document.getElementById('goal-progress-fill');
    var pctLabel    = document.getElementById('goal-coverage-pct');
    if (fillEl)   fillEl.style.width   = coveragePct + '%';
    if (pctLabel) pctLabel.textContent = coveragePct + '%';
  }

  ['goal-amt', 'goal-yrs', 'goal-rate', 'goal-saved'].forEach(function (id) {
    document.getElementById(id).addEventListener('input', calcGoal);
  });
  calcGoal();

  /* ── Goal Presets ── */
  document.querySelectorAll('.preset-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var amtSlider = document.getElementById('goal-amt');
      var yrsSlider = document.getElementById('goal-yrs');
      amtSlider.value = btn.getAttribute('data-amt');
      yrsSlider.value = btn.getAttribute('data-yrs');
      syncSlider(amtSlider);
      syncSlider(yrsSlider);
      calcGoal();
    });
  });

}); /* end DOMContentLoaded */
