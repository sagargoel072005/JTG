window.openModal  = function () { console.warn('Modal not ready yet'); };
window.closeModal = function () {};

function loadComponent(id, file) {
  return fetch(file)
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.text();
    })
    .then(function (html) {
      const el = document.getElementById(id);
      if (!el) return;
      el.innerHTML = html;
      return id;
    })
    .catch(function (err) {
      console.warn('Error loading ' + file + ':', err);
    });
}

document.addEventListener('click', function (e) {
  if (e.target && e.target.id === 'btn-submit') {
    document.querySelectorAll('.contact-form input, .contact-form textarea')
      .forEach(function (el) { el.value = ''; });
  }
});

document.addEventListener('click', function (e) {
  if (e.target && e.target.id === 'btn-submit') {
    document.querySelectorAll('.contact-form input, .contact-form textarea')
      .forEach(function (el) { el.value = ''; });
  }

  if (e.target && e.target.id === 'btn-search') {
    const input = document.querySelector('.hero-search input');
    if (input) input.value = '';
  }
});

loadComponent('modal', 'components/modal.html').then(function () {
  if (typeof window.initModal === 'function') window.initModal();
});

const otherComponents = [
  ['header',        'components/header.html'],
  ['hero',          'components/hero.html'],
  ['home-kitchen',  'components/home-kitchen.html'],
  ['popular-items', 'components/popular-items.html'],
  ['video-section', 'components/video-section.html'],
  ['contact',       'components/contact.html'],
  ['footer',        'components/footer.html']
];

otherComponents.forEach(function (entry) {
  loadComponent(entry[0], entry[1]).then(function (id) {
    if (id === 'popular-items' && typeof window.initCarousel === 'function') {
      window.initCarousel();
    }
  });
});