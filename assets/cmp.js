(function () {
  'use strict';

  var CONSENT_KEY = 'dc_cmp_consent_v1';
  var banner = document.getElementById('cmp-banner');
  var modal = document.getElementById('cmp-modal');
  var acceptAllBtn = document.getElementById('cmp-accept-all');
  var rejectAllBtn = document.getElementById('cmp-reject-all');
  var openPrefsBtn = document.getElementById('cmp-open-preferences');
  var closePrefsBtn = document.getElementById('cmp-close');
  var cmpForm = document.getElementById('cmp-form');
  var mediaCheckbox = document.getElementById('cmp-media-consent');
  var modalAcceptAllBtn = document.getElementById('cmp-modal-accept-all');
  var modalRejectAllBtn = document.getElementById('cmp-modal-reject-all');
  var reviewButtons = document.querySelectorAll('[data-consent-open]');

  function normalizeConsent(raw) {
    return {
      necessary: true,
      media: Boolean(raw && raw.media),
      updatedAt: (raw && raw.updatedAt) || new Date().toISOString(),
      version: 1
    };
  }

  function loadConsent() {
    try {
      var serialized = localStorage.getItem(CONSENT_KEY);
      if (!serialized) return null;
      return normalizeConsent(JSON.parse(serialized));
    } catch (error) {
      return null;
    }
  }

  function saveConsent(consent) {
    var normalized = normalizeConsent(consent);
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(normalized));
    } catch (error) {
      // Ignore storage errors and keep runtime consent only.
    }
    return normalized;
  }

  function hideBanner() {
    if (banner) {
      banner.hidden = true;
    }
  }

  function showBanner() {
    if (banner) {
      banner.hidden = false;
    }
  }

  function openPreferences(consent) {
    if (!modal || !mediaCheckbox) return;
    var current = normalizeConsent(consent || loadConsent() || { media: false });
    mediaCheckbox.checked = current.media;
    modal.hidden = false;
    document.body.classList.add('popup-open');
  }

  function closePreferences() {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove('popup-open');
  }

  function mountYouTubeEmbeds() {
    var embeds = document.querySelectorAll('.blocked-embed[data-embed-provider="youtube"]');
    embeds.forEach(function (embed) {
      if (embed.dataset.embedLoaded === '1') return;
      var src = embed.getAttribute('data-src');
      if (!src) return;

      var iframe = document.createElement('iframe');
      iframe.loading = 'lazy';
      iframe.src = src;
      iframe.title = embed.getAttribute('data-title') || 'YouTube video';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;

      embed.innerHTML = '';
      embed.appendChild(iframe);
      embed.dataset.embedLoaded = '1';
    });
  }

  function loadBandsintownScript() {
    if (document.querySelector('script[data-external="bandsintown"]')) return;

    var script = document.createElement('script');
    script.src = 'https://widgetv3.bandsintown.com/main.min.js';
    script.async = true;
    script.defer = true;
    script.dataset.external = 'bandsintown';
    document.body.appendChild(script);
  }

  function mountBandsintownWidget() {
    var widget = document.getElementById('tour-widget');
    if (!widget || widget.dataset.embedLoaded === '1') return;

    var template = document.getElementById('tour-widget-template');
    if (template && template.content) {
      var widgetContent = template.content.cloneNode(true);
      widget.innerHTML = '';
      widget.appendChild(widgetContent);
      widget.dataset.embedLoaded = '1';
      loadBandsintownScript();
    }
  }

  function applyConsent(consent) {
    var normalized = normalizeConsent(consent);
    document.documentElement.setAttribute('data-consent-media', normalized.media ? 'granted' : 'denied');

    if (normalized.media) {
      mountYouTubeEmbeds();
      mountBandsintownWidget();
    }
  }

  function saveAndApply(consent) {
    var stored = saveConsent(consent);
    applyConsent(stored);
    hideBanner();
    closePreferences();
  }

  if (acceptAllBtn) {
    acceptAllBtn.addEventListener('click', function () {
      saveAndApply({ media: true });
    });
  }

  if (rejectAllBtn) {
    rejectAllBtn.addEventListener('click', function () {
      saveAndApply({ media: false });
    });
  }

  if (openPrefsBtn) {
    openPrefsBtn.addEventListener('click', function () {
      openPreferences(loadConsent());
    });
  }

  if (closePrefsBtn) {
    closePrefsBtn.addEventListener('click', closePreferences);
  }

  if (modal) {
    modal.addEventListener('click', function (event) {
      if (event.target === modal) {
        closePreferences();
      }
    });
  }

  if (cmpForm) {
    cmpForm.addEventListener('submit', function (event) {
      event.preventDefault();
      saveAndApply({ media: mediaCheckbox && mediaCheckbox.checked });
    });
  }

  if (modalAcceptAllBtn) {
    modalAcceptAllBtn.addEventListener('click', function () {
      saveAndApply({ media: true });
    });
  }

  if (modalRejectAllBtn) {
    modalRejectAllBtn.addEventListener('click', function () {
      saveAndApply({ media: false });
    });
  }

  reviewButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      openPreferences(loadConsent());
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closePreferences();
    }
  });

  var existing = loadConsent();
  if (existing) {
    applyConsent(existing);
    hideBanner();
  } else {
    showBanner();
    applyConsent({ media: false });
  }
})();
