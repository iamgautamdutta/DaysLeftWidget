# Days Left Widget

A transparent desktop widget for Windows (Electron) that shows how many days are left in the current year, the month grid, and the current month's day grid — all overlaid directly on your wallpaper.

## Run

```bash
npm install
npm start
```

## Features

- Fully transparent, frameless window — your wallpaper stays visible behind the cards.
- Drag the widget anywhere on screen; the position is remembered between launches.
- Right-click for a context menu: toggle "Start with Windows" or quit.
- Three dark iOS-style rounded cards:
  1. **Year grid** — 35-column dot grid, one dot per day of the year. Elapsed days are dim grey, remaining days are white. Shows the year and "N days left".
  2. **Month labels** — JAN–DEC in a 3×4 grid. Current and future months are white, past months are dim.
  3. **Current month grid** — 7-column dot grid for the days of the current month. Shows the month name and "N days left".
- Re-renders every 60 seconds so it updates automatically at midnight.
- No network calls, no external libraries or fonts.

## Notes

- Requires [Node.js](https://nodejs.org/) and Electron (`npm install` will pull it in).
- Windows is the target platform. The "Start with Windows" option uses `app.setLoginItemSettings`.
