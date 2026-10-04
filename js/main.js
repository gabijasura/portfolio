/* ════════════════════════════
   Portfolio — main.js
   ════════════════════════════ */

/* Touch devices (phones, tablets) have no mouse — skip cursor/hover effects */
const IS_TOUCH = window.matchMedia('(hover: none), (pointer: coarse)').matches;
if (IS_TOUCH) document.documentElement.classList.add('touch');

/* ─── Cursor ─── */
(function() {
  const canvas = document.querySelector('.cursor-canvas');
  if (!canvas) return;
  if (IS_TOUCH) { canvas.remove(); return; }
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  let mx = 0, my = 0;
  let glitching = false;
  let glitchOffsetX = 0, glitchOffsetY = 0;

  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function drawArrow(x, y, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.strokeStyle = 'rgba(0,0,0,0.8)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + 20);
    ctx.lineTo(x + 4, y + 14);
    ctx.lineTo(x + 8, y + 22);
    ctx.lineTo(x + 10, y + 21);
    ctx.lineTo(x + 6, y + 13);
    ctx.lineTo(x + 12, y + 13);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (glitching) {
      drawArrow(mx - glitchOffsetX - 2, my + glitchOffsetY, 'rgba(0, 220, 255, 0.85)', 0.9);
      drawArrow(mx + glitchOffsetX + 2, my - glitchOffsetY, 'rgba(100, 255, 80, 0.85)', 0.9);
    } else {
      drawArrow(mx - 1.5, my, 'rgba(0, 220, 255, 0.4)', 0.5);
      drawArrow(mx + 1.5, my, 'rgba(100, 255, 80, 0.4)', 0.5);
    }
    drawArrow(mx, my, 'white', 1);
    requestAnimationFrame(render);
  }
  render();

  function triggerGlitch() {
    glitching = true;
    glitchOffsetX = 4 + Math.random() * 8;
    glitchOffsetY = (Math.random() - 0.5) * 4;
    setTimeout(() => {
      glitching = false;
      setTimeout(triggerGlitch, 800 + Math.random() * 2500);
    }, 60 + Math.random() * 120);
  }
  triggerGlitch();
})();

/* ─── Slot Machine ─── */
(function() {
  const projects = [
    { name: 'THE FROG',  media: 'assets/frog.gif',      type: 'img', url: 'frog.html' },
    { name: 'FLAME',     media: 'GIF/Flame.gif',        type: 'img', url: 'passion.html' },
    { name: 'DUCK',      media: 'assets/duck.gif',      type: 'img', url: 'duck.html' },
  ];

  const reels   = [...document.querySelectorAll('.slot-reel')];
  const lever   = document.querySelector('.slot-lever');
  if (!reels.length || !lever) return;

  let spinning = false;

  // Reels start with their hardcoded GIFs (set in HTML) — no JS init needed

  function setReel(reel, project) {
    const inner = reel.querySelector('.slot-reel-inner');
    inner.innerHTML = '';
    if (project.type === 'video') {
      const v = document.createElement('video');
      v.src = project.media;
      v.autoplay = true;
      v.loop = true;
      v.muted = true;
      v.playsInline = true;
      inner.appendChild(v);
    } else {
      const img = document.createElement('img');
      img.src = project.media;
      img.alt = project.name;
      inner.appendChild(img);
    }
    const link = reel.querySelector('.slot-reel-link');
    if (link) {
      link.querySelector('span').textContent = project.name;
      link.href = project.url;
    }
    reel._project = project;
  }

  function spin() {
    if (spinning) return;
    spinning = true;

    // Pull lever animation
    lever.classList.add('pulling');
    setTimeout(() => lever.classList.remove('pulling'), 400);

    // Remove landed state
    reels.forEach(r => r.classList.remove('landed'));


    // Spin each reel, staggered stop
    reels.forEach((reel, i) => {
      reel.classList.add('spinning');
      const stopDelay = 900 + i * 500;

      // Flash through random images while spinning
      let flashInterval = setInterval(() => {
        const p = projects[Math.floor(Math.random() * projects.length)];
        const inner = reel.querySelector('.slot-reel-inner');
        if (inner.firstChild && inner.firstChild.tagName === 'IMG') {
          inner.firstChild.src = p.media;
        }
      }, 100);

      setTimeout(() => {
        clearInterval(flashInterval);
        reel.classList.remove('spinning');
        reel.classList.add('landed');
        // Pick final project
        const picked = projects[Math.floor(Math.random() * projects.length)];
        setReel(reel, picked);
        if (i === reels.length - 1) spinning = false;
      }, stopDelay);
    });
  }

  lever.addEventListener('click', spin);
  // Also allow clicking any reel to spin
  reels.forEach(reel => {
    reel.addEventListener('click', () => {
      if (!spinning && reel.classList.contains('landed')) {
        window.location.href = reel._project?.url || 'work.html';
      } else {
        spin();
      }
    });
  });
})();

/* ─── Play videos only while on screen ───
   Videos marked data-lazy (or autoplay) play when visible and pause
   when scrolled away — saves battery and data, especially on mobile. */
window.lazyPlay = (function() {
  if (!('IntersectionObserver' in window)) {
    return v => { v.muted = true; v.play().catch(() => {}); };
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) {
        if (v.dataset.userPaused) return;
        v.play().catch(() => {});
      } else if (!v.paused) {
        v.pause();
        delete v.dataset.userPaused;
      }
    });
  }, { threshold: 0.25 });
  return v => {
    v.muted = true;
    v.playsInline = true;
    obs.observe(v);
  };
})();
document.querySelectorAll('video[data-lazy], video[autoplay]').forEach(v => {
  if (v.closest('.hero-cards') && window.innerWidth > 768) return; // desktop card fan is always visible
  window.lazyPlay(v);
});

/* ─── Nav background once the page is scrolled (readability on mobile) ─── */
(function() {
  const nav = document.querySelector('body > nav');
  if (!nav) return;
  const update = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ─── Scroll reveal ─── */
(function() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
})();

/* ─── Work section: hover-to-play videos ─── */
(function() {
  document.querySelectorAll('.work-thumb').forEach(thumb => {
    const video = thumb.querySelector('video');
    if (!video) return;
    const startTime = parseFloat(video.dataset.start) || 0;
    const seekToStart = () => { video.currentTime = startTime; };
    if (video.readyState >= 1) {
      seekToStart();
    } else {
      video.addEventListener('loadedmetadata', seekToStart, { once: true });
    }
    thumb.addEventListener('mouseenter', () => {
      video.currentTime = startTime;
      video.play().catch(() => {});
    });
    thumb.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = startTime;
    });
  });
})();

/* ─── Project page video controls ─── */
(function() {
  document.querySelectorAll('video').forEach(video => {
    if (video.closest('.work-thumb')) return; // skip work page thumbnails
    if (video.closest('.hero-cards'))  return; // skip hero playing cards
    if (video.closest('.slot-section')) return; // skip slot machine
    const container = video.parentElement;
    container.style.position = 'relative';

    const bar = document.createElement('div');
    bar.className = 'vid-controls';

    const playBtn = document.createElement('button');
    playBtn.className = 'vid-btn vid-play';
    playBtn.textContent = (video.paused && !video.autoplay) ? '▶' : '❚❚';
    playBtn.title = 'Play / Pause';

    const muteBtn = document.createElement('button');
    muteBtn.className = 'vid-btn vid-mute';
    muteBtn.textContent = '🔇';
    muteBtn.title = 'Mute / Unmute';

    bar.appendChild(playBtn);
    bar.appendChild(muteBtn);
    container.appendChild(bar);

    playBtn.addEventListener('click', () => {
      if (video.paused) { delete video.dataset.userPaused; video.play(); }
      else { video.dataset.userPaused = '1'; video.pause(); }
    });
    muteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      muteBtn.textContent = video.muted ? '🔇' : '🔊';
    });
    video.addEventListener('play',  () => { playBtn.textContent = '❚❚'; });
    video.addEventListener('pause', () => { playBtn.textContent = '▶'; });
  });

  // vid-btn hover scaling handled by the global cursor IIFE above
})();

/* ─── Floating elements parallax on mousemove ─── */
(function() {
  const floats = document.querySelectorAll('.hero-float');
  if (!floats.length || IS_TOUCH) return;
  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    floats.forEach((el, i) => {
      const factor = (i + 1) * 8;
      el.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
  });
})();

/* ─── Mobile menu: hamburger + full-screen overlay (built from the nav links) ─── */
(function() {
  const nav = document.querySelector('body > nav');
  const list = nav && nav.querySelector('.nav-links');
  if (!list) return;

  const btn = document.createElement('button');
  btn.className = 'nav-toggle';
  btn.setAttribute('aria-label', 'Open menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<span></span><span></span>';
  nav.appendChild(btn);

  const menu = document.createElement('div');
  menu.className = 'mobile-menu';
  menu.innerHTML =
    '<ul>' +
    '<li><a href="index.html">Home</a></li>' +
    [...list.querySelectorAll('a')].map(a => `<li><a href="${a.getAttribute('href')}">${a.textContent}</a></li>`).join('') +
    '</ul>' +
    '<a class="mobile-menu-mail" href="mailto:gabijasura@gmail.com">gabijasura@gmail.com</a>';
  document.body.appendChild(menu);

  const here = location.pathname.split('/').pop() || 'index.html';
  menu.querySelectorAll('li a').forEach(a => {
    if (a.getAttribute('href') === here) a.classList.add('is-current');
  });

  function toggle(open) {
    document.body.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  btn.addEventListener('click', () => toggle(!document.body.classList.contains('menu-open')));
  menu.addEventListener('click', e => { if (e.target.closest('a')) toggle(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
})();
