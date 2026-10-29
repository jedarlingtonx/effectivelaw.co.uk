(function () {
  // Gentle scroll reveal. Respects reduced-motion (handled in CSS too).
  var els = document.querySelectorAll('.rv');
  if (els.length) {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.12 });
      els.forEach(function (el) { io.observe(el); });
    }
  }

  // Enquiry form (contact page only).
  var form = document.getElementById('enquiry');
  if (!form) return;

  // Paste the Forminit form ID here once Natasha's Forminit form exists (Public mode).
  var FORM_ID = '';
  var TO = 'natasha@effectivelaw.co.uk';

  var ok = document.getElementById('form-ok');
  var err = document.getElementById('form-err');
  var btn = form.querySelector('button[type="submit"]');

  function show(box, text) {
    ok.hidden = true; err.hidden = true;
    box.textContent = text;
    box.hidden = false;
    box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function val(name) { var f = form.elements[name]; return f ? f.value.trim() : ''; }

  function mailtoFallback() {
    var need = form.elements['fi-select-need'];
    var needText = need && need.selectedIndex > -1 ? need.options[need.selectedIndex].text : '';
    var body = 'Name: ' + val('fi-sender-firstName') + ' ' + val('fi-sender-lastName') + '\n' +
      'Email: ' + val('fi-sender-email') + '\n' +
      'Business: ' + val('fi-sender-company') + '\n' +
      'What I need: ' + needText + '\n\n' + val('fi-text-message');
    window.location.href = 'mailto:' + TO + '?subject=' + encodeURIComponent('Website enquiry from ' + val('fi-sender-firstName')) +
      '&body=' + encodeURIComponent(body);
    show(ok, 'Your email app should open with your message ready to send. If it does not, please email ' + TO + '.');
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    ok.hidden = true; err.hidden = true;

    // Honeypot: real people leave this empty.
    if (form.elements['_gotcha'] && form.elements['_gotcha'].value) {
      show(ok, 'Thank you. Your message has been sent.');
      form.reset();
      return;
    }
    if (!form.checkValidity()) { form.reportValidity(); return; }

    if (!FORM_ID || typeof Forminit === 'undefined') { mailtoFallback(); return; }

    var data = new FormData(form);
    data.delete('_gotcha');
    btn.disabled = true;
    var label = btn.textContent;
    btn.textContent = 'Sending…';
    try {
      var forminit = new Forminit();
      var res = await forminit.submit(FORM_ID, data);
      if (res.error) {
        show(err, 'Sorry, that did not send. Please email ' + TO + ' instead.');
      } else {
        show(ok, 'Thank you. Your message is with Natasha, who will be in touch.');
        form.reset();
      }
    } catch (x) {
      show(err, 'Sorry, that did not send. Please email ' + TO + ' instead.');
    }
    btn.disabled = false;
    btn.textContent = label;
  });
})();
