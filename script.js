/* ═══════════════════════════════════════════
   AHMED PORTFOLIO — script.js
   Full Stack Developer & Mobile Apps
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. CUSTOM CURSOR ── */
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursorTrail');
  let mx = 0, my = 0, tx = 0, ty = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  // Smooth trail
  (function animTrail() {
    tx += (mx - tx) * 0.12;
    ty += (my - ty) * 0.12;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(animTrail);
  })();

  // Hover effect on links / buttons
  const hoverEls = document.querySelectorAll('a, button, .ti-icon, .proj-card, .srv-card, .cc');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  /* ── 2. NOISE CANVAS ── */
  const canvas = document.getElementById('noiseCanvas');
  const ctx    = canvas.getContext('2d');
  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function drawNoise() {
    const img = ctx.createImageData(canvas.width, canvas.height);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = img.data[i+1] = img.data[i+2] = v;
      img.data[i+3] = 18;
    }
    ctx.putImageData(img, 0, 0);
    requestAnimationFrame(drawNoise);
  }
  drawNoise();

  /* ── 3. HERO PARTICLES ── */
  const pContainer = document.getElementById('particles');
  const PARTICLE_COUNT = 50;
  const particles = [];

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = Math.random() * window.innerWidth;
      this.y = init ? Math.random() * window.innerHeight : window.innerHeight + 10;
      this.size = Math.random() * 1.5 + 0.5;
      this.speed = Math.random() * 0.4 + 0.15;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.6 ? '#00e5ff' : Math.random() > 0.5 ? '#7b2fff' : '#00e676';
      this.el = document.createElement('div');
      this.el.style.cssText = `
        position:absolute; border-radius:50%; pointer-events:none;
        width:${this.size * 2}px; height:${this.size * 2}px;
        background:${this.color}; opacity:${this.opacity};
      `;
      pContainer.appendChild(this.el);
    }
    update() {
      this.y -= this.speed;
      this.x += Math.sin(this.y * 0.01) * 0.3;
      if (this.y < -10) { this.el.remove(); this.reset(); pContainer.appendChild(this.el); }
      this.el.style.left = this.x + 'px';
      this.el.style.top  = this.y + 'px';
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
  (function animParticles() {
    particles.forEach(p => p.update());
    requestAnimationFrame(animParticles);
  })();

  /* ── 4. TYPED TEXT ── */
  const typedEl = document.getElementById('typed');
  const phrases = [
    'Full Stack Developer',
    'Mobile App Developer',
    'React & Next.js Dev',
    'Flutter Developer',
    'Node.js & Laravel Dev',
  ];
  let pIndex = 0, cIndex = 0, deleting = false;

  function typeLoop() {
    const current = phrases[pIndex];
    if (!deleting) {
      typedEl.textContent = current.slice(0, cIndex + 1);
      cIndex++;
      if (cIndex === current.length) {
        setTimeout(() => { deleting = true; typeLoop(); }, 2200);
        return;
      }
      setTimeout(typeLoop, 65);
    } else {
      typedEl.textContent = current.slice(0, cIndex - 1);
      cIndex--;
      if (cIndex === 0) {
        deleting = false;
        pIndex = (pIndex + 1) % phrases.length;
        setTimeout(typeLoop, 300);
        return;
      }
      setTimeout(typeLoop, 35);
    }
  }
  typeLoop();

  /* ── 5. NAV SCROLL & ACTIVE LINKS ── */
  const nav = document.getElementById('nav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nl');

  function updateNav() {
    // Shrink nav
    nav.classList.toggle('shrink', window.scrollY > 50);

    // Active link
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ── 6. MOBILE DRAWER ── */
  const burger         = document.getElementById('burger');
  const drawer         = document.getElementById('drawer');
  const drawerOverlay  = document.getElementById('drawerOverlay');
  const drawerClose    = document.getElementById('drawerClose');

  function openDrawer()  { drawer.classList.add('open'); drawerOverlay.classList.add('show'); document.body.style.overflow = 'hidden'; }
  function closeDrawer() { drawer.classList.remove('open'); drawerOverlay.classList.remove('show'); document.body.style.overflow = ''; }

  burger.addEventListener('click', openDrawer);
  drawerClose.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);
  document.querySelectorAll('.dl').forEach(a => a.addEventListener('click', closeDrawer));

  /* ── 7. REVEAL ON SCROLL ── */
  const reveals = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = (i % 4) * 0.12 + 's';
        entry.target.classList.add('in');
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => revealObs.observe(el));

  /* ── 8. COUNTER ANIMATION ── */
  const counters = document.querySelectorAll('.hs-n');
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        let start    = 0;
        const step   = target / 60;
        const interval = setInterval(() => {
          start += step;
          if (start >= target) { el.textContent = target; clearInterval(interval); }
          else el.textContent = Math.ceil(start);
        }, 20);
        countObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => countObs.observe(el));

  /* ── 9. SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── 10. TECH ICONS TILT ── */
  document.querySelectorAll('.ti-icon').forEach(icon => {
    icon.addEventListener('mousemove', e => {
      const rect = icon.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 20;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 20;
      icon.style.transform = `perspective(200px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-4px) scale(1.1)`;
    });
    icon.addEventListener('mouseleave', () => {
      icon.style.transform = '';
    });
  });

  /* ── 11. PROJECT CARD TILT ── */
  document.querySelectorAll('.proj-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 6;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 6;
      card.style.transform = `perspective(800px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-10px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .5s ease';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform .1s ease, border-color .35s, box-shadow .35s';
    });
  });

  /* ── 12. FAB LABEL EXPAND ── */
  document.querySelectorAll('.fab-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.querySelector('.fab-label').style.opacity = '1';
    });
    btn.addEventListener('mouseleave', () => {
      btn.querySelector('.fab-label').style.opacity = '0';
    });
  });

  /* ── 13. HAMBURGER ANIMATION ── */
  burger.addEventListener('click', () => {
    const spans = burger.querySelectorAll('span');
    spans[0].style.transform = drawer.classList.contains('open') ? 'rotate(45deg) translate(5px,5px)' : '';
    spans[1].style.opacity   = drawer.classList.contains('open') ? '0' : '1';
    spans[2].style.transform = drawer.classList.contains('open') ? 'rotate(-45deg) translate(5px,-5px)' : '';
  });
  drawerClose.addEventListener('click', () => {
    const spans = burger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '1';
    spans[2].style.transform = '';
  });

  /* ── 14. GLOWING CONTACT CARDS ── */
  document.querySelectorAll('.cc').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.background = `
        radial-gradient(200px circle at ${x}px ${y}px, rgba(0,229,255,0.06), transparent 60%),
        rgba(255,255,255,0.025)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });

  /* ── 15. SCROLL PROGRESS BAR ── */
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; height: 2px; z-index: 9999;
    background: linear-gradient(90deg, #00e5ff, #7b2fff);
    transform-origin: left; transform: scaleX(0);
    transition: transform .1s linear;
  `;
  document.body.prepend(progressBar);
  window.addEventListener('scroll', () => {
    const prog = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    progressBar.style.transform = `scaleX(${prog})`;
  }, { passive: true });

  console.log('%c Ahmed Portfolio Loaded ✓', 'color:#00e5ff; font-size:16px; font-weight:bold;');
});
