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

  /* State */
  let rotX = 8, rotY = 0;
  let velX = 0, velY = 0;
  let isDragging = false;
  let lastX = 0, lastY = 0;
  let rafId = null;
  let idleId = null;
  let idleOn = false;
  let idleT = 0;
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
    idleT = 0;
    (function tick() {
      if (!idleOn) return;
      idleT += 0.006;
      rotY = Math.sin(idleT) * 20;
      rotX = 8;
      render();
      idleId = requestAnimationFrame(tick);
    })();
  }
  function stopIdle() {
    idleOn = false;
    cancelAnimationFrame(idleId);
  }

  /* ── Drag ── */
  function onStart(x, y) {
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
        setTimeout(startIdle, 2500);
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
      setTimeout(startIdle, 1500);
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
      setTimeout(() => { render(); startIdle(); }, 800);
    } else {
      stopIdle();
      cancelAnimationFrame(rafId);
    }
  }).observe(sheet, { attributes: true, attributeFilter: ['class'] });
})();
