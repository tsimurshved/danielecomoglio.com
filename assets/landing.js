(function () {
  'use strict';

  var contactEmail = 'info@danielecomoglio.com';
  var body = document.body;
  var toggle = document.querySelector('.menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  var menuOverlay = document.querySelector('.menu-overlay');
  var backToTop = document.querySelector('.back-to-top');

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
    body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    mobileMenu.hidden = false;
    menuOverlay.hidden = false;
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

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeMenu();
      }
    });

    mobileMenu.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  if (backToTop) {
    var updateBackToTop = function () {
      if (window.scrollY > 420) {
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
      var mailto = 'mailto:' + contactEmail + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(bodyText);

      window.location.href = mailto;
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
      var email = (formData.get('email') || '').toString().trim();

      if (!email) {
        newsletterStatus.textContent = 'Please enter a valid email.';
        return;
      }

      var subject = 'Newsletter subscription request';
      var bodyText = 'Please add this email to the newsletter list: ' + email;
      var mailto = 'mailto:' + contactEmail + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(bodyText);

      window.location.href = mailto;
      newsletterStatus.textContent = 'Subscription request prepared in your email app.';
      newsletterForm.reset();
    });
  }
})();
