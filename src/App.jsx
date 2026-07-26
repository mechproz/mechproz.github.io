import { useCallback, useEffect, useRef, useState } from "react";
import { APP_TYPES } from "./content.jsx";
import { useSound } from "./useSound.js";
import Window from "./components/Window.jsx";
import Taskbar from "./components/Taskbar.jsx";
import StartMenu from "./components/StartMenu.jsx";
import DesktopIcons from "./components/DesktopIcons.jsx";

// text sizes the A− / A+ buttons step through
const TEXT_SCALES = [0.85, 0.95, 1.05, 1.2, 1.35, 1.5];

export default function App() {
  // one entry per open window, keyed by type: { x, y, z, minimized, maximized }
  const [wins, setWins] = useState({});
  const [order, setOrder] = useState([]);          // left-to-right order of the taskbar buttons
  const [activeType, setActiveType] = useState(null);
  const [startOpen, setStartOpen] = useState(false);
  const [shutdown, setShutdown] = useState(false);
  const [wallpaper, setWallpaper] = useState(() => localStorage.getItem("wallpaper") || "dark");
  const [soundOn, setSoundOn] = useState(true);
  const [clock, setClock] = useState("--:--");

  // index into TEXT_SCALES, remembered between visits
  const [scaleIdx, setScaleIdx] = useState(() => {
    const s = parseInt(localStorage.getItem("uiScale"), 10);
    return Number.isInteger(s) && s >= 0 && s < TEXT_SCALES.length ? s : 2;
  });
  const [ach, setAch] = useState({ show: false, name: "" });

  const zRef = useRef(20);
  const openedRef = useRef(new Set());
  const achUnlockedRef = useRef(false);
  const soundEnabled = useRef(true);
  useEffect(() => { soundEnabled.current = soundOn; }, [soundOn]);
  const snd = useSound(soundEnabled);
  const achTimer = useRef(null);

  useEffect(() => {
    document.body.classList.toggle("theme-teal", wallpaper === "teal");
    localStorage.setItem("wallpaper", wallpaper);
  }, [wallpaper]);

  useEffect(() => {
    document.documentElement.style.setProperty("--fs", String(TEXT_SCALES[scaleIdx]));
    localStorage.setItem("uiScale", String(scaleIdx));
  }, [scaleIdx]);

  // taskbar clock. 15s is plenty when i'm only showing hh:mm
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0"));
    };
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

  const focusWindow = useCallback((type) => {
    setActiveType(type);
    setWins((w) => (w[type] ? { ...w, [type]: { ...w[type], z: ++zRef.current, minimized: false } } : w));
  }, []);

  const showAchievement = useCallback((name) => {
    snd.chime();
    setAch({ show: true, name });
    clearTimeout(achTimer.current);
    achTimer.current = setTimeout(() => setAch((a) => ({ ...a, show: false })), 5000);
  }, [snd]);

  const openWindow = useCallback((type) => {
    setWins((w) => {
      if (w[type]) {
        setActiveType(type);
        return { ...w, [type]: { ...w[type], z: ++zRef.current, minimized: false } };
      }
      snd.click();
      const idx = Object.keys(w).length;
      const mobile = window.innerWidth < 620;
      const x = mobile ? 8 : 130 + idx * 24;
      const y = mobile ? 20 + idx * 24 : 40 + idx * 24;
      setActiveType(type);
      setOrder((o) => (o.includes(type) ? o : [...o, type]));

      // once you've opened all of them you get the achievement, then i stop counting
      if (APP_TYPES.includes(type) && !achUnlockedRef.current) {
        openedRef.current.add(type);
        if (openedRef.current.size === APP_TYPES.length) {
          achUnlockedRef.current = true;
          setTimeout(() => showAchievement("Explorer — you opened every window! 🌐"), 60);
        }
      }
      return { ...w, [type]: { x, y, z: ++zRef.current, minimized: false, maximized: false } };
    });
  }, [snd, showAchievement]);

  const closeWindow = useCallback((type) => {
    snd.close();
    setWins((w) => { const n = { ...w }; delete n[type]; return n; });
    setOrder((o) => o.filter((t) => t !== type));
    setActiveType((a) => (a === type ? null : a));
  }, [snd]);

  const minimizeWindow = useCallback((type) => {
    snd.click();
    setWins((w) => (w[type] ? { ...w, [type]: { ...w[type], minimized: true } } : w));
    setActiveType((a) => (a === type ? null : a));
  }, [snd]);

  const maximizeWindow = useCallback((type) => {
    snd.click();
    setWins((w) => (w[type] ? { ...w, [type]: { ...w[type], maximized: !w[type].maximized, z: ++zRef.current } } : w));
    setActiveType(type);
  }, [snd]);

  const moveWindow = useCallback((type, x, y) => {
    setWins((w) => (w[type] ? { ...w, [type]: { ...w[type], x, y } } : w));
  }, []);

  const taskClick = useCallback((type) => {
    const win = wins[type];
    if (!win) return;
    // same as the real taskbar: clicking the window you're already on minimizes it
    const minimize = !win.minimized && activeType === type;
    setActiveType(minimize ? null : type);
    setWins((w) => (w[type]
      ? { ...w, [type]: { ...w[type], minimized: minimize, z: minimize ? w[type].z : ++zRef.current } }
      : w));
  }, [wins, activeType]);

  const doShutdown = useCallback(() => { snd.power(); setStartOpen(false); setShutdown(true); }, [snd]);

  // click anywhere that isn't the menu or the button and it goes away
  useEffect(() => {
    if (!startOpen) return;
    const onDoc = (e) => { if (!e.target.closest(".start-menu") && !e.target.closest(".start-btn")) setStartOpen(false); };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, [startOpen]);

  // open these two on load so you don't land on a bare desktop.
  // the delay is just so they don't pop in at the same instant.
  useEffect(() => {
    openWindow("start");
    const id = setTimeout(() => openWindow("projects"), 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <DesktopIcons onOpen={openWindow} />

      <div id="window-container">
        {order.map((type) => (
          wins[type] ? (
            <Window
              key={type}
              type={type}
              state={wins[type]}
              active={activeType === type}
              onFocus={() => focusWindow(type)}
              onClose={() => closeWindow(type)}
              onMinimize={() => minimizeWindow(type)}
              onMaximize={() => maximizeWindow(type)}
              onMove={(x, y) => moveWindow(type, x, y)}
            />
          ) : null
        ))}
      </div>

      <StartMenu open={startOpen} onOpenWindow={(t) => { openWindow(t); setStartOpen(false); }} onShutdown={doShutdown} />

      <Taskbar
        order={order}
        wins={wins}
        activeType={activeType}
        startOpen={startOpen}
        onToggleStart={() => { snd.click(); setStartOpen((s) => !s); }}
        onTaskClick={taskClick}
        soundOn={soundOn}
        onToggleSound={() => { setSoundOn((s) => !s); }}
        onToggleWallpaper={() => { snd.click(); setWallpaper((p) => (p === "teal" ? "dark" : "teal")); }}
        onTextSmaller={() => { snd.click(); setScaleIdx((i) => Math.max(0, i - 1)); }}
        onTextLarger={() => { snd.click(); setScaleIdx((i) => Math.min(TEXT_SCALES.length - 1, i + 1)); }}
        canShrink={scaleIdx > 0}
        canGrow={scaleIdx < TEXT_SCALES.length - 1}
        clock={clock}
      />

      <div className={"msgbox achievement" + (ach.show ? " show" : "")} role="status" aria-live="assertive">
        <div className="title-bar">
          <span className="title-bar-text">🏆 Achievement!</span>
          <div className="title-bar-controls">
            <button className="tb-btn tb-close" aria-label="Close" onClick={() => setAch((a) => ({ ...a, show: false }))}>✕</button>
          </div>
        </div>
        <div className="msgbox-body">
          <span className="msg-icon">🏆</span>
          <p><b>Achievement unlocked:</b><br />{ach.name}</p>
        </div>
      </div>

      {shutdown && (
        <div className="shutdown" onClick={() => { snd.click(); setShutdown(false); }}>
          <p className="shutdown-text">It&rsquo;s now safe to turn off<br />your computer.</p>
          <p className="shutdown-hint">(click anywhere to come back)</p>
        </div>
      )}
    </>
  );
}
