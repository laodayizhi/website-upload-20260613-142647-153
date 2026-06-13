(function () {
    var toggle = document.querySelector('[data-mobile-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            menu.classList.toggle('open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    if (slides.length > 0) {
        var active = 0;
        var show = function (index) {
            active = index;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === index);
            });
        };
        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                show(i);
            });
        });
        window.setInterval(function () {
            show((active + 1) % slides.length);
        }, 5200);
    }

    document.querySelectorAll('[data-go-search]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var input = form.querySelector('input');
            var value = input ? input.value.trim() : '';
            var url = './library.html';
            if (value) {
                url += '?keyword=' + encodeURIComponent(value);
            }
            window.location.href = url;
        });
    });

    document.querySelectorAll('[data-search-root]').forEach(function (root) {
        var input = root.querySelector('[data-search-input]');
        var buttons = Array.prototype.slice.call(root.querySelectorAll('[data-filter]'));
        var cards = Array.prototype.slice.call(root.querySelectorAll('.movie-card'));
        var empty = root.querySelector('[data-empty]');
        var current = 'all';
        var params = new URLSearchParams(window.location.search);
        var keyword = params.get('keyword');
        if (keyword && input) {
            input.value = keyword;
        }
        var matchEra = function (card) {
            if (current === 'all') {
                return true;
            }
            return card.getAttribute('data-era') === current;
        };
        var apply = function () {
            var query = input ? input.value.trim().toLowerCase() : '';
            var visible = 0;
            cards.forEach(function (card) {
                var text = card.getAttribute('data-search') || '';
                var ok = text.toLowerCase().indexOf(query) !== -1 && matchEra(card);
                card.style.display = ok ? '' : 'none';
                if (ok) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle('show', visible === 0);
            }
        };
        if (input) {
            input.addEventListener('input', apply);
        }
        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                buttons.forEach(function (item) {
                    item.classList.remove('active');
                });
                button.classList.add('active');
                current = button.getAttribute('data-filter') || 'all';
                apply();
            });
        });
        apply();
    });
})();
