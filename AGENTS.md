# RAYAX page work

- Canonical editable sources are in `src/`; `outputs/` is generated. Never read generated standalone HTML, data URIs, ZIPs or font binaries into model context.
- Read `docs/decisions.md` first. Read only the relevant section of `docs/design-system.md` when needed. Preserve the latest approved appearance and the scope requested by the user.
- Reuse `src/shared/header.html`, `footer.html`, `icons.html`, `dialogs.html` and shared CSS. Page content lives in `src/pages/`; ordered interaction sections are listed in `src/pages.json`. Edit the smallest relevant file instead of rewriting the page.
- `python3 scripts/check.py` validates sources. `python3 scripts/build.py` updates preview files. Use `--package` only for final standalone HTML and ZIP deliverables.
- For a requested new page: `python3 scripts/new-page.py <slug> --title '<title>'`, then implement its content and page-specific interactions. Do not create extra pages without a request.
- After meaningful UI changes, run relevant browser checks and visually inspect changed regions. `scripts/browser-checks.mjs` accepts the supported CUA tab and viewport handles; it needs no external browser library. A content-only edit does not require repeating unrelated checks.
- On Windows use `C:/Users/User/AppData/Local/Programs/RTK/rtk.exe` (child-process HOME must resolve to `C:/Users/User`); on Linux prefer `/home/soroosh/.local/bin/rtk` for supported noisy Git/build/test command output. Native hook rewriting is not verified here. Keep source reads targeted; use raw output when compression obscures an error. RTK savings are not subscription savings.
- Reuse local assets. Desktop is the currently approved focus; mobile refinement is pending. Do not downgrade the model, omit requested interactions or weaken quality checks to save usage.

@RTK.md
