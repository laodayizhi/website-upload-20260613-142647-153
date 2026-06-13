(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var nav = document.querySelector('[data-site-nav]');
    if (menuButton && nav) {
      menuButton.addEventListener('click', function () {
        nav.classList.toggle('open');
      });
    }

    document.querySelectorAll('[data-hero]').forEach(function (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
      var previous = hero.querySelector('[data-hero-prev]');
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

      function start() {
        window.clearInterval(timer);
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5200);
      }

      if (previous) {
        previous.addEventListener('click', function () {
          show(index - 1);
          start();
        });
      }

      if (next) {
        next.addEventListener('click', function () {
          show(index + 1);
          start();
        });
      }

      dots.forEach(function (dot, dotIndex) {
        dot.addEventListener('click', function () {
          show(dotIndex);
          start();
        });
      });

      show(0);
      start();
    });

    document.querySelectorAll('[data-filter-panel]').forEach(function (panel) {
      var scope = panel.closest('section') || document;
      var input = panel.querySelector('[data-filter-input]');
      var region = panel.querySelector('[data-filter-region]');
      var type = panel.querySelector('[data-filter-type]');
      var year = panel.querySelector('[data-filter-year]');
      var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));
      var empty = scope.querySelector('[data-empty-result]');

      function text(value) {
        return String(value || '').trim().toLowerCase();
      }

      function apply() {
        var query = text(input && input.value);
        var regionValue = text(region && region.value);
        var typeValue = text(type && type.value);
        var yearValue = text(year && year.value);
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = text([
            card.dataset.title,
            card.dataset.region,
            card.dataset.year,
            card.dataset.type,
            card.dataset.tags
          ].join(' '));
          var match = true;
          if (query && haystack.indexOf(query) === -1) {
            match = false;
          }
          if (regionValue && text(card.dataset.region).indexOf(regionValue) === -1) {
            match = false;
          }
          if (typeValue && text(card.dataset.type).indexOf(typeValue) === -1) {
            match = false;
          }
          if (yearValue && text(card.dataset.year) !== yearValue) {
            match = false;
          }
          card.classList.toggle('is-hidden', !match);
          if (match) {
            visible += 1;
          }
        });

        if (empty) {
          empty.classList.toggle('show', visible === 0);
        }
      }

      [input, region, type, year].forEach(function (control) {
        if (control) {
          control.addEventListener('input', apply);
          control.addEventListener('change', apply);
        }
      });
    });

    document.querySelectorAll('[data-player]').forEach(function (player) {
      var video = player.querySelector('video');
      var button = player.querySelector('[data-play]');
      var url = player.getAttribute('data-video-url');
      var attached = false;

      function attach() {
        if (!video || !url || attached) {
          return;
        }
        attached = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = url;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(url);
          hls.attachMedia(video);
          video.hlsInstance = hls;
        } else {
          video.src = url;
        }
      }

      function play() {
        attach();
        if (button) {
          button.classList.add('is-hidden');
        }
        video.controls = true;
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {});
        }
      }

      if (button && video) {
        button.addEventListener('click', play);
      }

      if (video) {
        video.addEventListener('click', function () {
          if (!attached) {
            play();
            return;
          }
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
        });
      }
    });
  });
})();
