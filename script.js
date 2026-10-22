(function () {
  'use strict';

  // Mengambil elemen HTML berdasarkan ID
  function $(id) {
    return document.getElementById(id);
  }

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

  // 2. Tombol Google Calendar
  var calBtn = $('calBtn');

  if (calBtn) {
    var start = new Date('2026-12-12T08:00:00+07:00');
    var end = new Date('2026-12-12T14:00:00+07:00');

    var calendarUrl =
      'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      '&text=' + encodeURIComponent('Pernikahan Naruto & Hinata') +
      '&dates=' + toCal(start) + '/' + toCal(end) +
      '&location=' + encodeURIComponent(
        'Gedung Graha Unesa, Surabaya'
      );

    calBtn.href = calendarUrl;
    calBtn.target = '_blank';
    calBtn.rel = 'noopener noreferrer';
  }

  // 3. Notifikasi
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

  // 4. Salin nomor rekening
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
      showToast('Silakan salin secara manual: ' + text);
    }
  }

  document.querySelectorAll('.copy-btn').forEach(function (button) {
    button.addEventListener('click', function () {
      var target = $(button.getAttribute('data-target'));

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

  // 5. Animasi saat halaman digulir
  var items = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    items.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    items.forEach(function (item) {
      item.classList.add('in');
    });
  }

})();
