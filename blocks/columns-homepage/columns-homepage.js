function createPressCarousel(pressCol) {
  const list = pressCol.querySelector('ul');
  if (!list) return;

  const items = [...list.querySelectorAll('li')];
  if (items.length < 2) return;

  let activeIndex = 0;

  function showItem(idx) {
    items.forEach((item, i) => {
      item.style.display = i === idx ? 'block' : 'none';
    });
    activeIndex = idx;
    const dots = pressCol.querySelectorAll('.press-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === idx);
    });
  }

  const nav = document.createElement('div');
  nav.className = 'press-carousel-nav';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'press-prev';
  prevBtn.type = 'button';
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.addEventListener('click', () => {
    showItem(activeIndex <= 0 ? items.length - 1 : activeIndex - 1);
  });

  const dotsWrap = document.createElement('div');
  dotsWrap.className = 'press-dots';
  items.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'press-dot';
    dot.setAttribute('aria-label', `Show press release ${i + 1}`);
    dot.addEventListener('click', () => showItem(i));
    dotsWrap.append(dot);
  });

  const nextBtn = document.createElement('button');
  nextBtn.className = 'press-next';
  nextBtn.type = 'button';
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.addEventListener('click', () => {
    showItem(activeIndex >= items.length - 1 ? 0 : activeIndex + 1);
  });

  nav.append(prevBtn, dotsWrap, nextBtn);
  pressCol.append(nav);

  showItem(0);
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-homepage-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-homepage-img-col');
        }
      }
    });
  });

  const pressCol = block.querySelector(':scope > div > div:first-child');
  if (pressCol) createPressCarousel(pressCol);
}
