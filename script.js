/* ════════════════════════════════════════════════════════
   GALAXY LOVE — script.js
   ════════════════════════════════════════════════════════
   Sections:
     0.  Init & helpers
     1.  Custom cursor
     2.  Three.js galaxy background
     3.  Particles.js floating dust
     4.  Intro typing sequence (GSAP)
     5.  "Enter Our Universe" transition
     6.  Universe navigation dots
     7.  ScrollTrigger section reveals
     8.  Timeline animation
     9.  Memory card tilt
    10.  Reasons flip-card touch
    11.  Future Dreams orbs
    12.  Secret message orb
    13.  Floating ambient hearts
    14.  Finale rain
    15.  Hidden hearts mini-game
    16.  Web-Audio ambient music
   ════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────
   0. INIT & HELPERS
   ───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  // Utility: random between min and max
  const rand = (min, max) => Math.random() * (max - min) + min;

  // Utility: pick random element from array
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  /* ───────────────────────────────────────
     1. CUSTOM CURSOR
     ─────────────────────────────────────── */
  const cursor = document.createElement('div');
  cursor.id = 'custom-cursor';
  document.body.appendChild(cursor);

  let mouseX = -100, mouseY = -100;
  let cursorX = -100, cursorY = -100;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth cursor follow with lerp
  function updateCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = cursorX + 'px';
    cursor.style.top  = cursorY + 'px';
    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  // Scale up cursor on interactive elements
  document.querySelectorAll('button, a, .reason-card, .dream-orb, .memory-card, .hidden-heart, .secret-orb, #prev-btn, #next-btn')
    .forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
        cursor.style.background = 'var(--purple-light)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        cursor.style.background = 'var(--pink)';
      });
    });

  /* ───────────────────────────────────────
     2. THREE.JS GALAXY BACKGROUND
     Rotating starfield with colored nebula
     ─────────────────────────────────────── */
  (function initGalaxy() {
    const canvas   = document.getElementById('galaxy-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 3;

    // ── Star field (background layer) ──
    const starCount = 6000;
    const starGeo   = new THREE.BufferGeometry();
    const starPos   = new Float32Array(starCount * 3);
    const starColors= new Float32Array(starCount * 3);

    const palettes = [
      [1.0, 0.8, 1.0],   // pink-white
      [0.85,0.6, 1.0],   // lavender
      [1.0, 1.0, 1.0],   // pure white
      [0.7, 0.5, 1.0],   // purple
      [1.0, 0.9, 0.95],  // warm white
    ];

    for (let i = 0; i < starCount; i++) {
      starPos[i * 3]     = rand(-500, 500);
      starPos[i * 3 + 1] = rand(-500, 500);
      starPos[i * 3 + 2] = rand(-500, 0);

      const col = pick(palettes);
      starColors[i * 3]     = col[0];
      starColors[i * 3 + 1] = col[1];
      starColors[i * 3 + 2] = col[2];
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });

    scene.add(new THREE.Points(starGeo, starMat));

    // ── Galaxy spiral arms ──
    function createGalaxyArm(armAngleOffset, count, color1, color2) {
      const geo  = new THREE.BufferGeometry();
      const pos  = new Float32Array(count * 3);
      const cols = new Float32Array(count * 3);
      const c1 = new THREE.Color(color1);
      const c2 = new THREE.Color(color2);

      for (let i = 0; i < count; i++) {
        const t      = i / count;
        const angle  = t * Math.PI * 10 + armAngleOffset;
        const radius = t * 250 + rand(0, 15);
        const spread = (1 - t) * 30 + 5;

        pos[i * 3]     = Math.cos(angle) * radius + rand(-spread, spread);
        pos[i * 3 + 1] = rand(-spread * 0.4, spread * 0.4);
        pos[i * 3 + 2] = Math.sin(angle) * radius + rand(-spread, spread) - 200;

        const col = c1.clone().lerp(c2, t);
        cols[i * 3]     = col.r;
        cols[i * 3 + 1] = col.g;
        cols[i * 3 + 2] = col.b;
      }

      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color',    new THREE.BufferAttribute(cols, 3));

      return new THREE.Points(geo, new THREE.PointsMaterial({
        size: 1.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.55,
      }));
    }

    const arm1 = createGalaxyArm(0,          3000, '#ff6eb4', '#a855f7');
    const arm2 = createGalaxyArm(Math.PI,     3000, '#c084fc', '#ff6eb4');
    const arm3 = createGalaxyArm(Math.PI / 2, 1500, '#f0abfc', '#ffffff');
    const galaxyGroup = new THREE.Group();
    galaxyGroup.add(arm1, arm2, arm3);
    scene.add(galaxyGroup);

    // ── Nebula glow (large blurred point cloud) ──
    const nebGeo  = new THREE.BufferGeometry();
    const nebPos  = new Float32Array(400 * 3);
    const nebCols = new Float32Array(400 * 3);
    const nebPalette = ['#ff6eb4','#a855f7','#c084fc','#f0abfc'];
    for (let i = 0; i < 400; i++) {
      const θ = rand(0, Math.PI * 2);
      const r = rand(0, 180);
      nebPos[i*3]   = Math.cos(θ) * r + rand(-20,20);
      nebPos[i*3+1] = rand(-60, 60);
      nebPos[i*3+2] = Math.sin(θ) * r - 200;
      const c = new THREE.Color(pick(nebPalette));
      nebCols[i*3]   = c.r;
      nebCols[i*3+1] = c.g;
      nebCols[i*3+2] = c.b;
    }
    nebGeo.setAttribute('position', new THREE.BufferAttribute(nebPos, 3));
    nebGeo.setAttribute('color',    new THREE.BufferAttribute(nebCols, 3));
    scene.add(new THREE.Points(nebGeo, new THREE.PointsMaterial({
      size: 4, vertexColors: true, transparent: true, opacity: 0.18,
    })));

    // ── Animation loop ──
    let frame = 0;
    function animateGalaxy() {
      requestAnimationFrame(animateGalaxy);
      frame++;
      galaxyGroup.rotation.y += 0.0005;
      galaxyGroup.rotation.x  = Math.sin(frame * 0.0003) * 0.15;

      // Gentle camera drift
      camera.position.x = Math.sin(frame * 0.0004) * 0.5;
      camera.position.y = Math.cos(frame * 0.0003) * 0.3;

      renderer.render(scene, camera);
    }
    animateGalaxy();

    // ── Resize ──
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ── Parallax on mouse move ──
    document.addEventListener('mousemove', (e) => {
      const nx = (e.clientX / window.innerWidth  - 0.5) * 0.6;
      const ny = (e.clientY / window.innerHeight - 0.5) * 0.4;
      gsap.to(galaxyGroup.rotation, {
        x: ny,
        z: nx * 0.5,
        duration: 2,
        ease: 'power1.out',
      });
    });
  })();

  /* ───────────────────────────────────────
     3. PARTICLES.JS — floating dust/hearts
     ─────────────────────────────────────── */
  particlesJS('particles-js', {
    particles: {
      number: { value: 60, density: { enable: true, value_area: 1000 } },
      color:  { value: ['#ff6eb4', '#a855f7', '#f0abfc', '#ffffff'] },
      shape: {
        type: ['circle', 'char'],
        character: { value: ['✦', '✧', '·'], font: 'Quicksand', style: '', weight: '400' },
      },
      opacity: { value: 0.4, random: true, anim: { enable: true, speed: 0.5, opacity_min: 0.05, sync: false } },
      size:    { value: 2, random: true, anim: { enable: true, speed: 2, size_min: 0.5 } },
      line_linked: { enable: false },
      move: {
        enable: true, speed: 0.6, direction: 'top',
        random: true, straight: false, out_mode: 'out', bounce: false,
      },
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: true, mode: 'repulse' } },
      modes:  { repulse: { distance: 80 } },
    },
    retina_detect: true,
  });

  /* ───────────────────────────────────────
     4. INTRO TYPING SEQUENCE
     ─────────────────────────────────────── */
  const typedEl    = document.getElementById('typed-text');
  const taglineEl  = document.getElementById('intro-tagline');
  const subEl      = document.getElementById('typing-sub');
  const enterBtn   = document.getElementById('enter-btn');

  const titleLines   = ['Himanshi,', 'You Are My Universe.'];
  const taglineTexts = ['✦  From a Hinge hello to the stars — my Cookieee, always  ✦'];

  let titleFull = titleLines.join(' ');
  let charIndex = 0;
  let titleTyped = false;

  // Fade in the eyebrow first
  gsap.to(subEl, { opacity: 1, y: 0, duration: 1.2, delay: 0.5, ease: 'power2.out' });

  // Then type the title
  function typeTitle() {
    if (charIndex < titleFull.length) {
      // Insert newline at the break point
      if (charIndex === titleLines[0].length) {
        typedEl.innerHTML = titleLines[0] + '<br />';
      } else if (charIndex < titleLines[0].length) {
        typedEl.textContent = titleFull.slice(0, charIndex + 1);
      } else {
        const line2 = titleFull.slice(titleLines[0].length + 1, charIndex + 1);
        typedEl.innerHTML = titleLines[0] + '<br />' + line2;
      }
      charIndex++;
      setTimeout(typeTitle, charIndex < 5 ? 80 : 55);
    } else {
      // Title done → show tagline
      titleTyped = true;
      setTimeout(showTagline, 400);
    }
  }

  function showTagline() {
    gsap.to(taglineEl, { opacity: 1, y: 0, duration: 1, ease: 'power2.out',
      onStart() { taglineEl.textContent = taglineTexts[0]; }
    });
    setTimeout(showEnterBtn, 700);
  }

  function showEnterBtn() {
    gsap.to(enterBtn, { opacity: 1, y: 0, duration: 1, ease: 'back.out(1.7)' });
  }

  // Start after 0.8s
  setTimeout(typeTitle, 800);

  /* ───────────────────────────────────────
     5. "ENTER OUR UNIVERSE" TRANSITION
     ─────────────────────────────────────── */
  enterBtn.addEventListener('click', () => {
    const intro    = document.getElementById('intro');
    const universe = document.getElementById('universe');
    const nav      = document.querySelector('.universe-nav');

    const tl = gsap.timeline();

    tl.to(enterBtn, { scale: 1.2, duration: 0.2, ease: 'power2.out' })
      .to(enterBtn, { scale: 0,   opacity: 0, duration: 0.4, ease: 'power2.in' })
      .to(intro,    { opacity: 0, duration: 0.8, ease: 'power2.in' }, '-=0.2')
      .add(() => {
        intro.style.pointerEvents = 'none';
        universe.classList.remove('universe-hidden');
        universe.style.opacity    = '0';
        universe.style.transform  = 'translateY(40px)';
        universe.style.pointerEvents = 'all';
      })
      .to(universe, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' })
      .add(() => {
        if (nav) nav.classList.add('visible');
        // Kick off scroll animations
        initScrollAnimations();
        spawnFloatingHearts();
      });
  });

  /* ───────────────────────────────────────
     6. NAVIGATION DOTS
     ─────────────────────────────────────── */
  const navContainer = document.createElement('nav');
  navContainer.className = 'universe-nav';
  navContainer.setAttribute('aria-label', 'Section navigation');

  const navSections = [
    { id: 'story',    label: 'Our Story'    },
    { id: 'memories', label: 'Memories'     },
    { id: 'reasons',  label: 'Love Reasons' },
    { id: 'dreams',   label: 'Dreams'       },
    { id: 'secret',   label: 'Secret'       },
    { id: 'finale',   label: 'Finale'       },
  ];

  navSections.forEach(({ id, label }) => {
    const dot = document.createElement('div');
    dot.className = 'nav-dot';
    dot.setAttribute('data-target', id);
    dot.setAttribute('data-label', label);
    dot.setAttribute('role', 'button');
    dot.setAttribute('tabindex', '0');
    dot.setAttribute('aria-label', `Go to ${label}`);
    dot.addEventListener('click', () => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    });
    dot.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') dot.click();
    });
    navContainer.appendChild(dot);
  });
  document.body.appendChild(navContainer);

  // Highlight active dot on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.nav-dot').forEach(d => d.classList.remove('active'));
        const active = document.querySelector(`.nav-dot[data-target="${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  navSections.forEach(({ id }) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  /* ───────────────────────────────────────
     7. SCROLL-TRIGGERED SECTION REVEALS
     ─────────────────────────────────────── */
  function initScrollAnimations() {

    // ── STORY section header
    gsap.from('#story .section-header', {
      scrollTrigger: { trigger: '#story', start: 'top 80%', toggleActions: 'play none none none' },
      y: 60, opacity: 0, duration: 1.2, ease: 'power3.out',
    });

    // ── MEMORIES section header
    gsap.from('#memories .section-header', {
      scrollTrigger: { trigger: '#memories', start: 'top 80%', toggleActions: 'play none none none' },
      y: 50, opacity: 0, duration: 1, ease: 'power3.out',
    });

    // ── Memory cards stagger
    gsap.from('.memory-card', {
      scrollTrigger: { trigger: '.gallery-grid', start: 'top 85%', toggleActions: 'play none none none' },
      y: 60, opacity: 0, scale: 0.9,
      duration: 0.8, stagger: 0.12, ease: 'back.out(1.4)',
    });

    // ── REASONS section header
    gsap.from('#reasons .section-header', {
      scrollTrigger: { trigger: '#reasons', start: 'top 80%', toggleActions: 'play none none none' },
      y: 50, opacity: 0, duration: 1, ease: 'power3.out',
    });

    // ── Reason cards stagger
    gsap.to('.reason-card', {
      scrollTrigger: { trigger: '.reasons-grid', start: 'top 85%', toggleActions: 'play none none none' },
      opacity: 1, scale: 1,
      duration: 0.6, stagger: 0.1, ease: 'back.out(1.4)',
    });

    // ── DREAMS section
    gsap.from('#dreams .section-header', {
      scrollTrigger: { trigger: '#dreams', start: 'top 80%', toggleActions: 'play none none none' },
      y: 50, opacity: 0, duration: 1, ease: 'power3.out',
    });

    gsap.to('.dream-orb', {
      scrollTrigger: { trigger: '.dreams-constellation', start: 'top 85%', toggleActions: 'play none none none' },
      opacity: 1,
      duration: 0.8, stagger: 0.2, ease: 'power2.out',
    });

    // ── SECRET section
    gsap.from('#secret .section-header', {
      scrollTrigger: { trigger: '#secret', start: 'top 80%', toggleActions: 'play none none none' },
      y: 50, opacity: 0, duration: 1, ease: 'power3.out',
    });

    gsap.from('.secret-orb', {
      scrollTrigger: { trigger: '.secret-container', start: 'top 80%', toggleActions: 'play none none none' },
      scale: 0, opacity: 0, duration: 1.2, ease: 'elastic.out(1, 0.5)',
    });

    // ── FINALE section
    ScrollTrigger.create({
      trigger: '#finale',
      start: 'top 70%',
      onEnter: () => animateFinale(),
    });
  }

  /* ───────────────────────────────────────
     8. TIMELINE ANIMATION
     Items reveal alternating left/right
     ─────────────────────────────────────── */
  function initTimeline() {
    document.querySelectorAll('.timeline-item').forEach((item, i) => {
      const side = item.dataset.side;
      gsap.to(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.9,
        delay: i * 0.1,
        ease: 'power3.out',
        onStart() {
          // also animate the dot
          const dot = item.querySelector('.timeline-dot');
          gsap.from(dot, { scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(2)' });
        },
      });

      // Set initial state
      gsap.set(item, { opacity: 0, x: side === 'left' ? -60 : 60, y: 20 });
    });
  }

  // Timeline needs to run after universe is shown
  const origInit = initScrollAnimations;
  window.initScrollAnimations = function() {
    origInit();
    initTimeline();
  };

  // Override the transition listener
  enterBtn.removeEventListener('click', enterBtn._listener);
  enterBtn.addEventListener('click', function enterHandler() {
    const intro    = document.getElementById('intro');
    const universe = document.getElementById('universe');
    const nav      = document.querySelector('.universe-nav');

    gsap.timeline()
      .to(enterBtn, { scale: 1.2, duration: 0.2, ease: 'power2.out' })
      .to(enterBtn, { scale: 0,   opacity: 0, duration: 0.4, ease: 'power2.in' })
      .to(intro,    { opacity: 0, duration: 0.8, ease: 'power2.in' }, '-=0.2')
      .add(() => {
        intro.style.pointerEvents = 'none';
        universe.classList.remove('universe-hidden');
        universe.style.opacity    = '0';
        universe.style.transform  = 'translateY(40px)';
        universe.style.pointerEvents = 'all';
      })
      .to(universe, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' })
      .add(() => {
        if (nav) nav.classList.add('visible');
        window.initScrollAnimations();
        initTimeline();
        spawnFloatingHearts();
        ScrollTrigger.refresh();
      });

    enterBtn.removeEventListener('click', enterHandler);
  });

  /* ───────────────────────────────────────
     9. MEMORY CARD 3D TILT
     ─────────────────────────────────────── */
  document.querySelectorAll('.memory-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      gsap.to(card, {
        rotateX: -dy * 8,
        rotateY:  dx * 8,
        scale: 1.04,
        duration: 0.3,
        ease: 'power2.out',
        transformPerspective: 800,
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.5, ease: 'power3.out' });
    });
  });

  /* ───────────────────────────────────────
     10. REASON CARDS — TOUCH SUPPORT
     ─────────────────────────────────────── */
  document.querySelectorAll('.reason-card').forEach(card => {
    let flipped = false;
    card.addEventListener('click', () => {
      flipped = !flipped;
      if (flipped) {
        card.querySelector('.reason-front').style.transform = 'rotateY(-180deg)';
        card.querySelector('.reason-back').style.transform  = 'rotateY(0deg)';
      } else {
        card.querySelector('.reason-front').style.transform = 'rotateY(0deg)';
        card.querySelector('.reason-back').style.transform  = 'rotateY(180deg)';
      }
    });
  });

  /* ───────────────────────────────────────
     11. DREAM ORBS — hover tooltip
     ─────────────────────────────────────── */
  const dreamTooltip = document.getElementById('dream-tooltip');

  document.querySelectorAll('.dream-orb').forEach(orb => {
    orb.addEventListener('mouseenter', () => {
      const text = orb.dataset.dream;
      dreamTooltip.textContent = text;
      dreamTooltip.classList.add('visible');

      // Burst animation
      gsap.to(orb, {
        scale: 1.15,
        boxShadow: '0 0 40px rgba(255,110,180,0.8), 0 0 80px rgba(168,85,247,0.5)',
        duration: 0.4, ease: 'power2.out',
      });
    });

    orb.addEventListener('mouseleave', () => {
      dreamTooltip.classList.remove('visible');
      gsap.to(orb, {
        scale: 1,
        boxShadow: '',
        duration: 0.4, ease: 'power3.out',
      });
    });

    // Touch support
    orb.addEventListener('click', () => {
      const text = orb.dataset.dream;
      dreamTooltip.textContent = text;
      dreamTooltip.classList.toggle('visible');
    });
  });

  /* ───────────────────────────────────────
     12. SECRET MESSAGE ORB
     Click → shatter + reveal
     ─────────────────────────────────────── */
  const secretOrb     = document.getElementById('secret-orb');
  const secretMessage = document.getElementById('secret-message');
  let secretRevealed  = false;

  function revealSecret() {
    if (secretRevealed) return;
    secretRevealed = true;

    // Shatter animation
    const tl = gsap.timeline();
    tl.to(secretOrb, {
        scale: 1.4,
        duration: 0.3,
        ease: 'power2.out',
      })
      .to(secretOrb, {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'back.in(2)',
        onComplete() {
          secretOrb.style.display = 'none';
          // Spawn particle burst
          spawnBurst(secretOrb);
        }
      })
      .to(secretMessage, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
        onStart() {
          secretMessage.classList.add('revealed');
          secretMessage.removeAttribute('aria-hidden');
        }
      });
  }

  secretOrb.addEventListener('click', revealSecret);
  secretOrb.addEventListener('keypress', (e) => { if (e.key === 'Enter') revealSecret(); });

  function spawnBurst(el) {
    const rect  = el.getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    const emojis = ['💖','✨','💫','🌸','⭐'];
    for (let i = 0; i < 20; i++) {
      const span = document.createElement('span');
      span.textContent = pick(emojis);
      span.style.cssText = `
        position:fixed; left:${cx}px; top:${cy}px;
        font-size:${rand(1,2.5)}rem; pointer-events:none;
        z-index:999; opacity:1;
      `;
      document.body.appendChild(span);
      gsap.to(span, {
        x: rand(-200, 200),
        y: rand(-200, 200),
        opacity: 0,
        scale: rand(0.3, 1.5),
        duration: rand(0.8, 1.5),
        ease: 'power2.out',
        onComplete() { span.remove(); }
      });
    }
  }

  /* ───────────────────────────────────────
     13. FLOATING AMBIENT HEARTS
     Continuously spawns hearts from bottom
     ─────────────────────────────────────── */
  function spawnFloatingHearts() {
    const container = document.getElementById('floating-hearts-container');
    const heartEmojis = ['💗','💖','💓','💞','💕','✦','✧','💫'];

    function spawnHeart() {
      const h = document.createElement('div');
      h.className = 'float-heart';
      h.textContent = pick(heartEmojis);
      h.style.left      = rand(0, 100) + 'vw';
      h.style.bottom    = '-2rem';
      h.style.fontSize  = rand(0.7, 1.8) + 'rem';
      h.style.opacity   = '0';
      h.style.animationDuration = rand(7, 14) + 's';
      h.style.animationDelay   = '0s';
      container.appendChild(h);
      setTimeout(() => h.remove(), 15000);
    }

    // Spawn rate
    setInterval(spawnHeart, 1200);

    // Initial burst
    for (let i = 0; i < 5; i++) {
      setTimeout(spawnHeart, i * 300);
    }
  }

  /* ───────────────────────────────────────
     14. FINALE ANIMATION
     Hearts rain + text reveals
     ─────────────────────────────────────── */
  function animateFinale() {
    const tl = gsap.timeline();

    tl.to('#finale .finale-eyebrow', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
      .to('#finale-title',           { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, '-=0.4')
      .to('.finale-body',            { opacity: 1, y: 0, duration: 1,   ease: 'power3.out' }, '-=0.6')
      .to('.finale-divider',         { opacity: 1, duration: 0.8,        ease: 'power2.out' }, '-=0.4')
      .to('.finale-signature',       { opacity: 1, duration: 0.8,        ease: 'power2.out' }, '-=0.3');

    // Set initial states
    gsap.set(['#finale .finale-eyebrow','#finale-title','.finale-body','.finale-divider','.finale-signature'],
      { y: 40 });

    // Rain hearts
    const container = document.getElementById('finale-hearts');
    const rainEmojis = ['💗','💖','💓','✦','💕','🌸','✨'];
    for (let i = 0; i < 60; i++) {
      setTimeout(() => {
        const h = document.createElement('span');
        h.className  = 'rain-heart';
        h.textContent = pick(rainEmojis);
        h.style.left             = rand(0, 100) + '%';
        h.style.top              = '-3rem';
        h.style.fontSize         = rand(0.8, 2) + 'rem';
        h.style.animationDuration = rand(4, 9) + 's';
        h.style.animationDelay   = '0s';
        container.appendChild(h);
        setTimeout(() => h.remove(), 10000);
      }, rand(0, 4000));
    }
  }

  /* ───────────────────────────────────────
     15. HIDDEN HEARTS MINI-GAME
     Track 10 clicks, show win overlay at 10
     ─────────────────────────────────────── */
  let heartsFound  = 0;
  const totalHearts = 10;
  const foundIds   = new Set();
  const hud        = document.getElementById('hearts-hud');
  const hudCount   = document.getElementById('hearts-found');

  document.querySelectorAll('.hidden-heart').forEach(heart => {
    heart.addEventListener('click', () => {
      const id = heart.dataset.id;
      if (foundIds.has(id)) return;

      foundIds.add(id);
      heartsFound++;
      heart.classList.add('found');

      // Update HUD
      hudCount.textContent = heartsFound;
      hud.classList.add('pulse-hud');
      setTimeout(() => hud.classList.remove('pulse-hud'), 700);

      // Burst at click position
      const rect = heart.getBoundingClientRect();
      spawnBurst({ getBoundingClientRect: () => rect });

      // Win condition
      if (heartsFound >= totalHearts) {
        setTimeout(showHeartsWin, 600);
      }
    });
  });

  function showHeartsWin() {
    const win = document.getElementById('hearts-win');
    win.removeAttribute('aria-hidden');
    win.classList.add('active');

    // Confetti burst
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const fakeEl = {
          getBoundingClientRect: () => ({
            left: rand(0, window.innerWidth),
            top:  rand(0, window.innerHeight),
            width: 0, height: 0,
          })
        };
        spawnBurst(fakeEl);
      }, i * 300);
    }
  }

  document.getElementById('hw-close').addEventListener('click', () => {
    const win = document.getElementById('hearts-win');
    win.classList.remove('active');
    win.setAttribute('aria-hidden', 'true');
  });

  /* ───────────────────────────────────────
     16. PLAYLIST MUSIC PLAYER
     Reads from PLAYLIST (playlist.js)
     First song always plays first,
     rest are shuffled randomly.
     ─────────────────────────────────────── */
  (function initPlayer() {

    // ── Guard: if playlist.js not loaded or empty, show hint ──
    if (typeof PLAYLIST === 'undefined' || !PLAYLIST.length) {
      document.getElementById('player-title').textContent  = 'Add songs to playlist.js';
      document.getElementById('player-artist').textContent = 'See music/HOW-TO-ADD-SONGS.txt';
      return;
    }

    // ── Elements ──
    const player       = document.getElementById('music-player');
    const musicBtn     = document.getElementById('music-btn');
    const musicIcon    = document.getElementById('music-icon');
    const prevBtn      = document.getElementById('prev-btn');
    const nextBtn      = document.getElementById('next-btn');
    const titleEl      = document.getElementById('player-title');
    const artistEl     = document.getElementById('player-artist');
    const discEl       = document.getElementById('player-disc');
    const progressFill = document.getElementById('player-progress-fill');
    const progressBar  = document.getElementById('player-progress-bar');
    const currentEl    = document.getElementById('player-current');
    const durationEl   = document.getElementById('player-duration');

    // ── Build queue: first track locked, rest shuffled ──
    function buildQueue() {
      const first = PLAYLIST[0];
      const rest  = PLAYLIST.slice(1)
                             .map(s => ({ s, r: Math.random() }))
                             .sort((a, b) => a.r - b.r)
                             .map(x => x.s);
      return [first, ...rest];
    }

    let queue       = buildQueue();
    let queueIndex  = 0;
    let isPlaying   = false;
    const audio     = new Audio();
    audio.preload   = 'metadata';
    audio.volume    = 0.8;

    // ── Load a track by queue index ──
    function loadTrack(idx) {
      if (idx < 0) idx = queue.length - 1;
      if (idx >= queue.length) {
        // Reshuffle rest, keep first
        queue = buildQueue();
        idx   = 1; // skip to shuffled second (first already played)
      }
      queueIndex = idx;
      const track = queue[queueIndex];

      audio.src = track.file;
      titleEl.textContent  = track.title  || formatFileName(track.file);
      artistEl.textContent = track.artist || '🍪';

      // Marquee for long titles
      titleEl.classList.remove('long-title');
      void titleEl.offsetWidth; // reflow
      if (titleEl.scrollWidth > titleEl.offsetWidth + 4) {
        const dist = -(titleEl.scrollWidth - titleEl.offsetWidth + 20);
        titleEl.style.setProperty('--marquee-dist', dist + 'px');
        titleEl.classList.add('long-title');
      }

      // Disc emoji cycles through music notes
      const notes = ['🎵','🎶','🎼','🎹','🎸','💿'];
      discEl.textContent = notes[queueIndex % notes.length];

      progressFill.style.width = '0%';
      currentEl.textContent    = '0:00';
      durationEl.textContent   = '0:00';

      if (isPlaying) audio.play().catch(() => {});
    }

    // ── Format filename to readable title ──
    function formatFileName(path) {
      return path.split('/').pop()
                 .replace(/\.[^.]+$/, '')
                 .replace(/[-_]/g, ' ')
                 .replace(/\b\w/g, c => c.toUpperCase());
    }

    // ── Format seconds → m:ss ──
    function fmt(s) {
      if (!s || isNaN(s)) return '0:00';
      const m = Math.floor(s / 60);
      const sec = String(Math.floor(s % 60)).padStart(2, '0');
      return `${m}:${sec}`;
    }

    // ── Play / Pause ──
    function togglePlay() {
      if (!audio.src || audio.src === window.location.href) {
        loadTrack(0);
      }
      if (isPlaying) {
        audio.pause();
        isPlaying = false;
        musicIcon.textContent = '♪';
        player.classList.remove('playing');
        musicBtn.classList.remove('playing');
      } else {
        audio.play().then(() => {
          isPlaying = true;
          musicIcon.textContent = '⏸';
          player.classList.add('playing');
          musicBtn.classList.add('playing');
        }).catch(err => {
          console.warn('Playback blocked:', err);
          musicIcon.textContent = '♪';
        });
      }
    }

    // ── Next track ──
    function nextTrack() {
      loadTrack(queueIndex + 1);
      if (isPlaying) audio.play().catch(() => {});
    }

    // ── Prev track ──
    function prevTrack() {
      // If >3 seconds in, restart current; else go previous
      if (audio.currentTime > 3) {
        audio.currentTime = 0;
      } else {
        loadTrack(queueIndex - 1);
        if (isPlaying) audio.play().catch(() => {});
      }
    }

    // ── Progress update ──
    audio.addEventListener('timeupdate', () => {
      if (!audio.duration) return;
      const pct = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = pct + '%';
      currentEl.textContent    = fmt(audio.currentTime);
    });

    audio.addEventListener('loadedmetadata', () => {
      durationEl.textContent = fmt(audio.duration);
    });

    // ── Auto-advance when song ends ──
    audio.addEventListener('ended', () => {
      nextTrack();
    });

    // ── Seek on progress bar click ──
    progressBar.addEventListener('click', (e) => {
      if (!audio.duration) return;
      const rect = progressBar.getBoundingClientRect();
      const pct  = (e.clientX - rect.left) / rect.width;
      audio.currentTime = pct * audio.duration;
    });

    // ── Button listeners ──
    musicBtn.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', nextTrack);
    prevBtn.addEventListener('click', prevTrack);

    // ── Keyboard shortcut: Space = play/pause (when not typing) ──
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
      if (e.code === 'ArrowRight') nextTrack();
      if (e.code === 'ArrowLeft')  prevTrack();
    });

    // ── Pre-load first track info without playing ──
    loadTrack(0);
    audio.pause(); // don't autoplay until user clicks

  })();

  /* ───────────────────────────────────────
     EXTRA: Nebula glow background blobs
     Add soft pulsing radial blobs behind
     the glassmorphism sections
     ─────────────────────────────────────── */
  function addNebulaBg() {
    const sects = ['#story','#memories','#reasons','#dreams','#secret','#finale'];
    sects.forEach((sel, i) => {
      const el = document.querySelector(sel);
      if (!el) return;
      const blob = document.createElement('div');
      blob.style.cssText = `
        position:absolute; border-radius:50%; pointer-events:none;
        z-index:0; filter:blur(80px); mix-blend-mode:screen;
        animation: nebulaPulse ${5 + i}s ease-in-out infinite;
        animation-delay:${i * 0.7}s;
      `;
      const configs = [
        { w:'500px',h:'500px',top:'10%',left:'5%',  bg:'radial-gradient(circle,rgba(255,110,180,0.15),transparent)'},
        { w:'600px',h:'400px',top:'30%',right:'0',  bg:'radial-gradient(circle,rgba(168,85,247,0.12),transparent)'},
        { w:'450px',h:'450px',bottom:'10%',left:'15%',bg:'radial-gradient(circle,rgba(192,132,252,0.1),transparent)'},
        { w:'700px',h:'300px',top:'20%',left:'20%', bg:'radial-gradient(circle,rgba(255,110,180,0.08),transparent)'},
        { w:'400px',h:'400px',top:'50%',right:'10%',bg:'radial-gradient(circle,rgba(168,85,247,0.1),transparent)'},
        { w:'600px',h:'600px',top:'5%',left:'15%',  bg:'radial-gradient(circle,rgba(255,110,180,0.1),transparent)'},
      ];
      const c = configs[i % configs.length];
      Object.assign(blob.style, c);
      el.style.position = 'relative';
      el.prepend(blob);
    });
  }
  addNebulaBg();

  /* ───────────────────────────────────────
     MOBILE: Touch-based card tilt
     ─────────────────────────────────────── */
  document.querySelectorAll('.timeline-card, .memory-card').forEach(card => {
    card.addEventListener('touchmove', (e) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (touch.clientX - cx) / (rect.width  / 2);
      const dy    = (touch.clientY - cy) / (rect.height / 2);
      gsap.to(card, {
        rotateX: -dy * 5,
        rotateY:  dx * 5,
        duration: 0.3, ease: 'power2.out',
        transformPerspective: 800,
      });
    }, { passive: true });

    card.addEventListener('touchend', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power3.out' });
    });
  });

  console.log('%c🍪 Welcome to Himanshi & Yours — A Galaxy Love Story 🍪',
    'font-size:18px;color:#ff6eb4;font-family:serif;');
  console.log('%cFind all 10 hidden hearts to unlock a surprise, Cookieee! 💌',
    'font-size:12px;color:#c084fc;font-family:serif;');

}); // end DOMContentLoaded
