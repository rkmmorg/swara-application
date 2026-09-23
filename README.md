# Swara — Harmonium Songbook

A responsive, dependency-free website containing the three complete screenshot transcriptions supplied for this project:

1. आद्या शक्ति मातृ मूर्ति — Adya Shakti Matri Murti — Malkaush / Tevra.
2. आपनी करिले आपनार पूजा — Apani Karile Apanar Puja — Nayaki Kanada / Ektaal.
3. आबार भारते — Abar Bharate — Iman Kalyan / Ektaal.

## Run the exported website

Extract this archive and open `index.html` in a browser. All assets are local and no build or installation is required. For consistent browser storage and hosting behaviour, serve the folder over HTTP, for example with Python:

```sh
python3 -m http.server 8080
```

Open `http://localhost:8080`. Any static host can serve these files. There is no backend, login implementation, database, tracking, CDN, paid service, or API key in the export. The published Sites installation has its own owner-private access control.

## Files

- `index.html`: document, app navigation, and script/style references.
- `styles.css`: saffron theme and desktop/mobile/landscape/full-screen layouts.
- `songs.js`: song metadata and complete structured notation.
- `core.js`: pure search, transliteration, filter, validation, and group-layout functions.
- `app.js`: Songs, Read and Play screens, state persistence, and controls.
- `scores/`: the three original screenshots the notation was transcribed from, retained for checking. Read links the published source rather than these files.
- The header links the published source, Svarakusumanjali (https://publications.rkmm.org/svarakusumanjali), the Ramakrishna Math and Ramakrishna Mission collection these songs are drawn from. It replaces the former Download source archive link, so no ZIP needs to be generated when hosting the folder elsewhere.

## Functionality

- Search original and English titles, lyric text, supplied Roman spellings, and metadata.
- Immediate, multi-select deity, raga, taal, language, poet/composer and script filters. Values within one filter use OR; different filters combine with AND.
- The nine requested deity options are always visible, including zero-match options. Other facets are generated from the actual records. A missing composer is represented as Not specified, not an invented credit. Singer credits were never supplied, so there is no singer filter; the field is retained in the records and remains searchable.
- Last-read song and Normal/Compact notation size are saved as device-local preferences. There is no Large preset or practice-selection action.
- Read uses the available page width. When the whole notation row no longer fits at the chosen size, it wraps only between the stored musical groups. Every swara and corresponding lyric remains in the same column.
- Each Songs row has a Play control. Read also has Play. These enter the landscape-friendly notation follower; Play does not play recorded audio.
- Manual navigation or pace following, 0.5–15 base seconds per phrase, 1×/2×/4×, effective-time display, pause/resume, next-phrase preview, optional animation, reduced-motion support, and browser full screen when supported.
- Pace controls define timing for each displayed source block. They are not authored beat durations. Variable musical timing and live voice recognition are not implemented.
- While following the pace, the current position is highlighted: one column of the displayed block, covering the swara and the lyric beneath it. The block's duration is divided equally across its columns. This is a reading aid derived from the pace setting, not a transcription of each note's real length, and the notation sheets do not supply per-note durations. Manual mode shows no highlight, because it has no time base.
- Browser Screen Wake Lock is requested while following when available. Unsupported or denied browser features are handled without blocking reading.
- Pace following pauses if the tab is hidden. Browser storage may be restricted in private browsing or local file contexts; in-memory navigation still works.
- Optional feature-detected WebMCP tools expose read-only song search and opening a song. A supported WebMCP browser is not required to use the website.

## Score structure and provenance

`songs.js` retains every source notation row in order:

| Song | Source spreadsheet rows | Musical blocks | Notation / lyric rows | Columns |
| --- | --- | --- | --- | --- |
| Adya Shakti | 3–32 | 12 | 30 | 14 |
| Apani Karile | 3–26 | 12 | 24 | 12 |
| Abar Bharate | 3–28 | 10 | 26 | 12 |

Rows with two lyric variants share the original swara line; they are not discarded or turned into invented notes. Adya Shakti's pickup includes blank cells and a mixed row; per-cell `kind` preserves it. Source blank cells are empty strings. `_` before a swara stores a visible underline; `~` ends the underlined part within a compound note. This is a typography encoding, not an inferred pitch interpretation.

The screens preserve the screenshots' grouping: Tevra 3+2+2 twice across a row; the supplied Ektaal arrangements 3+3+3+3. These are arrangement-specific groupings, not a claim that every composition with the same taal has the same layout. One spreadsheet column should not automatically be treated as a fixed duration.

These are complete screenshot transcriptions, not verified editions. The original screenshots remain in `scores/` for verification, and Read links the common published source, Svarakusumanjali (https://publications.rkmm.org/svarakusumanjali), which is the collection these songs come from rather than a per-song facsimile. Some fine swara marks and lyric glyphs are low resolution and require comparison with the original Excel by a musician before the notation is treated as authoritative. Deity labels are editorial collection tags. Singer credits were not supplied. Swami Premeshananda is the credit printed on the two Ektaal sheets; the first sheet provides no such credit.

## Adding songs or correcting text

Add a record in `SWARA_DATA.songs` in `songs.js`. Give it a stable ID, metadata, group widths, group-start markers and notation blocks. Each block contains rows; each row contains one cell for each column in the arrangement. Cells store text and kind (`swara` or `lyric`). The runtime validates column counts and source-row order.

Store language separately from display script: these three records are Bengali songs written in Devanagari. For Sanskrit, Hindi, Tamil or other future records, populate original titles/lyrics and reviewed English title, lyric and metadata aliases. The current index accepts Unicode and includes a basic Devanagari Romanization fallback; it is not a universal phonetic-search engine for every Indian script. Add appropriate language-specific normalization for a larger multilingual catalogue. Diacritic-insensitive Latin prefix matching and explicit common aliases handle the supplied songs.

## Validation performed

- JavaScript syntax checks for each script.
- Complete source-row sequences and exact cell counts for all three songs.
- English/Bengali queries, direct facet combinations, missing metadata, and no-results behaviour.
- Responsive packing of every original group at narrow, mobile, landscape and desktop widths; no group split or dropped columns.
- Local asset references and source archive contents.

Rendered browser QA and supported WebMCP runtime validation were unavailable in the authoring environment. Check final typography and controls on Safari/iOS and Chrome/Android before a public release, especially the smallest supported phones and 200% text zoom.
