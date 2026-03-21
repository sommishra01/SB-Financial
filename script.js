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

// Mobile Menu Toggle (optional if you implement mobile nav)
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});

// AOS Initialization
AOS.init({
  duration: 1000,
  once: true,
});

//mutual fund logo js

window.addEventListener('load', function () {
  var track = document.getElementById('logoTrack');
  if (!track) return;
 
  // Clone all logo items and append — creates seamless infinite loop
  var originals = Array.prototype.slice.call(track.querySelectorAll('.logo-item'));
  originals.forEach(function (item) {
    track.appendChild(item.cloneNode(true));
  });
 
  var pos = 0;
  var speed = 0.4; // px per frame — raise to scroll faster, lower to scroll slower
  var paused = false;
  var halfWidth = 0;
 
  // Small delay to ensure layout is painted before measuring
  setTimeout(function () {
    halfWidth = track.scrollWidth / 2;
  }, 100);
 
  // Recalculate on resize
  window.addEventListener('resize', function () {
    halfWidth = track.scrollWidth / 2;
  });
 
  // Pause on hover, resume on mouse leave
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
