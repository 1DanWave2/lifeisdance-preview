/* ===== Life is Dance — единый источник данных + рендер =====
   Сайт (price/raspisanie/index) и админка читают/пишут отсюда.
   Данные редактируются в admin.html, сохраняются в localStorage,
   экспортируются в JSON. */

const DEFAULT_DATA = {
  video: [
    { id: 'dc2a57e3561d2dc55783461976154f3f', title: 'LIFE IS DANCE, г. Королёв', dur: '0:51', poster: 'site_images/video1.jpg' },
    { id: '0440c550c3e9944d16aed9adb0a9f022', title: 'Промо студии', dur: '0:48', poster: 'site_images/video2.jpg' },
    { id: '7b3fdd7cf20acec0470f37f1b018a923', title: 'Как проходят занятия', dur: '0:34', poster: 'site_images/video3.jpg' },
    { id: '6d474e8cbbe350b2b53bf813ad390870', title: 'Номер педагогов и коллектив «Стайл»', dur: '4:54', poster: 'site_images/video4.jpg' }
  ],

  tariffs: [
    { name: 'Лайт', qty: '4', unit: 'занятия', note: 'в месяц · срок 4 недели', hit: false, btn: 'Узнать цену',
      features: ['Любое направление для взрослых', 'Занятия 60 или 90 минут', 'Мини-группы до 12 человек'] },
    { name: 'Стандарт', qty: '8', unit: 'занятий', note: 'в месяц · срок 4 недели', hit: true, btn: 'Записаться',
      features: ['Оптимально 2 раза в неделю', 'Занятия 60 или 90 минут', 'Заморозка при болезни', '−10% на второе направление'] },
    { name: 'Про', qty: '12', unit: 'занятий', note: 'в месяц · срок 4 недели', hit: false, btn: 'Узнать цену',
      features: ['Для тех, кто танцует часто', 'Максимальная цена за занятие', 'Любые направления на выбор'] }
  ],

  priceCats: [
    { icon: '🧒', title: 'Дети и подростки', cols: ['Формат', 'Длительность', 'Стоимость'], rows: [
      { nm: '8 занятий в месяц', tm: '45–60 мин', pr: 'по запросу', ask: true },
      { nm: '8 занятий в месяц', tm: '90 мин', pr: 'по запросу', ask: true },
      { nm: '4 занятия в месяц', tm: '60 мин', pr: 'по запросу', ask: true },
      { nm: '4 занятия в месяц', tm: '90 мин', pr: 'по запросу', ask: true },
      { nm: 'Пробное занятие', tm: '60 мин', pr: '500 ₽', ask: false },
      { nm: 'Разовое посещение', tm: '60 / 90 мин', pr: 'по запросу', ask: true }
    ]},
    { icon: '👤', title: 'Индивидуальные занятия', cols: ['Формат', 'Длительность', 'Цена'], rows: [
      { nm: 'Персональное занятие', tm: '60 мин', pr: 'по запросу', ask: true },
      { nm: 'Английский, индивидуально', tm: '60 мин', pr: 'по запросу', ask: true },
      { nm: 'Русский язык, индивидуально', tm: '60 мин', pr: 'по запросу', ask: true }
    ]},
    { icon: '💍', title: 'Свадебный танец', cols: ['Формат', 'Длительность', 'Цена'], rows: [
      { nm: 'Разовое занятие', tm: '60 мин', pr: '3 500 ₽', ask: false },
      { nm: 'Абонемент 4 занятия', tm: '60 мин', pr: '11 000 ₽', ask: false },
      { nm: 'Абонемент 6 занятий', tm: '60 мин', pr: '15 000 ₽', ask: false },
      { nm: 'Абонемент 8 занятий', tm: '60 мин', pr: '18 500 ₽', ask: false }
    ]},
    { icon: '📚', title: 'Образовательные направления', cols: ['Направление', 'Формат', 'Стоимость'], rows: [
      { nm: 'Английский — дошкольники', tm: '8 зан. × 45 мин', pr: 'по запросу', ask: true },
      { nm: 'Английский — школьники 1–8 кл.', tm: '8 зан. × 60 мин', pr: 'по запросу', ask: true },
      { nm: 'Русский язык — курс', tm: '20 зан. (2,5 мес)', pr: 'по запросу', ask: true },
      { nm: 'ИЗО — рисование', tm: '1 раз в неделю, 60 мин', pr: 'по запросу', ask: true }
    ]}
  ],

  conditions: [
    { e: '📅', b: 'Срок абонемента', s: 'Все абонементы действуют 4 недели с даты первого занятия' },
    { e: '❄️', b: 'Заморозка', s: 'Приостановка абонемента на 2 недели — всего 600 ₽' },
    { e: '🎁', b: 'Скидка −10%', s: 'На второе и каждое следующее направление в абонементе' }
  ],

  schedule: [
    // Взрослые
    { name: 'Бачата', cat: 'adult', role: 'Педагог', teacher: 'Дмитрий', av: 'c3', letter: 'Д', status: 'set', tags: ['18+', 'Парные танцы', 'Взрослым'] },
    { name: 'High Heels', cat: 'adult', role: 'Педагог', teacher: 'Дарья', av: 'c6', letter: 'Д', status: 'set', tags: ['18+', 'Пластика', 'Женское'] },
    { name: 'High Heels', cat: 'adult', role: 'Педагог', teacher: 'Дарья', av: 'c6', letter: 'Д', status: 'cl', tags: ['18+', 'Продвинутые'] },
    { name: 'Джаз Микс', cat: 'adult', role: 'Педагог', teacher: 'Анна', av: 'c1', letter: 'А', status: 'set', tags: ['18+', 'Современный'] },
    { name: 'Восточные танцы', cat: 'adult', role: 'Педагог', teacher: 'Юлия', av: 'c2', letter: 'Ю', status: 'set', tags: ['Для здоровья', '60+'] },
    { name: 'Восточные PRO', cat: 'adult', role: 'Педагог', teacher: 'Юлия', av: 'c2', letter: 'Ю', status: 'pro', tags: ['Продолжающие'] },
    { name: 'Shuffle', cat: 'adult', role: 'Педагог', teacher: 'Андрей', av: 'c4', letter: 'А', status: 'set', tags: ['18+', 'Модный стиль'] },
    { name: 'Shuffle PRO', cat: 'adult', role: 'Педагог', teacher: 'Андрей', av: 'c4', letter: 'А', status: 'pro', tags: ['Продолжающие'] },
    { name: 'Стретчинг', cat: 'adult', role: 'Педагог', teacher: 'Екатерина', av: 'c5', letter: 'Е', status: 'set', tags: ['Гибкость', 'Любой возраст'] },
    { name: 'Хип-хоп', cat: 'adult', role: 'Педагог', teacher: 'Ника', av: 'c1', letter: 'Н', status: 'set', tags: ['18+', 'Уличный'] },
    { name: 'Zumba Fitness', cat: 'adult', role: 'Педагог', teacher: 'Евгения', av: 'c2', letter: 'Е', status: 'set', tags: ['Кардио', 'Взрослым'] },
    // Дети и подростки
    { name: 'Хореография', cat: 'kids', role: 'Педагог', teacher: 'Екатерина К.', av: 'c3', letter: 'Е', status: 'set', tags: ['5+', 'Основы танца'] },
    { name: 'Хореография', cat: 'kids', role: 'Педагог', teacher: 'Екатерина К.', av: 'c3', letter: 'Е', status: 'set', tags: ['6+', '8+'] },
    { name: 'Хореография', cat: 'kids', role: 'Педагог', teacher: 'Екатерина Ш.', av: 'c5', letter: 'Е', status: 'cl', tags: ['9+', 'Продвинутые'] },
    { name: 'Модерн', cat: 'kids', role: 'Педагог', teacher: 'Екатерина К.', av: 'c3', letter: 'Е', status: 'set', tags: ['8+', 'Современный'] },
    { name: 'Jazz-Funk', cat: 'kids', role: 'Педагог', teacher: 'Полина', av: 'c6', letter: 'П', status: 'set', tags: ['12+', 'Подросткам'] },
    { name: 'K-POP', cat: 'kids', role: 'Педагог', teacher: 'Евгения', av: 'c2', letter: 'Е', status: 'set', tags: ['10+', 'Тренд'] },
    { name: 'K-POP PRO', cat: 'kids', role: 'Педагог', teacher: 'Евгения', av: 'c2', letter: 'Е', status: 'pro', tags: ['10+', 'Продолжающие'] },
    { name: 'Шаффл', cat: 'kids', role: 'Педагог', teacher: 'Андрей', av: 'c4', letter: 'А', status: 'set', tags: ['8+', 'Уличный'] },
    { name: 'Шаффл PRO', cat: 'kids', role: 'Педагог', teacher: 'Андрей', av: 'c4', letter: 'А', status: 'pro', tags: ['Продолжающие'] },
    { name: 'Хип-хоп', cat: 'kids', role: 'Педагог', teacher: 'Ника', av: 'c1', letter: 'Н', status: 'set', tags: ['6+', '8+'] },
    { name: 'Хип-хоп PRO', cat: 'kids', role: 'Педагог', teacher: 'Ника', av: 'c1', letter: 'Н', status: 'pro', tags: ['10+', 'Продолжающие'] },
    { name: 'Хип-хоп', cat: 'kids', role: 'Педагог', teacher: 'Солмаз', av: 'c4', letter: 'С', status: 'set', tags: ['8+', 'Уличный'] },
    { name: 'Break Dance', cat: 'kids', role: 'Педагог', teacher: 'Константин', av: 'c3', letter: 'К', status: 'set', tags: ['8+', 'Брейкинг'] },
    { name: 'Break Dance PRO', cat: 'kids', role: 'Педагог', teacher: 'Константин', av: 'c3', letter: 'К', status: 'pro', tags: ['Продолжающие'] },
    // Коллектив «Стайл»
    { name: 'Подготовительная', cat: 'style', role: 'Коллектив', teacher: '«Стайл»', av: 'c1', letter: 'С', status: 'set', tags: ['3+', '4+', 'Эстрадный'] },
    { name: 'Младшая группа', cat: 'style', role: 'Коллектив', teacher: '«Стайл»', av: 'c1', letter: 'С', status: 'set', tags: ['6+', 'Конкурсы'] },
    { name: 'Средняя группа', cat: 'style', role: 'Коллектив', teacher: '«Стайл»', av: 'c1', letter: 'С', status: 'pro', tags: ['9+', 'Соревнования'] },
    { name: 'Юниоры', cat: 'style', role: 'Коллектив', teacher: '«Стайл»', av: 'c1', letter: 'С', status: 'pro', tags: ['12+', 'Сцена'] },
    { name: 'Старшая группа', cat: 'style', role: 'Коллектив', teacher: '«Стайл»', av: 'c1', letter: 'С', status: 'pro', tags: ['15+', 'Профи'] }
  ]
};

/* ---- хранилище ---- */
var LID_KEY = 'lid_data_v1';
function lidClone(o) { return JSON.parse(JSON.stringify(o)); }
function lidLoad() {
  try { var s = localStorage.getItem(LID_KEY); return s ? JSON.parse(s) : lidClone(DEFAULT_DATA); }
  catch (e) { return lidClone(DEFAULT_DATA); }
}
function lidSave(d) { try { localStorage.setItem(LID_KEY, JSON.stringify(d)); return true; } catch (e) { return false; } }
function lidReset() { try { localStorage.removeItem(LID_KEY); } catch (e) {} }
function lidEsc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

/* ---- рендер: видео ---- */
function renderVideos(el, d) {
  if (!el) return;
  el.innerHTML = (d.video || []).map(function (v) {
    return '<div class="vcard rv" data-embed="https://rutube.ru/play/embed/' + lidEsc(v.id) + '">' +
      '<div class="vthumb"><img src="' + lidEsc(v.poster) + '" alt="' + lidEsc(v.title) + '" loading="lazy">' +
      '<div class="vplay"><svg viewBox="0 0 24 24" width="30" height="30" fill="#1A2410"><path d="M8 5v14l11-7z"/></svg></div>' +
      '<div class="vdur">' + lidEsc(v.dur) + '</div></div>' +
      '<div class="vtitle">' + lidEsc(v.title) + '</div></div>';
  }).join('');
}

/* ---- рендер: тарифы ---- */
function renderTariffs(el, d) {
  if (!el) return;
  el.innerHTML = (d.tariffs || []).map(function (t) {
    return '<div class="plan rv lift' + (t.hit ? ' hit' : '') + '">' +
      (t.hit ? '<div class="rib">★ Популярный</div>' : '') +
      '<div class="pn">' + lidEsc(t.name) + '</div>' +
      '<div class="pq">' + lidEsc(t.qty) + ' <small>' + lidEsc(t.unit) + '</small></div>' +
      '<div class="pp">' + lidEsc(t.note) + '</div>' +
      '<ul>' + (t.features || []).map(function (f) { return '<li>' + lidEsc(f) + '</li>'; }).join('') + '</ul>' +
      '<a href="#lead" class="btn ' + (t.hit ? '' : 'out ') + 'pbtn">' + lidEsc(t.btn) + '</a></div>';
  }).join('');
}

/* ---- рендер: категории цен (таблицы) ---- */
function renderPriceCats(el, d) {
  if (!el) return;
  el.innerHTML = (d.priceCats || []).map(function (c) {
    var head = '<div class="prow head"><div>' + lidEsc(c.cols[0]) + '</div><div>' + lidEsc(c.cols[1]) +
      '</div><div style="text-align:right">' + lidEsc(c.cols[2]) + '</div></div>';
    var rows = (c.rows || []).map(function (r) {
      return '<div class="prow"><div class="nm">' + lidEsc(r.nm) + '</div><div class="tm">' + lidEsc(r.tm) +
        '</div><div class="pr' + (r.ask ? ' ask' : '') + '">' + lidEsc(r.pr) + '</div></div>';
    }).join('');
    return '<div class="pcat"><div class="pcat-h rv"><span class="em">' + lidEsc(c.icon) + '</span><h3>' +
      lidEsc(c.title) + '</h3></div><div class="ptable rv">' + head + rows + '</div></div>';
  }).join('');
}

/* ---- рендер: условия ---- */
function renderConditions(el, d) {
  if (!el) return;
  el.innerHTML = (d.conditions || []).map(function (i) {
    return '<div class="pi"><span class="e">' + lidEsc(i.e) + '</span><div><b>' + lidEsc(i.b) +
      '</b><span>' + lidEsc(i.s) + '</span></div></div>';
  }).join('');
}

/* ---- рендер: расписание (карточки) ---- */
function renderSchedule(el, d) {
  if (!el) return;
  var lbl = { set: 'набор', pro: 'PRO', cl: 'закрытая' };
  el.innerHTML = (d.schedule || []).map(function (s) {
    var book = s.status === 'cl' ? 'В лист ожидания →' : 'Записаться →';
    return '<div class="sc rv lift" data-cat="' + lidEsc(s.cat) + '">' +
      '<div class="sc-top"><div class="nm">' + lidEsc(s.name) + '</div><div class="stt ' + lidEsc(s.status) + '">' + (lbl[s.status] || '') + '</div></div>' +
      '<div class="teacher"><div class="av ' + lidEsc(s.av) + '">' + lidEsc(s.letter) + '</div>' +
      '<div class="tinfo"><div class="tl">' + lidEsc(s.role) + '</div><div class="tn">' + lidEsc(s.teacher) + '</div></div></div>' +
      '<div class="tags">' + (s.tags || []).map(function (t) { return '<span class="tg">' + lidEsc(t) + '</span>'; }).join('') + '</div>' +
      '<div class="book">' + book + '</div></div>';
  }).join('');
}
