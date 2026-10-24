// Ziza Mist: a softer variant for people who find high contrast tiring, for example
// with astigmatism. It is generated from Ziza Dark with these choices:
//
// - A slightly lighter editor background (#252d3f). Every other dark surface moves
//   by the same OKLab lightness. The shift is small on purpose: research only
//   supports avoiding extremes, not any particular lightness for a dark background.
// - Text and syntax colors are re-fitted to an APCA lightness contrast target
//   (about Lc 53 to 80). That is above the Lc 60 APCA minimum for content text and
//   below the roughly Lc 90 where halation starts. Chroma is cut by only 5% so the
//   syntax colors stay easy to tell apart.
// - The default text is nearly neutral (45% of its chroma kept), because saturated
//   blue text is harder for the eye to focus on a dark background.
// - No italics, which are harder to read for people with low vision. Markdown
//   emphasis keeps its italic because it carries meaning.
//
// The rules are in code, not in a hex map, because every color is fitted to a
// target on the new background.

import { apcaLc, chroma, fromOklab, toOklab } from './color-math.mjs';

const EDITOR_DARK = '#1d2433';
const EDITOR_MIST = '#252d3f';
const CHROMA_KEPT = 0.95;
const DEFAULT_TEXT_CHROMA_KEPT = 0.45;
const DEFAULT_TEXT = '#8695b7';

const HEX = /^#([0-9a-f]{6})([0-9a-f]{2})?$/i;
const lightnessShift = toOklab(EDITOR_MIST)[0] - toOklab(EDITOR_DARK)[0];

// APCA Lc target for each text color of Ziza Dark
const textTargets = {
	'#8695b7': -70, // default text
	'#7083ad': -56, // comments
	'#6679a4': -53, // markdown separators
	'#c3a6ff': -74, // lavender
	'#82aaff': -72, // blue
	'#e78284': -68, // soft red
	'#e5c890': -78, // sand
	'#ef9f76': -73, // peach
	'#a6d189': -78, // sage
	'#99d1db': -78, // cyan
	'#b2ccd6': -78, // steel
};

// Line numbers stay muted; the active line number is as readable as text.
const keyTargets = {
	'editorLineNumber.foreground': -38,
	'editorLineNumber.activeForeground': -62,
};

const isSurface = (lab) => lab[0] < 0.42 && chroma(lab) < 0.08;
const isTextKey = (key) => /foreground|Foreground|ansi|\.fg|Text/.test(key);

function fitToTarget(hex, target, chromaKept = CHROMA_KEPT) {
	const [, a, b] = toOklab(hex);
	let best = hex;
	let bestError = Infinity;
	for (let lightness = 0.3; lightness <= 0.99; lightness += 0.002) {
		const candidate = fromOklab([lightness, a * chromaKept, b * chromaKept]);
		const error = Math.abs(apcaLc(candidate, EDITOR_MIST) - target);
		if (error < bestError) {
			bestError = error;
			best = candidate;
		}
	}
	return best;
}

// Other text colors: squeeze Ziza Dark's contrast range toward the middle (Lc 59 to 80)
function fitOtherText(hex) {
	const original = Math.abs(apcaLc(hex, EDITOR_DARK));
	return fitToTarget(hex, -Math.min(76, Math.max(55, 76 - (76 - original) * 0.42)) - 4);
}

const cache = new Map();

function recolor(value, isText, key) {
	const base = `#${value.slice(1, 7).toLowerCase()}`;
	const cacheKey = `${base}|${isText}|${key}`;
	if (!cache.has(cacheKey)) {
		const lab = toOklab(base);
		let result = base;
		if (keyTargets[key]) result = fitToTarget(base, keyTargets[key]);
		else if (isSurface(lab)) result = fromOklab([lab[0] + lightnessShift, lab[1], lab[2]]);
		else if (isText && base === DEFAULT_TEXT) result = fitToTarget(base, textTargets[base], DEFAULT_TEXT_CHROMA_KEPT);
		else if (isText && textTargets[base]) result = fitToTarget(base, textTargets[base]);
		else if (isText && lab[0] >= 0.42) result = fitOtherText(base);
		cache.set(cacheKey, result);
	}
	return cache.get(cacheKey);
}

// Called by build-themes.mjs for every color. `where` is { part, key }, where part is
// 'colors', 'tokenForeground', 'tokenBackground', or 'semantic'.
export function mistColor(value, where) {
	const match = typeof value === 'string' && value.match(HEX);
	if (!match) return value;
	if (where.part === 'colors' && where.key === 'editor.background') return EDITOR_MIST;
	const isText = where.part === 'colors' ? isTextKey(where.key) : where.part !== 'tokenBackground';
	const alpha = keyTargets[where.key] ? '' : (match[2] ?? '').toLowerCase();
	return recolor(value, isText, where.key) + alpha;
}

// Markdown emphasis is content, not decoration, so it keeps its italic.
export const keepsItalic = (rule) => [].concat(rule.scope ?? []).some((scope) => /markup\.italic/.test(scope));
