(function () {
  'use strict';

  function $(id) {
    return document.getElementById(id);
  }

  // Mengubah tanggal ke format Google Calendar
  function toCal(date) {
    return date.toISOString().replace(/[-:]|\.\d{3}/g, '');
  }

  var openBtn = $('openBtn');
  var cover = $('cover');

  if (openBtn && cover) {
    openBtn.addEventListener('click', function () {
      cover.classList.add('is-open');
      document.body.classList.remove('is-locked');
    });
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
        'Gedung Graha Sentosa, Surabaya'
      );

    calBtn.href = calendarUrl;
    calBtn.target = '_blank';
    calBtn.rel = 'noopener noreferrer';
  }

  function showToast(message) {
    var toastMsg = $('toastMsg');
    var appToast = $('appToast');

    if (toastMsg && appToast && window.bootstrap) {
      toastMsg.textContent = message;

      bootstrap.Toast.getOrCreateInstance(appToast, {
        delay: 2600
      }).show();
    } else {
      alert(message);
    }
  }

  function fallbackCopy(text) {
    var textarea = document.createElement('textarea');

    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';

    document.body.appendChild(textarea);
    textarea.select();

    var success = false;

    try {
      success = document.execCommand('copy');
    } catch (error) {
      success = false;
    }

    document.body.removeChild(textarea);

    if (success) {
      showToast('Nomor rekening berhasil disalin.');
    } else {
      showToast('Silakan salin nomor rekening secara manual: ' + text);
    }
  }

  document.querySelectorAll('.copy-btn').forEach(function (button) {
    button.addEventListener('click', function () {
      var targetId = button.getAttribute('data-target');
      var target = $(targetId);

      if (!target) {
        showToast('Nomor rekening tidak ditemukan.');
        return;
      }

      var text = target.textContent.trim();

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
          .then(function () {
            showToast('Nomor rekening berhasil disalin.');
          })
          .catch(function () {
            fallbackCopy(text);
          });
      } else {
        fallbackCopy(text);
      }
    });
  });

  var revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12
      }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add('in');
    });
  }

})();
