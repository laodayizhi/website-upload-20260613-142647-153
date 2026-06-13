(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupMenu() {
        var button = document.querySelector(".mobile-toggle");
        var nav = document.querySelector(".mobile-nav");
        if (!button || !nav) {
            return;
        }
        button.addEventListener("click", function () {
            nav.classList.toggle("open");
        });
    }

    function setupHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === index);
            });
        }

        function start() {
            clearInterval(timer);
            timer = setInterval(function () {
                show(index + 1);
            }, 5600);
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                start();
            });
        }
        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                show(dotIndex);
                start();
            });
        });
        show(0);
        start();
    }

    function normalize(value) {
        return (value || "").toString().trim().toLowerCase();
    }

    function setupFilters() {
        var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
        scopes.forEach(function (scope) {
            var input = scope.querySelector("[data-search-input]");
            var year = scope.querySelector("[data-year-filter]");
            var type = scope.querySelector("[data-type-filter]");
            var region = scope.querySelector("[data-region-filter]");
            var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));

            function apply() {
                var q = normalize(input && input.value);
                var y = normalize(year && year.value);
                var t = normalize(type && type.value);
                var r = normalize(region && region.value);
                cards.forEach(function (card) {
                    var text = normalize(card.getAttribute("data-text"));
                    var ok = true;
                    if (q && text.indexOf(q) === -1) {
                        ok = false;
                    }
                    if (y && normalize(card.getAttribute("data-year")) !== y) {
                        ok = false;
                    }
                    if (t && normalize(card.getAttribute("data-type")) !== t) {
                        ok = false;
                    }
                    if (r && normalize(card.getAttribute("data-region")) !== r) {
                        ok = false;
                    }
                    card.classList.toggle("hidden", !ok);
                });
            }

            [input, year, type, region].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", apply);
                    control.addEventListener("change", apply);
                }
            });
        });
    }

    window.initPlayer = function (streamUrl) {
        ready(function () {
            var video = document.getElementById("movie-player");
            var mask = document.getElementById("play-mask");
            if (!video || !streamUrl) {
                return;
            }
            var attached = false;
            var hls = null;

            function attach() {
                if (attached) {
                    return;
                }
                attached = true;
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = streamUrl;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: false
                    });
                    hls.loadSource(streamUrl);
                    hls.attachMedia(video);
                } else {
                    video.src = streamUrl;
                }
            }

            function begin() {
                attach();
                if (mask) {
                    mask.classList.add("is-hidden");
                }
                var playPromise = video.play();
                if (playPromise && typeof playPromise.catch === "function") {
                    playPromise.catch(function () {});
                }
            }

            attach();
            if (mask) {
                mask.addEventListener("click", begin);
            }
            video.addEventListener("click", function () {
                if (video.paused) {
                    begin();
                }
            });
            video.addEventListener("play", function () {
                if (mask) {
                    mask.classList.add("is-hidden");
                }
            });
            window.addEventListener("pagehide", function () {
                if (hls) {
                    hls.destroy();
                    hls = null;
                }
            });
        });
    };

    ready(function () {
        setupMenu();
        setupHero();
        setupFilters();
    });
})();
