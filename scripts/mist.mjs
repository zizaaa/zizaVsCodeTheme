// Ziza Mist: a softer variant for people who find high contrast tiring, for example
// with astigmatism. It is generated from Ziza Dark with these choices:
//
// - A lighter editor background, so the screen is brighter overall and the pupil
//   stays smaller (a larger pupil adds blur from the eye's own aberrations).
//   Every other dark surface moves by the same OKLab lightness.
// - Text and syntax colors are re-fitted to an APCA lightness contrast target
//   (about Lc 48 to 76), well under the roughly Lc 90 where halation starts, and
//   above the Lc 60 that APCA suggests for content text. Chroma is cut by 15%.
// - No italics, which are harder to read for people with low vision. Markdown
//   emphasis keeps its italic because it carries meaning.
//
// The rules are in code, not in a hex map, because every color is fitted to a
// target on the new background.

import { apcaLc, chroma, fromOklab, toOklab } from './color-math.mjs';

const EDITOR_DARK = '#1d2433';
const EDITOR_MIST = '#30384c';
const CHROMA_KEPT = 0.85;

const HEX = /^#([0-9a-f]{6})([0-9a-f]{2})?$/i;
const lightnessShift = toOklab(EDITOR_MIST)[0] - toOklab(EDITOR_DARK)[0];

// APCA Lc target for each text color of Ziza Dark
const textTargets = {
	'#8695b7': -62, // default text
	'#7083ad': -48, // comments
	'#6679a4': -45, // markdown separators
	'#c3a6ff': -66, // lavender
	'#82aaff': -64, // blue
	'#e78284': -60, // soft red
	'#e5c890': -74, // sand
	'#ef9f76': -65, // peach
	'#a6d189': -71, // sage
	'#99d1db': -72, // cyan
	'#b2ccd6': -72, // steel
};

// Line numbers stay muted; the active line number is as readable as text.
const keyTargets = {
	'editorLineNumber.foreground': -38,
	'editorLineNumber.activeForeground': -62,
};

const isSurface = (lab) => lab[0] < 0.42 && chroma(lab) < 0.08;
const isTextKey = (key) => /foreground|Foreground|ansi|\.fg|Text/.test(key);

function fitToTarget(hex, target) {
	const [, a, b] = toOklab(hex);
	let best = hex;
	let bestError = Infinity;
	for (let lightness = 0.3; lightness <= 0.98; lightness += 0.002) {
		const candidate = fromOklab([lightness, a * CHROMA_KEPT, b * CHROMA_KEPT]);
		const error = Math.abs(apcaLc(candidate, EDITOR_MIST) - target);
		if (error < bestError) {
			bestError = error;
			best = candidate;
		}
	}
	return best;
}

// Other text colors: squeeze Ziza Dark's contrast range toward the middle (Lc 55 to 76)
function fitOtherText(hex) {
	const original = Math.abs(apcaLc(hex, EDITOR_DARK));
	return fitToTarget(hex, -Math.min(76, Math.max(55, 76 - (76 - original) * 0.42)));
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
