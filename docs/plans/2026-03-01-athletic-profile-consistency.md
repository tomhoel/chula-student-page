# Athletic Profile — Consistency & Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Align the athletic profile sheet's chrome (header/sysbar/banner) to exactly match the academic sheet's design language, and redesign sport cards to be full-bleed player cards with form strips.

**Architecture:** Vanilla HTML/CSS/JS static site. No build tools. All changes are direct edits to `index.html`, `style.css`, and `main.js`. The sp-* prefix is the athletic sheet's design system; ac-* is the academic sheet's design system. We mirror ac-* patterns in sp-*.

**Tech Stack:** HTML5, CSS3 (custom properties, SVG stroke-dashoffset animation), vanilla JS (MutationObserver, IIFE pattern)

---

### Task 1: Fix sp-header — single title line matching ac-header

**Files:**
- Modify: `index.html` (lines ~967–974)
- Modify: `style.css` (lines ~2332–2395)

**What to change in index.html:**

Find this exact block:
```html
      <!-- ── SP Header (mirrors cp-header) ── -->
      <div class="sp-header">
        <div class="sp-sport-badge">SPORT</div>
        <div class="sp-header-title-block">
          <span class="sp-header-label">ATHLETIC PROFILE · PERFORMANCE RECORD</span>
          <span class="sp-header-subtitle">Fitness Assessment — AY 2025</span>
        </div>
        <button class="sp-header-close" data-close aria-label="Close">✕</button>
      </div>
```

Replace with:
```html
      <!-- ── SP Header (mirrors ac-header) ── -->
      <div class="sp-header">
        <span class="sp-sport-badge">SPORT</span>
        <span class="sp-header-title">CU ATHLETIC PERFORMANCE SYSTEM</span>
        <button class="sp-header-close" data-close aria-label="Close">✕</button>
      </div>
```

**What to change in style.css:**

Find and replace the entire `/* ── SP Header */` block. The block starts at `.sp-header {` and ends after `.sp-header-close:hover`. Replace it entirely with:

```css
/* ── SP Header (mirrors ac-header) ── */
.sp-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 18px 10px;
  border-bottom: 1px solid rgba(0,0,0,0.07);
  flex-shrink: 0;
}
.sp-sport-badge {
  flex-shrink: 0;
  padding: 3px 8px;
  background: var(--cu);
  color: #fff;
  font: 700 9px / 1 var(--f);
  letter-spacing: 0.08em;
  border-radius: 3px;
  text-transform: uppercase;
}
.sp-header-title {
  font-family: var(--f);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--t1);
  flex: 1;
  text-transform: uppercase;
}
.sp-header-close {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: none;
  color: var(--t3);
  font-size: 15px;
  cursor: pointer;
  border: none;
  transition: background 0.15s;
}
.sp-header-close:hover { background: rgba(0,0,0,0.06); }
```

**Verify:** Open `index.html` in browser, tap Athletics. The header should now show a single bold line "CU ATHLETIC PERFORMANCE SYSTEM" — same visual weight and font size as the Academic sheet header "CU ACADEMIC INTELLIGENCE SYSTEM".

**Commit:**
```bash
git add index.html style.css
git commit -m "fix: align sp-header to ac-header pattern — single title line, matching font"
```

---

### Task 2: Convert sp-sysbar to animated scrolling ticker

**Files:**
- Modify: `index.html` (lines ~976–987)
- Modify: `style.css` (lines ~2396–2439)

**What to change in index.html:**

Find this exact block:
```html
      <!-- ── SP Sysbar (mirrors cp-sysbar) ── -->
      <div class="sp-sysbar">
        <span class="sp-sysbar-item"><span class="sp-sysbar-key">SPORTS</span>&nbsp;<span class="sp-sysbar-val">2</span></span>
        <span class="sp-sysbar-dot"></span>
        <span class="sp-sysbar-item"><span class="sp-sysbar-key">FITNESS</span>&nbsp;<span class="sp-sysbar-val">87/100</span></span>
        <span class="sp-sysbar-dot"></span>
        <span class="sp-sysbar-item"><span class="sp-sysbar-key">RANK</span>&nbsp;<span class="sp-sysbar-val sp-sysbar-val--pink">TOP 8%</span></span>
        <span class="sp-sysbar-dot"></span>
        <span class="sp-sysbar-item"><span class="sp-sysbar-key">SEASON</span>&nbsp;<span class="sp-sysbar-val">2025–26</span></span>
        <span class="sp-sysbar-dot"></span>
        <span class="sp-sysbar-item"><span class="sp-sysbar-key">DIV</span>&nbsp;<span class="sp-sysbar-val">GRAD</span></span>
      </div>
```

Replace with:
```html
      <!-- ── SP Sysbar (mirrors ac-sysbar — animated ticker) ── -->
      <div class="sp-sysbar">
        <div class="sp-sysbar-track">
          <span class="sp-sb-key">SPORTS</span><span class="sp-sb-sep">·</span><span class="sp-sb-val">2</span>
          <span class="sp-sb-div">|</span>
          <span class="sp-sb-key">FITNESS</span><span class="sp-sb-sep">·</span><span class="sp-sb-val">87/100</span>
          <span class="sp-sb-div">|</span>
          <span class="sp-sb-key">RANK</span><span class="sp-sb-sep">·</span><span class="sp-sb-val sp-sb-val--pink">TOP 8%</span>
          <span class="sp-sb-div">|</span>
          <span class="sp-sb-key">SEASON</span><span class="sp-sb-sep">·</span><span class="sp-sb-val">2025–26</span>
          <span class="sp-sb-div">|</span>
          <span class="sp-sb-key">DIV</span><span class="sp-sb-sep">·</span><span class="sp-sb-val">GRAD</span>
          <span class="sp-sb-div">|</span>
          <span class="sp-sb-key">SPORT 1</span><span class="sp-sb-sep">·</span><span class="sp-sb-val">FOOTBALL</span>
          <span class="sp-sb-div">|</span>
          <span class="sp-sb-key">SPORT 2</span><span class="sp-sb-sep">·</span><span class="sp-sb-val">SWIMMING</span>
          <span class="sp-sb-div">|</span>
          <!-- duplicate for seamless loop -->
          <span class="sp-sb-key">SPORTS</span><span class="sp-sb-sep">·</span><span class="sp-sb-val">2</span>
          <span class="sp-sb-div">|</span>
          <span class="sp-sb-key">FITNESS</span><span class="sp-sb-sep">·</span><span class="sp-sb-val">87/100</span>
          <span class="sp-sb-div">|</span>
          <span class="sp-sb-key">RANK</span><span class="sp-sb-sep">·</span><span class="sp-sb-val sp-sb-val--pink">TOP 8%</span>
          <span class="sp-sb-div">|</span>
          <span class="sp-sb-key">SEASON</span><span class="sp-sb-sep">·</span><span class="sp-sb-val">2025–26</span>
          <span class="sp-sb-div">|</span>
          <span class="sp-sb-key">DIV</span><span class="sp-sb-sep">·</span><span class="sp-sb-val">GRAD</span>
          <span class="sp-sb-div">|</span>
          <span class="sp-sb-key">SPORT 1</span><span class="sp-sb-sep">·</span><span class="sp-sb-val">FOOTBALL</span>
          <span class="sp-sb-div">|</span>
          <span class="sp-sb-key">SPORT 2</span><span class="sp-sb-sep">·</span><span class="sp-sb-val">SWIMMING</span>
        </div>
      </div>
```

**What to change in style.css:**

Find the entire `/* ── SP Sysbar */` block (starts at `.sp-sysbar {`, ends after `.sp-sysbar-dot {}`). Replace entirely with:

```css
/* ── SP Sysbar (mirrors ac-sysbar — animated ticker) ── */
.sp-sysbar {
  background: rgba(0,0,0,0.025);
  border-bottom: 1px solid rgba(0,0,0,0.06);
  overflow: hidden;
  padding: 7px 0;
  flex-shrink: 0;
}
.sp-sysbar-track {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  animation: spSysScroll 28s linear infinite;
  white-space: nowrap;
  font-family: var(--f);
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--t2);
  padding-left: 18px;
}
.sp-sb-key { color: var(--t3); font-weight: 600; }
.sp-sb-val { color: var(--t1); font-weight: 500; }
.sp-sb-sep { color: var(--t3); }
.sp-sb-div { color: rgba(0,0,0,0.15); }
.sp-sb-val--pink { color: var(--cu); }
@keyframes spSysScroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
```

**Verify:** Open sheet, sysbar should now scroll continuously left like the academic sheet's ticker.

**Commit:**
```bash
git add index.html style.css
git commit -m "feat: convert sp-sysbar to animated scrolling ticker matching ac-sysbar"
```

---

### Task 3: Replace sp-athlete-banner with animated fitness ring

**Files:**
- Modify: `index.html` (lines ~989–1003)
- Modify: `style.css` (lines ~2441–2526)

**What to change in index.html:**

Find this exact block:
```html
      <!-- ── Athlete Banner (mirrors cp-student-banner) ── -->
      <div class="sp-athlete-banner">
        <div class="sp-athlete-score-block">
          <div class="sp-athlete-score-label">FITNESS<br>INDEX</div>
          <div class="sp-athlete-score"><span class="sp-athlete-num">87</span><span class="sp-athlete-denom">/100</span></div>
          <div class="sp-athlete-rank">Top 8% · AY 2025</div>
        </div>
        <div class="sp-athlete-meta">
          <div class="sp-athlete-meta-row"><span class="sp-athlete-meta-k">SPORT COUNT</span><span class="sp-athlete-meta-v">2</span></div>
          <div class="sp-athlete-meta-row"><span class="sp-athlete-meta-k">YEARS ACTIVE</span><span class="sp-athlete-meta-v">4+</span></div>
          <div class="sp-athlete-meta-row"><span class="sp-athlete-meta-k">RANK</span><span class="sp-athlete-meta-v sp-val-pink">TOP 8%</span></div>
          <div class="sp-athlete-meta-row"><span class="sp-athlete-meta-k">DIVISION</span><span class="sp-athlete-meta-v">GRAD STUDENT</span></div>
          <div class="sp-athlete-meta-row"><span class="sp-athlete-meta-k">SEASON</span><span class="sp-athlete-meta-v">2025–26</span></div>
        </div>
      </div>
```

Replace with:
```html
      <!-- ── Athlete Banner (mirrors ac-student-banner) ── -->
      <div class="sp-athlete-banner">
        <div class="sp-score-block">
          <div class="sp-fitness-ring-wrap">
            <svg class="sp-fitness-ring" viewBox="0 0 80 80">
              <circle class="sp-ring-bg" cx="40" cy="40" r="32"/>
              <circle class="sp-ring-fill" cx="40" cy="40" r="32"/>
            </svg>
            <div class="sp-score-inner">
              <div class="sp-score-val">87</div>
              <div class="sp-score-denom">/100</div>
            </div>
          </div>
          <div class="sp-athlete-status-label">
            <span class="sp-status-dot"></span>ELITE ATHLETE
          </div>
        </div>
        <div class="sp-athlete-meta">
          <div class="sp-athlete-meta-row">
            <span class="sp-athlete-meta-k">SPORT COUNT</span>
            <span class="sp-athlete-meta-v">2</span>
          </div>
          <div class="sp-athlete-meta-row">
            <span class="sp-athlete-meta-k">YEARS ACTIVE</span>
            <span class="sp-athlete-meta-v">4+</span>
          </div>
          <div class="sp-athlete-meta-row">
            <span class="sp-athlete-meta-k">RANK</span>
            <span class="sp-athlete-meta-v sp-val-pink">TOP 8%</span>
          </div>
          <div class="sp-athlete-meta-row">
            <span class="sp-athlete-meta-k">DIVISION</span>
            <span class="sp-athlete-meta-v">GRAD STUDENT</span>
          </div>
          <div class="sp-athlete-meta-row">
            <span class="sp-athlete-meta-k">SEASON</span>
            <span class="sp-athlete-meta-v">2025–26</span>
          </div>
        </div>
      </div>
```

**What to change in style.css:**

Find the entire `/* ── Athlete Banner */` CSS block (starts at `.sp-athlete-banner {`, ends after `.sp-val-pink {}`). Replace entirely with:

```css
/* ── Athlete Banner (mirrors ac-student-banner) ── */
.sp-athlete-banner {
  display: flex;
  align-items: center;
  padding: 14px 18px;
  gap: 16px;
  border-bottom: 1px solid rgba(0,0,0,0.07);
  background: linear-gradient(135deg, rgba(222,93,142,0.04) 0%, transparent 60%);
  flex-shrink: 0;
}
.sp-score-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  flex-shrink: 0;
}
.sp-fitness-ring-wrap {
  position: relative;
  width: 80px;
  height: 80px;
}
.sp-fitness-ring {
  width: 80px;
  height: 80px;
  transform: rotate(-90deg);
}
.sp-ring-bg {
  fill: none;
  stroke: rgba(0,0,0,0.07);
  stroke-width: 7;
}
.sp-ring-fill {
  fill: none;
  stroke: var(--cu);
  stroke-width: 7;
  stroke-linecap: round;
  stroke-dasharray: 201.06;
  stroke-dashoffset: 201.06;
  transition: stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1);
}
.sp-score-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  line-height: 1.1;
}
.sp-score-val {
  font-family: var(--f);
  font-size: 21px;
  font-weight: 700;
  color: var(--t1);
  letter-spacing: -0.02em;
}
.sp-score-denom {
  font-family: var(--f);
  font-size: 10px;
  color: var(--t3);
}
.sp-athlete-status-label {
  font-family: var(--f);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--cu);
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 5px;
}
.sp-status-dot {
  width: 6px;
  height: 6px;
  background: #22c55e;
  border-radius: 50%;
  flex-shrink: 0;
  animation: spDotPulse 2s ease-in-out infinite;
}
@keyframes spDotPulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}
.sp-athlete-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.sp-athlete-meta-row {
  display: flex;
  gap: 8px;
  align-items: baseline;
}
.sp-athlete-meta-k {
  font-family: var(--f);
  font-size: 8.5px;
  letter-spacing: 0.1em;
  color: var(--t3);
  text-transform: uppercase;
  min-width: 70px;
  flex-shrink: 0;
  font-weight: 600;
}
.sp-athlete-meta-v {
  font-family: var(--f);
  font-size: 11px;
  color: var(--t1);
  font-weight: 500;
}
.sp-val-pink { color: var(--cu); }
```

**Verify:** The banner should now show an animated ring (starts empty, fills to 87% when sheet opens) with meta rows to the right — identical layout to the academic GPA banner.

**Commit:**
```bash
git add index.html style.css
git commit -m "feat: replace sp-athlete-banner text score with animated fitness ring matching ac-student-banner"
```

---

### Task 4: Add fitness ring JS animation on sheet open/close

**Files:**
- Modify: `main.js`

The academic ring animation lives at the bottom of the AC TABS IIFE. Add the sp ring animation as a standalone block after the existing SP TAB SWITCHING IIFE.

Find this comment at the end of main.js (or at the end of the SP TAB SWITCHING IIFE, around the last `}());` of that block):

```js
}());
```

The SP TAB SWITCHING IIFE ends somewhere around line 660. After it, add this new block:

```js
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
```

**How to find the right insertion point:** Search for `ATHLETIC PROFILE — SP TAB SWITCHING` in main.js. The IIFE for that block ends with `}());`. Insert the new block immediately after that closing `}());`.

**Verify:** Open the athletic sheet — the ring should animate from 0 to 87% on open. Close and reopen — it should reset and animate again.

**Commit:**
```bash
git add main.js
git commit -m "feat: add sp fitness ring open/close animation matching ac GPA ring pattern"
```

---

### Task 5: Redesign sport cards — full-bleed, no border, form strip

**Files:**
- Modify: `index.html` (lines ~1019–1072)
- Modify: `style.css` (lines ~3063–end of sp-sport-card section)

**Step 1: Update Football card body in index.html**

Find:
```html
          <!-- Football Card -->
          <div class="sp-sport-card sp-sport-card--football">
            <div class="sp-sport-card-photo">
              <picture>
                <source srcset="football_photoshoot.webp?v=2" type="image/webp">
                <img src="football_photoshoot.png?v=2" alt="Korawit football" loading="lazy" decoding="async"
                  onerror="this.onerror=null;this.parentElement.parentElement.style.background='linear-gradient(160deg,#de5d8e,#8b1a4a)';this.style.display='none'">
              </picture>
            </div>
            <div class="sp-sport-card-body">
              <span class="sp-sport-card-tag">FOOTBALL</span>
              <p class="sp-sport-card-club">CU Economics FC</p>
              <p class="sp-sport-card-role"><span class="l-th">กองกลางตัวรุก</span><span class="l-en">Attacking Midfielder</span></p>
              <div class="sp-sport-card-rating">
                <span class="sp-sport-card-num" data-count="8.3" data-decimals="1">8.3</span>
                <span class="sp-sport-card-denom">/10</span>
                <span class="sp-sport-card-rlbl">Rating</span>
              </div>
              <div class="sp-sport-card-stats">
                <span class="sp-sport-card-stat"><b>12</b><em>MTH</em></span>
                <span class="sp-sport-card-stat sp-sport-card-stat--acc"><b>4</b><em>GLS</em></span>
                <span class="sp-sport-card-stat sp-sport-card-stat--acc"><b>7</b><em>AST</em></span>
                <span class="sp-sport-card-stat"><b>75%</b><em>WIN</em></span>
              </div>
            </div>
          </div>
```

Replace with:
```html
          <!-- Football Card -->
          <div class="sp-sport-card sp-sport-card--football">
            <div class="sp-sport-card-photo">
              <picture>
                <source srcset="football_photoshoot.webp?v=2" type="image/webp">
                <img src="football_photoshoot.png?v=2" alt="Korawit football" loading="lazy" decoding="async"
                  onerror="this.onerror=null;this.parentElement.parentElement.style.background='linear-gradient(160deg,#de5d8e,#8b1a4a)';this.style.display='none'">
              </picture>
            </div>
            <div class="sp-sport-card-body">
              <div class="sp-sport-card-toprow">
                <span class="sp-sport-card-tag">FOOTBALL</span>
                <span class="sp-sport-card-rating-num">8.3<span class="sp-sport-card-rating-den">/10</span></span>
              </div>
              <p class="sp-sport-card-club">CU Economics FC</p>
              <p class="sp-sport-card-role"><span class="l-th">กองกลางตัวรุก</span><span class="l-en">Attacking Midfielder</span></p>
              <div class="sp-sport-card-stats">
                <span class="sp-sport-card-stat"><b>12</b><em>MTH</em></span>
                <span class="sp-sport-card-stat sp-sport-card-stat--acc"><b>4</b><em>GLS</em></span>
                <span class="sp-sport-card-stat sp-sport-card-stat--acc"><b>7</b><em>AST</em></span>
                <span class="sp-sport-card-stat"><b>75%</b><em>WIN</em></span>
              </div>
              <div class="sp-form-strip">
                <span class="sp-form-dot sp-form-w"></span>
                <span class="sp-form-dot sp-form-w"></span>
                <span class="sp-form-dot sp-form-d"></span>
                <span class="sp-form-dot sp-form-w"></span>
                <span class="sp-form-dot sp-form-l"></span>
                <span class="sp-form-dot sp-form-w"></span>
                <span class="sp-form-dot sp-form-w"></span>
                <span class="sp-form-dot sp-form-d"></span>
                <span class="sp-form-lbl">FORM</span>
              </div>
            </div>
          </div>
```

**Step 2: Update Swimming card body in index.html**

Find:
```html
          <!-- Swimming Card -->
          <div class="sp-sport-card sp-sport-card--swim">
            <div class="sp-sport-card-photo">
              <picture>
                <source srcset="svimming_photoshoot.webp?v=2" type="image/webp">
                <img src="svimming_photoshoot.png?v=2" alt="Korawit swimming" loading="lazy" decoding="async"
                  onerror="this.onerror=null;this.parentElement.parentElement.style.background='linear-gradient(160deg,#0ea5e9,#1e3a8a)';this.style.display='none'">
              </picture>
            </div>
            <div class="sp-sport-card-body">
              <div class="sp-sport-card-tag-row">
                <span class="sp-sport-card-tag sp-sport-card-tag--swim">SWIMMING</span>
                <span class="sp-sport-card-elite">ELITE</span>
              </div>
              <p class="sp-sport-card-club">CU Aquatic Society</p>
              <p class="sp-sport-card-role">Freestyle &amp; IM</p>
              <div class="sp-sport-card-rating">
                <span class="sp-sport-card-num sp-sport-card-num--blue" data-count="26.4" data-decimals="1">26.4</span>
                <span class="sp-sport-card-rlbl">50m PB</span>
              </div>
              <div class="sp-sport-card-stats">
                <span class="sp-sport-card-stat"><b>4×</b><em>WK</em></span>
                <span class="sp-sport-card-stat sp-sport-card-stat--blue"><b>3</b><em>MEDALS</em></span>
                <span class="sp-sport-card-stat sp-sport-card-stat--blue"><b>32</b><em>SWOLF</em></span>
                <span class="sp-sport-card-stat sp-sport-card-stat--gold"><b>168</b><em>MAX BPM</em></span>
              </div>
            </div>
          </div>
```

Replace with:
```html
          <!-- Swimming Card -->
          <div class="sp-sport-card sp-sport-card--swim">
            <div class="sp-sport-card-photo">
              <picture>
                <source srcset="svimming_photoshoot.webp?v=2" type="image/webp">
                <img src="svimming_photoshoot.png?v=2" alt="Korawit swimming" loading="lazy" decoding="async"
                  onerror="this.onerror=null;this.parentElement.parentElement.style.background='linear-gradient(160deg,#0ea5e9,#1e3a8a)';this.style.display='none'">
              </picture>
            </div>
            <div class="sp-sport-card-body">
              <div class="sp-sport-card-toprow">
                <span class="sp-sport-card-tag sp-sport-card-tag--swim">SWIMMING</span>
                <span class="sp-sport-card-elite">ELITE</span>
                <span class="sp-sport-card-rating-num sp-sport-card-rating-num--blue">26.4<span class="sp-sport-card-rating-den">s PB</span></span>
              </div>
              <p class="sp-sport-card-club">CU Aquatic Society</p>
              <p class="sp-sport-card-role">Freestyle &amp; IM</p>
              <div class="sp-sport-card-stats">
                <span class="sp-sport-card-stat"><b>4×</b><em>WK</em></span>
                <span class="sp-sport-card-stat sp-sport-card-stat--blue"><b>3</b><em>MEDALS</em></span>
                <span class="sp-sport-card-stat sp-sport-card-stat--blue"><b>32</b><em>SWOLF</em></span>
                <span class="sp-sport-card-stat sp-sport-card-stat--gold"><b>168</b><em>MAX BPM</em></span>
              </div>
              <div class="sp-form-strip">
                <span class="sp-form-dot sp-form-pb"></span>
                <span class="sp-form-dot sp-form-good"></span>
                <span class="sp-form-dot sp-form-good"></span>
                <span class="sp-form-dot sp-form-pb"></span>
                <span class="sp-form-dot sp-form-good"></span>
                <span class="sp-form-dot sp-form-norm"></span>
                <span class="sp-form-dot sp-form-good"></span>
                <span class="sp-form-dot sp-form-norm"></span>
                <span class="sp-form-lbl">SESSIONS</span>
              </div>
            </div>
          </div>
```

**Step 3: Update sport card CSS in style.css**

Find `.sp-sport-card {` in style.css (around line 3071). The block has `border: 1px solid rgba(0, 0, 0, 0.08);`. Change that single line to remove the border:

Find:
```css
.sp-sport-card {
  display: flex;
  align-items: stretch;
  border: 1px solid rgba(0, 0, 0, 0.08);
```

Replace with:
```css
.sp-sport-card {
  display: flex;
  align-items: stretch;
```

Find `.sp-sport-card-photo {` and change `width: 34%;` to `width: 42%;`:

Find:
```css
.sp-sport-card-photo {
  width: 34%;
```

Replace with:
```css
.sp-sport-card-photo {
  width: 42%;
```

**Step 4: Add new CSS for toprow, rating-num, and form strip**

Find `.sp-sport-card-body {` in style.css. After the entire `.sp-sport-card-body { ... }` rule block, add these new rules. Look for the `.sp-sport-card-tag-row {` rule that comes after `.sp-sport-card-body`. Insert the new rules right before `.sp-sport-card-tag-row {`:

Find:
```css
.sp-sport-card-tag-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
```

Replace with:
```css
.sp-sport-card-toprow {
  display: flex;
  align-items: center;
  gap: 6px;
}
.sp-sport-card-rating-num {
  margin-left: auto;
  font: 700 16px / 1 var(--f);
  color: var(--cu);
  letter-spacing: -0.02em;
}
.sp-sport-card-rating-num--blue { color: #0ea5e9; }
.sp-sport-card-rating-den {
  font: 500 9px / 1 var(--f);
  color: var(--t3);
  margin-left: 1px;
}
.sp-form-strip {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}
.sp-form-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.sp-form-w    { background: #22c55e; }
.sp-form-d    { background: #f59e0b; }
.sp-form-l    { background: rgba(0,0,0,0.18); }
.sp-form-pb   { background: var(--cu); }
.sp-form-good { background: #22c55e; }
.sp-form-norm { background: rgba(0,0,0,0.15); }
.sp-form-lbl {
  font: 700 7px / 1 var(--f);
  color: var(--t3);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-left: 3px;
}
.sp-sport-card-tag-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
```

**Verify:** Cards should now look like premium player cards — wide photo on the left, sport tag + rating at the top right, stats row, then 8 coloured form dots. No outer box border.

**Commit:**
```bash
git add index.html style.css
git commit -m "feat: redesign sp sport cards — full-bleed photo, toprow layout, form dots strip"
```

---

### Task 6: Flatten sp-profile-summary (remove box styling)

**Files:**
- Modify: `style.css` (lines ~3007–3050)

**What to change in style.css:**

Find:
```css
.sp-profile-summary {
  background: linear-gradient(135deg, rgba(222, 93, 142, 0.06) 0%, rgba(184, 133, 42, 0.06) 100%);
  border: 1px solid rgba(222, 93, 142, 0.14);
  border-radius: 12px;
  padding: 12px 13px;
```

Replace with:
```css
.sp-profile-summary {
  padding: 4px 0 16px;
```

**Verify:** The "Technical Playmaker" profile summary at the bottom of the overview tab should now appear as flat typography — no box, no border, no background. Just the archetype name, badge, and text.

**Commit:**
```bash
git add style.css
git commit -m "fix: flatten sp-profile-summary — remove boxy border and background gradient"
```

---

## Done

After all 6 tasks, open `index.html`, tap Athletics and then Academic back-to-back. Both sheets should now feel like they belong to the same design system:
- Identical header chrome (badge + single bold title + close)
- Identical scrolling animated sysbar
- Identical animated ring banner (GPA ring vs Fitness ring)
- Sport cards are now open, photo-forward, data-rich player cards
