document.addEventListener('DOMContentLoaded', function () {

  /* ============================================================
     GOOGLE SHEET FORM (SAFE)
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

        msg.innerHTML = "✅ Message sent!";
        form.reset();
        setTimeout(() => msg.innerHTML = "", 4000);

      } catch {
        msg.innerHTML = "❌ Error. Try again.";
      }
    });
  }

  /* ============================================================
     NAVBAR
     ============================================================ */
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      document.body.classList.toggle('no-scroll');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        document.body.classList.remove('no-scroll');
      });
    });

    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        document.body.classList.remove('no-scroll');
      }
    });
  }

  /* ============================================================
     AOS
     ============================================================ */
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 1000, once: true });
  }

  /* ============================================================
     CALCULATORS (SAFE MODE)
     ============================================================ */

  /* ── TAB SWITCHING ── */
  const tabBtns = document.querySelectorAll('.calc-tab-btn');
  const panels = document.querySelectorAll('.calc-panel');

  if (tabBtns.length && panels.length) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');

        tabBtns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');

        const panel = document.getElementById('panel-' + target);
        if (panel) panel.classList.add('active');
      });
    });
  }

  /* ── SIP CALCULATOR ── */
  function calcSIP() {
    const amt = document.getElementById('sip-amt');
    const rate = document.getElementById('sip-rate');
    const yrs = document.getElementById('sip-yrs');

    if (!amt || !rate || !yrs) return;

    const P = +amt.value;
    const r = +rate.value / 100 / 12;
    const n = +yrs.value * 12;

    document.getElementById('sip-amt-val').textContent = '₹' + P.toLocaleString('en-IN');
    document.getElementById('sip-rate-val').textContent = rate.value + '%';
    document.getElementById('sip-yrs-val').textContent = yrs.value + ' yrs';

    const corpus = r === 0 ? P * n : P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const invested = P * n;

    document.getElementById('sip-r-monthly').textContent = '₹' + P.toLocaleString('en-IN');
    document.getElementById('sip-r-invested').textContent = '₹' + Math.round(invested).toLocaleString('en-IN');
    document.getElementById('sip-r-returns').textContent = '₹' + Math.round(corpus - invested).toLocaleString('en-IN');
    document.getElementById('sip-r-corpus').textContent = '₹' + Math.round(corpus).toLocaleString('en-IN');
  }

  ['sip-amt','sip-rate','sip-yrs'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calcSIP);
  });
  calcSIP();

  /* ── RETIREMENT CALCULATOR ── */
  function calcRetirement() {
    const age = document.getElementById('ret-age');
    const retAge = document.getElementById('ret-retage');
    const exp = document.getElementById('ret-exp');
    const inf = document.getElementById('ret-inf');
    const roi = document.getElementById('ret-roi');

    if (!age || !retAge || !exp || !inf || !roi) return;

    const a = +age.value;
    const rA = +retAge.value;
    const e = +exp.value;
    const i = +inf.value / 100;

    document.getElementById('ret-age-val').textContent = a + ' yrs';
    document.getElementById('ret-retage-val').textContent = rA + ' yrs';
    document.getElementById('ret-exp-val').textContent = '₹' + e.toLocaleString('en-IN');
    document.getElementById('ret-inf-val').textContent = inf.value + '%';
    document.getElementById('ret-roi-val').textContent = roi.value + '%';

    const yrs = rA - a;
    const futureExp = e * Math.pow(1 + i, yrs);
    const corpus = futureExp * 12 * 25;

    document.getElementById('ret-r-yrs').textContent = yrs + ' years';
    document.getElementById('ret-r-futexp').textContent = '₹' + Math.round(futureExp).toLocaleString('en-IN');
    document.getElementById('ret-r-corpus').textContent = '₹' + Math.round(corpus).toLocaleString('en-IN');
    document.getElementById('ret-r-sip').textContent =
      '₹' + Math.round(corpus / (yrs * 12)).toLocaleString('en-IN') + '/mo';

    const fill = document.querySelector('.timeline-fill');
    if (fill) fill.style.width = (a / rA * 100) + '%';
  }

  ['ret-age','ret-retage','ret-exp','ret-inf','ret-roi'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calcRetirement);
  });
  calcRetirement();

  /* ── GOAL CALCULATOR ── */
  function calcGoal() {
    const goal = document.getElementById('goal-amt');
    const yrs = document.getElementById('goal-yrs');
    const saved = document.getElementById('goal-saved');
    const rate = document.getElementById('goal-rate');

    if (!goal || !yrs || !saved || !rate) return;

    const g = +goal.value;
    const y = +yrs.value;
    const s = +saved.value;

    document.getElementById('goal-amt-val').textContent = '₹' + g.toLocaleString('en-IN');
    document.getElementById('goal-yrs-val').textContent = y + ' yrs';
    document.getElementById('goal-rate-val').textContent = rate.value + '%';
    document.getElementById('goal-saved-val').textContent = '₹' + s.toLocaleString('en-IN');

    const remaining = g - s;
    const sip = remaining / (y * 12);

    document.getElementById('goal-r-target').textContent = '₹' + g.toLocaleString('en-IN');
    document.getElementById('goal-r-saved').textContent = '₹' + s.toLocaleString('en-IN');
    document.getElementById('goal-r-remaining').textContent = '₹' + remaining.toLocaleString('en-IN');
    document.getElementById('goal-r-sip').textContent =
      '₹' + Math.round(sip).toLocaleString('en-IN') + '/mo';

    const pct = Math.min(100, (s / g) * 100);
    const fill = document.getElementById('goal-progress-fill');
    const label = document.getElementById('goal-coverage-pct');

    if (fill) fill.style.width = pct + '%';
    if (label) label.textContent = Math.round(pct) + '%';
  }

  ['goal-amt','goal-yrs','goal-rate','goal-saved'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calcGoal);
  });
  calcGoal();

});
