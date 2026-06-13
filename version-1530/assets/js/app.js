(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
      document.body.classList.toggle('menu-open', mobileNav.classList.contains('open'));
    });
  }

  var carousel = document.querySelector('[data-hero-carousel]');

  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var prev = carousel.querySelector('[data-hero-prev]');
    var next = carousel.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
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

    function startTimer() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(index - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(index + 1);
        startTimer();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        startTimer();
      });
    });

    startTimer();
  }

  var searchInput = document.querySelector('[data-search-input]');
  var filterYear = document.querySelector('[data-filter-year]');
  var filterType = document.querySelector('[data-filter-type]');
  var filterRegion = document.querySelector('[data-filter-region]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
  var noResults = document.querySelector('[data-no-results]');

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function applyFilters() {
    if (!cards.length) {
      return;
    }

    var query = normalize(searchInput ? searchInput.value : '');
    var year = filterYear ? filterYear.value : '';
    var type = filterType ? filterType.value : '';
    var region = filterRegion ? filterRegion.value : '';
    var visible = 0;

    cards.forEach(function (card) {
      var text = normalize(card.getAttribute('data-search'));
      var matchQuery = !query || text.indexOf(query) !== -1;
      var matchYear = !year || card.getAttribute('data-year') === year;
      var matchType = !type || card.getAttribute('data-type') === type;
      var matchRegion = !region || card.getAttribute('data-region') === region;
      var match = matchQuery && matchYear && matchType && matchRegion;

      card.style.display = match ? '' : 'none';

      if (match) {
        visible += 1;
      }
    });

    if (noResults) {
      noResults.style.display = visible ? 'none' : 'block';
    }
  }

  [searchInput, filterYear, filterType, filterRegion].forEach(function (control) {
    if (control) {
      control.addEventListener('input', applyFilters);
      control.addEventListener('change', applyFilters);
    }
  });

  if (searchInput && window.location.search) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');

    if (q) {
      searchInput.value = q;
      applyFilters();
    }
  }
})();

function initMoviePlayer(sourceUrl) {
  var video = document.querySelector('.watch-video');
  var overlay = document.querySelector('.player-overlay');
  var hlsInstance = null;
  var ready = false;

  if (!video || !sourceUrl) {
    return;
  }

  function revealPlayer() {
    if (overlay) {
      overlay.classList.add('hidden');
    }

    video.controls = true;
  }

  function loadPlayer() {
    if (!ready) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = sourceUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          maxBufferLength: 30,
          backBufferLength: 30
        });
        hlsInstance.loadSource(sourceUrl);
        hlsInstance.attachMedia(video);
      } else {
        video.src = sourceUrl;
      }

      ready = true;
    }

    revealPlayer();

    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  if (overlay) {
    overlay.addEventListener('click', loadPlayer);
  }

  video.addEventListener('click', function () {
    if (!ready) {
      loadPlayer();
      return;
    }

    if (video.paused) {
      video.play().catch(function () {});
    }
  });

  window.addEventListener('pagehide', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
