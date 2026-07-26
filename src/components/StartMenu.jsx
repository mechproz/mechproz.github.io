import { META, APP_TYPES } from "../content.jsx";

export default function StartMenu({ open, onOpenWindow, onShutdown }) {
  if (!open) return null;
  return (
    <div className="start-menu" id="startMenu">
      <div className="start-side"><span>mechproz<b>98</b></span></div>
      <ul className="start-list">
        {APP_TYPES.map((type) => (
          <li key={type} onClick={() => onOpenWindow(type)}>
            <span className="si-img">{META[type].icon}</span> {META[type].title}
          </li>
        ))}
        <li className="sep" />
        <li onClick={onShutdown}><span className="si-img">⏻</span> Shut&nbsp;Down…</li>
      </ul>
    </div>
  );
}
