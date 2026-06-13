(function () {
  function attachStream(video) {
    var source = video.getAttribute('data-video-src');
    if (!source || video.dataset.ready === '1') {
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      video.dataset.ready = '1';
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      video.dataset.ready = '1';
      return;
    }

    video.src = source;
    video.dataset.ready = '1';
  }

  document.querySelectorAll('.player-shell').forEach(function (shell) {
    var video = shell.querySelector('video');
    var button = shell.querySelector('.play-trigger');

    if (!video || !button) {
      return;
    }

    function start() {
      attachStream(video);
      var playTask = video.play();
      shell.classList.add('is-playing');
      if (playTask && typeof playTask.catch === 'function') {
        playTask.catch(function () {
          shell.classList.remove('is-playing');
        });
      }
    }

    button.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });
    video.addEventListener('play', function () {
      shell.classList.add('is-playing');
    });
    video.addEventListener('pause', function () {
      shell.classList.remove('is-playing');
    });
  });
})();
