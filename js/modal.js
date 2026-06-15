(function () {
  'use strict';

  function bindModal() {
    const overlay    = document.getElementById('modal-overlay');
    const requestBtn = document.getElementById('btn-request-dish');
    const closeBtn   = document.getElementById('btn-modal-close');
    const cancelBtn  = document.getElementById('btn-modal-cancel');
    const submitBtn  = document.getElementById('btn-modal-submit');

    if (!overlay) return false;

    function openModal() {
      overlay.classList.add('active');
      document.body.classList.add('modal-open');
      const firstInput = overlay.querySelector('input');
      if (firstInput) setTimeout(function () { firstInput.focus(); }, 100);
    }

    function closeModal() {
      overlay.classList.remove('active');
      document.body.classList.remove('modal-open');
    }

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
    });

    closeBtn  && closeBtn.addEventListener('click', closeModal);
    cancelBtn && cancelBtn.addEventListener('click', closeModal);
    submitBtn && submitBtn.addEventListener('click', closeModal);

    if (requestBtn && !requestBtn.dataset.bound) {
      requestBtn.addEventListener('click', openModal);
      requestBtn.dataset.bound = 'true';
    }

    return !!(overlay && requestBtn);
  }

  if (!bindModal()) {
    const interval = setInterval(function () {
      if (bindModal()) clearInterval(interval);
    }, 100);
  }

})();