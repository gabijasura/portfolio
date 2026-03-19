/* ════════════════════════════
   Portfolio — main.js
   ════════════════════════════ */

/* ─── Cursor ─── */
(function() {
  const cursor = document.querySelector('.cursor');
  if (!cursor) return;
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });
  document.querySelectorAll('a, button, .playing-card, .work-thumb, .chip-link, .slot-lever, .horseshoe-btn, .slot-reel').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
})();

/* ─── Slot Machine ─── */
(function() {
  const projects = [
    { name: 'THE FROG',          media: 'assets/frog.gif',           type: 'img',   url: 'frog.html' },
    { name: 'MUSHROOM FESTIVAL', media: 'assets/mushroom.mp4',       type: 'video', url: 'mushroom.html' },
    { name: 'PASS THE BALL',     media: 'assets/ball-small.mp4',     type: 'video', url: 'ball.html' },
    { name: 'NIGHTFALL',         media: 'assets/nightfall-opt.gif',  type: 'img',   url: 'nightfall.html' },
    { name: 'FENYX',             media: 'assets/fenyx.mp4',          type: 'video', url: 'fenyx.html' },
    { name: 'PASSION',           media: 'assets/flame-opt.gif',      type: 'img',   url: 'passion.html' },
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
    video.currentTime = startTime;
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

/* ─── Floating elements parallax on mousemove ─── */
(function() {
  const floats = document.querySelectorAll('.hero-float');
  if (!floats.length) return;
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
