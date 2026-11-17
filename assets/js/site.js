/* Minimal: mobile menu + contact form submission. No dependencies. */
(function () {
  'use strict';
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? 'Close' : 'Menu';
    });
  }

  var form = document.querySelector('form[data-formsubmit]');
  if (form && window.fetch) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var prev = form.querySelector('.form-note');
      if (prev) prev.remove();
      if (btn) btn.disabled = true;
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      fetch(form.getAttribute('action').replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) { return r.json(); }).then(function (res) {
        var ok = res && (res.success === true || res.success === 'true');
        note(ok ? 'Thank you. James or Kathryn will reply personally.' : 'Sorry, that did not send. Please email us directly.', ok);
        if (ok) form.reset();
      }).catch(function () {
        note('Sorry, that did not send. Please email us directly.', false);
      }).then(function () { if (btn) btn.disabled = false; });

      function note(text, ok) {
        var d = document.createElement('p');
        d.className = 'form-note' + (ok ? '' : ' error');
        d.setAttribute('role', 'alert');
        d.textContent = text;
        form.appendChild(d);
      }
    });
  }
})();
