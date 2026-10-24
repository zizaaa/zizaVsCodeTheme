// Generates the theme variants in themes/ from themes/ziza-color-theme.json.
// Run with `npm run build:themes`. Never edit the generated files by hand.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { variants } from './variants.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const themesDir = join(root, 'themes');
const source = JSON.parse(readFileSync(join(themesDir, 'ziza-color-theme.json'), 'utf8'));

const HEX = /^#([0-9a-f]{6})([0-9a-f]{2})?$/i;

function mapColor(value, colors) {
	const m = typeof value === 'string' && value.match(HEX);
	if (!m || !colors) return value;
	const mapped = colors[`#${m[1].toLowerCase()}`];
	return mapped ? mapped + (m[2] ?? '').toLowerCase() : value;
}

// A variant recolors with either a hex map (`colors`) or a function (`transform`)
function recolor(variant, value, where) {
	return variant.transform ? variant.transform(value, where) : mapColor(value, variant.colors);
}

const withoutItalic = (fontStyle) => fontStyle.split(/\s+/).filter((part) => part && part !== 'italic').join(' ');

function buildVariant(variant) {
	const theme = structuredClone(source);
	theme.name = variant.name;

	for (const key of Object.keys(theme.colors)) {
		theme.colors[key] = recolor(variant, theme.colors[key], { part: 'colors', key });
	}
	Object.assign(theme.colors, variant.overrides);

	for (const rule of theme.tokenColors) {
		const s = rule.settings;
		if (s.foreground) s.foreground = recolor(variant, s.foreground, { part: 'tokenForeground' });
		if (s.background) s.background = recolor(variant, s.background, { part: 'tokenBackground' });
		if (variant.noItalics && s.fontStyle && !variant.keepsItalic?.(rule)) s.fontStyle = withoutItalic(s.fontStyle);
	}

	for (const [selector, style] of Object.entries(theme.semanticTokenColors ?? {})) {
		if (typeof style === 'string') {
			theme.semanticTokenColors[selector] = recolor(variant, style, { part: 'semantic' });
			continue;
		}
		if (style.foreground) style.foreground = recolor(variant, style.foreground, { part: 'semantic' });
		if (variant.noItalics) {
			delete style.italic;
			if (style.fontStyle) style.fontStyle = withoutItalic(style.fontStyle);
		}
	}

	return theme;
}

for (const variant of variants) {
	const out = join(themesDir, variant.file);
	writeFileSync(out, JSON.stringify(buildVariant(variant), null, '\t') + '\n');
	console.log(`built themes/${variant.file}`);
}
