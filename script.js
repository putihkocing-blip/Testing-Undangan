(function () {
  'use strict';

  // Memudahkan pemanggilan elemen HTML berdasarkan ID
  var $ = function (id) {
    return document.getElementById(id);
  };

  var openBtn = $('openBtn');
  var cover = $('cover');
  var musicBtn = $('musicBtn');

  if (openBtn && cover) {
    openBtn.addEventListener('click', function () {
      cover.classList.add('is-open');
      document.body.classList.remove('is-locked');
      window.scrollTo(0, 0);

      if (musicBtn) {
        musicBtn.hidden = false;
      }
    });
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
      '&text=' + encodeURIComponent('Pernikahan Naruto & Hinata') +
      '&dates=' + toCal(start) + '/' + toCal(end) +
      '&location=' + encodeURIComponent(
        'Gedung Graha Unesa, Jl. Ahmad Yani No. 99, Surabaya'
      );

    calBtn.href = calendarUrl;
    calBtn.target = '_blank';
    calBtn.rel = 'noopener noreferrer';
  }

  function showToast(msg) {
    var toastMsg = $('toastMsg');
    var appToast = $('appToast');

    if (toastMsg && appToast && window.bootstrap) {
      toastMsg.textContent = msg;

      bootstrap.Toast.getOrCreateInstance(appToast, {
        delay: 2600
      }).show();
    } else {
      alert(msg);
    }
  }

  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = $(btn.dataset.target);

      if (!target) {
        showToast('Nomor rekening tidak ditemukan.');
        return;
      }

      var text = target.textContent.trim();

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
          .then(function () {
            showToast('Nomor rekening berhasil disalin: ' + text);
          })
          .catch(function () {
            fallbackCopy(text);
          });
      } else {
        fallbackCopy(text);
      }
    });
  });

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');

    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';

    document.body.appendChild(ta);
    ta.select();

    try {
      var success = document.execCommand('copy');

      if (success) {
        showToast('Nomor rekening berhasil disalin: ' + text);
      } else {
        showToast('Silakan salin nomor rekening secara manual: ' + text);
      }
    } catch (e) {
      showToast('Silakan salin nomor rekening secara manual: ' + text);
    }

    document.body.removeChild(ta);
  }

  var items = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12
    });

    items.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    items.forEach(function (item) {
      item.classList.add('in');
    });
  }

})();
