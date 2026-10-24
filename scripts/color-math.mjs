// Color helpers for the generated theme variants: OKLab conversion and the APCA
// lightness contrast (Lc). Negative Lc means light text on a dark background.

const toRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const linear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const gamma = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

export function toOklab(hex) {
	const [r, g, b] = toRgb(hex).map(linear);
	const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
	const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
	const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
	return [
		0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
		1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
		0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
	];
}

export function fromOklab([L, A, B]) {
	const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
	const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
	const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
	const rgb = [
		4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
		-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
		-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
	];
	return '#' + rgb.map((c) => Math.round(Math.min(1, Math.max(0, gamma(c))) * 255).toString(16).padStart(2, '0')).join('');
}

export const chroma = ([, a, b]) => Math.hypot(a, b);

function apcaLuminance(hex) {
	const [r, g, b] = toRgb(hex);
	const y = 0.2126729 * r ** 2.4 + 0.7151522 * g ** 2.4 + 0.072175 * b ** 2.4;
	return y < 0.022 ? y + (0.022 - y) ** 1.414 : y;
}

// APCA 0.0.98G-4g
export function apcaLc(text, background) {
	const yt = apcaLuminance(text);
	const yb = apcaLuminance(background);
	if (Math.abs(yb - yt) < 0.0005) return 0;
	if (yb > yt) {
		const s = (yb ** 0.56 - yt ** 0.57) * 1.14;
		return s < 0.1 ? 0 : (s - 0.027) * 100;
	}
	const s = (yb ** 0.65 - yt ** 0.62) * 1.14;
	return s > -0.1 ? 0 : (s + 0.027) * 100;
}
