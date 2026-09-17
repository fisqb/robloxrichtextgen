# Roblox Rich Text Generator

A rich text generator for Roblox. Create styled text with gradients, strokes, per-character colors, and formatting.

## Features

- **Color modes** — Solid, Horizontal Gradient, Rainbow
- **Gradient Points** — place color stops on any character; colors and transparency blend between them
- **Per-character colors** — click any character to give it a custom color and transparency
- **Transparency** — global, per-character, and per-point (merged when the difference is ≤ 0.1)
- **Formatting** — bold, italic, underline, strikethrough
- **Stroke** — adjustable color and width
- **Line breaks** — keep or collapse newlines
- **Fix Colors** — keep spaces out of `<font>` tags for cleaner output
- **All Roblox fonts**
- **Two output formats:**
  - **Roblox RichText (native)** — `<font>`, `<stroke>`, `<b>`, `<i>`, `<u>`, `<s>`, `<br/>`
  - **Defaultio RichText Module** — animated markup for Defaultio's RichText module with `<Color=...>`, `<AnimateStyle=...>`, and more
- **Outputs** — Rich Text, Defaultio Module Text, and JSON snippet
- **Tips panel** — the `?` button in the corner explains everything

## Usage

1. Enter your text
2. Pick a **Mode**, **Color Source**, and **Output Format**
3. (Optional) Click characters to recolor them, or switch to **Gradient Points** to place color stops
4. Copy the generated code

## Note

The preview is approximate and may differ slightly from how the text appears in Roblox due to differences in font rendering between browsers and the Roblox engine. Always verify the final result in-game.

## Link

https://fisqb.github.io/robloxrichtextgen/

---

made by ifisch
