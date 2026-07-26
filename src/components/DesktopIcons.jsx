import { useState } from "react";
import { META, APP_TYPES } from "../content.jsx";

export default function DesktopIcons({ onOpen }) {
  const [selected, setSelected] = useState(null);

  return (
    <main className="desktop" aria-label="Desktop" onClick={(e) => {
      if (e.target.classList.contains("desktop") || e.target.classList.contains("desk-icons")) setSelected(null);
    }}>
      <div className="desk-icons">
        {APP_TYPES.map((type) => (
          <button
            key={type}
            className={"desk-icon" + (selected === type ? " selected" : "")}
            onClick={() => setSelected(type)}
            onDoubleClick={() => onOpen(type)}
          >
            <span className="di-img">{META[type].icon}</span>
            <span className="di-label">{META[type].title}</span>
          </button>
        ))}
      </div>
    </main>
  );
}
