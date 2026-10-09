'use strict';
/**
 * Thai Syllable Tone Analyzer & Diacritics Generator
 */
const HIGH = new Set([...'ขฃฉฐถผฝศษสห']);
const MID = new Set([...'กจฎฏดตบปอ']);
const SONOR = new Set([...'งญณนมยรลฬว']);
const MARK = { '\u0E48': 'E', '\u0E49': 'T', '\u0E4A': 'TR', '\u0E4B': 'C' };
const LEAD = new Set(['\u0E40', '\u0E41', '\u0E42', '\u0E43', '\u0E44']);
const isCons = ch => /[\u0E01-\u0E2E]/.test(ch) && ch !== '\u0E24' && ch !== '\u0E26';
const classOf = c => HIGH.has(c) ? 'H' : MID.has(c) ? 'M' : 'L';

function toneOf(cls, live, long, mark) {
    if (live) {
        if (cls === 'H') return { none: 'R', E: 'L', T: 'F' }[mark] || null;
        if (cls === 'M') return { none: 'M', E: 'L', T: 'F', TR: 'H', C: 'R' }[mark] || null;
        return { none: 'M', E: 'F', T: 'H' }[mark] || null;
    }
    if (cls === 'H') return { none: 'L', E: 'L', T: 'F' }[mark] || null;
    if (cls === 'M') return { none: 'L', E: 'L', T: 'F', TR: 'H', C: 'R' }[mark] || null;
    if (!long) return { none: 'H', E: 'F' }[mark] || null;
    return { none: 'F', E: 'H' }[mark] || null;
}

function analyze(syl) {
    const chars = [...syl];
    let mark = 'none';
    for (const ch of chars) if (MARK[ch]) mark = MARK[ch];
    const cons = [];
    chars.forEach((ch, i) => { if (isCons(ch)) cons.push({ ch, i }); });
    if (chars.includes('\u0E24')) {
        return { cls: 'L', final: null, live: false, long: false, mark, tone: mark === 'none' ? 'H' : toneOf('L', false, false, mark), flag: 'vocalic-ru', method: 'rule' };
    }
    if (cons.length === 0) return { error: 'no consonant' };
    let core = cons.slice();
    const vowelAfter = (c) => c.i > 0 && ((c.ch === 'ย' && ['\u0E31', '\u0E35', '\u0E37'].includes(chars[c.i - 1])) || (c.ch === 'ว' && ['\u0E31', '\u0E34', '\u0E35', '\u0E37'].includes(chars[c.i - 1])));
    if (core.length >= 2 && core[core.length - 1].ch === 'อ' && core[core.length - 1].i === chars.length - 1) core.pop();
    if (core.length >= 2 && (core[core.length - 1].ch === 'ย' || core[core.length - 1].ch === 'ว') && vowelAfter(core[core.length - 1]) && core[core.length - 1].i === chars.length - 1) core.pop();
    const first = core[0].ch;
    let cls, onset = 1, flag = '';
    const hasVowelMark = chars.some(ch => /[\u0E30-\u0E3A\u0E40-\u0E44\u0E47\u0E4D]/.test(ch));
    if (hasVowelMark && core.length >= 2 && core[1].i === core[0].i + 1 && ['ร', 'ล', 'ว'].includes(core[1].ch) && first !== 'ห' && first !== 'อ') {
        cls = classOf(first); onset = 2;
    } else if (first === 'ห' && core.length >= 2 && core[1].i === 1 && SONOR.has(core[1].ch)) {
        cls = 'H'; onset = 2;
    } else if (first === 'อ' && core.length >= 2 && core[1].i === 1) {
        cls = 'M'; onset = 2; flag = 'alef-cluster';
    } else cls = classOf(first);
    const rest = core.slice(onset);
    const final = rest.length ? rest[rest.length - 1].ch : null;
    if (chars.includes('\u0E4C')) flag += ' thanthakhat';
    const hasAm = chars.includes('\u0E33');
    const hasLeadLong = chars.some(ch => LEAD.has(ch)) && !chars.includes('\u0E30') && !chars.includes('\u0E47');
    const alefVowel = cons.some(c => c.ch === 'อ' && c.i > 0);
    const longMark = chars.some(ch => ['\u0E32', '\u0E33', '\u0E35', '\u0E37', '\u0E39', '\u0E45', '\u0E44', '\u0E43'].includes(ch));
    const shortMark = chars.some(ch => ['\u0E30', '\u0E31', '\u0E34', '\u0E36', '\u0E38', '\u0E47'].includes(ch));
    let long;
    if (hasAm) long = false;
    else if (longMark) long = true;
    else if (shortMark) long = false;
    else if (alefVowel) long = true;
    else if (hasLeadLong) long = true;
    else long = false;
    let live;
    if (final) {
        live = SONOR.has(final);
    } else {
        live = hasAm ? true : long;
    }
    const t = toneOf(cls, live, long, mark);
    return { cls, final, live, long, mark, tone: t, flag: flag.trim(), method: 'rule' };
}

const DIA = {
    L: '\u0300', // Low tone (Grave)
    F: '\u0302', // Falling tone (Circumflex)
    H: '\u0301', // High tone (Acute)
    R: '\u030C', // Rising tone (Caron)
    M: ''         // Mid tone (none)
};

const COMB = /[\u0300\u0301\u0302\u030C]/g;
const VOW = 'aeiouAEIOUɛəʉɔ';

function applyTone(transliteration, tone) {
    const base = (transliteration || '').normalize('NFD').replace(COMB, '');
    if (!tone || tone === 'M') return base.normalize('NFC');
    const chars = [...base];
    const idx = chars.findIndex(ch => VOW.includes(ch));
    if (idx < 0) return base.normalize('NFC');
    chars[idx] = chars[idx] + (DIA[tone] || '');
    return chars.join('').normalize('NFC');
}

module.exports = {
    analyze,
    applyTone,
    DIA
};
