# Athletic Profile Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add sport photoshoots, animated radar, and attribute breakdown cards to the athletic profile sheet.

**Architecture:** Pure HTML/CSS/JS — no frameworks. Sport blocks restructured into split-card layout (photo left, stats right). Radar polygon animated via JS RAF interpolation on sheet open. Attribute breakdown rendered as a 2-column card grid below the radar.

**Tech Stack:** Vanilla HTML, CSS custom properties, SVG, requestAnimationFrame

---

### Task 1: Restructure football sport block HTML

**Files:**
- Modify: `index.html` (football sp-sport-block, lines ~1150–1235)

Replace old `sp-sport-head + sp-stats-grid + sp-perf-bars` flat layout with:
```
sp-sport-top (flex row)
  ├── sp-sport-photo (left, ~130px, football_photoshoot.png + badge overlay)
  └── sp-sport-right (flex-1, flex-col)
        ├── sp-sport-head (name, club, rating — NO emoji)
        └── sp-stats-grid (4 boxes inside right column)
sp-perf-bars (full-width below sp-sport-top)
```

### Task 2: Restructure swimming sport block HTML

**Files:**
- Modify: `index.html` (swimming sp-sport-block, lines ~1237–1302)

```
sp-sport-top (flex row)
  ├── sp-sport-photo (svimming_photoshoot.png + badge overlay)
  └── sp-sport-right (flex-1, flex-col)
        ├── sp-sport-head (name, club, ELITE badge — NO emoji)
        └── sp-training-strip (4×/wk, ~4km, ~64km inside right column)
sp-pb-table (full-width PB table below sp-sport-top)
```

### Task 3: Add attribute breakdown + profile summary below radar

**Files:**
- Modify: `index.html` (sp-section with sp-radar-wrap, lines ~1102–1148)

- Add `id="sp-radar-poly"` to polygon, `class="sp-radar-dot"` to all 6 circles
- After `</div><!-- /.sp-radar-wrap -->`, add:
  - `sp-attr-grid` (2-col grid, 6 attribute cards, sorted: Teamwork 95 ELITE, Technique 91 ELITE, Speed 88 HIGH, Agility 87 HIGH, Endurance 82 HIGH, Strength 76 GOOD)
  - Each card: dot + name + tier badge + score + mini bar + 1-line desc
  - `sp-profile-summary` card: archetype label + score badge + bio text

Attribute descriptions:
- Teamwork 95 ELITE → "Leadership & spatial reading"
- Technique 91 ELITE → "Superior ball control & first touch"
- Speed 88 HIGH → "Elite burst pace & off-ball movement"
- Agility 87 HIGH → "Quick direction changes & explosive turns"
- Endurance 82 HIGH → "High match fitness over 90 minutes"
- Strength 76 GOOD → "Solid physical contest ability"

Profile summary text: "Technical Playmaker · Elite technique (91) and teamwork (95) anchor a high-tempo attacking style. Speed (88) and agility (87) deliver constant off-ball threat throughout the match."

### Task 4: CSS — sport block split-card layout

**Files:**
- Modify: `style.css` (after `.sp-sport-block` section)

New CSS rules:
- `.sp-sport-top { display: flex; }` — the flex row container
- `.sp-sport-photo { width: 130px; flex-shrink: 0; position: relative; background: #111; overflow: hidden; }` — photo panel
- `.sp-sport-photo img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 5%; display: block; }`
- `.sp-sport-photo-badge { position: absolute; bottom: 8px; left: 8px; font-size: 18px; line-height: 1; filter: drop-shadow(0 1px 3px rgba(0,0,0,0.5)); }`
- `.sp-sport-right { flex: 1; min-width: 0; display: flex; flex-direction: column; }`
- `.sp-sport-right .sp-sport-head { border-bottom: 1px solid rgba(0,0,0,0.07); }` — separator inside right col
- `.sp-sport-right .sp-training-strip { border-top: none; flex: 1; }` — no double border
- `.sp-perf-bars { border-top: 1px solid rgba(0,0,0,0.07); }` — separator between top and bars
- Remove emoji styling (`.sp-sport-emoji`) if no longer needed

### Task 5: CSS — attribute breakdown grid + profile summary

**Files:**
- Modify: `style.css` (add after radar CSS)

New CSS rules:
- `.sp-attr-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 14px; }`
- `.sp-attr-card { background: rgba(0,0,0,0.025); border: 1px solid rgba(0,0,0,0.06); border-radius: 10px; padding: 10px; }`
- `.sp-attr-card-top { display: flex; align-items: center; gap: 5px; margin-bottom: 5px; }`
- `.sp-attr-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }`
- `.sp-attr-card-name { font: 600 9px/1 var(--f); color: var(--t3); letter-spacing: 0.05em; text-transform: uppercase; flex: 1; }`
- `.sp-attr-tier { font: 700 7.5px/1 var(--f); letter-spacing: 0.07em; padding: 2px 5px; border-radius: 4px; }`
- `.sp-attr-score-row { display: flex; align-items: baseline; gap: 2px; margin-bottom: 6px; }`
- `.sp-attr-card-score { font: 700 20px/1 var(--f); letter-spacing: -0.02em; }`
- `.sp-attr-score-denom { font: 400 10px/1 var(--f); color: var(--t3); }`
- `.sp-attr-bar-track { height: 3px; background: rgba(0,0,0,0.07); border-radius: 999px; overflow: hidden; margin-bottom: 6px; }`
- `.sp-attr-bar-fill { height: 100%; width: 0; border-radius: inherit; transition: width 0s; }`
- `.sheet.open .sp-attr-bar-fill { width: var(--aw); transition: width 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.6s; }`
- `.sp-attr-desc { font: 400 9px/1.3 var(--f); color: var(--t3); }`
- Data-tier colors: `[data-tier="elite"]` → gold, `[data-tier="high"]` → `var(--cu)`, `[data-tier="good"]` → `#22c55e`
- `.sp-profile-summary { background: linear-gradient(135deg, rgba(222,93,142,0.06), rgba(184,133,42,0.06)); border: 1px solid rgba(222,93,142,0.12); border-radius: 12px; padding: 12px; margin-top: 10px; }`
- `.sp-profile-header, .sp-profile-archetype, .sp-profile-text` styles

### Task 6: JS — radar animation on sheet-activities open

**Files:**
- Modify: `main.js` (add IIFE at end)

Logic:
1. Target polygon by `id="sp-radar-poly"`, dots by `.sp-radar-dot`
2. Store TARGET positions: `[[100,42.8],[146.2,73.35],[142.8,124.7],[100,156.55],[48.8,129.6],[46.5,69.1]]`
3. MutationObserver on `#sheet-activities` class changes
4. On open: reset all points to center `(100,100)`, then RAF loop over 900ms with `easeOutBack` easing
5. Dots animate with per-vertex delay (80ms × index)
6. On close: set `animated = false` so it replays next open

### Task 7: Commit

```bash
git add index.html style.css main.js
git commit -m "feat: athletic profile split-card photos, animated radar, attribute breakdown"
```
