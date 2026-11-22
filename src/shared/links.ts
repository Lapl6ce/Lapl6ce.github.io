/** Mode entry points. Link to these with a plain <a>, not next/link: each mode has
 *  its own root layout, so crossing between them has to be a full page load. */
export const ROUTES = { professional: "/", play: "/play/" } as const;

/** Spread onto an <a>: external http(s) links open in a new tab. */
export const external = (url: string) => (/^https?:/.test(url) ? { target: "_blank", rel: "noopener" } : {});
