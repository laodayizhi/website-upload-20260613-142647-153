(function () {
  function ready(callback) {
    if (document.readyState !== 'loading') {
      callback();
      return;
    }
    document.addEventListener('DOMContentLoaded', callback);
  }

  function initMobileNav() {
    var toggle = document.querySelector('[data-mobile-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function initHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    if (slides.length < 2) {
      return;
    }
    var current = 0;
    var timer = null;
    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }
    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }
    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    start();
  }

  function normalized(value) {
    return String(value || '').toLowerCase().trim();
  }

  function initFilters() {
    var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));
    panels.forEach(function (panel) {
      var root = panel.parentElement || document;
      var keywordInput = panel.querySelector('[data-filter-keyword]');
      var yearSelect = panel.querySelector('[data-filter-year]');
      var typeSelect = panel.querySelector('[data-filter-type]');
      var items = Array.prototype.slice.call(root.querySelectorAll('.filter-item'));
      var params = new URLSearchParams(window.location.search);
      var query = params.get('q');
      if (query && keywordInput) {
        keywordInput.value = query;
      }
      function apply() {
        var keyword = normalized(keywordInput && keywordInput.value);
        var year = normalized(yearSelect && yearSelect.value);
        var type = normalized(typeSelect && typeSelect.value);
        items.forEach(function (item) {
          var haystack = normalized([
            item.getAttribute('data-title'),
            item.getAttribute('data-region'),
            item.getAttribute('data-genre'),
            item.getAttribute('data-type'),
            item.getAttribute('data-year')
          ].join(' '));
          var itemYear = normalized(item.getAttribute('data-year'));
          var itemType = normalized(item.getAttribute('data-type'));
          var matched = true;
          if (keyword && haystack.indexOf(keyword) === -1) {
            matched = false;
          }
          if (year && itemYear !== year) {
            matched = false;
          }
          if (type && itemType !== type) {
            matched = false;
          }
          item.classList.toggle('is-hidden', !matched);
        });
      }
      [keywordInput, yearSelect, typeSelect].forEach(function (control) {
        if (control) {
          control.addEventListener('input', apply);
          control.addEventListener('change', apply);
        }
      });
      apply();
    });
  }

  function bindPlayer(wrapper, HlsLibrary) {
    var video = wrapper.querySelector('video[data-hls]');
    var cover = wrapper.querySelector('.player-cover');
    if (!video) {
      return;
    }
    function attach() {
      var url = video.getAttribute('data-hls');
      if (video.getAttribute('data-ready') === '1') {
        return;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      } else if (HlsLibrary && HlsLibrary.isSupported()) {
        var hls = new HlsLibrary({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(url);
        hls.attachMedia(video);
        video._hls = hls;
      } else {
        video.src = url;
      }
      video.setAttribute('data-ready', '1');
    }
    function play() {
      attach();
      if (cover) {
        cover.classList.add('is-hidden');
      }
      var result = video.play();
      if (result && typeof result.catch === 'function') {
        result.catch(function () {});
      }
    }
    if (cover) {
      cover.addEventListener('click', function (event) {
        event.preventDefault();
        play();
      });
    }
    video.addEventListener('click', function () {
      if (video.paused) {
        play();
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
  }

  window.initStaticPlayers = function (HlsLibrary) {
    var wrappers = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
    wrappers.forEach(function (wrapper) {
      bindPlayer(wrapper, HlsLibrary || window.Hls || null);
    });
  };

  ready(function () {
    initMobileNav();
    initHero();
    initFilters();
    window.initStaticPlayers(window.Hls || null);
  });
})();
