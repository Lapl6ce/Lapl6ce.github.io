"use client";

// Menu thumbnails and the bodies of fun mode's detail panels.

import { useState, type ReactNode } from "react";
import { SITE, domain, hueOf, liveSites, type Education, type Project, type TimelineEntry } from "@/content/site";
import { external } from "@/shared/links";
import { Icon, type IconName } from "./icons";
import { CHANGELOG } from "./config";

/** "Game card" thumbnail for a project: its screenshot, else a site screenshot, else generated. */
export function Thumb({ p, big = false }: { p: Project; big?: boolean }) {
  const cls = "thumb" + (big ? " thumb-big" : "");
  const img = p.preview || liveSites(p).find((s) => s.image)?.image;
  if (img) {
    return (
      <span className={cls}>
        <img src={img} alt="" />
      </span>
    );
  }
  const hash = hueOf(p.name);
  const initials = p.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return (
    <span className={cls} style={{ "--th": hash } as React.CSSProperties}>
      <span className="thumb-initials">{initials}</span>
      <span className="thumb-name">{p.name}</span>
    </span>
  );
}

function SiteCard({ site }: { site: { name: string; url: string; image?: string } }) {
  const [broken, setBroken] = useState(false);
  return (
    <a className="preview" href={site.url} target="_blank" rel="noopener">
      <span className="preview-bar">
        <span className="preview-url">{domain(site.url)}</span>↗
      </span>
      <span className="preview-shot">
        {site.image && !broken ? (
          <img src={site.image} alt={`Screenshot of ${site.name}`} loading="lazy" onError={() => setBroken(true)} />
        ) : (
          <span className="preview-fallback">{domain(site.url)}</span>
        )}
      </span>
      <span className="preview-name">{site.name}</span>
    </a>
  );
}

/** Clickable website previews for an entry, or null if it has none. */
export function SitePreviews({ item }: { item: { sites?: { name: string; url: string; image?: string }[] } }) {
  const sites = liveSites(item);
  if (!sites.length) return null;
  return (
    <div className="previews">
      {sites.map((s) => (
        <SiteCard key={s.url} site={s} />
      ))}
    </div>
  );
}

/** Label/value rows; rows with an empty value are skipped. */
export function InfoTable({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="info">
      {rows
        .filter(([, v]) => v)
        .map(([k, v]) => [<dt key={k + "t"}>{k}</dt>, <dd key={k + "d"}>{v}</dd>])}
    </dl>
  );
}

function Bullets({ points }: { points?: string[] }) {
  if (!points?.length) return null;
  return (
    <ul className="plist">
      {points.map((pt) => (
        <li key={pt}>{pt}</li>
      ))}
    </ul>
  );
}

/* ---------- panel bodies ---------- */

export function AboutPanel() {
  return (
    <>
      {SITE.about.map((p) => (
        <p key={p}>{p}</p>
      ))}
      <InfoTable rows={[["Role", SITE.role], ["School", SITE.school], ["Location", SITE.location], ["Status", SITE.status]]} />
    </>
  );
}

export function ContactPanel() {
  const { github, linkedin, upwork } = SITE.links;
  return (
    <>
      <p>{SITE.contactNote}</p>
      <InfoTable
        rows={[
          ["Email", <a key="e" href={`mailto:${SITE.email}`}>{SITE.email}</a>],
          ["GitHub", github && <a key="g" href={github} {...external(github)}>{domain(github)}</a>],
          ["LinkedIn", linkedin && <a key="l" href={linkedin} {...external(linkedin)}>{domain(linkedin)}</a>],
          ["Upwork", upwork && <a key="u" href={upwork} {...external(upwork)}>Upwork profile</a>],
        ]}
      />
    </>
  );
}

export function EducationPanel({ e }: { e: Education }) {
  return (
    <>
      <InfoTable rows={[["Program", e.degree], ["Dates", e.date], ["Location", e.location]]} />
      <Bullets points={e.points} />
    </>
  );
}

export function JobPanel({ j }: { j: TimelineEntry }) {
  return (
    <>
      <InfoTable rows={[["Organization", j.org], ["Dates", j.date], ["Location", j.location]]} />
      <Bullets points={j.points} />
    </>
  );
}

function LinkButton({ label, url, icon }: { label: string; url: string; icon: IconName }) {
  return (
    <a className="pbtn" href={url} {...external(url)}>
      <Icon name={icon} />
      {label}
    </a>
  );
}

export function ProjectPanel({ p }: { p: Project }) {
  const links = Object.entries(p.links).filter((e): e is [string, string] => !!e[1]);
  return (
    <>
      {liveSites(p).length ? <SitePreviews item={p} /> : <Thumb p={p} big />}
      {p.flow && p.flow.length > 0 && (
        <ol className="xflow" aria-label="How it works">
          {p.flow.map((step, i) => [
            i > 0 && <li key={step + "→"} className="xflow-arrow" aria-hidden="true">→</li>,
            <li key={step}>{step}</li>,
          ])}
        </ol>
      )}
      <p>{p.description || p.blurb}</p>
      <InfoTable rows={[["Year", p.year], ["Built with", p.tags.join(" · ")]]} />
      {links.length > 0 && (
        <div className="pbtns">
          {links.map(([k, u]) => (
            <LinkButton key={k} label={k[0].toUpperCase() + k.slice(1)} url={u} icon={k === "code" ? "code" : "link"} />
          ))}
        </div>
      )}
    </>
  );
}

export function SkillsPanel({ items }: { items: string[] }) {
  return (
    <ul className="chips">
      {items.map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ul>
  );
}

export function SystemPanel({ theme }: { theme: string }) {
  const [screen] = useState(() => (typeof window === "undefined" ? "" : `${innerWidth} × ${innerHeight}`));
  return (
    <>
      <InfoTable
        rows={[
          ["System Software", `Version ${CHANGELOG[0]?.version ?? "1.0"}`],
          ["Nickname", SITE.handle],
          ["Theme", theme],
          ["Screen", screen],
          ["Built with", "Next.js · React · TypeScript"],
        ]}
      />
      <h3>Update History</h3>
      <ul className="plist changelog">
        {CHANGELOG.map((c) => (
          <li key={c.version}>
            <strong>v{c.version}</strong>
            <span className="muted"> {c.date} </span> {c.note}
          </li>
        ))}
      </ul>
    </>
  );
}
