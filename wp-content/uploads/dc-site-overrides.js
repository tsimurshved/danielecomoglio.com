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

  var followUpCleanupScheduled = false;

  function stripLegacyState() {
    if (!document.body) return false;
    var changed = false;

    LEGACY_BODY_CLASSES.forEach(function (cls) {
      if (document.body.classList.contains(cls)) {
        document.body.classList.remove(cls);
        changed = true;
      }
    });

    if (!document.documentElement.classList.contains('loftloader-pro-hide')) {
      document.documentElement.classList.add('loftloader-pro-hide');
      changed = true;
    }

    return changed;
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
    if (mobileTrigger.getAttribute('data-dc-enhanced') === '1') return;

    mobileTrigger.setAttribute('aria-label', 'Toggle navigation menu');
    mobileTrigger.setAttribute('data-dc-enhanced', '1');

    document.querySelectorAll('.et_mobile_menu a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileTrigger.classList.add('closed');
        mobileTrigger.classList.remove('opened');
      });
    });
  }

  function runLegacyCleanup() {
    removeLoaderMarkup();
    stripLegacyState();

    // Run only a couple of delayed passes to catch late class injections
    // without keeping a long-lived MutationObserver active.
    if (followUpCleanupScheduled) return;
    followUpCleanupScheduled = true;

    window.setTimeout(function () {
      removeLoaderMarkup();
      stripLegacyState();
    }, 350);

    window.setTimeout(function () {
      removeLoaderMarkup();
      stripLegacyState();
    }, 1600);
  }

  document.addEventListener('DOMContentLoaded', function () {
    runLegacyCleanup();
    improveMobileMenuUX();
  });

  window.addEventListener('load', function () {
    runLegacyCleanup();
  });
})();
