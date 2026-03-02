# CU Student Page — Design System Blueprint

> **Purpose:** This document is the single source of truth for the visual design language used across all sheets and components in this project. Any AI assistant or developer adding new features should follow these patterns exactly.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Design Tokens](#2-design-tokens)
3. [Sheet Structure](#3-sheet-structure--the-intelligence-system-pattern)
4. [Component Library](#4-component-library)
5. [Typography Scale](#5-typography-scale)
6. [Animation & Motion](#6-animation--motion)
7. [Spacing Rules](#7-spacing-rules)
8. [Border & Shadow Patterns](#8-border--shadow-patterns)
9. [Template: New Sheet](#9-template-adding-a-new-intelligence-system-sheet)
10. [Naming Convention](#10-naming-convention)
11. [Bilingual System](#11-bilingual-system)

---

## 1. Design Philosophy

The design language is a **light-mode institutional dashboard** — clean Apple HIG-inspired surfaces combined with a data-dense "classified system" aesthetic. All major sheets (Academic, Athletic, Cheat Panel) share a unified structural pattern:

```
+-----------------------------+
| HEADER (badge + title)      |  <- brand strip
| SYSBAR (scrolling ticker)   |  <- ambient data ticker
| BANNER (ring + metadata)    |  <- hero score block
| TAB BAR                     |  <- navigation
| TAB CONTENT (scrollable)    |  <- data-dense panels
+-----------------------------+
```

### Key Principles

- **Light mode only** — no dark mode. `color-scheme: light` is enforced.
- **Max width 430px** — mobile-first, phone-frame on desktop.
- **Solid white surfaces** — no dark glass. Subtle tints only (`rgba(0,0,0,0.025)`).
- **CU Pink (#de5d8e)** is the primary brand accent throughout.
- **Data density** — small labels (7-10px), uppercase tracking, monospace for technical values.
- **Animated on open** — bars, rings, and panels re-animate every time a sheet opens.

---

## 2. Design Tokens

### 2.1 CSS Custom Properties

```css
:root {
  /* Brand Colors */
  --cu:       #de5d8e;                        /* Primary CU pink */
  --cu-dark:  #b43b6b;                        /* Active/pressed state */
  --cu-tint:  rgba(222, 93, 142, 0.09);       /* Light tint backgrounds */
  --gold:     #b8852a;                        /* Secondary accent (elite, awards) */
  --gold-tint: rgba(184, 133, 42, 0.10);

  /* Surfaces */
  --bg:       #F2F0EE;                        /* App background (warm cream) */
  --card:     #FFFFFF;                        /* Card surfaces */
  --card-b:   #F9F9F9;                        /* Alternate card surface */

  /* Borders */
  --border:   rgba(0, 0, 0, 0.07);            /* Standard border */
  --sep:      rgba(0, 0, 0, 0.07);            /* Separator lines */

  /* Text */
  --t1:       #1A1A1A;                        /* Primary text */
  --t2:       #6B6B6B;                        /* Secondary text */
  --t3:       #B0B0B0;                        /* Tertiary / labels */

  /* Fonts */
  --f:    -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
  --f-th: 'Sarabun', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;

  /* Motion */
  --spring: cubic-bezier(0.32, 0.72, 0, 1);

  /* Radius */
  --r: 14px;                                  /* Default card radius */
}
```

### 2.2 Semantic Color Palette

| Purpose            | Color                                  | Usage                                    |
|--------------------|----------------------------------------|------------------------------------------|
| Success / Green    | `#22c55e` / `#16a34a` / `#15803d`      | Verified, active, positive delta         |
| Warning / Amber    | `#f59e0b` / `#b45309`                  | Thresholds, medium risk                  |
| Danger / Red       | `#dc2626` / `#b91c1c`                  | TOP SECRET badge, critical               |
| Info / Indigo      | `#6366f1` / `#4f46e5`                  | Future courses, planned items            |
| Water / Blue       | `#0ea5e9` / `#0284c7`                  | Swimming sport theme                     |
| CU Pink            | `#de5d8e`                              | Primary brand, football, accent bars     |
| Gold               | `#b8852a`                              | Elite tier, awards, secondary brand      |

### 2.3 Color Modifier Classes

Use these patterns for semantic value coloring:

```css
.xx-val--green { color: #16a34a; }
.xx-val--amber { color: #b45309; }
.xx-val--pink  { color: var(--cu); }
.xx-val--blue  { color: #0ea5e9; }
.xx-val--gold  { color: #b8852a; }
```

---

## 3. Sheet Structure — The "Intelligence System" Pattern

### 3.1 Container (Bottom Sheet Overlay)

All sheets use the same overlay + slide-up pattern:

```css
/* Fixed overlay + scrim */
.sheet {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: flex-end;
  pointer-events: none;
  visibility: hidden;
  transition: visibility 0s 0.44s;
}

.sheet.open {
  pointer-events: auto;
  visibility: visible;
  transition: visibility 0s 0s;
}

/* Backdrop scrim */
.sheet-scrim {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  opacity: 0;
  transition: opacity 0.15s ease;
}

.sheet.open .sheet-scrim { opacity: 1; }
```

**For intelligence-system style sheets** (Academic, Athletic, Cheat Panel), the panel uses flex column layout with no default padding:

```css
.sheet-panel-mysheet {
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  max-height: 93dvh;
}
```

**For simpler sheets** (Student ID, Location, 3D Card), use the default sheet-panel styling:

```css
.sheet-panel {
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  background: rgba(253, 249, 252, 0.97);
  backdrop-filter: blur(48px) saturate(180%);
  -webkit-backdrop-filter: blur(48px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.90);
  border-bottom: none;
  border-radius: 24px 24px 0 0;
  padding: 10px 24px max(env(safe-area-inset-bottom), 32px);
  max-height: 82dvh;
  overflow-y: auto;
  transform: translateY(100%);
  transition: transform 0.44s var(--spring);
}

.sheet.open .sheet-panel { transform: translateY(0); }
```

### 3.2 Pull Handle

Always the first child inside the panel:

```css
.xx-handle {
  width: 34px;
  height: 4px;
  background: rgba(0, 0, 0, 0.11);
  border-radius: 999px;
  margin: 10px auto 0;
}
```

### 3.3 Header Bar

Layout: `[BADGE] TITLE TEXT [CLOSE_BUTTON]`

```css
.xx-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 18px 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
  flex-shrink: 0;
}
```

**Badge variants:**

```css
/* Solid badge (Academic = #c0392b, Sport = var(--cu)) */
.xx-badge-solid {
  flex-shrink: 0;
  padding: 3px 8px;
  background: var(--cu);
  color: #fff;
  font: 700 9px / 1 var(--f);
  letter-spacing: 0.08em;
  border-radius: 3px;
  text-transform: uppercase;
}

/* Outlined badge (Cheat Panel "TOP SECRET") */
.xx-badge-outlined {
  flex-shrink: 0;
  padding: 3px 8px;
  background: rgba(220, 38, 38, 0.07);
  border: 1px solid rgba(220, 38, 38, 0.22);
  border-radius: 4px;
  font: 700 8px / 1 var(--f);
  color: #dc2626;
  letter-spacing: 0.15em;
  white-space: nowrap;
}
```

**Title:**

```css
.xx-header-title {
  font: 700 11px / 1 var(--f);
  letter-spacing: 0.06em;
  color: var(--t1);
  text-transform: uppercase;
  flex: 1;
}
```

**Close button:**

```css
.xx-close {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: none;
  border: none;
  color: var(--t3);
  font-size: 15px;
  cursor: pointer;
  transition: background 0.15s;
}

.xx-close:hover { background: rgba(0, 0, 0, 0.06); }
```

### 3.4 System Bar (Scrolling Ticker)

An animated horizontal marquee showing `KEY . VALUE | KEY . VALUE` in a loop. Content must be duplicated in the HTML for seamless animation.

```css
.xx-sysbar {
  background: rgba(0, 0, 0, 0.025);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  overflow: hidden;
  padding: 7px 0;
  flex-shrink: 0;
}

.xx-sysbar-track {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  animation: xxSysScroll 28s linear infinite;
  white-space: nowrap;
  font: 500 10px / 1 var(--f);
  letter-spacing: 0.06em;
  color: var(--t2);
  padding-left: 18px;
}

@keyframes xxSysScroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
```

**Token classes within the ticker:**

```css
.xx-sb-key { color: var(--t3); font-weight: 600; }   /* KEY label */
.xx-sb-val { color: var(--t1); font-weight: 500; }   /* VALUE text */
.xx-sb-sep { color: var(--t3); }                      /* . separator */
.xx-sb-div { color: rgba(0, 0, 0, 0.15); }           /* | divider */
```

**HTML pattern:**

```html
<div class="xx-sysbar">
  <div class="xx-sysbar-track">
    <span class="xx-sb-key">KEY1</span><span class="xx-sb-sep">.</span><span class="xx-sb-val">VALUE1</span>
    <span class="xx-sb-div">|</span>
    <span class="xx-sb-key">KEY2</span><span class="xx-sb-sep">.</span><span class="xx-sb-val">VALUE2</span>
    <span class="xx-sb-div">|</span>
    <!-- ... then DUPLICATE the entire set above for seamless loop ... -->
    <span class="xx-sb-key">KEY1</span><span class="xx-sb-sep">.</span><span class="xx-sb-val">VALUE1</span>
    <span class="xx-sb-div">|</span>
    <span class="xx-sb-key">KEY2</span><span class="xx-sb-sep">.</span><span class="xx-sb-val">VALUE2</span>
  </div>
</div>
```

### 3.5 Banner (Hero Score Block)

A prominent score ring on the left + metadata rows on the right.

```css
.xx-banner {
  display: flex;
  align-items: center;
  padding: 14px 18px;
  gap: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
  background: linear-gradient(135deg, rgba(222, 93, 142, 0.04) 0%, transparent 60%);
  flex-shrink: 0;
}
```

**Score Ring (SVG):**

```css
.xx-ring-wrap { position: relative; width: 80px; height: 80px; }
.xx-ring      { width: 80px; height: 80px; transform: rotate(-90deg); }
.xx-ring-bg   { fill: none; stroke: rgba(0, 0, 0, 0.07); stroke-width: 7; }
.xx-ring-fill {
  fill: none;
  stroke: var(--cu);
  stroke-width: 7;
  stroke-linecap: round;
  stroke-dasharray: 201.06;     /* 2 * PI * 32 */
  stroke-dashoffset: 201.06;    /* starts empty */
  transition: stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1);
}
```

To fill the ring to X%, set `stroke-dashoffset` to `201.06 * (1 - X/100)` via JS on sheet open.

**Score center text:**

```css
.xx-score-inner {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  line-height: 1.1;
}
.xx-score-val   { font: 700 21px / 1 var(--f); color: var(--t1); letter-spacing: -0.02em; }
.xx-score-denom { font: 400 10px / 1 var(--f); color: var(--t3); }
```

**Status label under ring:**

```css
.xx-status-label {
  font: 700 8px / 1 var(--f);
  letter-spacing: 0.08em;
  color: var(--cu);
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 5px;
}

.xx-status-dot {
  width: 6px; height: 6px;
  background: #22c55e;
  border-radius: 50%;
  flex-shrink: 0;
  animation: xxDotPulse 2s ease-in-out infinite;
}

@keyframes xxDotPulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.3; }
}
```

**Metadata rows (right side):**

```css
.xx-meta-rows { flex: 1; display: flex; flex-direction: column; gap: 5px; }

.xx-meta-row { display: flex; gap: 8px; align-items: baseline; }

.xx-meta-key {
  font: 600 8.5px / 1 var(--f);
  letter-spacing: 0.1em;
  color: var(--t3);
  text-transform: uppercase;
  min-width: 62px;
  flex-shrink: 0;
}

.xx-meta-val {
  font: 500 11px / 1 var(--f);
  color: var(--t1);
}
```

### 3.6 Tab Bar

```css
.xx-tabs {
  display: flex;
  padding: 0 18px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
  overflow-x: auto;
  scrollbar-width: none;
  flex-shrink: 0;
}

.xx-tabs::-webkit-scrollbar { display: none; }

.xx-tab {
  padding: 10px 14px;
  font: 700 10px / 1 var(--f);
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--t3);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: color 0.2s, border-color 0.2s;
  margin-bottom: -1px;
}

.xx-tab.active {
  color: var(--cu);
  border-bottom-color: var(--cu);
}
```

### 3.7 Tab Content Area

```css
.xx-tab-content {
  overflow-y: auto;
  flex: 1;
  -webkit-overflow-scrolling: touch;
}

.xx-tab-panel {
  display: none;
  padding: 4px 18px 28px;
}

.xx-tab-panel.active {
  display: block;
  animation: xxPanelIn 0.25s ease;
}

@keyframes xxPanelIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

## 4. Component Library

### 4.1 Section Title

Used to divide tab content into labeled sections.

```css
.xx-section-title {
  font: 700 9px / 1 var(--f);
  color: var(--t3);
  letter-spacing: 0.10em;
  text-transform: uppercase;
  margin: 16px 0 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

**Variant with auto-extending line** (Cheat Panel style):

```css
.xx-section-title::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(0, 0, 0, 0.06);
}
```

### 4.2 Data Grid (2-column stat cards)

```html
<div class="xx-data-grid">
  <div class="xx-data-cell">
    <span class="xx-data-key">LABEL</span>
    <span class="xx-data-val">97.3</span>
    <span class="xx-data-sub">Description text</span>
  </div>
</div>
```

```css
.xx-data-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 7px;
  margin-bottom: 16px;
}

.xx-data-cell {
  background: rgba(0, 0, 0, 0.025);
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 10px;
  padding: 10px 11px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.xx-data-key {
  font: 500 7.5px / 1 var(--f);
  color: var(--t3);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.xx-data-val {
  font: 700 17px / 1 var(--f);
  color: var(--t1);
  letter-spacing: -0.01em;
}

.xx-data-sub {
  font: 400 8.5px / 1 var(--f);
  color: var(--t3);
}
```

### 4.3 Stat Grid (3-column)

Same concept as data grid but 3 columns. Used for sport stats.

```css
.xx-stat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-bottom: 16px;
}

.xx-stat-cell {
  background: rgba(0, 0, 0, 0.025);
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 10px;
  padding: 9px 10px 8px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.xx-stat-key {
  font: 500 8.5px / 1 var(--f);
  color: var(--t3);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.xx-stat-val {
  font: 700 17px / 1 var(--f);
  color: var(--t1);
  letter-spacing: -0.02em;
}

.xx-stat-sub {
  font: 400 9px / 1 var(--f);
  color: var(--t3);
}
```

### 4.4 Progress Bar

```html
<div class="xx-bar-wrap">
  <div class="xx-bar-label-row">
    <span class="xx-bar-lbl">Label text</span>
    <span class="xx-bar-val">97/100</span>
  </div>
  <div class="xx-bar-track">
    <div class="xx-bar-fill" style="--w: 97%"></div>
  </div>
</div>
```

```css
.xx-bar-wrap { margin-bottom: 9px; }

.xx-bar-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.xx-bar-lbl { font: 400 9px / 1 var(--f); color: var(--t2); }
.xx-bar-val { font: 600 9px / 1 monospace; color: var(--t2); }

.xx-bar-track {
  height: 3px;
  background: rgba(0, 0, 0, 0.07);
  border-radius: 999px;
  overflow: hidden;
}

.xx-bar-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--cu), rgba(222, 93, 142, 0.55));
  width: var(--w, 0%);
  transition: width 0.75s cubic-bezier(0.32, 0.72, 0, 1);
}

/* Amber variant for lower/warning values */
.xx-bar-fill--amber {
  background: linear-gradient(90deg, #f59e0b, rgba(245, 158, 11, 0.55));
}
```

### 4.5 Thicker Comparison Bars (Academic style)

Used for course-level You vs Avg comparisons.

```css
.xx-bar-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.xx-bar-label {
  font: 400 9px / 1 var(--f);
  color: var(--t3);
  min-width: 22px;
  letter-spacing: 0.04em;
}

.xx-bar-wrap-thick {
  flex: 1;
  height: 5px;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 3px;
  overflow: hidden;
}

.xx-bar-you { background: var(--cu); }
.xx-bar-avg { background: rgba(0, 0, 0, 0.22); }

.xx-bar-pct {
  font: 400 9px / 1 var(--f);
  color: var(--t2);
  min-width: 18px;
  text-align: right;
}
```

Width is animated via CSS custom property: `width: var(--w)` activated when parent panel gets `.active`.

### 4.6 Hex / Affinity Grid (3-column subject matrix)

```css
.xx-hex-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

/* Variant A: outlined cells with score (Cheat Panel) */
.xx-hex-cell {
  background: rgba(99, 102, 241, 0.05);
  border: 1px solid rgba(99, 102, 241, 0.16);
  border-radius: 9px;
  padding: 9px 10px;
}

.xx-hex-subject {
  font: 600 7.5px / 1 var(--f);
  color: var(--t3);
  letter-spacing: 0.05em;
  margin-bottom: 5px;
}

.xx-hex-score {
  font: 700 18px / 1 var(--f);
  color: rgba(99, 102, 241, 0.85);
  letter-spacing: -0.02em;
}

/* Variant B: colored intensity tiles (Academic Analysis) */
.xx-hex-tile {
  aspect-ratio: 1;
  background: rgba(222, 93, 142, var(--intensity));
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 8px 4px;
}

/* --intensity should range from 0.45 (low) to 0.95 (high) */

.xx-hex-tile-name {
  font: 600 9px / 1.3 var(--f);
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 5px;
}

.xx-hex-tile-score {
  font: 700 16px / 1 var(--f);
  color: #fff;
}
```

### 4.7 Score Ring Row (3-column ring display)

```css
.xx-score-rings {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.xx-score-ring-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 12px;
  padding: 12px 6px;
}

.xx-ring-num {
  font: 600 9.5px / 1 var(--f);
  color: var(--t2);
  text-align: center;
}

.xx-ring-lbl {
  font: 400 8px / 1 var(--f);
  color: var(--t3);
  letter-spacing: 0.04em;
  text-align: center;
}
```

Each ring uses an inline SVG (58x58 viewBox) with `stroke-dasharray` / `stroke-dashoffset` for the fill arc.

### 4.8 Monospace Log Block

```css
.xx-log {
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  padding: 11px 13px;
  margin-bottom: 10px;
}

.xx-log-line {
  font: 400 8.5px / 1.75 monospace;
  color: var(--t2);
  word-break: break-all;
}

.xx-log-line--bright { color: var(--t1); }
```

### 4.9 Timeline

```css
.xx-timeline {
  position: relative;
  padding-left: 18px;
  margin-bottom: 16px;
}

.xx-timeline::before {
  content: '';
  position: absolute;
  left: 4px; top: 7px; bottom: 7px;
  width: 1px;
  background: rgba(222, 93, 142, 0.22);
}

.xx-timeline-item {
  position: relative;
  margin-bottom: 13px;
}

.xx-timeline-item::before {
  content: '';
  position: absolute;
  left: -15px; top: 4px;
  width: 7px; height: 7px;
  border-radius: 50%;
  background: rgba(222, 93, 142, 0.18);
  border: 1px solid rgba(222, 93, 142, 0.40);
}

/* Active / "NOW" marker */
.xx-tl-now::before {
  background: var(--cu);
  box-shadow: 0 0 6px rgba(222, 93, 142, 0.45);
}

.xx-tl-date  { font: 600 8.5px / 1 monospace; color: rgba(222, 93, 142, 0.70); margin-bottom: 3px; }
.xx-tl-event { font: 500 11px / 1.3 var(--f); color: var(--t1); }
.xx-tl-note  { font: 400 9.5px / 1.4 var(--f); color: var(--t3); margin-top: 2px; }
```

### 4.10 Course Card (Academic Record)

```css
.xx-course-card {
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 8px;
  background: rgba(0, 0, 0, 0.015);
}

.xx-course-card--done { opacity: 0.85; }  /* completed semester */

.xx-grade-badge {
  font: 700 11px / 1 var(--f);
  padding: 3px 8px;
  border-radius: 5px;
  min-width: 30px;
  text-align: center;
}

/* Grade badge colors */
.xx-grade-a       { background: rgba(222, 93, 142, 0.14); color: var(--cu); }
.xx-grade-a-minus { background: rgba(222, 93, 142, 0.10); color: var(--cu); }
.xx-grade-b-plus  { background: rgba(234, 179, 8, 0.15);  color: #b45309;  }

.xx-course-delta {
  font: 600 10px / 1 var(--f);
  color: #22c55e;
}
```

### 4.11 Forecast Card Grid (2x2)

```css
.xx-forecast-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 10px;
}

.xx-forecast-card {
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 10px;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.015);
}

.xx-fc-label {
  font: 600 8px / 1 var(--f);
  letter-spacing: 0.1em;
  color: var(--t3);
  text-transform: uppercase;
  margin-bottom: 4px;
}

.xx-fc-val {
  font: 700 15px / 1.1 var(--f);
  color: var(--t1);
  margin-bottom: 3px;
}

.xx-fc-green { color: #22c55e; }

.xx-fc-sub {
  font: 400 9px / 1.3 var(--f);
  color: var(--t3);
}
```

### 4.12 Player / Sport Card (Photo + Info split)

```css
.xx-player-card {
  display: flex;
  align-items: stretch;
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 12px;
  overflow: hidden;
  min-height: 136px;
}

/* Colored left accent border */
.xx-card--pink { border-left: 3px solid var(--cu); }
.xx-card--blue { border-left: 3px solid #0ea5e9; }

/* Photo column = ~33-42% width */
.xx-card-photo {
  width: 33%;
  flex-shrink: 0;
  overflow: hidden;
  background: #111;
}

.xx-card-photo img {
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: center 8%;
  display: block;
}

/* Info column */
.xx-card-info {
  flex: 1;
  min-width: 0;
  padding: 11px 13px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  border-left: 1px solid rgba(0, 0, 0, 0.07);
}
```

### 4.13 Sport Tag Badge

```css
.xx-sport-tag {
  display: inline-flex;
  padding: 2px 7px;
  border-radius: 4px;
  font: 800 7px / 1 var(--f);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #fff;
  align-self: flex-start;
}

.xx-sport-tag--pink { background: var(--cu); }
.xx-sport-tag--blue { background: #0ea5e9; }
```

### 4.14 Mini Stats Row (inside player cards)

```css
.xx-mini-stats {
  display: flex;
  gap: 0;
  margin-top: auto;
  padding-top: 9px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.xx-mini-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  flex: 1;
}

.xx-mini-stat:not(:last-child) {
  border-right: 1px solid rgba(0, 0, 0, 0.06);
}

.xx-mini-val {
  font: 700 14px / 1 var(--f);
  color: var(--t1);
}

.xx-mini-lbl {
  font: 600 7px / 1 var(--f);
  color: var(--t3);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
```

### 4.15 Form Strip (W/D/L dots)

```css
.xx-form-strip {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}

.xx-form-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.xx-form-w    { background: #22c55e; }      /* Win */
.xx-form-d    { background: #f59e0b; }      /* Draw */
.xx-form-l    { background: rgba(0,0,0,0.18); }  /* Loss */
.xx-form-pb   { background: var(--cu); }     /* Personal Best */
.xx-form-good { background: #22c55e; }      /* Good session */
.xx-form-norm { background: rgba(0,0,0,0.15); }  /* Normal */

.xx-form-lbl {
  font: 700 7px / 1 var(--f);
  color: var(--t3);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-left: 3px;
}
```

### 4.16 Achievement Chips (horizontal scroll)

```css
.xx-achievements {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 2px;
  margin-bottom: 18px;
  -webkit-mask-image: linear-gradient(to right, black 88%, transparent 100%);
  mask-image: linear-gradient(to right, black 88%, transparent 100%);
}

.xx-achievements::-webkit-scrollbar { display: none; }

.xx-ach-chip {
  flex-shrink: 0;
  padding: 6px 11px;
  border-radius: 999px;
  font: 600 9.5px / 1 var(--f);
  white-space: nowrap;
  border: 1px solid;
}

.xx-ach-chip--gold {
  background: rgba(184, 133, 42, 0.08);
  border-color: rgba(184, 133, 42, 0.22);
  color: #b8852a;
}

.xx-ach-chip--silver {
  background: rgba(107, 114, 128, 0.08);
  border-color: rgba(107, 114, 128, 0.20);
  color: #6b7280;
}

.xx-ach-chip--pink {
  background: rgba(222, 93, 142, 0.07);
  border-color: rgba(222, 93, 142, 0.20);
  color: var(--cu);
}
```

### 4.17 Section Box (bordered content container)

```css
.xx-section-box {
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 12px;
  padding: 12px 14px 10px;
  background: rgba(0, 0, 0, 0.01);
  margin-bottom: 12px;
  overflow: hidden;
}

.xx-section-box > .xx-section-title {
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  margin-bottom: 10px;
  margin-top: 0;
}
```

### 4.18 Match History List

```css
.xx-match-list {
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 16px;
}

.xx-match-row {
  display: flex;
  align-items: stretch;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.xx-match-row:last-child { border-bottom: none; }

.xx-match-result {
  width: 46px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 12px 0;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(0, 0, 0, 0.018);
}

.xx-match-badge { font: 800 11px / 1 var(--f); }
.xx-result-w .xx-match-badge { color: #16a34a; }
.xx-result-d .xx-match-badge { color: #b45309; }
.xx-result-l .xx-match-badge { color: #dc2626; }

.xx-match-body {
  flex: 1; min-width: 0;
  padding: 10px 12px;
  display: flex; flex-direction: column; gap: 3px;
}

.xx-match-opponent { font: 600 11px / 1 var(--f); color: var(--t1); }
.xx-match-meta     { font: 400 9.5px / 1 var(--f); color: var(--t3); }
```

### 4.19 Attribute Card Grid (with tier theming)

```css
.xx-attr-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.xx-attr-card {
  background: rgba(0, 0, 0, 0.022);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 10px;
  padding: 10px 10px 9px;
}
```

**Tier theming via `data-tier` attribute:**

| Tier | Dot color | Badge bg | Score color | Bar gradient |
|------|-----------|----------|-------------|-------------|
| `elite` | `var(--gold)` | `rgba(184,133,42,0.12)` | `var(--gold)` | gold gradient |
| `high` | `var(--cu)` | `var(--cu-tint)` | `var(--cu)` | pink gradient |
| `good` | `#22c55e` | `rgba(34,197,94,0.10)` | `#15803d` | green gradient |

```css
[data-tier="elite"] .xx-attr-dot   { background: var(--gold); }
[data-tier="elite"] .xx-attr-tier  { background: rgba(184,133,42,0.12); color: var(--gold); }
[data-tier="elite"] .xx-attr-score { color: var(--gold); }

[data-tier="high"] .xx-attr-dot    { background: var(--cu); }
[data-tier="high"] .xx-attr-tier   { background: var(--cu-tint); color: var(--cu); }
[data-tier="high"] .xx-attr-score  { color: var(--cu); }

[data-tier="good"] .xx-attr-dot    { background: #22c55e; }
[data-tier="good"] .xx-attr-tier   { background: rgba(34,197,94,0.10); color: #15803d; }
[data-tier="good"] .xx-attr-score  { color: #15803d; }
```

### 4.20 Highlights Box

```css
.xx-highlights {
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 12px;
  padding: 12px 14px;
  background: rgba(0, 0, 0, 0.01);
}

.xx-hl-title {
  font: 700 9px / 1 var(--f);
  color: var(--t3);
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.xx-hl-list {
  list-style: none;
  padding: 0; margin: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.xx-hl-list li {
  display: flex;
  gap: 9px;
  align-items: flex-start;
}

.xx-hl-icon {
  font-size: 13px;
  line-height: 1.25;
  flex-shrink: 0;
}

.xx-hl-text {
  font: 400 11px / 1.45 var(--f);
  color: var(--t2);
}
```

### 4.21 Verified Strip

```css
.xx-verified-strip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 10px 14px;
  background: rgba(34, 197, 94, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.18);
  border-radius: 12px;
  font: 500 11px / 1 var(--f);
  color: #16a34a;
  text-align: center;
}
```

### 4.22 Key-Value Row Panel

For info rows like card authentication, academic standing, etc.

```css
.xx-panel {
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 13px;
  padding: 12px 14px;
}

.xx-rows { display: flex; flex-direction: column; gap: 0; }

.xx-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  padding: 7px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.xx-row:last-child { border-bottom: none; }

.xx-row-key {
  font: 500 11px / 1 var(--f);
  color: var(--t3);
  flex-shrink: 0;
  white-space: nowrap;
}

.xx-row-val {
  font: 500 11px / 1.3 var(--f);
  color: var(--t1);
  text-align: right;
}

/* Monospace for technical IDs */
.xx-mono {
  font-family: 'SF Mono', 'Menlo', 'Consolas', monospace !important;
  font-size: 10.5px !important;
  letter-spacing: 0.03em;
  color: var(--t2) !important;
}
```

---

## 5. Typography Scale

| Role                  | Font          | Size     | Weight | Spacing  | Color   |
|-----------------------|---------------|----------|--------|----------|---------|
| Header title          | `var(--f)`    | 11px     | 700    | 0.06em   | `--t1`  |
| Section title         | `var(--f)`    | 8.5-9.5px| 700    | 0.10em   | `--t3`  |
| Tab label             | `var(--f)`    | 9-10px   | 700    | 0.10em   | `--t3` / `--cu` |
| Data value (big)      | `var(--f)`    | 17-26px  | 700    | -0.01em  | `--t1`  |
| Data key/label        | `var(--f)`    | 7.5-8.5px| 500-600| 0.05em   | `--t3`  |
| Metadata value        | `var(--f)`    | 11px     | 500    | 0.02em   | `--t1`  |
| Metadata key          | `var(--f)`    | 8.5px    | 600    | 0.10em   | `--t3`  |
| Monospace / tech      | `monospace`   | 8.5-10px | 400-600| 0.02em   | `--t2`  |
| Bar label             | `var(--f)`    | 9px      | 400    | -        | `--t2`  |
| Subtitle / note       | `var(--f)`    | 8.5-9.5px| 400    | 0.02em   | `--t3`  |
| Thai text             | `var(--f-th)` | same     | same   | -        | -       |

**Rules:**
- Labels/keys are always **uppercase + tracked** (letter-spacing 0.04-0.12em).
- Values use **normal case**.
- Thai text uses `var(--f-th)` (Sarabun family).
- On `html[lang="en"]`, override font-family to `var(--f)`.

---

## 6. Animation & Motion

### 6.1 Entry / Exit

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Sheet slide up | `translateY(100%) -> 0` | 0.44s | `var(--spring)` |
| Tab panel fade in | `opacity 0->1, translateY(6px)->0` | 0.25s | `ease` |
| Bar fills | `width: 0 -> var(--w)` | 0.75-0.9s | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Ring fills | `stroke-dashoffset` | 1.4s | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Staggered elements | per-child delay | +60-90ms each | via `--delay` CSS var |
| Hex tiles (Analysis) | `scale(0.82)->1, opacity 0->1` | 0.35s | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| Card entrance | `translateY(18px)->0, opacity 0->1` | 0.5s | `cubic-bezier(0.22, 1, 0.36, 1)` |

### 6.2 Ambient

| Element | Animation | Duration | Notes |
|---------|-----------|----------|-------|
| Sysbar scroll | `translateX(0) -> translateX(-50%)` | 28s linear infinite | Duplicate content for loop |
| Pulse dot | `opacity 1 -> 0.3 -> 1` | 2s ease-in-out infinite | Status indicators |
| Background orbs | `translate(...)` | 16-22s alternate | Decorative only |
| Verified shimmer | `translateX(-120%) -> translateX(280%)` | 2.6s | Sweep overlay |

### 6.3 Re-animation Pattern

Bars and rings must reset to zero when sheets close, then re-animate on open. Use this JS pattern:

```js
// On sheet open:
panel.querySelectorAll('.xx-bar-fill').forEach(el => {
  el.style.transition = 'none';
  el.style.width = '0';
});
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    panel.querySelectorAll('.xx-bar-fill').forEach(el => {
      el.style.transition = '';
      el.style.width = '';
    });
  });
});

// For SVG rings on sheet open:
ring.style.strokeDashoffset = targetValue;

// For SVG rings on sheet close (reset):
ring.style.strokeDashoffset = '201.06';
```

---

## 7. Spacing Rules

| Token                        | Value     | Usage                             |
|------------------------------|-----------|-----------------------------------|
| Panel padding (horizontal)   | `18px`    | All intelligence-sheet content    |
| Simple sheet padding         | `24px`    | Student ID, Location sheets       |
| Section gap                  | `16px`    | margin-bottom between blocks      |
| Grid gap (data cells)        | `7-8px`   | Between grid cells                |
| Grid gap (stat cells)        | `6px`     | Between 3-col stat cells          |
| Card internal padding        | `10-14px` | Inside data cells, course cards   |
| Bar wrap margin              | `9px`     | Bottom margin between stacked bars|
| Tab padding                  | `10px 12-14px` | Tab buttons                  |
| Banner padding               | `14px 18px` | Hero score banner               |
| Handle top margin            | `10px auto 0` | Pull handle                   |
| Section title margin         | `16px 0 8-10px` | Above and below              |

---

## 8. Border & Shadow Patterns

```css
/* Standard card/cell border */
border: 1px solid rgba(0, 0, 0, 0.07);
border-radius: 10-12px;

/* Subtle inner background tint */
background: rgba(0, 0, 0, 0.015-0.025);

/* Section divider */
border-bottom: 1px solid rgba(0, 0, 0, 0.06);

/* Cards with elevation (landing page cards) */
box-shadow:
  0 1px 4px rgba(0, 0, 0, 0.06),
  0 4px 14px rgba(0, 0, 0, 0.04);

/* Featured card (ID card on landing) -- gradient border */
background:
  linear-gradient(#fff, #fff) padding-box,
  linear-gradient(150deg,
    var(--cu) 0%,
    rgba(222, 93, 142, 0.38) 28%,
    rgba(184, 133, 42, 0.22) 62%,
    rgba(0, 0, 0, 0.07) 100%) border-box;
border: 2px solid transparent;

/* Sheet panel shadow */
box-shadow: 0 -2px 30px rgba(0, 0, 0, 0.08);

/* Scrim backdrop */
background: rgba(0, 0, 0, 0.28-0.45);
backdrop-filter: blur(5px);
```

---

## 9. Template: Adding a New Intelligence System Sheet

### 9.1 HTML Structure

```html
<!-- Add trigger button in the landing page cards section -->
<button class="card card-sm" data-sheet="mysheet" type="button">
  <div class="card-icon ci-pink"><!-- SVG icon --></div>
  <div class="card-text">
    <span class="card-label">
      <span class="l-th">Thai Label</span>
      <span class="l-en">English Label</span>
    </span>
    <span class="card-sub">Subtitle text</span>
  </div>
  <svg class="card-arrow" width="12" height="12" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round">
    <path d="M7 17L17 7M17 7H7M17 7v10" />
  </svg>
</button>

<!-- Sheet (place before </body>, alongside other sheets) -->
<div class="sheet" id="sheet-mysheet" role="dialog" aria-modal="true">
  <div class="sheet-scrim" data-close></div>
  <div class="sheet-panel sheet-panel-mysheet">
    <div class="sheet-handle"></div>

    <!-- HEADER -->
    <div class="my-header">
      <span class="my-badge">CATEGORY</span>
      <span class="my-header-title">CU [SYSTEM NAME] v1.0</span>
      <button class="my-close" data-close aria-label="Close">&times;</button>
    </div>

    <!-- SYSBAR (scrolling ticker) -->
    <div class="my-sysbar">
      <div class="my-sysbar-track">
        <span class="my-sb-key">KEY1</span><span class="my-sb-sep">&middot;</span><span class="my-sb-val">VAL1</span>
        <span class="my-sb-div">|</span>
        <span class="my-sb-key">KEY2</span><span class="my-sb-sep">&middot;</span><span class="my-sb-val">VAL2</span>
        <span class="my-sb-div">|</span>
        <!-- DUPLICATE for seamless loop -->
        <span class="my-sb-key">KEY1</span><span class="my-sb-sep">&middot;</span><span class="my-sb-val">VAL1</span>
        <span class="my-sb-div">|</span>
        <span class="my-sb-key">KEY2</span><span class="my-sb-sep">&middot;</span><span class="my-sb-val">VAL2</span>
      </div>
    </div>

    <!-- BANNER (score ring + metadata) -->
    <div class="my-banner">
      <div class="my-score-block">
        <div class="my-ring-wrap">
          <svg class="my-ring" viewBox="0 0 80 80">
            <circle class="my-ring-bg" cx="40" cy="40" r="32"/>
            <circle class="my-ring-fill" cx="40" cy="40" r="32"/>
          </svg>
          <div class="my-score-inner">
            <div class="my-score-val">94.7</div>
            <div class="my-score-denom">/100</div>
          </div>
        </div>
        <div class="my-status-label">
          <span class="my-status-dot"></span>STATUS TEXT
        </div>
      </div>
      <div class="my-meta-rows">
        <div class="my-meta-row">
          <span class="my-meta-key">LABEL</span>
          <span class="my-meta-val">Value</span>
        </div>
        <!-- more rows ... -->
      </div>
    </div>

    <!-- TABS -->
    <div class="my-tabs" role="tablist">
      <button class="my-tab active" data-mytab="mytab-one" role="tab" aria-selected="true">TAB ONE</button>
      <button class="my-tab" data-mytab="mytab-two" role="tab" aria-selected="false">TAB TWO</button>
    </div>

    <!-- TAB CONTENT -->
    <div class="my-tab-content">

      <div class="my-tab-panel active" id="mytab-one" role="tabpanel">
        <p class="my-section-title">SECTION HEADING</p>
        <div class="my-data-grid">
          <div class="my-data-cell">
            <span class="my-data-key">Metric Name</span>
            <span class="my-data-val">97.3</span>
            <span class="my-data-sub">Supporting text</span>
          </div>
          <div class="my-data-cell">
            <span class="my-data-key">Metric Name</span>
            <span class="my-data-val my-data-val--green">91.8</span>
            <span class="my-data-sub">Supporting text</span>
          </div>
        </div>

        <p class="my-section-title">INDICATOR BARS</p>
        <div class="my-bar-wrap">
          <div class="my-bar-label-row">
            <span class="my-bar-lbl">Bar Label</span>
            <span class="my-bar-val">93/100</span>
          </div>
          <div class="my-bar-track">
            <div class="my-bar-fill" style="--w: 93%"></div>
          </div>
        </div>
      </div>

      <div class="my-tab-panel" id="mytab-two" role="tabpanel">
        <!-- More content ... -->
      </div>

    </div>
  </div>
</div>
```

### 9.2 Required CSS

Write styles for your `my-` prefix classes following the patterns in section 3 and 4. Copy the exact property values from the reference classes above. The key structural classes you need:

1. `.sheet-panel-mysheet` (flex column layout)
2. `.my-header`, `.my-badge`, `.my-header-title`, `.my-close`
3. `.my-sysbar`, `.my-sysbar-track`, `.my-sb-key/val/sep/div`
4. `.my-banner`, `.my-ring-*`, `.my-score-*`, `.my-meta-*`
5. `.my-tabs`, `.my-tab`, `.my-tab.active`
6. `.my-tab-content`, `.my-tab-panel`, `.my-tab-panel.active`
7. `.my-section-title`
8. Then whichever components you need (data grid, bars, etc.)

### 9.3 Required JavaScript

Add tab switching and bar re-animation logic in `main.js`:

```js
/* -- MY SHEET TAB SWITCHING -- */
(function () {
  var sheet = document.getElementById('sheet-mysheet');
  if (!sheet) return;

  var tabBtns   = sheet.querySelectorAll('.my-tab');
  var tabPanels = sheet.querySelectorAll('.my-tab-panel');

  function switchTab(tabId) {
    tabBtns.forEach(function (b) {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    tabPanels.forEach(function (p) { p.classList.remove('active'); });

    var btn   = sheet.querySelector('.my-tab[data-mytab="' + tabId + '"]');
    var panel = document.getElementById(tabId);
    if (btn) { btn.classList.add('active'); btn.setAttribute('aria-selected', 'true'); }
    if (panel) panel.classList.add('active');
  }

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      switchTab(this.dataset.mytab);
    });
  });

  /* Re-animate bars on sheet open */
  new MutationObserver(function () {
    if (sheet.classList.contains('open')) {
      sheet.querySelectorAll('.my-bar-fill').forEach(function (el) {
        el.style.transition = 'none';
        el.style.width = '0';
      });
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          sheet.querySelectorAll('.my-bar-fill').forEach(function (el) {
            el.style.transition = '';
            el.style.width = '';
          });
        });
      });
    } else {
      /* Reset tab to first on close */
      switchTab('mytab-one');
    }
  }).observe(sheet, { attributes: true, attributeFilter: ['class'] });
})();
```

The existing sheet open/close logic in `main.js` already handles `data-sheet="mysheet"` triggers and `data-close` buttons automatically.

---

## 10. Naming Convention

### 10.1 CSS Class Prefixes

Each sheet uses a unique **2-3 letter prefix** to namespace its classes:

| Sheet             | Prefix | Example classes                               |
|-------------------|--------|-----------------------------------------------|
| Cheat Panel       | `cp-`  | `cp-header`, `cp-data-grid`, `cp-bar-fill`    |
| Academic          | `ac-`  | `ac-header`, `ac-course-card`, `ac-gpa-bar`   |
| Athletic          | `sp-`  | `sp-header`, `sp-stat-grid`, `sp-radar`       |
| Student ID        | `sid-` | `sid-header`, `sid-barcode`, `sid-chip-strip` |
| 3D Card           | `card3d-` | `card3d-scene`, `card3d-face`              |
| Location/Map      | `map-` | `map-frame`, `map-transit-card`               |
| **New sheet**     | `xx-`  | Pick a unique prefix, e.g. `fi-` for Finance  |

### 10.2 HTML ID Pattern

- Sheet container: `id="sheet-{name}"`
- Tab panels: `id="{prefix}tab-{tabname}"`

### 10.3 Data Attributes

- Sheet triggers: `data-sheet="{name}"` on buttons
- Tab triggers: `data-{prefix}tab="{tabId}"` on tab buttons
- Close triggers: `data-close` on scrim and close buttons (handled globally)

---

## 11. Bilingual System

The site supports Thai (`th`) and English (`en`) with zero-reflow language switching.

### 11.1 Basic Language Spans

```html
<span class="l-th">Thai text</span>
<span class="l-en">English text</span>
```

When `html[lang="th"]`, `.l-en` is hidden. When `html[lang="en"]`, `.l-th` is hidden.

### 11.2 Stable Layout (No Reflow)

For elements where language switching must not cause layout shifts, use `.lang-stable`:

```html
<span class="card-label lang-stable">
  <span class="l-th">Thai Label</span>
  <span class="l-en">English Label</span>
</span>
```

Both versions occupy the same grid cell. The inactive one becomes `visibility: hidden` (not `display: none`) so it still takes up space.

```css
.lang-stable { display: grid; }
.lang-stable > * { grid-area: 1 / 1; min-width: 0; }

html[lang="th"] .lang-stable > .l-en,
html[lang="en"] .lang-stable > .l-th {
  display: block !important;
  visibility: hidden;
  pointer-events: none;
  user-select: none;
}
```

### 11.3 Font Override for English

When English is active, override Thai font to Inter:

```css
html[lang="en"] .xx-label { font-family: var(--f); }
```

### 11.4 Intelligence System Sheets

The intelligence-system sheets (Academic, Athletic, Cheat Panel) use **English-only** labels for their data-dense UI. The section titles, metadata keys, tab labels, and technical values are all in English uppercase. Only descriptive content (highlights, descriptions) needs bilingual spans.

---

## Appendix: Landing Page Card Icon Colors

| Card type | CSS class | Background | Icon color |
|-----------|-----------|------------|------------|
| Pink      | `.ci-pink` | `var(--cu-tint)` | `var(--cu)` |
| Gold      | `.ci-gold` | `var(--gold-tint)` | `var(--gold)` |
| Green     | `.ci-green` | `rgba(34, 197, 94, 0.10)` | `#16a34a` |
| Map/Blue  | `.ci-map` | `rgba(59, 130, 246, 0.10)` | `#2563eb` |
| Indigo    | `.ci-indigo` | `rgba(99, 102, 241, 0.10)` | `#4f46e5` |

To add a new icon color, follow this pattern:

```css
.ci-newcolor {
  background: rgba(R, G, B, 0.10);
  color: #hexcolor;
}
```
