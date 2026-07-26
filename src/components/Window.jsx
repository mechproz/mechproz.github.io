import { useRef } from "react";
import { META, CONTENT } from "../content.jsx";

export default function Window({ type, state, active, onFocus, onClose, onMinimize, onMaximize, onMove }) {
  const meta = META[type] || { icon: "🗔", title: type };
  const drag = useRef(null);

  function onPointerDown(e) {
    if (e.target.closest(".tb-btn") || state.maximized) return;
    onFocus();
    const start = { x: e.clientX, y: e.clientY, ox: state.x, oy: state.y };
    drag.current = start;

    const move = (ev) => {
      if (!drag.current) return;
      if (ev.cancelable) ev.preventDefault();
      let nx = start.ox + (ev.clientX - start.x);
      let ny = start.oy + (ev.clientY - start.y);
      nx = Math.min(Math.max(nx, -260), window.innerWidth - 40);
      ny = Math.min(Math.max(ny, 0), window.innerHeight - 60);
      onMove(nx, ny);
    };
    const up = () => {
      drag.current = null;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  const style = state.maximized
    ? { zIndex: state.z, display: state.minimized ? "none" : "" }
    : { left: state.x, top: state.y, zIndex: state.z, display: state.minimized ? "none" : "" };

  return (
    <div
      className={"window" + (state.maximized ? " maximized" : "") + (active ? "" : " inactive")}
      style={style}
      onMouseDown={onFocus}
    >
      <div className="title-bar" onPointerDown={onPointerDown} onDoubleClick={(e) => { if (!e.target.closest(".tb-btn")) onMaximize(); }}>
        <span className="title-bar-text">{meta.icon} {meta.title}</span>
        <div className="title-bar-controls">
          <button className="tb-btn tb-min" aria-label="Minimize" onClick={(e) => { e.stopPropagation(); onMinimize(); }}>_</button>
          <button className="tb-btn tb-max" aria-label="Maximize" onClick={(e) => { e.stopPropagation(); onMaximize(); }}>□</button>
          <button className="tb-btn tb-close" aria-label="Close" onClick={(e) => { e.stopPropagation(); onClose(); }}>✕</button>
        </div>
      </div>
      <div className="window-body">{CONTENT[type]}</div>
    </div>
  );
}
