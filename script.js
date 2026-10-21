/* =========================================================
   Undangan Pernikahan — JavaScript
   Ubah tanggal acara di EVENT_DATE (zona waktu WIB, +07:00).
   ========================================================= */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var EVENT_DATE = new Date('2026-12-12T08:00:00+07:00');
  var EVENT_END  = new Date('2026-12-12T14:00:00+07:00');
  var STORAGE_KEY = 'undangan-raka-ayu-ucapan';

  var $ = function (id) { return document.getElementById(id); };

  /* ---------- Nama tamu dari URL: ?to=Budi+Santoso ---------- */
  var params = new URLSearchParams(window.location.search);
  var guest = (params.get('to') || '').trim();
  if (guest) {
    $('guestName').textContent = guest;
    $('fName').value = guest;
  }

  /* ---------- Buka undangan ---------- */
  var bgm = $('bgm');
  var musicBtn = $('musicBtn');

  $('openBtn').addEventListener('click', function () {
    $('cover').classList.add('is-open');
    document.body.classList.remove('is-locked');
    window.scrollTo(0, 0);
    musicBtn.hidden = false;
    playMusic();
  });

  function playMusic() {
    var p = bgm.play();
    if (p && p.then) {
      p.then(function () { musicBtn.classList.add('playing'); })
       .catch(function () { musicBtn.classList.remove('playing'); });
    }
  }

  musicBtn.addEventListener('click', function () {
    if (bgm.paused) {
      playMusic();
    } else {
      bgm.pause();
      musicBtn.classList.remove('playing');
    }
  });

  /* ---------- Hitung mundur ---------- */
  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    var diff = EVENT_DATE - new Date();
    if (diff <= 0) {
      $('countdown').hidden = true;
      $('cdDone').hidden = false;
      clearInterval(timer);
      return;
    }
    var s = Math.floor(diff / 1000);
    $('cdDays').textContent  = pad(Math.floor(s / 86400));
    $('cdHours').textContent = pad(Math.floor((s % 86400) / 3600));
    $('cdMins').textContent  = pad(Math.floor((s % 3600) / 60));
    $('cdSecs').textContent  = pad(s % 60);
  }
  var timer = setInterval(tick, 1000);
  tick();

  /* ---------- Tautan Google Calendar ---------- */
  function toCal(d) { return d.toISOString().replace(/[-:]|\.\d{3}/g, ''); }
  $('calBtn').href =
    'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    '&text=' + encodeURIComponent('Pernikahan Raka & Ayu') +
    '&dates=' + toCal(EVENT_DATE) + '/' + toCal(EVENT_END) +
    '&location=' + encodeURIComponent('Gedung Graha Sentosa, Jl. Basuki Rahmat No. 88, Surabaya');

  /* ---------- Toast ---------- */
  function showToast(msg) {
    $('toastMsg').textContent = msg;
    bootstrap.Toast.getOrCreateInstance($('appToast'), { delay: 2600 }).show();
  }

  /* ---------- Salin nomor rekening ---------- */
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

  /* ---------- RSVP & ucapan ---------- */
  var STATUS_LABEL = { hadir: 'Hadir', tidak: 'Tidak hadir', ragu: 'Ragu-ragu' };

  var seed = [
    { name: 'Keluarga Besar Wijaya', status: 'hadir', msg: 'Selamat menempuh hidup baru. Semoga sakinah, mawaddah, warahmah.' },
    { name: 'Dimas & Rina', status: 'hadir', msg: 'Bahagia selalu untuk kalian berdua!' }
  ];

  function loadWishes() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (Array.isArray(saved)) return saved;
    } catch (e) { /* abaikan */ }
    return seed.slice();
  }

  function saveWishes(list) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (e) { /* abaikan */ }
  }

  var wishes = loadWishes();

  function renderWishes() {
    var box = $('wishList');
    box.textContent = '';
    $('wishCount').textContent = wishes.length + ' ucapan';

    if (!wishes.length) {
      var empty = document.createElement('p');
      empty.className = 'wish-empty';
      empty.textContent = 'Belum ada ucapan. Jadilah yang pertama.';
      box.appendChild(empty);
      return;
    }

    wishes.forEach(function (w) {
      var item = document.createElement('div');
      item.className = 'wish';

      var head = document.createElement('header');
      var name = document.createElement('strong');
      name.textContent = w.name;
      var badge = document.createElement('span');
      badge.className = 'badge-status';
      badge.textContent = STATUS_LABEL[w.status] || '';
      head.appendChild(name);
      head.appendChild(badge);

      item.appendChild(head);
      if (w.msg) {
        var p = document.createElement('p');
        p.textContent = w.msg;
        item.appendChild(p);
      }
      box.appendChild(item);
    });
  }
  renderWishes();

  var form = $('rsvpForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = $('fName').value.trim();
    var status = $('fStatus').value;
    var msg = $('fMsg').value.trim();

    $('fName').classList.toggle('is-invalid', !name);
    $('fStatus').classList.toggle('is-invalid', !status);
    if (!name || !status) return;

    wishes.unshift({ name: name, status: status, msg: msg });
    saveWishes(wishes);
    renderWishes();

    form.reset();
    $('fGuests').value = 1;
    if (guest) $('fName').value = guest;
    showToast('Terima kasih, konfirmasi dan ucapan Anda sudah tercatat.');
  });

  /* ---------- Animasi muncul saat scroll ---------- */
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
