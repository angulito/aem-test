# Figma → EDS Migration Plan: `figma-2026-08-06`

## Objective
Migrate the Positivus Landing Page design frame from Figma into an AEM Edge Delivery Services page named **`figma-2026-08-06`**, reproducing the design's sections, content, and visual styling as EDS blocks.

- **Source:** Figma frame — `Positivus-Landing-Page-Design (Community)`, node `330-762`
  (`https://www.figma.com/design/65rQjQiF6NQUmH789ZJNZQ/...?node-id=330-762`)
- **Target page name:** `figma-2026-08-06` → `content/figma-2026-08-06.plain.html`
- **Project type:** DA (Document Authoring), per `tools/importer/page-templates.json`
- **Preview:** `http://localhost:3000/content/figma-2026-08-06`

## Prerequisite: Enable the Figma migration capability
Figma-based migration relies on the **`excat-figma`** plugin, which is **not currently enabled**. It must be enabled before any Figma design data can be read.

- Enabling writes `.agents/settings.json` with `{"enabledPlugins": {"excat-figma@excat-extended": true}}`.
- This requires **your explicit confirmation** and **Execute mode** (plan mode cannot modify files).
- After enabling, the session auto-reinitializes on your next message and the Figma tooling becomes available.

> **This plan cannot be executed in Plan mode.** Approve the plan and switch to Execute mode. The first action will be to confirm enabling the `excat-figma` plugin.

## Assumptions (adjust if wrong)
- Full visual fidelity is desired (match the Figma design's look, not just structure).
- Only the single frame at `node-id=330-762` is in scope (the full landing page frame).
- Access to the Figma file is available to the connected Figma integration; if the design can't be read, we'll fall back to a screenshot-driven build.

## Approach
1. Enable `excat-figma`, then extract the design's structure, layout, text content, image assets, and design variables (colors, typography, spacing) from the Figma node.
2. Decompose the frame into ordered sections and map each to an EDS block — reusing existing blocks in `blocks/` where the pattern matches, creating new block variants only where needed.
3. Establish design tokens (colors, fonts, spacing) from Figma variables into the site styles, then style each block to match.
4. Assemble the content file `content/figma-2026-08-06.plain.html` with the block tables and metadata.
5. Verify the rendered page in the local preview against the Figma design and iterate to fidelity.

## Checklist
- [ ] Confirm and enable the `excat-figma` plugin (write `.agents/settings.json`) — requires Execute mode + user approval
- [ ] Extract Figma node `330-762`: screenshot, layout/structure metadata, text content, and image assets
- [ ] Extract Figma design variables (color palette, typography scale, spacing) for design tokens
- [ ] Decompose the frame into an ordered list of sections (hero, features, services, CTA, testimonials, footer, etc.)
- [ ] Map each section to a block: reuse existing `blocks/` variants where possible; flag any new variants needed
- [ ] Apply design tokens to site styles (`styles/styles.css`) — colors, fonts, spacing from Figma
- [ ] Generate/verify block JS + CSS for each mapped block to match the Figma visuals
- [ ] Download/reference the Figma image assets and confirm they resolve in the render
- [ ] Assemble `content/figma-2026-08-06.plain.html` (block tables + page metadata: title, description)
- [ ] Serve locally and verify `content/figma-2026-08-06` renders (blocks decorate, images load, no leftovers)
- [ ] Visually compare the rendered page against the Figma design and iterate on CSS to reach fidelity
- [ ] Report: sections migrated, blocks reused vs. created, asset/render verification, preview path

## Open Questions (will confirm during execution if needed)
- [ ] Visual fidelity target: pixel-close match vs. structure-first (assumed: close visual match)
- [ ] Scope: just this frame vs. multiple frames/pages (assumed: this single frame)
- [ ] Any block-naming or design-token conventions to follow beyond what's inferred from the Figma variables
