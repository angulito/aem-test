export default function decorate(block) {
  const rows = [...block.children];
  const contentRow = rows[0];
  const content = (contentRow && contentRow.firstElementChild) || contentRow;
  if (content) {
    content.classList.add('hero-contact-content');
    const breadcrumb = content.querySelector('p');
    if (breadcrumb) breadcrumb.classList.add('hero-contact-breadcrumb');
  }
}
