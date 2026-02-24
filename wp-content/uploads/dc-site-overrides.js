(function () {
  'use strict';

  var LEGACY_BODY_CLASSES = [
    'show-menu',
    'dm-custom-header',
    'dm-bm-pos-right',
    'dm-expand-shape',
    'dm-side-slide',
    'dm-circle-expand',
    'dm-menuside-right',
    'dm-ch-logo-pos-none',
    'dm-ch-cart-icon-pos-none',
    'dm-ch-search-icon-pos-none',
    'dm-not-fixed-scroll',
    'dm-fixed-header',
    'bc-expand-circle',
    'loftloader-pro-enabled',
    'dipi-anim-preload'
  ];

  function stripLegacyState() {
    if (!document.body) return;
    LEGACY_BODY_CLASSES.forEach(function (cls) {
      document.body.classList.remove(cls);
    });
    document.documentElement.classList.add('loftloader-pro-hide');
  }

  function removeLoaderMarkup() {
    var wrappers = document.querySelectorAll('#loftloader-wrapper');
    wrappers.forEach(function (el) {
      el.remove();
    });
  }

  function improveMobileMenuUX() {
    var mobileTrigger = document.querySelector('.et_mobile_nav_menu .mobile_nav');
    if (!mobileTrigger) return;

    mobileTrigger.setAttribute('aria-label', 'Toggle navigation menu');

    document.querySelectorAll('.et_mobile_menu a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileTrigger.classList.add('closed');
        mobileTrigger.classList.remove('opened');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    removeLoaderMarkup();
    stripLegacyState();
    improveMobileMenuUX();

    var observer = new MutationObserver(function () {
      stripLegacyState();
    });

    if (document.body) {
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
      });
    }
  });

  window.addEventListener('load', function () {
    removeLoaderMarkup();
    stripLegacyState();
  });
})();
