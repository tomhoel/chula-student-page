# Academic Performance Sheet Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the academic sheet (`#sheet-academic`) with a CU Intelligence System-style design — ac-header + ac-sysbar + ac-student-banner + 4 tabs (RECORD / METRICS / ANALYSIS / FORECAST).

**Architecture:** Replace all inner HTML of `.sheet-panel-academic` (after `.sheet-handle`) with ac-* components. Append all new CSS to `style.css`. Add JS tab-switching IIFE + animations to `main.js`. Remove old ag-* CSS blocks and old ag-* JS collapsible code.

**Tech Stack:** Vanilla HTML / CSS / JS. No build tools. SVG for charts. CSS transitions triggered by `.active` class on tab panels.

---

## Key File Locations

- HTML: `index.html` — `#sheet-academic` starts at line 462. `.sheet-panel-academic` at line 464. Content to replace starts at the `<div class="sheet-head">` (line 467) and ends just before the two closing `</div>` tags that close `.sheet-panel-academic` and `#sheet-academic` (around line 1176).
- CSS: `style.css` — old ag-* CSS from line 2342 to ~4502. New CSS goes at end of file.
- JS: `main.js` — old ag-* JS at lines 423–~480. New JS goes at end of file.

---

## Task 1: Replace Academic Sheet HTML Shell

**Files:** Modify `index.html`

**Step 1:** Find the academic sheet content. Open `index.html`, search for `<div class="sheet-panel sheet-panel-academic">` (line 464). Everything between `<div class="sheet-handle"></div>` and the two closing `</div>` tags (that close `.sheet-panel-academic` and `#sheet-academic`) gets deleted and replaced.

**Step 2:** Delete lines 467–1176 (from `<div class="sheet-head">` through the last content div before the panel closes). Replace with this HTML block:

```html
      <!-- ── AC HEADER ─────────────────────────────── -->
      <div class="ac-header">
        <span class="ac-cls-badge">ACADEMIC</span>
        <span class="ac-header-title">CU ACADEMIC INTELLIGENCE SYSTEM</span>
        <button class="ac-close" data-close aria-label="Close">✕</button>
      </div>

      <!-- ── AC SYSBAR ─────────────────────────────── -->
      <div class="ac-sysbar">
        <div class="ac-sysbar-track">
          <span class="ac-sb-key">GPA</span><span class="ac-sb-sep">·</span><span class="ac-sb-val">3.78</span>
          <span class="ac-sb-div">|</span>
          <span class="ac-sb-key">RANK</span><span class="ac-sb-sep">·</span><span class="ac-sb-val">5 OF 42</span>
          <span class="ac-sb-div">|</span>
          <span class="ac-sb-key">PERCENTILE</span><span class="ac-sb-sep">·</span><span class="ac-sb-val">TOP 12%</span>
          <span class="ac-sb-div">|</span>
          <span class="ac-sb-key">STATUS</span><span class="ac-sb-sep">·</span><span class="ac-sb-val">HONOURS TRACK</span>
          <span class="ac-sb-div">|</span>
          <span class="ac-sb-key">CREDITS</span><span class="ac-sb-sep">·</span><span class="ac-sb-val">18 / 30</span>
          <span class="ac-sb-div">|</span>
          <span class="ac-sb-key">SEMESTER</span><span class="ac-sb-sep">·</span><span class="ac-sb-val">2 OF 6</span>
          <span class="ac-sb-div">|</span>
          <span class="ac-sb-key">COHORT</span><span class="ac-sb-sep">·</span><span class="ac-sb-val">9562</span>
          <span class="ac-sb-div">|</span>
          <span class="ac-sb-key">PROGRAM</span><span class="ac-sb-sep">·</span><span class="ac-sb-val">M.Sc. Finance</span>
          <span class="ac-sb-div">|</span>
          <!-- duplicate for seamless loop -->
          <span class="ac-sb-key">GPA</span><span class="ac-sb-sep">·</span><span class="ac-sb-val">3.78</span>
          <span class="ac-sb-div">|</span>
          <span class="ac-sb-key">RANK</span><span class="ac-sb-sep">·</span><span class="ac-sb-val">5 OF 42</span>
          <span class="ac-sb-div">|</span>
          <span class="ac-sb-key">PERCENTILE</span><span class="ac-sb-sep">·</span><span class="ac-sb-val">TOP 12%</span>
          <span class="ac-sb-div">|</span>
          <span class="ac-sb-key">STATUS</span><span class="ac-sb-sep">·</span><span class="ac-sb-val">HONOURS TRACK</span>
          <span class="ac-sb-div">|</span>
          <span class="ac-sb-key">CREDITS</span><span class="ac-sb-sep">·</span><span class="ac-sb-val">18 / 30</span>
          <span class="ac-sb-div">|</span>
          <span class="ac-sb-key">SEMESTER</span><span class="ac-sb-sep">·</span><span class="ac-sb-val">2 OF 6</span>
          <span class="ac-sb-div">|</span>
          <span class="ac-sb-key">COHORT</span><span class="ac-sb-sep">·</span><span class="ac-sb-val">9562</span>
          <span class="ac-sb-div">|</span>
          <span class="ac-sb-key">PROGRAM</span><span class="ac-sb-sep">·</span><span class="ac-sb-val">M.Sc. Finance</span>
        </div>
      </div>

      <!-- ── AC STUDENT BANNER ──────────────────────── -->
      <div class="ac-student-banner">
        <div class="ac-score-block">
          <div class="ac-gpa-ring-wrap">
            <svg class="ac-gpa-ring" viewBox="0 0 80 80">
              <circle class="ac-ring-bg" cx="40" cy="40" r="32"/>
              <circle class="ac-ring-fill" cx="40" cy="40" r="32"/>
            </svg>
            <div class="ac-score-inner">
              <div class="ac-score-val">3.78</div>
              <div class="ac-score-denom">/4.00</div>
            </div>
          </div>
          <div class="ac-honours-label">
            <span class="ac-honours-dot"></span>HONOURS CANDIDATE
          </div>
        </div>
        <div class="ac-meta-rows">
          <div class="ac-meta-row">
            <span class="ac-meta-key">PROGRAM</span>
            <span class="ac-meta-val">M.Sc. Finance</span>
          </div>
          <div class="ac-meta-row">
            <span class="ac-meta-key">TRACK</span>
            <span class="ac-meta-val">Financial Economics</span>
          </div>
          <div class="ac-meta-row">
            <span class="ac-meta-key">CREDITS</span>
            <span class="ac-meta-val">18 / 30</span>
          </div>
          <div class="ac-meta-row">
            <span class="ac-meta-key">SEMESTER</span>
            <span class="ac-meta-val">2 of 6</span>
          </div>
          <div class="ac-meta-row">
            <span class="ac-meta-key">COHORT</span>
            <span class="ac-meta-val">9562</span>
          </div>
          <div class="ac-meta-row">
            <span class="ac-meta-key">ADVISOR</span>
            <span class="ac-meta-val">A.Prof.Dr. Suree T.</span>
          </div>
        </div>
      </div>

      <!-- ── AC TABS ────────────────────────────────── -->
      <div class="ac-tabs" role="tablist">
        <button class="ac-tab active" data-actab="actab-record" role="tab">RECORD</button>
        <button class="ac-tab" data-actab="actab-metrics" role="tab">METRICS</button>
        <button class="ac-tab" data-actab="actab-analysis" role="tab">ANALYSIS</button>
        <button class="ac-tab" data-actab="actab-forecast" role="tab">FORECAST</button>
      </div>

      <!-- ── AC TAB CONTENT ─────────────────────────── -->
      <div class="ac-tab-content">

        <!-- RECORD TAB (placeholder) -->
        <div class="ac-tab-panel active" id="actab-record">
          <!-- filled in Task 2 -->
        </div>

        <!-- METRICS TAB (placeholder) -->
        <div class="ac-tab-panel" id="actab-metrics">
          <!-- filled in Task 3 -->
        </div>

        <!-- ANALYSIS TAB (placeholder) -->
        <div class="ac-tab-panel" id="actab-analysis">
          <!-- filled in Task 4 -->
        </div>

        <!-- FORECAST TAB (placeholder) -->
        <div class="ac-tab-panel" id="actab-forecast">
          <!-- filled in Task 5 -->
        </div>

      </div><!-- /.ac-tab-content -->
```

**Step 3:** Verify file saves. Open in browser, reload. The sheet should now show the new header/banner/tabs shell (no content yet in tabs — that's fine). The old ag-hero content should be gone.

**Step 4:** Commit.
```bash
git add index.html
git commit -m "feat: academic sheet — replace shell with ac-header/sysbar/banner/tabs"
```

---

## Task 2: RECORD Tab HTML

**Files:** Modify `index.html`

Replace the `<!-- filled in Task 2 -->` placeholder inside `#actab-record` with:

```html
          <div class="ac-section-title">GPA PROGRESSION</div>
          <div class="ac-gpa-compare">
            <div class="ac-gpa-bar-row">
              <span class="ac-gpa-sem">SEM 1</span>
              <div class="ac-gpa-bar-wrap">
                <div class="ac-gpa-bar" style="--target: 91.25%"></div>
              </div>
              <span class="ac-gpa-val">3.65</span>
            </div>
            <div class="ac-gpa-bar-row">
              <span class="ac-gpa-sem">SEM 2</span>
              <div class="ac-gpa-bar-wrap">
                <div class="ac-gpa-bar" style="--target: 94.5%"></div>
              </div>
              <span class="ac-gpa-val">3.78 <span class="ac-delta-badge">+0.13 ↑</span></span>
            </div>
          </div>

          <div class="ac-section-title">SEMESTER 2 — ACTIVE <span class="ac-sem-gpa">GPA 3.78</span></div>

          <div class="ac-course-card">
            <div class="ac-course-head">
              <span class="ac-grade-badge ac-grade-a">A</span>
              <div class="ac-course-info">
                <div class="ac-course-code">ECON 6201</div>
                <div class="ac-course-name">Portfolio Theory</div>
              </div>
              <div class="ac-course-score">96%</div>
            </div>
            <div class="ac-bars">
              <div class="ac-bar-row">
                <span class="ac-bar-label">You</span>
                <div class="ac-bar-wrap"><div class="ac-bar ac-bar-you" style="--w:96%;--delay:0ms"></div></div>
                <span class="ac-bar-pct">96</span>
              </div>
              <div class="ac-bar-row">
                <span class="ac-bar-label">Avg</span>
                <div class="ac-bar-wrap"><div class="ac-bar ac-bar-avg" style="--w:72%;--delay:60ms"></div></div>
                <span class="ac-bar-pct">72</span>
              </div>
            </div>
            <div class="ac-course-delta">+24pp above cohort</div>
          </div>

          <div class="ac-course-card">
            <div class="ac-course-head">
              <span class="ac-grade-badge ac-grade-a-minus">A−</span>
              <div class="ac-course-info">
                <div class="ac-course-code">ECON 6202</div>
                <div class="ac-course-name">Corporate Finance</div>
              </div>
              <div class="ac-course-score">90%</div>
            </div>
            <div class="ac-bars">
              <div class="ac-bar-row">
                <span class="ac-bar-label">You</span>
                <div class="ac-bar-wrap"><div class="ac-bar ac-bar-you" style="--w:90%;--delay:80ms"></div></div>
                <span class="ac-bar-pct">90</span>
              </div>
              <div class="ac-bar-row">
                <span class="ac-bar-label">Avg</span>
                <div class="ac-bar-wrap"><div class="ac-bar ac-bar-avg" style="--w:74%;--delay:140ms"></div></div>
                <span class="ac-bar-pct">74</span>
              </div>
            </div>
            <div class="ac-course-delta">+16pp above cohort</div>
          </div>

          <div class="ac-course-card">
            <div class="ac-course-head">
              <span class="ac-grade-badge ac-grade-a">A</span>
              <div class="ac-course-info">
                <div class="ac-course-code">ECON 6203</div>
                <div class="ac-course-name">Derivatives</div>
              </div>
              <div class="ac-course-score">93%</div>
            </div>
            <div class="ac-bars">
              <div class="ac-bar-row">
                <span class="ac-bar-label">You</span>
                <div class="ac-bar-wrap"><div class="ac-bar ac-bar-you" style="--w:93%;--delay:160ms"></div></div>
                <span class="ac-bar-pct">93</span>
              </div>
              <div class="ac-bar-row">
                <span class="ac-bar-label">Avg</span>
                <div class="ac-bar-wrap"><div class="ac-bar ac-bar-avg" style="--w:68%;--delay:220ms"></div></div>
                <span class="ac-bar-pct">68</span>
              </div>
            </div>
            <div class="ac-course-delta">+25pp above cohort</div>
          </div>

          <div class="ac-section-title">SEMESTER 1 — COMPLETE <span class="ac-sem-gpa">GPA 3.65</span></div>

          <div class="ac-course-card ac-course-card--done">
            <div class="ac-course-head">
              <span class="ac-grade-badge ac-grade-a">A</span>
              <div class="ac-course-info">
                <div class="ac-course-code">ECON 6101</div>
                <div class="ac-course-name">Financial Economics</div>
              </div>
              <div class="ac-course-score">95%</div>
            </div>
            <div class="ac-bars">
              <div class="ac-bar-row">
                <span class="ac-bar-label">You</span>
                <div class="ac-bar-wrap"><div class="ac-bar ac-bar-you" style="--w:95%;--delay:240ms"></div></div>
                <span class="ac-bar-pct">95</span>
              </div>
              <div class="ac-bar-row">
                <span class="ac-bar-label">Avg</span>
                <div class="ac-bar-wrap"><div class="ac-bar ac-bar-avg" style="--w:76%;--delay:300ms"></div></div>
                <span class="ac-bar-pct">76</span>
              </div>
            </div>
            <div class="ac-course-delta">+19pp above cohort</div>
          </div>

          <div class="ac-course-card ac-course-card--done">
            <div class="ac-course-head">
              <span class="ac-grade-badge ac-grade-a">A</span>
              <div class="ac-course-info">
                <div class="ac-course-code">ECON 6102</div>
                <div class="ac-course-name">Quantitative Methods</div>
              </div>
              <div class="ac-course-score">92%</div>
            </div>
            <div class="ac-bars">
              <div class="ac-bar-row">
                <span class="ac-bar-label">You</span>
                <div class="ac-bar-wrap"><div class="ac-bar ac-bar-you" style="--w:92%;--delay:320ms"></div></div>
                <span class="ac-bar-pct">92</span>
              </div>
              <div class="ac-bar-row">
                <span class="ac-bar-label">Avg</span>
                <div class="ac-bar-wrap"><div class="ac-bar ac-bar-avg" style="--w:71%;--delay:380ms"></div></div>
                <span class="ac-bar-pct">71</span>
              </div>
            </div>
            <div class="ac-course-delta">+21pp above cohort</div>
          </div>

          <div class="ac-course-card ac-course-card--done">
            <div class="ac-course-head">
              <span class="ac-grade-badge ac-grade-b-plus">B+</span>
              <div class="ac-course-info">
                <div class="ac-course-code">ECON 6103</div>
                <div class="ac-course-name">Microeconomics</div>
              </div>
              <div class="ac-course-score">84%</div>
            </div>
            <div class="ac-bars">
              <div class="ac-bar-row">
                <span class="ac-bar-label">You</span>
                <div class="ac-bar-wrap"><div class="ac-bar ac-bar-you" style="--w:84%;--delay:400ms"></div></div>
                <span class="ac-bar-pct">84</span>
              </div>
              <div class="ac-bar-row">
                <span class="ac-bar-label">Avg</span>
                <div class="ac-bar-wrap"><div class="ac-bar ac-bar-avg" style="--w:79%;--delay:460ms"></div></div>
                <span class="ac-bar-pct">79</span>
              </div>
            </div>
            <div class="ac-course-delta">+5pp above cohort</div>
          </div>
```

**Commit:**
```bash
git add index.html
git commit -m "feat: academic sheet — RECORD tab HTML"
```

---

## Task 3: METRICS Tab HTML

Replace `<!-- filled in Task 3 -->` inside `#actab-metrics` with:

```html
          <div class="ac-metrics-top">
            <div class="ac-credits-ring-wrap">
              <svg class="ac-credits-ring" viewBox="0 0 120 120">
                <circle class="ac-cr-bg" cx="60" cy="60" r="50"/>
                <circle class="ac-cr-fill" cx="60" cy="60" r="50"/>
              </svg>
              <div class="ac-credits-center">
                <div class="ac-credits-num">18</div>
                <div class="ac-credits-denom">/ 30 cr</div>
              </div>
            </div>
            <div class="ac-rank-block">
              <div class="ac-section-title" style="margin-top:0">COHORT RANK</div>
              <div class="ac-rank-strip" id="acRankStrip"></div>
              <div class="ac-rank-label">5th of 42 students · Top 12%</div>
            </div>
          </div>

          <div class="ac-section-title">GRADE DISTRIBUTION · COHORT 9562</div>
          <div class="ac-grade-dist">
            <div class="ac-dist-row">
              <span class="ac-dist-grade">A</span>
              <div class="ac-dist-bar-wrap"><div class="ac-dist-bar" style="--w:85%;--delay:0ms"></div></div>
              <span class="ac-dist-count">12</span>
            </div>
            <div class="ac-dist-row">
              <span class="ac-dist-grade">B+</span>
              <div class="ac-dist-bar-wrap"><div class="ac-dist-bar" style="--w:79%;--delay:80ms"></div></div>
              <span class="ac-dist-count">11</span>
            </div>
            <div class="ac-dist-row">
              <span class="ac-dist-grade">B</span>
              <div class="ac-dist-bar-wrap"><div class="ac-dist-bar" style="--w:64%;--delay:160ms"></div></div>
              <span class="ac-dist-count">9</span>
            </div>
            <div class="ac-dist-row">
              <span class="ac-dist-grade">C+</span>
              <div class="ac-dist-bar-wrap"><div class="ac-dist-bar" style="--w:43%;--delay:240ms"></div></div>
              <span class="ac-dist-count">6</span>
            </div>
            <div class="ac-dist-row">
              <span class="ac-dist-grade">C</span>
              <div class="ac-dist-bar-wrap"><div class="ac-dist-bar" style="--w:29%;--delay:320ms"></div></div>
              <span class="ac-dist-count">4</span>
            </div>
          </div>

          <div class="ac-section-title">GPA vs HONOURS THRESHOLD</div>
          <div class="ac-threshold-block">
            <div class="ac-threshold-bar-wrap">
              <div class="ac-threshold-track">
                <div class="ac-threshold-fill" style="--w:94.5%"></div>
                <div class="ac-threshold-marker" style="--pos:87.5%" title="Honours 3.50">
                  <span class="ac-threshold-label">3.50 min</span>
                </div>
              </div>
            </div>
            <div class="ac-threshold-meta">
              <span class="ac-threshold-val">3.78</span>
              <span class="ac-threshold-gap">+0.28 above threshold</span>
            </div>
          </div>
```

**Commit:**
```bash
git add index.html
git commit -m "feat: academic sheet — METRICS tab HTML"
```

---

## Task 4: ANALYSIS Tab HTML

Replace `<!-- filled in Task 4 -->` inside `#actab-analysis` with:

```html
          <div class="ac-section-title">SUBJECT AFFINITY</div>
          <div class="ac-hex-grid">
            <div class="ac-hex" style="--intensity:0.95;--stagger:0ms">
              <div class="ac-hex-name">Portfolio<br>Theory</div>
              <div class="ac-hex-score">96%</div>
            </div>
            <div class="ac-hex" style="--intensity:0.75;--stagger:60ms">
              <div class="ac-hex-name">Corp<br>Finance</div>
              <div class="ac-hex-score">90%</div>
            </div>
            <div class="ac-hex" style="--intensity:0.88;--stagger:120ms">
              <div class="ac-hex-name">Derivatives</div>
              <div class="ac-hex-score">93%</div>
            </div>
            <div class="ac-hex" style="--intensity:0.92;--stagger:180ms">
              <div class="ac-hex-name">Financial<br>Economics</div>
              <div class="ac-hex-score">95%</div>
            </div>
            <div class="ac-hex" style="--intensity:0.80;--stagger:240ms">
              <div class="ac-hex-name">Quant<br>Methods</div>
              <div class="ac-hex-score">92%</div>
            </div>
            <div class="ac-hex" style="--intensity:0.45;--stagger:300ms">
              <div class="ac-hex-name">Micro-<br>economics</div>
              <div class="ac-hex-score">84%</div>
            </div>
          </div>

          <div class="ac-section-title">SCORE vs COHORT AVERAGE</div>
          <div class="ac-delta-table">
            <div class="ac-delta-row">
              <span class="ac-delta-course">ECON 6203 Derivatives</span>
              <div class="ac-delta-bar-wrap"><div class="ac-delta-bar" style="--w:100%;--delay:0ms"></div></div>
              <span class="ac-delta-val">+25pp</span>
            </div>
            <div class="ac-delta-row">
              <span class="ac-delta-course">ECON 6201 Portfolio Theory</span>
              <div class="ac-delta-bar-wrap"><div class="ac-delta-bar" style="--w:96%;--delay:70ms"></div></div>
              <span class="ac-delta-val">+24pp</span>
            </div>
            <div class="ac-delta-row">
              <span class="ac-delta-course">ECON 6102 Quant Methods</span>
              <div class="ac-delta-bar-wrap"><div class="ac-delta-bar" style="--w:84%;--delay:140ms"></div></div>
              <span class="ac-delta-val">+21pp</span>
            </div>
            <div class="ac-delta-row">
              <span class="ac-delta-course">ECON 6101 Fin. Economics</span>
              <div class="ac-delta-bar-wrap"><div class="ac-delta-bar" style="--w:76%;--delay:210ms"></div></div>
              <span class="ac-delta-val">+19pp</span>
            </div>
            <div class="ac-delta-row">
              <span class="ac-delta-course">ECON 6202 Corp Finance</span>
              <div class="ac-delta-bar-wrap"><div class="ac-delta-bar" style="--w:64%;--delay:280ms"></div></div>
              <span class="ac-delta-val">+16pp</span>
            </div>
            <div class="ac-delta-row">
              <span class="ac-delta-course">ECON 6103 Microeconomics</span>
              <div class="ac-delta-bar-wrap"><div class="ac-delta-bar" style="--w:20%;--delay:350ms"></div></div>
              <span class="ac-delta-val">+5pp</span>
            </div>
          </div>

          <div class="ac-signature">
            <div class="ac-sig-label">PERFORMANCE SIGNATURE</div>
            <div class="ac-sig-text">STRONGEST · Quantitative Finance &amp; Derivatives · ALL 6 SUBJECTS ABOVE COHORT AVERAGE</div>
          </div>
```

**Commit:**
```bash
git add index.html
git commit -m "feat: academic sheet — ANALYSIS tab HTML"
```

---

## Task 5: FORECAST Tab HTML

Replace `<!-- filled in Task 5 -->` inside `#actab-forecast` with:

```html
          <div class="ac-section-title">GPA TRAJECTORY</div>
          <!-- SVG coordinate system: viewBox 0 0 300 130
               X: S1=30 S2=78 S3=126 S4=174 S5=222 S6=270
               Y: GPA 3.2=115, 4.0=10  (scale: (gpa-3.2)/0.8 * 105, inverted)
               3.50→76  3.65→56  3.78→39  3.82→34  3.85→30  3.88→26  3.90→23 -->
          <div class="ac-trajectory-wrap">
            <svg class="ac-trajectory" viewBox="0 0 300 130" preserveAspectRatio="xMidYMid meet">
              <!-- grid lines -->
              <line x1="30" y1="49" x2="270" y2="49" class="ac-traj-grid"/>
              <line x1="30" y1="76" x2="270" y2="76" class="ac-traj-threshold"/>
              <line x1="30" y1="115" x2="270" y2="115" class="ac-traj-grid"/>
              <!-- y-axis labels -->
              <text x="4" y="53" class="ac-traj-label">3.70</text>
              <text x="4" y="80" class="ac-traj-label">3.50</text>
              <!-- honours label -->
              <text x="200" y="73" class="ac-traj-honours-label">HONOURS MIN</text>
              <!-- projected confidence band (S2 to S6) -->
              <polygon class="ac-traj-band" points="78,39 126,28 174,22 222,18 270,16 270,32 222,34 174,38 126,40 78,39"/>
              <!-- actual solid line S1→S2 -->
              <polyline class="ac-traj-actual" points="30,56 78,39"/>
              <!-- projected dashed line S2→S6 -->
              <polyline class="ac-traj-projected" points="78,39 126,34 174,30 222,26 270,23"/>
              <!-- actual dots -->
              <circle cx="30" cy="56" r="4.5" class="ac-traj-dot" style="--delay:900ms"/>
              <circle cx="78" cy="39" r="4.5" class="ac-traj-dot" style="--delay:1000ms"/>
              <!-- projected dots (hollow) -->
              <circle cx="126" cy="34" r="3" class="ac-traj-dot-proj" style="--delay:1200ms"/>
              <circle cx="174" cy="30" r="3" class="ac-traj-dot-proj" style="--delay:1400ms"/>
              <circle cx="222" cy="26" r="3" class="ac-traj-dot-proj" style="--delay:1600ms"/>
              <circle cx="270" cy="23" r="3" class="ac-traj-dot-proj" style="--delay:1800ms"/>
            </svg>
            <div class="ac-traj-x-labels">
              <span>S1</span><span>S2</span><span>S3</span><span>S4</span><span>S5</span><span>S6</span>
            </div>
          </div>

          <div class="ac-forecast-grid">
            <div class="ac-forecast-card">
              <div class="ac-fc-label">HONOURS STATUS</div>
              <div class="ac-fc-val ac-fc-green">ON TRACK</div>
              <div class="ac-fc-sub">+0.28 above threshold</div>
            </div>
            <div class="ac-forecast-card">
              <div class="ac-fc-label">PROJECTED GPA</div>
              <div class="ac-fc-val">3.88 – 3.92</div>
              <div class="ac-fc-sub">Based on trajectory</div>
            </div>
            <div class="ac-forecast-card">
              <div class="ac-fc-label">GRADUATION</div>
              <div class="ac-fc-val">May 2027</div>
              <div class="ac-fc-sub">On schedule</div>
            </div>
            <div class="ac-forecast-card">
              <div class="ac-fc-label">RISK FLAGS</div>
              <div class="ac-fc-val ac-fc-green">NONE</div>
              <div class="ac-fc-sub">All subjects above avg</div>
            </div>
          </div>

          <div class="ac-credits-path">
            <span class="ac-cp-label">CREDITS TO GRADUATION</span>
            <span class="ac-cp-val">18 / 30 completed · 12 remaining · Est. 4 semesters</span>
          </div>

          <div class="ac-section-title" style="margin-top:16px">UPCOMING COURSES — SEM 3 (PLANNED)</div>
          <div class="ac-upcoming-list">
            <div class="ac-upcoming-row">
              <span class="ac-upcoming-code">ECON 6301</span>
              <span class="ac-upcoming-name">Fixed Income &amp; Credit Markets</span>
              <span class="ac-upcoming-cr">3 cr</span>
            </div>
            <div class="ac-upcoming-row">
              <span class="ac-upcoming-code">ECON 6302</span>
              <span class="ac-upcoming-name">International Finance</span>
              <span class="ac-upcoming-cr">3 cr</span>
            </div>
            <div class="ac-upcoming-row">
              <span class="ac-upcoming-code">ECON 6303</span>
              <span class="ac-upcoming-name">Financial Modelling</span>
              <span class="ac-upcoming-cr">3 cr</span>
            </div>
          </div>
```

**Commit:**
```bash
git add index.html
git commit -m "feat: academic sheet — FORECAST tab HTML"
```

---

## Task 6: CSS — Shell Components

**Files:** Append to end of `style.css`

```css
/* ══════════════════════════════════════════════════════
   ACADEMIC INTELLIGENCE SYSTEM — Sheet Redesign
   ac-* prefix
══════════════════════════════════════════════════════ */

/* override sheet-panel default so our flex column works */
.sheet-panel-academic {
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
}

/* ── HEADER ─────────────────────────────────────────── */
.ac-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 18px 10px;
  border-bottom: 1px solid rgba(0,0,0,0.07);
  flex-shrink: 0;
}
.ac-cls-badge {
  background: #c0392b;
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 3px 8px;
  border-radius: 3px;
  font-family: var(--f);
  flex-shrink: 0;
}
.ac-header-title {
  font-family: var(--f);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--t1);
  flex: 1;
  text-transform: uppercase;
}
.ac-close {
  background: none;
  border: none;
  color: var(--t3);
  font-size: 15px;
  cursor: pointer;
  padding: 4px 6px;
  line-height: 1;
  border-radius: 4px;
}
.ac-close:hover { background: rgba(0,0,0,0.06); }

/* ── SYSBAR ──────────────────────────────────────────── */
.ac-sysbar {
  background: rgba(0,0,0,0.025);
  border-bottom: 1px solid rgba(0,0,0,0.07);
  overflow: hidden;
  padding: 7px 0;
  flex-shrink: 0;
}
.ac-sysbar-track {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  animation: acSysScroll 28s linear infinite;
  white-space: nowrap;
  font-family: var(--f);
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--t2);
  padding-left: 18px;
}
.ac-sb-key { color: var(--t3); font-weight: 600; }
.ac-sb-val { color: var(--t1); font-weight: 500; }
.ac-sb-sep { color: var(--t3); }
.ac-sb-div { color: rgba(0,0,0,0.15); }
@keyframes acSysScroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* ── STUDENT BANNER ───────────────────────────────────── */
.ac-student-banner {
  display: flex;
  align-items: center;
  padding: 14px 18px;
  gap: 16px;
  border-bottom: 1px solid rgba(0,0,0,0.07);
  background: linear-gradient(135deg, rgba(222,93,142,0.04) 0%, transparent 60%);
  flex-shrink: 0;
}
.ac-score-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  flex-shrink: 0;
}
.ac-gpa-ring-wrap {
  position: relative;
  width: 80px;
  height: 80px;
}
.ac-gpa-ring {
  width: 80px;
  height: 80px;
  transform: rotate(-90deg);
}
.ac-ring-bg {
  fill: none;
  stroke: rgba(0,0,0,0.07);
  stroke-width: 7;
}
.ac-ring-fill {
  fill: none;
  stroke: var(--cu);
  stroke-width: 7;
  stroke-linecap: round;
  stroke-dasharray: 201.06;
  stroke-dashoffset: 201.06; /* starts invisible; JS animates to 11.06 on open */
  transition: stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1);
}
.ac-score-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  line-height: 1.1;
}
.ac-score-val {
  font-family: var(--f);
  font-size: 21px;
  font-weight: 700;
  color: var(--t1);
  letter-spacing: -0.02em;
}
.ac-score-denom {
  font-family: var(--f);
  font-size: 10px;
  color: var(--t3);
}
.ac-honours-label {
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
.ac-honours-dot {
  width: 6px;
  height: 6px;
  background: #22c55e;
  border-radius: 50%;
  flex-shrink: 0;
  animation: acDotPulse 2s ease-in-out infinite;
}
@keyframes acDotPulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}
.ac-meta-rows {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.ac-meta-row {
  display: flex;
  gap: 8px;
  align-items: baseline;
}
.ac-meta-key {
  font-family: var(--f);
  font-size: 8.5px;
  letter-spacing: 0.1em;
  color: var(--t3);
  text-transform: uppercase;
  min-width: 62px;
  flex-shrink: 0;
  font-weight: 600;
}
.ac-meta-val {
  font-family: var(--f);
  font-size: 11px;
  color: var(--t1);
  font-weight: 500;
}

/* ── TABS ────────────────────────────────────────────── */
.ac-tabs {
  display: flex;
  border-bottom: 1px solid rgba(0,0,0,0.07);
  padding: 0 18px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  flex-shrink: 0;
}
.ac-tabs::-webkit-scrollbar { display: none; }
.ac-tab {
  padding: 10px 14px;
  font-family: var(--f);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--t3);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.2s, border-color 0.2s;
  margin-bottom: -1px;
}
.ac-tab.active {
  color: var(--cu);
  border-bottom-color: var(--cu);
}
.ac-tab-content {
  overflow-y: auto;
  flex: 1;
  -webkit-overflow-scrolling: touch;
}
.ac-tab-panel {
  display: none;
  padding: 4px 18px 28px;
}
.ac-tab-panel.active {
  display: block;
  animation: acPanelIn 0.25s ease;
}
@keyframes acPanelIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
.ac-section-title {
  font-family: var(--f);
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--t3);
  margin: 16px 0 8px;
  padding-bottom: 5px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

**Verify:** Open in browser, open academic sheet. Should see red header, scrolling sysbar, GPA ring (starts empty — JS not added yet), metadata rows, tab bar.

**Commit:**
```bash
git add style.css
git commit -m "feat: academic sheet CSS — shell (header, sysbar, banner, tabs)"
```

---

## Task 7: CSS — RECORD Tab

**Files:** Append to end of `style.css`

```css
/* ── RECORD TAB ──────────────────────────────────────── */
.ac-sem-gpa {
  color: var(--cu);
  font-weight: 700;
  letter-spacing: 0;
}
.ac-gpa-compare { margin-bottom: 16px; }
.ac-gpa-bar-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.ac-gpa-sem {
  font-family: var(--f);
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--t3);
  min-width: 38px;
  font-weight: 600;
}
.ac-gpa-bar-wrap {
  flex: 1;
  height: 8px;
  background: rgba(0,0,0,0.05);
  border-radius: 4px;
  overflow: hidden;
}
.ac-gpa-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--cu), rgba(222,93,142,0.7));
  border-radius: 4px;
  width: 0%;
  transition: width 0.9s cubic-bezier(0.16,1,0.3,1);
}
#actab-record.active .ac-gpa-bar {
  width: var(--target);
}
.ac-gpa-val {
  font-family: var(--f);
  font-size: 12px;
  font-weight: 700;
  color: var(--t1);
  min-width: 72px;
  text-align: right;
}
.ac-delta-badge {
  font-size: 10px;
  color: #22c55e;
  font-weight: 600;
}

/* course cards */
.ac-course-card {
  border: 1px solid rgba(0,0,0,0.07);
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 8px;
  background: rgba(0,0,0,0.015);
}
.ac-course-card--done { opacity: 0.85; }
.ac-course-head {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}
.ac-grade-badge {
  font-family: var(--f);
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 5px;
  flex-shrink: 0;
  min-width: 30px;
  text-align: center;
}
.ac-grade-a       { background: rgba(222,93,142,0.14); color: var(--cu); }
.ac-grade-a-minus { background: rgba(222,93,142,0.10); color: var(--cu); }
.ac-grade-b-plus  { background: rgba(234,179,8,0.15);  color: #b45309;  }
.ac-course-info { flex: 1; }
.ac-course-code {
  font-family: var(--f);
  font-size: 9px;
  color: var(--t3);
  letter-spacing: 0.06em;
  font-weight: 600;
  margin-bottom: 2px;
}
.ac-course-name {
  font-family: var(--f);
  font-size: 13px;
  color: var(--t1);
  font-weight: 600;
  line-height: 1.2;
}
.ac-course-score {
  font-family: var(--f);
  font-size: 18px;
  font-weight: 700;
  color: var(--t1);
  flex-shrink: 0;
}
.ac-bars {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 6px;
}
.ac-bar-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
.ac-bar-label {
  font-family: var(--f);
  font-size: 9px;
  color: var(--t3);
  min-width: 22px;
  letter-spacing: 0.04em;
}
.ac-bar-wrap {
  flex: 1;
  height: 5px;
  background: rgba(0,0,0,0.06);
  border-radius: 3px;
  overflow: hidden;
}
.ac-bar {
  height: 100%;
  border-radius: 3px;
  width: 0%;
  transition: width 0.85s cubic-bezier(0.16,1,0.3,1) var(--delay, 0ms);
}
#actab-record.active .ac-bar { width: var(--w); }
.ac-bar-you { background: var(--cu); }
.ac-bar-avg { background: rgba(0,0,0,0.22); }
.ac-bar-pct {
  font-family: var(--f);
  font-size: 9px;
  color: var(--t2);
  min-width: 18px;
  text-align: right;
}
.ac-course-delta {
  font-family: var(--f);
  font-size: 10px;
  color: #22c55e;
  font-weight: 600;
}
```

**Verify:** Switch to RECORD tab. Course cards should appear with animated bars when tab is active.

**Commit:**
```bash
git add style.css
git commit -m "feat: academic sheet CSS — RECORD tab styles"
```

---

## Task 8: CSS — METRICS + ANALYSIS Tabs

**Files:** Append to end of `style.css`

```css
/* ── METRICS TAB ─────────────────────────────────────── */
.ac-metrics-top {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding-top: 4px;
  margin-bottom: 4px;
}
.ac-credits-ring-wrap {
  position: relative;
  width: 100px;
  height: 100px;
  flex-shrink: 0;
}
.ac-credits-ring {
  width: 100px;
  height: 100px;
  transform: rotate(-90deg);
}
.ac-cr-bg {
  fill: none;
  stroke: rgba(0,0,0,0.07);
  stroke-width: 9;
}
.ac-cr-fill {
  fill: none;
  stroke: var(--cu);
  stroke-width: 9;
  stroke-linecap: round;
  stroke-dasharray: 314.16;
  stroke-dashoffset: 314.16; /* starts invisible */
  transition: stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1) 0.15s;
}
#actab-metrics.active .ac-cr-fill {
  stroke-dashoffset: 125.66; /* 60% = 18/30 */
}
.ac-credits-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  line-height: 1.2;
}
.ac-credits-num {
  font-family: var(--f);
  font-size: 24px;
  font-weight: 700;
  color: var(--t1);
  letter-spacing: -0.02em;
}
.ac-credits-denom {
  font-family: var(--f);
  font-size: 10px;
  color: var(--t3);
}
.ac-rank-block { flex: 1; }
.ac-rank-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  margin-bottom: 7px;
}
.ac-rank-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(0,0,0,0.1);
}
.ac-rank-dot.me {
  background: var(--cu);
  box-shadow: 0 0 0 2px rgba(222,93,142,0.25);
}
.ac-rank-label {
  font-family: var(--f);
  font-size: 11px;
  color: var(--t2);
  font-weight: 500;
}
.ac-grade-dist {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 16px;
}
.ac-dist-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ac-dist-grade {
  font-family: var(--f);
  font-size: 11px;
  font-weight: 700;
  color: var(--t2);
  min-width: 22px;
}
.ac-dist-bar-wrap {
  flex: 1;
  height: 12px;
  background: rgba(0,0,0,0.05);
  border-radius: 6px;
  overflow: hidden;
}
.ac-dist-bar {
  height: 100%;
  background: var(--cu);
  border-radius: 6px;
  opacity: 0.75;
  width: 0%;
  transition: width 0.85s cubic-bezier(0.16,1,0.3,1) var(--delay, 0ms);
}
#actab-metrics.active .ac-dist-bar { width: var(--w); }
.ac-dist-count {
  font-family: var(--f);
  font-size: 11px;
  color: var(--t2);
  min-width: 18px;
  text-align: right;
}

/* threshold bar */
.ac-threshold-block { margin-bottom: 16px; }
.ac-threshold-bar-wrap { margin-bottom: 6px; }
.ac-threshold-track {
  position: relative;
  height: 12px;
  background: rgba(0,0,0,0.05);
  border-radius: 6px;
  overflow: visible;
}
.ac-threshold-fill {
  height: 100%;
  background: linear-gradient(90deg, rgba(222,93,142,0.5), var(--cu));
  border-radius: 6px;
  width: 0%;
  transition: width 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s;
}
#actab-metrics.active .ac-threshold-fill { width: var(--w); }
.ac-threshold-marker {
  position: absolute;
  top: -3px;
  left: var(--pos);
  transform: translateX(-50%);
  width: 2px;
  height: 18px;
  background: #f59e0b;
  border-radius: 1px;
}
.ac-threshold-label {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--f);
  font-size: 8px;
  color: #b45309;
  white-space: nowrap;
  font-weight: 600;
}
.ac-threshold-meta {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 20px;
}
.ac-threshold-val {
  font-family: var(--f);
  font-size: 16px;
  font-weight: 700;
  color: var(--t1);
}
.ac-threshold-gap {
  font-family: var(--f);
  font-size: 11px;
  color: #22c55e;
  font-weight: 600;
}

/* ── ANALYSIS TAB ─────────────────────────────────────── */
.ac-hex-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}
.ac-hex {
  aspect-ratio: 1;
  background: rgba(222, 93, 142, var(--intensity));
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 8px 4px;
  opacity: 0;
  transform: scale(0.82);
  transition: opacity 0.35s ease var(--stagger, 0ms),
              transform 0.35s cubic-bezier(0.34,1.56,0.64,1) var(--stagger, 0ms);
}
#actab-analysis.active .ac-hex {
  opacity: 1;
  transform: scale(1);
}
.ac-hex-name {
  font-family: var(--f);
  font-size: 9px;
  color: rgba(255,255,255,0.92);
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1.3;
  margin-bottom: 5px;
}
.ac-hex-score {
  font-family: var(--f);
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.01em;
}
.ac-delta-table {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 14px;
}
.ac-delta-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ac-delta-course {
  font-family: var(--f);
  font-size: 10px;
  color: var(--t2);
  min-width: 140px;
  font-weight: 500;
}
.ac-delta-bar-wrap {
  flex: 1;
  height: 6px;
  background: rgba(0,0,0,0.05);
  border-radius: 3px;
  overflow: hidden;
}
.ac-delta-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--cu), rgba(222,93,142,0.55));
  border-radius: 3px;
  width: 0%;
  transition: width 0.85s cubic-bezier(0.16,1,0.3,1) var(--delay, 0ms);
}
#actab-analysis.active .ac-delta-bar { width: var(--w); }
.ac-delta-val {
  font-family: var(--f);
  font-size: 11px;
  font-weight: 700;
  color: #22c55e;
  min-width: 38px;
  text-align: right;
}
.ac-signature {
  background: rgba(222,93,142,0.06);
  border: 1px solid rgba(222,93,142,0.16);
  border-radius: 10px;
  padding: 10px 12px;
}
.ac-sig-label {
  font-family: var(--f);
  font-size: 8.5px;
  letter-spacing: 0.1em;
  color: var(--t3);
  text-transform: uppercase;
  margin-bottom: 4px;
  font-weight: 600;
}
.ac-sig-text {
  font-family: var(--f);
  font-size: 11px;
  color: var(--t1);
  font-weight: 600;
  line-height: 1.45;
}
```

**Verify:** METRICS and ANALYSIS tabs show correct content.

**Commit:**
```bash
git add style.css
git commit -m "feat: academic sheet CSS — METRICS and ANALYSIS tab styles"
```

---

## Task 9: CSS — FORECAST Tab

**Files:** Append to end of `style.css`

```css
/* ── FORECAST TAB ────────────────────────────────────── */
.ac-trajectory-wrap { margin-bottom: 8px; }
.ac-trajectory {
  width: 100%;
  height: 130px;
  overflow: visible;
}
.ac-traj-grid {
  stroke: rgba(0,0,0,0.07);
  stroke-width: 1;
}
.ac-traj-threshold {
  stroke: #f59e0b;
  stroke-width: 1;
  stroke-dasharray: 5 3;
}
.ac-traj-honours-label {
  font-size: 7px;
  fill: #b45309;
  font-family: var(--f);
  letter-spacing: 0.06em;
  font-weight: 600;
}
.ac-traj-label {
  font-size: 8px;
  fill: var(--t3, #aaa);
  font-family: var(--f);
  letter-spacing: 0.04em;
}
.ac-traj-band {
  fill: rgba(222,93,142,0.07);
}
.ac-traj-actual {
  fill: none;
  stroke: var(--cu);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 500;
  stroke-dashoffset: 500;
  transition: stroke-dashoffset 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s;
}
.ac-traj-projected {
  fill: none;
  stroke: var(--cu);
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-dasharray: 6 4;
  opacity: 0.55;
}
/* Note: ac-traj-projected uses stroke-dasharray for dashes, not animation offset */
#actab-forecast.active .ac-traj-actual {
  stroke-dashoffset: 0;
}
.ac-traj-dot {
  fill: var(--cu);
  opacity: 0;
  transition: opacity 0.3s ease var(--delay, 800ms);
}
#actab-forecast.active .ac-traj-dot { opacity: 1; }
.ac-traj-dot-proj {
  fill: none;
  stroke: var(--cu);
  stroke-width: 1.5;
  opacity: 0;
  transition: opacity 0.3s ease var(--delay, 1000ms);
}
#actab-forecast.active .ac-traj-dot-proj { opacity: 0.6; }
.ac-traj-x-labels {
  display: flex;
  justify-content: space-between;
  padding: 2px 10px 10px;
  font-family: var(--f);
  font-size: 9px;
  color: var(--t3);
  letter-spacing: 0.06em;
}
.ac-forecast-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 10px;
}
.ac-forecast-card {
  border: 1px solid rgba(0,0,0,0.07);
  border-radius: 10px;
  padding: 10px 12px;
  background: rgba(0,0,0,0.015);
}
.ac-fc-label {
  font-family: var(--f);
  font-size: 8px;
  letter-spacing: 0.1em;
  color: var(--t3);
  text-transform: uppercase;
  margin-bottom: 4px;
  font-weight: 600;
}
.ac-fc-val {
  font-family: var(--f);
  font-size: 15px;
  font-weight: 700;
  color: var(--t1);
  margin-bottom: 3px;
  line-height: 1.1;
}
.ac-fc-green { color: #22c55e; }
.ac-fc-sub {
  font-family: var(--f);
  font-size: 9px;
  color: var(--t3);
  line-height: 1.3;
}
.ac-credits-path {
  border: 1px solid rgba(0,0,0,0.07);
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.ac-cp-label {
  font-family: var(--f);
  font-size: 8.5px;
  letter-spacing: 0.1em;
  color: var(--t3);
  text-transform: uppercase;
  font-weight: 600;
}
.ac-cp-val {
  font-family: var(--f);
  font-size: 12px;
  color: var(--t1);
  font-weight: 500;
}

/* upcoming courses list */
.ac-upcoming-list {
  border: 1px solid rgba(0,0,0,0.07);
  border-radius: 10px;
  overflow: hidden;
}
.ac-upcoming-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}
.ac-upcoming-row:last-child { border-bottom: none; }
.ac-upcoming-code {
  font-family: var(--f);
  font-size: 9.5px;
  color: var(--t3);
  font-weight: 600;
  letter-spacing: 0.04em;
  min-width: 64px;
}
.ac-upcoming-name {
  font-family: var(--f);
  font-size: 12px;
  color: var(--t1);
  font-weight: 500;
  flex: 1;
}
.ac-upcoming-cr {
  font-family: var(--f);
  font-size: 10px;
  color: var(--t3);
  background: rgba(0,0,0,0.05);
  padding: 2px 6px;
  border-radius: 4px;
}
```

**Verify:** FORECAST tab shows chart, status cards, upcoming courses.

**Commit:**
```bash
git add style.css
git commit -m "feat: academic sheet CSS — FORECAST tab styles"
```

---

## Task 10: JS — Tab Switching + GPA Ring Animation

**Files:** Append to end of `main.js`

```js
/* ── ACADEMIC SHEET (ac-* system) ────────────────────── */
(function () {
  'use strict';

  /* --- tab switching --- */
  var acTabBtns   = document.querySelectorAll('.ac-tab');
  var acTabPanels = document.querySelectorAll('.ac-tab-panel');

  function switchAcTab(tabId) {
    acTabBtns.forEach(function (b) { b.classList.remove('active'); });
    acTabPanels.forEach(function (p) { p.classList.remove('active'); });

    var btn   = document.querySelector('.ac-tab[data-actab="' + tabId + '"]');
    var panel = document.getElementById(tabId);
    if (btn)   btn.classList.add('active');
    if (panel) panel.classList.add('active');
  }

  acTabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      switchAcTab(this.dataset.actab);
    });
  });

  /* --- GPA ring animation on sheet open/close --- */
  var acSheet = document.getElementById('sheet-academic');
  if (acSheet) {
    var acRingAnimated = false;

    function animateAcRing() {
      var ring = acSheet.querySelector('.ac-ring-fill');
      if (ring && !acRingAnimated) {
        acRingAnimated = true;
        setTimeout(function () {
          ring.style.strokeDashoffset = '11.06'; /* 3.78/4.00 = 94.5% filled */
        }, 120);
      }
    }

    function resetAcRing() {
      var ring = acSheet.querySelector('.ac-ring-fill');
      if (ring) {
        ring.style.strokeDashoffset = '201.06';
        acRingAnimated = false;
      }
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
            switchAcTab('actab-record');
          }
        }
      });
    });
    acObs.observe(acSheet, { attributes: true });
  }

  /* --- build rank strip (42 dots, dot #5 highlighted) --- */
  var rankStrip = document.getElementById('acRankStrip');
  if (rankStrip) {
    for (var i = 1; i <= 42; i++) {
      var dot = document.createElement('div');
      dot.className = 'ac-rank-dot' + (i === 5 ? ' me' : '');
      rankStrip.appendChild(dot);
    }
  }
}());
```

**Verify:** Open academic sheet. GPA ring should animate in. Click each tab — content switches. Close and reopen — ring resets and re-animates.

**Commit:**
```bash
git add main.js
git commit -m "feat: academic sheet JS — tab switching + GPA ring animation"
```

---

## Task 11: Remove Old ag-* JS Code

**Files:** Modify `main.js`

The old academic collapsible JS is no longer needed (the new design has no collapsibles). Remove it.

**Step 1:** Find the old code. Grep: `grep -n "ACADEMIC COLLAPSIBLE\|ag-collapse\|ag-future" main.js`

**Step 2:** The block starts at `/* ── ACADEMIC COLLAPSIBLE SECTIONS` (around line 423) and runs through the `ag-future-course` forEach block (around line ~480). Delete that entire block.

**Step 3:** Verify `main.js` has no remaining `ag-collapse` or `ag-future` references:
```bash
grep "ag-collapse\|ag-future" main.js
# Expected: no output
```

**Commit:**
```bash
git add main.js
git commit -m "chore: remove old ag-collapse JS (replaced by ac-tabs system)"
```

---

## Task 12: Remove Old ag-* CSS

**Files:** Modify `style.css`

The old academic CSS from `.sheet-panel-academic` (line 2324) through `.ag-future-desc` (line ~4502) can be deleted. The new styles have already been appended at the end of the file.

**Step 1:** Find exact line range:
```bash
grep -n "sheet-panel-academic\|ag-future-desc \}" style.css
```

**Step 2:** Delete from `.sheet-panel-academic {` (the old one, around line 2324) through the closing `}` of `.ag-future-desc` (around line 4502). Make sure NOT to delete the `.cheat-panel` comment that comes immediately after (verify it's preserved).

**Step 3:** Verify no stray `ag-` references remain:
```bash
grep -n "^\.ag-" style.css
# Expected: no output (new styles use ac- prefix)
```

**Step 4:** Open browser, check academic sheet still looks correct after CSS removal.

**Commit:**
```bash
git add style.css
git commit -m "chore: remove old ag-* CSS (replaced by ac-* system)"
```

---

## Task 13: Final Verification

**Step 1:** Open the app in browser. Verify:
- [ ] Academic sheet header: red ACADEMIC badge, title, close button
- [ ] Sysbar scrolls horizontally with correct data
- [ ] Student banner: GPA ring animates on sheet open (3.78/4.00)
- [ ] Honours candidate label with pulsing green dot
- [ ] 6 metadata rows on right side
- [ ] 4 tabs: RECORD / METRICS / ANALYSIS / FORECAST
- [ ] RECORD: GPA bars animate, course cards show grade badges + dual bars
- [ ] METRICS: Credits ring fills to 60%, rank dots build, grade dist bars animate
- [ ] ANALYSIS: Hex grid appears with staggered pop-in, delta bars animate
- [ ] FORECAST: Trajectory SVG line draws in, dots appear, status grid, upcoming courses

**Step 2:** Final commit with all verified.
```bash
git add -A
git status  # make sure nothing unexpected
git commit -m "feat: academic performance sheet — full intelligence system redesign"
```

---

## Summary

| Task | Files | What |
|------|-------|------|
| 1 | index.html | Replace shell HTML (header/sysbar/banner/tabs) |
| 2 | index.html | RECORD tab content |
| 3 | index.html | METRICS tab content |
| 4 | index.html | ANALYSIS tab content |
| 5 | index.html | FORECAST tab content |
| 6 | style.css  | Shell component CSS |
| 7 | style.css  | RECORD tab CSS |
| 8 | style.css  | METRICS + ANALYSIS CSS |
| 9 | style.css  | FORECAST CSS |
| 10 | main.js   | Tab switching + GPA ring JS |
| 11 | main.js   | Remove old ag-* JS |
| 12 | style.css | Remove old ag-* CSS |
| 13 | —         | Final verification |
