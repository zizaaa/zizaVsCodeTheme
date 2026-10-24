<p align="center">
  <img src="imgs/icon.png" alt="Ziza Dark Theme logo" width="96" height="96">
</p>

<h1 align="center">Ziza Dark Theme</h1>

<p align="center">
  A minimal dark blue theme for VS Code with soft pastel syntax colors.
</p>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=ziza.ziza-dark-theme"><img alt="Marketplace version" src="https://img.shields.io/visual-studio-marketplace/v/ziza.ziza-dark-theme?label=Marketplace&color=c3a6ff&labelColor=1d2433"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=ziza.ziza-dark-theme"><img alt="Installs" src="https://img.shields.io/visual-studio-marketplace/i/ziza.ziza-dark-theme?color=82aaff&labelColor=1d2433"></a>
</p>

![Ziza Dark Theme preview](imgs/preview.png)

Want to see your own code? Try the live preview at **[zizadarktheme.weteon.com](https://zizadarktheme.weteon.com)**.

## Install

1. Open the Extensions panel in VS Code (`Ctrl+Shift+X`).
2. Search for **Ziza Dark Theme** and click **Install**.
3. Press `Ctrl+K`, then `Ctrl+T` (`Cmd+K`, then `Cmd+T` on Mac) and choose **Ziza Dark**.

Or paste this into Quick Open (`Ctrl+P`):

```
ext install ziza.ziza-dark-theme
```

Requires VS Code 1.85 or newer.

## Themes

| Theme | For |
|---|---|
| **Ziza Dark** | The original deep blue. |
| **Ziza Midnight** | Darker backgrounds and a little more contrast, for dark rooms. Same syntax colors. |

## What you get

- A deep blue workspace where the sidebar, tabs, panels, status bar, and terminal share one set of blues.
- Seven soft syntax accents that stay distinct without being loud.
- No pure red and no harsh white, so it stays comfortable late at night.
- Matching colors for the terminal, bracket pairs, git decorations, merge conflicts, and the debug and test icons.

## Palette

| | Color | Hex | Used for |
|---|---|---|---|
| ![](https://img.shields.io/badge/-c3a6ff-c3a6ff?style=flat-square) | Lavender | `#c3a6ff` | Keywords |
| ![](https://img.shields.io/badge/-82aaff-82aaff?style=flat-square) | Blue | `#82aaff` | Functions, decorators |
| ![](https://img.shields.io/badge/-e78284-e78284?style=flat-square) | Soft red | `#e78284` | Variables, tags |
| ![](https://img.shields.io/badge/-e5c890-e5c890?style=flat-square) | Sand | `#e5c890` | Classes, types, operators |
| ![](https://img.shields.io/badge/-ef9f76-ef9f76?style=flat-square) | Peach | `#ef9f76` | Numbers, constants, parameters |
| ![](https://img.shields.io/badge/-a6d189-a6d189?style=flat-square) | Sage | `#a6d189` | Strings |
| ![](https://img.shields.io/badge/-99d1db-99d1db?style=flat-square) | Cyan | `#99d1db` | Regex, escapes |
| ![](https://img.shields.io/badge/-1d2433-1d2433?style=flat-square) | Midnight | `#1d2433` | Editor background |
| ![](https://img.shields.io/badge/-171c28-171c28?style=flat-square) | Night | `#171c28` | Sidebar, panels, status bar |

## Feedback

Found a language or UI element that looks off? [Open an issue](https://github.com/zizaaa/zizaVsCodeTheme/issues) with the language and a short code sample.

## Develop

1. Open this repository in VS Code and press `F5` to start an Extension Development Host.
2. In that window, choose **Ziza Dark** and open the `samples/` folder, which has a test file for several languages.
3. Edit `themes/ziza-color-theme.json`. Saved changes apply live. Then run `npm run build:themes` to regenerate Ziza Midnight and `npm run check` to check contrast. Never edit the generated `ziza-midnight-color-theme.json` by hand. Use **Developer: Inspect Editor Tokens and Scopes** to find the scope of a token.

## License

[MIT](LICENSE)
