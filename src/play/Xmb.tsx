"use client";

/* ============================================================
   The experimental "handheld console menu" version.
     ← → switch category · ↑ ↓ pick an item
     Enter opens it · Esc / Backspace goes back
   Mouse (click, wheel) and touch (swipe, tap) work too.
   To add a category, add an entry to `cats` below.
   ============================================================ */

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { SITE, domain, featuredFirst, type Project } from "@/content/site";
import Terminal, { isTerminalOpen, openTerminal } from "@/components/Terminal";
import Wave from "./Wave";
import Backdrop from "./Backdrop";
import { Icon, type IconName } from "./icons";
import { isSoundOn, play, setSoundOn } from "@/lib/sfx";
import { duck, isMusicOn, onMusicChange, setMusicOn, start as startMusic, stop as stopMusic } from "@/lib/bgm";
import { AUTO, hexToHueSat, nextTheme, resolveTheme, store, themeLabel } from "./themes";
import { AboutPanel, ContactPanel, EducationPanel, JobPanel, ProjectPanel, SkillsPanel, SystemPanel, Thumb } from "./parts";

type Item = {
  id?: string;
  title: string;
  sub?: string;
  icon?: IconName;
  thumb?: Project;
  action?: () => void;
  panel?: () => ReactNode;
  href?: string;
  newTab?: boolean;
};

type Cat = { id: string; label: string; icon: IconName; thumbs?: boolean; items: Item[] };

type Metrics = { ax: number; cy: number; gap: number; catH: number; itemH: number; selH: number };

function getMetrics(): Metrics {
  const w = innerWidth, h = innerHeight;
  if (w < 640) return { ax: 22, cy: Math.round(h * 0.17), gap: 86, catH: 92, itemH: 62, selH: 78 };
  return { ax: Math.round(Math.min(w * 0.2, 300)), cy: Math.round(h * 0.2), gap: 124, catH: 112, itemH: 68, selH: 88 };
}
const DEFAULT_METRICS: Metrics = { ax: 260, cy: 170, gap: 124, catH: 112, itemH: 68, selH: 88 };

// terminal "go" targets → [category, item id?, open panel?]
const GOTO: Record<string, [string, string?, boolean?]> = {
  about: ["profile", "about", true],
  contact: ["profile", "contact", true],
  profile: ["profile"],
  experience: ["experience"],
  leadership: ["leadership"],
  projects: ["projects"],
  skills: ["skills"],
  network: ["network"],
  settings: ["settings"],
};

const noFocus = (e: React.MouseEvent) => e.preventDefault();

export default function Xmb() {
  // ---------- settings (persisted) ----------
  const [themeIdx, setThemeIdx] = useState(AUTO);
  const [waveOn, setWaveOn] = useState(true);
  const [soundOn, setSoundOnState] = useState(true);
  const [musicOn, setMusicOnState] = useState(true);
  const [month, setMonth] = useState(10);

  // ---------- menu state ----------
  const [cat, setCat] = useState(1);
  const [sel, setSel] = useState<number[]>([]);
  const [panel, setPanel] = useState<{ cat: number; idx: number } | null>(null);
  const [pulse, setPulse] = useState("");
  const [metrics, setMetrics] = useState<Metrics>(DEFAULT_METRICS);
  const [booting, setBooting] = useState(true);
  const [intro, setIntro] = useState(true);
  const [clock, setClock] = useState("");
  const [battery, setBattery] = useState({ level: 1, charging: false });
  const [announce, setAnnounce] = useState("");

  const stageRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const panelBodyRef = useRef<HTMLDivElement>(null);

  const themeName = themeLabel(themeIdx).replace(/Auto \(.*\)/, `Auto (${resolveTheme(AUTO, month)[0]})`);
  const [hue, sat] = hexToHueSat(resolveTheme(themeIdx, month)[1]);

  // ---------- menu structure ----------
  const cats: Cat[] = useMemo(() => {
    const { github, linkedin, upwork } = SITE.links;
    const list: Cat[] = [
      {
        id: "settings", label: "Settings", icon: "settings",
        items: [
          {
            title: "Theme", icon: "palette", sub: themeName,
            action: () => setThemeIdx((i) => { const n = nextTheme(i); store.set("theme", n); return n; }),
          },
          {
            title: "Wave Background", icon: "wave", sub: waveOn ? "On" : "Off",
            action: () => setWaveOn((on) => { store.set("wave", !on); return !on; }),
          },
          {
            title: "Sound Effects", icon: "speaker", sub: soundOn ? "On" : "Off",
            action: () => {
              const on = !isSoundOn();
              setSoundOn(on);
              setSoundOnState(on);
            },
          },
          {
            title: "Background Music", icon: "music", sub: musicOn ? "On" : "Off",
            action: () => setMusicOn(!isMusicOn()),
          },
          { title: "Professional Site", icon: "swap", sub: "Switch to the professional layout", href: "/" },
          { title: "System Information", icon: "info", sub: "Version and update history", panel: () => <SystemPanel theme={themeName} /> },
        ],
      },
      {
        id: "profile", label: "Profile", icon: "user",
        items: [
          { id: "about", title: "About Me", icon: "user", sub: SITE.role, panel: () => <AboutPanel /> },
          ...(SITE.resume ? [{ title: "Résumé", icon: "doc" as IconName, sub: "Open PDF", href: SITE.resume, newTab: true }] : []),
          ...SITE.education.map((e) => ({ title: e.school, icon: "school" as IconName, sub: e.degree, panel: () => <EducationPanel e={e} /> })),
          { id: "contact", title: "Contact", icon: "mail", sub: SITE.email, panel: () => <ContactPanel /> },
        ],
      },
      {
        id: "experience", label: "Experience", icon: "briefcase",
        items: SITE.experience.map((j) => ({ title: j.title, sub: `${j.org} · ${j.date}`, icon: "briefcase" as IconName, panel: () => <JobPanel j={j} /> })),
      },
      {
        id: "leadership", label: "Leadership", icon: "star",
        items: SITE.leadership.map((j) => ({ title: j.title, sub: `${j.org} · ${j.date}`, icon: "star" as IconName, panel: () => <JobPanel j={j} /> })),
      },
      {
        id: "projects", label: "Projects", icon: "gamepad", thumbs: true,
        items: featuredFirst(SITE.projects).map((p) => ({ title: p.name, sub: p.blurb, thumb: p, panel: () => <ProjectPanel p={p} /> })),
      },
      {
        id: "skills", label: "Skills", icon: "chip",
        items: SITE.skills.map((g) => ({
          title: g.group, icon: "chip" as IconName,
          sub: g.items.slice(0, 4).join(", ") + (g.items.length > 4 ? ", …" : ""),
          panel: () => <SkillsPanel items={g.items} />,
        })),
      },
      {
        id: "network", label: "Network", icon: "globe",
        items: [
          ...(github ? [{ title: "GitHub", icon: "code" as IconName, sub: domain(github), href: github, newTab: true }] : []),
          ...(linkedin ? [{ title: "LinkedIn", icon: "user" as IconName, sub: "LinkedIn profile", href: linkedin, newTab: true }] : []),
          ...(upwork ? [{ title: "Upwork", icon: "briefcase" as IconName, sub: "Freelance profile", href: upwork, newTab: true }] : []),
          { title: "Email", icon: "mail", sub: SITE.email, href: `mailto:${SITE.email}` },
          ...SITE.bookmarks.map((b) => ({ title: b.name, icon: "link" as IconName, sub: b.note, href: b.url, newTab: true })),
        ],
      },
    ];
    return list.filter((c) => c.items.length);
  }, [themeName, waveOn, soundOn, musicOn]);

  const selOf = (ci: number) => sel[ci] ?? 0;

  // ---------- actions ----------
  const activate = useCallback((ci: number, ii: number) => {
    const it = cats[ci]?.items[ii];
    if (!it) return;
    if (it.action) {
      it.action();
      play("toggle", { force: true }); // audible even when this action just turned sound on
      setPulse(`${ci}-${ii}-${Date.now()}`);
    } else if (it.panel) {
      play("open");
      setPanel({ cat: ci, idx: ii });
    } else if (it.href) {
      play("select");
      if (it.newTab) window.open(it.href, "_blank", "noopener");
      else location.href = it.href;
    }
  }, [cats]);

  const closePanel = useCallback(() => {
    play("back");
    setPanel(null);
  }, []);

  const moveCat = useCallback((d: number) => {
    const next = Math.max(0, Math.min(cats.length - 1, cat + d));
    play(next === cat ? "bump" : "cat");
    setCat(next);
  }, [cat, cats.length]);

  const moveItem = useCallback((d: number) => {
    const cur = sel[cat] ?? 0;
    const next = Math.max(0, Math.min(cats[cat].items.length - 1, cur + d));
    play(next === cur ? "bump" : "move");
    setSel((s) => { const n = [...s]; n[cat] = next; return n; });
  }, [cat, cats, sel]);

  const skipBoot = useCallback(() => {
    play("boot");
    setBooting(false);
  }, []);

  const goto = useCallback((name: string) => {
    const g = GOTO[name];
    if (!g) return;
    const ci = cats.findIndex((c) => c.id === g[0]);
    if (ci < 0) return;
    let ii = selOf(ci);
    if (g[1]) {
      const found = cats[ci].items.findIndex((it) => it.id === g[1]);
      if (found >= 0) ii = found;
    }
    setCat(ci);
    setSel((s) => { const n = [...s]; n[ci] = ii; return n; });
    setPanel(g[2] ? { cat: ci, idx: ii } : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cats, sel]);

  // ---------- mount: settings, boot, metrics, clock, battery, hash ----------
  useEffect(() => {
    setThemeIdx(store.get("theme", AUTO));
    setWaveOn(store.get("wave", true));
    setSoundOnState(isSoundOn());
    setMusicOnState(isMusicOn());
    const offMusic = onMusicChange(setMusicOnState);
    // browsers only allow audio after a gesture: start the music on the first one
    const kick = (e: Event) => {
      if (e instanceof KeyboardEvent && e.key === "`") return;
      startMusic();
      removeEventListener("pointerdown", kick, true);
      removeEventListener("keydown", kick, true);
    };
    addEventListener("pointerdown", kick, true);
    addEventListener("keydown", kick, true);
    setMonth(new Date().getMonth());
    setCat(Math.max(0, cats.findIndex((c) => c.id === "profile")));

    let seen = false;
    try {
      seen = sessionStorage.getItem("xmb.booted") === "1";
      sessionStorage.setItem("xmb.booted", "1");
    } catch { /* ignore */ }
    let bootTimer: ReturnType<typeof setTimeout> | undefined;
    if (seen || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setBooting(false);
      setIntro(false);
    } else {
      bootTimer = setTimeout(() => setBooting(false), 2300);
    }

    const onResize = () => setMetrics(getMetrics());
    onResize();
    addEventListener("resize", onResize);

    const tick = () => {
      const d = new Date();
      const hr = d.getHours();
      setClock(`${d.getMonth() + 1}/${d.getDate()}  ${hr % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")} ${hr >= 12 ? "PM" : "AM"}`);
    };
    tick();
    const clockTimer = setInterval(tick, 10000);

    type BatteryManager = EventTarget & { level: number; charging: boolean };
    const nav = navigator as Navigator & { getBattery?: () => Promise<BatteryManager> };
    nav.getBattery?.().then((b) => {
      const upd = () => setBattery({ level: b.level, charging: b.charging });
      upd();
      b.addEventListener("levelchange", upd);
      b.addEventListener("chargingchange", upd);
    }).catch(() => {});

    stageRef.current?.focus({ preventScroll: true });

    return () => {
      clearTimeout(bootTimer);
      clearInterval(clockTimer);
      removeEventListener("resize", onResize);
      removeEventListener("pointerdown", kick, true);
      removeEventListener("keydown", kick, true);
      offMusic();
      stopMusic();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // deep link: /play/#projects
  useEffect(() => {
    const hash = location.hash.slice(1);
    if (GOTO[hash]) goto(hash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // focus management + screen reader announcement
  useEffect(() => {
    if (panel) {
      panelRef.current?.focus({ preventScroll: true });
      panelBodyRef.current?.scrollTo({ top: 0 });
    } else stageRef.current?.focus({ preventScroll: true });
  }, [panel]);

  useEffect(() => {
    const it = cats[cat]?.items[selOf(cat)];
    if (it) setAnnounce(`${cats[cat].label}: ${it.title}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cat, sel]);

  // ---------- project backdrop: fades in after resting on a project ----------
  const [backdrop, setBackdrop] = useState<Project | null>(null);
  const hovered = !booting ? cats[cat]?.items[selOf(cat)]?.thumb ?? null : null;
  useEffect(() => {
    if (!hovered) {
      setBackdrop(null);
      return;
    }
    if (hovered === backdrop) return;
    const t = setTimeout(() => {
      setBackdrop(hovered);
      play("focus");
    }, 650);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hovered]);
  useEffect(() => duck(!!backdrop), [backdrop]);

  // ---------- keyboard ----------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTerminalOpen()) return;
      if (booting) {
        if (e.key !== "`") { skipBoot(); e.preventDefault(); }
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key;

      if (panel) {
        if (k === "Escape" || k === "Backspace" || k === "ArrowLeft") closePanel();
        else if (k === "ArrowDown") panelBodyRef.current?.scrollBy({ top: 90, behavior: "smooth" });
        else if (k === "ArrowUp") panelBodyRef.current?.scrollBy({ top: -90, behavior: "smooth" });
        else return; // Tab / Enter work normally on links inside the panel
        e.preventDefault();
        return;
      }

      switch (k) {
        case "ArrowLeft": moveCat(-1); break;
        case "ArrowRight": moveCat(1); break;
        case "ArrowUp": moveItem(-1); break;
        case "ArrowDown": moveItem(1); break;
        case "Home": setSel((s) => { const n = [...s]; n[cat] = 0; return n; }); break;
        case "End": setSel((s) => { const n = [...s]; n[cat] = cats[cat].items.length - 1; return n; }); break;
        case "Enter": case " ": case "x": activate(cat, selOf(cat)); break;
        default: return;
      }
      e.preventDefault();
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booting, panel, cat, sel, cats, activate, closePanel, moveCat, moveItem, skipBoot]);

  // ---------- wheel + touch (non-passive, so attached manually) ----------
  const inputRef = useRef({ panel, moveCat, moveItem });
  inputRef.current = { panel, moveCat, moveItem };

  useEffect(() => {
    const stage = stageRef.current!;
    let acc = 0, lockUntil = 0;
    let touch: { x: number; y: number } | null = null;

    const onWheel = (e: WheelEvent) => {
      const r = inputRef.current;
      if (r.panel) return;
      e.preventDefault();
      const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey;
      acc += horizontal ? e.deltaX || e.deltaY : e.deltaY;
      const now = performance.now();
      if (Math.abs(acc) < 30 || now < lockUntil) return;
      const dir = Math.sign(acc);
      acc = 0;
      lockUntil = now + 110;
      if (horizontal) r.moveCat(dir);
      else r.moveItem(dir);
    };
    const onStart = (e: TouchEvent) => { touch = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
    const onEnd = (e: TouchEvent) => {
      const r = inputRef.current;
      if (!touch || r.panel) return;
      const dx = e.changedTouches[0].clientX - touch.x;
      const dy = e.changedTouches[0].clientY - touch.y;
      touch = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) r.moveCat(-Math.sign(dx));
      else if (Math.abs(dy) > 30) r.moveItem(-Math.sign(dy) * Math.max(1, Math.round(Math.abs(dy) / 70)));
    };
    const onMove = (e: TouchEvent) => { if (!inputRef.current.panel) e.preventDefault(); };

    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("touchstart", onStart, { passive: true });
    stage.addEventListener("touchend", onEnd, { passive: true });
    stage.addEventListener("touchmove", onMove, { passive: false });
    return () => {
      stage.removeEventListener("wheel", onWheel);
      stage.removeEventListener("touchstart", onStart);
      stage.removeEventListener("touchend", onEnd);
      stage.removeEventListener("touchmove", onMove);
    };
  }, []);

  // ---------- layout ----------
  const m = metrics;
  function itemStyle(ci: number, j: number): React.CSSProperties {
    const s = selOf(ci);
    let y: number, op: number;
    if (j < s) {
      const d = s - j;
      y = m.cy - d * m.itemH;
      op = d <= 2 ? 0.45 - (d - 1) * 0.2 : 0;
    } else if (j === s) {
      y = m.cy + m.catH;
      op = 1;
    } else {
      y = m.cy + m.catH + m.selH + (j - s - 1) * m.itemH;
      op = Math.max(0.15, 0.75 - (j - s - 1) * 0.1);
    }
    return { transform: `translate(${m.ax}px, ${y}px)`, opacity: op, pointerEvents: op > 0 ? undefined : "none" };
  }

  const openItem = panel ? cats[panel.cat]?.items[panel.idx] : null;
  const rootClass = ["xmb-root", !booting && "ready", !intro && "no-intro", panel && "panel-open", backdrop && "has-backdrop"].filter(Boolean).join(" ");

  return (
    <div className={rootClass} style={{ "--h": hue, "--s": `${sat}%`, "--ax": `${m.ax}px` } as React.CSSProperties}>
      <Wave hue={hue} sat={sat} enabled={waveOn} />
      <Backdrop p={backdrop} />

      <header className="topbar">
        <a className="back-classic" href="/" title="Switch to the professional site">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
          Professional site
        </a>
        <button
          type="button"
          className={"music-toggle" + (musicOn ? "" : " is-off")}
          onMouseDown={noFocus}
          onClick={() => setMusicOn(!musicOn)}
          aria-pressed={musicOn}
          aria-label={musicOn ? "Mute background music" : "Play background music"}
          title={musicOn ? "Music on (click to mute)" : "Music off"}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" />
            {musicOn ? <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" /> : <path d="M16 9.5l5 5M21 9.5l-5 5" />}
          </svg>
        </button>
        <div className="status" aria-hidden="true">
          <span className="clock">{clock}</span>
          <span
            className={"battery" + (battery.charging ? " is-charging" : battery.level < 0.2 ? " is-low" : "")}
            style={{ "--level": Math.max(0.08, battery.level) } as React.CSSProperties}
          >
            <span className="battery-fill" />
          </span>
        </div>
      </header>

      <main
        className="stage"
        ref={stageRef}
        tabIndex={0}
        aria-label="Menu. Use arrow keys to navigate, Enter to open, Escape to go back."
        onClick={(e) => { if (panel && e.target === e.currentTarget) closePanel(); }}
      >
        <div className="cats">
          {cats.map((c, ci) => (
            <button
              key={c.id}
              className={"cat" + (ci === cat ? " is-active" : "")}
              tabIndex={-1}
              aria-label={c.label}
              style={{ transform: `translate(${m.ax + (ci - cat) * m.gap}px, ${m.cy}px)` }}
              onMouseDown={noFocus}
              onClick={() => {
                if (panel) setPanel(null);
                play(ci === cat ? "bump" : "cat");
                setCat(ci);
              }}
            >
              <Icon name={c.icon} />
              <span className="cat-label">{c.label}</span>
            </button>
          ))}
        </div>
        <div className="cols">
          {cats.map((c, ci) => (
            <div key={c.id} className={"col" + (c.thumbs ? " col-thumbs" : "") + (ci === cat ? " is-active" : "")}>
              {c.items.map((it, j) => {
                const pulsing = pulse.startsWith(`${ci}-${j}-`);
                return (
                  <button
                    key={it.title + j}
                    className={"item" + (j === selOf(ci) ? " is-sel" : "") + (pulsing ? " pulse" : "")}
                    tabIndex={-1}
                    style={itemStyle(ci, j)}
                    onMouseDown={noFocus}
                    onClick={() => {
                      setCat(ci);
                      setSel((s) => { const n = [...s]; n[ci] = j; return n; });
                      activate(ci, j);
                    }}
                  >
                    {it.thumb ? <Thumb p={it.thumb} /> : <Icon name={it.icon ?? "doc"} />}
                    <span className="item-text">
                      <span className="item-title">{it.title}</span>
                      <span className="item-sub" key={pulsing ? pulse : "sub"}>{it.sub}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </main>

      <aside className="panel" ref={panelRef} aria-hidden={!panel} tabIndex={-1} aria-labelledby="panel-title">
        {openItem && (
          <>
            <header className="panel-head">
              <span className="panel-icon">
                {openItem.thumb ? <Thumb p={openItem.thumb} /> : <Icon name={openItem.icon ?? "doc"} />}
              </span>
              <div>
                <p className="panel-kicker">{cats[panel!.cat].label}</p>
                <h2 id="panel-title">{openItem.title}</h2>
              </div>
            </header>
            <div className="panel-body" ref={panelBodyRef}>
              {openItem.panel?.()}
            </div>
          </>
        )}
      </aside>

      <footer className="hints">
        {panel ? (
          <>
            <Hint keys={["Esc"]} mouse="click outside" touch="Tap outside" label="Back" onClick={closePanel} />
            <Hint keys={["↑", "↓"]} mouse="scroll" touch="Swipe" label="Scroll" />
          </>
        ) : (
          <>
            <Hint keys={["←", "↑", "↓", "→"]} mouse="scroll" touch="Swipe" label="Navigate" />
            <Hint keys={["Enter"]} mouse="click" touch="Tap" label="Open" onClick={() => activate(cat, selOf(cat))} />
          </>
        )}
        <Hint keys={["`"]} mouse="click" touch="Tap" label="Terminal" onClick={() => { play("select"); openTerminal(); }} />
      </footer>

      <div className="sr-only" aria-live="polite">{announce}</div>

      {booting !== null && (
        <div className={"boot" + (booting ? "" : " is-done")} aria-hidden="true" onClick={skipBoot}>
          <div className="boot-inner">
            <p className="boot-name">{SITE.name}</p>
            <p className="boot-sub">portfolio</p>
          </div>
        </div>
      )}

      <Terminal mode="xmb" onGo={goto} />
    </div>
  );
}

/** Control hint: keyboard keys + the mouse equivalent (touch wording on touch screens). */
function Hint({ keys, mouse, touch, label, onClick }: { keys: string[]; mouse: string; touch?: string; label: string; onClick?: () => void }) {
  return (
    <button className={"hint" + (touch ? "" : " hint-no-touch")} tabIndex={-1} onMouseDown={noFocus} onClick={onClick}>
      <span className="hint-keys">
        {keys.map((k) => <kbd key={k}>{k}</kbd>)}
        <span className="hint-mouse">or {mouse}</span>
      </span>
      {touch && <span className="hint-touch">{touch}</span>}
      <span className="hint-label">{label}</span>
    </button>
  );
}
