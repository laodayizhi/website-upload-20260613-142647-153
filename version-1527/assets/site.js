(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  selectAll('.nav-toggle').forEach(function (button) {
    button.addEventListener('click', function () {
      var nav = document.querySelector('.main-nav');
      if (nav) {
        nav.classList.toggle('is-open');
      }
    });
  });

  selectAll('[data-hero]').forEach(function (hero) {
    var slides = selectAll('.hero-slide', hero);
    var dots = selectAll('.hero-dot', hero);
    var index = 0;

    function show(next) {
      if (!slides.length) {
        return;
      }
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });

    show(0);
    if (slides.length > 1) {
      window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }
  });

  selectAll('[data-search-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('input');
      var query = input ? input.value.trim() : '';
      var target = 'search.html';
      if (query) {
        target += '?q=' + encodeURIComponent(query);
      }
      window.location.href = target;
    });
  });

  var filterInput = document.querySelector('[data-filter-input]');
  if (filterInput) {
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';
    filterInput.value = initial;

    function applyFilter() {
      var value = filterInput.value.trim().toLowerCase();
      var cards = selectAll('[data-filter-card]');
      var visible = 0;
      cards.forEach(function (card) {
        var text = (card.getAttribute('data-filter-card') || '').toLowerCase();
        var matched = !value || text.indexOf(value) !== -1;
        card.style.display = matched ? '' : 'none';
        if (matched) {
          visible += 1;
        }
      });
      var empty = document.querySelector('.empty-state');
      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    filterInput.addEventListener('input', applyFilter);
    applyFilter();
  }
})();
