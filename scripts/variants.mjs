// Theme variants generated from themes/ziza-color-theme.json (Ziza Dark).
//
// Ziza Dark stays the single source of truth: edit that file, then run
// `npm run build:themes`. Every variant is described here as a color map
// (Ziza Dark hex -> variant hex, alpha suffixes are kept) or a `transform`
// function, plus optional per-key overrides. Colors not listed in a map are
// left unchanged.

import { keepsItalic, mistColor } from './mist.mjs';

// Ziza Midnight: only the backgrounds and surfaces go about 5% darker in
// OKLCH lightness (every color below L 0.40 with low chroma). Text and
// syntax colors are untouched, so they gain a little contrast. Made for
// dark rooms.
const midnightColors = {
	'#171c28': '#0c111b', // Night -> sidebar, panels, status bar
	'#1d2433': '#121826', // Midnight -> editor background
	'#27305e': '#1c234e',
	'#293246': '#1d2638', // surfaces
	'#2b3344': '#1f2736',
	'#2f3b54': '#232e45', // list hover and selection
	'#353f55': '#293246',
	'#364055': '#2a3346', // Edge -> borders and inputs
	'#394365': '#2d3655',
};

export const variants = [
	{
		file: 'ziza-midnight-color-theme.json',
		name: 'ziza-midnight-theme',
		colors: midnightColors,
	},
	{
		file: 'ziza-mist-color-theme.json',
		name: 'ziza-mist-theme',
		transform: mistColor,
		noItalics: true,
		keepsItalic,
	},
];
