# Paseo auto theme

Automatically switch between light and dark palettes with your device's appearance. Runs entirely in the Paseo client, independently of the daemon machine's appearance.

## Install

Requires Paseo 0.12.0 or later on both the daemon and the client, with plugins enabled.

```sh
paseo plugin install github:yboyer/paseo-auto-theme
```

In **Settings → Appearance → Theme**, select one of these automatic variants:

| Theme                                      | Light mode           | Dark mode              |
| ------------------------------------------ | -------------------- | ---------------------- |
| Auto · Light / Ghostty                     | Paseo Light          | Paseo Ghostty          |
| Auto · GitHub Light Default / One Dark Pro | GitHub Light Default | One Dark Pro (default) |

Keep the chosen variant selected rather than Paseo's built-in **Auto** option. Subsequent system appearance changes replace its palette automatically. The plugin does not select Paseo's built-in themes or alter their settings. Choosing another theme stops displaying this plugin's palette; disabling the plugin restores Paseo's fallback theme.

## Compatibility

- Browser and desktop clients follow `prefers-color-scheme`.
- iOS and Android use React Native's appearance notifications and refresh when the app returns to the foreground. An appearance override imposed by the host app can take precedence over the OS preference.
- If no preference is available, Light is used.

The palettes are adapted from Paseo's Light and Ghostty themes, [GitHub Light Default](https://github.com/primer/github-vscode-theme), and [One Dark Pro](https://github.com/Binaryify/OneDark-Pro). The plugin API exposes fewer color tokens than the original themes, so sidebar, terminal, status, and accent details may differ. It does not discover or switch to arbitrary installed themes. Code syntax highlighting remains controlled separately by Paseo's **Highlight theme** setting; these variants adapt the interface palettes only.

Section headings use the original themes' muted text colors. Paseo shares the plugin's `ring` token between these headings, focus rings, terminal bright black, and the highest surface tint, so those details cannot all match the originals simultaneously. For dark plugin themes, Paseo also forces the sidebar to share the main background; Ghostty's darker sidebar cannot be reproduced through the current public theme API.

## Development

Use Node.js 22.18+, 24.11+, or 26+. Vite+ is pinned to **1.4.0**.

```sh
npm ci
npm run check
npm run typecheck
npm test
```

Paseo compiles the TypeScript source itself; no production build or runtime dependency installation is required.

For a local installation:

```sh
paseo plugin install /absolute/path/to/paseo-auto-theme
paseo plugin reload paseo-auto-theme
```

Automated tests cover startup in both modes, light/dark transitions, stable theme IDs, repeated events, cleanup/reload, missing preferences, and native foreground synchronization. Device-level checks are still needed to verify the appearance behavior of each Paseo client release.

## License

Apache-2.0. Palette attribution is in [NOTICE](NOTICE).
