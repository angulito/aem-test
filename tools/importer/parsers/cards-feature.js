/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-feature block
 *
 * Source: https://frame.io
 * Base Block: cards
 *
 * Block Structure:
 * - Each row = one card
 * - Column 1 = icon/image (optional)
 * - Column 2 = text content (heading + description)
 *
 * Handles multiple source HTML patterns:
 *
 * Pattern 1 - Icon Touts (Touts_with4Touts):
 *   <div class="Touts_with4Touts___VPox">
 *     <div class="tout Touts_toutInnerWrapper__...">
 *       <div class="Touts_tout__...">
 *         <div class="Touts_iconWrapper__..."><div class="Touts_icon__..."><img .../></div></div>
 *         <div class="PortableText_portableText__...">
 *           <h6>Title</h6>
 *           <p>Description</p>
 *         </div>
 *       </div>
 *     </div>
 *   </div>
 *
 * Pattern 2 - Bento Feature Cards (Bentos_bentos):
 *   <article class="Bentos_bentos__...">
 *     <div class="Bentos_cardsGrid__...">
 *       <div class="Bentos_bentoCardWrapper__...">
 *         <div class="FeatureCard_bentoCard__...">
 *           <div class="PortableText_portableText__...">
 *             <h6>Title</h6><p>Description</p>
 *           </div>
 *           <div class="FeatureCard_mediaWrapper__..."><picture><img .../></picture></div>
 *         </div>
 *       </div>
 *     </div>
 *   </article>
 *
 * Pattern 3 - Pricing Cards (PricingOverview):
 *   <article class="PricingOverview_pricingOverview__...">
 *     <div class="PricingOverview_pricingCardsWrapper__...">
 *       <div class="PricingCard_pricingCard__...">
 *         <div class="PricingCard_cardEyebrow__...">For basic use</div>
 *         <div class="PricingCard_cardTitle__...">Free</div>
 *         <div class="PricingCard_cardContentWrapper__...">
 *           <div class="PricingCard_cardSecondaryTitle__...">$0</div>
 *           <div class="PricingCard_cardDescription__...">...</div>
 *           <ul class="PricingCard_cardDetailBullets__..."><li>...</li></ul>
 *           <a class="Button_...">Sign Up Now</a>
 *         </div>
 *       </div>
 *     </div>
 *   </article>
 *
 * Generated: 2026-02-09
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect which pattern we're dealing with
  const isTouts = element.querySelector('[class*="Touts_with4Touts"], [class*="Touts_with3Touts"]');
  const isBentos = element.querySelector('[class*="Bentos_cardsGrid"]');
  const isPricing = element.querySelector('[class*="PricingOverview_pricingCardsWrapper"], [class*="PricingCard_pricingCard"]');

  if (isTouts) {
    // Pattern 1: Icon Touts
    const touts = Array.from(element.querySelectorAll('[class*="Touts_tout__"]'));
    touts.forEach((tout) => {
      // Get icon image
      const iconImg = tout.querySelector('[class*="Touts_icon"] img, [class*="iconWrapper"] img');
      const iconCell = iconImg ? iconImg.cloneNode(true) : '';

      // Get text content
      const textContent = [];
      const title = tout.querySelector('h6, h5, h4, h3');
      if (title) textContent.push(title.cloneNode(true));
      const desc = tout.querySelector('p');
      if (desc) textContent.push(desc.cloneNode(true));

      cells.push([iconCell, textContent.length > 0 ? textContent : '']);
    });
  } else if (isBentos) {
    // Pattern 2: Bento Feature Cards
    const cards = Array.from(element.querySelectorAll('[class*="Bentos_bentoCardWrapper"]'));
    cards.forEach((card) => {
      // Get feature card content (skip shadow wrapper decorations)
      const featureCard = card.querySelector('[class*="FeatureCard_bentoCard"]');
      if (!featureCard) return;

      // Get main image from FeatureCard media wrapper (not shadow images)
      const mediaWrapper = featureCard.querySelector('[class*="FeatureCard_mediaWrapper"]');
      let cardImage = null;
      if (mediaWrapper) {
        // Get background media image (the actual content image, not shadow decorations)
        cardImage = mediaWrapper.querySelector('[class*="FeatureCard_backgroundMedia"] img')
          || mediaWrapper.querySelector('[class*="foregroundContainer"] [class*="Video_thumbnail"] img')
          || mediaWrapper.querySelector('picture img');
      }
      const imageCell = cardImage ? cardImage.cloneNode(true) : '';

      // Get text content
      const textContent = [];
      const title = featureCard.querySelector('h6, h5, h4, h3');
      if (title) textContent.push(title.cloneNode(true));
      const desc = featureCard.querySelector('p');
      if (desc) textContent.push(desc.cloneNode(true));

      cells.push([imageCell, textContent.length > 0 ? textContent : '']);
    });
  } else if (isPricing) {
    // Pattern 3: Pricing Cards
    const pricingCards = Array.from(element.querySelectorAll('[class*="PricingCard_pricingCard"]'));
    pricingCards.forEach((card) => {
      const textContent = [];

      // Eyebrow (e.g., "For basic use")
      const eyebrow = card.querySelector('[class*="cardEyebrow"]');
      if (eyebrow) {
        const em = document.createElement('em');
        em.textContent = eyebrow.textContent.trim();
        textContent.push(em);
      }

      // Plan title (e.g., "Free", "Pro")
      const planTitle = card.querySelector('[class*="cardTitle"]');
      if (planTitle) {
        const h3 = document.createElement('h3');
        h3.textContent = planTitle.textContent.trim();
        textContent.push(h3);
      }

      // Price
      const price = card.querySelector('[class*="cardSecondaryTitle"], [class*="cardPrice__"]');
      if (price) {
        const priceP = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = price.textContent.trim();
        priceP.appendChild(strong);

        // Price context (per member, per month)
        const contexts = Array.from(card.querySelectorAll('[class*="cardPriceContextLine"]'));
        if (contexts.length > 0) {
          const contextText = contexts.map((c) => c.textContent.trim()).join(' ');
          priceP.appendChild(document.createTextNode(' ' + contextText));
        }
        textContent.push(priceP);
      }

      // Description
      const desc = card.querySelector('[class*="cardDescription"]');
      if (desc) {
        const descP = document.createElement('p');
        descP.textContent = desc.textContent.trim();
        textContent.push(descP);
      }

      // Feature list
      const features = Array.from(card.querySelectorAll('[class*="cardDetailBulletText"]'));
      if (features.length > 0) {
        const ul = document.createElement('ul');
        features.forEach((f) => {
          const li = document.createElement('li');
          li.textContent = f.textContent.trim();
          ul.appendChild(li);
        });
        textContent.push(ul);
      }

      // CTA button
      const cta = card.querySelector('[class*="ctaRow"] a, [class*="cardDetailButton"]');
      if (cta) {
        const a = document.createElement('a');
        a.href = cta.href;
        const textSpan = cta.querySelector('[class*="buttonText"]');
        a.textContent = textSpan ? textSpan.textContent.trim() : cta.textContent.trim();
        textContent.push(a);
      }

      // No image column for pricing cards, use empty string
      cells.push(['', textContent.length > 0 ? textContent : '']);
    });
  } else {
    // Fallback: try generic item detection
    const items = Array.from(element.querySelectorAll(':scope > div > div, .tout'));
    items.forEach((item) => {
      const icon = item.querySelector('img, svg, picture');
      const iconCell = icon ? icon.cloneNode(true) : '';

      const textContent = [];
      const title = item.querySelector('h1, h2, h3, h4, h5, h6');
      if (title) textContent.push(title.cloneNode(true));
      const desc = item.querySelector('p');
      if (desc) textContent.push(desc.cloneNode(true));

      if (textContent.length > 0) {
        cells.push([iconCell, textContent]);
      }
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Feature', cells });
  element.replaceWith(block);
}
