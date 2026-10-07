(function(){
  "use strict";

  var html = document.documentElement;
  var body = document.body;
  var langButtons = {
    es: document.getElementById('btn-es'),
    en: document.getElementById('btn-en')
  };
  var heroTitle = document.getElementById('hero-title');

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TRANSITION_MS = 220;
  var swapping = false;

  function setLang(lang){
    html.classList.toggle('lang-en', lang === 'en');
    html.setAttribute('lang', lang);
    Object.keys(langButtons).forEach(function(key){
      langButtons[key].setAttribute('aria-pressed', String(key === lang));
    });
  }

  function animateHeroSwap(lang){
    if (prefersReducedMotion) { setLang(lang); return; }
    if (swapping) return;
    swapping = true;
    heroTitle.classList.add('editing');
    body.classList.add('i18n-swap');
    window.setTimeout(function(){
      setLang(lang);
      window.setTimeout(function(){
        heroTitle.classList.remove('editing');
        body.classList.remove('i18n-swap');
        swapping = false;
      }, TRANSITION_MS);
    }, TRANSITION_MS);
  }

  Object.keys(langButtons).forEach(function(lang){
    langButtons[lang].addEventListener('click', function(){
      if (langButtons[lang].getAttribute('aria-pressed') === 'true') return;
      animateHeroSwap(lang);
    });
  });

  // el sitio siempre abre en inglés; el idioma elegido solo dura mientras la página está abierta

  // ---- excerpt original/translation toggles ----
  document.querySelectorAll('.excerpt-toggle').forEach(function(group){
    var buttons = group.querySelectorAll('button');
    buttons.forEach(function(btn){
      btn.addEventListener('click', function(){
        buttons.forEach(function(b){ b.setAttribute('aria-pressed','false'); });
        btn.setAttribute('aria-pressed','true');
        var targetId = btn.getAttribute('data-target');
        var container = group.parentElement;
        container.querySelectorAll('.excerpt-text').forEach(function(el){
          el.classList.toggle('is-hidden', el.id !== targetId);
        });
      });
    });
  });

  // ---- reveal on scroll ----
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

})();
