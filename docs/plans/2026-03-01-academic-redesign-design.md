# Academic Performance Sheet Redesign — Design Document

**Date:** 2026-03-01
**Status:** Approved

---

## Goal

Redesign `#sheet-academic` to use the same CU Intelligence System design language (`cp-header` / `cp-sysbar` / `cp-student-banner` / `cp-tabs`) with 4 tabs: RECORD / METRICS / ANALYSIS / FORECAST. Advanced UI with animated GPA ring, trend lines, hex grid, and projection charts.

---

## Architecture

### Container Structure

```
#sheet-academic
  .ac-header          ← red ACADEMIC badge + title + close btn
  .ac-sysbar          ← monospace key-value strip
  .ac-student-banner  ← left: GPA ring block | right: metadata rows
  .ac-tabs            ← tab bar (4 tabs)
  #actab-record       ← tab panel
  #actab-metrics      ← tab panel
  #actab-analysis     ← tab panel
  #actab-forecast     ← tab panel
```

Mirrors `cp-container` structure exactly. New prefix `ac-` to avoid conflicts.

---

## Components

### ac-header
- Red classification badge: `ACADEMIC`
- Title: `CU ACADEMIC INTELLIGENCE SYSTEM`
- Close button (same as cp-header)

### ac-sysbar
Monospace horizontal strip:
```
GPA · 3.78 / RANK · 5 OF 42 / PERCENTILE · TOP 12% / STATUS · HONOURS TRACK / CREDITS · 18/30 / SEMESTER · 2 OF 6
```

### ac-student-banner
Two-column layout:

**Left block:**
- Large animated SVG ring arc (3.78/4.00 = 94.5% filled)
- `3.78` in large monospace font
- `/ 4.00` subtext
- `HONOURS CANDIDATE` label with pulsing green dot
- Ring uses `--cu` pink/rose color

**Right block (metadata rows):**
| Label | Value |
|-------|-------|
| PROGRAM | M.Sc. Finance |
| TRACK | Financial Economics |
| CREDITS | 18 / 30 |
| SEMESTER | 2 of 6 |
| COHORT | 9562 |
| ADVISOR | Assoc. Prof. Dr. Suree T. |

### ac-tabs (4 tabs)
`RECORD` · `METRICS` · `ANALYSIS` · `FORECAST`

---

## Tab Content

### Tab 1 — RECORD

**Semester GPA comparison:**
- Two bars (Sem 1: 3.65, Sem 2: 3.78) with animated scale-in
- Arrow/delta indicator: `+0.13 ↑`

**Course sections (2 semesters):**
Each course card:
```
[A] ECON 6201 · Portfolio Theory                96%
    ████████████████████░░░░  You
    ██████████████░░░░░░░░░░  Cohort avg 72%
    +24pp above cohort
```
- Grade badge colored by grade (A=pink, A-=rose, B+=amber)
- Dual progress bars (yours vs cohort)
- Delta callout

### Tab 2 — METRICS

**Credits ring:** Animated arc 18/30 (60%). Center shows `18 / 30 cr`.

**Cohort rank strip:** 42 dots in a row, dot #5 highlighted in pink with label `5th`.

**Grade distribution bars:**
```
A    ████████████  12
B+   ███████████   11
B    █████████      9
C+   ██████          6
C    ████              4
     (cohort 9562, 42 students)
```
Horizontal bars, animated fill-in.

### Tab 3 — ANALYSIS

**Subject affinity hex grid (2×3):**
Each hexagon = one course, filled with color intensity based on score:
- Hot pink (95%+): Portfolio Theory, Fin. Economics, Derivatives
- Medium: Corp Finance, Quant Methods
- Cool: Microeconomics

**Score delta table:**
```
ECON 6203 Derivatives        +25pp  ▲
ECON 6201 Portfolio Theory   +24pp  ▲
ECON 6101 Fin. Economics     +19pp  ▲
ECON 6102 Quant Methods      +21pp  ▲
ECON 6202 Corp Finance       +16pp  ▲
ECON 6103 Microeconomics     +5pp   ▲
```

**Performance signature:** Text callout — "STRONGEST: Quantitative Finance · CONSISTENT: All above cohort"

### Tab 4 — FORECAST

**GPA trajectory chart (SVG line chart):**
- Plotted points: Sem1 (3.65), Sem2 (3.78)
- Dotted extrapolation: Sem3–6 (3.82 → 3.85 → 3.88 → 3.90)
- Shaded confidence band around projection
- Honours threshold line at 3.50 (dashed, labeled)

**Status cards (2×2 grid):**
| Card | Value |
|------|-------|
| HONOURS STATUS | ON TRACK · +0.28 above threshold |
| PROJECTED FINAL GPA | 3.88 – 3.92 |
| GRADUATION | On schedule · May 2027 |
| RISK FLAGS | NONE DETECTED |

**Credits to graduation:** `18 / 30 completed · 12 remaining · Est. 4 semesters`

---

## Visual Language

- **Color**: `var(--cu)` = #de5d8e (pink/rose) as primary accent; red badge for ACADEMIC header
- **Typography**: Monospace for data values; existing font stack for labels
- **Animations**:
  - GPA ring: SVG `stroke-dashoffset` on sheet open
  - Sysbar: same scrolling marquee style as cp/sp sysbar
  - Tab panels: fade+translateY in on switch
  - Course bars: `scaleX` from 0 to target width on tab activation
  - Hex grid: staggered opacity + scale in
  - Forecast line: SVG `stroke-dashoffset` draw-on animation
- **Cards**: Same `border: 1px solid rgba(0,0,0,0.07); border-radius: 10px` as sp-stat-cell

---

## Data (All Content)

| Field | Value |
|-------|-------|
| GPA cumulative | 3.78 / 4.00 |
| Sem 1 GPA | 3.65 |
| Sem 2 GPA | 3.78 |
| Rank | 5th of 42 |
| Percentile | Top 12% |
| Credits | 18 / 30 |
| Status | Honours Candidate |
| ECON 6201 Portfolio Theory | A · 96% · cohort 72% |
| ECON 6202 Corporate Finance | A- · 90% · cohort 74% |
| ECON 6203 Derivatives | A · 93% · cohort 68% |
| ECON 6101 Financial Economics | A · 95% · cohort 76% |
| ECON 6102 Quantitative Methods | A · 92% · cohort 71% |
| ECON 6103 Microeconomics | B+ · 84% · cohort 79% |
| Grade dist | A=12, B+=11, B=9, C+=6, C=4 |
| Advisor | Assoc. Prof. Dr. Suree Tangtermsirikul, Dept. Finance, EC 601 |
