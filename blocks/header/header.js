// media query match that indicates desktop width
const isDesktop = window.matchMedia('(width >= 900px)');

/**
 * Fetches the nav fragment (metadata-independent dual fetch: local preview first, then DA/EDS root)
 * @returns {Promise<{html: string, url: URL}|null>}
 */
async function fetchNav() {
  let path = '/content/nav.plain.html';
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) {
    path = '/nav.plain.html';
    resp = await fetch('/nav.plain.html');
  }
  if (!resp.ok) return null;
  return { html: await resp.text(), url: new URL(path, window.location.origin) };
}

/**
 * Resolves relative image paths against the fragment location so they work on any page depth
 * @param {Element} root The fragment root
 * @param {URL} baseUrl The URL the fragment was fetched from
 */
function resolveImages(root, baseUrl) {
  root.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src');
    if (!/^(https?:|data:|\/)/.test(src)) img.src = new URL(src, baseUrl).href;
  });
}

/**
 * Decorates a section made of a single promotional link as a floating badge
 * @param {Element} section The nav section
 */
function decorateBadge(section) {
  const link = section.querySelector('a');
  if (!link) return;
  link.className = 'nav-badge-link';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  const img = link.querySelector('img');
  if (img) {
    const logo = document.createElement('span');
    logo.className = 'nav-badge-logo';
    img.loading = 'lazy';
    img.width = 25;
    img.height = 25;
    logo.append(img);
    link.prepend(logo);
  }
  const label = document.createElement('span');
  label.className = 'nav-badge-text';
  [...link.childNodes].filter((n) => n.nodeType === Node.TEXT_NODE).forEach((n) => {
    label.append(n.textContent.trim());
    n.remove();
  });
  link.append(label);
  section.replaceChildren(link);
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navData = await fetchNav();
  block.textContent = '';
  if (!navData) return;

  const fragment = document.createElement('div');
  fragment.innerHTML = navData.html;
  resolveImages(fragment, navData.url);

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Site');
  [...fragment.children].forEach((section) => nav.append(section));

  const classes = ['brand', 'badge'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand && !navBrand.textContent.trim() && !navBrand.querySelector('img')) {
    navBrand.hidden = true;
  }

  const navBadge = nav.querySelector('.nav-badge');
  if (navBadge) decorateBadge(navBadge);

  // keep a viewport flag in sync so styles can react without a reload
  const syncViewport = () => nav.setAttribute('data-viewport', isDesktop.matches ? 'desktop' : 'mobile');
  syncViewport();
  isDesktop.addEventListener('change', syncViewport);

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
