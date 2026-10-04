<img width="1640" height="363" alt="richtextgen" src="https://github.com/user-attachments/assets/8e8456fe-a09a-4d1c-be49-393a83806656" />

<div align="center">

**Create styled Roblox Rich Text in your browser.**

Type your text, see it live, copy the output. No install, no Studio, no build step - everything runs locally from three files.

[![Made with vanilla JS](https://img.shields.io/badge/JavaScript-vanilla-f7df1e?labelColor=1b2550)](script.js)
[![No dependencies](https://img.shields.io/badge/dependencies-none-4ade80?labelColor=1b2550)](.)
[![License: MIT](https://img.shields.io/badge/license-MIT-4ade80?labelColor=1b2550)](LICENSE)
[![Roblox Rich Text](https://img.shields.io/badge/Roblox-RichText-9db4ff?labelColor=1b2550)](https://create.roblox.com/docs/ui/rich-text)

[**Open the editor**](https://fisqb.github.io/robloxrichtextgen/) · [Features](#features) · [Quick start](#quick-start) · [Supported tags](#supported-tags) · [Output formats](#output-formats) · [Contributing](#contributing)

</div>

> [!WARNING]
> **This project is still in development.** Expect bugs, rough edges, and changes between versions. Bug reports and fixes are what make it stable - if something breaks, please [open an issue](https://github.com/fisqb/robloxrichtextgen/issues).

```
Input:  Hello World
Output: <font face='SpecialElite'><stroke color='#0a0a1a' th='2' tr='0.25' joins='miter' sizing='scaled'><font color='#00d4ff' size='10'>Hello World</font></stroke></font>
```

## Why Rich Text Gen

<table>
<tr>
<td width="33%" valign="top">

### Live preview

Every character is drawn on a canvas as you type. Select any letters to format them individually - colors, fonts, stroke, mark.

</td>
<td width="33%" valign="top">

### Full Rich Text support

Gradients, rainbow, per-character colors, weight, uppercase, small caps, mark, stroke (with joins and sizing), transparency, and every Roblox font.

</td>
<td width="33%" valign="top">

### No install

Three files, no build step, no dependencies. Open `index.html` in a browser or host it on GitHub Pages.

</td>
</tr>
<tr>
<td valign="top">

### Two output formats

Native Roblox Rich Text and a JSON / Lua string ready to paste.

</td>
<td valign="top">

### Import existing code

Paste any Rich Text and continue editing it as if you had made it here. Both Roblox native tags and Defaultio tags are parsed.

</td>
<td valign="top">

### Presets and auto-save

Save any combination as a preset, or let auto-save keep your current work between visits.

</td>
</tr>
</table>

## Quick start

Open the editor: **[fisqb.github.io/robloxrichtextgen](https://fisqb.github.io/robloxrichtextgen/)**.

Or run it locally - clone the repo and open `index.html` in a browser. The project is three files in the repo root:

| File | Role |
| --- | --- |
| `index.html` | Page structure and controls |
| `script.js` | All logic - editor, canvas, parser, export |
| `style.css` | Styling and theming |

No build step, no server, no dependencies. Just open `index.html`.

```sh
git clone https://github.com/fisqb/robloxrichtextgen.git
cd robloxrichtextgen
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

The interface has two modes:

| Mode | Shows | Use it for |
| --- | --- | --- |
| **Simple** | Text, colors, formatting, stroke, font, mark toggle | Quick styling with no per-character work |
| **Advanced** | Everything Simple has, plus per-character editor, Gradient Points, JSON output, comment wrapper | Full control over every character |

Everything you change is applied live to the canvas preview. Click or tap a character to select it, drag to select a range, hold Ctrl / Cmd to add more.

## Features

- **Solid, Gradient and Rainbow color modes.** Gradient blends horizontally between two colors; Rainbow sweeps the full hue wheel. Choose the number of steps for either.
- **Per-character colors, fonts, weight, size, stroke, transparency, mark and formatting.** Select any characters in the preview and edit them in the character editor that appears below the canvas.
- **Gradient Points (Advanced).** Instead of a linear gradient, place color stops on specific characters. Everything between two stops is interpolated.
- **Font Weight.** Named (Thin, Light, Regular, Medium, SemiBold, Bold, ExtraBold, Heavy) or numeric (100–900).
- **Uppercase and Small Caps.** Apply to the whole text or to specific characters.
- **Mark (Highlight).** Give characters a colored background with its own transparency, independent of the text.
- **Stroke.** Color, thickness, transparency, joins (`round` / `bevel` / `miter`) and sizing (`fixed` / `scaled`).
- **Comment wrapper (Advanced).** Optionally wrap the output in `<!-- ... -->` before, after, or both.
- **Import.** Paste any Rich Text and continue editing it.
- **Presets.** Save, load, rename, delete, import from JSON, export one or all.
- **Auto-save.** Text, colors, gradient points and settings are stored between visits.
- **Twelve languages.** English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, Chinese, Arabic, Hindi.

## Supported tags

The generated output uses Roblox's Rich Text syntax:

| Tag | Attributes | Notes |
| --- | --- | --- |
| `<font>` | `face`, `size`, `weight`, `color`, `transparency` | `thickness` / `transparency` shorten to `th` / `tr` when Short attributes is on |
| `<stroke>` | `color`, `thickness` (`th`), `transparency` (`tr`), `joins`, `sizing` | `joins` accepts `round`, `bevel`, `miter`; `sizing` accepts `fixed`, `scaled` |
| `<mark>` | `color`, `transparency` (`tr`) | Background highlight, independent of the text color |
| `<b>`, `<i>`, `<u>`, `<s>` | - | Bold, italic, underline, strikethrough |
| `<uppercase>` / `<uc>` | - | Uppercase transform |
| `<smallcaps>` / `<sc>` | - | Small caps transform |
| `<br/>` | - | Line break when Line Breaks is on |

Anything you paste that uses these tags is parsed back into the editor.

## Output formats

Switch between formats in Advanced mode using **Output Format**.

### Roblox RichText (native)

The standard Roblox Rich Text that you can drop straight into a `TextLabel`:

```
<font face='SpecialElite'><stroke color='#0a0a1a' th='2' tr='0.25' joins='miter' sizing='scaled'><font color='#00d4ff' size='10'>Hello World</font></stroke></font>
```

### JSON / Lua

For Roblox native output, this panel produces a JSON-safe string ready to paste:

```json
"123456789": "<font face='SpecialElite'>Hello World</font>",
```

## Auto-save and presets

Everything you type, every color, every gradient point and every setting is saved locally in your browser. Refresh the page and it comes back.

Presets store the same data under a named slot. Save as many as you like, export one to share, export all to back up.

## Contributing

Found a bug, or want to fix one? Both are welcome.

- **Report a bug:** open an issue with a small reproduction - the text you typed, the settings you used, and what you expected.
- **Fix a bug:** reproduce it first, fix the cause, then keep the reproduction as an example so it can't come back.
- **Open a pull request:** branch from `main`, keep it to one fix or feature, and say what you tested and on which browser.

The project has no build step, no dependencies, and no test runner. If you can open `index.html` in a browser, you can develop it.

## Credits

Built with nothing but the browser. Thanks to:

| Project | By | What it does here |
| --- | --- | --- |
| [Roblox Rich Text](https://create.roblox.com/docs/ui/rich-text) | Roblox | The syntax this tool generates |
| [Google Fonts](https://fonts.google.com) | Google | Web fallbacks for the Roblox fonts |

## License

MIT. See [LICENSE](LICENSE).
