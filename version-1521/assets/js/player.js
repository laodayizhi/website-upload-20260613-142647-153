var MoviePlayer = (function () {
    function mount(id, source) {
        var root = document.getElementById(id);
        if (!root) {
            return;
        }
        var video = root.querySelector('video');
        var cover = root.querySelector('[data-play-cover]');
        var error = root.querySelector('[data-play-error]');
        var hls = null;
        var attached = false;

        function showError() {
            if (error) {
                error.textContent = '视频加载暂时不可用';
                error.hidden = false;
            }
        }

        function attach() {
            if (attached || !video) {
                return;
            }
            attached = true;
            if (window.Hls && window.Hls.isSupported()) {
                hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                hls.on(Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        showError();
                    }
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else {
                showError();
            }
        }

        function start() {
            attach();
            if (cover) {
                cover.classList.add('is-hidden');
            }
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {
                    if (cover) {
                        cover.classList.remove('is-hidden');
                    }
                });
            }
        }

        if (cover) {
            cover.addEventListener('click', start);
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                start();
            }
        });

        video.addEventListener('play', function () {
            if (cover) {
                cover.classList.add('is-hidden');
            }
        });

        video.addEventListener('pause', function () {
            if (cover && video.currentTime === 0) {
                cover.classList.remove('is-hidden');
            }
        });

        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    }

    return {
        mount: mount
    };
})();
