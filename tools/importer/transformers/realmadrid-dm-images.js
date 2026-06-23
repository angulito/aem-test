/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: realmadrid.com Dynamic Media / Scene7 image handling.
 *
 * The realmadrid.com homepage serves its content imagery from
 * `assets.realmadrid.com` — a Scene7 vanity-domain CNAME. 34 image URLs in
 * migration-work/metadata.json `.images.mapping` have a path that starts with
 * `/is/image/` (e.g.
 *   https://assets.realmadrid.com/is/image/realmadrid/Bernabeu?$Desktop$&fit=wrap&wid=1440
 * ), which is the canonical Scene7 IS/Image signature. Per
 * references/dm-scene7-transformer.md the detector classifies any `/is/image/`
 * path as Scene7 regardless of hostname, precisely to catch vanity-domain
 * CNAMEs like this one.
 *
 * (The 36 `/is/content/` URLs in the mapping — sponsor logos and store badges —
 * are intentionally OUT OF SCOPE per the reference doc and are not touched
 * here. Most of the sponsor-logo `/is/content/` URLs are removed entirely by
 * realmadrid-cleanup.js anyway via `section.rm-sponsors`.)
 *
 * This transformer rewrites every Scene7 `<img>` into an anchor so the URL
 * round-trips through markdown intact; a companion client-side auto-block in
 * scripts/scripts.js (installed by the site-migration orchestrator) rebuilds
 * the anchors back into responsive <picture> elements at render time.
 *
 * 🚨 Runs in afterTransform ONLY. Block parsers run between beforeTransform and
 * afterTransform and extract <img> references into block cells (cards /
 * carousel image cells). Rewriting imgs to anchors in beforeTransform would
 * leave parsers with no <img> to extract, emptying those cells. Running
 * afterTransform lets parsers build their cells first; we then walk the
 * parser-modified DOM and rewrite Scene7 imgs wherever they ended up.
 *
 * Inlines only the helpers the server-side transformer needs
 * (detectDynamicMediaUrl, findLinkedDmCarrier, EMPTY_ALT_SENTINEL,
 * altToLinkText), kept byte-identical with references/dm-scene7-helpers.js. The
 * rendition builders, findDmOnAnchor, and linkTextToAlt live only in the
 * client-side auto-block.
 */

// ---- Begin canonical helpers (copy from dm-scene7-helpers.js) ----
function detectDynamicMediaUrl(urlStr) {
  let u;
  try { u = new URL(urlStr, 'https://x/'); } catch { return false; }
  // Scene7 detected by path alone — hostname is irrelevant because
  // customer sites routinely CNAME a vanity domain to Scene7 (e.g.
  // assets.realmadrid.com). Keep byte-identical with dm-scene7-helpers.js.
  if (u.pathname.startsWith('/is/image/')) {
    return 'scene7';
  }
  if (/^delivery-p\d+-e\d+\.adobeaemcloud\.com$/.test(u.hostname)
      && u.pathname.startsWith('/adobe/assets/urn:')) {
    return 'dm-openapi';
  }
  return false;
}

// Walk up from a DM <img> through allow-listed inline wrappers (currently
// just <picture>) to find the carrier anchor for the linked-image
// round-trip. Returns the outer <a> when the img is the sole meaningful
// descendant; null otherwise. Keep byte-identical with dm-scene7-helpers.js.
const LINKED_DM_INLINE_WRAPPER_TAGS = new Set(['PICTURE']);
const LINKED_DM_WRAPPER_SIBLING_TAGS = new Set(['SOURCE']); // standard <picture> siblings
function findLinkedDmCarrier(img) {
  if (!img || !img.parentElement) return null;
  let node = img;
  let parent = img.parentElement;
  while (parent && LINKED_DM_INLINE_WRAPPER_TAGS.has(parent.tagName)) {
    let foundNode = false;
    for (const child of parent.children) {
      if (child === node) {
        foundNode = true;
      } else if (!LINKED_DM_WRAPPER_SIBLING_TAGS.has(child.tagName)) {
        return null;
      }
    }
    if (!foundNode) return null;
    node = parent;
    parent = parent.parentElement;
  }
  if (!parent || parent.tagName !== 'A') return null;
  if (parent.children.length !== 1 || parent.children[0] !== node) return null;
  if (parent.textContent.trim() !== '') return null;
  return parent;
}

const EMPTY_ALT_SENTINEL = 'Image without alt text';

function altToLinkText(alt) {
  return alt || EMPTY_ALT_SENTINEL;
}
// ---- End canonical helpers ----

export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;
  const doc = element.ownerDocument;

  element.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src') || '';
    if (!detectDynamicMediaUrl(src)) return;

    // Preserve alt verbatim, including empty string for decorative images.
    // The auto-block uses the URL pattern (not the text) to find these
    // anchors, so the link text is purely a Document-view UX cue. When alt
    // is empty we substitute EMPTY_ALT_SENTINEL ('Image without alt text')
    // so authors editing the doc see a visible cell at the image's
    // position; the auto-block translates the sentinel back to alt="" via
    // linkTextToAlt() so screen readers correctly skip decorative images.
    const alt = img.getAttribute('alt') || '';

    // Linked image (incl. parser-wrapped `<a><picture><img></picture></a>`).
    // Stash DM URL in title, keep outer href; setting textContent replaces
    // any wrapper descendants with the link text.
    const linkedAnchor = findLinkedDmCarrier(img);
    if (linkedAnchor) {
      linkedAnchor.setAttribute('title', src);
      linkedAnchor.textContent = altToLinkText(alt);
      return;
    }

    // Inside an anchor but not a sole-meaningful-child shape — mixed
    // content. No clean single-anchor markdown representation; skip.
    const parent = img.parentElement;
    if (parent && parent.tagName === 'A') {
      // eslint-disable-next-line no-console
      console.warn('DM image inside mixed-content anchor, skipped:', src);
      return;
    }

    // Unlinked image: create an anchor whose href is the DM URL.
    const a = doc.createElement('a');
    a.href = src;
    a.textContent = altToLinkText(alt);
    img.replaceWith(a);
  });
}
