const galleries = document.querySelectorAll('.chapter-gallery');
galleries.forEach((gallery) => {
  const folder = gallery.dataset.gallery;
  const count = Number(gallery.dataset.count);
  const images = [];
  for (let index = 1; index <= count; index += 1) {
    const image = document.createElement('img');
    image.className = `gallery-image${index === 1 ? ' active' : ''}`;
    image.src = `story/assets/${folder}/${String(index).padStart(2, '0')}.jpg`;
    image.alt = index === 1 ? `${gallery.dataset.alt}, image ${index} of ${count}` : '';
    if (index !== 1) image.setAttribute('aria-hidden', 'true');
    image.loading = 'lazy';
    image.decoding = 'async';
    gallery.append(image);
    images.push(image);
  }

  let active = 0;
  const controls = document.createElement('div');
  controls.className = 'gallery-controls';
  const caption = document.createElement('span');
  caption.className = 'gallery-caption';
  caption.setAttribute('aria-live', 'polite');
  const buttons = document.createElement('div');
  buttons.className = 'gallery-buttons';
  const previous = document.createElement('button');
  previous.type = 'button';
  previous.setAttribute('aria-label', 'Previous photo');
  previous.textContent = '←';
  const next = document.createElement('button');
  next.type = 'button';
  next.setAttribute('aria-label', 'Next photo');
  next.textContent = '→';
  buttons.append(previous, next);
  controls.append(caption, buttons);
  gallery.append(controls);

  const setFrameFormat = (image) => {
    if (!image.naturalWidth || !image.naturalHeight) {
      image.addEventListener('load', () => setFrameFormat(image), { once: true });
      return;
    }
    gallery.classList.toggle('portrait', image.naturalHeight > image.naturalWidth * 1.08);
  };

  const show = (index) => {
    images[active].classList.remove('active');
    images[active].alt = '';
    images[active].setAttribute('aria-hidden', 'true');
    active = (index + count) % count;
    images[active].classList.add('active');
    images[active].alt = `${gallery.dataset.alt}, image ${active + 1} of ${count}`;
    images[active].removeAttribute('aria-hidden');
    caption.textContent = `${String(active + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`;
    setFrameFormat(images[active]);
  };
  previous.addEventListener('click', () => show(active - 1));
  next.addEventListener('click', () => show(active + 1));
  gallery.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') show(active - 1);
    if (event.key === 'ArrowRight') show(active + 1);
  });
  show(0);
});

const chapters = [...document.querySelectorAll('.chapter')];
const navItems = [...document.querySelectorAll('.chapter-nav a')];
const counter = document.getElementById('rail-count');
const progress = document.getElementById('rail-progress-fill');
const rail = document.querySelector('.chapter-nav');
let activeChapter = -1;
let manualNavigationUntil = 0;

function setActive(index) {
  if (index === activeChapter || index < 0) return;
  activeChapter = index;
  navItems.forEach((item, itemIndex) => {
    item.classList.toggle('active', itemIndex === index);
    if (itemIndex === index) item.setAttribute('aria-current', 'location');
    else item.removeAttribute('aria-current');
  });
  counter.textContent = `${String(index + 1).padStart(2, '0')} / 08`;
  progress.style.width = `${((index + 1) / chapters.length) * 100}%`;
  if (window.innerWidth <= 800) {
    const item = navItems[index];
    rail.scrollTo({ left: item.offsetLeft - rail.clientWidth / 2 + item.clientWidth / 2, behavior: 'smooth' });
  }
}

navItems.forEach((item, index) => item.addEventListener('click', () => {
  manualNavigationUntil = Date.now() + 850;
  setActive(index);
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.07 });
chapters.forEach((chapter) => revealObserver.observe(chapter));

let pending = false;
function updateChapter() {
  pending = false;
  if (Date.now() < manualNavigationUntil) return;
  const guide = window.innerHeight * (window.innerWidth <= 800 ? 0.32 : 0.44);
  let current = 0;
  chapters.forEach((chapter, index) => {
    if (chapter.getBoundingClientRect().top <= guide) current = index;
  });
  setActive(current);
}
window.addEventListener('scroll', () => {
  if (!pending) {
    pending = true;
    requestAnimationFrame(updateChapter);
  }
}, { passive: true });
window.addEventListener('resize', updateChapter, { passive: true });
updateChapter();
