import { useEffect, useRef } from "react";

// everything you actually read on the site lives in this file. if i want to
// change what a window says, i edit the JSX down in CONTENT and nothing else.

export const META = {
  about:        { icon: "📄", title: "About Me" },
  projects:     { icon: "💻", title: "My Projects" },
  art:          { icon: "🎨", title: "Art" },
  skills:       { icon: "⚙️", title: "Skills" },
  achievements: { icon: "🏆", title: "Achievements" },
  contact:      { icon: "✉️", title: "Contact" },
  start:        { icon: "💾", title: "Welcome" },
};

// this order is reused everywhere: desktop icons, the Start menu, and the
// "opened everything" achievement counts against its length
export const APP_TYPES = ["about", "projects", "art", "skills", "achievements", "contact"];

// drawings i want on the site. to add one: open the post on bsky.app, hit
// "Embed post", and paste the at:// uri and cid it gives me into a new entry.
const BLUESKY_POSTS = [
  {
    uri: "at://did:plc:c3qua5fspqhdwlffmfvwegzz/app.bsky.feed.post/3lbhydtbt3227",
    cid: "bafyreiha3dgaidsjx2sihjzrpify6mx2dn7dzsldsai6j6267g433rj76e",
    url: "https://bsky.app/profile/mechproz.bsky.social/post/3lbhydtbt3227",
    caption: "Shuten doodle · #fgo",
  },
];

// i build the blockquotes with innerHTML instead of JSX on purpose. bsky's
// embed.js replaces them with iframes, and if React thinks it owns those nodes
// it throws on unmount when they're no longer what it left there.
function ArtEmbed() {
  const host = useRef(null);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    el.innerHTML = BLUESKY_POSTS.map((p) =>
      `<blockquote class="bluesky-embed" data-bluesky-uri="${p.uri}" ` +
      `data-bluesky-cid="${p.cid}" data-bluesky-embed-color-mode="light">` +
      `<p><a href="${p.url}" target="_blank" rel="noopener">${p.caption} — view on Bluesky ↗</a></p>` +
      `</blockquote>`
    ).join("");
    const s = document.createElement("script");
    s.src = "https://embed.bsky.app/static/embed.js";
    s.async = true;
    s.charset = "utf-8";
    document.body.appendChild(s);
    return () => { s.remove(); el.innerHTML = ""; };
  }, []);
  return <div className="bsky-wrap" ref={host} />;
}

const Project = ({ title, year, desc, tags, href, label, wip }) => (
  <article className="proj">
    <header className="proj-head">
      <b>{title}</b>
      {wip && <span className="badge-wip">WIP</span>}
      <span className="proj-year">{year}</span>
    </header>
    <p>{desc}</p>
    {tags && (
      <div className="chip-row">{tags.map((t) => <span className="chip" key={t}>{t}</span>)}</div>
    )}
    <p className="proj-links"><a href={href} target="_blank" rel="noopener">» {label || "view code"}</a></p>
  </article>
);

export const CONTENT = {
  about: (
    <>
      <p className="lead">hi, i'm mechproz 👋</p>
      <table className="kv"><tbody>
        <tr><td>Age</td><td>26</td></tr>
        <tr><td>From</td><td>Singapore 🇸🇬</td></tr>
        <tr><td>Role</td><td>Information Security student &amp; developer</td></tr>
        <tr><td>Likes</td><td>drawing, CTFs, breaking &amp; building things</td></tr>
      </tbody></table>
      <p>i build software and poke at systems to see how they break. when i'm
         not in a terminal you'll find me drawing in Clip Studio. this little
         desktop is where i keep my projects, skills, and the stuff i'm proud of.</p>
      <div className="chip-row">
        <span className="chip">🐍 python</span>
        <span className="chip">🔐 offensive security</span>
        <span className="chip">🎨 illustration</span>
      </div>
    </>
  ),

  projects: (
    <>
      <p className="lead">stuff i've built 💾</p>
      {/* these all point at my profile for now. swap in the real repo links once i make them public */}
      <Project title="📝 NoteSummarizer" year="2026" href="https://github.com/mechproz" wip
        desc="Feed it a PDF, a slide deck or a textbook and you get study notes back. Every line keeps the page it came from attached, so you can go check it before you revise off it. Runs against a local Ollama model or the Claude API."
        tags={["react", "fastapi", "postgres", "llm"]} />
      <Project title="📅 Staff Scheduler" year="2026" href="https://github.com/mechproz" wip
        desc="Builds staff rosters months at a time. Leave, coverage, burnout caps and hour budgets all go in as constraints and OR-Tools CP-SAT finds a roster that fits them. Exports to Excel and PDF at the end."
        tags={["python", "or-tools", "fastapi", "react"]} />
      <Project title="🖥️ mechproz98" year="2026" href="https://github.com/mechproz"
        desc="The site you're looking at. Draggable windows, a working Start menu, and no runtime dependencies past React itself. I wrote the window manager and the dragging by hand, mostly to learn how they actually work."
        tags={["react", "vite", "css"]} />
    </>
  ),

  art: (
    <>
      <p className="lead">drawings i'm proud of 🎨</p>
      <p className="muted small">straight from my Bluesky — see the full gallery there.</p>
      <ArtEmbed />
      <p className="art-links">
        <a href="https://bsky.app/profile/mechproz.bsky.social" target="_blank" rel="noopener">» all art on bluesky</a>
        &nbsp;·&nbsp;
        <a href="https://mechproz.neocities.org" target="_blank" rel="noopener">» neocities</a>
      </p>
    </>
  ),

  skills: (
    <>
      <p className="lead">the toolbox 🧰</p>
      <fieldset className="fs"><legend>languages</legend>
        <div className="chip-row">
          <span className="chip">☕ Java</span><span className="chip">🐍 Python</span>
          <span className="chip">⚙️ C++</span><span className="chip">🟨 JavaScript</span>
        </div>
      </fieldset>
      <fieldset className="fs"><legend>dev tools</legend>
        <div className="chip-row">
          <span className="chip">VS Code</span><span className="chip">Git</span>
          <span className="chip">Docker</span><span className="chip">Node.js</span><span className="chip">Postman</span>
        </div>
      </fieldset>
      <fieldset className="fs"><legend>security</legend>
        <div className="chip-row">
          <span className="chip">🔐 Wireshark</span><span className="chip">Metasploit</span>
          <span className="chip">Burp Suite</span><span className="chip">Nmap</span>
        </div>
      </fieldset>
      <fieldset className="fs"><legend>art</legend>
        <div className="chip-row">
          <span className="chip">🎨 Krita</span><span className="chip">Clip Studio Paint</span>
        </div>
      </fieldset>
    </>
  ),

  achievements: (
    <>
      <p className="lead">things i'm proud of 🏆</p>
      <fieldset className="fs"><legend>🎓 education</legend>
        <ul className="list">
          <li>📜 Diploma in Engineering Systems</li>
          <li>📜 Degree in Information &amp; Communications Technology <i>(Information Security)</i></li>
        </ul>
      </fieldset>
      <fieldset className="fs"><legend>📜 certifications</legend>
        <ul className="list">
          <li>🔐 <b>OSCP</b> — Offensive Security Certified Professional</li>
          <li>🇯🇵 <b>JLPT N3</b> — Japanese Language Proficiency Test</li>
        </ul>
      </fieldset>
    </>
  ),

  contact: (
    <>
      <p className="lead">say hi 📡</p>
      <table className="kv"><tbody>
        <tr><td>🐙 github</td><td><a href="https://github.com/mechproz" target="_blank" rel="noopener">@mechproz</a></td></tr>
        <tr><td>🐦 twitter</td><td><a href="https://twitter.com/mechproz" target="_blank" rel="noopener">@mechproz</a></td></tr>
        <tr><td>🕹️ neocities</td><td><a href="https://mechproz.neocities.org" target="_blank" rel="noopener">mechproz.neocities.org</a></td></tr>
      </tbody></table>
      <fieldset className="fs"><legend>webring</legend>
        <div className="btn88-row">
          <span className="btn88">mechproz<br />.exe</span>
          <span className="btn88">made with<br />♥ + react</span>
          <span className="btn88">best viewed<br />@ 800×600</span>
        </div>
      </fieldset>
    </>
  ),

  start: (
    <>
      <p className="lead">welcome to mechproz98 ✦</p>
      <p>this is a Windows-98 style portfolio. double-click the <b>desktop
         icons</b>, or use the <b>Start</b> menu, to open windows for
         <b> projects</b>, <b>skills</b>, <b>achievements</b>, and more.</p>
      <p>every window is draggable — grab a title bar and move it around.</p>
      <p className="muted small">tip: open every window to unlock a secret achievement 👀</p>
    </>
  ),
};
