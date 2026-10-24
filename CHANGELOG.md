# Change Log

All notable changes to the "Ziza Dark Theme" extension are documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/).

## [Unreleased]

### Changed
- Ziza Dark: line numbers and input placeholder text are slightly brighter, so they reach a 3:1 contrast ratio.

### Added
- Ziza Midnight: a darker version of Ziza Dark for dark rooms. Press Ctrl+K, then Ctrl+T and choose Ziza Midnight.
- Ziza Mist: a softer version of Ziza Dark with a slightly lighter background, softer colors, moderate contrast, and no italics, for less glare. Press Ctrl+K, then Ctrl+T and choose Ziza Mist.

## [0.1.0] - 2026-10-23

### Added
- New original extension icon (a crescent moon in the theme's lavender and blue).
- MIT license.
- Marketplace gallery banner, homepage and bug tracker links.

### Changed
- Display name is now "Ziza Dark Theme" and the theme is listed as "Ziza Dark". Existing users keep their saved theme.
- Syntax accent colors were unified into one soft palette: lavender, blue, soft red, sand, peach, sage and cyan.
- Error colors are softer, and the diff editor backgrounds are less heavy.
- Updated description and keywords.

### Added
- Colors for the terminal (all 16 ANSI colors), bracket pair colorization, git decorations, indent guides, sticky scroll, inlay hints, ghost text, quick input, keybinding labels, checkboxes, the command center, merge conflicts, debug and test icons, outline icons, and notebooks. These used VS Code defaults before.
- Semantic highlighting is on for types, functions, methods, and decorators, so type parameters and type references (`T`, `User` in `extends User`) get the same sand as class names. Everything else keeps its TextMate color.
- Decorators (`@dataclass`, `@Injectable`) are now blue and italic.
- Config files: YAML and TOML keys are blue, and INI and TOML section titles are sand.
- CSS pseudo classes and elements are cyan, and CSS ids are blue.

### Fixed
- Comments are easier to read (contrast raised from 2:1 to 4:1).
- The progress bar, notification links, scrollbars, line numbers, breadcrumbs, and peek view descriptions were nearly invisible.
- The current find match could not be told apart from other highlights.
- Input placeholders looked the same as typed text, and primary buttons looked disabled.
- Function declarations are now blue like function calls. They were sand before.
- Keywords in SQL, Rust, and other languages are lavender like the rest, not peach.
- Scopes that only matched `.js` and `.jsx` now match every language that uses them, such as TypeScript.
- `editorUnnecessaryCode.opacity` used an invalid value.
- Markdown fenced-code markers were nearly invisible.
- Removed duplicate and invalid token rules, including a heading selector that never matched.
- A Markdown-only color rule no longer leaks into other languages.

## [0.0.5]

- Earlier releases.
