(function () {
  'use strict';

  var contactEmail = 'info@danielecomoglio.com';
  var body = document.body;
  var toggle = document.querySelector('.menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  var menuOverlay = document.querySelector('.menu-overlay');
  var backToTop = document.querySelector('.back-to-top');
  var ringProgress = document.querySelector('.ring-progress');
  var desktopMenuQuery = window.matchMedia('(min-width: 1040px)');
  var newsletterPopup = document.getElementById('newsletter-popup');
  var newsletterPopupClose = document.querySelector('.newsletter-popup-close');
  var newsletterPopupForm = document.getElementById('newsletter-popup-form');
  var newsletterPopupStatus = document.getElementById('newsletter-popup-status');
  var popupSeenKey = 'dc_newsletter_prompt_seen';

  function closeMenu() {
    if (!toggle || !mobileMenu || !menuOverlay) return;
    body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    mobileMenu.hidden = true;
    menuOverlay.hidden = true;
  }

  function openMenu() {
    if (!toggle || !mobileMenu || !menuOverlay) return;
    if (desktopMenuQuery.matches) return;
    body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    mobileMenu.hidden = false;
    menuOverlay.hidden = false;
  }

  function closePopup(markSeen) {
    if (!newsletterPopup) return;
    newsletterPopup.hidden = true;
    body.classList.remove('popup-open');
    if (markSeen) {
      sessionStorage.setItem(popupSeenKey, '1');
    }
  }

  function openPopup() {
    if (!newsletterPopup) return;
    if (sessionStorage.getItem(popupSeenKey) === '1') return;
    closeMenu();
    newsletterPopup.hidden = false;
    body.classList.add('popup-open');
  }

  function launchMailto(subject, bodyText) {
    var mailto = 'mailto:' + contactEmail + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(bodyText);
    window.location.href = mailto;
  }

  function submitNewsletter(email, statusElement, successText) {
    var emailValue = (email || '').toString().trim();
    var isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

    if (!isValid) {
      statusElement.textContent = 'Please enter a valid email.';
      return false;
    }

    launchMailto('Newsletter subscription request', 'Please add this email to the newsletter list: ' + emailValue);
    statusElement.textContent = successText;
    return true;
  }

  if (toggle && mobileMenu && menuOverlay) {
    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    menuOverlay.addEventListener('click', closeMenu);

    mobileMenu.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', function () {
      if (desktopMenuQuery.matches) {
        closeMenu();
      }
    });
  }

  if (backToTop) {
    var ringLength = 0;
    if (ringProgress) {
      ringLength = ringProgress.getTotalLength();
      ringProgress.style.strokeDasharray = String(ringLength);
      ringProgress.style.strokeDashoffset = String(ringLength);
    }

    var updateBackToTop = function () {
      var scrollTop = window.scrollY || window.pageYOffset;
      var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      var progress = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;

      if (ringProgress) {
        ringProgress.style.strokeDashoffset = String(ringLength * (1 - progress));
      }

      if (scrollTop > 420) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', updateBackToTop, { passive: true });
    updateBackToTop();

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var contactForm = document.getElementById('contact-form');
  var contactStatus = document.getElementById('contact-status');

  if (contactForm && contactStatus) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var formData = new FormData(contactForm);
      var name = (formData.get('name') || '').toString().trim();
      var email = (formData.get('email') || '').toString().trim();
      var message = (formData.get('message') || '').toString().trim();

      if (!name || !email || !message) {
        contactStatus.textContent = 'Please complete all fields before sending.';
        return;
      }

      var subject = 'Website message from ' + name;
      var bodyText = 'Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message;
      launchMailto(subject, bodyText);
      contactStatus.textContent = 'Your email app should open now.';
      contactForm.reset();
    });
  }

  var newsletterForm = document.getElementById('newsletter-form');
  var newsletterStatus = document.getElementById('newsletter-status');

  if (newsletterForm && newsletterStatus) {
    newsletterForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var formData = new FormData(newsletterForm);
      var email = formData.get('email');
      if (submitNewsletter(email, newsletterStatus, 'Subscription request prepared in your email app.')) {
        newsletterForm.reset();
      }
    });
  }

  if (newsletterPopup && newsletterPopupClose) {
    newsletterPopupClose.addEventListener('click', function () {
      closePopup(true);
    });

    newsletterPopup.addEventListener('click', function (event) {
      if (event.target === newsletterPopup) {
        closePopup(true);
      }
    });

    if (newsletterPopupForm && newsletterPopupStatus) {
      newsletterPopupForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var formData = new FormData(newsletterPopupForm);
        var email = formData.get('email');
        if (submitNewsletter(email, newsletterPopupStatus, 'Subscription request prepared in your email app.')) {
          newsletterPopupForm.reset();
          closePopup(true);
        }
      });
    }

    if (sessionStorage.getItem(popupSeenKey) !== '1') {
      setTimeout(function promptPopup() {
        if (body.classList.contains('menu-open')) {
          setTimeout(promptPopup, 10000);
          return;
        }
        openPopup();
      }, 60000);
    }
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeMenu();
      closePopup(true);
    }
  });
})();
