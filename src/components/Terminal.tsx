"use client";

/* Easter egg terminal, shared by both versions. Press ` anywhere to toggle.
   Other components can open it with openTerminal() and check isTerminalOpen(). */

import { useCallback, useEffect, useRef, useState } from "react";
import { SITE, LINK_LABELS } from "@/content/site";
import { play } from "@/lib/sfx";
import "./terminal.css";

const OPEN_EVENT = "terminal:open";
export const openTerminal = () => window.dispatchEvent(new Event(OPEN_EVENT));
export const isTerminalOpen = () => document.body.dataset.terminal === "open";

type Line = { text: string; echo?: boolean };

type Props = {
  mode: "classic" | "xmb";
  /** jump to a section: "about" | "projects" | "contact" | ... */
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

  // open/close effects
  const firstRender = useRef(true);
  useEffect(() => {
    document.body.dataset.terminal = open ? "open" : "closed";
    if (open) inputRef.current?.focus();
    if (firstRender.current) firstRender.current = false;
    else play(open ? "open" : "back");
  }, [open]);

  useEffect(() => {
    outRef.current?.scrollTo({ top: outRef.current.scrollHeight });
  }, [lines]);

  // global ` shortcut + programmatic open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
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
        mode === "xmb" ? "  classic    switch to the classic site" : "  xmb        switch to the XMB version",
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
        ...Object.entries(SITE.links)
          .filter(([, u]) => u)
          .map(([k, u]) => `${(LINK_LABELS[k] || k).toLowerCase().padEnd(10)}${u}`),
      ].join("\n"),
    resume: () => {
      if (!SITE.resume) return "no résumé linked yet.";
      window.open(SITE.resume, "_blank", "noopener");
      return "opening résumé...";
    },
    xmb: () => {
      location.href = "/play/";
      return "booting XMB...";
    },
    classic: () => {
      location.href = "/";
      return "loading classic site...";
    },
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
    e.stopPropagation(); // keep arrow keys etc. away from the XMB
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
