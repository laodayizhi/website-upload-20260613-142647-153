(function () {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
            return;
        }
        document.addEventListener("DOMContentLoaded", callback);
    }

    function initMenu() {
        var button = document.querySelector("[data-menu-button]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!button || !nav) {
            return;
        }
        button.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function initHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        if (slides.length < 2) {
            return;
        }
        var index = 0;
        var timer = null;
        function show(nextIndex) {
            index = nextIndex;
            slides.forEach(function (slide, itemIndex) {
                slide.classList.toggle("is-active", itemIndex === index);
            });
            dots.forEach(function (dot, itemIndex) {
                dot.classList.toggle("is-active", itemIndex === index);
            });
        }
        function next() {
            show((index + 1) % slides.length);
        }
        function start() {
            stop();
            timer = window.setInterval(next, 5200);
        }
        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }
        dots.forEach(function (dot, itemIndex) {
            dot.addEventListener("click", function () {
                show(itemIndex);
                start();
            });
        });
        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        start();
    }

    function normalize(text) {
        return String(text || "").toLowerCase().replace(/\s+/g, " ").trim();
    }

    function initFilters() {
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
        if (!cards.length) {
            return;
        }
        var search = document.querySelector("[data-card-search]");
        var region = document.querySelector("[data-filter-region]");
        var year = document.querySelector("[data-filter-year]");
        var empty = document.querySelector("[data-empty-state]");
        function apply() {
            var query = normalize(search ? search.value : "");
            var regionValue = region ? region.value : "";
            var yearValue = year ? year.value : "";
            var visible = 0;
            cards.forEach(function (card) {
                var text = normalize(card.getAttribute("data-search"));
                var okQuery = !query || text.indexOf(query) !== -1;
                var okRegion = !regionValue || card.getAttribute("data-region") === regionValue;
                var okYear = !yearValue || card.getAttribute("data-year") === yearValue;
                var ok = okQuery && okRegion && okYear;
                card.classList.toggle("is-hidden", !ok);
                if (ok) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle("is-visible", visible === 0);
            }
        }
        [search, region, year].forEach(function (control) {
            if (control) {
                control.addEventListener("input", apply);
                control.addEventListener("change", apply);
            }
        });
        var params = new URLSearchParams(window.location.search);
        var q = params.get("q");
        if (q && search) {
            search.value = q;
        }
        apply();
    }

    function initPlayer(streamUrl) {
        var video = document.querySelector("[data-player-video]");
        var button = document.querySelector("[data-player-button]");
        if (!video || !button || !streamUrl) {
            return;
        }
        var attached = false;
        function playVideo() {
            button.classList.add("is-hidden");
            if (!attached) {
                attached = true;
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = streamUrl;
                    video.addEventListener("loadedmetadata", function () {
                        video.play().catch(function () {});
                    }, { once: true });
                } else if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls({ enableWorker: true });
                    hls.loadSource(streamUrl);
                    hls.attachMedia(video);
                    hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                        video.play().catch(function () {});
                    });
                } else {
                    video.src = streamUrl;
                    video.play().catch(function () {});
                }
            } else {
                video.play().catch(function () {});
            }
        }
        button.addEventListener("click", playVideo);
        video.addEventListener("click", function () {
            if (video.paused) {
                playVideo();
            }
        });
    }

    ready(function () {
        initMenu();
        initHero();
        initFilters();
    });

    window.MovieSite = {
        initPlayer: initPlayer
    };
})();
