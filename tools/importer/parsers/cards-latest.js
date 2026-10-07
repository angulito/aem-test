/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-latest. Base: cards.
 * Source: https://www.wknd-trendsetters.site/
 * Selector: main > section.secondary-section:nth-of-type(4) .grid-layout.desktop-4-column
 * Structure: 2 columns, one row per card — [image] | [meta (tag, date), linked heading].
 *
 * Cards are sibling <a class="article-card"> wrappers around block content. The importer's
 * html2md preprocessing can merge adjacent sibling anchors, so iteration is keyed on the
 * inner .article-card-body wrapper (paired with its sibling .article-card-image), with the
 * anchor iteration kept only as a fallback. The wrapper href is re-attached to the heading.
 * Generated: 2026-10-06
 */
export default function parse(element, { document }) {
  let items = [...element.querySelectorAll('.article-card-body')].map((body) => ({
    body,
    image: body.parentElement?.querySelector(':scope > .article-card-image img')
      || body.previousElementSibling?.querySelector('img'),
    href: body.closest('a')?.getAttribute('href'),
  }));

  if (!items.length) {
    // Fallback: iterate card anchors directly
    items = [...element.querySelectorAll(':scope > a')].map((card) => ({
      body: card.querySelector('[class*="body"]') || card,
      image: card.querySelector('img'),
      href: card.getAttribute('href'),
    }));
  }

  const cells = [];
  items.forEach(({ body, image, href }) => {
    const textCell = [];

    // Meta line: tag + date
    const metaParts = [...body.querySelectorAll('.article-card-meta > *')]
      .map((s) => s.textContent.trim())
      .filter(Boolean);
    if (metaParts.length) {
      const p = document.createElement('p');
      p.textContent = metaParts.join(' · ');
      textCell.push(p);
    }

    const heading = body.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      if (href) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = heading.textContent.trim();
        heading.textContent = '';
        heading.append(a);
      }
      textCell.push(heading);
    } else if (href) {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = body.textContent.trim() || href;
      textCell.push(a);
    }

    // Any description paragraphs
    body.querySelectorAll('p').forEach((p) => textCell.push(p));

    if (!image && !textCell.length) return;
    cells.push([image || '', textCell.length ? textCell : '']);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-latest', cells });
  element.replaceWith(block);
}
