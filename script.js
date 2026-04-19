document.addEventListener('DOMContentLoaded', function () {

  /* ============================================================
     GOOGLE SHEET FORM SUBMISSION (SAFE)
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
     MOBILE NAVBAR
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
     AOS INIT
     ============================================================ */
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 1000, once: true });
  }

  /* ============================================================
     LOGO TICKER
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
     CALCULATORS (ONLY RUN ON CALCULATOR PAGE)
     ============================================================ */
  if (!document.getElementById('panel-sip')) return;

  /* ── TAB SWITCHING ── */
  const tabBtns = document.querySelectorAll('.calc-tab-btn');
  const panels = document.querySelectorAll('.calc-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById('panel-' + target).classList.add('active');
    });
  });

  /* ── SIP CALCULATOR ── */
  function calcSIP() {
    const P = +document.getElementById('sip-amt').value;
    const r = +document.getElementById('sip-rate').value / 100 / 12;
    const n = +document.getElementById('sip-yrs').value * 12;

    document.getElementById('sip-amt-val').textContent = '₹' + P.toLocaleString('en-IN');
    document.getElementById('sip-rate-val').textContent = document.getElementById('sip-rate').value + '%';
    document.getElementById('sip-yrs-val').textContent = document.getElementById('sip-yrs').value + ' yrs';

    const corpus = r === 0 ? P * n : P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const invested = P * n;

    document.getElementById('sip-r-monthly').textContent = '₹' + P.toLocaleString('en-IN');
    document.getElementById('sip-r-invested').textContent = '₹' + Math.round(invested).toLocaleString('en-IN');
    document.getElementById('sip-r-returns').textContent = '₹' + Math.round(corpus - invested).toLocaleString('en-IN');
    document.getElementById('sip-r-corpus').textContent = '₹' + Math.round(corpus).toLocaleString('en-IN');
  }

  ['sip-amt','sip-rate','sip-yrs'].forEach(id => {
    document.getElementById(id).addEventListener('input', calcSIP);
  });
  calcSIP();

  /* ── RETIREMENT CALCULATOR ── */
  function calcRetirement() {
    const age = +document.getElementById('ret-age').value;
    const retAge = +document.getElementById('ret-retage').value;
    const exp = +document.getElementById('ret-exp').value;
    const inf = +document.getElementById('ret-inf').value / 100;

    document.getElementById('ret-age-val').textContent = age + ' yrs';
    document.getElementById('ret-retage-val').textContent = retAge + ' yrs';
    document.getElementById('ret-exp-val').textContent = '₹' + exp.toLocaleString('en-IN');
    document.getElementById('ret-inf-val').textContent = document.getElementById('ret-inf').value + '%';
    document.getElementById('ret-roi-val').textContent = document.getElementById('ret-roi').value + '%';

    const yrs = retAge - age;
    const futureExp = exp * Math.pow(1 + inf, yrs);
    const corpus = futureExp * 12 * 25;

    document.getElementById('ret-r-yrs').textContent = yrs + ' years';
    document.getElementById('ret-r-futexp').textContent = '₹' + Math.round(futureExp).toLocaleString('en-IN');
    document.getElementById('ret-r-corpus').textContent = '₹' + Math.round(corpus).toLocaleString('en-IN');
    document.getElementById('ret-r-sip').textContent = '₹' + Math.round(corpus / (yrs * 12)).toLocaleString('en-IN') + '/mo';

    document.querySelector('.timeline-fill').style.width = (age / retAge * 100) + '%';
  }

  ['ret-age','ret-retage','ret-exp','ret-inf','ret-roi'].forEach(id => {
    document.getElementById(id).addEventListener('input', calcRetirement);
  });
  calcRetirement();

  /* ── GOAL CALCULATOR ── */
  function calcGoal() {
    const goal = +document.getElementById('goal-amt').value;
    const yrs = +document.getElementById('goal-yrs').value;
    const saved = +document.getElementById('goal-saved').value;

    document.getElementById('goal-amt-val').textContent = '₹' + goal.toLocaleString('en-IN');
    document.getElementById('goal-yrs-val').textContent = yrs + ' yrs';
    document.getElementById('goal-rate-val').textContent = document.getElementById('goal-rate').value + '%';
    document.getElementById('goal-saved-val').textContent = '₹' + saved.toLocaleString('en-IN');

    const remaining = goal - saved;
    const sip = remaining / (yrs * 12);

    document.getElementById('goal-r-target').textContent = '₹' + goal.toLocaleString('en-IN');
    document.getElementById('goal-r-saved').textContent = '₹' + saved.toLocaleString('en-IN');
    document.getElementById('goal-r-remaining').textContent = '₹' + remaining.toLocaleString('en-IN');
    document.getElementById('goal-r-sip').textContent = '₹' + Math.round(sip).toLocaleString('en-IN') + '/mo';

    const pct = Math.min(100, (saved / goal) * 100);
    document.getElementById('goal-progress-fill').style.width = pct + '%';
    document.getElementById('goal-coverage-pct').textContent = Math.round(pct) + '%';
  }

  ['goal-amt','goal-yrs','goal-rate','goal-saved'].forEach(id => {
    document.getElementById(id).addEventListener('input', calcGoal);
  });
  calcGoal();

});
