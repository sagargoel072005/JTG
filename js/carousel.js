window.initCarousel = function () {
  'use strict';

  const track         = document.getElementById('carousel-track');
  const dotsContainer = document.getElementById('carousel-dots');
  const prevBtn       = document.querySelector('.carousel-prev');
  const nextBtn       = document.querySelector('.carousel-next');

  if (!track) return;

  const cards      = track.querySelectorAll('.carousel-card');
  const totalCards = cards.length;
  const GAP        = 24;
  let currentIndex = 0;
  let autoTimer    = null;
  let dragMoved    = false;

  function getVisible() {
    const w = window.innerWidth;
    if (w <= 768)  return 1;
    if (w <= 1200) return 2;
    return 3;
  }

  function getMaxIndex()  { return Math.max(0, totalCards - getVisible()); }
  function getCardWidth() { return cards[0].offsetWidth + GAP; }

  function updateTrack() {
    track.style.transform = 'translateX(-' + (currentIndex * getCardWidth()) + 'px)';
  }

  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const count = getMaxIndex() + 1;
    for (let i = 0; i < count; i++) {
      const btn = document.createElement('button');
      btn.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
      btn.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      btn.addEventListener('click', function () { goTo(i); resetAuto(); });
      dotsContainer.appendChild(btn);
    }
  }

  function updateDots() {
    if (!dotsContainer) return;
    dotsContainer.querySelectorAll('.carousel-dot').forEach(function (d, i) {
      d.classList.toggle('active', i === currentIndex);
    });
  }

  function goTo(index) {
    currentIndex = Math.max(0, Math.min(index, getMaxIndex()));
    updateTrack();
    updateDots();
  }

  function goNext() { goTo(currentIndex + 1); }
  function goPrev() { goTo(currentIndex - 1); }

  prevBtn && prevBtn.addEventListener('click', function () { goPrev(); resetAuto(); });
  nextBtn && nextBtn.addEventListener('click', function () { goNext(); resetAuto(); });

  function startAuto() {
    autoTimer = setInterval(function () {
      const next = currentIndex + 1 > getMaxIndex() ? 0 : currentIndex + 1;
      goTo(next);
    }, 5000);
  }

  function resetAuto() { clearInterval(autoTimer); startAuto(); }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  { goPrev(); resetAuto(); }
    if (e.key === 'ArrowRight') { goNext(); resetAuto(); }
  });

  let dragStartX = 0;
  let isDragging = false;

  track.addEventListener('mousedown', function (e) {
    dragStartX = e.clientX; isDragging = true; dragMoved = false;
  });

  track.addEventListener('touchstart', function (e) {
    dragStartX = e.touches[0].clientX; isDragging = true; dragMoved = false;
  }, { passive: true });

  track.addEventListener('mousemove', function (e) {
    if (isDragging && Math.abs(dragStartX - e.clientX) > 5) dragMoved = true;
  });

  document.addEventListener('mouseup', function (e) {
    if (!isDragging) return;
    const diff = dragStartX - e.clientX;
    if (Math.abs(diff) > 50) { goTo(currentIndex + (diff > 0 ? 1 : -1)); resetAuto(); }
    isDragging = false; dragMoved = false;
  });

  document.addEventListener('touchend', function (e) {
    if (!isDragging) return;
    const diff = dragStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { goTo(currentIndex + (diff > 0 ? 1 : -1)); resetAuto(); }
    isDragging = false;
  });

  window.addEventListener('resize', function () {
    if (currentIndex > getMaxIndex()) currentIndex = getMaxIndex();
    buildDots();
    updateTrack();
  });

  buildDots();
  updateTrack();
  startAuto();

  function buildQtyCounter(label) {
    const wrap = document.createElement('div');
    wrap.className = 'c-qty';

    const minus = document.createElement('button');
    minus.className = 'qty-btn qty-minus';
    minus.setAttribute('aria-label', 'Decrease ' + label);
    minus.innerHTML = '&#8722;';

    const valSpan = document.createElement('span');
    valSpan.className = 'qty-val';
    valSpan.textContent = '1';

    const plus = document.createElement('button');
    plus.className = 'qty-btn qty-plus';
    plus.setAttribute('aria-label', 'Increase ' + label);
    plus.innerHTML = '&#43;';

    wrap.appendChild(minus);
    wrap.appendChild(valSpan);
    wrap.appendChild(plus);

    let qty = 1;

    plus.addEventListener('click', function (e) {
      e.stopPropagation();
      qty++;
      valSpan.textContent = qty;
    });

    minus.addEventListener('click', function (e) {
      e.stopPropagation();
      qty--;
      if (qty <= 0) {
        wrap.parentNode.replaceChild(buildAddBtn(label), wrap);
        return;
      }
      valSpan.textContent = qty;
    });

    return wrap;
  }

  function buildAddBtn(label) {
    const btn = document.createElement('button');
    btn.className = 'c-add-btn';
    btn.setAttribute('aria-label', 'Add ' + label);
    btn.innerHTML = '&#43;';

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (dragMoved) return;
      btn.parentNode.replaceChild(buildQtyCounter(label), btn);
    });

    return btn;
  }

  track.querySelectorAll('.c-add-btn').forEach(function (btn) {
    const label = (btn.getAttribute('aria-label') || 'item').replace(/^Add\s+/i, '');
    btn.parentNode.replaceChild(buildAddBtn(label), btn);
  });

  track.querySelectorAll('.c-qty').forEach(function (wrap) {
    const card    = wrap.closest('.carousel-card');
    const label   = card ? (card.querySelector('.carousel-name') || {}).textContent || 'item' : 'item';
    const minus   = wrap.querySelector('.qty-minus');
    const plus    = wrap.querySelector('.qty-plus');
    const valSpan = wrap.querySelector('.qty-val');
    let qty       = parseInt(valSpan.textContent, 10) || 1;

    plus && plus.addEventListener('click', function (e) {
      e.stopPropagation(); qty++; valSpan.textContent = qty;
    });

    minus && minus.addEventListener('click', function (e) {
      e.stopPropagation(); qty--;
      if (qty <= 0) {
        wrap.parentNode.replaceChild(buildAddBtn(label.trim()), wrap);
        return;
      }
      valSpan.textContent = qty;
    });
  });

  const prevBtnImg = prevBtn && prevBtn.querySelector('img');
  const nextBtnImg = nextBtn && nextBtn.querySelector('img');

  if (prevBtnImg) {
    prevBtn.addEventListener('mouseenter', function () {
      prevBtnImg.src = prevBtnImg.src.replace('left-arrow.png', 'left-arrow-invert.png');
    });
    prevBtn.addEventListener('mouseleave', function () {
      prevBtnImg.src = prevBtnImg.src.replace('left-arrow-invert.png', 'left-arrow.png');
    });
  }

  if (nextBtnImg) {
    nextBtn.addEventListener('mouseenter', function () {
      nextBtnImg.src = nextBtnImg.src.replace('right-arrow.png', 'right-arrow-invert.png');
    });
    nextBtn.addEventListener('mouseleave', function () {
      nextBtnImg.src = nextBtnImg.src.replace('right-arrow-invert.png', 'right-arrow.png');
    });
  }
};