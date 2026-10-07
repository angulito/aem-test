/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AbbVie contact-location page builder.
 *
 * The contact-location pages (62 country/contact pages) are entirely default
 * content nested inside a single AEM container. This transformer rebuilds the
 * body into clean EDS sections:
 *   1. Hero        — hero-contact block: generated breadcrumb (Contact Center > Locations > Country)
 *                    + country H1, rendered as a blue banner with an overlapping white card
 *   2. Contact card — company heading + address + phones (centered via Section Metadata Style "contact-card")
 *   3. Legal text  — left-aligned disclosure paragraphs + register links
 * Separated by <hr> section breaks, with a trailing metadata block (Title, nav, footer).
 *
 * The breadcrumb + H1 are generated per page (country derived from the source H1),
 * so this generalizes to all 62 country pages for bulk import.
 *
 * Selectors validated against migration-work/cleaned.html (Croatia representative).
 * Runs at afterTransform, after cleanup has removed header/footer/cookie chrome.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const document = element.ownerDocument;
  const main = element.querySelector('#maincontent') || element;

  // --- Extract the three content pieces from the nested AEM container ---
  // 1. Title: the page H1 (country name). Prefer the title inside the x-large container
  //    (the breadcrumb button also echoes the country name, so scope to the H1).
  const h1 = main.querySelector('.title .cmp-title__text, h1.cmp-title__text, h1');

  // 2. Contact card: company name heading + address/phone paragraphs.
  const cardContainer = main.querySelector('.container.cmp-container-small');
  const cardHeading = cardContainer
    ? cardContainer.querySelector('.cmp-title__text, h1, h2, h3, h4, h5, h6')
    : null;
  const cardParagraphs = cardContainer
    ? Array.from(cardContainer.querySelectorAll('.cmp-text p'))
    : [];

  // 3. Legal text: disclosure paragraphs + links (the wide text block, not the card).
  let legalParagraphs = [];
  const textBlocks = Array.from(main.querySelectorAll('.text .cmp-text'));
  const legalBlock = textBlocks.find((tb) => !cardContainer || !cardContainer.contains(tb));
  if (legalBlock) {
    legalParagraphs = Array.from(legalBlock.children).filter(
      (el) => el.textContent.trim() || el.querySelector('a'),
    );
  }

  // --- Rebuild a clean body ---
  const sections = [];

  // Section 1: Hero — hero-contact block with generated breadcrumb + country H1.
  const countryName = h1 ? h1.textContent.trim() : '';
  if (countryName) {
    const cell = document.createElement('div');

    // Generated breadcrumb: Contact Center > Locations > <Country>
    const breadcrumb = document.createElement('p');
    breadcrumb.textContent = `Contact Center > Locations > ${countryName}`;
    cell.appendChild(breadcrumb);

    // Country heading
    const heading = document.createElement('h1');
    heading.textContent = countryName;
    cell.appendChild(heading);

    const heroBlock = WebImporter.Blocks.createBlock(document, {
      name: 'hero-contact',
      cells: [[cell]],
    });
    sections.push([heroBlock]);
  }

  // Section 2: Contact card (centered via Section Metadata)
  const cardEls = [];
  if (cardHeading) {
    const h = document.createElement('h3');
    h.textContent = cardHeading.textContent.trim();
    cardEls.push(h);
  }
  cardParagraphs.forEach((p) => cardEls.push(p));
  if (cardEls.length) {
    sections.push({ els: cardEls, style: 'contact-card' });
  }

  // Section 3: Legal disclosure text
  if (legalParagraphs.length) {
    sections.push(legalParagraphs);
  }

  // Clear the main content and write rebuilt sections separated by <hr>
  main.textContent = '';
  sections.forEach((section, idx) => {
    if (idx > 0) main.appendChild(document.createElement('hr'));
    const isStyled = !Array.isArray(section);
    const els = isStyled ? section.els : section;
    els.forEach((el) => main.appendChild(el));
    if (isStyled && section.style) {
      const sectionMetadata = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { Style: section.style },
      });
      main.appendChild(sectionMetadata);
    }
  });

  // --- Page metadata: Title + nav/footer fragments ---
  const titleText = (document.title || (h1 ? h1.textContent.trim() : '')).trim();
  const metaCells = {};
  if (titleText) metaCells.Title = titleText;
  metaCells.nav = '/content/nav';
  metaCells.footer = '/content/footer';
  const metaBlock = WebImporter.Blocks.createBlock(document, {
    name: 'Metadata',
    cells: metaCells,
  });
  main.appendChild(document.createElement('hr'));
  main.appendChild(metaBlock);
}
