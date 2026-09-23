/* Unit and regression tests for the pure functions in core.js and the song data.
 * Run: node --test test-core.js
 * core.js is UMD and pure, so it requires cleanly; songs.js is an IIFE that
 * assigns window.SWARA_DATA, so it needs the window shim first. */
const {test} = require('node:test');
const assert = require('node:assert/strict');
global.window = {};
const core = require('./core.js');
require('./songs.js');
const data = window.SWARA_DATA;

const PUBLISHED_SOURCE = 'https://publications.rkmm.org/svarakusumanjali';

test('REGRESSION: every song points at the common published source', () => {
  for (const song of data.songs) {
    assert.equal(song.source, PUBLISHED_SOURCE, `${song.id} uses the common published link`);
  }
});

test('REGRESSION: no song still points at a local screenshot', () => {
  for (const song of data.songs) {
    assert.doesNotMatch(song.source, /scores\//, `${song.id} must not link a scores/ file`);
    assert.doesNotMatch(song.source, /\.png$/, `${song.id} must not link a PNG`);
  }
});

test('the source is an absolute https URL safe to open in a new tab', () => {
  for (const song of data.songs) {
    const url = new URL(song.source);
    assert.equal(url.protocol, 'https:', `${song.id} uses https`);
  }
});

test('validate accepts the shipped data', () => {
  assert.equal(core.validate(data), true);
});

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
    assert.equal(core.packGroups(s.groups, 1920, 48).length, 1,
      `${s.id}: a wide screen fits every group on one line`);
    assert.ok(core.packGroups(s.groups, 150, 48).length > 1,
      `${s.id}: a narrow screen wraps onto multiple lines`);
  }
});

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
