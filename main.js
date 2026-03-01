'use strict';

/* ── LANGUAGE TOGGLE ────────────────────────────────── */

function setLang(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const isActive = btn.dataset.lang === lang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });
  try { localStorage.setItem('cu-lang', lang); } catch (_) {}
}

// Init from saved preference, default Thai
setLang((() => { try { return localStorage.getItem('cu-lang') || 'th'; } catch(_) { return 'th'; } })());

document.addEventListener('click', e => {
  const langBtn = e.target.closest('.lang-btn');
  if (langBtn && langBtn.dataset.lang) {
    setLang(langBtn.dataset.lang);
    return;
  }

  /* ── Sheet open ── */
  const trigger = e.target.closest('[data-sheet]');
  if (trigger) { openSheet(trigger.dataset.sheet); return; }

  /* ── Sheet close ── */
  if (e.target.closest('[data-close]')) {
    const sheet = e.target.closest('.sheet');
    if (sheet) closeSheet(sheet);
  }
});

/* ── SHEET OPEN / CLOSE ─────────────────────────────── */

function openSheet(id) {
  const sheet = document.getElementById('sheet-' + id);
  if (!sheet) return;
  sheet.classList.add('open');
  const panel = sheet.querySelector('.sheet-panel');
  if (panel) panel.scrollTop = 0;
}

function closeSheet(sheet) {
  sheet.classList.remove('open');
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.sheet.open').forEach(closeSheet);
  }
});

/* ── SWIPE DOWN TO DISMISS ──────────────────────────── */
document.querySelectorAll('.sheet-panel').forEach(panel => {
  let startY = 0;
  let dragging = false;

  panel.addEventListener('touchstart', e => {
    if (panel.scrollTop === 0) {
      startY = e.touches[0].clientY;
      dragging = true;
    }
  }, { passive: true });

  panel.addEventListener('touchmove', e => {
    if (!dragging) return;
    const dy = e.touches[0].clientY - startY;
    if (dy > 0) {
      panel.style.transform = `translateY(${Math.round(dy)}px)`;
      panel.style.transition = 'none';
    }
  }, { passive: true });

  panel.addEventListener('touchend', e => {
    if (!dragging) return;
    dragging = false;
    const dy = e.changedTouches[0].clientY - startY;
    panel.style.transition = '';
    panel.style.transform = '';
    if (dy > 72) {
      const sheet = panel.closest('.sheet');
      if (sheet) closeSheet(sheet);
    }
  });
});

/* ── PROFILE PHOTO LIGHTBOX ─────────────────────────── */
(function () {
  const trigger  = document.getElementById('profile-photo');
  const lightbox = document.getElementById('lightbox-photo');
  if (!trigger || !lightbox) return;

  function open()  { lightbox.classList.add('open'); }
  function close() { lightbox.classList.remove('open'); }

  trigger.addEventListener('click', open);
  trigger.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open(); });
  lightbox.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ── 3D CARD VIEWER ─────────────────────────────────── */
(function () {
  const sheet = document.getElementById('sheet-idcard');
  const scene = document.getElementById('card3d-scene');
  const card  = document.getElementById('card3d');
  if (!sheet || !scene || !card) return;

  const faces = card.querySelectorAll('.card3d-gloss');

  /* ── Generate Z-stacked slices for smooth 3D rounded corners ── */
  /* Slices are full rounded-rectangles at different Z depths.       */
  /* They fill the corner zones where shortened edge panels don't.   */
  (function generateSlices() {
    const HALF = 4;                       // half-thickness
    const firstEdge = card.querySelector('.card3d-edge');
    for (let z = -HALF + 0.5; z <= HALF - 0.5; z += 1) {
      const sl = document.createElement('div');
      sl.className = 'card3d-slice';
      sl.style.transform = 'translateZ(' + z + 'px)';
      card.insertBefore(sl, firstEdge);   // behind edges, behind faces
    }
  })();

  /* State */
  let rotX = 8, rotY = 0;
  let velX = 0, velY = 0;
  let isDragging = false;
  let lastX = 0, lastY = 0;
  let rafId = null;
  let idleId = null;
  let idleOn = false;
  let idleT = 0;
  let idleTimerId = null;   /* covers ALL deferred startIdle calls */
  let openTimerId  = null;  /* covers the post-open render+startIdle */
  let lastTap = 0;
  let flipped = false;

  /* ── Render ── */
  function render(transition) {
    const base = flipped ? 180 : 0;
    card.style.transition = transition || 'none';
    card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY + base}deg)`;
    /* Gloss: map tilt to a specular highlight position */
    const gx = 50 + rotY * 0.5;
    const gy = 50 - rotX * 1.2;
    faces.forEach(f => {
      f.style.setProperty('--gx', `${Math.max(5, Math.min(95, gx))}%`);
      f.style.setProperty('--gy', `${Math.max(5, Math.min(95, gy))}%`);
    });
  }

  /* ── Idle sway (gentle left-right oscillation, front-facing) ── */
  function startIdle() {
    if (idleOn) return;
    idleOn = true;
    /* Smoothly settle from current rotation to idle start before swaying */
    var fromX = rotX, fromY = rotY, t = 0;
    (function settle() {
      if (!idleOn) return;
      t += 0.025;                              /* ~40 frames to settle */
      if (t >= 1) {
        rotX = 8; rotY = 0; idleT = 0;
        (function tick() {
          if (!idleOn) return;
          idleT += 0.006;
          rotY = Math.sin(idleT) * 30;  /* ±30° so edge thickness is clearly visible */
          rotX = 8;
          render();
          idleId = requestAnimationFrame(tick);
        })();
        return;
      }
      var ease = 1 - Math.pow(1 - t, 3);      /* cubic ease-out */
      rotX = fromX + (8 - fromX) * ease;
      rotY = fromY + (0 - fromY) * ease;
      render();
      idleId = requestAnimationFrame(settle);
    })();
  }
  function stopIdle() {
    idleOn = false;
    cancelAnimationFrame(idleId);
  }
  /* Cancel every pending deferred startIdle before starting a new interaction */
  function cancelPendingIdle() {
    clearTimeout(idleTimerId);
    clearTimeout(openTimerId);
  }

  /* ── Drag ── */
  function onStart(x, y) {
    cancelPendingIdle();   /* ← prevents the open-timer firing mid-drag */
    stopIdle();
    cancelAnimationFrame(rafId);
    isDragging = true;
    lastX = x; lastY = y;
    velX = 0; velY = 0;
  }
  function onMove(x, y) {
    if (!isDragging) return;
    const dx = x - lastX;
    const dy = y - lastY;
    velX = dx;
    velY = dy;
    rotY += dx * 0.55;
    rotX -= dy * 0.55;
    rotX = Math.max(-60, Math.min(60, rotX));
    lastX = x; lastY = y;
    render();
  }
  function onEnd() {
    if (!isDragging) return;
    isDragging = false;
    /* Momentum decay */
    (function decay() {
      velX *= 0.91;
      velY *= 0.91;
      rotY += velX * 0.55;
      rotX -= velY * 0.55;
      rotX = Math.max(-60, Math.min(60, rotX));
      render();
      if (Math.abs(velX) > 0.15 || Math.abs(velY) > 0.15) {
        rafId = requestAnimationFrame(decay);
      } else {
        idleTimerId = setTimeout(startIdle, 2500);
      }
    })();
  }

  /* ── Double-tap to flip ── */
  function onTap(x, y) {
    const now = Date.now();
    if (now - lastTap < 300) {
      flipped = !flipped;
      stopIdle();
      render('transform 0.55s cubic-bezier(0.34,1.2,0.64,1)');
      idleTimerId = setTimeout(startIdle, 1500);
    }
    lastTap = now;
  }

  /* ── Mouse events ── */
  scene.addEventListener('mousedown', e => { e.preventDefault(); onStart(e.clientX, e.clientY); });
  window.addEventListener('mousemove', e => { if (isDragging) onMove(e.clientX, e.clientY); });
  window.addEventListener('mouseup', onEnd);
  scene.addEventListener('click', e => onTap(e.clientX, e.clientY));

  /* ── Touch events ── */
  scene.addEventListener('touchstart', e => {
    onStart(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  scene.addEventListener('touchmove', e => {
    e.preventDefault();
    onMove(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: false });
  scene.addEventListener('touchend', e => {
    onEnd();
    onTap(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
  }, { passive: true });

  /* ── Sheet open / close ── */
  new MutationObserver(() => {
    if (sheet.classList.contains('open')) {
      /* Spring-in to centre, then start gentle sway */
      rotX = 8; rotY = 0; flipped = false;
      render('transform 0.7s cubic-bezier(0.34,1.4,0.64,1)');
      openTimerId = setTimeout(() => {
        if (!isDragging) { render(); startIdle(); }
      }, 800);
    } else {
      cancelPendingIdle();
      stopIdle();
      cancelAnimationFrame(rafId);
    }
  }).observe(sheet, { attributes: true, attributeFilter: ['class'] });
})();

/* ── TOAST ───────────────────────────────────────────── */
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._tid);
  toast._tid = setTimeout(() => toast.classList.remove('show'), 2200);
}

/* ── SHARE ───────────────────────────────────────────── */
(function () {
  const btn = document.getElementById('share-btn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const payload = {
      title: 'กรวิชญ์ ฉ่ำไกร · Chulalongkorn University',
      text:  'Graduate Scholar of Finance, Faculty of Economics, CU',
      url:   location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(payload);
      } else {
        await navigator.clipboard.writeText(location.href);
        showToast('Link copied!');
      }
    } catch (_) {}
  });
})();

/* ── COPY STUDENT ID ─────────────────────────────────── */
(function () {
  const btn = document.getElementById('copy-id-btn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const text = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(text);
    } catch (_) {
      /* execCommand fallback for older browsers */
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    btn.classList.add('copied');
    showToast('Student ID copied');
    clearTimeout(btn._tid);
    btn._tid = setTimeout(() => btn.classList.remove('copied'), 2200);
  });
})();

/* ── GYROSCOPE PARALLAX ──────────────────────────────── */
(function () {
  const photo = document.getElementById('profile-photo');
  if (!photo) return;

  function onOrientation(e) {
    if (e.gamma === null || e.beta === null) return;
    /* gamma = left/right tilt, beta = front/back tilt
       Normalise beta: typical phone held upright ≈ 45-70°   */
    const x = Math.max(-28, Math.min(28, e.gamma));
    const y = Math.max(-28, Math.min(28, e.beta - 50));
    /* scale(1.05) gives overflow room; id-card clips via overflow:hidden */
    photo.style.transform = `translate(${(x * 0.38).toFixed(2)}px, ${(y * 0.28).toFixed(2)}px) scale(1.05)`;
  }

  function startGyro() {
    window.addEventListener('deviceorientation', onOrientation, { passive: true });
  }

  if (typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
    /* iOS 13+ — request on first user touch anywhere on the page */
    document.addEventListener('touchstart', function ask() {
      document.removeEventListener('touchstart', ask);
      DeviceOrientationEvent.requestPermission()
        .then(s => { if (s === 'granted') startGyro(); })
        .catch(() => {});
    }, { once: true, passive: true });
  } else if (typeof DeviceOrientationEvent !== 'undefined') {
    startGyro();
  }
})();
