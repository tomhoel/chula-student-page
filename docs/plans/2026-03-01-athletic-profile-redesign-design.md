# Athletic Profile Sheet — Consistency & Redesign

**Date:** 2026-03-01
**Status:** Approved (updated after ac-* academic sheet landed)

## Goal

Align the athletic profile sheet (`#sheet-activities`) to the same design language as the
academic sheet (`#sheet-academic`) — matching fonts, header chrome, animated sysbar, and
animated banner ring — while redesigning the sport cards to be full-bleed, data-rich player
cards with no boxy borders.

---

## Section 1 — Chrome: Header + Sysbar + Banner

### 1. sp-header → exact ac-header pattern

| Property | Current (broken) | New (matches ac-*) |
|---|---|---|
| Title structure | Two-line block (label + subtitle) | Single bold title line |
| Title text | "ATHLETIC PROFILE · PERFORMANCE RECORD" + subtitle | "CU ATHLETIC PERFORMANCE SYSTEM" |
| Badge font | 8px | 9px (same as ac-cls-badge) |
| Badge label | SPORT | SPORT (keep, pink) |
| flex-shrink | missing | `flex-shrink: 0` (fixes width bug) |

### 2. sp-sysbar → animated scrolling ticker

Replace static items-with-dots with the same animated ticker pattern as ac-sysbar:
- `animation: spSysScroll 28s linear infinite` on inner track
- Content duplicated for seamless loop
- Same `key · val` structure (no bold keys, monospace values)
- Items: `SPORTS · 2 | FITNESS · 87/100 | RANK · TOP 8% | SEASON · 2025–26 | DIV · GRAD | SPORT 1 · FOOTBALL | SPORT 2 · SWIMMING`
- RANK value in pink (`var(--cu)`)

### 3. sp-athlete-banner → animated fitness ring

Mirror ac-student-banner exactly:
- Left block: SVG ring (80×80px, r=32) — fitness index 87/100 → 87% fill
  - Ring animates in (stroke-dashoffset) when sheet opens, same cubic-bezier as ac
  - Inner text: `87` (large) + `/100` (small denominator)
  - Below ring: pulsing dot + `ELITE ATHLETE` label (mirrors HONOURS CANDIDATE)
- Right: meta rows — SPORT COUNT / YEARS ACTIVE / RANK / DIVISION / SEASON
  - Same ac-meta-key / ac-meta-val font sizing and spacing

---

## Section 2 — Sport Cards (OVERVIEW tab)

### Problem with current design
Bordered box (`border: 1px solid`), photo at 34% width, wasted body space.

### New design — full-bleed player cards

```
┌────────────────────────────────────────┐
│ PHOTO (42%)  │ [FOOTBALL]  [ELITE] 8.3 │
│              │ ─────────────────────── │
│  full-bleed  │ CU Economics FC         │
│  object-fit: │ กองกลางตัวรุก / Attk Mid│
│  cover       │ ─────────────────────── │
│              │ 12   │  4   │  7  │ 75% │
│              │ MTH  │ GLS  │ AST │ WIN │
│              │ ─────────────────────── │
│              │ ● ● ● ● ● ○ ● ○  FORM  │
└────────────────────────────────────────┘
```

- **No outer border** — cards separated by gap only
- **Photo**: left 42%, full height, hard left edge flush with sheet
- **Body top**: sport badge (pink/blue tinted) + optional ELITE chip + rating number flush right
- **Body mid**: club + role (Thai/EN bilingual)
- **Body stats**: 4 chips in a row — value bold + label tiny uppercase
- **Form strip**: 8 small dots (W=green, D=amber, L=red for football; PB=pink, good=green, normal=grey for swimming)
- Subtle entrance animation (translateY + opacity, same as existing)

---

## Section 3 — Overview Tab: Remaining Sections

- **Season Activity** — keep, just ensure section title uses same sp-section-title style
- **Athletic Attributes radar** — keep exactly as-is (animated, already correct)
- **Attribute Breakdown bars** — keep, ensure bar animation matches ac-* bar pattern
- **Profile Summary** — remove box border and background gradient; go flat:
  - Archetype name bold large, badge inline, description text below
  - No `border`, no `background` fill on `.sp-profile-summary`

---

## What Changes

### HTML
- `sp-header`: collapse two-line title block → single `<span class="sp-header-title">`
- `sp-sysbar`: replace static items with duplicated-content animated track (like ac-sysbar)
- `sp-athlete-banner`: replace text score block with SVG ring + honours-style label

### CSS
- `sp-header`, `sp-sport-badge`, `sp-header-title`: align to ac-* sizes/weights
- `sp-sysbar` + inner track: add `spSysScroll` animation, remove static item styles
- `sp-athlete-banner`, ring, inner, label: new animated ring styles (mirror ac-*)
- `sp-sport-card`: remove border, photo → 42%, add form strip styles
- `.sp-profile-summary`: remove border/background

### JS
- Add fitness ring animation on sheet open (same pattern as ac ring)
- Reset ring on sheet close

---

## Non-Goals

- Do NOT change tab structure (OVERVIEW / FOOTBALL / SWIMMING)
- Do NOT change football/swimming tab content
- Do NOT change radar chart or attribute breakdown data
