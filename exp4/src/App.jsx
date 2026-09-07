import React, { useCallback, useEffect, useMemo, useState } from "react";
import { EventCardBase, MemoEventCard } from "./components/EventCard";
import Toggle from "./components/Toggle";
import AnalyticsPanel from "./components/AnalyticsPanel";

const DAYS = [
  { key: "mon", short: "MON", number: "17", name: "Monday" },
  { key: "tue", short: "TUE", number: "18", name: "Tuesday" },
  { key: "wed", short: "WED", number: "19", name: "Wednesday" },
  { key: "thu", short: "THU", number: "20", name: "Thursday" },
  { key: "fri", short: "FRI", number: "21", name: "Friday" },
  { key: "sat", short: "SAT", number: "22", name: "Saturday" },
  { key: "sun", short: "SUN", number: "23", name: "Sunday" },
];

const HOURS = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
];

const INITIAL_EVENTS = [
  { id: 1, title: "Design Review", day: "mon", time: "10:00", type: "Meeting", description: "Review dashboard design" },
  { id: 2, title: "Ship v2.3", day: "mon", time: "16:00", type: "Deadline", description: "Production deployment" },
  { id: 3, title: "1:1 with Sam", day: "tue", time: "09:00", type: "Meeting", description: "Weekly catch-up" },
  { id: 4, title: "Write Proposal", day: "wed", time: "13:00", type: "Focus", description: "Research proposal" },
  { id: 5, title: "Sprint Planning", day: "thu", time: "11:00", type: "Meeting", description: "Plan next sprint" },
  { id: 6, title: "Client Demo", day: "fri", time: "15:00", type: "Meeting", description: "Product demonstration" },
  { id: 7, title: "Grocery Run", day: "sat", time: "10:00", type: "Personal", description: "Weekly groceries" },
  { id: 8, title: "Portfolio Review", day: "sun", time: "18:00", type: "Focus", description: "Update portfolio" },
];

function App() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [draggedId, setDraggedId] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const [memoEnabled, setMemoEnabled] = useState(true);
  const [callbackEnabled, setCallbackEnabled] = useState(true);
  const [useMemoEnabled, setUseMemoEnabled] = useState(true);

  const [parentRenders, setParentRenders] = useState(0);

  const [form, setForm] = useState({
    title: "",
    day: "mon",
    time: "09:00",
    type: "Meeting",
  });

  useEffect(() => {
    setParentRenders((n) => n + 1);
  }, [events, search, category]);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return events.filter((event) => {
      const matchesText =
        !query ||
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query);

      const matchesCategory =
        category === "All" || event.type === category;

      return matchesText && matchesCategory;
    });
  }, [events, search, category, useMemoEnabled]);

  const eventsBySlot = useMemo(() => {
    const map = {};
    filteredEvents.forEach((event) => {
      const key = `${event.day}-${event.time}`;
      if (!map[key]) map[key] = [];
      map[key].push(event);
    });
    return map;
  }, [filteredEvents, useMemoEnabled]);

  const startDrag = useCallback((id) => {
    setDraggedId(id);
  }, []);

  const moveEvent = useCallback((day, time) => {
    if (draggedId == null) return;
    setEvents((current) =>
      current.map((event) =>
        event.id === draggedId ? { ...event, day, time } : event
      )
    );
    setDraggedId(null);
  }, [draggedId]);

  const deleteEvent = useCallback((id) => {
    setEvents((current) => current.filter((event) => event.id !== id));
  }, []);

  const addEvent = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    setEvents((current) => [
      ...current,
      {
        id: Date.now(),
        title: form.title.trim(),
        day: form.day,
        time: form.time,
        type: form.type,
        description: "Created from Quick Add",
      },
    ]);

    setForm({ title: "", day: "mon", time: "09:00", type: "Meeting" });
    setShowAdd(false);
  };

  const reset = () => {
    setEvents(INITIAL_EVENTS);
    setSearch("");
    setCategory("All");
    setDraggedId(null);
    setParentRenders(0);
  };

  const Card = memoEnabled ? MemoEventCard : EventCardBase;

  const categoryCounts = useMemo(() => {
    return ["All", "Meeting", "Deadline", "Focus", "Personal"].reduce(
      (acc, item) => {
        acc[item] =
          item === "All"
            ? events.length
            : events.filter((event) => event.type === item).length;
        return acc;
      },
      {}
    );
  }, [events]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">FC</div>
          <div>
            <h1>FlowCal</h1>
            <span>React Performance Lab</span>
          </div>
        </div>

        <div className="live-label">
          <i />
          EXPERIMENT 4 · LIVE DEMO
        </div>

        <div className="top-actions">
          <label className="search-box">
            <span>⌕</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
            />
          </label>
          <button className="analytics-btn" onClick={() => setShowAnalytics((v) => !v)}>
            ◈ Analytics
          </button>
          <div className="avatar">A</div>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <button className="new-btn" onClick={() => setShowAdd((v) => !v)}>
            <span>＋</span> New Event
          </button>

          <div className="side-section">
            <p>CALENDAR</p>
            <button className="side-link active">▦ <span>Week View</span></button>
            <button className="side-link">◷ <span>Schedule</span></button>
            <button className="side-link">✓ <span>Completed</span></button>
          </div>

          <div className="side-section">
            <p>FILTER EVENTS</p>
            {["All", "Meeting", "Deadline", "Focus", "Personal"].map((item) => (
              <button
                key={item}
                className={`filter-link ${category === item ? "selected" : ""}`}
                onClick={() => setCategory(item)}
              >
                <i className={`dot ${item.toLowerCase()}`} />
                <span>{item}</span>
                <b>{categoryCounts[item]}</b>
              </button>
            ))}
          </div>

          <div className="side-section">
            <p>WEEK SUMMARY</p>
            <div className="summary">
              <div><span>Total</span><strong>{events.length}</strong></div>
              <div><span>Meetings</span><strong>{categoryCounts.Meeting}</strong></div>
              <div><span>Focus</span><strong>{categoryCounts.Focus}</strong></div>
            </div>
          </div>

          <div className="side-tip">
            <strong>Tip</strong>
            <p>Drag any event card to another time slot to reschedule it.</p>
          </div>
        </aside>

        <main className="content">
          <div className="content-heading">
            <div>
              <p className="eyebrow">INTERACTIVE SCHEDULING</p>
              <h2>Weekly Calendar</h2>
              <p className="subtext">
                Reschedule events with drag & drop and observe React optimization live.
              </p>
            </div>
            <div className="week-control">
              <button>‹</button>
              <div><strong>August 17–23, 2026</strong><small>Week 34</small></div>
              <button>›</button>
            </div>
          </div>

          <section className="optimization-card">
            <div className="optimization-heading">
              <div className="bolt">ϟ</div>
              <div>
                <strong>Rendering Optimization</strong>
                <span>Switch techniques on/off to compare rendering behavior.</span>
              </div>
            </div>

            <div className="toggle-row">
              <Toggle
                label="React.memo"
                description="Memoized cards"
                enabled={memoEnabled}
                onChange={setMemoEnabled}
              />
              <Toggle
                label="useCallback"
                description="Stable handlers"
                enabled={callbackEnabled}
                onChange={setCallbackEnabled}
              />
              <Toggle
                label="useMemo"
                description="Cached calculations"
                enabled={useMemoEnabled}
                onChange={setUseMemoEnabled}
              />
              <button className="reset-small" onClick={reset}>↻ Reset</button>
            </div>
          </section>

          {showAnalytics && (
            <AnalyticsPanel
              events={events}
              visibleEvents={filteredEvents}
              parentRenders={parentRenders}
              memoEnabled={memoEnabled}
              callbackEnabled={callbackEnabled}
              useMemoEnabled={useMemoEnabled}
            />
          )}

          <section className="calendar-card">
            <div className="calendar-top">
              <div className="calendar-name">
                <div className="calendar-symbol">▦</div>
                <div><strong>Week Schedule</strong><span>08:00 — 18:00</span></div>
              </div>
              <div className="legend">
                {["Meeting", "Deadline", "Focus", "Personal"].map((x) => (
                  <span key={x}><i className={`dot ${x.toLowerCase()}`} />{x}</span>
                ))}
              </div>
            </div>

            <div className="calendar-scroll">
              <div className="day-head">
                <div className="time-corner" />
                {DAYS.map((day) => (
                  <div className={`day-head-cell ${day.key === "wed" ? "today" : ""}`} key={day.key}>
                    <span>{day.short}</span><strong>{day.number}</strong>
                  </div>
                ))}
              </div>

              <div className="calendar-body">
                <div className="time-col">
                  {HOURS.map((hour) => <div className="time-label" key={hour}>{hour}</div>)}
                </div>

                {DAYS.map((day) => (
                  <div className="day-col" key={day.key}>
                    {HOURS.map((hour) => {
                      const slot = `${day.key}-${hour}`;
                      const slotEvents = eventsBySlot[slot] || [];

                      return (
                        <div
                          className={`slot ${draggedId != null ? "drop-ready" : ""}`}
                          key={slot}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => {
                            if (callbackEnabled) {
                              moveEvent(day.key, hour);
                            } else if (draggedId != null) {
                              setEvents((current) =>
                                current.map((event) =>
                                  event.id === draggedId
                                    ? { ...event, day: day.key, time: hour }
                                    : event
                                )
                              );
                              setDraggedId(null);
                            }
                          }}
                        >
                          {slotEvents.map((event) => (
                            <Card
                              key={event.id}
                              event={event}
                              onDragStart={startDrag}
                              onDelete={deleteEvent}
                            />
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="calendar-footer">
              <span>↔ Drag an event to another slot</span>
              <span>{filteredEvents.length} visible · {events.length} total</span>
            </div>
          </section>

          {showAdd && (
            <section className="add-panel">
              <div>
                <p className="eyebrow">QUICK CREATE</p>
                <h3>Add Calendar Event</h3>
              </div>
              <form onSubmit={addEvent}>
                <input
                  placeholder="Event title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <select value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })}>
                  {DAYS.map((day) => <option value={day.key} key={day.key}>{day.name}</option>)}
                </select>
                <select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}>
                  {HOURS.map((hour) => <option value={hour} key={hour}>{hour}</option>)}
                </select>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option>Meeting</option>
                  <option>Deadline</option>
                  <option>Focus</option>
                  <option>Personal</option>
                </select>
                <button type="submit">Add Event</button>
              </form>
            </section>
          )}

          <div className="concept-row">
            <div><span>01</span><strong>React.memo</strong><p>Skips unchanged event-card renders.</p></div>
            <div><span>02</span><strong>useMemo</strong><p>Caches filtering and slot mapping.</p></div>
            <div><span>03</span><strong>useCallback</strong><p>Keeps event handlers stable.</p></div>
          </div>
        </main>

        <aside className="monitor">
          <div className="monitor-head">
            <div><p className="eyebrow dark">PROFILER</p><h3>Render Monitor</h3></div>
            <span className="monitor-live">LIVE</span>
          </div>

          <div className="render-number">{parentRenders}<small>parent renders</small></div>

          <div className="monitor-divider" />

          <div className="monitor-setting"><span>React.memo</span><b className={memoEnabled ? "green" : ""}>{memoEnabled ? "ACTIVE" : "OFF"}</b></div>
          <div className="monitor-setting"><span>useCallback</span><b className={callbackEnabled ? "green" : ""}>{callbackEnabled ? "ACTIVE" : "OFF"}</b></div>
          <div className="monitor-setting"><span>useMemo</span><b className={useMemoEnabled ? "green" : ""}>{useMemoEnabled ? "ACTIVE" : "OFF"}</b></div>

          <div className="monitor-divider" />
          <p className="monitor-section">EVENT ACTIVITY</p>

          {events.map((event) => (
            <div className="activity" key={event.id}>
              <i className={`dot ${event.type.toLowerCase()}`} />
              <div><strong>{event.title}</strong><small>{event.day.toUpperCase()} · {event.time}</small></div>
            </div>
          ))}

          <div className="monitor-note">
            <strong>Experiment insight</strong>
            <p>Toggle optimization and use the browser console or React DevTools Profiler to compare rendering.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;