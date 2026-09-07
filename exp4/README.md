# Experiment 4 — Interactive Calendar Optimization

A ready-to-run React + Vite practical project demonstrating:

- Interactive weekly calendar
- Event-to-day/time-slot mapping
- Native drag-and-drop rescheduling
- Add and delete events
- Search and category filtering
- `React.memo`
- `useMemo`
- `useCallback`
- Lazy-load-ready analytics component
- Render activity monitor
- React DevTools/browser-console profiling workflow

## Run in VS Code

1. Open this folder in VS Code.
2. Open Terminal.
3. Run:

```bash
npm install
npm run dev
```

4. Open the localhost URL printed by Vite.

## Demo checklist

1. Drag `Design Review` to another day/time.
2. Click `+ New Event` and add an event.
3. Search for an event.
4. Filter by Meeting, Focus, Deadline, or Personal.
5. Open Analytics.
6. Toggle React.memo, useCallback, and useMemo.
7. Open browser DevTools → Console and observe `[EventCard] rendered: ...`.
8. For formal profiling, use React DevTools Profiler.

## Main files

- `src/App.jsx` — state, calendar logic, drag/drop, filtering, optimization controls
- `src/components/EventCard.jsx` — event card and `React.memo`
- `src/components/AnalyticsPanel.jsx` — memoized analytics and `useMemo`
- `src/components/Toggle.jsx` — optimization switches
- `src/index.css` — complete interface styling
- `src/main.jsx` — React entry point

Note: this demo intentionally uses local React state rather than a real backend/database.
