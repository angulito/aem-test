/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-feature block
 *
 * Source: https://frame.io
 * Base Block: columns
 *
 * Block Structure:
 * - Each row has multiple columns side-by-side
 * - Each column can contain text, images, or mixed content
 *
 * Handles multiple source HTML patterns:
 *
 * Pattern 1 - 3-Column Touts (Touts_with3Touts):
 *   <div class="Touts_with3Touts___h2Qs">
 *     <div class="tout Touts_toutInnerWrapper__...">
 *       <div class="Touts_tout__...">
 *         <div class="PortableText_portableText__...">
 *           <h6>Organize everything</h6>
 *           <p>Flexible metadata...</p>
 *         </div>
 *       </div>
 *     </div>
 *     <!-- 2 more touts -->
 *   </div>
 *
 * Pattern 2 - Side-by-Side (SideBySides):
 *   <article class="SideBySides_sideBySides__...">
 *     <div class="SideBySideItem_sideBySide__...">
 *       <div class="SideBySideItem_contentWrapper__...">
 *         <span class="eyebrow">REVIEW & APPROVAL</span>
 *         <h2>Review with great accuracy and control.</h2>
 *         <div class="Touts_touts__...">
 *           <div class="tout"><h3>Precise feedback</h3><p>...</p></div>
 *           <div class="tout"><h3>Enhanced reviews</h3><p>...</p><a>CTA</a></div>
 *         </div>
 *       </div>
 *       <div class="MultiImageMediaContainer__...">
 *         <picture><img src="..."/></picture>
 *       </div>
 *     </div>
 *   </article>
 *
 * Pattern 3 - Carousel with Touts (CarouselWithToutsDesktop):
 *   <div class="CarouselWithToutsDesktop_desktopCarouselContainer__...">
 *     <!-- carousel slides with images + touts with text descriptions -->
 *   </div>
 *
 * Generated: 2026-02-09
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect which pattern we're dealing with
  const isTouts = element.querySelector('[class*="Touts_with3Touts"]');
  const isSideBySide = element.querySelector('[class*="SideBySideItem_sideBySide"]');
  const isCarousel = element.querySelector('[class*="CarouselWithToutsDesktop"], [class*="desktopCarousel"]');

  if (isTouts) {
    // Pattern 1: 3-Column Touts - each tout becomes a column in a single row
    const touts = Array.from(isTouts.querySelectorAll('[class*="Touts_tout__"]'));
    const row = [];

    touts.forEach((tout) => {
      const cellContent = [];

      const title = tout.querySelector('h6, h5, h4, h3');
      if (title) cellContent.push(title.cloneNode(true));

      const desc = tout.querySelector('p');
      if (desc) cellContent.push(desc.cloneNode(true));

      row.push(cellContent.length > 0 ? cellContent : '');
    });

    if (row.length > 0) {
      cells.push(row);
    }
  } else if (isSideBySide) {
    // Pattern 2: Side-by-Side layout - text column + image column
    const sideBySideItems = Array.from(element.querySelectorAll('[class*="SideBySideItem_sideBySide"]'));

    sideBySideItems.forEach((item) => {
      // Build text column content
      const textColumn = [];
      const contentWrapper = item.querySelector('[class*="contentWrapper"]');

      if (contentWrapper) {
        // Eyebrow
        const eyebrow = contentWrapper.querySelector('[class*="eyebrow"]');
        if (eyebrow) {
          const em = document.createElement('em');
          em.textContent = eyebrow.textContent.trim();
          textColumn.push(em);
        }

        // Main heading (use tag selectors only, not class-based to avoid matching wrapper divs)
        const heading = contentWrapper.querySelector('h2, h3');
        if (heading) textColumn.push(heading.cloneNode(true));

        // Sub-touts within the side-by-side
        const touts = Array.from(contentWrapper.querySelectorAll('[class*="Touts_tout__"]'));
        touts.forEach((tout) => {
          const toutTitle = tout.querySelector('h3, h6');
          if (toutTitle) textColumn.push(toutTitle.cloneNode(true));

          const toutDesc = tout.querySelector('p');
          if (toutDesc) textColumn.push(toutDesc.cloneNode(true));

          // CTA link within tout
          const toutCta = tout.querySelector('a[class*="Button_"]');
          if (toutCta) {
            const a = document.createElement('a');
            a.href = toutCta.href;
            const textSpan = toutCta.querySelector('[class*="buttonText"]');
            a.textContent = textSpan ? textSpan.textContent.trim() : toutCta.textContent.trim();
            textColumn.push(a);
          }
        });
      }

      // Build image column - get the main content image (not shadow decoration)
      const imageColumn = [];
      const mediaContainer = item.querySelector('[class*="MultiImageMediaContainer"]');

      if (mediaContainer) {
        // Get the main video thumbnail or foreground content image
        // Priority: Video thumbnail > GlassWrapper content image > Background element
        const mainImg = mediaContainer.querySelector('[class*="Video_thumbnail"] img')
          || mediaContainer.querySelector('[class*="GlassWrapper"] [class*="Video_thumbnail"] img')
          || mediaContainer.querySelector('[class*="GlassWrapperContent"] picture img')
          || mediaContainer.querySelector('[class*="mediaBackgroundElement"] img');

        if (mainImg) {
          imageColumn.push(mainImg.cloneNode(true));
        }
      }

      // Determine column order based on text-left vs text-right
      const isTextLeft = item.classList.toString().includes('isTextLeft')
        || item.querySelector('[class*="isTextLeft"]');

      if (isTextLeft) {
        cells.push([
          textColumn.length > 0 ? textColumn : '',
          imageColumn.length > 0 ? imageColumn : '',
        ]);
      } else {
        cells.push([
          imageColumn.length > 0 ? imageColumn : '',
          textColumn.length > 0 ? textColumn : '',
        ]);
      }
    });
  } else if (isCarousel) {
    // Pattern 3: Carousel with Touts - extract slides and descriptions
    // Get carousel image slides
    const slides = Array.from(element.querySelectorAll(
      '[class*="carouselSlide"] picture img, [class*="Slide_"] picture img'
    ));

    // Get tout descriptions
    const touts = Array.from(element.querySelectorAll('[class*="Touts_tout__"]'));

    if (slides.length > 0 || touts.length > 0) {
      // Image column
      const imageColumn = [];
      slides.forEach((slide) => {
        imageColumn.push(slide.cloneNode(true));
      });

      // If no slide images found, try getting any main content images
      if (imageColumn.length === 0) {
        const carouselImgs = Array.from(element.querySelectorAll(
          '[class*="Video_thumbnail"] img, [class*="Image_image"]:not([class*="Shadow"]) img, picture img'
        ));
        // Take first few non-shadow images
        carouselImgs.slice(0, 3).forEach((img) => {
          imageColumn.push(img.cloneNode(true));
        });
      }

      // Text column from touts
      const textColumn = [];
      touts.forEach((tout) => {
        const title = tout.querySelector('h6, h5, h4, h3');
        if (title) textColumn.push(title.cloneNode(true));

        const desc = tout.querySelector('p');
        if (desc) textColumn.push(desc.cloneNode(true));
      });

      cells.push([
        imageColumn.length > 0 ? imageColumn : '',
        textColumn.length > 0 ? textColumn : '',
      ]);
    }
  } else {
    // Fallback: treat direct children as columns
    const childDivs = Array.from(element.querySelectorAll(':scope > div'));
    if (childDivs.length > 0) {
      const row = childDivs.map((div) => {
        const content = [];
        const title = div.querySelector('h1, h2, h3, h4, h5, h6');
        if (title) content.push(title.cloneNode(true));
        const desc = div.querySelector('p');
        if (desc) content.push(desc.cloneNode(true));
        const img = div.querySelector('img');
        if (img) content.push(img.cloneNode(true));
        return content.length > 0 ? content : '';
      });
      cells.push(row);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns-Feature', cells });
  element.replaceWith(block);
}
