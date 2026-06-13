(function () {
  var toggle = document.querySelector('[data-mobile-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var input = document.querySelector('[data-filter-input]');
  var typeSelect = document.querySelector('[data-filter-type]');
  var yearSelect = document.querySelector('[data-filter-year]');
  var reset = document.querySelector('[data-filter-reset]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
  var empty = document.querySelector('[data-empty-state]');

  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function applyFilter() {
    if (!cards.length) {
      return;
    }
    var keyword = normalize(input && input.value);
    var type = normalize(typeSelect && typeSelect.value);
    var year = normalize(yearSelect && yearSelect.value);
    var visible = 0;

    cards.forEach(function (card) {
      var text = normalize(card.getAttribute('data-search'));
      var cardType = normalize(card.getAttribute('data-type'));
      var cardYear = normalize(card.getAttribute('data-year'));
      var matched = true;

      if (keyword && text.indexOf(keyword) === -1) {
        matched = false;
      }
      if (type && cardType !== type) {
        matched = false;
      }
      if (year && cardYear !== year) {
        matched = false;
      }

      card.hidden = !matched;
      if (matched) {
        visible += 1;
      }
    });

    if (empty) {
      empty.classList.toggle('show', visible === 0);
    }
  }

  [input, typeSelect, yearSelect].forEach(function (node) {
    if (node) {
      node.addEventListener('input', applyFilter);
      node.addEventListener('change', applyFilter);
    }
  });

  if (reset) {
    reset.addEventListener('click', function () {
      if (input) {
        input.value = '';
      }
      if (typeSelect) {
        typeSelect.value = '';
      }
      if (yearSelect) {
        yearSelect.value = '';
      }
      applyFilter();
    });
  }
})();
