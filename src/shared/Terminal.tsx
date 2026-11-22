"use client";

/* Easter-egg terminal used by both modes, toggled with the backtick key.
   Open state is mirrored to <body data-terminal> so isTerminalOpen() works from
   any component without lifting state up. */

import { useCallback, useEffect, useRef, useState } from "react";
import { SITE, LINK_LABELS, profileLinks } from "@/content/site";
import { play } from "./sfx";
import { ROUTES } from "./links";
import "./terminal.css";

const OPEN_EVENT = "terminal:open";
/** Opens the terminal from anywhere (e.g. a click handler) via a window event. */
export const openTerminal = () => window.dispatchEvent(new Event(OPEN_EVENT));
export const isTerminalOpen = () => document.body.dataset.terminal === "open";

type Line = { text: string; echo?: boolean };

type Props = {
  mode: "professional" | "play";
  /** Navigate to a named section, e.g. "projects". Defaults to scrolling to the element with that id. */
  onGo?: (section: string) => void;
};

export default function Terminal({ mode, onGo }: Props) {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const history = useRef<string[]>([]);
  const histIdx = useRef(0);
  const greeted = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const outRef = useRef<HTMLDivElement>(null);

  const show = useCallback(() => {
    setOpen(true);
    if (!greeted.current) {
      greeted.current = true;
      setLines([{ text: "welcome. type `help` to see what this thing can do." }]);
    }
  }, []);

  const firstRender = useRef(true); // no open/close sound on mount
  useEffect(() => {
    document.body.dataset.terminal = open ? "open" : "closed";
    if (open) inputRef.current?.focus();
    if (firstRender.current) firstRender.current = false;
    else play(open ? "open" : "back");
  }, [open]);

  useEffect(() => {
    outRef.current?.scrollTo({ top: outRef.current.scrollHeight });
  }, [lines]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // let a backtick be typed into form fields
      const typing = /^(INPUT|TEXTAREA)$/.test((document.activeElement as HTMLElement)?.tagName);
      if (e.key === "`" && !typing) {
        e.preventDefault();
        setOpen((o) => {
          if (!o) show();
          return !o;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, show);
    };
  }, [show]);

  function go(section: string) {
    if (onGo) onGo(section);
    else document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
    return `opening ${section}...`;
  }

  const toPlay = () => {
    location.href = ROUTES.play;
    return "booting fun mode...";
  };
  const toProfessional = () => {
    location.href = ROUTES.professional;
    return "loading classic site...";
  };

  const commands: Record<string, () => string> = {
    help: () =>
      [
        "available commands:",
        "  whoami     who runs this place",
        "  about      a couple lines about me",
        "  projects   jump to projects",
        "  skills     list my stack",
        "  contact    how to reach me",
        "  resume     open my résumé",
        mode === "play" ? "  classic    switch to the professional site" : "  fun        switch to fun mode (console-style)",
        "  clear      clear the screen",
        "  exit       close this terminal",
      ].join("\n"),
    whoami: () => `${SITE.name} | ${SITE.role} @ ${SITE.school}`,
    about: () => SITE.about.join("\n\n"),
    projects: () => go("projects"),
    skills: () => SITE.skills.map((g) => `${g.group}\n  ${g.items.join(", ")}`).join("\n"),
    contact: () =>
      [
        `email     ${SITE.email}`,
        ...profileLinks().map(([k, u]) => `${(LINK_LABELS[k] || k).toLowerCase().padEnd(10)}${u}`),
      ].join("\n"),
    resume: () => {
      if (!SITE.resume) return "no résumé linked yet.";
      window.open(SITE.resume, "_blank", "noopener");
      return "opening résumé...";
    },
    fun: toPlay,
    play: toPlay,
    xmb: toPlay,
    classic: toProfessional,
    pro: toProfessional,
    sudo: () => "nice try. permission denied.",
    ls: () => "about  projects  skills  contact  resume",
    exit: () => {
      setOpen(false);
      return "";
    },
    clear: () => {
      setLines([]);
      return "";
    },
  };

  function run(raw: string) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    history.current.push(raw);
    histIdx.current = history.current.length;
    const key = cmd.startsWith("sudo") ? "sudo" : cmd;
    const handler = commands[key];
    const out = handler ? handler() : `command not found: ${cmd} (try \`help\`)`;
    if (key === "clear") return;
    setLines((ls) => [...ls, { text: "$ " + raw, echo: true }, ...(out ? [{ text: out }] : [])]);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    e.stopPropagation(); // fun mode listens for arrow keys on window; keep them in the input
    if (e.key === "Enter") {
      play("click");
      run(value);
      setValue("");
    } else if (e.key === "Escape" || e.key === "`") {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "ArrowUp" && histIdx.current > 0) {
      e.preventDefault();
      setValue(history.current[--histIdx.current]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      histIdx.current = Math.min(history.current.length, histIdx.current + 1);
      setValue(history.current[histIdx.current] || "");
    }
  }

  return (
    <div className={"terminal" + (open ? " open" : "")} role="dialog" aria-label="Terminal" aria-hidden={!open}>
      <div className="terminal-bar">
        <span>guest@{SITE.handle}:~</span>
        <button className="terminal-close" aria-label="Close terminal" onClick={() => setOpen(false)}>
          ×
        </button>
      </div>
      <div className="terminal-output" ref={outRef} aria-live="polite">
        {lines.map((l, i) => (
          <pre key={i} className={l.echo ? "terminal-echo" : undefined}>
            {l.text}
          </pre>
        ))}
      </div>
      <div className="terminal-line">
        <span className="terminal-prompt">$</span>
        <input
          ref={inputRef}
          className="terminal-input"
          type="text"
          autoComplete="off"
          spellCheck={false}
          aria-label="Terminal input"
          value={value}
          tabIndex={open ? 0 : -1}
          onChange={(e) => {
            play("key");
            setValue(e.target.value);
          }}
          onKeyDown={onKeyDown}
        />
      </div>
    </div>
  );
}
