(function () {
  // Restores real :hover behavior for elements authored with the design tool's
  // "style-hover" attribute (a proprietary attribute the browser otherwise ignores).
  document.querySelectorAll('[style-hover]').forEach(function (el) {
    var baseStyle = el.getAttribute('style') || '';
    var hoverStyle = el.getAttribute('style-hover');
    el.addEventListener('mouseenter', function () {
      el.style.cssText = baseStyle + ';' + hoverStyle;
    });
    el.addEventListener('mouseleave', function () {
      el.style.cssText = baseStyle;
    });
  });

  var modal = document.getElementById('contactModal');
  if (!modal) return;

  var form = modal.querySelector('form');
  var statusBox = modal.querySelector('.form-status');
  var submitBtn = modal.querySelector('.form-submit');
  var submitLabel = submitBtn ? submitBtn.textContent : '';
  var lastFocused = null;

  function openModal() {
    lastFocused = document.activeElement;
    modal.hidden = false;
    requestAnimationFrame(function () { modal.classList.add('is-open'); });
    document.body.style.overflow = 'hidden';
    var firstField = form.querySelector('input, textarea');
    if (firstField) firstField.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    window.setTimeout(function () { modal.hidden = true; }, 200);
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  document.querySelectorAll('[data-open-modal]').forEach(function (btn) {
    btn.addEventListener('click', openModal);
  });
  modal.querySelectorAll('[data-close-modal]').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    statusBox.className = 'form-status';
    statusBox.textContent = '';
    submitBtn.disabled = true;
    submitBtn.textContent = form.dataset.sendingLabel || submitLabel;

    var payload = {};
    new FormData(form).forEach(function (value, key) { payload[key] = value; });

    fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.json().then(function (data) {
          // FormSubmit (and similar backends) can answer HTTP 200 while the
          // JSON body still reports a logical failure (e.g. unactivated
          // form, page opened as a local file instead of served over
          // http/https) — res.ok alone would miss that.
          var ok = res.ok && data && data.success !== false && data.success !== 'false';
          if (!ok) throw new Error((data && data.message) || 'request failed');
        });
      })
      .then(function () {
        statusBox.className = 'form-status is-success';
        statusBox.textContent = form.dataset.successMessage;
        form.reset();
      })
      .catch(function () {
        statusBox.className = 'form-status is-error';
        statusBox.textContent = form.dataset.errorMessage;
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = submitLabel;
      });
  });
})();
