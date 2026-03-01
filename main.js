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
  
  /* ── Expose functions for external controls ── */
  window.card3dFlip = function() {
    flipped = !flipped;
    stopIdle();
    render('transform 0.55s cubic-bezier(0.34,1.2,0.64,1)');
    idleTimerId = setTimeout(startIdle, 1500);
  };
  
  window.card3dReset = function() {
    rotX = 8; 
    rotY = 0; 
    flipped = false;
    stopIdle();
    render('transform 0.5s cubic-bezier(0.34,1.2,0.64,1)');
    idleTimerId = setTimeout(startIdle, 1000);
  };
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


/* ═══════════════════════════════════════════════════════
   ENHANCED INTERACTIONS & PERFORMANCE
═══════════════════════════════════════════════════════ */

// Haptic feedback utility
function haptic(intensity = 'light') {
  if ('vibrate' in navigator) {
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 30,
      success: [10, 50, 10],
      error: [30, 50, 30]
    };
    navigator.vibrate(patterns[intensity] || patterns.light);
  }
}

// Add haptic to all buttons
document.querySelectorAll('button, .card, .nav-item').forEach(el => {
  el.addEventListener('click', () => haptic('light'));
});

/* ═══════════════════════════════════════════════════════
   COLLAPSIBLE SECTIONS
═══════════════════════════════════════════════════════ */

document.querySelectorAll('.ag-section-header').forEach(header => {
  header.addEventListener('click', () => {
    const expanded = header.getAttribute('aria-expanded') === 'true';
    const contentId = header.getAttribute('aria-controls');
    const content = document.getElementById(contentId);
    
    header.setAttribute('aria-expanded', !expanded);
    
    if (expanded) {
      content.setAttribute('hidden', '');
    } else {
      content.removeAttribute('hidden');
    }
    
    haptic('light');
  });
});

/* ═══════════════════════════════════════════════════════
   SHEET SCROLL PROGRESS
═══════════════════════════════════════════════════════ */

document.querySelectorAll('.sheet-panel').forEach(panel => {
  const progressBar = panel.querySelector('.sheet-progress-bar');
  if (!progressBar) return;
  
  panel.addEventListener('scroll', () => {
    const scrollPercent = (panel.scrollTop / (panel.scrollHeight - panel.clientHeight)) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
  }, { passive: true });
});

/* ═══════════════════════════════════════════════════════
   3D CARD ENHANCED CONTROLS
═══════════════════════════════════════════════════════ */

(function() {
  const scene = document.getElementById('card3d-scene');
  if (!scene) return;
  
  let zoomLevel = 1;
  const maxZoom = 3;
  
  // Zoom controls
  document.getElementById('zoom-in')?.addEventListener('click', () => {
    if (zoomLevel < maxZoom) {
      zoomLevel++;
      scene.className = `card3d-scene zoom-${zoomLevel}`;
      haptic('light');
    }
  });
  
  document.getElementById('zoom-out')?.addEventListener('click', () => {
    if (zoomLevel > 1) {
      zoomLevel--;
      scene.className = `card3d-scene zoom-${zoomLevel}`;
      haptic('light');
    }
  });
  
  document.getElementById('view-reset')?.addEventListener('click', () => {
    zoomLevel = 1;
    scene.className = 'card3d-scene zoom-1';
    // Reset rotation
    if (window.card3dReset) window.card3dReset();
    haptic('medium');
  });
  
  // Flip button
  document.getElementById('flip-card')?.addEventListener('click', () => {
    if (window.card3dFlip) window.card3dFlip();
    haptic('medium');
  });
  
  // Pinch to zoom support
  let initialDistance = 0;
  
  scene.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      initialDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  }, { passive: true });
  
  scene.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const currentDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      
      if (currentDistance > initialDistance * 1.2 && zoomLevel < maxZoom) {
        zoomLevel++;
        scene.className = `card3d-scene zoom-${zoomLevel}`;
        initialDistance = currentDistance;
      } else if (currentDistance < initialDistance * 0.8 && zoomLevel > 1) {
        zoomLevel--;
        scene.className = `card3d-scene zoom-${zoomLevel}`;
        initialDistance = currentDistance;
      }
    }
  }, { passive: false });
})();

/* ═══════════════════════════════════════════════════════
   PULL TO REFRESH
═══════════════════════════════════════════════════════ */

(function() {
  const app = document.querySelector('.app');
  if (!app) return;
  
  let startY = 0;
  let isPulling = false;
  let indicator = null;
  
  // Create indicator
  indicator = document.createElement('div');
  indicator.className = 'ptr-indicator';
  indicator.innerHTML = `
    <div class="spinner" style="display:none;width:16px;height:16px;border-width:2px;"></div>
    <span>Pull to refresh</span>
  `;
  document.body.appendChild(indicator);
  
  app.addEventListener('touchstart', (e) => {
    if (window.scrollY === 0 || app.scrollTop === 0) {
      startY = e.touches[0].clientY;
      isPulling = true;
    }
  }, { passive: true });
  
  app.addEventListener('touchmove', (e) => {
    if (!isPulling) return;
    
    const diff = e.touches[0].clientY - startY;
    if (diff > 0 && diff < 150) {
      indicator.classList.add('visible');
      indicator.style.transform = `translateX(-50%) translateY(${diff * 0.3}px)`;
      
      if (diff > 100) {
        indicator.querySelector('span').textContent = 'Release to refresh';
      }
    }
  }, { passive: true });
  
  app.addEventListener('touchend', (e) => {
    if (!isPulling) return;
    isPulling = false;
    
    const diff = e.changedTouches[0].clientY - startY;
    indicator.style.transform = '';
    
    if (diff > 100) {
      indicator.querySelector('.spinner').style.display = 'block';
      indicator.querySelector('span').textContent = 'Refreshing...';
      indicator.classList.add('refreshing');
      
      // Reload after brief delay
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } else {
      indicator.classList.remove('visible');
    }
  }, { passive: true });
})();

/* ═══════════════════════════════════════════════════════
   QUICK SCROLL TO TOP
═══════════════════════════════════════════════════════ */

(function() {
  const btn = document.createElement('button');
  btn.className = 'scroll-top-btn';
  btn.setAttribute('aria-label', 'Scroll to top');
  btn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="18 15 12 9 6 15"/>
    </svg>
  `;
  document.body.appendChild(btn);
  
  const sheets = document.querySelectorAll('.sheet-panel');
  let currentSheet = null;
  
  sheets.forEach(sheet => {
    sheet.addEventListener('scroll', () => {
      if (sheet.scrollTop > 300) {
        btn.classList.add('visible');
        currentSheet = sheet;
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });
  });
  
  btn.addEventListener('click', () => {
    if (currentSheet) {
      currentSheet.scrollTo({ top: 0, behavior: 'smooth' });
    }
    haptic('light');
  });
})();

/* ═══════════════════════════════════════════════════════
   RIPPLE EFFECT ON CARDS
═══════════════════════════════════════════════════════ */

document.querySelectorAll('.card, .ag-section-header, .map-transit-card').forEach(el => {
  el.classList.add('ripple');
  
  el.addEventListener('click', (e) => {
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty('--press-x', `${x}%`);
    el.style.setProperty('--press-y', `${y}%`);
  });
});

/* ═══════════════════════════════════════════════════════
   LIGHTBOX LOADING STATE
═══════════════════════════════════════════════════════ */

(function() {
  const lightbox = document.getElementById('lightbox-photo');
  const img = lightbox?.querySelector('.lightbox-img');
  const loader = lightbox?.querySelector('.lightbox-loader');
  
  if (img && loader) {
    img.addEventListener('load', () => {
      loader.classList.add('loaded');
    });
    
    // Handle already cached image
    if (img.complete) {
      loader.classList.add('loaded');
    }
  }
})();

/* ═══════════════════════════════════════════════════════
   TOAST NOTIFICATION SYSTEM
═══════════════════════════════════════════════════════ */

function showToast(message, type = 'default') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  // Add icon based on type
  const icons = {
    success: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    error: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
  };
  
  if (icons[type]) {
    toast.insertAdjacentHTML('afterbegin', icons[type]);
  }
  
  container.appendChild(toast);
  
  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Override existing showToast
window.showToast = showToast;

/* ═══════════════════════════════════════════════════════
   KEYBOARD NAVIGATION
═══════════════════════════════════════════════════════ */

document.addEventListener('keydown', (e) => {
  // Quick escape to close all
  if (e.key === 'Escape') {
    document.querySelectorAll('.sheet.open').forEach(sheet => {
      sheet.classList.remove('open');
    });
    document.querySelectorAll('.lightbox.open').forEach(lb => {
      lb.classList.remove('open');
    });
  }
  
  // Focus trap in sheets
  if (e.key === 'Tab') {
    const activeSheet = document.querySelector('.sheet.open');
    if (activeSheet) {
      const focusables = activeSheet.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
});

/* ═══════════════════════════════════════════════════════
   PERFORMANCE: INTERSECTION OBSERVER FOR ANIMATIONS
═══════════════════════════════════════════════════════ */

const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
    } else {
      entry.target.style.animationPlayState = 'paused';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.bg-orb, .card').forEach(el => {
  animationObserver.observe(el);
});

/* ═══════════════════════════════════════════════════════
   IMAGE LAZY LOADING FALLBACK
═══════════════════════════════════════════════════════ */

if ('loading' in HTMLImageElement.prototype) {
  // Browser supports native lazy loading
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.src = img.dataset.src || img.src;
  });
} else {
  // Fallback for older browsers
  const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        lazyObserver.unobserve(img);
      }
    });
  });
  
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    lazyObserver.observe(img);
  });
}

/* ═══════════════════════════════════════════════════════
   SERVICE WORKER REGISTRATION (PWA)
═══════════════════════════════════════════════════════ */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('SW registered:', reg))
      .catch(err => console.log('SW registration failed:', err));
  });
}

console.log('✨ Enhanced Chula Student Page loaded with all improvements!');
