/* CREZI site script. One file for all behaviour:
   language, theme, menu, ticker, music cards + covers, photo carousel, contact form. */
const $ = (selector) => document.querySelector(selector);
const content = window.CREZI_CONTENT || { music: [], aboutPhotos: [], aboutStoryTranslations: {}, translations: { en: {} } };
const translations = content.translations || { en: {} };
let language = 'en';
const t = (key) => (translations[language] && translations[language][key]) || (translations.en && translations.en[key]) || '';

const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[char]));
function safeGet(key, fallback) { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } }
function safeSet(key, value) { try { localStorage.setItem(key, value); } catch {} }

/* ---------- Icons (SVG, identical on every device) ---------- */
const ICON_ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"></path></svg>';
const ICON_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"></path></svg>';
const ICON_CLOSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"></path></svg>';
const ICON_CHEVRON = '<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"></path></svg>';

/* ---------- Language picker (SVG flags work on Windows too) ---------- */
const languageNames = { en: 'English', nl: 'Nederlands', fr: 'Français', sq: 'Shqip', de: 'Deutsch' };
const flagSvg = {
  en: '<svg class="flag" viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="16" fill="#18316b"/><path d="M0 0l24 16M24 0L0 16" stroke="#fff" stroke-width="4"/><path d="M0 0l24 16M24 0L0 16" stroke="#c8102e" stroke-width="1.7"/><path d="M12 0v16M0 8h24" stroke="#fff" stroke-width="6"/><path d="M12 0v16M0 8h24" stroke="#c8102e" stroke-width="2.6"/></svg>',
  nl: '<svg class="flag" viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="5.34" fill="#ae1c28"/><rect y="5.33" width="24" height="5.34" fill="#fff"/><rect y="10.66" width="24" height="5.34" fill="#21468b"/></svg>',
  fr: '<svg class="flag" viewBox="0 0 24 16" aria-hidden="true"><rect width="8" height="16" fill="#002395"/><rect x="8" width="8" height="16" fill="#fff"/><rect x="16" width="8" height="16" fill="#ed2939"/></svg>',
  sq: '<svg class="flag" viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="16" fill="#e41e20"/><path d="M12 3.2 14 6l3.2-1.1-1.1 3.2 2.8 2-3.4.2L14 13l-2-2.7-3.4.1 2-2.7-1.2-3.1L12 6z" fill="#111"/></svg>',
  de: '<svg class="flag" viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="5.34" fill="#111"/><rect y="5.33" width="24" height="5.34" fill="#d00"/><rect y="10.66" width="24" height="5.34" fill="#ffce00"/></svg>'
};
let refreshPicker = () => {};

function installLanguagePicker() {
  const select = $('#languageSelect');
  const holder = select && select.closest('.language-wrap');
  if (!select || !holder || holder.querySelector('.language-visual')) return;
  select.innerHTML = Object.keys(languageNames).map((code) => `<option value="${code}">${languageNames[code]}</option>`).join('');
  select.classList.add('language-native-hidden');
  select.tabIndex = -1;
  select.setAttribute('aria-hidden', 'true');

  const wrapper = document.createElement('div');
  wrapper.className = 'language-visual';
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'language-visual-toggle';
  toggle.setAttribute('aria-haspopup', 'listbox');
  toggle.setAttribute('aria-expanded', 'false');
  const menu = document.createElement('div');
  menu.className = 'language-visual-menu';
  menu.setAttribute('role', 'listbox');
  menu.hidden = true;

  const close = () => { menu.hidden = true; toggle.setAttribute('aria-expanded', 'false'); };
  Object.keys(languageNames).forEach((code) => {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = 'language-visual-option';
    option.dataset.code = code;
    option.setAttribute('role', 'option');
    option.innerHTML = `${flagSvg[code]}<span>${languageNames[code]}</span>`;
    option.addEventListener('click', () => { close(); toggle.focus(); applyLanguage(code); });
    menu.appendChild(option);
  });
  toggle.addEventListener('click', () => { menu.hidden = !menu.hidden; toggle.setAttribute('aria-expanded', String(!menu.hidden)); });
  document.addEventListener('click', (event) => { if (!wrapper.contains(event.target)) close(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });

  refreshPicker = () => {
    const code = languageNames[language] ? language : 'en';
    select.value = code;
    toggle.innerHTML = `${flagSvg[code]}<span class="lang-name">${languageNames[code]}</span>${ICON_CHEVRON}`;
    toggle.setAttribute('aria-label', `${t('chooseLanguage')}: ${languageNames[code]}`);
    menu.querySelectorAll('.language-visual-option').forEach((option) => option.setAttribute('aria-selected', String(option.dataset.code === code)));
  };
  wrapper.append(toggle, menu);
  select.insertAdjacentElement('afterend', wrapper);
  select.addEventListener('change', (event) => applyLanguage(event.target.value));
}

/* ---------- Ticker: enough copies for any screen, two identical halves = seamless loop ---------- */
let tickerWidth = 0;
let tickerTimer;
function ensureTicker() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  const text = t('ticker') || 'INDEPENDENT ALBANIAN MUSIC PRODUCER AND ARTIST';
  const make = () => { const s = document.createElement('span'); s.textContent = text; return s; };
  track.replaceChildren(make());
  const one = track.firstElementChild.getBoundingClientRect().width || 600;
  const half = Math.max(2, Math.ceil(window.innerWidth / one) + 1);
  for (let i = 1; i < half * 2; i++) track.appendChild(make());
  track.style.setProperty('--ticker-duration', ((one * half) / 70).toFixed(1) + 's');
  const wrap = document.querySelector('.marquee-wrap');
  if (wrap) wrap.setAttribute('aria-label', text);
  tickerWidth = window.innerWidth;
}
addEventListener('resize', () => {
  clearTimeout(tickerTimer);
  tickerTimer = setTimeout(() => { if (window.innerWidth !== tickerWidth) ensureTicker(); }, 200);
});
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ensureTicker());

/* ---------- Song covers: local file first, then Spotify, then Apple ---------- */
const spotifyId = (track) => (track.spotify || '').match(/track\/([a-zA-Z0-9]+)/)?.[1] || '';
const normText = (value) => String(value || '').toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

async function fetchJSON(url, ms = 6000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const response = await fetch(url, { signal: controller.signal });
    return response.ok ? await response.json() : null;
  } catch { return null; } finally { clearTimeout(timer); }
}

async function findRemoteCovers(track) {
  const found = [];
  const id = spotifyId(track);
  if (id) {
    const data = await fetchJSON(`https://open.spotify.com/oembed?url=${encodeURIComponent('https://open.spotify.com/track/' + id)}`);
    if (data && data.thumbnail_url) {
      found.push(data.thumbnail_url.replace('ab67616d00001e02', 'ab67616d0000b273')); // larger version
      found.push(data.thumbnail_url);
    }
  }
  const search = new URL('https://itunes.apple.com/search');
  search.searchParams.set('term', `${track.title || ''} ${track.artist || ''}`.trim());
  search.searchParams.set('entity', 'song');
  search.searchParams.set('limit', '15');
  const data = await fetchJSON(search.toString());
  const results = (data && data.results) || [];
  const title = normText(track.title), artist = normText(track.artist);
  const match = results.find((item) => normText(item.trackName) === title && (!artist || normText(item.artistName) === artist))
    || results.find((item) => normText(item.trackName) === title);
  if (match && match.artworkUrl100) found.push(match.artworkUrl100.replace(/\d+x\d+bb/, '600x600bb'));
  return found;
}

function probeImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.referrerPolicy = 'no-referrer';
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

async function attachCover(track, cover, image) {
  const id = spotifyId(track);
  const show = (src) => { if (!cover.isConnected) return; image.src = src; image.hidden = false; cover.classList.add('has-cover'); };
  const local = [track.cover, id && safeGet(`crezi-cover-${id}`, '')].filter(Boolean);
  for (const src of local) if (await probeImage(src)) return show(src);
  const remote = await findRemoteCovers(track);
  for (const src of remote) {
    if (await probeImage(src)) { if (id) safeSet(`crezi-cover-${id}`, src); return show(src); }
  }
}

/* ---------- Music cards ---------- */
let musicPage = 1;
const MUSIC_PAGE_SIZE = 6; // cards per page once the list gets long

function renderMusic() {
  const grid = $('#musicGrid');
  if (!grid) return;
  grid.replaceChildren();
  const all = content.music || [];
  // 1-2 tracks: big cards. 3 or more: smaller cards in 3 columns.
  grid.dataset.density = all.length > 2 ? 'compact' : 'large';
  const pages = Math.max(1, Math.ceil(all.length / MUSIC_PAGE_SIZE));
  musicPage = Math.min(Math.max(1, musicPage), pages);
  const visible = pages > 1 ? all.slice((musicPage - 1) * MUSIC_PAGE_SIZE, musicPage * MUSIC_PAGE_SIZE) : all;
  visible.forEach((track) => {
    const production = track.role === 'Production credit';
    const card = document.createElement('article');
    card.className = 'music-card';

    const cover = document.createElement('div');
    cover.className = 'music-cover';
    const image = document.createElement('img');
    image.alt = `${track.title || 'Track'} cover`;
    image.decoding = 'async';
    image.referrerPolicy = 'no-referrer';
    image.hidden = true;
    const fallback = document.createElement('span');
    fallback.className = 'cover-title';
    fallback.textContent = track.title || 'CREZI';
    cover.append(image, fallback);
    attachCover(track, cover, image);

    const info = document.createElement('div');
    info.className = 'music-card-info';
    const copy = document.createElement('div');
    copy.className = 'music-copy';
    copy.innerHTML = `<p class="eyebrow">${escapeHTML(production ? t('production') : t('own'))}</p><h3>${escapeHTML(track.title || '')}</h3><p class="track-artist">${escapeHTML(track.artist || 'CREZI')}</p><p class="track-description">${escapeHTML(production ? `${t('prodBy')} · ${track.artist || ''}` : t('released'))}</p>`;
    const links = document.createElement('div');
    links.className = 'music-links';
    [['Spotify', track.spotify], ['YouTube', track.youtube]].forEach(([label, href]) => {
      if (!href) return;
      const a = document.createElement('a');
      a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer';
      a.innerHTML = `${label}${ICON_ARROW}`;
      links.appendChild(a);
    });
    info.append(copy, links);
    card.append(cover, info);

    if (track.spotify) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'embed-toggle';
      button.setAttribute('aria-expanded', 'false');
      const shell = document.createElement('div');
      shell.className = 'spotify-player-shell';
      shell.hidden = true;
      const label = () => { const open = !shell.hidden; button.innerHTML = `${open ? ICON_CLOSE : ICON_PLAY}<span>${escapeHTML(open ? t('hide') : t('listen'))}</span>`; button.setAttribute('aria-expanded', String(open)); };
      label();
      button.addEventListener('click', () => {
        if (!shell.hidden) { shell.hidden = true; shell.replaceChildren(); label(); return; }
        const id = spotifyId(track);
        if (!id) return;
        const iframe = document.createElement('iframe');
        iframe.className = 'spotify-embed';
        iframe.src = `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`;
        iframe.title = `Spotify player: ${track.title} — ${track.artist || 'CREZI'}`;
        iframe.loading = 'lazy';
        iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
        iframe.setAttribute('allowfullscreen', '');
        shell.appendChild(iframe);
        shell.hidden = false;
        label();
      });
      card.append(button, shell);
    }
    grid.appendChild(card);
  });
  renderMusicPager(pages);
}

function renderMusicPager(pages) {
  let pager = $('#musicPager');
  if (!pager) {
    pager = document.createElement('nav');
    pager.id = 'musicPager';
    pager.className = 'music-pager';
    $('#musicGrid').insertAdjacentElement('afterend', pager);
  }
  pager.replaceChildren();
  pager.hidden = pages < 2;
  if (pages < 2) return;
  pager.setAttribute('aria-label', t('pages'));

  const go = (page) => {
    musicPage = page;
    renderMusic();
    const section = $('#discography');
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const make = (html, label, page, disabled, current) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pager-button';
    b.innerHTML = html;
    b.setAttribute('aria-label', label);
    if (disabled) b.disabled = true;
    if (current) b.setAttribute('aria-current', 'page');
    else b.addEventListener('click', () => go(page));
    return b;
  };
  pager.appendChild(make('<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"></path></svg>', t('previousPage'), musicPage - 1, musicPage === 1));

  // 1 ... current-1 current current+1 ... last
  const shown = [...new Set([1, pages, musicPage - 1, musicPage, musicPage + 1])].filter((p) => p >= 1 && p <= pages).sort((a, b) => a - b);
  let last = 0;
  shown.forEach((p) => {
    if (p - last > 1) {
      const gap = document.createElement('span');
      gap.className = 'pager-gap';
      gap.setAttribute('aria-hidden', 'true');
      gap.textContent = '…';
      pager.appendChild(gap);
    }
    pager.appendChild(make(String(p), `${t('page')} ${p}`, p, false, p === musicPage));
    last = p;
  });

  pager.appendChild(make('<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"></path></svg>', t('nextPage'), musicPage + 1, musicPage === pages));
}

/* ---------- Photo carousel ---------- */
function renderPhotoCarousel() {
  const viewport = $('#carouselViewport');
  if (!viewport) return;
  const photos = (content.aboutPhotos || []).filter(Boolean);
  const items = photos.length ? photos : [content.portrait].filter(Boolean);
  if (!items.length) return;
  let index = 0;
  const image = document.createElement('img');
  image.alt = 'CREZI';
  image.className = 'carousel-photo';
  image.loading = 'lazy';
  viewport.replaceChildren(image);
  const count = $('#photoCount'), previous = $('#photoPrevious'), next = $('#photoNext');
  const pad = (n) => String(n).padStart(2, '0');
  const paint = () => {
    image.src = items[index];
    if (count) count.textContent = `${pad(index + 1)} / ${pad(items.length)}`;
    if (previous) previous.disabled = items.length < 2;
    if (next) next.disabled = items.length < 2;
  };
  const move = (delta) => { index = (index + delta + items.length) % items.length; paint(); };
  // A missing photo is skipped instead of leaving a broken image.
  image.addEventListener('error', () => {
    if (items.length < 2) return;
    items.splice(index, 1);
    index = index % items.length;
    paint();
  });
  previous?.addEventListener('click', () => move(-1));
  next?.addEventListener('click', () => move(1));
  paint();
}

/* ---------- Language ---------- */
function applyLanguage(next) {
  language = translations[next] ? next : 'en';
  document.documentElement.lang = language;
  document.title = 'CREZI';
  document.querySelectorAll('[data-i18n]').forEach((node) => { const value = t(node.dataset.i18n); if (value) node.textContent = value; });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => { const value = t(node.dataset.i18nPlaceholder); if (value) node.placeholder = value; });
  document.querySelectorAll('[data-i18n-aria]').forEach((node) => { const value = t(node.dataset.i18nAria); if (value) node.setAttribute('aria-label', value); });
  const story = $('[data-about-story]');
  if (story) story.textContent = (content.aboutStoryTranslations && (content.aboutStoryTranslations[language] || content.aboutStoryTranslations.en)) || t('tagline');
  safeSet('crezi-language', language);
  refreshPicker();
  ensureTicker();
  renderMusic();
  updateTheme();
}

/* ---------- Theme (icons are SVG in index.html; CSS shows the right one) ---------- */
const themeToggle = $('#themeToggle');
document.documentElement.dataset.theme = safeGet('crezi-theme', 'dark');
function updateTheme() {
  const dark = document.documentElement.dataset.theme === 'dark';
  if (themeToggle) themeToggle.setAttribute('aria-pressed', String(!dark));
}
themeToggle?.addEventListener('click', () => {
  document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  safeSet('crezi-theme', document.documentElement.dataset.theme);
  updateTheme();
});

/* ---------- Mobile menu: no text labels, the button is drawn with CSS and becomes an X ---------- */
const menu = $('#mobileMenu'), menuButton = $('#menuToggle');
function setMenu(open) {
  if (!menu || !menuButton) return;
  menu.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
menuButton?.addEventListener('click', () => setMenu(menu.hidden));
menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('click', (event) => {
  if (menu && !menu.hidden && !menu.contains(event.target) && !menuButton.contains(event.target)) setMenu(false);
});
addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });
addEventListener('resize', () => { if (window.innerWidth > 900) setMenu(false); });

/* ---------- Misc ---------- */
$('.image-colour-toggle')?.addEventListener('click', (event) => {
  const button = event.currentTarget;
  const colour = button.classList.toggle('is-colour');
  button.setAttribute('aria-pressed', String(colour));
});
$('#year')?.replaceChildren(document.createTextNode(String(new Date().getFullYear())));

$('#contactForm')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget, button = $('#submitButton'), status = $('#formStatus');
  if (!button || !status) return;
  button.disabled = true;
  status.textContent = t('sending');
  try {
    const response = await fetch(content.formProvider || 'https://formsubmit.co/ajax/itsscrezi@gmail.com', { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Failed');
    status.textContent = t('sent');
    form.reset();
  } catch { status.textContent = t('sendError'); }
  finally { button.disabled = false; }
});

/* ---------- Start ---------- */
installLanguagePicker();
applyLanguage(safeGet('crezi-language', 'en'));
renderPhotoCarousel();
