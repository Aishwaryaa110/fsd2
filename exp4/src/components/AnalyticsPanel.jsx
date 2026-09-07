import React, { useMemo } from "react";

export default React.memo(function AnalyticsPanel({
  events,
  visibleEvents,
  parentRenders,
  memoEnabled,
  callbackEnabled,
  useMemoEnabled,
}) {
  const counts = useMemo(() => {
    return {
      total: events.length,
      visible: visibleEvents.length,
      meetings: events.filter((e) => e.type === "Meeting").length,
      focus: events.filter((e) => e.type === "Focus").length,
      deadlines: events.filter((e) => e.type === "Deadline").length,
      personal: events.filter((e) => e.type === "Personal").length,
    };
  }, [events, visibleEvents]);

  return (
    <section className="analytics-panel">
      <div className="panel-title-row">
        <div>
          <p className="eyebrow light">PERFORMANCE ANALYSIS</p>
          <h2>React Render Analytics</h2>
        </div>
        <span className="status-badge">● LIVE</span>
      </div>

      <div className="analytics-grid">
        <div className="stat-box">
          <span>Parent renders</span>
          <strong>{parentRenders}</strong>
        </div>
        <div className="stat-box">
          <span>Visible cards</span>
          <strong>{counts.visible}</strong>
        </div>
        <div className="stat-box">
          <span>Events stored</span>
          <strong>{counts.total}</strong>
        </div>
        <div className="stat-box">
          <span>Meetings</span>
          <strong>{counts.meetings}</strong>
        </div>
      </div>

      <div className="optimization-state">
        <span className={memoEnabled ? "on" : ""}>React.memo {memoEnabled ? "ON" : "OFF"}</span>
        <span className={callbackEnabled ? "on" : ""}>useCallback {callbackEnabled ? "ON" : "OFF"}</span>
        <span className={useMemoEnabled ? "on" : ""}>useMemo {useMemoEnabled ? "ON" : "OFF"}</span>
      </div>

      <div className="category-bars">
        {[
          ["Meeting", counts.meetings],
          ["Focus", counts.focus],
          ["Deadline", counts.deadlines],
          ["Personal", counts.personal],
        ].map(([name, value]) => (
          <div className="bar-row" key={name}>
            <span>{name}</span>
            <div className="bar-track">
              <div style={{ width: `${Math.min(value * 22, 100)}%` }} />
            </div>
            <b>{value}</b>
          </div>
        ))}
      </div>

      <p className="analytics-note">
        Use the browser console or React DevTools Profiler to observe component rendering.
      </p>
    </section>
  );
});