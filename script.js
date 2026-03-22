// ============================================================
//  THERMITE EARTH CORE – Main JavaScript
// ============================================================

/* ── Particle Canvas ── */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], animId;

  const PARTICLE_COUNT = 120;
  const COLORS = [
    'rgba(255,106,0,',
    'rgba(255,215,0,',
    'rgba(0,230,118,',
    'rgba(41,182,246,',
    'rgba(206,147,216,',
  ];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function randBetween(a, b) { return a + Math.random() * (b - a); }

  function createParticle() {
    const colorBase = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: randBetween(0.8, 2.8),
      vx: randBetween(-0.35, 0.35),
      vy: randBetween(-0.6, -0.1),
      alpha: randBetween(0.2, 0.7),
      colorBase,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: randBetween(0.01, 0.04),
    };
  }

  function populateParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // subtle radial gradient background overlay
    const grad = ctx.createRadialGradient(W * 0.5, H * 0.6, 0, W * 0.5, H * 0.6, Math.max(W, H) * 0.7);
    grad.addColorStop(0, 'rgba(255,100,0,0.06)');
    grad.addColorStop(0.5, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    particles.forEach(p => {
      p.pulse += p.pulseSpeed;
      const alpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.colorBase + alpha + ')';
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.y < -10) p.y = H + 5;
      if (p.x < -10) p.x = W + 5;
      if (p.x > W + 10) p.x = -5;
    });

    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); });
  resize();
  populateParticles();
  draw();
})();

/* ── Navbar scroll shrink & mobile toggle ── */
(function initNav() {
  const navbar  = document.getElementById('navbar');
  const toggle  = document.getElementById('nav-toggle');
  const links   = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    navbar.style.padding = window.scrollY > 40 ? '0.5rem 0' : '0.9rem 0';
  });

  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }
})();

/* ── Intersection Observer – fade-in-up + burn bars ── */
(function initObservers() {
  // fade-in-up elements
  const fadeEls = document.querySelectorAll('.fade-in-up');
  const fadeObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); fadeObs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  fadeEls.forEach(el => fadeObs.observe(el));

  // burn bars
  const bars = document.querySelectorAll('.burn-bar-fill');
  const barObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('animate'); barObs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  bars.forEach(b => barObs.observe(b));
})();

/* ── Active nav link highlighting ── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.getAttribute('id');
        navLinks.forEach(a => {
          a.style.color = a.getAttribute('href') === '#' + id
            ? 'var(--fire-orange)' : '';
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => obs.observe(s));
})();

/* ── Planet node info cards ── */
(function initPlanetInfo() {
  const data = {
    mercury: {
      title: 'Mercury – The Core Builder',
      desc:  'First node in the solar stream. Takes the direct hit of solar particles and nano-metals, concentrating heavy metallic elements to form a dense core. Its large iron core (~85% of radius) supports this role.',
      color: '#9e9e9e',
    },
    venus: {
      title: 'Venus – The Combustion Engine',
      desc:  'Secondary ignition point. Uses radiant heat from Mercury\'s zone to fuel its own dense atmosphere (96% CO₂), acting as a pressure cooker that reaches 465°C surface temperatures.',
      color: '#ff8f00',
    },
    earth: {
      title: 'Earth – The Balanced Node',
      desc:  'By the time the solar stream reaches Earth, the combustion has stabilized enough to allow crust, soil, and liquid water over the still-molten thermite-like center (outer core ~4,000–5,000°C).',
      color: '#388e3c',
    },
    mars: {
      title: 'Mars – The Post-Earth Node',
      desc:  'A later stage where the stream is cooling and compression is lowering. Mars lost its global magnetic field ~4 billion years ago as its core solidified—matching a "cooling" node model.',
      color: '#c62828',
    },
  };

  const infoPanel = document.getElementById('planet-info');
  document.querySelectorAll('.planet-orb[data-planet]').forEach(orb => {
    orb.addEventListener('click', () => {
      const d = data[orb.dataset.planet];
      if (!d || !infoPanel) return;
      infoPanel.querySelector('h4').textContent = d.title;
      infoPanel.querySelector('p').textContent  = d.desc;
      infoPanel.style.borderLeftColor = d.color;
      infoPanel.style.display = 'block';
    });
  });
})();

/* ── Stoichiometry slider ── */
(function initStoichSlider() {
  const slider = document.getElementById('ratio-slider');
  const feBox  = document.getElementById('stoich-fe2o3-box');
  const alBox  = document.getElementById('stoich-al-box');
  const ratioDisplay = document.getElementById('ratio-display');
  const qualityBar = document.getElementById('quality-bar');
  const qualityText = document.getElementById('quality-text');

  if (!slider) return;

  function update() {
    const v = parseFloat(slider.value); // 1 = Fe₂O₃, v = Al parts
    const ratio = (3 / v).toFixed(2);
    if (feBox) feBox.style.width = Math.max(80, Math.min(200, 180)) + 'px';
    if (alBox) alBox.style.width = Math.max(40, Math.min(120, v * 20)) + 'px';
    if (ratioDisplay) ratioDisplay.textContent = `Fe₂O₃ : Al = 3 : ${v.toFixed(1)}`;

    // quality: optimal at v=1 (3:1 ratio by weight is actually 1:0.33 molar; stoich is 1:1 molar ≈ 3g Fe₂O₃ per 1g Al)
    const diff = Math.abs(v - 1.0);
    const quality = Math.max(0, 100 - diff * 80);
    if (qualityBar) qualityBar.style.width = quality + '%';
    if (qualityText) {
      if (quality > 85) qualityText.textContent = '✅ Near-stoichiometric — maximum energy output';
      else if (quality > 60) qualityText.textContent = '⚠️ Off-ratio — reduced energy, excess material';
      else qualityText.textContent = '❌ Far off ratio — weak or failed ignition';
      qualityText.style.color = quality > 85 ? 'var(--aurora-green)' : quality > 60 ? '#ffc107' : 'var(--fire-red)';
    }
  }

  slider.addEventListener('input', update);
  update();
})();

/* ── Radon counter (simulated energy accumulation) ── */
(function initRadonCounter() {
  const counter = document.getElementById('radon-counter');
  if (!counter) return;

  let value = 0;
  const target = 3.7e4; // ~37,000 disintegrations/min per pCi/L typical

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        obs.unobserve(e.target);
        animateCounter();
      }
    });
  }, { threshold: 0.5 });
  obs.observe(counter);

  function animateCounter() {
    const duration = 2000;
    const start = performance.now();
    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      value = Math.round(eased * target);
      counter.textContent = value.toLocaleString();
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
})();

/* ── Copy-to-clipboard for formula boxes ── */
document.querySelectorAll('[data-copy]').forEach(el => {
  el.style.cursor = 'pointer';
  el.addEventListener('click', () => {
    navigator.clipboard.writeText(el.dataset.copy).then(() => {
      const orig = el.textContent;
      el.textContent = '✓ Copied!';
      setTimeout(() => { el.textContent = orig; }, 1200);
    }).catch(() => {});
  });
});
