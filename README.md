# mechproz // portfolio

My portfolio, except it's a **Windows-98 desktop**. Beveled gray windows you can
drag, minimize, maximize and close; a Start menu that works; a taskbar with a
button per window; desktop icons you double-click; PC-speaker beeps; a "Shut
Down" easter egg; and one hidden achievement.

Live at [mechproz.github.io](https://mechproz.github.io/).

I built it with React + Vite and it deploys itself to GitHub Pages on every
push. The 🖥️ button in the taskbar tray flips the wallpaper between the dark
old-web look and the classic Win98 teal.

I took the old-web feel from [lilithdev.neocities.org](https://lilithdev.neocities.org/)
and the content from my own [neocities page](https://mechproz.neocities.org/).

## What it's built with

| Layer | Choice | Notes |
|-------|--------|-------|
| **UI** | React 18 | function components and hooks only, wrapped in `StrictMode` |
| **Build** | Vite 5 | HMR while I'm working, Rollup + esbuild for the bundle |
| | `@vitejs/plugin-react` | Fast Refresh and the automatic JSX runtime, so no `import React` |
| **Language** | JavaScript (ES2020+) + JSX | ES modules, no TypeScript |
| **Styling** | plain CSS (`src/styles.css`) | no Tailwind, no UI kit. The Win98 chrome is four-tone bevels done with inset `box-shadow` |
| | CSS custom properties | `--desk` for the wallpaper, `--fs` for the rem-based text scale behind the A−/A+ buttons |
| | media queries | works down to phones (`620px` and `380px` breakpoints) |
| **Fonts** | Silkscreen, VT323 | pixel and terminal accents; Tahoma/system stack for the OS text |
| **Deploy** | GitHub Pages via Actions | `npm ci` → `vite build` → `upload-pages-artifact` → `deploy-pages` |

**I wrote all the interactive parts myself — there are no third-party runtime libraries:**
- **Window manager** (`App.jsx`) — open/close/minimize/maximize, focus and z-order, all in React state.
- **Dragging** (`Window.jsx`) — my own pointer-events handler, so mouse *and* touch work. No drag library.
- **Start menu, taskbar, desktop icons** — plain components driven by the `META` / `APP_TYPES` config.
- **Sound** (`useSound.js`) — square-wave beeps synthesised with WebAudio, so there are no audio files.
- **Persistence** — `localStorage` remembers your wallpaper and text size.
- **Live clock**, an **achievement** toast, and the **Shut Down** easter egg.
- **Art window** — pulls my drawings in as live Bluesky embeds (`BLUESKY_POSTS` in `content.jsx`), and falls back to a plain link if the embed script is blocked.

**Runtime dependencies:** just `react` and `react-dom`. Vite and the React plugin are dev-only.
The only two things the browser fetches from elsewhere are Google Fonts and the Bluesky
embed, and the site still works if either one fails.

## Layout
```
index.html            # Vite entry
vite.config.js        # base: "./" so it works at any Pages URL
src/
  main.jsx            # React root
  App.jsx             # window manager: state, focus/z-order, achievements
  content.jsx         # every bit of window text + metadata (edit here)
  styles.css          # the Win98 look
  useSound.js         # WebAudio beeps
  components/
    Window.jsx        # one draggable window (title bar + body)
    Taskbar.jsx       # Start button + window buttons + tray
    StartMenu.jsx     # Start menu
    DesktopIcons.jsx  # desktop icons
public/.nojekyll      # ends up in dist/ so Pages serves the files as-is
.github/workflows/deploy.yml  # build + deploy
```

## Running it
```bash
npm install
npm run dev       # http://localhost:5173
```
To check the real bundle:
```bash
npm run build     # outputs to dist/
npm run preview
```

## Deploying
It deploys itself. Every push to `main` runs `.github/workflows/deploy.yml`,
which builds the site and publishes it to GitHub Pages.

The one-time setup, in case I ever do this again: **Settings → Pages → Build and
deployment → Source = GitHub Actions**. Because `base` is `"./"`, the same build
works from the domain root or from a `/<repo>/` subpath, so I don't have to
touch the config if the repo gets renamed.

## Changing the content
Nearly all of it is in **`src/content.jsx`**:
- **Projects** — the `projects` entry uses a `<Project>` helper. Copy a line and
  set `title`, `year`, `desc`, `tags`, `href`, and `wip` if it isn't finished yet.
- **About / Skills / Achievements / Contact** — just edit the JSX.
- **Art** — add entries to `BLUESKY_POSTS` (grab a post's `at://` URI and cid
  from "Embed post" on bsky.app).
- **Which windows exist** — `META` (icon + title) and `APP_TYPES` (order, and
  which icons and Start items show up), both at the top of the file.
- **Colors** — `--desk` (dark) and the `body.theme-teal` override, plus the
  `--title` gradient, at the top of `src/styles.css`.

## Note to self
`npm audit` flags advisories in Vite's dev server (esbuild). Those are dev-server
only and don't touch the static files that get deployed, so I'm ignoring them here.
