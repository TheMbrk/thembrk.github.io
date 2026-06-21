// Mark JS active — CSS uses this for progressive enhancement
document.body.classList.add('js-ready');

document.addEventListener('DOMContentLoaded', function () {

  // ── Sticky nav ──────────────────────────────────────────
  var header   = document.getElementById('site-header');
  var sections = Array.from(document.querySelectorAll('section[id]'));
  var navItems = Array.from(document.querySelectorAll('.nav__link'));

  function highlightActiveNav() {
    var scrollY = window.scrollY + 100;
    var current = '';
    sections.forEach(function (section) {
      if (scrollY >= section.offsetTop) {
        current = section.getAttribute('id');
      }
    });
    navItems.forEach(function (item) {
      item.classList.toggle('active', item.getAttribute('href') === '#' + current);
    });
  }

  function onScroll() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    highlightActiveNav();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Mobile nav toggle ────────────────────────────────────
  var navToggle = document.getElementById('nav-toggle');
  var navLinks  = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.querySelectorAll('.nav__link, .btn').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Scroll reveals ───────────────────────────────────────
  var revealEls = document.querySelectorAll('.reveal');

  function revealEl(el) { el.classList.add('is-visible'); }

  function revealInViewport() {
    revealEls.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        revealEl(el);
      }
    });
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          revealEl(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(revealEl);
  }

  // Reveal anything already in view on load (covers hash-navigated sections)
  revealInViewport();
  // Also run after a short delay in case the browser scrolls to a hash after paint
  setTimeout(revealInViewport, 100);
  // Final fallback: reveal everything still hidden after 1s
  setTimeout(function () {
    revealEls.forEach(function (el) {
      if (!el.classList.contains('is-visible')) revealEl(el);
    });
  }, 1000);

  // ── Footer year ──────────────────────────────────────────
  var yearEl = document.getElementById('footer-year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  // ── Inline AI Chatbot Demo ───────────────────────────────
  var WORKER_URL  = 'https://shrill-shadow-6aa5.jobs-markcyriltubera.workers.dev/';
  var chatHistory = [];

  var demoMessages = document.getElementById('demo-messages');
  var demoInput    = document.getElementById('demo-input');
  var demoSend     = document.getElementById('demo-send');

  function appendDemoMsg(text, type) {
    var wrap   = document.createElement('div');
    wrap.className = 'demo-msg demo-msg--' + type;

    var avatar = document.createElement('div');
    avatar.className = 'demo-msg__avatar';
    avatar.textContent = (type === 'user') ? 'You' : 'M';

    var bubble = document.createElement('div');
    bubble.className = 'demo-msg__bubble';
    bubble.textContent = text;

    wrap.appendChild(avatar);
    wrap.appendChild(bubble);
    demoMessages.appendChild(wrap);
    demoMessages.scrollTop = demoMessages.scrollHeight;
    return bubble;
  }

  async function sendDemoMessage(text) {
    text = (text || '').trim();
    if (!text || !demoMessages) return;

    appendDemoMsg(text, 'user');
    if (demoInput) demoInput.value = '';
    if (demoSend)  demoSend.disabled = true;

    chatHistory.push({ role: 'user', content: text });

    // Typing indicator
    var typingWrap   = document.createElement('div');
    typingWrap.className = 'demo-msg demo-msg--bot demo-msg--typing';
    var typingAvatar = document.createElement('div');
    typingAvatar.className = 'demo-msg__avatar';
    typingAvatar.textContent = 'M';
    var typingBubble = document.createElement('div');
    typingBubble.className = 'demo-msg__bubble';
    typingBubble.textContent = 'Thinking...';
    typingWrap.appendChild(typingAvatar);
    typingWrap.appendChild(typingBubble);
    demoMessages.appendChild(typingWrap);
    demoMessages.scrollTop = demoMessages.scrollHeight;

    try {
      var res  = await fetch(WORKER_URL, {
        method: 'POST',
        mode:   'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory }),
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var data  = await res.json();
      var reply = data.reply || data.error || 'Sorry, I could not get a response.';
      chatHistory.push({ role: 'assistant', content: reply });
      typingBubble.textContent = reply;
      typingWrap.classList.remove('demo-msg--typing');
    } catch (err) {
      var isLocalFile = window.location.protocol === 'file:';
      typingBubble.textContent = isLocalFile
        ? 'The AI bot requires a live server to work (CORS). Open index.html via a local server or visit the deployed GitHub Pages site to test it.'
        : 'Could not reach the AI service. Please try again in a moment.';
      typingWrap.classList.remove('demo-msg--typing');
      chatHistory.pop(); // remove the failed user message from history
    }

    if (demoSend) demoSend.disabled = false;
    if (demoInput) demoInput.focus();
    demoMessages.scrollTop = demoMessages.scrollHeight;
  }

  if (demoSend) {
    demoSend.addEventListener('click', function () {
      if (demoInput) sendDemoMessage(demoInput.value);
    });
  }
  if (demoInput) {
    demoInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendDemoMessage(demoInput.value);
      }
    });
  }

  // Sample question chips
  document.querySelectorAll('.sample-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var q = btn.getAttribute('data-q');
      if (q) sendDemoMessage(q);
    });
  });

});

// ── Contact Form (global — attached via onsubmit attribute) ──
window.submitContactForm = async function (e) {
  e.preventDefault();

  var form       = document.getElementById('contact-form');
  var formSubmit = document.getElementById('form-submit');
  var btnText    = document.getElementById('btn-text');
  var formSuccess = document.getElementById('form-success');
  var formError   = document.getElementById('form-error');

  if (!form) return false;

  var nameVal    = (form.querySelector('[name="name"]')    || {}).value || '';
  var emailVal   = (form.querySelector('[name="email"]')   || {}).value || '';
  var messageVal = (form.querySelector('[name="message"]') || {}).value || '';

  if (formSubmit) formSubmit.disabled = true;
  if (btnText)    btnText.textContent = 'Sending...';
  if (formSuccess) formSuccess.hidden = true;
  if (formError)   formError.hidden   = true;

  try {
    var response = await fetch('https://formspree.io/f/xzdqwdka', {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept':       'application/json',
      },
      body: JSON.stringify({ name: nameVal, email: emailVal, message: messageVal }),
    });

    if (response.ok) {
      form.reset();
      if (formSuccess) formSuccess.hidden = false;
    } else {
      throw new Error('HTTP ' + response.status);
    }
  } catch (_) {
    if (formError) formError.hidden = false;
  } finally {
    if (btnText)    btnText.textContent = 'Send Message';
    if (formSubmit) formSubmit.disabled = false;
  }

  return false;
};
