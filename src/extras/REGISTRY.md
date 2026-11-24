# Extras

Self-contained features layered on the site. Each can be removed by deleting its
folder and everything between its `extra:<slug>` / `/extra:<slug>` markers
(except no-terminal, which is undone with its patch; see below).

## no-terminal
- What: removes the backtick terminal from the professional site (fun mode keeps its own). It deletes original code rather than adding any, so it is recorded as a patch instead of markers.
- Added: 2026-11-22
- Folder: src/extras/no-terminal/ (no-terminal.patch)
- Mount points:
  - src/app/(professional)/page.tsx (Terminal import and `<Terminal mode="professional" />` deleted)
  - src/professional/sections/Footer.tsx ("press ` for a terminal" deleted)
  - Patch regenerated 2026-11-23 for the DESIGN.md restyle. The ASCII name banner it also used to touch is gone, so restoring the terminal no longer makes the hero name clickable; the backtick key still opens it.
- Notes: to restore the terminal, run `git apply -R src/extras/no-terminal/no-terminal.patch` from the repo root, then delete the folder and this entry. src/shared/Terminal.tsx itself is untouched.
