# Athletic Profile — Overview Tab Redesign

**Date:** 2026-03-01
**Status:** Approved

## Goal

Replace the minimal radar-only overview with a rich, animated overview that gives a genuine summary of both sports (football + swimming), includes graphs, and has great visual polish.

## Sections

### 1. Sport Snapshot Cards
Two stacked full-width cards (football pink, swimming blue), each with:
- Photo thumbnail (left 1/3, reuses existing sport photos)
- Right 2/3: sport tag, club/role, animated counter for headline stat (8.3/10 rating for football, 26.4s PB for swimming), 4 mini-stats, season badge
- Staggered slide-in animation on tab open (`animation-delay`)

### 2. Season Activity Graph
- Inline SVG bar chart, 12 months (Jan–Dec 2025)
- Two bar layers per month: pink (football matches played) and blue (swim sessions)
- Data: football matches played each month (Jan 0, Feb 1, Mar 2, Apr 3, May 1, Jun 0, Jul 0, Aug 0, Sep 1, Oct 2, Nov 1, Dec 1 = 12 total); swim sessions per month (Jan 12, Feb 14, Mar 16, Apr 14, May 12, Jun 8, Jul 6, Aug 8, Sep 14, Oct 16, Nov 14, Dec 12)
- Bars grow from 0 via CSS animation triggered when `.sheet.open`
- Month labels below, small legend above

### 3. Athletic Attributes (kept)
- Existing animated radar SVG (Speed 88, Endurance 82, Strength 76, Agility 87, Technique 91, Teamwork 95) — unchanged
- Existing attribute breakdown 2×3 grid of cards — unchanged

### 4. Achievements Strip
- Horizontal scrolling row of chip badges (no wrap)
- Chips: 🥇 CU Games 100m Free · 🥇 Faculty Fly Record · 🥈 CU Games 200m IM · 🏆 3× Man of the Match · 🥈 Economics Cup Final
- Subtle gradient fade on right edge to hint at scrollability

### 5. Profile Summary (redesigned)
- Larger archetype label ("Technical Playmaker") with pink accent
- Clean description text
- "86.5 avg" score more prominently displayed
- Subtle gradient background (pink→gold tint)

## Animations
- Sport cards: `translateY(12px) opacity 0 → 1` staggered (card1: 0ms, card2: 80ms)
- Counter numbers: CSS `@counter` not possible in CSS-only; use JS `requestAnimationFrame` count-up triggered on tab switch
- Activity bars: CSS `scaleY(0→1)` with staggered `animation-delay` per bar column
- Radar: existing animation kept

## CSS Classes (new)
- `.sp-sport-cards` — wrapper
- `.sp-sport-card`, `.sp-sport-card--football`, `.sp-sport-card--swim`
- `.sp-activity-chart` — SVG bar chart wrapper
- `.sp-activity-bar--football`, `.sp-activity-bar--swim`
- `.sp-achievements` — horizontal scroll strip
- `.sp-ach-chip` — individual achievement badge

## Constraints
- Vanilla HTML/CSS/JS, no frameworks
- Reuses existing sport photos (`football_photoshoot.webp`, `svimming_photoshoot.webp`)
- Must work within `.sp-tab-content` padding (`16px 18px`)
- Consistent with cp-style aesthetic (subtle borders, `border-radius: 10px`, `rgba(0,0,0,0.07)` borders)
