/* Shared mobile menu. Lives outside the React root so re-renders never remove it. */
(function () {
  var links = [
    ['Home', 'index.html'],
    ['Coaching', 'coaching.html'],
    ['My Story', 'story.html'],
    ['Client voices', 'client-voices.html'],
    ['AI mentoring', 'index.html#ai'],
    ['Journey', 'index.html#journey']
  ];
  var arrow = '<span class="arrow-ne" aria-hidden="true"></span>';
  var page = location.pathname.split('/').pop() || 'index.html';

  var toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'menu-toggle';
  toggle.setAttribute('aria-label', 'Open menu');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'site-menu');
  toggle.innerHTML = '<span></span><span></span>';

  var menu = document.createElement('nav');
  menu.id = 'site-menu';
  menu.className = 'site-menu';
  menu.setAttribute('aria-label', 'Menu');
  menu.innerHTML =
    '<p class="site-menu-label">MENU</p><ol>' +
    links.map(function (l, i) {
      var current = l[1] === page ? ' aria-current="page"' : '';
      return '<li style="transition-delay:' + (60 + i * 45) + 'ms"><a href="' + l[1] + '"' + current + '><small>0' + (i + 1) + '</small>' + l[0] + '</a></li>';
    }).join('') +
    '</ol><a class="site-menu-talk" href="contact.html">Let’s talk ' + arrow + '</a>' +
    '<div class="site-menu-social"><a href="https://www.linkedin.com/in/jantrautwein/" target="_blank" rel="noreferrer">LinkedIn</a>' +
    '<a href="https://www.instagram.com/jan_trautwein/" target="_blank" rel="noreferrer">Instagram</a></div>';

  function setOpen(open) {
    document.documentElement.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.inert = !open;
    if (open) menu.querySelector('a').focus({ preventScroll: true });
  }

  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  menu.inert = true;
  document.body.appendChild(menu);
  document.body.appendChild(toggle);
})();
