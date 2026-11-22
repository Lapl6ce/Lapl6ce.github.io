/* 48×48 line icons for the XMB menu (stroked white via CSS; `.f` = filled). */

const ICONS = {
  settings: (
    <>
      <path d="M7 14h15M32 14h9M7 24h5M22 24h19M7 34h19M36 34h5" />
      <circle cx="27" cy="14" r="4.5" />
      <circle cx="17" cy="24" r="4.5" />
      <circle cx="31" cy="34" r="4.5" />
    </>
  ),
  user: (
    <>
      <circle cx="24" cy="17" r="8" />
      <path d="M8 42c2-9 8.5-13 16-13s14 4 16 13" />
    </>
  ),
  briefcase: (
    <>
      <rect x="6" y="15" width="36" height="25" rx="4" />
      <path d="M17 15v-4a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v4M6 26h36" />
    </>
  ),
  star: <path d="M24 6l5.4 11.2 12.1 1.6-8.9 8.4 2.2 12L24 33.4 13.2 39.2l2.2-12-8.9-8.4 12.1-1.6z" />,
  gamepad: (
    <>
      <path d="M14 16h20c5 0 8 4 9 9l1.5 8c.6 3.5-3 5.5-5.5 3.5L33 31H15l-6 5.5c-2.5 2-6.1 0-5.5-3.5L5 25c1-5 4-9 9-9z" />
      <path d="M14 20v8M10 24h8" />
      <circle className="f" cx="31" cy="22" r="1.8" />
      <circle className="f" cx="36" cy="26" r="1.8" />
    </>
  ),
  chip: (
    <>
      <rect x="13" y="13" width="22" height="22" rx="3" />
      <rect x="19" y="19" width="10" height="10" rx="1" />
      <path d="M19 6v7M29 6v7M19 35v7M29 35v7M6 19h7M6 29h7M35 19h7M35 29h7" />
    </>
  ),
  globe: (
    <>
      <circle cx="24" cy="24" r="17" />
      <ellipse cx="24" cy="24" rx="7" ry="17" />
      <path d="M7 24h34M10 15h28M10 33h28" />
    </>
  ),
  doc: (
    <>
      <path d="M13 6h15l9 9v27H13z" />
      <path d="M28 6v9h9M18 24h14M18 30h14M18 36h9" />
    </>
  ),
  mail: (
    <>
      <rect x="6" y="12" width="36" height="25" rx="3" />
      <path d="M7 14l17 13 17-13" />
    </>
  ),
  school: (
    <>
      <path d="M4 19l20-9 20 9-20 9z" />
      <path d="M12 23v10c0 3 5.5 6 12 6s12-3 12-6V23M44 19v10" />
    </>
  ),
  palette: (
    <>
      <path d="M24 6a18 18 0 1 0 0 36c2.5 0 3.5-2 2.5-4s0-5 3-5h4.5A8 8 0 0 0 42 25C42 14.5 34 6 24 6z" />
      <circle className="f" cx="15" cy="22" r="2.4" />
      <circle className="f" cx="20" cy="14" r="2.4" />
      <circle className="f" cx="29" cy="14" r="2.4" />
      <circle className="f" cx="34" cy="21" r="2.4" />
    </>
  ),
  wave: (
    <>
      <path d="M4 30c6-8 10-8 16 0s10 8 16 0 6-6 8-4" />
      <path opacity=".55" d="M4 20c6-8 10-8 16 0s10 8 16 0 6-6 8-4" />
    </>
  ),
  speaker: (
    <>
      <path d="M8 19h7l10-8v26l-10-8H8z" />
      <path d="M31 18c2.5 3.5 2.5 8.5 0 12M36 13c5 6 5 16 0 22" />
    </>
  ),
  music: (
    <>
      <path d="M19 34V12l20-4v22" />
      <circle cx="14" cy="34" r="5" />
      <circle cx="34" cy="30" r="5" />
    </>
  ),
  swap: <path d="M8 17h30l-7-7M40 31H10l7 7" />,
  info: (
    <>
      <circle cx="24" cy="24" r="17" />
      <path d="M24 22v12" />
      <circle className="f" cx="24" cy="15.5" r="1.8" />
    </>
  ),
  link: <path d="M20 28l8-8M22 14l3-3a7 7 0 0 1 10 10l-3 3M26 34l-3 3a7 7 0 0 1-10-10l3-3" />,
  code: <path d="M17 14L7 24l10 10M31 14l10 10-10 10M27 10l-6 28" />,
};

export type IconName = keyof typeof ICONS;

export function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <span className={"ico " + className}>
      <svg viewBox="0 0 48 48" aria-hidden="true">
        {ICONS[name]}
      </svg>
    </span>
  );
}
