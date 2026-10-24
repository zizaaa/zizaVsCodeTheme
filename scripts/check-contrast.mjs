// Checks WCAG contrast for every theme in package.json.
// Syntax colors are checked against the editor background, and a list of
// UI text/background pairs against their own backgrounds. Colors with an
// alpha suffix are blended onto the background first, as VS Code draws them.
// Run with `npm run check`. Exits with 1 if anything is below its minimum.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

const MIN_TEXT = 4.5;
const MIN_MUTED = 3.0; // comments, punctuation, line numbers, placeholders

// [foreground key, background key, minimum]
const UI_PAIRS = [
	['editor.foreground', 'editor.background', MIN_TEXT],
	['editorLineNumber.foreground', 'editor.background', MIN_MUTED],
	['editorLineNumber.activeForeground', 'editor.background', MIN_TEXT],
	['sideBar.foreground', 'sideBar.background', MIN_TEXT],
	['sideBarTitle.foreground', 'sideBar.background', MIN_TEXT],
	['list.activeSelectionForeground', 'list.activeSelectionBackground', MIN_TEXT],
	['tab.activeForeground', 'tab.activeBackground', MIN_TEXT],
	['tab.inactiveForeground', 'tab.inactiveBackground', MIN_MUTED],
	['statusBar.foreground', 'statusBar.background', MIN_TEXT],
	['button.foreground', 'button.background', MIN_TEXT],
	['input.foreground', 'input.background', MIN_TEXT],
	['input.placeholderForeground', 'input.background', MIN_MUTED],
	['terminal.foreground', 'terminal.background', MIN_TEXT],
	['terminal.ansiRed', 'terminal.background', MIN_TEXT],
	['terminal.ansiGreen', 'terminal.background', MIN_TEXT],
	['terminal.ansiYellow', 'terminal.background', MIN_TEXT],
	['terminal.ansiBlue', 'terminal.background', MIN_TEXT],
	['terminal.ansiMagenta', 'terminal.background', MIN_TEXT],
	['terminal.ansiCyan', 'terminal.background', MIN_TEXT],
	['editorInlayHint.foreground', 'editor.background', MIN_MUTED],
	['breadcrumb.foreground', 'editor.background', MIN_MUTED],
	['editorHoverWidget.foreground', 'editorHoverWidget.background', MIN_TEXT],
	['editorSuggestWidget.foreground', 'editorSuggestWidget.background', MIN_TEXT],
];

const MUTED_SCOPES = /comment|punctuation|operator|separator|blockquote|fenced/i;

function parse(hex) {
	const m = hex.match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/i);
	if (!m) return null;
	const n = parseInt(m[1], 16);
	return { r: n >> 16, g: (n >> 8) & 255, b: n & 255, a: m[2] ? parseInt(m[2], 16) / 255 : 1 };
}

function blend(fg, bg) {
	return {
		r: fg.r * fg.a + bg.r * (1 - fg.a),
		g: fg.g * fg.a + bg.g * (1 - fg.a),
		b: fg.b * fg.a + bg.b * (1 - fg.a),
		a: 1,
	};
}

function luminance({ r, g, b }) {
	const lin = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
	return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(fgHex, bgHex) {
	const bg = parse(bgHex);
	const fg = blend(parse(fgHex), bg);
	const [lo, hi] = [luminance(fg), luminance(bg)].sort((a, b) => a - b);
	return (hi + 0.05) / (lo + 0.05);
}

let failures = 0;

for (const t of pkg.contributes.themes) {
	const theme = JSON.parse(readFileSync(join(root, t.path), 'utf8'));
	const c = theme.colors;
	const editorBg = c['editor.background'];
	const rows = [];

	for (const [fgKey, bgKey, min] of UI_PAIRS) {
		if (!c[fgKey] || !c[bgKey]) continue;
		const ratio = contrast(c[fgKey], c[bgKey]);
		if (ratio < min) rows.push(`  ${fgKey} on ${bgKey}: ${ratio.toFixed(2)} (min ${min})`);
	}

	const seen = new Set();
	for (const rule of theme.tokenColors) {
		const fg = rule.settings.foreground;
		if (!fg) continue;
		const scopes = [].concat(rule.scope ?? []).join(', ');
		const min = MUTED_SCOPES.test(scopes) || MUTED_SCOPES.test(rule.name ?? '') ? MIN_MUTED : MIN_TEXT;
		const ratio = contrast(fg, editorBg);
		const id = `${fg}|${min}`;
		if (ratio < min && !seen.has(id)) {
			seen.add(id);
			rows.push(`  token "${rule.name ?? scopes}" ${fg}: ${ratio.toFixed(2)} (min ${min})`);
		}
	}

	for (const [sel, style] of Object.entries(theme.semanticTokenColors ?? {})) {
		const fg = typeof style === 'string' ? style : style.foreground;
		if (!fg) continue;
		const ratio = contrast(fg, editorBg);
		if (ratio < MIN_TEXT) rows.push(`  semantic "${sel}" ${fg}: ${ratio.toFixed(2)} (min ${MIN_TEXT})`);
	}

	failures += rows.length;
	console.log(`${rows.length ? '✗' : '✓'} ${t.label}${rows.length ? '' : ': all pairs pass'}`);
	for (const row of rows) console.log(row);
}

process.exit(failures ? 1 : 0);
