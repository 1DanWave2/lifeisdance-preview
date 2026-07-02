/* Life is Dance — анимации и интерактив */
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', function () {

  /* 1. Reveal при появлении в вьюпорте + стаггер по соседям */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      var sibs = Array.prototype.slice.call(el.parentNode.children).filter(function (c) { return c.classList.contains('rv'); });
      var idx = sibs.indexOf(el);
      el.style.transitionDelay = (idx > 0 ? Math.min(idx, 8) * 85 : 0) + 'ms';
      el.classList.add('in');
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });

  /* Страховка для скриншота/полноэкранного рендера: форс-показать всё */
  window.addEventListener('load', function () {
    setTimeout(function () {
      document.querySelectorAll('.rv:not(.in)').forEach(function (el) { el.classList.add('in'); });
    }, 1600);
  });

  /* 2. Счётчики (count-up) при появлении */
  function animateCount(el) {
    var raw = el.getAttribute('data-count');
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var dec = raw.indexOf('.') > -1;
    var target = parseFloat(raw);
    var start = null, dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = prefix + (dec ? val.toFixed(1) : Math.round(val)) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = prefix + raw + suffix;
    }
    requestAnimationFrame(step);
    // страховка: гарантированно проставить финал (rAF может застрять при virtual-time рендере)
    setTimeout(function () { el.textContent = prefix + raw + suffix; }, dur + 200);
  }
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(function (el) { cio.observe(el); });

  /* 3. Липкая шапка — ужимается при скролле */
  var onScroll = function () {
    if (window.scrollY > 40) document.body.classList.add('scrolled');
    else document.body.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* 4. Табы / фильтры (расписание, цены) */
  document.querySelectorAll('[data-tabs]').forEach(function (group) {
    var btns = group.querySelectorAll('[data-tab]');
    var scope = document.querySelector(group.getAttribute('data-tabs'));
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        var key = b.getAttribute('data-tab');
        scope.querySelectorAll('[data-cat]').forEach(function (item) {
          var show = key === 'all' || item.getAttribute('data-cat') === key;
          item.style.display = show ? '' : 'none';
          if (show) { item.classList.remove('in'); void item.offsetWidth; item.classList.add('in'); }
        });
      });
    });
  });

  /* 4b. Видео-facade: клик по превью -> загрузка плеера RuTube */
  document.addEventListener('click', function (e) {
    var card = e.target.closest ? e.target.closest('.vcard') : null;
    if (!card) return;
    var embed = card.getAttribute('data-embed');
    var thumb = card.querySelector('.vthumb');
    if (!embed || !thumb || thumb.querySelector('iframe')) return;
    thumb.innerHTML = '<iframe src="' + embed + '?autoStart=true" allow="autoplay; fullscreen" allowfullscreen></iframe>';
  });

  /* 4c. Триггеры "Записаться" (группа/направление) -> скролл к форме + подстановка */
  document.addEventListener('click', function (e) {
    var trig = e.target.closest ? e.target.closest('.book, .nbtn') : null;
    if (!trig) return;
    e.preventDefault();
    var card = trig.closest('.sc, .ncard');
    var nmEl = card ? (card.querySelector('.nm') || card.querySelector('h3')) : null;
    var tnEl = card ? card.querySelector('.tn') : null;
    var label = (nmEl ? nmEl.textContent.trim() : '') + (tnEl ? ' · ' + tnEl.textContent.trim() : '');
    var form = document.querySelector('.lidform');
    if (!form) return;
    var ch = form.querySelector('.lf-chosen');
    if (ch && label) { ch.querySelector('b').textContent = label; ch.style.display = 'block'; }
    var hid = form.querySelector('[name="Направление"]');
    if (!hid) { hid = document.createElement('input'); hid.type = 'hidden'; hid.name = 'Направление'; form.appendChild(hid); }
    hid.value = label;
    var lead = document.getElementById('lead') || form;
    lead.scrollIntoView({ behavior: 'smooth', block: 'center' });
    var focusIn = form.querySelector('[name="Имя"]');
    if (focusIn) setTimeout(function () { focusIn.focus(); }, 550);
  });

  /* 4d. Отправка любой формы .lidform -> FormSubmit -> на почту студии */
  var LID_EMAIL = 'Life-is-dance@mail.ru'; /* << почта, куда падают заявки (как на исходном сайте) */
  document.addEventListener('submit', function (e) {
    var f = e.target.closest ? e.target.closest('.lidform') : null;
    if (!f) return;
    e.preventDefault();
    var name = f.querySelector('[name="Имя"]');
    var phone = f.querySelector('[name="Телефон"]');
    var contact = f.querySelector('[name="Контакт"]');
    var err = f.querySelector('.lf-err');
    var phoneOk = phone ? phone.value.replace(/\D/g, '').length >= 6 : true;
    var contactOk = contact ? contact.value.trim().length >= 4 : true;
    if ((name && !name.value.trim()) || !phoneOk || !contactOk) {
      if (err) { err.style.display = 'block'; err.textContent = 'Заполните имя и контакт для связи'; }
      return;
    }
    var agree = f.querySelector('.lf-agree');
    if (agree && !agree.checked) {
      if (err) { err.style.display = 'block'; err.textContent = 'Отметьте согласие на обработку персональных данных'; }
      return;
    }
    if (err) err.style.display = 'none';
    var data = { _subject: f.getAttribute('data-subject') || 'Заявка с сайта Life is Dance', _template: 'table' };
    f.querySelectorAll('input, select, textarea').forEach(function (i) { if (i.name) data[i.name] = i.value; });
    var body = f.querySelector('.lf-body'), ok = f.querySelector('.lf-ok');
    var btn = f.querySelector('.subm'); if (btn) { btn.textContent = 'Отправляем…'; btn.disabled = true; }
    var hpf = f.querySelector('.lf-hp');
    if (hpf && hpf.value) { if (body) body.style.display = 'none'; if (ok) ok.style.display = 'block'; return; }
    fetch('https://formsubmit.co/ajax/' + LID_EMAIL, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) { return r.json(); }).then(function () {
      if (body) body.style.display = 'none'; if (ok) ok.style.display = 'block';
    }).catch(function () {
      if (body) body.style.display = 'none'; if (ok) ok.style.display = 'block';
    });
  });

  /* 5. Лёгкий параллакс декоративных пятен */
  var floaters = document.querySelectorAll('[data-par]');
  if (floaters.length) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      floaters.forEach(function (f) {
        var k = parseFloat(f.getAttribute('data-par'));
        f.style.transform = 'translateY(' + (y * k) + 'px)';
      });
    }, { passive: true });
  }

  /* 6. Юридический комплект (152-ФЗ): согласие в формах, cookie-баннер, ссылки в подвале */
  document.querySelectorAll('.lidform .lf-body').forEach(function (body) {
    if (body.querySelector('.lf-consent')) return;
    var sub = body.querySelector('.subm');
    var lab = document.createElement('label');
    lab.className = 'lf-consent';
    lab.innerHTML = '<input type="checkbox" class="lf-agree"> Я даю согласие на обработку моих персональных данных и принимаю <a href="policy.html" target="_blank">Политику конфиденциальности</a>';
    if (sub) body.insertBefore(lab, sub);
    var hp = document.createElement('input');
    hp.type = 'text'; hp.name = '_gotcha'; hp.className = 'lf-hp';
    hp.tabIndex = -1; hp.setAttribute('autocomplete', 'off'); hp.setAttribute('aria-hidden', 'true');
    hp.style.cssText = 'position:absolute!important;left:-9999px!important;width:1px;height:1px;opacity:0';
    body.appendChild(hp);
  });

  document.querySelectorAll('footer .wrap').forEach(function (w) {
    if (w.querySelector('.flegal')) return;
    var d = document.createElement('div');
    d.className = 'flegal';
    d.innerHTML = '<a href="policy.html">Политика конфиденциальности</a>' +
      '<a href="soglasie.html">Согласие на обработку ПДн</a>' +
      '<a href="oferta.html">Публичная оферта</a>' +
      '<span class="cp">© 2011–2026 Life is Dance, г. Королёв. Все права защищены. Информация на сайте не является публичной офертой; актуальные условия и наличие мест уточняйте у администратора.</span>';
    w.appendChild(d);
  });

  if (!localStorage.getItem('lid_cookie_ok')) {
    var ck = document.createElement('div');
    ck.className = 'cookie';
    ck.innerHTML = '<p>Мы используем файлы cookie и обрабатываем персональные данные для работы сайта и вашего удобства. Продолжая пользоваться сайтом, вы соглашаетесь с <a href="policy.html" target="_blank">Политикой конфиденциальности</a>.</p><button type="button" id="cookieOk">Принять</button>';
    document.body.appendChild(ck);
    var cb = document.getElementById('cookieOk');
    if (cb) cb.addEventListener('click', function () { try { localStorage.setItem('lid_cookie_ok', '1'); } catch (e) {} ck.remove(); });
  }

  /* 7. Бургер-меню (мобильное) */
  var hdr = document.querySelector('header');
  var navEl = hdr ? hdr.querySelector('nav') : null;
  if (hdr && navEl && !hdr.querySelector('.burger')) {
    var burger = document.createElement('button');
    burger.className = 'burger';
    burger.setAttribute('aria-label', 'Меню');
    burger.innerHTML = '<span></span><span></span><span></span>';
    hdr.appendChild(burger);
    var mask = document.createElement('div');
    mask.className = 'navmask';
    document.body.appendChild(mask);
    var toggleNav = function (open) {
      burger.classList.toggle('on', open);
      navEl.classList.toggle('open', open);
      mask.classList.toggle('on', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', function () { toggleNav(!navEl.classList.contains('open')); });
    mask.addEventListener('click', function () { toggleNav(false); });
    navEl.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { toggleNav(false); }); });
  }

});
