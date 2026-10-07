/**
 * Fetches the footer fragment (metadata-independent dual fetch: local preview first, then DA/EDS root)
 * @returns {Promise<string|null>}
 */
async function fetchFooter() {
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  return resp.ok ? resp.text() : null;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const html = await fetchFooter();
  block.textContent = '';
  if (!html) return;

  const fragment = document.createElement('div');
  fragment.innerHTML = html;

  const nav = document.createElement('nav');
  nav.className = 'footer-links';
  nav.setAttribute('aria-label', 'Legal links');

  fragment.querySelectorAll('a[href]').forEach((link) => {
    link.className = 'footer-link';
    // external links open in a new tab, like the source
    if (/^https?:/.test(link.getAttribute('href')) && new URL(link.href).origin !== window.location.origin) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    nav.append(link);
  });

  block.append(nav);
}
