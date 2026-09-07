export default function Toggle({ label, description, enabled, onChange }) {
  return (
    <button
      className={`feature-toggle ${enabled ? "enabled" : ""}`}
      onClick={() => onChange(!enabled)}
      aria-pressed={enabled}
    >
      <span className="switch">
        <span />
      </span>
      <span className="toggle-copy">
        <strong>{label}</strong>
        <small>{description}</small>
      </span>
    </button>
  );
}