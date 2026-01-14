export default function decorate(block) {
  [...block.children].forEach((row) => {
    const label = row.querySelector(':scope > div:first-child');
    const content = row.querySelector(':scope > div:last-child');

    const details = document.createElement('details');
    details.className = 'accordion-item';

    const summary = document.createElement('summary');
    summary.className = 'accordion-label';
    summary.textContent = label?.textContent?.trim() || '';

    const body = document.createElement('div');
    body.className = 'accordion-content';
    if (content) body.append(...content.childNodes);

    details.append(summary, body);
    row.replaceWith(details);
  });
}
