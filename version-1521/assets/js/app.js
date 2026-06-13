(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var toggle = document.querySelector('[data-menu-toggle]');
        var nav = document.querySelector('[data-mobile-nav]');
        if (toggle && nav) {
            toggle.addEventListener('click', function () {
                nav.classList.toggle('open');
            });
        }

        document.querySelectorAll('[data-hero]').forEach(function (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
            var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
            var prev = hero.querySelector('[data-hero-prev]');
            var next = hero.querySelector('[data-hero-next]');
            var index = 0;
            var timer = null;

            function show(nextIndex) {
                if (!slides.length) {
                    return;
                }
                index = (nextIndex + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle('active', slideIndex === index);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle('active', dotIndex === index);
                });
            }

            function restart() {
                if (timer) {
                    window.clearInterval(timer);
                }
                timer = window.setInterval(function () {
                    show(index + 1);
                }, 5200);
            }

            if (prev) {
                prev.addEventListener('click', function () {
                    show(index - 1);
                    restart();
                });
            }

            if (next) {
                next.addEventListener('click', function () {
                    show(index + 1);
                    restart();
                });
            }

            dots.forEach(function (dot, dotIndex) {
                dot.addEventListener('click', function () {
                    show(dotIndex);
                    restart();
                });
            });

            show(0);
            restart();
        });

        document.querySelectorAll('[data-filter-grid]').forEach(function (grid) {
            var panel = grid.parentElement.querySelector('.filter-panel');
            if (!panel) {
                return;
            }
            var input = panel.querySelector('[data-filter-input]');
            var typeSelect = panel.querySelector('[data-filter-type]');
            var yearSelect = panel.querySelector('[data-filter-year]');
            var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-card]'));

            function applyFilter() {
                var keyword = input ? input.value.trim().toLowerCase() : '';
                var type = typeSelect ? typeSelect.value : '';
                var year = yearSelect ? yearSelect.value : '';
                cards.forEach(function (card) {
                    var text = (card.getAttribute('data-search') || '').toLowerCase();
                    var cardType = card.getAttribute('data-type') || '';
                    var cardYear = card.getAttribute('data-year') || '';
                    var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
                    var matchedType = !type || cardType === type;
                    var matchedYear = !year || cardYear === year;
                    card.classList.toggle('is-filtered-out', !(matchedKeyword && matchedType && matchedYear));
                });
            }

            [input, typeSelect, yearSelect].forEach(function (element) {
                if (element) {
                    element.addEventListener('input', applyFilter);
                    element.addEventListener('change', applyFilter);
                }
            });
        });
    });
})();
