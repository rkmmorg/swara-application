# Product Docs and Updates

Append-only log of every change made to a file in this project, newest last.

Format — one entry per change set:

```
## YYYY-MM-DD — <short title>

**Files:** `path/one`, `path/two`
**Change:** What changed, in one or two sentences.
**Why:** The request or reason behind it.
**Verified:** The command(s) run and their result.
```

---

## 2026-09-22 — Create CLAUDE.md

**Files:** `CLAUDE.md`
**Change:** Added the initial CLAUDE.md describing the commands, load-order coupling, the JS-computed notation layout, `prefs` vs `state`, delegated events, manual escaping, and the gap between what `core.validate()` checks and what it does not.
**Why:** `/init` — give future Claude Code sessions the architecture that requires reading several files to discover.
**Verified:** `node --check` on all three scripts passed; the data validator printed `true`; `python3` present (3.14.3).

## 2026-09-22 — Add project rules and this change log

**Files:** `CLAUDE.md`, `product-docs-and-updates.md`
**Change:** Added a Project rules section to CLAUDE.md requiring simple modular code, regression tests for every behaviour change, and a log entry here for every file change. Created this log.
**Why:** User request: keep the code simple and modular; add regression tests; document every change to a file in `product-docs-and-updates.md`.
**Verified:** `grep -c 'product-docs-and-updates.md' CLAUDE.md` → 1; `node --check` on all three scripts passed.

## 2026-09-22 — Write the implementation plan

**Files:** `docs/superpowers/plans/2026-09-22-swara-updates.md`
**Change:** Wrote the eight-task implementation plan covering the Download-source and Singer-filter removals, the landscape pace controls, Play-screen swara/lyric highlighting, and a `node:test` regression suite for `core.js`. Recorded the user's decision to decline a React setup and stay dependency-free.
**Why:** User request via `/superpowers:writing-plans`, plus the follow-up asks for regression tests and a React decision.
**Verified:** Diagnosed the landscape bug against the real CSS (no `display:none` exists in either the mobile or landscape query — the panel is below the fold); confirmed `.player-stage td.current-cell` is styled but never applied and that `blockHTML` already emits `data-column`; probed the `node:test` runner with the `window` shim, `structuredClone` fixtures and `core.matches` — 4/4 assertions passed on Node v24.11.1.

## 2026-09-22 — Revise the plan after review

**Files:** `docs/superpowers/plans/2026-09-22-swara-updates.md`
**Change:** Folded in the regression-suite task (Task 7) on the `node:test` runner and renumbered the sweep to Task 8; recorded the React decision; marked Task 1 already done with an explicit warning not to re-run its overwriting heredoc; tightened Task 3's singer check to two exact code literals so documentation prose cannot trip it; and corrected the `packGroups` test, which passed vacuously.
**Why:** Follow-up requests plus a review pass that found a test-suite defect.
**Verified:** Ran every expected value against the real `core.js` on Node v24.11.1 rather than inferring it. Measured the sabotage case: breaking the width check yields 6 chunks at 1920px while the group-integrity assertions still pass — so chunk-count assertions were added, which do fail. `core.js` restored afterwards; validator prints `true`; no `core.js.bak` left behind.

## 2026-09-23 — Point the original source at the published collection

**Files:** `songs.js`, `app.js`, `index.html`, `README.md`, `CLAUDE.md`, `test-core.js`, `docs/superpowers/plans/2026-09-22-swara-updates.md`
**Change:** Replaced the three per-song `scores/*.png` sources with the common published link `https://publications.rkmm.org/svarakusumanjali`. Read's link label became "Published source ↗" and its href is now escaped; the transcription note names Svarakusumanjali while keeping the screenshot disclosure. The header's "Download source" anchor was **repointed** to the same URL rather than removed (per the user's follow-up), dropping `download` and gaining `target="_blank" rel="noopener"` and an aria-label. `.source-link` CSS kept. Created `test-core.js` with source regression tests. CLAUDE.md's "Known quirk" section became "External links", and the Commands block gained `node --test test-core.js`.
**Why:** User request: change the original source from the screenshots to this common link; then: "Place this instead of removing the download source feature".
**Verified:** `node --test test-core.js` → `pass 4, fail 0`; proved the tests are not vacuous by reverting one song's source to `scores/adya-shakti.png`, which produced `fail 3`, then restored. Validator prints `true`. In Chrome against `python3 -m http.server`: header and Read both resolve to the published URL, header `target=_blank` with no `download` attribute, Read label "Published source ↗" with `rel=noopener`, the note retains the screenshot disclosure, the score renders, and no console errors. `scores/*.png` deliberately retained on disk. Link fetched and confirmed live: "Svarakusumanjali", Ramakrishna Math & Ramakrishna Mission.

## 2026-09-23 — Remove Singer filter

**Files:** `app.js`, `README.md`
**Change:** Dropped `singer` from `emptyFilters()` and from the `fields` facet array, so the Singer filter control no longer renders. Song records keep `singer` and it remains part of the search index.
**Why:** User request: remove the Singer filter.
**Verified:** `grep -c "\['singer'" app.js` → 0 and `grep -c 'singer:\[\]' app.js` → 0, while `songs.js` → 3 and `core.js` → 1 stayed unchanged (data and searchability intact). Validator printed `true`. In Chrome, after a cache-bypassing reload, facets were exactly `["deities","raga","taal","language","composer","script"]` with 3 results, and a search for "premeshananda" still returned its 2 songs.

## 2026-09-23 — Add core.currentColumn

**Files:** `core.js`, `test-core.js`
**Change:** Added the pure `currentColumn(elapsed, columns)` helper, which maps a block's 0→1 progress onto a clamped 0-based column index, and exported it. Appended two tests covering midpoints, both block widths (12 and 14 columns), and clamping of overshoot, negative, zero-column and NaN input.
**Why:** Needed by the Play-screen swara highlighting; kept pure in `core.js` so it is testable outside a browser.
**Verified:** Genuine red→green — before the implementation `node --test test-core.js` reported `fail 2` with the 4 pre-existing tests still passing; after, `pass 6, fail 0`. Validator printed `true`. CLAUDE.md already documented the test command.

## 2026-09-23 — Highlight the played swara and lyric

**Files:** `app.js`, `README.md`, `CLAUDE.md`
**Change:** Added `highlight()` and `state.column` to `app.js`, driven by the existing 30ms pace interval and by `renderPassage`. It toggles the already-styled `current-cell` class on every `#player-stage` cell sharing the current `data-column`, so the swara and its lyric light up together. Manual mode shows no highlight. No new timer, no new markup, no re-render.
**Why:** User request: add highlighting of the played swara and literal in the Play screen.
**Verified:** `node --check app.js` clean; `node --test test-core.js` → `pass 6, fail 0`. In Chrome: at rest the highlight sits on column 0; after ~900ms at 3s/block it had advanced to column 3; highlighted cells covered both `swara` and `lyric` kinds; a longer run advanced 2→4→7→9→0, wrapping into the next block with the progress bar tracking. Manual mode reported 0 highlighted cells, and the `#next-score` preview reported 0 leaked highlights while the stage had 2. No console errors.
**Deviation from plan:** Task 5 Step 6 (append `highlight(true)` to the `follow-mode` branch) was **not applied** — it is redundant, because that branch already calls `renderPassage()`, which calls `highlight(true)`. Verified empirically: switching to Manual clears the highlight to 0 cells without it. Skipped under the "smallest change that fully does the job" rule.

## 2026-09-23 — Pin pace controls in landscape

**Files:** `styles.css`, `CLAUDE.md`
**Change:** In the landscape media query, pinned `.player-view .pace-panel` with `position:sticky;bottom:0` and compacted the seconds field, the 1×/2×/4× buttons, the effective-time readout, the toggles, the player title and the page-top row so the score stays readable above it. The controls were never hidden — they sat below the fold.
**Why:** User request: the pace controls and 1×/2×/4× are absent on the landscape mobile screen.
**Verified:** Reproduced first — at 844×390 the panel computed `display:flex` with `panelTop:635` against a 390px viewport, so `visible:false`. After the fix, at 844×390 the panel is 62px (16% of the viewport), fully visible, with all three rate buttons and the slider on screen and **12/12** swara and lyric cells clear of it; at 667×375 the panel is 94px with 9/12 cells clear and the rest reachable by scrolling. Portrait (844 tall) and desktop (1280×800) keep `position:static` and the base 180px `pace-field`, confirming the rules stay confined to landscape. No horizontal overflow at any size.
**Deviations from plan:** (1) The plan's `flex-wrap:nowrap` caused 37px of horizontal overflow at 667×375 by pushing `.toggles` off-screen; changed to `flex-wrap:wrap`. (2) The plan's numeric checks passed while a screenshot showed the panel covering the entire notation, so extra compaction of the title, page-top and panel was added and the verification changed to assert on notation cells clear of the panel rather than on panel visibility alone.

## 2026-09-23 — Add the core.js regression suite

**Files:** `test-core.js`, `CLAUDE.md`
**Change:** Extended `test-core.js` into a 15-test regression suite on the built-in `node:test` runner, covering `normalize`, `phonetic`, `romanizeDevanagari`, `lyrics`, `values`, `matches` (text, aliases, lyrics, OR-within/AND-across filters), `packGroups` at six widths, and every `validate` throw case. Added regression tests pinning that singer data stays searchable after the facet removal.
**Why:** User request: add regression tests. The repo previously had only the data validator.
**Verified:** `node --test test-core.js` → `pass 15, fail 0`. Proved the suite is not vacuous: breaking the `packGroups` width check made the run exit 1 with that test failing, and restoring `core.js` returned exit 0 and `pass 15`. Notably the group-integrity assertions alone still passed under that sabotage — only the chunk-count assertions caught it, which is why they are in the test. Validator prints `true`; no `core.js.bak` left behind.

## 2026-09-23 — Regression sweep

**Files:** `CLAUDE.md` (stale figures corrected); verification only otherwise
**Change:** Verified all requested changes together against a running server. Corrected CLAUDE.md's Code style line, which still claimed `app.js` was 84 lines (now 85, after `highlight()`) and `styles.css` 15KB (now 16KB, after the landscape rules), and noted `test-core.js` as a second conventionally-formatted exception.
**Why:** No test suite covers the DOM, and seven tasks edited the same documentation files, so cross-task drift needed a gate.
**Verified:** Syntax clean on all three scripts; `node --test test-core.js` → `pass 15, fail 0`; validator `true`. No `swara-source.zip` references remain; the header anchor and all 6 `.source-link` CSS rules are retained and repointed; no `['singer'` facet literal in `app.js` while `singer:null` ×3 and `song.singer` ×1 stayed intact. 10 change-log entries present. At 1280×800 all three screens rendered (3 songs, 6 facets, 48 Read tables, 4 Play tables, 3 rate buttons), search returned 2 hits for "puja" and restored to 3, both source links resolve to the published URL, and no console errors appeared across navigations. At 844×390 the highlight advanced to column 4 covering both swara and lyric, sat clear of the pinned pace panel, and all three rate buttons stayed on screen.

## 2026-09-23 — Close three post-sweep verification gaps

**Files:** `docs/superpowers/plans/2026-09-22-swara-updates.md` (accuracy fix); verification only otherwise
**Change:** No code change. Ran three checks the sweep had not covered, and corrected the plan's completion banner, which claimed a portrait verification at a size never actually measured.
**Why:** The sweep tested manual-mode clearing only from a stopped state, never asserted the Read screen stays free of highlights after a resize re-render, and counted song rows without reading them for `undefined`.
**Verified:** (1) Switching to Manual *while the pace was running* — highlight lit at column 8 — cleared to 0 cells immediately and stayed 0, so no frozen highlight. (2) Read holds 288 `data-column` cells and reported 0 highlighted cells both before and after a resize-triggered re-render, with 48 tables intact. (3) All 3 song rows rendered with no `undefined`, `null` or `NaN` anywhere in `main`; `beatsPerCycle` renders as "Tevra 7 beats" and a missing composer as "Not specified". Outstanding: a true 390px-wide portrait viewport was never measured — the browser window floor was ~500px — and this is now recorded in the plan.
