/* Section pill bar on project pages: backdrop once stuck, highlight the section in view */
(function () {
  var bar = document.querySelector('.lg-jump');
  if (!bar) return;
  var update = function () {
    bar.classList.toggle('is-stuck', bar.getBoundingClientRect().top <= parseFloat(getComputedStyle(bar).top) + 1);
  };
  window.addEventListener('scroll', update, { passive: true });
  update();

  var links = [].slice.call(bar.querySelectorAll('a'));
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      links.forEach(function (a) { a.classList.remove('is-active'); });
      var a = map[e.target.id];
      if (a) {
        a.classList.add('is-active');
        a.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('.lg-section').forEach(function (s) { obs.observe(s); });
})();
