(function () {
  'use strict';

  function toCal(d) { return d.toISOString().replace(/[-:]|\.\d{3}/g, ''); }
  $('calBtn').href =
    'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    '&text=' + encodeURIComponent('Pernikahan Raka & Ayu') +
    '&dates=' + toCal(EVENT_DATE) + '/' + toCal(EVENT_END) +
    '&location=' + encodeURIComponent('Gedung Graha Sentosa, Jl. Basuki Rahmat No. 88, Surabaya');

    function showToast(msg) {
    $('toastMsg').textContent = msg;
    bootstrap.Toast.getOrCreateInstance($('appToast'), { delay: 2600 }).show();
  }

  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = $(btn.dataset.target).textContent.trim();
      var done = function () { showToast('Nomor rekening disalin: ' + text); };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text, done); });
      } else {
        fallbackCopy(text, done);
      }
    });
  });

  function fallbackCopy(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { showToast('Salin manual: ' + text); }
    document.body.removeChild(ta);
  }
function toCal(date) {
  return date.toISOString().replace(/[-:]|\.\d{3}/g, '');
}

var calBtn = $('calBtn');

if (calBtn) {
  var start = new Date('2026-12-12T08:00:00+07:00');
  var end = new Date('2026-12-12T14:00:00+07:00');

  var calendarUrl =
    'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    '&text=' + encodeURIComponent('Pernikahan Raka & Ayu') +
    '&dates=' + toCal(start) + '/' + toCal(end) +
    '&location=' + encodeURIComponent(
      'Gedung Graha Sentosa, Jl. Basuki Rahmat No. 88, Surabaya'
    ):

  calBtn.href = calendarUrl;
  calBtn.target = '_blank';
  calBtn.rel = 'noopener noreferrer';
}
  
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }
})();
