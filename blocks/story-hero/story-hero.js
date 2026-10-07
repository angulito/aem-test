/**
 * story-hero
 * Editorial article header for "Our Stories" pages:
 * a full-bleed hero image (no overlay text) followed BELOW the image, on white,
 * by a back-link, a meta line (date / category / read-time), the title and a dek.
 *
 * Expected authored rows (each row = one table row):
 *   1) Hero image (picture)
 *   2) Back-link (a single link, e.g. "All Stories")
 *   3) Meta line (date text, a category link, read-time text)
 *   4) Title (heading)
 *   5) Dek / subtitle (paragraph)
 *
 * Rows 2-5 are optional and order-tolerant: the image row is detected, the
 * remaining rows become the article header. The meta row is the row whose
 * cell holds a link plus plain text but no heading.
 */
export default function decorate(block) {
  const rows = [...block.children];

  // Image row = first row that contains a picture (full-bleed hero image).
  const imageRow = rows.find((r) => r.querySelector('picture'));
  if (imageRow) {
    imageRow.classList.add('story-hero-image');
  } else {
    block.classList.add('no-image');
  }

  // The below-image article header rows are authored in a fixed order:
  //   back-link, meta line (date / category / read-time), title, dek.
  // Classify by role: the title is the row with a heading; of the remaining
  // rows, the FIRST is the back-link, a link+text row is the meta line, and a
  // plain paragraph is the dek. Order is used to disambiguate the back-link
  // from the meta line (both contain a link).
  const headerRows = rows.filter((r) => r !== imageRow);
  let backAssigned = false;
  headerRows.forEach((row) => {
    const hasHeading = row.querySelector('h1, h2, h3, h4, h5, h6');
    const hasLink = row.querySelector('a');
    const onlyLink = hasLink && row.textContent.trim() === row.querySelector('a').textContent.trim();

    if (hasHeading) {
      row.classList.add('story-hero-title');
    } else if (onlyLink && !backAssigned) {
      // First bare-link row = back-link.
      row.classList.add('story-hero-back');
      backAssigned = true;
    } else if (hasLink) {
      // Link mixed with surrounding text = meta line (date / category / read-time).
      row.classList.add('story-hero-meta');
    } else {
      // Plain paragraph = dek / subtitle.
      row.classList.add('story-hero-dek');
    }
  });
}
