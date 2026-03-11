/* ================================================================
   AHMED PORTFOLIO — script.js
   Editorial Dark Luxury · Full Stack · 2026
   ================================================================ */

const WA  = "201208760020";   // ← غيّر رقمك هنا
const FB  = "https://www.facebook.com/share/1DSiwBNnhX/";

/* ─── BOOT ─── */
document.addEventListener("DOMContentLoaded", () => {
  patchLinks();
  preloader();
  cursor();
  navbar();
  mobileMenu();
  heroCanvas();
  counters();
  skillBars();
  skillTabs();
  projectFilter();
  scrollReveal();
  contactForm();
  backTop();
});

/* ─── PATCH LINKS ─── */
function patchLinks() {
  document.querySelectorAll('[href*="YOUR_NUMBER"]')
    .forEach(a => a.href = `https://wa.me/${WA}`);
  document.querySelectorAll('[href*="tel:YOUR_NUMBER"]')
    .forEach(a => a.href = `tel:+${WA}`);
}

/* ─── PRELOADER ─── */
function preloader() {
  const el    = document.getElementById("preloader");
  const fill  = document.getElementById("preFill");
  const count = document.getElementById("preCount");
  const letters = el.querySelectorAll(".pre-name span");

  document.body.style.overflow = "hidden";
  let v = 0;
  const tick = setInterval(() => {
    v += Math.random() * 14 + 5;
    if (v > 100) v = 100;
    if (fill) fill.style.width = v + "%";
    if (count) count.textContent = Math.floor(v);

    // Light up letters progressively
    const idx = Math.floor((v / 100) * letters.length);
    letters.forEach((s, i) => s.classList.toggle("lit", i < idx));

    if (v >= 100) {
      clearInterval(tick);
      setTimeout(() => {
        el.classList.add("out");
        document.body.style.overflow = "auto";
        animateHero();
      }, 400);
    }
  }, 80);
}

function animateHero() {
  // Hero words are CSS-animated — just trigger counters
  setTimeout(startCounters, 800);
}

/* ─── CUSTOM CURSOR ─── */
function cursor() {
  const dot  = document.getElementById("cursor");
  const ring = document.getElementById("cursorBorder");
  if (!dot || window.innerWidth < 768) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + "px";
    dot.style.top  = my + "px";
  });

  (function track() {
    rx += (mx - rx) * .1;
    ry += (my - ry) * .1;
    ring.style.left = rx + "px";
    ring.style.top  = ry + "px";
    requestAnimationFrame(track);
  })();

  const hoverEls = document.querySelectorAll(
    "a, button, .work-card, .tc, .sk-item, .cw-item, .ao-item"
  );
  hoverEls.forEach(el => {
    el.addEventListener("mouseenter", () => ring.classList.add("big"));
    el.addEventListener("mouseleave", () => ring.classList.remove("big"));
  });
}

/* ─── NAVBAR ─── */
function navbar() {
  const nav  = document.getElementById("siteNav");
  const links = document.querySelectorAll(".nl");
  const secs  = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", () => {
    nav.classList.toggle("stuck", window.scrollY > 40);

    let cur = "";
    secs.forEach(s => {
      if (window.scrollY >= s.offsetTop - 140) cur = s.id;
    });
    links.forEach(l =>
      l.classList.toggle("active", l.getAttribute("href") === "#" + cur)
    );
  }, { passive: true });

  links.forEach(l => l.addEventListener("click", e => {
    const h = l.getAttribute("href");
    if (h.startsWith("#")) {
      e.preventDefault();
      document.querySelector(h)?.scrollIntoView({ behavior: "smooth" });
      document.getElementById("mobileNav")?.classList.remove("open");
      document.getElementById("navBurger")?.classList.remove("open");
    }
  }));
}

/* ─── MOBILE MENU ─── */
function mobileMenu() {
  const btn = document.getElementById("navBurger");
  const nav = document.getElementById("mobileNav");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    const o = !nav.classList.contains("open");
    nav.classList.toggle("open", o);
    btn.classList.toggle("open", o);
  });

  nav.querySelectorAll(".mn-link").forEach(l => {
    l.addEventListener("click", e => {
      const h = l.getAttribute("href");
      if (h.startsWith("#")) {
        e.preventDefault();
        nav.classList.remove("open");
        btn.classList.remove("open");
        setTimeout(() => document.querySelector(h)?.scrollIntoView({ behavior: "smooth" }), 250);
      }
    });
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      nav.classList.remove("open");
      btn.classList.remove("open");
    }
  });
}

/* ─── HERO CANVAS — subtle grain dots ─── */
function heroCanvas() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const count = Math.min(60, Math.floor(window.innerWidth / 22));
  const pts = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.2 + .2,
    vx: (Math.random() - .5) * .3,
    vy: (Math.random() - .5) * .3,
    op: Math.random() * .35 + .05
  }));

  // Color palette: amber dots only — no neon
  (function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,169,110,${p.op})`;
      ctx.fill();
    });
    // Sparse connections
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(200,169,110,${.03 * (1 - d / 100)})`;
          ctx.lineWidth = .5;
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  })();
}

/* ─── COUNTERS ─── */
let cStarted = false;
function counters() {
  const wrap = document.querySelector(".hero-nums");
  if (!wrap) return;
  const obs = new IntersectionObserver(ents => {
    if (ents.some(e => e.isIntersecting) && !cStarted) {
      cStarted = true;
      startCounters();
      obs.disconnect();
    }
  }, { threshold: .5 });
  obs.observe(wrap);
}

function startCounters() {
  document.querySelectorAll(".hn-val").forEach(el => {
    const target = parseInt(el.dataset.to);
    let cur = 0;
    const step = target / 60;
    const iv = setInterval(() => {
      cur += step;
      if (cur >= target) { cur = target; clearInterval(iv); }
      el.textContent = Math.floor(cur);
    }, 25);
  });
}

/* ─── SKILL BARS ─── */
function skillBars() {
  const obs = new IntersectionObserver(ents => {
    ents.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => { e.target.style.width = e.target.dataset.w + "%"; }, 120);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .3 });
  document.querySelectorAll(".ski-fill").forEach(el => obs.observe(el));
}

function reAnimateBars(panel) {
  panel.querySelectorAll(".ski-fill").forEach(el => {
    el.style.width = "0%";
    setTimeout(() => { el.style.width = el.dataset.w + "%"; }, 80);
  });
}

/* ─── SKILL TABS ─── */
function skillTabs() {
  const tabs   = document.querySelectorAll(".st-btn");
  const panels = document.querySelectorAll(".sp");

  tabs.forEach(tab => tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    panels.forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    const panel = document.getElementById("sp-" + tab.dataset.t);
    if (panel) {
      panel.classList.add("active");
      reAnimateBars(panel);
      // Stagger items
      panel.querySelectorAll(".sk-item").forEach((item, i) => {
        item.style.opacity = "0";
        item.style.transform = "translateY(16px)";
        setTimeout(() => {
          item.style.transition = "opacity .35s ease, transform .35s ease";
          item.style.opacity = "1";
          item.style.transform = "translateY(0)";
        }, i * 55);
      });
    }
  }));
}

/* ─── PROJECT FILTER ─── */
function projectFilter() {
  const btns  = document.querySelectorAll(".wf");
  const cards = document.querySelectorAll(".work-card");

  btns.forEach(btn => btn.addEventListener("click", () => {
    btns.forEach(b => b.setAttribute("aria-pressed", "false"));
    btn.setAttribute("aria-pressed", "true");
    const f = btn.dataset.f;

    cards.forEach(card => {
      const match = f === "all" || card.dataset.cat === f;
      card.style.transition = "opacity .3s ease, transform .3s ease";
      if (match) {
        card.style.display = "";
        card.style.opacity = "0";
        card.style.transform = "translateY(12px)";
        requestAnimationFrame(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        });
      } else {
        card.style.opacity = "0";
        card.style.transform = "translateY(12px)";
        setTimeout(() => { card.style.display = "none"; }, 280);
      }
    });
  }));
}

/* ─── SCROLL REVEAL ─── */
function scrollReveal() {
  const targets = document.querySelectorAll(
    ".work-card, .ao-item, .sk-item, .tc, .cw-item, .about-card, .about-quote"
  );
  targets.forEach(el => el.classList.add("reveal"));

  const obs = new IntersectionObserver(ents => {
    ents.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); }
    });
  }, { threshold: .12, rootMargin: "0px 0px -40px 0px" });

  targets.forEach(el => obs.observe(el));
}

/* ─── CONTACT FORM → WHATSAPP ─── */
function contactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    const name   = document.getElementById("ci-name")?.value.trim();
    const phone  = document.getElementById("ci-phone")?.value.trim();
    const proj   = document.getElementById("ci-proj")?.value.trim();
    const budget = document.getElementById("ci-budget")?.value;
    const msg    = document.getElementById("ci-msg")?.value.trim();

    if (!name || !phone || !proj || !msg) {
      toast("⚠️  يرجى تعبئة جميع الحقول", "warn");
      return;
    }

    const btn = document.getElementById("cfSend");
    btn.disabled = true;
    btn.innerHTML = 'جاري الإرسال... <i class="fas fa-spinner fa-spin"></i>';

    const text = [
      `مرحباً أحمد 👋`,
      `─────────────────`,
      `👤  ${name}`,
      `📱  ${phone}`,
      `💼  ${proj}`,
      budget ? `💰  ${budget}` : null,
      `─────────────────`,
      msg,
      `─────────────────`,
      `✅ في انتظار ردك!`
    ].filter(Boolean).join("\n");

    setTimeout(() => {
      window.open(`https://wa.me/${WA}?text=${encodeURIComponent(text)}`, "_blank");
      form.reset();
      btn.disabled = false;
      btn.innerHTML = 'إرسال عبر WhatsApp <i class="fab fa-whatsapp"></i>';
      toast("✅  تم الإرسال بنجاح! سيرد أحمد قريباً 🚀");
    }, 900);
  });
}

/* ─── BACK TO TOP ─── */
function backTop() {
  const btn = document.getElementById("backTop");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.style.opacity = window.scrollY > 500 ? "1" : "0";
    btn.style.pointerEvents = window.scrollY > 500 ? "auto" : "none";
  }, { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ─── TOAST ─── */
function toast(msg, type = "ok") {
  let t = document.getElementById("toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; document.body.appendChild(t); }
  t.textContent = msg;
  t.style.borderColor = type === "ok" ? "var(--amber)" : "#e0a040";
  t.style.color       = type === "ok" ? "var(--amber)" : "#e0a040";
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 4000);
}

/* ─── DEV INFO ─── */
console.log(
  "%c Ahmed | Full Stack Developer ",
  "background:#c8a96e;color:#0e0e11;font-weight:800;font-size:16px;padding:10px 20px;border-radius:6px"
);
console.log("%cCairo, Egypt · 2026 · Frontend · Backend · UI/UX · Mobile", "color:#8888a0;font-size:12px");