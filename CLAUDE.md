# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

There is no build step, package manager, dependency, or test framework. The `node` commands below were run in this repo and pass; `python3` (3.14.3 here) is the README's suggested server.

```sh
# Serve (required for localStorage and hash routing to behave; file:// restricts storage)
python3 -m http.server 8080      # then open http://localhost:8080

# Syntax check every script
node --check app.js && node --check core.js && node --check songs.js

# The closest thing to a test suite: run the score-data validator outside the browser.
# songs.js is an IIFE assigning window.SWARA_DATA, so Node needs the window shim;
# core.js is UMD and pure, so it requires cleanly. Prints `true` when data is valid.
node -e "global.window={};require('./songs.js');const c=require('./core.js');console.log(c.validate(window.SWARA_DATA))"

# Unit and regression tests for core.js and the song data
node --test test-core.js
```

Run the validator after any edit to `songs.js`, and `node --test test-core.js` after any edit to `core.js` or the song data. These two commands are the only automated checks in the repo — there is no DOM test harness, so anything touching `app.js` or `styles.css` needs a browser check.

This directory is **not a git repository**, so the usual `git diff` / commit habits do not apply.

## Project rules

These are standing requirements, not suggestions. They apply to every change.

- **Keep the code simple and modular.** One responsibility per unit, small focused files, clear boundaries. Put pure logic in `core.js` where it can be tested; keep DOM work in the UI layer. Prefer the smallest change that fully does the job over a clever or general one — YAGNI.
- **Add regression tests.** Every bug fix and every behaviour change gets a test that fails before the change and passes after, so the same defect cannot return silently. Tests live in `test-core.js`, run with `node --test test-core.js` on the built-in `node:test` runner, and need no dependencies. The suite pins the behaviour that is easy to break by accident: that `packGroups` never splits a musical group at any width *and* that width actually drives the packing, that `validate` still throws on each malformed-data case, that song metadata stays searchable even when its filter facet is removed, that every song points at the published source, and that `currentColumn` never returns `-1` or `NaN`. Only pure logic in `core.js` is reachable from here — DOM behaviour is verified in a browser. Before trusting a new test, break the code it covers and confirm it actually fails.
- **Document every change in `product-docs-and-updates.md`.** Append one entry per change set, newest last, in the format documented at the top of that file: files touched, what changed, why, and the verification command with its result. This directory is not a git repository, so an unlogged change leaves no trace — the log is the project's history. Write the entry as part of the change, not afterwards.

## Architecture

`README.md` is thorough and authoritative on provenance, transcription encoding, and the user-facing feature set. Read it rather than re-deriving that material. What follows is what the README does not say.

**Load order is a hard dependency.** `index.html` defers `songs.js` → `core.js` → `app.js` in that order. `app.js` reads the `window.SWARA_DATA` and `window.SwaraCore` globals at IIFE time and calls `core.validate(data)` immediately. A data-shape error therefore throws before anything renders — the symptom is a completely blank `<main>`, not a partially drawn page.

**`core.js` is the pure layer; `app.js` owns all DOM.** Keep new search, matching, or layout logic in `core.js` so it stays Node-requirable and testable. `core.matches()` is shared by the UI, the facet counts, and the WebMCP tools, so a change there moves all three.

**Layout is computed in JavaScript, not CSS.** `core.packGroups(groups, width, minCell)` decides where a notation row wraps, and it may only break at stored musical-group boundaries. `renderNotation()` re-runs on debounced (120ms) resize and on `fullscreenchange`. To change notation density, edit `minCell` in `blockHTML` (`normal` 48 / `compact` 44) — not a media query.

**Landscape phones are a distinct layout, not a narrow one.** `@media(orientation:landscape) and (max-height:600px)` is the last line of `styles.css`, and a small phone in landscape (667×375) matches it *and* `@media(max-width:700px)` at the same time — check both blocks when a control misbehaves there. Vertical space is the scarce resource: the Play screen pins `.pace-panel` with `position:sticky;bottom:0` so the seconds slider and the 1×/2×/4× buttons stay on screen, because in normal flow they fall below the fold. The panel must stay `flex-wrap:wrap` — forcing `nowrap` pushes `.toggles` past the viewport and causes horizontal scroll at 667px. All these rules are prefixed `.player-view` so Read and Songs are unaffected. When changing them, check the notation cells rather than the panel: a panel that is "visible" can still cover the entire score.

**`blockHTML` is shared by both score screens:** Read renders every block; Play renders one block with `hideHeader=true`. Any change there affects both.

**Play-screen highlighting is a class toggle, not a render.** `blockHTML` emits `data-column` on every `<td>`, and `styles.css` styles `.player-stage td.current-cell`. `highlight()` maps `state.elapsed` to a column via the pure `core.currentColumn()` and toggles that class, scoped to `#player-stage` so the `#next-score` preview — which emits the same attributes — is never affected. Because a swara cell and its lyric cell share a `data-column`, one column selects both. It is driven by the existing 30ms pace interval and short-circuits when the column has not changed; `renderPassage` calls `highlight(true)` because replacing `innerHTML` discards the class. Switching to Manual needs no separate clearing call — that branch already calls `renderPassage()`, and `highlight()` returns `-1` in manual mode.

**`prefs` vs `state`.** `prefs` persists to `localStorage` under `swara.website.preferences.v1` and every field is re-validated individually on load. `state` is ephemeral (query, filters, view, passage, timers). Adding a persisted preference is a **two-place edit** — the `defaults` object *and* the load-time validation block. Miss the second and the preference silently never restores.

**Event handling is fully delegated.** Single `click` / `change` / `input` listeners on `main`, dispatching on `[data-action]` or element `id`. New UI adds a `data-action` attribute; it does not add a listener.

**Escaping is manual and mandatory.** Everything renders through `innerHTML` string templates. Every interpolated value passes through `escape()`; swara cells pass through `note()`, which converts the `_x~y` underline encoding into `<u>`.

## Editing `songs.js`

`core.validate()` checks **structure only**, at boot:

- unique song `id`
- `groups.length === marks.length`
- every block has at least one row
- every row's `cells.length === sum(groups)`
- `sourceRow` numbers strictly contiguous (+1) across all blocks within a song

**It does not check required fields.** A record can validate cleanly and still break at use:

- `deities` **must be an array** — `core.matches` spreads it (`...song.deities`), so a record missing it throws a TypeError on *any* search or facet count, well after boot.
- `beatsPerCycle` is interpolated straight into the song list, so omitting it renders "undefined beats".
- `roman` is used in `document.title` and in Play/Read aria-labels.

Add any new field to `validate()` if it must not be omitted.

Row helpers: `N(sourceRow, text)` for swaras, `L(sourceRow, text)` for lyrics. Cell text is space-delimited, `·` becomes an empty cell, and the optional `overrides` map sets a different `kind` per column index for mixed rows.

## Code style

`app.js` (22KB in 85 lines) and `styles.css` (16KB in 13 lines) are deliberately dense; `songs.js` and `test-core.js` are the exceptions and stay conventionally readable — structured data and tests respectively. The density is deliberate: roughly one packed line per function, semicolon-chained statements, arrow functions and template literals throughout. Match it — conventionally formatted additions will read as grafted on.

## External links

Both the header link and Read's Published source link point at the same published collection, `https://publications.rkmm.org/svarakusumanjali`, stored per song as `source` in `songs.js`. The header previously offered `swara-source.zip`, which was never present in the directory and 404d when served locally; that is resolved — do not reintroduce the archive link. `source` stays per-song rather than hoisted to a shared field so a future song from a different publication can carry its own, which is what the README's "Adding songs" section assumes.
