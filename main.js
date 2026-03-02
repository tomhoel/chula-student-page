'use strict';

/* ── LIVE DATE BADGE ─────────────────────────────────── */
(function () {
  const el = document.getElementById('vr-date');
  if (!el) return;
  const now = new Date();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  el.textContent = now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();
})();

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
  const lightbox = document.getElementById('lightbox-photo');
  if (!lightbox) return;

  function open() { lightbox.classList.add('open'); }
  function close() { lightbox.classList.remove('open'); }

  /* Direct listener on the photo — stopPropagation prevents cheat panel */
  const photo = document.getElementById('profile-photo');
  if (photo) {
    photo.addEventListener('click', function (e) {
      e.stopPropagation();
      open();
    });
    photo.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  }

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

  /* ── Card data ── */
  const CARDS = {
    student:  { front: 'id_front.png',     back: 'id_back.png',     w: 190, h: 301 },
    national: { front: 'thaiid_front.png', back: 'thaiid_back.png', w: 280, h: 177 }
  };
  const frontImg = document.getElementById('c3d-front-img');
  const backImg  = document.getElementById('c3d-back-img');
  const fadeEl   = document.getElementById('card3d-fade');

  /* ── Generate Z-stacked slices for smooth 3D rounded corners ── */
  (function generateSlices() {
    const HALF = 4;
    const firstEdge = card.querySelector('.card3d-edge');
    for (let z = -HALF + 0.5; z <= HALF - 0.5; z += 1) {
      const sl = document.createElement('div');
      sl.className = 'card3d-slice';
      sl.style.transform = 'translateZ(' + z + 'px)';
      card.insertBefore(sl, firstEdge);
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
  let idleTimerId = null;
  let lastTap = 0;
  let flipped = false;

  /* ── Normalise rotY to -180..180 so return is always the shortest path ── */
  function normaliseRotY() {
    rotY = ((rotY % 360) + 360) % 360;
    if (rotY > 180) rotY -= 360;
  }

  /* ── Render ── */
  function render(transition) {
    const base = flipped ? 180 : 0;
    card.style.transition = transition || 'none';
    card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY + base}deg)`;
    const gx = 50 + rotY * 0.5;
    const gy = 50 - rotX * 1.2;
    faces.forEach(f => {
      f.style.setProperty('--gx', `${Math.max(5, Math.min(95, gx))}%`);
      f.style.setProperty('--gy', `${Math.max(5, Math.min(95, gy))}%`);
    });
  }

  /* ── Idle sway (immediate — used on sheet open) ── */
  function startIdleNow() {
    if (idleOn) return;
    idleOn = true;
    idleT = 0;
    (function tick() {
      if (!idleOn) return;
      idleT += 0.006;
      rotY = Math.sin(idleT) * 30;   /* ±30° — edge clearly visible */
      rotX = 8;
      render();
      idleId = requestAnimationFrame(tick);
    })();
  }

  /* ── Idle sway (after interaction — settles from current position first) ── */
  function startIdleFromCurrent() {
    if (idleOn) return;
    idleOn = true;
    normaliseRotY();   /* take shortest angular path back — no multi-spin */
    var fromX = rotX, fromY = rotY, t = 0;
    (function settle() {
      if (!idleOn) return;
      t += 0.04;                           /* ~25 frames ≈ 400 ms settle */
      if (t >= 1) {
        rotX = 8; rotY = 0; idleT = 0;
        (function tick() {
          if (!idleOn) return;
          idleT += 0.006;
          rotY = Math.sin(idleT) * 30;
          rotX = 8;
          render();
          idleId = requestAnimationFrame(tick);
        })();
        return;
      }
      var ease = 1 - Math.pow(1 - t, 3);   /* cubic ease-out */
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

  /* ── Drag ── */
  function onStart(x, y) {
    clearTimeout(idleTimerId);
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
    /* Momentum — higher friction coeff = longer satisfying spin */
    (function decay() {
      velX *= 0.94;
      velY *= 0.94;
      rotY += velX * 0.55;
      rotX -= velY * 0.55;
      rotX = Math.max(-60, Math.min(60, rotX));
      render();
      if (Math.abs(velX) > 0.12 || Math.abs(velY) > 0.12) {
        rafId = requestAnimationFrame(decay);
      } else {
        /* Normalise before settling so return is ≤180° rotation */
        normaliseRotY();
        idleTimerId = setTimeout(startIdleFromCurrent, 1200);
      }
    })();
  }

  /* ── Double-tap to flip ── */
  function onTap(x, y) {
    const now = Date.now();
    if (now - lastTap < 300) {
      flipped = !flipped;
      stopIdle();
      normaliseRotY();
      render('transform 0.55s cubic-bezier(0.34,1.2,0.64,1)');
      idleTimerId = setTimeout(startIdleFromCurrent, 1500);
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

  /* ── Switch between cards ── */
  function switchCard(type, instant) {
    var c = CARDS[type];
    if (!c) return;
    /* Update tab active state immediately */
    document.querySelectorAll('.idc-tab').forEach(function (b) {
      b.classList.toggle('idc-tab--active', b.dataset.card === type);
    });
    var doSwitch = function () {
      if (frontImg) frontImg.src = c.front;
      if (backImg)  backImg.src  = c.back;
      card.style.setProperty('--cw', c.w + 'px');
      card.style.setProperty('--ch', c.h + 'px');
      scene.style.setProperty('--cw', c.w + 'px');
      scene.style.setProperty('--ch', c.h + 'px');
      flipped = false; stopIdle();
      rotX = 8; rotY = 0;
      render('none');
      /* Toggle info panels */
      document.querySelectorAll('.idc-info').forEach(function (p) { p.hidden = true; });
      var infoEl = document.getElementById('idc-info-' + type);
      if (infoEl) infoEl.hidden = false;
      /* Fade back in */
      if (fadeEl) fadeEl.classList.remove('fading');
      clearTimeout(idleTimerId);
      idleTimerId = setTimeout(startIdleNow, 200);
    };
    if (instant || !fadeEl) {
      doSwitch();
    } else {
      if (fadeEl) fadeEl.classList.add('fading');
      clearTimeout(idleTimerId);
      idleTimerId = setTimeout(doSwitch, 165);
    }
  }

  /* ── Tab click handlers ── */
  document.querySelectorAll('.idc-tab').forEach(function (btn) {
    btn.addEventListener('click', function () { switchCard(btn.dataset.card); });
  });

  /* ── Sheet open / close ── */
  new MutationObserver(function () {
    if (sheet.classList.contains('open')) {
      switchCard('student', true);
    } else {
      clearTimeout(idleTimerId);
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

/* ── PROFILE PHOTO STATIC (no parallax) ───────────────── */
/* Photo remains completely static - no movement effects */

/* ── BAR ANIMATION — re-animate fills on each sheet open ── */
(function () {
  const FILL_SEL = '.ag-bar-fill, .ag-trend-fill, .ag-dist-fill, .sp-bar-fill, .sp-fitness-fill';

  ['sheet-academic', 'sheet-activities'].forEach(id => {
    const sheet = document.getElementById(id);
    if (!sheet) return;

    new MutationObserver(() => {
      if (!sheet.classList.contains('open')) return;
      /* Reset widths instantly so the CSS transition replays on re-open */
      sheet.querySelectorAll(FILL_SEL).forEach(el => {
        el.style.transition = 'none';
        el.style.width = '0';
      });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          sheet.querySelectorAll(FILL_SEL).forEach(el => {
            el.style.transition = '';
            el.style.width = '';
          });
        });
      });
    }).observe(sheet, { attributes: true, attributeFilter: ['class'] });
  });
})();

/* ── CHEAT PANEL — CU Internal Intelligence System ── */
(function () {
  const idCard   = document.getElementById('id-card-main');
  const panel    = document.getElementById('cheat-panel');
  const scrim    = document.getElementById('cheat-scrim');
  const closeBtn = document.getElementById('cheat-close');
  if (!idCard || !panel) return;

  function updateTimestamp() {
    const el = document.getElementById('cp-timestamp');
    if (!el) return;
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    el.textContent =
      now.getFullYear() + '-' +
      pad(now.getMonth() + 1) + '-' +
      pad(now.getDate()) + ' ' +
      pad(now.getHours()) + ':' +
      pad(now.getMinutes()) + ':' +
      pad(now.getSeconds()) + ' ICT';
  }

  idCard.addEventListener('click', e => {
    /* Don't open panel when tapping the photo — let lightbox handle that */
    if (e.target.closest('.id-photo-col')) return;
    panel.classList.add('open');
    updateTimestamp();
    /* Re-animate bars every time panel opens */
    panel.querySelectorAll('.cp-bar-fill').forEach(el => {
      el.style.transition = 'none';
      el.style.width = '0';
    });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        panel.querySelectorAll('.cp-bar-fill').forEach(el => {
          el.style.transition = '';
          el.style.width = '';
        });
      });
    });
  });

  function closePanel() { panel.classList.remove('open'); }

  if (closeBtn) closeBtn.addEventListener('click', closePanel);
  if (scrim)    scrim.addEventListener('click', closePanel);

  /* Tab switching */
  panel.addEventListener('click', e => {
    const tab = e.target.closest('.cp-tab');
    if (!tab) return;
    const target = tab.dataset.cpTab;
    panel.querySelectorAll('.cp-tab').forEach(t => {
      t.classList.remove('cp-tab-active');
      t.setAttribute('aria-selected', 'false');
    });
    panel.querySelectorAll('.cp-tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('cp-tab-active');
    tab.setAttribute('aria-selected', 'true');
    const content = document.getElementById('cptab-' + target);
    if (content) {
      content.classList.add('active');
      /* Re-animate bars in newly shown tab */
      content.querySelectorAll('.cp-bar-fill').forEach(el => {
        el.style.transition = 'none';
        el.style.width = '0';
      });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          content.querySelectorAll('.cp-bar-fill').forEach(el => {
            el.style.transition = '';
            el.style.width = '';
          });
        });
      });
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && panel.classList.contains('open')) closePanel();
  });
})();

/* ══════════════════════════════════════════════════════
   ATHLETIC PROFILE — RADAR ANIMATION
══════════════════════════════════════════════════════ */
(function () {
  const sheet   = document.getElementById('sheet-activities');
  const poly    = document.getElementById('sp-radar-poly');
  const dots    = Array.from(document.querySelectorAll('.sp-radar-dot'));
  if (!sheet || !poly || !dots.length) return;

  /* Target vertex positions [cx, cy] for each axis */
  const TARGET = [
    [100,  42.8 ],  /* Speed 88      — top       */
    [146.2, 73.35], /* Endurance 82  — top-right  */
    [142.8,124.7 ], /* Strength 76   — bot-right  */
    [100,  156.55], /* Agility 87    — bottom     */
    [ 48.8,129.6 ], /* Technique 91  — bot-left   */
    [ 46.5, 69.1 ], /* Teamwork 95   — top-left   */
  ];

  let animated = false;

  function easeOutBack(t) {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  function animateRadar() {
    if (animated) return;
    animated = true;

    const DURATION = 950;
    const start    = performance.now();

    function frame(now) {
      const elapsed = now - start;
      const t = Math.min(elapsed / DURATION, 1);
      const e = easeOutBack(t);

      /* Animate polygon points from center outward */
      const pts = TARGET.map(([tx, ty]) =>
        `${(100 + (tx - 100) * e).toFixed(1)},${(100 + (ty - 100) * e).toFixed(1)}`
      ).join(' ');
      poly.setAttribute('points', pts);

      /* Animate each dot with staggered delay */
      dots.forEach(function (dot, i) {
        const delay  = i * 90;
        const dotT   = Math.min(Math.max((elapsed - delay) / (DURATION * 0.65), 0), 1);
        const de     = easeOutBack(dotT);
        const [tx, ty] = TARGET[i];
        dot.setAttribute('cx', (100 + (tx - 100) * de).toFixed(1));
        dot.setAttribute('cy', (100 + (ty - 100) * de).toFixed(1));
        dot.setAttribute('r',  (3.2 * de).toFixed(2));
      });

      if (t < 1) requestAnimationFrame(frame);
    }

    /* Reset to center before animating */
    poly.setAttribute('points', '100,100 100,100 100,100 100,100 100,100 100,100');
    dots.forEach(function (d) {
      d.setAttribute('cx', '100');
      d.setAttribute('cy', '100');
      d.setAttribute('r',  '0');
    });

    requestAnimationFrame(frame);
  }

  new MutationObserver(function () {
    if (sheet.classList.contains('open')) {
      /* Delay slightly so the sheet slide-in has started */
      setTimeout(animateRadar, 380);
    } else {
      animated = false; /* allow replay on next open */
    }
  }).observe(sheet, { attributes: true, attributeFilter: ['class'] });
})();


/* ═══════════════════════════════════════════════════════
   ATHLETIC PROFILE — SP TAB SWITCHING
═══════════════════════════════════════════════════════ */
(function () {
  var sheet = document.getElementById('sheet-activities');
  if (!sheet) return;

  /* Count-up animation for sport card numbers */
  function spCountUp(el) {
    var target = parseFloat(el.dataset.count);
    var decimals = parseInt(el.dataset.decimals || '0', 10);
    var duration = 700;
    var startTime = null;
    function frame(now) {
      if (!startTime) startTime = now;
      var progress = Math.min((now - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function runOverviewAnimations() {
    document.querySelectorAll('#sptab-overview [data-count]').forEach(spCountUp);
  }

  sheet.addEventListener('click', function (e) {
    var tab = e.target.closest('.sp-tab');
    if (!tab) return;
    var target = tab.dataset.spTab;

    sheet.querySelectorAll('.sp-tab').forEach(function (t) {
      t.classList.remove('sp-tab--active');
      t.setAttribute('aria-selected', 'false');
    });
    sheet.querySelectorAll('.sp-tab-panel').forEach(function (c) {
      c.classList.remove('active');
    });

    tab.classList.add('sp-tab--active');
    tab.setAttribute('aria-selected', 'true');
    var content = document.getElementById('sptab-' + target);
    if (content) content.classList.add('active');

    if (target === 'overview') {
      runOverviewAnimations();
    }
  });

  /* Run on initial load — overview is active by default */
  runOverviewAnimations();
})();

/* ══════════════════════════════════════════════════════
   ATHLETIC PROFILE — FITNESS RING ANIMATION
══════════════════════════════════════════════════════ */
(function () {
  var spSheet = document.getElementById('sheet-activities');
  if (!spSheet) return;

  var spRingAnimated = false;

  function animateSpRing() {
    var ring = spSheet.querySelector('.sp-ring-fill');
    if (ring && !spRingAnimated) {
      spRingAnimated = true;
      setTimeout(function () {
        ring.style.strokeDashoffset = '26.14'; /* 87/100 = 87% filled; 201.06 * 0.13 = 26.14 */
      }, 120);
    }
  }

  function resetSpRing() {
    var ring = spSheet.querySelector('.sp-ring-fill');
    if (ring) {
      ring.style.strokeDashoffset = '201.06';
      spRingAnimated = false;
    }
  }

  var spObs = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      if (m.attributeName === 'class') {
        if (spSheet.classList.contains('open')) {
          animateSpRing();
        } else {
          resetSpRing();
        }
      }
    });
  });

  spObs.observe(spSheet, { attributes: true });
}());

/* ── ACADEMIC SHEET (ac-* system) ────────────────────── */
(function () {
  'use strict';

  /* --- tab switching --- */
  var acTabBtns   = document.querySelectorAll('.ac-tab');
  var acTabPanels = document.querySelectorAll('.ac-tab-panel');

  function switchAcTab(tabId) {
    acTabBtns.forEach(function (b) {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    acTabPanels.forEach(function (p) { p.classList.remove('active'); });

    var btn   = document.querySelector('.ac-tab[data-actab="' + tabId + '"]');
    var panel = document.getElementById(tabId);
    if (btn) {
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
    }
    if (panel) panel.classList.add('active');
  }

  acTabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tabId = this.dataset.actab;
      switchAcTab(tabId);
      
      /* run animations when PROGRESS tab is selected */
      if (tabId === 'actab-progress') {
        runProgressAnimations();
      }
    });
  });

  /* --- GPA ring animation on sheet open/close --- */
  var acSheet = document.getElementById('sheet-academic');
  if (acSheet) {
    var acRingAnimated = false;

    function animateAcRing() {
      if (acRingAnimated) return;
      acRingAnimated = true;
      var ring = acSheet.querySelector('.aci-ring-fill');
      if (ring) {
        setTimeout(function () {
          ring.style.transition = 'stroke-dashoffset 1.3s cubic-bezier(0.16,1,0.3,1)';
          ring.style.strokeDashoffset = '20.04'; /* 3.78/4.00 = 94.5% of 364.42 */
        }, 200);
      }
      /* GPA counter */
      var gpaNum = acSheet.querySelector('.aci-gpa-num');
      if (gpaNum) countUp(gpaNum, 1200);
    }

    function resetAcRing() {
      var ring = acSheet.querySelector('.aci-ring-fill');
      if (ring) {
        ring.style.strokeDashoffset = '364.42';
        acRingAnimated = false;
      }
      var gpaNum = acSheet.querySelector('.aci-gpa-num');
      if (gpaNum) gpaNum.textContent = '0.00';
      /* reset donut so it re-animates on next open */
      var donut = document.querySelector('.acp-donut-ring');
      if (donut) { donut.style.transition = 'none'; donut.style.strokeDashoffset = '238.76'; }
      resetProgressAnimations();
    }

    /* watch for .open class being added/removed */
    var acObs = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (m.attributeName === 'class') {
          if (acSheet.classList.contains('open')) {
            animateAcRing();
          } else {
            resetAcRing();
            /* reset tab to RECORD on close */
            switchAcTab('actab-info');
          }
        }
      });
    });
    acObs.observe(acSheet, { attributes: true });
  }

  /* --- build cohort rank grid (42 dots, dot #5 highlighted) --- */
  var rankGrid = document.getElementById('acpRankGrid');
  if (rankGrid) {
    for (var i = 1; i <= 42; i++) {
      var dot = document.createElement('div');
      dot.className = 'acp-rank-dot' + (i === 5 ? ' acp-rank-dot--me' : '');
      if (i === 5) dot.title = 'You · #5 of 42';
      rankGrid.appendChild(dot);
    }
  }

  /* --- Count up animations --- */
  var countUpAnimated = false;
  var progressAnimated = false;
  
  function countUp(el, duration, suffix) {
    suffix = suffix || '';
    var target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;
    
    var isFloat = target % 1 !== 0;
    var decimals = isFloat ? 2 : 0;
    var start = 0;
    var startTime = null;
    
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = start + (target - start) * eased;
      el.textContent = current.toFixed(decimals) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  /* INFORMATION tab animations */
  function animateInfoCounts() {
    if (countUpAnimated) return;
    countUpAnimated = true;
    
    // Stats bar animation - add subtle pulse to stats
    var statItems = document.querySelectorAll('#actab-info .ac-stat-item');
    statItems.forEach(function(item, i) {
      setTimeout(function() {
        item.style.transform = 'scale(1.05)';
        setTimeout(function() {
          item.style.transform = '';
        }, 200);
      }, i * 100);
    });
  }

  function resetInfoCountUp() {
    countUpAnimated = false;
  }

  /* PROGRESS tab animations */
  function runProgressAnimations() {
    if (progressAnimated) return;
    progressAnimated = true;

    /* Animate credit donut ring: 18/30 = 60%, circumference 238.76, fill 143.26 */
    var donut = document.querySelector('.acp-donut-ring');
    if (donut) {
      setTimeout(function () {
        donut.style.transition = 'stroke-dashoffset 1.1s cubic-bezier(0.16,1,0.3,1) 0.1s';
        donut.style.strokeDashoffset = '95.5'; /* 238.76 × (1 - 0.60) */
      }, 100);
    }

    /* Animate honours fill */
    var honoursFill = document.querySelector('.acp-honours-fill');
    if (honoursFill) {
      honoursFill.style.width = '0';
      setTimeout(function () {
        honoursFill.style.width = '';
      }, 80);
    }

    /* Animate grade distribution bars by re-triggering CSS transition */
    var gdBars = document.querySelectorAll('.acp-gd-bar');
    gdBars.forEach(function (bar) {
      bar.style.transition = 'none';
      bar.style.width = '0';
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        gdBars.forEach(function (bar) {
          bar.style.transition = '';
          bar.style.width = '';
        });
      });
    });
  }

  function resetProgressAnimations() {
    progressAnimated = false;
  }

  /* trigger count-up when INFORMATION tab becomes active */
  var infoTab = document.getElementById('actab-info');
  if (infoTab && acSheet) {
    var countObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        if (m.attributeName === 'class') {
          if (infoTab.classList.contains('active')) {
            animateInfoCounts();
          } else {
            resetInfoCountUp();
          }
        }
      });
    });
    countObserver.observe(infoTab, { attributes: true });
    
    /* Also trigger when sheet opens */
    var sheetOpenObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        if (m.attributeName === 'class' && acSheet.classList.contains('open')) {
          if (infoTab.classList.contains('active')) {
            animateInfoCounts();
          }
        }
      });
    });
    sheetOpenObserver.observe(acSheet, { attributes: true });
  }

  /* --- Semester Card Interactions --- */
  var semCards = document.querySelectorAll('.ac-sem-card');
  semCards.forEach(function(card) {
    card.addEventListener('click', function() {
      // Toggle expanded state
      var isActive = this.classList.contains('ac-sem-card--active');
      
      // Close all cards
      semCards.forEach(function(c) {
        c.classList.remove('ac-sem-card--active');
      });
      
      // Open clicked card if it wasn't active
      if (!isActive) {
        this.classList.add('ac-sem-card--active');
      }
    });
  });
}());
