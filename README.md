# Roblox Rich Text Editor / Generator

<img width="555" height="222" alt="image" src="https://github.com/user-attachments/assets/968fe27f-11f0-4509-abd9-5e6db6cf4d2b" />

A rich text editor (generator) for Roblox. Create styled text with gradients, strokes, per-character colors, and formatting.

## Features

- **Color modes** — Solid, Horizontal Gradient, Rainbow
- **Gradient Points** — place color stops on any character; colors and transparency blend between them
- **Per-character colors** — click any character to give it a custom color, transparency, font, stroke, and formatting
- **Transparency** — global, per-character, and per-point
- **RGB Colors** — output colors as `rgb(r, g, b)` instead of `#rrggbb`
- **Formatting** — bold, italic, underline, strikethrough (global or per-character)
- **Stroke** — adjustable color and width (global or per-character)
- **Line breaks** — keep or collapse newlines
- **All Roblox fonts** — previewed with best-effort web analogs
- **Interactive preview** — rendered on `<canvas>` for smooth per-character styling
  - **Selection** — click, drag, `Shift+Click` to extend, `Ctrl+Click` to add; arrow keys to move, `Escape` to clear
  - **Touch selection** on mobile
  - **Expanded view** — click ⛶ for a large preview with zoom (slider + mouse wheel) and pan (drag empty space; double-click to reset)
- **Presets** — save, load, rename, and delete your own presets
- **Auto-save** — your current text, colors, gradient points, and settings are saved automatically between visits
- **Languages** — 12 supported languages
- **Themes** — Dark (default) and Light
- **UI modes** — Simple (default) and Advanced (all features)
- **Tips panel** — the `?` button explains everything

## What's new

- Preview is now rendered on `<canvas>` — smoother on long texts and per-character styling.
- Real stroke rendering (miter join), closer to how Roblox draws outlined text.
- Custom text selection: click, drag, `Shift+Click`, `Ctrl+Click`, arrows, `Escape`, and touch.
- User text is escaped in the output — `<`, `>`, `&`, `"`, `'` become `&lt;`, `&gt;`, `&amp;`, `&quot;`, `&apos;`. Tags written as text are no longer interpreted by Roblox.
- Per-character colors, strokes, fonts, transparency, and formatting are correctly emitted to the output.
- Text edits in the middle of the string no longer misalign per-character formatting.
- Switching Color Source no longer deletes your data silently — a confirmation is shown.
- Invalid transparency input is rejected before any formatting is applied.
- `<` and `>` characters skipped in Defaultio output now trigger a visible warning.

## Usage

1. Enter your text
2. Pick a **Mode**, **Color Source**, and **Output Format**
3. (Optional) Click characters to recolor them, or switch to **Gradient Points** to place color stops
4. Copy the generated code

## Note

The preview is approximate and may differ slightly from how the text appears in Roblox due to differences in font rendering between browsers and the Roblox engine. We're constantly working to improve the preview and make it as close as possible to the real in-game result. Always verify the final output in-game.

## Link

https://fisqb.github.io/robloxrichtextgen/

---

made by ifisch
