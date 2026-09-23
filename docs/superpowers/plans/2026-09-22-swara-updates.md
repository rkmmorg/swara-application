# Swara Songbook — Removals, Landscape Pace Controls, and Swara Highlighting

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

> ## ✅ EXECUTED — all 8 tasks complete (2026-09-23)
>
> Verified on the final tree: `node --check` clean on all three scripts, `node --test test-core.js` → **pass 15, fail 0**, validator → `true`, and browser checks at 1280×800, 844×390, 667×375 and a 500×844 portrait viewport with no console errors. (The browser window would not resize below ~500px wide, so the narrowest portrait phone width was **not** verified — see the outstanding note below.)
>
> **Deviations, each with evidence:**
> - **Task 5 Step 6 skipped** (append `highlight(true)` to the `follow-mode` branch). Redundant — that branch already calls `renderPassage()`, which calls `highlight(true)`. Verified: switching to Manual clears the highlight to 0 cells without it.
> - **Task 6 `flex-wrap:nowrap` changed to `wrap`.** As written it pushed `.toggles` 37px past the viewport at 667×375, causing horizontal scroll.
> - **Task 6 gained extra compaction.** The plan's numeric checks all passed while a screenshot showed the pinned panel covering the entire notation. The title, page-top and panel were compacted and the verification was changed to assert notation cells are clear of the panel, not merely that the panel is visible. Result: 12/12 cells clear at 844×390, 9/12 at 667×375.
> - **Task 2 Step 2 / Task 8 Step 2 expected values corrected.** They used `grep -c` (counts *lines*) for CSS rules; `styles.css` packs 15KB into 13 lines, so the check reported 4 for 6 intact rules. Now `grep -o … | wc -l`.
> - **Task 1, 2 and part of 4 were already done** before execution began and were verified rather than redone.
>
> **Not verified:** a true 390px-wide portrait viewport. The window floor was ~500px, so 390×844 was never measured; the landscape sizes (844×390, 667×375) did report their requested dimensions. Re-check on a real phone or via device emulation before release — README already flags that rendered browser QA on the smallest supported phones is outstanding.
>
> No git repository exists here, so the plan's no-commit rule held throughout and `product-docs-and-updates.md` carries the history instead.

**Goal:** Remove the Download source link and Singer filter, make the pace controls reachable on landscape phones, and highlight the currently-played swara and lyric on the Play screen.

**Architecture:** All column math goes in `core.js` as a pure, Node-requirable function; `app.js` keeps all DOM work and toggles a `current-cell` class that `styles.css` already defines. The existing 30ms pace interval drives the highlight — no new timer, no re-render. The landscape fix is CSS-only inside the existing `@media(orientation:landscape)` block.

**Tech Stack:** Vanilla ES2020, no dependencies, no build step. Node's built-in `node:test` runner and `node:assert/strict` for unit and regression tests (verified on Node v24.11.1); `python3 -m http.server` plus the chrome-devtools MCP for browser verification.

**Decision on record (2026-09-22):** Setting the application up in React was considered and **declined** by the user. The project stays dependency-free with no build step, so `index.html` keeps working from a plain static server and no `npm install` is ever a prerequisite. Do not introduce a framework, bundler, or package manager while executing this plan.

**Spec:** The verbatim user request is reproduced in [Requirements](#requirements) below. There is no separate spec document; this plan and that section travel together.

## Requirements

Verbatim user request (2026-09-22):

1. Update `CLAUDE.md` alongside the following changes.
2. Add the following rules to `CLAUDE.md`: Document every change to a file `product-docs-and-updates.md`.
3. Remove the following features from the website: Download source; Singer filter.
   - **Superseded 2026-09-23:** "Place this instead of removing the download source feature" — the Download source link is repointed to `https://publications.rkmm.org/svarakusumanjali`, not removed. The Singer-filter removal stands.
4. Ensure that the pace controls and 1x, 2x and 4x are placed in the landscape mobile screen properly — currently they are absent there.
5. Add highlighting of the played swara and literal in the play screen.

Follow-up requests in the same session:

6. "Also add regression tests."
7. "Setup the application in React." — **declined** after the tradeoffs were put to the user; see Decision on record above.
8. "Keep the code simple and modular." — added to `CLAUDE.md` as a standing rule.

## Global Constraints

- **Keep the code simple and modular.** One responsibility per unit; pure logic in `core.js`, DOM work in `app.js`. Prefer the smallest change that fully does the job. These are standing rules now recorded in `CLAUDE.md`.
- **Add regression tests.** Every behaviour change in this plan gets a test in `test-core.js` that fails before the change and passes after, wherever the behaviour is reachable without a DOM. DOM-only behaviour is covered by the executable browser assertions in Tasks 5 and 6.
- **Change logging is mandatory.** Every task that touches any file appends an entry to `product-docs-and-updates.md` before it is considered done. This applies to every task in this plan, including Task 1, which creates the file.
- **No git.** This directory is not a git repository. Do **not** emit or run `git add` / `git commit`. Each task ends with its verification commands plus the change-log append.
- **Match the existing code density.** `app.js` is 22KB in 84 lines and `styles.css` is 15KB in 13 lines: one packed line per function, semicolon-chained statements, no added blank lines. `songs.js` and new test files stay conventionally readable.
- **Escaping.** Any new interpolation into an `innerHTML` template goes through `escape()`; swara text goes through `note()`.
- **Pace semantics (unchanged by this plan).** One notation block is one "phrase"; `prefs.seconds` covers the whole block. Highlighting therefore subdivides the block **equally** across its columns. This is a display aid, not authored beat durations — consistent with the disclaimer already in `README.md`.
- **Manual mode has no time base,** so no highlight is shown in manual mode.
- **No motion on the highlight.** It is an instant background change with no CSS transition, so it is already correct under `prefers-reduced-motion`. Do not add a transition to `td.current-cell`.
- **Do not remove song data.** Removing the Singer *facet* does not remove `singer` from `songs.js` nor from the `core.matches` search string.
- **After any edit to `songs.js` or `core.js`,** run the data validator (see Reference commands below).

## Reference commands

```sh
# Syntax check
node --check app.js && node --check core.js && node --check songs.js

# Score-data validator (prints `true`)
node -e "global.window={};require('./songs.js');const c=require('./core.js');console.log(c.validate(window.SWARA_DATA))"

# Unit and regression tests (created in Task 4, expanded in Task 7)
node --test test-core.js

# Serve for browser verification
python3 -m http.server 8080
```

---

## File Structure

| File | Responsibility | Tasks |
| --- | --- | --- |
| `product-docs-and-updates.md` | **New.** Append-only log of every file change. | 1 (create), all (append) |
| `CLAUDE.md` | Agent guidance; gains the project rules, loses the stale Known-quirk section. | 1, 2, 3, 5, 6, 7 |
| `index.html` | Header anchor repointed to the published collection (kept, not removed). | 2 |
| `styles.css` | Keeps all `.source-link` rules; gains landscape pace-panel rules. | 6 |
| `app.js` | Loses the Singer facet; gains the `highlight()` DOM toggle. | 3, 5 |
| `core.js` | Gains pure `currentColumn()`. | 4 |
| `songs.js` | All three `source` fields now hold the common published URL. | 2 |
| `test-core.js` | **New.** `node:test` unit and regression suite for `core.js` pure functions. | 4 (created), 7 (expanded) |
| `README.md` | Facet list, source-archive bullet, and pace disclaimer updated. | 2, 3, 5 |

---

### Task 1: Change-log file and the CLAUDE.md rules

> **Status: already completed on 2026-09-22.** `product-docs-and-updates.md` exists with its format block and the first two entries, and `CLAUDE.md` carries the Project-rules section with all three standing rules. **Verify rather than redo** — run Steps 2, 4 and 5 as checks; skip Steps 1 and 3. **Do not run Step 1**: its heredoc would overwrite the existing log, which already holds several entries including this plan's own. If a check in Step 4 fails, add only the missing rule by hand.

**Files:**
- Create: `product-docs-and-updates.md`
- Modify: `CLAUDE.md` (insert a new section after the `## Commands` section)

**Interfaces:**
- Consumes: nothing.
- Produces: the change-log file and its entry format. **Every later task appends one entry in exactly this format.**

- [ ] **Step 1: Create the change log with its format defined**

```sh
cat > product-docs-and-updates.md <<'EOF'
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

## 2026-09-22 — Add change log and logging rule

**Files:** `product-docs-and-updates.md`, `CLAUDE.md`
**Change:** Created this change log and added a CLAUDE.md rule requiring every file change to be recorded here.
**Why:** User request: "Document every change to a file product-docs-and-updates.md".
**Verified:** File created; CLAUDE.md rule present.
EOF
```

- [ ] **Step 2: Verify the file exists and reads correctly**

Run: `head -20 product-docs-and-updates.md`
Expected: the heading, the format block, and the first entry.

- [ ] **Step 3: Add the logging rule to CLAUDE.md**

Insert this section immediately after the line `This directory is **not a git repository**, so the usual `git diff` / commit habits do not apply.`:

```markdown
## Project rules

These are standing requirements, not suggestions. They apply to every change.

- **Keep the code simple and modular.** One responsibility per unit, small focused files, clear boundaries. Put pure logic in `core.js` where it can be tested; keep DOM work in the UI layer. Prefer the smallest change that fully does the job over a clever or general one — YAGNI.
- **Add regression tests.** Every bug fix and every behaviour change gets a test that fails before the change and passes after, so the same defect cannot return silently. Tests live in `test-core.js` and run on the built-in `node:test` runner with no dependencies.
- **Document every change in `product-docs-and-updates.md`.** Append one entry per change set, newest last, in the format documented at the top of that file: files touched, what changed, why, and the verification command with its result. This directory is not a git repository, so an unlogged change leaves no trace — the log is the project's history. Write the entry as part of the change, not afterwards.
```

- [ ] **Step 4: Verify all three rules landed**

Run: `grep -c 'product-docs-and-updates.md' CLAUDE.md && grep -c 'simple and modular' CLAUDE.md && grep -c 'Add regression tests' CLAUDE.md`
Expected: `1` or more from each — the change-log rule, the simple-and-modular rule, and the regression-test rule are all present under `## Project rules`.

- [ ] **Step 5: Confirm no script was affected**

Run: `node --check app.js && node --check core.js && node --check songs.js && echo OK`
Expected: `OK`

---

### Task 2: Repoint the Download source link to the published collection

> **Status: already completed on 2026-09-23.** This task originally *removed* the Download source feature. The user then directed: "Place this instead of removing the download source feature" — so the header link is **repointed**, not deleted. The work is done; **verify rather than redo**.

**Files (all already changed):**
- `index.html` — header anchor now targets the published collection
- `songs.js` — all three `source` fields now hold the common URL
- `app.js` — Read's link label and the transcription note
- `README.md`, `CLAUDE.md`, `test-core.js`, `product-docs-and-updates.md`

**What changed and why it is not a removal:** `.source-link` and all six of its CSS rules **stay**. The anchor previously pointed at `swara-source.zip`, a file intentionally absent from the directory, so it 404d when served locally. It now points at `https://publications.rkmm.org/svarakusumanjali` — the Ramakrishna Math and Ramakrishna Mission collection these songs are drawn from — with `target="_blank" rel="noopener"` and a descriptive `aria-label`, and the `download` attribute dropped since it is no longer a file download.

**Do not delete `scores/*.png`.** The link change swaps what is *linked*; it does not change what the notation was *transcribed from*. The README's integrity claim — complete screenshot transcriptions, not verified editions, requiring comparison against the original Excel by a musician — still rests on those files being present.

- [ ] **Step 1: Verify the header link is repointed, not removed**

```sh
grep -c 'swara-source.zip' index.html; grep -o 'class="source-link"[^>]*' index.html
```

Expected: `0` for the ZIP, and the anchor present with `href="https://publications.rkmm.org/svarakusumanjali"`, `target="_blank"`, `rel="noopener"` and no `download` attribute.

- [ ] **Step 2: Verify the CSS was kept**

Run: `grep -o '\.source-link[^}]*}' styles.css | wc -l`
Expected: `6` — the six rules across the base, mobile and landscape blocks. If this is `0`, the original removal was applied by mistake; restore the rules.

Count rules with `grep -o`, never lines with `grep -c`. `styles.css` packs 15KB into 13 lines, so several rules share one line: `grep -c` reports `4` here and means nothing.

- [ ] **Step 3: Verify the song data and the regression tests**

Run: `node --test test-core.js && node -e "global.window={};require('./songs.js');const c=require('./core.js');console.log(c.validate(window.SWARA_DATA))"`
Expected: `fail 0`, then `true`. The suite asserts all three songs carry the common `https` URL and that none still references a `scores/` PNG.

- [ ] **Step 4: Verify the screenshots are still on disk**

Run: `ls scores/`
Expected: all three PNGs present. They are retained for verification even though nothing links them any more.

- [ ] **Step 5: Confirm in the browser**

With the server running, `navigate_page` to `http://localhost:8080/#read`, then `evaluate_script`:

```js
() => { const header = document.querySelector('.source-link'), sheet = document.querySelector('.sheet-link');
        return {headerHref: header?.getAttribute('href'), headerNewTab: header?.target,
                readHref: sheet?.getAttribute('href'), readLabel: sheet?.textContent.trim(),
                stillHasDownloadAttr: header?.hasAttribute('download')}; }
```

Expected: both hrefs are `https://publications.rkmm.org/svarakusumanjali`, `headerNewTab` is `_blank`, `readLabel` is `Published source ↗`, and `stillHasDownloadAttr` is `false`.

---

### Task 3: Remove the Singer filter

**Files:**
- Modify: `app.js` (the `emptyFilters` factory and the `fields` array — both are single-line definitions)
- Modify: `README.md` (two lines)
- Modify: `product-docs-and-updates.md` (append entry)

**Interfaces:**
- Consumes: the change-log format from Task 1.
- Produces: a six-entry `fields` array — `deities`, `raga`, `taal`, `language`, `composer`, `script`.

**Scope warning — do not over-delete.** Leave `singer:null` in all three records in `songs.js`, and leave `song.singer` in the `core.matches` search-source array in `core.js`. Removing the facet removes a *filter control*, not the data and not its searchability. Touch neither file in this task.

- [ ] **Step 1: Remove `singer` from the filter state factory in app.js**

Replace:

```js
emptyFilters=()=>({deities:[],raga:[],taal:[],language:[],composer:[],singer:[],script:[]});
```

with:

```js
emptyFilters=()=>({deities:[],raga:[],taal:[],language:[],composer:[],script:[]});
```

- [ ] **Step 2: Remove `singer` from the rendered facet list in app.js**

Replace:

```js
const fields=[['deities','Deity'],['raga','Raga'],['taal','Taal'],['language','Language'],['composer','Poet / composer'],['singer','Singer'],['script','Script']];
```

with:

```js
const fields=[['deities','Deity'],['raga','Raga'],['taal','Taal'],['language','Language'],['composer','Poet / composer'],['script','Script']];
```

- [ ] **Step 3: Verify the removal is complete in app.js and absent elsewhere**

Run:

```sh
grep -c "\['singer'" app.js; grep -c 'singer:\[\]' app.js; grep -c "singer" songs.js core.js
```

Expected: the first two → `0` (the facet entry and the filter-state key are gone). `songs.js` → `3` and `core.js` → `1`, both unchanged — if either dropped, the data or its searchability was wrongly deleted; restore it.

Grep for those two exact literals, not the bare word `singer`. Documentation prose explaining why the facet was removed legitimately contains the word, and a bare substring match cannot tell that apart from the code identifier.

- [ ] **Step 4: Syntax check and validator**

Run: `node --check app.js && node -e "global.window={};require('./songs.js');const c=require('./core.js');console.log(c.validate(window.SWARA_DATA))"`
Expected: prints `true`.

- [ ] **Step 5: Verify in the browser that six facets render and singer search still works**

With the server running, `navigate_page` to `http://localhost:8080/#songs`, then `evaluate_script`:

```js
() => ({ facets: [...document.querySelectorAll('.facet')].map(f => f.dataset.key),
         results: document.querySelectorAll('.song-row').length })
```

Expected: `facets` is exactly `["deities","raga","taal","language","composer","script"]` (no `singer`), and `results` is `3`.

- [ ] **Step 6: Update README.md — the facet bullet**

Replace:

```markdown
- Immediate, multi-select deity, raga, taal, language, poet/composer, singer and script filters. Values within one filter use OR; different filters combine with AND.
```

with:

```markdown
- Immediate, multi-select deity, raga, taal, language, poet/composer and script filters. Values within one filter use OR; different filters combine with AND.
```

- [ ] **Step 7: Update README.md — the missing-metadata line**

Replace:

```markdown
- The nine requested deity options are always visible, including zero-match options. Other facets are generated from the actual records. A missing singer/composer is represented as Not specified, not an invented credit.
```

with:

```markdown
- The nine requested deity options are always visible, including zero-match options. Other facets are generated from the actual records. A missing composer is represented as Not specified, not an invented credit. Singer credits were never supplied, so there is no singer filter; the field is retained in the records and remains searchable.
```

- [ ] **Step 8: Append the change-log entry**

```markdown
## 2026-09-22 — Remove Singer filter

**Files:** `app.js`, `README.md`
**Change:** Dropped `singer` from `emptyFilters()` and the `fields` facet array, so the Singer filter control no longer renders. Song records keep `singer` and it is still part of the search index.
**Why:** User request: remove the Singer filter.
**Verified:** `grep -c singer app.js` → 0, `songs.js` → 3 and `core.js` → 1 unchanged; validator printed `true`; browser reported facets `["deities","raga","taal","language","composer","script"]` with 3 results.
```

---

### Task 4: Pure column-position function in core.js

> **Partially done as of 2026-09-23.** `test-core.js` **already exists** — it was created alongside the published-source change and holds four passing tests (three source regressions plus `validate`). **Do not recreate it**: Step 1 below says "Create", but you must *append* the `currentColumn` tests to the existing file and keep its header comment, `require` lines and existing tests intact. `core.currentColumn` itself does **not** exist yet, so Steps 2–5 still apply as written.

**Files:**
- Modify: `core.js` (add `currentColumn`, add it to the returned API object)
- Modify: `test-core.js` (append to the existing file — already created)
- Modify: `CLAUDE.md` (add the test command)
- Modify: `product-docs-and-updates.md` (append entry)

**Interfaces:**
- Consumes: nothing.
- Produces: `core.currentColumn(elapsed, columns) -> number`. `elapsed` is the 0→1 progress fraction through one block (`state.elapsed` in `app.js`); `columns` is the total column count (`song.groups` summed). Returns a 0-based column index, clamped to `0 .. columns-1`. Task 5 consumes this exact signature.

This function lives in `core.js` because `core.js` is pure and UMD — it is the only file in this project that can be unit-tested outside a browser.

- [ ] **Step 1: Write the failing test**

**Append** these tests to the existing `test-core.js`, directly after its current tests. The file already has the header comment, the `window` shim, `const core = require('./core.js')`, `require('./songs.js')` and `const data = window.SWARA_DATA` — do not duplicate any of them:

```js
test('currentColumn maps block progress onto a 0-based column index', () => {
  assert.equal(core.currentColumn(0, 12), 0, 'start of block is column 0');
  assert.equal(core.currentColumn(0.5, 12), 6, 'halfway through 12 columns is column 6');
  assert.equal(core.currentColumn(0.99, 12), 11, 'just before the end is the last column');
  assert.equal(core.currentColumn(0.5, 14), 7, 'a 14-column block subdivides independently');
});

test('currentColumn clamps out-of-range and degenerate input', () => {
  assert.equal(core.currentColumn(1, 12), 11, 'elapsed 1 clamps to the last column');
  assert.equal(core.currentColumn(2, 12), 11, 'overshoot clamps to the last column');
  assert.equal(core.currentColumn(-0.5, 12), 0, 'negative elapsed clamps to column 0');
  assert.equal(core.currentColumn(0.5, 0), 0, 'zero columns yields column 0, never -1');
  assert.equal(core.currentColumn(NaN, 14), 0, 'NaN elapsed yields column 0, never NaN');
});
```

The last two assertions matter more than they look: `highlight()` interpolates the return value into a `td[data-column="..."]` selector, so a `-1` or `NaN` would produce a selector that silently matches nothing.

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test test-core.js`
Expected: FAIL — the two new tests fail with `TypeError: core.currentColumn is not a function`, reported as `fail 2`. The four pre-existing tests must still pass; if any of them now fails, the append damaged the file.

- [ ] **Step 3: Write the minimal implementation**

In `core.js`, add this function immediately before the `function validate(data)` line, matching the file's one-line-per-function density:

```js
  function currentColumn(elapsed,columns){const total=Math.max(1,Math.trunc(Number(columns))||1);const ratio=Number.isFinite(elapsed)?elapsed:0;return Math.min(total-1,Math.max(0,Math.floor(ratio*total)));}
```

Then add it to the export object on the last `return` line, which becomes:

```js
  return {normalize,phonetic,romanizeDevanagari,lyrics,values,matches,packGroups,currentColumn,validate};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test test-core.js`
Expected: PASS — `fail 0`, with the pre-existing tests still passing (`pass 6` in total).

- [ ] **Step 5: Confirm nothing else in core.js regressed**

Run: `node --check core.js && node -e "global.window={};require('./songs.js');const c=require('./core.js');console.log(c.validate(window.SWARA_DATA))"`
Expected: prints `true`.

- [ ] **Step 6: Record the new test command in CLAUDE.md**

In the `## Commands` fenced block, add after the validator command:

```sh
# Unit and regression tests for core.js pure functions
node --test test-core.js
```

And replace the line:

```markdown
Run the validator after any edit to `songs.js` — it is the only automated check in the repo.
```

with:

```markdown
Run the validator after any edit to `songs.js`, and `node --test test-core.js` after any edit to `core.js`. These two commands are the only automated checks in the repo. New pure logic belongs in `core.js` precisely so it can be covered by `test-core.js`; code that touches the DOM cannot be.
```

- [ ] **Step 7: Append the change-log entry**

```markdown
## 2026-09-22 — Add core.currentColumn and a unit-test file

**Files:** `core.js`, `test-core.js`, `CLAUDE.md`
**Change:** Added the pure `currentColumn(elapsed, columns)` helper that maps block progress to a clamped 0-based column index, with `test-core.js` covering midpoints, clamping and degenerate input. Documented `node --test test-core.js` in CLAUDE.md.
**Why:** Needed by the Play-screen swara highlighting; kept pure so it is testable outside a browser.
**Verified:** `node --test test-core.js` → `pass 2`, `fail 0`; validator printed `true`.
```

---

### Task 5: Highlight the played swara and lyric on the Play screen

**Files:**
- Modify: `app.js` (`state` object, new `highlight()` function, `renderPassage()`, the `start()` interval, the `follow-mode` change handler)
- Modify: `README.md` (pace-controls disclaimer paragraph)
- Modify: `CLAUDE.md` (architecture note)
- Modify: `product-docs-and-updates.md` (append entry)

**Interfaces:**
- Consumes: `core.currentColumn(elapsed, columns)` from Task 4.
- Produces: `highlight(force)` in `app.js`, and `state.column` (a number, `-1` when nothing is highlighted).

**Why no new markup is needed:** `blockHTML` already emits `data-column="${group.start+i}"` on every `<td>`, and `styles.css` already defines `.player-stage td.current-cell{background:#f8d29c;border-radius:4px}` — a rule that currently nothing applies. A swara cell and the lyric cell beneath it share the same `data-column`, so selecting one column highlights both the swara and its lyric together. This is a class toggle, not a re-render.

- [ ] **Step 1: Confirm the two hooks exist before relying on them**

Run:

```sh
grep -c 'data-column' app.js; grep -c 'current-cell' app.js styles.css
```

Expected: `data-column` appears in `app.js`; `current-cell` is `0` in `app.js` (nothing applies it yet) and `1` in `styles.css` (already styled).

- [ ] **Step 2: Add the column field to ephemeral state**

In the `state` object literal, add `column:-1`. The line becomes:

```js
  const state={query:'',filters:emptyFilters(),view:'songs',passage:0,elapsed:0,column:-1,running:false,timer:0,readScroll:{}};
```

`column` belongs in `state`, not `prefs` — it is playback position, not a saved preference, so it must not be persisted.

- [ ] **Step 3: Add the highlight function**

Insert this line in `app.js` immediately before `function renderPassage(`:

```js
  function highlight(force=false){const stage=q('#player-stage');if(!stage)return;const total=song().groups.reduce((a,b)=>a+b,0),column=prefs.mode==='pace'?core.currentColumn(state.elapsed,total):-1;if(!force&&column===state.column)return;state.column=column;stage.querySelectorAll('td.current-cell').forEach(td=>td.classList.remove('current-cell'));if(column<0)return;stage.querySelectorAll(`td[data-column="${column}"]`).forEach(td=>td.classList.add('current-cell'));}
```

Three things this gets right, each deliberate:
- The query is scoped to `#player-stage`. The Up-next preview (`#next-score`) renders another `blockHTML` and emits the same `data-column` attributes; an unscoped query would highlight it too.
- The `force&&column===state.column` guard means the 30ms tick does DOM work only when the column actually changes, not 33 times a second.
- Manual mode yields `-1`, which clears the highlight — there is no time base in manual mode, so showing a "current" swara would be a lie.

- [ ] **Step 4: Re-apply the highlight after every passage render**

`renderPassage` replaces `stage.innerHTML`, which destroys the class. At the very end of `renderPassage`, after the `if(animate&&prefs.motion&&...)` animate call, append:

```js
highlight(true);
```

`force` is required here: `state.column` may already equal the new column (for example column 0 on every new block), and without `force` the freshly-rendered cells would never get the class.

- [ ] **Step 5: Drive the highlight from the existing pace tick**

In `start()`, inside the `setInterval` callback, the tail currently reads `updateProgress();},30);`. Change it to:

```js
updateProgress();highlight();},30);
```

Do not add a second timer. The interval already runs at 30ms, which is finer than any column boundary at the minimum 0.5s-per-block, 4× rate.

- [ ] **Step 6: Clear the highlight when switching to manual mode**

In the `main` `change` handler, the `follow-mode` branch reconfigures the pace controls. Append `highlight(true);` to the end of that branch so switching to Manual clears the highlight immediately rather than leaving a stale cell lit until the next render.

- [ ] **Step 7: Syntax check**

Run: `node --check app.js && node --test test-core.js`
Expected: no syntax errors, then the test runner reports `fail 0`.

- [ ] **Step 8: Verify highlighting in the browser**

With the server running, `navigate_page` to `http://localhost:8080/#play`. Then `evaluate_script` to confirm the highlight advances and covers both a swara and a lyric cell:

```js
async () => {
  const stage = document.querySelector('#player-stage');
  const seconds = document.querySelector('#seconds');
  seconds.value = '2'; seconds.dispatchEvent(new Event('input', {bubbles: true}));
  const read = () => [...stage.querySelectorAll('td.current-cell')]
    .map(td => ({column: td.dataset.column, kind: td.className.replace(' current-cell',''), text: td.textContent.trim()}));
  document.querySelector('#start-pause').click();
  const first = read();
  await new Promise(r => setTimeout(r, 900));
  const later = read();
  document.querySelector('#start-pause').click();
  return {first, later, kinds: [...new Set(later.map(c => c.kind))]};
}
```

Expected: `first` is non-empty and at column `"0"`; `later` is at a **higher** column number; and `kinds` contains both `"swara"` and `"lyric"` — that pair is the "swara and literal" requirement being met. All highlighted cells in one sample share a single `column` value.

- [ ] **Step 9: Verify manual mode shows no highlight**

`evaluate_script`:

```js
() => { const sel = document.querySelector('#follow-mode');
        sel.value = 'manual'; sel.dispatchEvent(new Event('change', {bubbles: true}));
        return document.querySelectorAll('#player-stage td.current-cell').length; }
```

Expected: `0`.

- [ ] **Step 10: Verify the Up-next preview is never highlighted**

`evaluate_script`:

```js
() => { const sel = document.querySelector('#follow-mode');
        sel.value = 'pace'; sel.dispatchEvent(new Event('change', {bubbles: true}));
        const t = document.querySelector('#next-toggle'); if (!t.checked) { t.click(); }
        document.querySelector('#start-pause').click();
        const leak = document.querySelectorAll('#next-score td.current-cell').length;
        document.querySelector('#start-pause').click();
        return {leakedHighlightsInPreview: leak}; }
```

Expected: `{leakedHighlightsInPreview: 0}`.

- [ ] **Step 11: Document the display semantics in README.md**

Replace this paragraph in the Functionality list:

```markdown
- Pace controls define timing for each displayed source block. They are not authored beat durations. Variable musical timing and live voice recognition are not implemented.
```

with:

```markdown
- Pace controls define timing for each displayed source block. They are not authored beat durations. Variable musical timing and live voice recognition are not implemented.
- While following the pace, the current position is highlighted: one column of the displayed block, covering the swara and the lyric beneath it. The block's duration is divided equally across its columns. This is a reading aid derived from the pace setting, not a transcription of each note's real length, and the notation sheets do not supply per-note durations. Manual mode shows no highlight, because it has no time base.
```

- [ ] **Step 12: Document the mechanism in CLAUDE.md**

Add this paragraph to the `## Architecture` section, immediately after the `**`blockHTML` is shared by both score screens:**` paragraph:

```markdown
**Play-screen highlighting is a class toggle, not a render.** `blockHTML` emits `data-column` on every `<td>`, and `styles.css` styles `.player-stage td.current-cell`. `highlight()` maps `state.elapsed` to a column via the pure `core.currentColumn()` and toggles that class, scoped to `#player-stage` so the `#next-score` preview — which emits the same attributes — is never affected. Because a swara cell and its lyric cell share a `data-column`, one column selects both. It is driven by the existing 30ms pace interval and short-circuits when the column has not changed; `renderPassage` must call `highlight(true)` because replacing `innerHTML` discards the class.
```

- [ ] **Step 13: Append the change-log entry**

```markdown
## 2026-09-22 — Highlight the played swara and lyric

**Files:** `app.js`, `README.md`, `CLAUDE.md`
**Change:** Added `highlight()` and `state.column` to `app.js`, driven by the existing 30ms pace interval and by `renderPassage`. It toggles the already-styled `current-cell` class on all `#player-stage` cells sharing the current `data-column`, highlighting the swara and its lyric together. Manual mode shows no highlight.
**Why:** User request: add highlighting of the played swara and literal in the Play screen.
**Verified:** `node --check app.js` clean; `node --test test-core.js` passed; browser check showed the highlight starting at column 0, advancing to a higher column, covering both `swara` and `lyric` kinds, clearing in manual mode, and never leaking into `#next-score`.
```

---

### Task 6: Make the pace controls reachable in landscape

**Files:**
- Modify: `styles.css` (the `@media(orientation:landscape) and (max-height:600px)` block — the last line of the file)
- Modify: `CLAUDE.md` (architecture note on the landscape layout)
- Modify: `product-docs-and-updates.md` (append entry)

**Interfaces:**
- Consumes: nothing. CSS-only; no JavaScript or markup changes.
- Produces: no new interface.

**Diagnosis — read before editing.** The pace controls are *not* hidden by any rule. Verified: neither `@media(max-width:700px)` nor the landscape block contains a `display:none` for `.pace-panel`, `#pace-rates`, `.pace-multipliers` or `.toggles`; the landscape block already styles `.pace-panel{padding:12px 16px;margin-top:16px}`. They are absent because they are **below the fold**: on a 390px-tall landscape viewport the 64px header, page-top, `.player-stage` (`font-size:1.6rem`), progress bar, transport row and status line consume the whole viewport before the pace panel begins. The fix is to pin the panel to the bottom of the viewport in landscape, not to un-hide it.

- [ ] **Step 1: Reproduce the problem before fixing it**

With the server running, `resize_page` to 844×390, `navigate_page` to `http://localhost:8080/#play`, then `evaluate_script`:

```js
() => { const p = document.querySelector('.pace-panel'), r = p.getBoundingClientRect();
        return {viewportHeight: innerHeight, panelTop: Math.round(r.top), panelBottom: Math.round(r.bottom),
                visible: r.top < innerHeight && r.bottom > 0,
                display: getComputedStyle(p).display}; }
```

Expected before the fix: `display` is `"flex"` (confirming it is not hidden) and `visible` is `false`, with `panelTop` greater than `viewportHeight`. Record these numbers in the change-log entry.

- [ ] **Step 2: Pin the pace panel to the bottom in landscape**

In the final line of `styles.css`, inside `@media(orientation:landscape) and (max-height:600px){...}`, replace this existing rule:

```css
.pace-panel{padding:12px 16px;margin-top:16px}
```

with:

```css
.player-view .pace-panel{position:sticky;bottom:0;z-index:6;margin-top:14px;padding:9px 14px;gap:14px;flex-wrap:nowrap;align-items:center;border-radius:12px 12px 0 0;box-shadow:0 -6px 20px #342b241f}.player-view .pace-field{min-width:132px;flex:1 1 auto;gap:5px}.player-view .pace-field label{gap:10px}.player-view #pace-rates{display:flex;align-items:center;gap:10px;flex:0 0 auto}.player-view .pace-multipliers .button{min-width:44px;padding:8px 9px}.player-view .effective{margin-top:0;white-space:nowrap}.player-view .toggles{gap:12px;flex:0 0 auto}.player-view .toggles label{min-height:36px}
```

Why sticky rather than fixed: `position:sticky;bottom:0` keeps the panel in normal document flow, so it cannot overlap the score when the page is short, and it does not need a height reservation or a `padding-bottom` hack on `main`. No ancestor sets `overflow:hidden`, so sticky resolves against the viewport as intended. The `.player-view` prefix confines all of it to the Play screen, leaving Read and Songs untouched.

- [ ] **Step 3: Keep the transport clear of the pinned panel**

Still inside the landscape block, append:

```css
.player-view .player-status{margin:8px 0}.player-view .next-preview{margin-top:12px}
```

- [ ] **Step 4: Verify the panel is now on screen at two landscape sizes**

`resize_page` to 844×390, reload, then `evaluate_script`:

```js
() => { const p = document.querySelector('.pace-panel'), r = p.getBoundingClientRect();
        const rates = [...document.querySelectorAll('[data-rate]')].map(b => {
          const rr = b.getBoundingClientRect();
          return {rate: b.dataset.rate, onScreen: rr.top >= 0 && rr.bottom <= innerHeight && rr.width > 0}; });
        const secs = document.querySelector('#seconds').getBoundingClientRect();
        return {panelVisible: r.top < innerHeight && r.bottom > 0 && r.height > 0,
                panelBottom: Math.round(r.bottom), viewportHeight: innerHeight,
                secondsOnScreen: secs.top >= 0 && secs.bottom <= innerHeight, rates}; }
```

Expected: `panelVisible: true`; `panelBottom` within 1px of `viewportHeight`; `secondsOnScreen: true`; and all three of `1`, `2`, `4` reporting `onScreen: true`.

- [ ] **Step 5: Repeat at the small-phone landscape size**

`resize_page` to 667×375 and re-run the Step 4 script. This size matches **both** `@media(max-width:700px)` and the landscape query simultaneously, so it is the case where the two blocks could conflict.

Expected: identical results — `panelVisible: true` and all three rate buttons `onScreen: true`.

- [ ] **Step 6: Confirm portrait and desktop are unchanged**

`resize_page` to 390×844, reload `#play`, `evaluate_script`:

```js
() => { const p = getComputedStyle(document.querySelector('.pace-panel'));
        return {position: p.position, rates: document.querySelectorAll('[data-rate]').length}; }
```

Expected: `position` is `"static"` (the sticky rule is landscape-only) and `rates` is `3`. Then `resize_page` to 1280×800 and confirm the same.

- [ ] **Step 7: Confirm the score is still readable behind the pinned panel**

At 844×390, `take_screenshot` and confirm visually: the pace panel sits along the bottom edge, the notation in `.player-stage` is not covered at the top of the scroll position, and the transport buttons can be scrolled to.

- [ ] **Step 8: Document the landscape layout rule in CLAUDE.md**

Add to the `## Architecture` section, after the layout-in-JavaScript paragraph:

```markdown
**Landscape phones are a distinct layout, not a narrow one.** `@media(orientation:landscape) and (max-height:600px)` is the last line of `styles.css`, and a small phone in landscape (667×375) matches it *and* `@media(max-width:700px)` at the same time — check both blocks when a control misbehaves there. Vertical space is the scarce resource: the Play screen pins `.pace-panel` with `position:sticky;bottom:0` so the seconds slider and the 1×/2×/4× buttons stay on screen, because in normal flow they fall below the fold. All such rules are prefixed `.player-view` to keep Read and Songs unaffected.
```

- [ ] **Step 9: Append the change-log entry**

```markdown
## 2026-09-22 — Pin pace controls in landscape

**Files:** `styles.css`, `CLAUDE.md`
**Change:** In the landscape media query, made `.player-view .pace-panel` sticky to the bottom of the viewport and compacted the seconds field, the 1×/2×/4× buttons, the effective-time readout and the toggles so they fit one row. The controls were never hidden — they sat below the fold.
**Why:** User request: the pace controls and 1×/2×/4× are absent on the landscape mobile screen.
**Verified:** Before, at 844×390, the panel computed `display:flex` but `visible:false`. After, at both 844×390 and 667×375, `panelVisible:true`, `secondsOnScreen:true` and all three rate buttons `onScreen:true`; portrait 390×844 and desktop 1280×800 keep `position:static`.
```

---

### Task 7: Regression test suite for core.js

**Files:**
- Modify: `test-core.js` (extend the file created in Task 4)
- Modify: `CLAUDE.md` (note what the suite guards)
- Modify: `product-docs-and-updates.md` (append entry)

**Interfaces:**
- Consumes: `core.currentColumn` from Task 4; the `singer` data retained by Task 3.
- Produces: no runtime interface. Produces the safety net every later change relies on.

**What this is for.** The repo previously had one check — the data validator. These tests pin the behaviour that this plan's changes could silently break: that removing the Singer *facet* did not remove singer *searchability*, that `packGroups` never splits a musical group (the core promise of the Read layout), and that `validate` still rejects each malformed-data case. All of it is zero-dependency, on Node's built-in runner.

- [ ] **Step 1: Write the failing regression tests**

Every expected value below was **observed** by running the real `core.js` on Node v24.11.1, not inferred from reading it — including the em dash surviving `normalize` (it is not in the stripped character class), `romanizeDevanagari('पूजा') === 'puja'`, and `values(song, 'singer')` returning `['Not specified']`. If an assertion fails, suspect a genuine regression in `core.js` before editing the expectation.

Append to `test-core.js`, after the `currentColumn` tests. The `window` shim, `core`, `require('./songs.js')` and `data` are already declared at the top of the file — add only the `song` and `corrupt` helpers:

```js
const song = id => data.songs.find(s => s.id === id);
const corrupt = mutate => { const d = structuredClone(data); mutate(d); return d; };

test('normalize and phonetic fold case, diacritics and punctuation', () => {
  assert.equal(core.normalize('  Ādyā—Shakti  '), 'adya—shakti');
  assert.equal(core.normalize('_ग~सा'), 'ग सा');
  assert.equal(core.phonetic('shaakti'), core.phonetic('shakti'));
});

test('romanizeDevanagari transliterates consonants, marks and anusvara', () => {
  assert.equal(core.romanizeDevanagari('सा'), 'sa');
  assert.equal(core.romanizeDevanagari('पूजा'), 'puja');
  assert.match(core.romanizeDevanagari('शक्ति'), /^shakti/);
});

test('lyrics extracts only lyric cells and strips notation punctuation', () => {
  const text = core.lyrics(song('adya-shakti'));
  assert.ok(text.length > 0, 'lyrics must not be empty');
  assert.ok(!/[।॥\[\]]/.test(text), 'notation punctuation is stripped');
});

test('values reports Not specified for absent metadata', () => {
  assert.deepEqual(core.values(song('adya-shakti'), 'singer'), ['Not specified']);
  assert.deepEqual(core.values(song('adya-shakti'), 'raga'), ['Malkaush']);
});

test('REGRESSION: singer data survives removal of the Singer facet', () => {
  for (const s of data.songs) {
    assert.ok('singer' in s, `${s.id} must keep its singer field`);
  }
  assert.equal(core.matches(song('adya-shakti'), 'Not specified'), false,
    'the placeholder is not itself a search term');
});

test('matches searches English, Devanagari, aliases and lyrics', () => {
  assert.equal(core.matches(song('adya-shakti'), 'adya shakti'), true);
  assert.equal(core.matches(song('adya-shakti'), 'malkosh'), true, 'alias spelling matches');
  assert.equal(core.matches(song('apani-karile'), 'puja'), true, 'lyric text matches');
  assert.equal(core.matches(song('adya-shakti'), 'zzzz'), false);
});

test('matches combines filters with OR inside a key and AND across keys', () => {
  const s = song('adya-shakti');
  assert.equal(core.matches(s, '', {raga: ['Malkaush', 'Iman Kalyan']}), true, 'OR within a key');
  assert.equal(core.matches(s, '', {raga: ['Malkaush'], taal: ['Ektaal']}), false, 'AND across keys');
  assert.equal(core.matches(s, '', {raga: []}), true, 'an empty selection filters nothing');
});

test('REGRESSION: packGroups never splits a musical group', () => {
  for (const s of data.songs) {
    for (const width of [150, 320, 480, 768, 1200, 1920]) {
      const chunks = core.packGroups(s.groups, width, 48);
      const flat = chunks.flat();
      assert.deepEqual(flat.map(g => g.count), s.groups,
        `${s.id} at ${width}px: every group intact and in order`);
      assert.deepEqual(flat.map(g => g.index), s.groups.map((_, i) => i),
        `${s.id} at ${width}px: no group dropped or reordered`);
      assert.ok(chunks.every(c => c.length > 0), 'no empty chunk');
    }
    // Width must actually drive the packing, not just preserve group order.
    assert.equal(core.packGroups(s.groups, 1920, 48).length, 1,
      `${s.id}: a wide screen fits every group on one line`);
    assert.ok(core.packGroups(s.groups, 150, 48).length > 1,
      `${s.id}: a narrow screen wraps onto multiple lines`);
  }
});

The two width-driven assertions at the end are load-bearing. Without them the test passes even if packing is completely broken: a version that puts every group on its own line still flattens to the same `count` and `index` sequences. Verified on the shipped data — Adya Shakti's six groups pack to 1 chunk at 1920px and 6 chunks at 150px.

test('REGRESSION: validate rejects each malformed-data case', () => {
  assert.throws(() => core.validate(corrupt(d => d.songs.push(structuredClone(d.songs[0])))),
    /Duplicate song ID/);
  assert.throws(() => core.validate(corrupt(d => d.songs[0].marks.pop())),
    /Group markers mismatch/);
  assert.throws(() => core.validate(corrupt(d => d.songs[0].blocks[0].rows[0].cells.pop())),
    /Column mismatch/);
  assert.throws(() => core.validate(corrupt(d => { d.songs[0].blocks[0].rows[0].sourceRow += 5; })),
    /Missing source row/);
  assert.throws(() => core.validate(corrupt(d => { d.songs[0].blocks[0].rows = []; })),
    /Empty block/);
});
```

- [ ] **Step 2: Run the suite and confirm it is genuinely red before it is green**

Run: `node --test test-core.js`

Expected: the new tests run. Any that fail identify a real defect — fix the code, not the test. In particular, if `REGRESSION: singer data survives removal of the Singer facet` fails, Task 3 over-deleted and the `singer` fields must be restored in `songs.js`.

- [ ] **Step 3: Prove the suite actually catches regressions**

A test that never fails is worthless. Verify the net has holes in the right places by breaking the code on purpose and confirming a red run:

```sh
cp core.js core.js.bak
# Break the width check so every group starts its own line.
node -e "const fs=require('fs');fs.writeFileSync('core.js',fs.readFileSync('core.js','utf8').replace('if(part.length&&used+needed>width)','if(part.length&&used+needed>-1)'))"
node --test test-core.js; echo "exit=$?"
cp core.js.bak core.js && rm core.js.bak
node --test test-core.js; echo "exit=$?"
```

Expected: the first run exits **non-zero**, failing on `a wide screen fits every group on one line` — the sabotaged version returns **6** chunks at 1920px instead of 1. The second run, after restoring, exits `0`.

This specific sabotage was measured against the real `core.js`, and it is instructive: it leaves `flat().map(g => g.count)` **exactly equal** to `s.groups`, so the group-integrity assertions alone pass. Only the chunk-count assertions catch it. If your first run exits `0`, the width assertions are missing or wrong — fix the test before continuing, and do not proceed on a suite that cannot fail.

- [ ] **Step 4: Confirm the restore was clean**

Run: `node --check core.js && node --test test-core.js && node -e "global.window={};require('./songs.js');const c=require('./core.js');console.log(c.validate(window.SWARA_DATA))"`
Expected: `fail 0`, then `true`. Also confirm `core.js.bak` is gone: `ls core.js.bak` should report no such file.

- [ ] **Step 5: Record the suite's purpose in CLAUDE.md**

Replace the Project-rules bullet that reads `- **Add regression tests.** ...` with:

```markdown
- **Add regression tests.** Every bug fix and every behaviour change gets a test that fails before the change and passes after, so the same defect cannot return silently. Tests live in `test-core.js`, run with `node --test test-core.js` on the built-in `node:test` runner, and need no dependencies. The suite pins the behaviour that is easy to break by accident: that `packGroups` never splits a musical group at any width, that `validate` still throws on each malformed-data case, that song metadata stays searchable even when its filter facet is removed, and that `currentColumn` never returns `-1` or `NaN`. Only pure logic in `core.js` is reachable from here — DOM behaviour is verified in a browser.
```

- [ ] **Step 6: Append the change-log entry**

```markdown
## 2026-09-22 — Add the core.js regression suite

**Files:** `test-core.js`, `CLAUDE.md`
**Change:** Extended `test-core.js` into a regression suite on the built-in `node:test` runner, covering `normalize`, `phonetic`, `romanizeDevanagari`, `lyrics`, `values`, `matches` (text, aliases, lyrics, OR-within/AND-across filters), `packGroups` at six widths, and every `validate` throw case. Added regression tests pinning that singer data stays searchable after the facet removal.
**Why:** User request: add regression tests. The repo previously had only the data validator.
**Verified:** `node --test test-core.js` → `fail 0`; deliberately breaking `packGroups` produced a non-zero exit with that test failing, confirming the suite detects regressions rather than passing vacuously.

---

### Task 8: Whole-app regression sweep and documentation consistency check

**Files:**
- Modify: `product-docs-and-updates.md` (append final entry)
- Modify: `CLAUDE.md` / `README.md` only if this task finds a contradiction

**Interfaces:**
- Consumes: every preceding task.
- Produces: nothing. This is the gate.

This task exists because the repo has no test suite and the six preceding tasks each edited the same three documentation files. It catches cross-task drift.

- [ ] **Step 1: Run every automated check**

```sh
node --check app.js && node --check core.js && node --check songs.js && \
node --test test-core.js && \
node -e "global.window={};require('./songs.js');const c=require('./core.js');console.log(c.validate(window.SWARA_DATA))"
```

Expected: the test runner reports `fail 0`, then the validator prints `true`, with no syntax errors.

- [ ] **Step 2: Confirm both removals are complete across every file**

```sh
grep -c 'swara-source.zip' index.html styles.css app.js; echo "---"; grep -o 'class="source-link"' index.html | wc -l; grep -o '\.source-link[^}]*}' styles.css | wc -l; echo "---"; grep -rn "\['singer'" app.js
```

Expected: `0` for `swara-source.zip` everywhere; `1` anchor in `index.html` and `6` rules in `styles.css` (the link is **kept and repointed**, not removed); and no output for the singer facet literal.

Use `grep -o | wc -l` for the CSS rules — `grep -c` counts lines, and this stylesheet puts many rules on one line. Documentation prose describing *why* singer is no longer a facet is expected and fine — only the code identifier `'singer'` in `app.js` and the `.source-link` class must be gone.

- [ ] **Step 3: Confirm the song data was not damaged**

```sh
grep -c 'singer:null' songs.js; grep -c 'song.singer' core.js
```

Expected: `3` and `1`. If either is lower, a previous task over-deleted; restore it — the data and its searchability were explicitly in scope to keep.

- [ ] **Step 4: Confirm every task logged its change**

Run: `grep -c '^## 2026-09-22' product-docs-and-updates.md`
Expected: **at least** `7`. Entries also accumulate from work done outside the plan, so treat this as a floor, not an exact count. If lower, find the unlogged task and add its entry — an unlogged change violates the Global Constraints.

- [ ] **Step 5: Walk all three screens in the browser at desktop size**

`resize_page` to 1280×800 and check each view loads and its core interaction works:

```js
() => { const out = {};
  location.hash = 'songs'; out.songs = document.querySelectorAll('.song-row').length;
  out.facets = [...document.querySelectorAll('.facet')].map(f => f.dataset.key);
  const s = document.querySelector('#song-search');
  s.value = 'puja'; s.dispatchEvent(new Event('input', {bubbles: true}));
  out.searchHits = document.querySelectorAll('.song-row').length;
  s.value = ''; s.dispatchEvent(new Event('input', {bubbles: true}));
  return out; }
```

Expected: `songs: 3`; `facets` has exactly six entries with no `singer`; `searchHits` is at least `1` (search still works).

Then navigate to `#read` and `#play` and confirm via `list_console_messages` that **no** errors were logged across all three views.

- [ ] **Step 6: Verify the two new behaviours survive together**

At 844×390 landscape on `#play`, start pace following and confirm in one script that the highlight advances *and* the pace panel is on screen:

```js
async () => { document.querySelector('#start-pause').click();
  await new Promise(r => setTimeout(r, 1200));
  const cells = document.querySelectorAll('#player-stage td.current-cell').length;
  const r = document.querySelector('.pace-panel').getBoundingClientRect();
  document.querySelector('#start-pause').click();
  return {highlightedCells: cells, paceVisible: r.top < innerHeight && r.bottom > 0}; }
```

Expected: `highlightedCells` is at least `1` and `paceVisible` is `true`.

- [ ] **Step 7: Read CLAUDE.md and README.md end to end for contradictions**

Confirm specifically: CLAUDE.md no longer has a Known-quirk section about the ZIP; CLAUDE.md lists `node --test test-core.js`; CLAUDE.md's file inventory and architecture notes mention the highlight and landscape rules; README.md's facet list omits singer; README.md documents the highlight semantics. Fix any contradiction found, and log the fix.

- [ ] **Step 8: Append the final change-log entry**

```markdown
## 2026-09-22 — Regression sweep

**Files:** none changed (verification only), or list any contradiction fixed in Step 7.
**Change:** Verified all five requested changes together against a running server.
**Why:** No test suite exists; six tasks edited the same documentation files, so cross-task drift needed a gate.
**Verified:** Syntax checks clean; `node --test test-core.js` passed; validator printed `true`; no `.source-link` or `'singer'` identifiers remain; song data intact (`singer:null` ×3, `song.singer` ×1); all six task entries present in this log; three screens loaded with no console errors; in landscape the highlight advanced while the pace panel stayed on screen.
```

---

## Self-Review

**Spec coverage:**

| Requirement | Task |
| --- | --- |
| 1. Update CLAUDE.md alongside the changes | 1 (logging rule), 2 (Known-quirk removal), 4 (test command), 5 (highlight note), 6 (landscape note), 7 (consistency) |
| 2. Add the `product-docs-and-updates.md` rule to CLAUDE.md | 1, enforced as a Global Constraint and gated in 7 Step 4 |
| 3a. Download source | 2 — **superseded**: repointed to the published collection, not removed |
| 9. Use the common published source link (2026-09-23) | 2 |
| 3b. Remove Singer filter | 3 |
| 4. Pace controls and 1×/2×/4× in landscape | 6 |
| 5. Highlight played swara and literal | 4 (pure math), 5 (DOM) |
| 6. Add regression tests (2026-09-22) | 4 (first tests), 7 (full suite) |
| 7. Keep the code simple and modular (2026-09-22) | Global Constraints; enforced per task |
| 8. Set up the application in React (2026-09-22) | **Declined by the user** — see Decision on record. No task. |

**Type consistency:** `core.currentColumn(elapsed, columns)` is defined in Task 4 Step 3, exported in the same step, asserted in Task 4 Step 1, and called in Task 5 Step 3 with the same argument order and meaning. `highlight(force = false)` is defined in Task 5 Step 3 and called in Steps 4 (`highlight(true)`), 5 (`highlight()`) and 6 (`highlight(true)`). `state.column` is added in Step 2 and read in Step 3. The `current-cell` class name matches the existing `styles.css` rule exactly.

**Known deviations from the writing-plans skill, and why:**
- **No commit steps.** The directory is not a git repository, so `git add`/`git commit` steps would be uncheckable. Each task ends with verification plus a change-log append instead — the change log is the substitute history, which is what the user asked for.
- **React was requested and then declined.** The user considered setting the application up in React and chose to stay vanilla, so no framework task exists. The Decision on record above exists so a future reader does not treat the absence as an oversight.
- **TDD applies fully only to Task 4.** Only `core.js` is unit-testable outside a browser. Tasks 5 and 6 are DOM and CSS, so they use executable browser assertions via the chrome-devtools MCP, each written to fail before the change and pass after; Task 6 Step 1 explicitly reproduces the bug before Step 2 fixes it.
