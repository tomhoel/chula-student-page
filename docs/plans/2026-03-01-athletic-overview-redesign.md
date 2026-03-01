# Athletic Profile — Overview Tab Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the plain radar-only overview tab with a rich animated overview: sport snapshot cards (football + swimming), a monthly activity bar chart, the existing radar/attr section, an achievements strip, and a redesigned profile summary.

**Architecture:** Vanilla HTML/CSS/JS. All animation via CSS `@keyframes` + `transition` triggered by `.active` class on the tab panel. JS counter animations (count-up) added to the existing SP tab-switching IIFE in `main.js`. No new external dependencies.

**Tech Stack:** HTML5 · CSS3 (custom properties, keyframe animations) · Vanilla JS (requestAnimationFrame counters)

**Working directory:** `.worktrees/athletic-profile-redesign/`

---

### Task 1: Rewrite Overview Tab HTML

**Files:**
- Modify: `index.html` — replace `#sptab-overview` inner content (currently lines ~1234–1415)

**Step 1: Replace overview tab inner content**

Replace everything between `<div class="sp-tab-content active" id="sptab-overview" role="tabpanel">` and its closing `</div><!-- /#sptab-overview -->` with:

```html
      <div class="sp-tab-content active" id="sptab-overview" role="tabpanel">

        <!-- ── Sport Snapshot Cards ── -->
        <div class="sp-sport-cards">

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

        </div><!-- /.sp-sport-cards -->

        <!-- ── Season Activity Chart ── -->
        <p class="sp-section-title">SEASON ACTIVITY 2025</p>
        <div class="sp-activity-chart">
          <div class="sp-activity-legend">
            <span class="sp-acl-dot sp-acl-dot--fb"></span><span class="sp-acl-lbl"><span class="l-th">ฟุตบอล</span><span class="l-en">Football</span></span>
            <span class="sp-acl-dot sp-acl-dot--sw"></span><span class="sp-acl-lbl"><span class="l-th">ว่ายน้ำ</span><span class="l-en">Swimming</span></span>
          </div>
          <div class="sp-activity-grid">
            <!-- --col-delay staggers bar animations; --bh-fb = football height, --bh-sw = swim height -->
            <div class="sp-ac-col" style="--col-delay:0ms">
              <div class="sp-ac-bars"><div class="sp-ac-bar sp-ac-bar--sw" style="--bh:42px"></div><div class="sp-ac-bar sp-ac-bar--fb" style="--bh:0px"></div></div>
              <span class="sp-ac-lbl">J</span>
            </div>
            <div class="sp-ac-col" style="--col-delay:40ms">
              <div class="sp-ac-bars"><div class="sp-ac-bar sp-ac-bar--sw" style="--bh:49px"></div><div class="sp-ac-bar sp-ac-bar--fb" style="--bh:12px"></div></div>
              <span class="sp-ac-lbl">F</span>
            </div>
            <div class="sp-ac-col" style="--col-delay:80ms">
              <div class="sp-ac-bars"><div class="sp-ac-bar sp-ac-bar--sw" style="--bh:56px"></div><div class="sp-ac-bar sp-ac-bar--fb" style="--bh:24px"></div></div>
              <span class="sp-ac-lbl">M</span>
            </div>
            <div class="sp-ac-col" style="--col-delay:120ms">
              <div class="sp-ac-bars"><div class="sp-ac-bar sp-ac-bar--sw" style="--bh:49px"></div><div class="sp-ac-bar sp-ac-bar--fb" style="--bh:36px"></div></div>
              <span class="sp-ac-lbl">A</span>
            </div>
            <div class="sp-ac-col" style="--col-delay:160ms">
              <div class="sp-ac-bars"><div class="sp-ac-bar sp-ac-bar--sw" style="--bh:42px"></div><div class="sp-ac-bar sp-ac-bar--fb" style="--bh:12px"></div></div>
              <span class="sp-ac-lbl">M</span>
            </div>
            <div class="sp-ac-col" style="--col-delay:200ms">
              <div class="sp-ac-bars"><div class="sp-ac-bar sp-ac-bar--sw" style="--bh:28px"></div><div class="sp-ac-bar sp-ac-bar--fb" style="--bh:0px"></div></div>
              <span class="sp-ac-lbl">J</span>
            </div>
            <div class="sp-ac-col" style="--col-delay:240ms">
              <div class="sp-ac-bars"><div class="sp-ac-bar sp-ac-bar--sw" style="--bh:21px"></div><div class="sp-ac-bar sp-ac-bar--fb" style="--bh:0px"></div></div>
              <span class="sp-ac-lbl">J</span>
            </div>
            <div class="sp-ac-col" style="--col-delay:280ms">
              <div class="sp-ac-bars"><div class="sp-ac-bar sp-ac-bar--sw" style="--bh:28px"></div><div class="sp-ac-bar sp-ac-bar--fb" style="--bh:0px"></div></div>
              <span class="sp-ac-lbl">A</span>
            </div>
            <div class="sp-ac-col" style="--col-delay:320ms">
              <div class="sp-ac-bars"><div class="sp-ac-bar sp-ac-bar--sw" style="--bh:49px"></div><div class="sp-ac-bar sp-ac-bar--fb" style="--bh:12px"></div></div>
              <span class="sp-ac-lbl">S</span>
            </div>
            <div class="sp-ac-col" style="--col-delay:360ms">
              <div class="sp-ac-bars"><div class="sp-ac-bar sp-ac-bar--sw" style="--bh:56px"></div><div class="sp-ac-bar sp-ac-bar--fb" style="--bh:24px"></div></div>
              <span class="sp-ac-lbl">O</span>
            </div>
            <div class="sp-ac-col" style="--col-delay:400ms">
              <div class="sp-ac-bars"><div class="sp-ac-bar sp-ac-bar--sw" style="--bh:49px"></div><div class="sp-ac-bar sp-ac-bar--fb" style="--bh:12px"></div></div>
              <span class="sp-ac-lbl">N</span>
            </div>
            <div class="sp-ac-col" style="--col-delay:440ms">
              <div class="sp-ac-bars"><div class="sp-ac-bar sp-ac-bar--sw" style="--bh:42px"></div><div class="sp-ac-bar sp-ac-bar--fb" style="--bh:12px"></div></div>
              <span class="sp-ac-lbl">D</span>
            </div>
          </div>
        </div><!-- /.sp-activity-chart -->

        <!-- ── Athletic Attributes (kept) ── -->
        <p class="sp-section-title">ATHLETIC ATTRIBUTES</p>
        <div class="sp-radar-wrap">
          <svg class="sp-radar" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <!-- 50% ring -->
            <polygon points="100,67.5 128.1,83.75 128.1,116.25 100,132.5 71.9,116.25 71.9,83.75" fill="none"
              stroke="rgba(0,0,0,0.06)" stroke-width="1" />
            <!-- 75% ring -->
            <polygon points="100,51.25 142.2,75.6 142.2,124.4 100,148.75 57.8,124.4 57.8,75.6" fill="none"
              stroke="rgba(0,0,0,0.06)" stroke-width="1" />
            <!-- 100% ring -->
            <polygon points="100,35 156.3,67.5 156.3,132.5 100,165 43.7,132.5 43.7,67.5" fill="none"
              stroke="rgba(0,0,0,0.09)" stroke-width="1" />
            <!-- Axis spokes -->
            <line x1="100" y1="100" x2="100" y2="35" stroke="rgba(0,0,0,0.07)" stroke-width="1" />
            <line x1="100" y1="100" x2="156.3" y2="67.5" stroke="rgba(0,0,0,0.07)" stroke-width="1" />
            <line x1="100" y1="100" x2="156.3" y2="132.5" stroke="rgba(0,0,0,0.07)" stroke-width="1" />
            <line x1="100" y1="100" x2="100" y2="165" stroke="rgba(0,0,0,0.07)" stroke-width="1" />
            <line x1="100" y1="100" x2="43.7" y2="132.5" stroke="rgba(0,0,0,0.07)" stroke-width="1" />
            <line x1="100" y1="100" x2="43.7" y2="67.5" stroke="rgba(0,0,0,0.07)" stroke-width="1" />
            <!-- Data: Speed 88, Endurance 82, Strength 76, Agility 87, Technique 91, Teamwork 95 -->
            <polygon id="sp-radar-poly" points="100,100 100,100 100,100 100,100 100,100 100,100"
              fill="rgba(222,93,142,0.14)" stroke="#de5d8e" stroke-width="1.8" stroke-linejoin="round"
              data-pts="100,42.8 146.2,73.35 142.8,124.7 100,156.55 48.8,129.6 46.5,69.1" />
            <!-- Vertex dots (animated from center) -->
            <circle class="sp-radar-dot" cx="100" cy="100" r="0" fill="#de5d8e" />
            <circle class="sp-radar-dot" cx="100" cy="100" r="0" fill="#de5d8e" />
            <circle class="sp-radar-dot" cx="100" cy="100" r="0" fill="#de5d8e" />
            <circle class="sp-radar-dot" cx="100" cy="100" r="0" fill="#de5d8e" />
            <circle class="sp-radar-dot" cx="100" cy="100" r="0" fill="#de5d8e" />
            <circle class="sp-radar-dot" cx="100" cy="100" r="0" fill="#de5d8e" />
            <!-- Axis labels -->
            <text x="100" y="27" text-anchor="middle" font-size="8.5" font-weight="600" fill="#6B6B6B">Speed</text>
            <text x="100" y="18" text-anchor="middle" font-size="8" font-weight="700" fill="#de5d8e">88</text>
            <text x="163" y="67" text-anchor="start" font-size="8.5" font-weight="600" fill="#6B6B6B">Endurance</text>
            <text x="163" y="77" text-anchor="start" font-size="8" font-weight="700" fill="#de5d8e">82</text>
            <text x="163" y="133" text-anchor="start" font-size="8.5" font-weight="600" fill="#6B6B6B">Strength</text>
            <text x="163" y="143" text-anchor="start" font-size="8" font-weight="700" fill="#de5d8e">76</text>
            <text x="100" y="178" text-anchor="middle" font-size="8.5" font-weight="600" fill="#6B6B6B">Agility</text>
            <text x="100" y="188" text-anchor="middle" font-size="8" font-weight="700" fill="#de5d8e">87</text>
            <text x="37" y="133" text-anchor="end" font-size="8.5" font-weight="600" fill="#6B6B6B">Technique</text>
            <text x="37" y="143" text-anchor="end" font-size="8" font-weight="700" fill="#de5d8e">91</text>
            <text x="37" y="67" text-anchor="end" font-size="8.5" font-weight="600" fill="#6B6B6B">Teamwork</text>
            <text x="37" y="77" text-anchor="end" font-size="8" font-weight="700" fill="#de5d8e">95</text>
          </svg>
        </div><!-- /.sp-radar-wrap -->

        <p class="sp-section-title" style="margin-top:16px">ATTRIBUTE BREAKDOWN</p>
        <div class="sp-attr-grid">

          <!-- ELITE tier -->
          <div class="sp-attr-card" data-tier="elite">
            <div class="sp-attr-card-top">
              <span class="sp-attr-dot"></span>
              <span class="sp-attr-card-name"><span class="l-th">ทีมเวิร์ค</span><span class="l-en">Teamwork</span></span>
              <span class="sp-attr-tier">ELITE</span>
            </div>
            <div class="sp-attr-score-row">
              <span class="sp-attr-card-score">95</span>
              <span class="sp-attr-score-denom">/100</span>
            </div>
            <div class="sp-attr-bar-track">
              <div class="sp-attr-bar-fill" style="--aw:95%"></div>
            </div>
            <p class="sp-attr-desc"><span class="l-th">ผู้นำทีมและการอ่านพื้นที่</span><span class="l-en">Leadership &amp; spatial reading</span></p>
          </div>

          <div class="sp-attr-card" data-tier="elite">
            <div class="sp-attr-card-top">
              <span class="sp-attr-dot"></span>
              <span class="sp-attr-card-name"><span class="l-th">เทคนิค</span><span class="l-en">Technique</span></span>
              <span class="sp-attr-tier">ELITE</span>
            </div>
            <div class="sp-attr-score-row">
              <span class="sp-attr-card-score">91</span>
              <span class="sp-attr-score-denom">/100</span>
            </div>
            <div class="sp-attr-bar-track">
              <div class="sp-attr-bar-fill" style="--aw:91%"></div>
            </div>
            <p class="sp-attr-desc"><span class="l-th">ควบคุมบอลและแตะบอลชั้นเยี่ยม</span><span class="l-en">Superior ball control &amp; first touch</span></p>
          </div>

          <!-- HIGH tier -->
          <div class="sp-attr-card" data-tier="high">
            <div class="sp-attr-card-top">
              <span class="sp-attr-dot"></span>
              <span class="sp-attr-card-name"><span class="l-th">ความเร็ว</span><span class="l-en">Speed</span></span>
              <span class="sp-attr-tier">HIGH</span>
            </div>
            <div class="sp-attr-score-row">
              <span class="sp-attr-card-score">88</span>
              <span class="sp-attr-score-denom">/100</span>
            </div>
            <div class="sp-attr-bar-track">
              <div class="sp-attr-bar-fill" style="--aw:88%"></div>
            </div>
            <p class="sp-attr-desc"><span class="l-th">ความเร็วระเบิดและการเคลื่อนที่นอกบอล</span><span class="l-en">Elite burst pace &amp; off-ball movement</span></p>
          </div>

          <div class="sp-attr-card" data-tier="high">
            <div class="sp-attr-card-top">
              <span class="sp-attr-dot"></span>
              <span class="sp-attr-card-name"><span class="l-th">ความคล่องตัว</span><span class="l-en">Agility</span></span>
              <span class="sp-attr-tier">HIGH</span>
            </div>
            <div class="sp-attr-score-row">
              <span class="sp-attr-card-score">87</span>
              <span class="sp-attr-score-denom">/100</span>
            </div>
            <div class="sp-attr-bar-track">
              <div class="sp-attr-bar-fill" style="--aw:87%"></div>
            </div>
            <p class="sp-attr-desc"><span class="l-th">เปลี่ยนทิศทางรวดเร็วและระเบิดพลัง</span><span class="l-en">Quick direction changes &amp; explosive turns</span></p>
          </div>

          <div class="sp-attr-card" data-tier="high">
            <div class="sp-attr-card-top">
              <span class="sp-attr-dot"></span>
              <span class="sp-attr-card-name"><span class="l-th">ความอึด</span><span class="l-en">Endurance</span></span>
              <span class="sp-attr-tier">HIGH</span>
            </div>
            <div class="sp-attr-score-row">
              <span class="sp-attr-card-score">82</span>
              <span class="sp-attr-score-denom">/100</span>
            </div>
            <div class="sp-attr-bar-track">
              <div class="sp-attr-bar-fill" style="--aw:82%"></div>
            </div>
            <p class="sp-attr-desc"><span class="l-th">สมรรถภาพสูงตลอด 90 นาที</span><span class="l-en">High match fitness over 90 minutes</span></p>
          </div>

          <!-- GOOD tier -->
          <div class="sp-attr-card" data-tier="good">
            <div class="sp-attr-card-top">
              <span class="sp-attr-dot"></span>
              <span class="sp-attr-card-name"><span class="l-th">ความแข็งแกร่ง</span><span class="l-en">Strength</span></span>
              <span class="sp-attr-tier">GOOD</span>
            </div>
            <div class="sp-attr-score-row">
              <span class="sp-attr-card-score">76</span>
              <span class="sp-attr-score-denom">/100</span>
            </div>
            <div class="sp-attr-bar-track">
              <div class="sp-attr-bar-fill" style="--aw:76%"></div>
            </div>
            <p class="sp-attr-desc"><span class="l-th">ต่อสู้ทางกายภาพได้มั่นคง</span><span class="l-en">Solid physical contest ability</span></p>
          </div>

        </div><!-- /.sp-attr-grid -->

        <!-- ── Achievements Strip ── -->
        <p class="sp-section-title" style="margin-top:16px">ACHIEVEMENTS</p>
        <div class="sp-achievements">
          <div class="sp-ach-chip sp-ach-chip--gold">🥇 CU Games 100m Free · 2025</div>
          <div class="sp-ach-chip sp-ach-chip--gold">🥇 Faculty Butterfly Record</div>
          <div class="sp-ach-chip sp-ach-chip--silver">🥈 CU Games 200m IM · 2025</div>
          <div class="sp-ach-chip sp-ach-chip--pink">🏆 3× Man of the Match</div>
          <div class="sp-ach-chip sp-ach-chip--silver">🥈 Economics Cup Final · 2025</div>
        </div>

        <!-- ── Profile Summary (redesigned) ── -->
        <div class="sp-profile-summary">
          <div class="sp-profile-header">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span class="sp-profile-label"><span class="l-th">โปรไฟล์นักกีฬา</span><span class="l-en">Athlete Profile</span></span>
            <span class="sp-profile-score-badge">86.5 avg</span>
          </div>
          <p class="sp-profile-archetype">Technical Playmaker</p>
          <p class="sp-profile-text">
            <span class="l-th">เทคนิค (91) และทีมเวิร์ค (95) ระดับ Elite รองรับสไตล์การเล่นเชิงรุกที่มีความเข้มข้นสูง
              ความเร็ว (88) และความคล่องตัว (87) เพิ่มอันตรายตลอดเวลาในสนาม</span>
            <span class="l-en">Elite technique (91) and teamwork (95) anchor a high-tempo attacking style. Speed (88)
              and agility (87) deliver constant off-ball threat throughout the match.</span>
          </p>
        </div><!-- /.sp-profile-summary -->

      </div><!-- /#sptab-overview -->
```

**Step 2: Verify HTML structure**
Open `index.html` in a browser and click the OVERVIEW tab. You should see:
- Two sport cards stacked (football, swimming)
- An activity chart section title
- The existing radar + attr cards
- An achievements strip title
- The profile summary

**Step 3: Commit**
```bash
git add index.html
git commit -m "feat: add sport cards, activity chart, achievements HTML to overview tab"
```

---

### Task 2: Add Sport Card CSS

**Files:**
- Modify: `style.css` — add after the `.sp-profile-text` block (end of existing overview CSS, around line 3640)

**Step 1: Add CSS after `.sp-profile-text` block**

Add the following block immediately after the closing `}` of `.sp-profile-text`:

```css
/* ── Overview: Sport Snapshot Cards ── */
.sp-sport-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
}

.sp-sport-card {
  display: flex;
  align-items: stretch;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  overflow: hidden;
  min-height: 136px;
  opacity: 0;
  transform: translateY(10px);
  animation: spCardIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-play-state: paused;
}

#sptab-overview.active .sp-sport-card {
  animation-play-state: running;
}

.sp-sport-card:nth-child(2) {
  animation-delay: 90ms;
}

@keyframes spCardIn {
  to { opacity: 1; transform: translateY(0); }
}

.sp-sport-card--football { border-left: 3px solid var(--cu); }
.sp-sport-card--swim { border-left: 3px solid #0ea5e9; }

.sp-sport-card-photo {
  width: 34%;
  flex-shrink: 0;
  overflow: hidden;
  background: #111;
}

.sp-sport-card-photo picture,
.sp-sport-card-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 8%;
  display: block;
}

.sp-sport-card-body {
  flex: 1;
  min-width: 0;
  padding: 11px 13px 10px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  border-left: 1px solid rgba(0, 0, 0, 0.06);
}

.sp-sport-card-tag-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.sp-sport-card-tag {
  display: inline-flex;
  padding: 2px 7px;
  border-radius: 4px;
  background: var(--cu);
  color: #fff;
  font: 800 7px / 1 var(--f);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  align-self: flex-start;
}

.sp-sport-card-tag--swim { background: #0ea5e9; }

.sp-sport-card-elite {
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(184, 133, 42, 0.10);
  border: 1px solid rgba(184, 133, 42, 0.22);
  font: 700 7px / 1 var(--f);
  color: var(--gold);
  letter-spacing: 0.08em;
}

.sp-sport-card-club {
  font: 600 11px / 1 var(--f);
  color: var(--t1);
}

.sp-sport-card-role {
  font: 400 10px / 1 var(--f-th);
  color: var(--t3);
}

html[lang="en"] .sp-sport-card-role { font-family: var(--f); }

.sp-sport-card-rating {
  display: flex;
  align-items: baseline;
  gap: 3px;
  margin-top: 2px;
}

.sp-sport-card-num {
  font: 800 24px / 1 var(--f);
  color: var(--cu);
  letter-spacing: -0.03em;
}

.sp-sport-card-num--blue { color: #0ea5e9; }

.sp-sport-card-denom {
  font: 500 11px / 1 var(--f);
  color: var(--t3);
}

.sp-sport-card-rlbl {
  font: 500 9px / 1 var(--f);
  color: var(--t3);
  margin-left: 2px;
}

.sp-sport-card-stats {
  display: flex;
  gap: 0;
  margin-top: auto;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.sp-sport-card-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex: 1;
}

.sp-sport-card-stat:not(:last-child) {
  border-right: 1px solid rgba(0, 0, 0, 0.06);
}

.sp-sport-card-stat b {
  font: 700 13px / 1 var(--f);
  color: var(--t1);
  letter-spacing: -0.01em;
}

.sp-sport-card-stat em {
  font: 600 7px / 1 var(--f);
  font-style: normal;
  color: var(--t3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.sp-sport-card-stat--acc b { color: var(--cu); }
.sp-sport-card-stat--blue b { color: #0ea5e9; }
.sp-sport-card-stat--gold b { color: #b8852a; }
```

**Step 2: Verify**
Reload browser — sport cards should slide in when overview tab opens.

**Step 3: Commit**
```bash
git add style.css
git commit -m "feat: add sport snapshot card CSS with slide-in animation"
```

---

### Task 3: Add Activity Chart CSS

**Files:**
- Modify: `style.css` — add immediately after sport card CSS block

**Step 1: Add CSS**

```css
/* ── Overview: Season Activity Chart ── */
.sp-activity-chart {
  margin-bottom: 18px;
}

.sp-activity-legend {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 10px;
}

.sp-acl-dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  flex-shrink: 0;
}

.sp-acl-dot--fb { background: var(--cu); }
.sp-acl-dot--sw { background: #0ea5e9; }

.sp-acl-lbl {
  font: 500 9px / 1 var(--f-th);
  color: var(--t3);
}

html[lang="en"] .sp-acl-lbl { font-family: var(--f); }

.sp-activity-grid {
  display: flex;
  gap: 3px;
  align-items: flex-end;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
}

.sp-ac-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.sp-ac-bars {
  display: flex;
  gap: 1px;
  align-items: flex-end;
  height: 60px;
}

.sp-ac-bar {
  width: 5px;
  border-radius: 2px 2px 0 0;
  transform-origin: bottom;
  transform: scaleY(0);
  height: var(--bh, 0px);
  transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1) var(--col-delay, 0ms);
}

.sp-ac-bar--fb { background: var(--cu); opacity: 0.85; }
.sp-ac-bar--sw { background: #0ea5e9; opacity: 0.75; }

/* Trigger animation when overview tab is active */
#sptab-overview.active .sp-ac-bar {
  transform: scaleY(1);
}

.sp-ac-lbl {
  font: 600 7.5px / 1 var(--f);
  color: var(--t3);
  letter-spacing: 0.02em;
}
```

**Step 2: Verify**
Switch to OVERVIEW tab — bars should grow upward in a staggered wave from left to right.

**Step 3: Commit**
```bash
git add style.css
git commit -m "feat: add season activity chart CSS with staggered bar animation"
```

---

### Task 4: Add Achievements Strip + Profile Summary CSS

**Files:**
- Modify: `style.css` — add immediately after activity chart CSS

**Step 1: Add CSS**

```css
/* ── Overview: Achievements Strip ── */
.sp-achievements {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 2px;
  margin-bottom: 18px;
  -webkit-mask-image: linear-gradient(to right, black 88%, transparent 100%);
  mask-image: linear-gradient(to right, black 88%, transparent 100%);
}

.sp-achievements::-webkit-scrollbar { display: none; }

.sp-ach-chip {
  flex-shrink: 0;
  padding: 6px 11px;
  border-radius: 999px;
  font: 600 9.5px / 1 var(--f);
  white-space: nowrap;
  border: 1px solid;
}

.sp-ach-chip--gold {
  background: rgba(184, 133, 42, 0.08);
  border-color: rgba(184, 133, 42, 0.22);
  color: #b8852a;
}

.sp-ach-chip--silver {
  background: rgba(107, 114, 128, 0.08);
  border-color: rgba(107, 114, 128, 0.20);
  color: #6b7280;
}

.sp-ach-chip--pink {
  background: rgba(222, 93, 142, 0.07);
  border-color: rgba(222, 93, 142, 0.20);
  color: var(--cu);
}
```

**Step 2: Verify**
Scroll horizontally in the achievements strip — should fade out on the right edge.

**Step 3: Commit**
```bash
git add style.css
git commit -m "feat: add achievements strip + profile summary CSS"
```

---

### Task 5: Add Counter Animation JS

**Files:**
- Modify: `main.js` — add counter function inside the SP TAB SWITCHING IIFE

**Step 1: Find the SP TAB SWITCHING IIFE**

Search `main.js` for `SP TAB SWITCHING`. The IIFE looks like:
```js
/* ── SP TAB SWITCHING ── */
(function () {
  var tabs = document.querySelectorAll('.sp-tab');
  var panels = document.querySelectorAll('.sp-tab-content');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      // deactivate all
      // activate clicked
    });
  });
})();
```

**Step 2: Add counter function and call it on overview tab activation**

Inside the IIFE, after the `tabs.forEach` block, add:

```js
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
```

Then, in the existing `tab.addEventListener('click', ...)` handler, after the panel is activated, add:

```js
      if (tab.dataset.tab === 'overview') {
        runOverviewAnimations();
      }
```

Also call `runOverviewAnimations()` once at IIFE startup since overview is the default active tab:

```js
  // Run on initial load (overview is active by default)
  runOverviewAnimations();
```

**Step 3: Verify**
Open the athletic profile sheet → the sport card numbers (8.3, 26.4) should count up from 0. Switch to another tab and back to OVERVIEW — numbers should count up again.

**Step 4: Commit**
```bash
git add main.js
git commit -m "feat: add count-up animation for overview sport card numbers"
```

---

### Task 6: Final Verification + Push

**Step 1: Visual sanity check**
Open `index.html`. Open the athletic profile sheet:
- OVERVIEW tab: sport cards animate in ✓ numbers count up ✓ activity bars grow ✓ achievements strip scrollable ✓ radar animates ✓
- FOOTBALL tab: still works ✓
- SWIMMING tab: still works ✓
- Edge-to-edge header/sysbar/banner ✓

**Step 2: Push branch**
```bash
git push
```
