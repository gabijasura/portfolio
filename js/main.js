/* ════════════════════════════
   Portfolio — main.js
   ════════════════════════════ */

/* ─── Cursor ─── */
(function() {
  const canvas = document.querySelector('.cursor-canvas');
  if (!canvas) return;
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
    { name: 'FLAME',     media: 'assets/flame-opt.gif', type: 'img', url: 'passion.html' },
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
    const container = video.parentElement;
    container.style.position = 'relative';

    const bar = document.createElement('div');
    bar.className = 'vid-controls';

    const playBtn = document.createElement('button');
    playBtn.className = 'vid-btn vid-play';
    playBtn.textContent = '❚❚';
    playBtn.title = 'Play / Pause';

    const muteBtn = document.createElement('button');
    muteBtn.className = 'vid-btn vid-mute';
    muteBtn.textContent = '🔇';
    muteBtn.title = 'Mute / Unmute';

    bar.appendChild(playBtn);
    bar.appendChild(muteBtn);
    container.appendChild(bar);

    playBtn.addEventListener('click', () => {
      if (video.paused) { video.play(); } else { video.pause(); }
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
