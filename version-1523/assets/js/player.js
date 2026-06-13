(function () {
    var root = document.querySelector('[data-player]');
    if (!root) {
        return;
    }
    var video = root.querySelector('video');
    var layer = root.querySelector('[data-play-layer]');
    var button = root.querySelector('[data-play-button]');
    var stream = root.getAttribute('data-stream');
    var ready = false;
    var hls = null;

    var load = function () {
        if (ready || !video || !stream) {
            return;
        }
        ready = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(stream);
            hls.attachMedia(video);
        } else {
            video.src = stream;
        }
    };

    var start = function () {
        load();
        if (layer) {
            layer.classList.add('hidden');
        }
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
            promise.catch(function () {});
        }
    };

    if (button) {
        button.addEventListener('click', function (event) {
            event.stopPropagation();
            start();
        });
    }
    if (layer) {
        layer.addEventListener('click', start);
    }
    if (video) {
        video.addEventListener('click', function () {
            if (video.paused) {
                start();
            }
        });
    }
    window.addEventListener('beforeunload', function () {
        if (hls) {
            hls.destroy();
        }
    });
})();
