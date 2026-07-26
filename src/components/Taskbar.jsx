import { META } from "../content.jsx";

export default function Taskbar({
  order, wins, activeType, startOpen, onToggleStart,
  onTaskClick, soundOn, onToggleSound, onToggleWallpaper, clock,
  onTextSmaller, onTextLarger, canShrink, canGrow,
}) {
  return (
    <nav className="taskbar" aria-label="Taskbar">
      <button className={"start-btn" + (startOpen ? " active" : "")} onClick={(e) => { e.stopPropagation(); onToggleStart(); }}>
        <span className="start-logo">🪟</span><b>Start</b>
      </button>
      <span className="task-sep" />
      <div className="task-windows">
        {order.map((type) => {
          const w = wins[type];
          if (!w) return null;
          const meta = META[type];
          const isActive = activeType === type && !w.minimized;
          return (
            <button key={type} className={"task-win" + (isActive ? " active" : "")} onClick={() => onTaskClick(type)}>
              <span className="tw-ico">{meta.icon}</span>
              <span className="tw-label">{meta.title}</span>
            </button>
          );
        })}
      </div>
      <div className="tray">
        <span className="tray-size">
          <button className="size-btn" title="Smaller text" onClick={onTextSmaller} disabled={!canShrink}>
            <span className="a-sm">A</span>−
          </button>
          <button className="size-btn" title="Larger text" onClick={onTextLarger} disabled={!canGrow}>
            <span className="a-lg">A</span>+
          </button>
        </span>
        <button className="tray-btn" title="Toggle sound" onClick={onToggleSound}>{soundOn ? "🔊" : "🔈"}</button>
        <button className="tray-btn" title="Toggle wallpaper (dark / teal)" onClick={onToggleWallpaper}>🖥️</button>
        <span className="tray-clock">{clock}</span>
      </div>
    </nav>
  );
}
