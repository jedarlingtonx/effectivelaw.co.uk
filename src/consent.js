/* Cookie consent and Google Analytics loader for The Effective Law Group.
   Analytics only loads after the visitor clicks "Accept analytics".
   Set GA_ID to the Google Analytics 4 measurement ID (starts with G-) once Natasha's property exists.
   While GA_ID is empty, no banner shows and nothing is loaded. */
(function () {
  var GA_ID = '';
  var KEY = 'elg_consent';          // the one essential cookie: remembers the choice
  var script = document.currentScript;
  var POLICY = (script && script.src ? script.src.replace(/consent\.js.*$/, '') : '/') + 'cookie-policy/';
  var preview = /[?&]cookies=preview/.test(location.search);

  function getChoice() {
    var m = document.cookie.match(new RegExp('(?:^|; )' + KEY + '=([^;]*)'));
    return m ? m[1] : null;
  }
  function setChoice(v) {
    var secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = KEY + '=' + v + '; Max-Age=31536000; Path=/; SameSite=Lax' + secure;
  }
  function clearGa() {
    var host = location.hostname.split('.');
    var domains = ['', location.hostname, '.' + location.hostname];
    if (host.length > 2) domains.push('.' + host.slice(-2).join('.'));
    document.cookie.split('; ').forEach(function (c) {
      var n = c.split('=')[0];
      if (n === '_ga' || n.indexOf('_ga_') === 0 || n === '_gid') {
        domains.forEach(function (d) {
          document.cookie = n + '=; Max-Age=0; Path=/' + (d ? '; Domain=' + d : '');
        });
      }
    });
  }
  var loaded = false;
  function loadGa() {
    if (loaded || !GA_ID) return;
    loaded = true;
    window['ga-disable-' + GA_ID] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
  }

  var banner;
  function hide() { if (banner) { banner.remove(); banner = null; } }
  function show() {
    if (banner) return;
    banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML =
      '<p><strong>Cookies on this site</strong></p>' +
      '<p>We would like to use Google Analytics cookies to see how the site is used, so we can improve it. ' +
      'They stay off unless you accept. See our <a href="' + POLICY + '">cookie policy</a>.</p>' +
      '<div class="cookie-btns">' +
      '<button type="button" class="btn" data-choice="granted">Accept analytics</button>' +
      '<button type="button" class="btn" data-choice="denied">Reject</button></div>';
    document.body.appendChild(banner);
    banner.addEventListener('click', function (e) {
      var v = e.target.getAttribute && e.target.getAttribute('data-choice');
      if (!v) return;
      if (!preview) {
        setChoice(v);
        if (v === 'granted') loadGa();
        else { if (GA_ID) window['ga-disable-' + GA_ID] = true; clearGa(); }
      }
      hide();
    });
  }

  function init() {
    document.querySelectorAll('[data-cookie-settings]').forEach(function (a) {
      if (!GA_ID && !preview) { (a.closest('li,p') || a).hidden = true; return; }
      a.addEventListener('click', function (e) { e.preventDefault(); show(); });
    });
    if (preview) { show(); return; }
    if (!GA_ID) return;
    var c = getChoice();
    if (c === 'granted') loadGa();
    else if (c !== 'denied') show();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
