import React, { memo } from "react";

function EventCardBase({ event, onDragStart, onDelete }) {
  console.log(`[EventCard] rendered: ${event.title}`);

  return (
    <article
      className={`event-card event-${event.type.toLowerCase()}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", String(event.id));
        onDragStart(event.id);
      }}
      title="Drag this event to another day/time slot"
    >
      <div className="event-topline">
        <span>{event.time}</span>
        <button
          className="delete-event"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(event.id);
          }}
          aria-label={`Delete ${event.title}`}
        >
          ×
        </button>
      </div>
      <strong>{event.title}</strong>
      <p>{event.description}</p>
      <span className="event-type">{event.type}</span>
    </article>
  );
}

export const MemoEventCard = memo(EventCardBase);
export { EventCardBase };