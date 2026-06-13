(function () {
  window.initMoviePlayer = function (videoId, source) {
    var video = document.getElementById(videoId);
    if (!video || !source) {
      return;
    }

    var shell = video.closest('.player-shell');
    var overlay = shell ? shell.querySelector('.player-overlay') : null;
    var errorBox = shell ? shell.querySelector('.player-error') : null;
    var attached = false;

    function showError(message) {
      if (errorBox) {
        errorBox.textContent = message;
        errorBox.classList.add('is-visible');
      }
    }

    function hideOverlay() {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    }

    function showOverlay() {
      if (overlay) {
        overlay.classList.remove('is-hidden');
      }
    }

    function attachSource() {
      if (attached) {
        return;
      }
      attached = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (eventName, data) {
          if (data && data.fatal) {
            showError('视频暂时无法播放');
          }
        });
        video._hls = hls;
        return;
      }

      video.src = source;
    }

    function playVideo() {
      attachSource();
      var result = video.play();
      if (result && typeof result.catch === 'function') {
        result.catch(function () {
          showOverlay();
        });
      }
    }

    attachSource();

    if (overlay) {
      overlay.addEventListener('click', function () {
        playVideo();
      });
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        playVideo();
      } else {
        video.pause();
      }
    });

    video.addEventListener('play', hideOverlay);
    video.addEventListener('pause', showOverlay);
    video.addEventListener('ended', showOverlay);
  };
})();
