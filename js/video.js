(function () {
  'use strict';

  function bindVideo() {
    const video     = document.getElementById('main-video');
    const btn       = document.getElementById('btn-video-play');
    const container = document.getElementById('video-container');

    if (!video || !btn || !container) return false;

    function togglePlay() {
      if (video.paused) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.then(function () {
            btn.classList.add('hidden');
          }).catch(function () {});
        } else {
          btn.classList.add('hidden');
        }
      } else {
        video.pause();
        btn.classList.remove('hidden');
      }
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      togglePlay();
    });

    container.addEventListener('click', function (e) {
      if (e.target === btn || btn.contains(e.target)) return;
      togglePlay();
    });

    video.addEventListener('ended', function () {
      btn.classList.remove('hidden');
    });

    return true;
  }

  if (!bindVideo()) {
    const interval = setInterval(function () {
      if (bindVideo()) clearInterval(interval);
    }, 100);
  }

})();