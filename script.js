const $ = (selector) => document.querySelector(selector);
const content = window.CREZI_CONTENT || { music: [], aboutPhotos: [], aboutStoryTranslations: {} };
const translations = {
  en:{home:'Home',discography:'Discography',about:'About',contact:'Contact',mainNavigation:'Main navigation',tagline:'Independent Albanian producer and artist.',ticker:'INDEPENDENT ALBANIAN MUSIC PRODUCER AND ARTIST',chooseLanguage:'Choose language'},
  nl:{home:'Home',discography:'Discografie',about:'Over CREZI',contact:'Contact',mainNavigation:'Hoofdnavigatie',tagline:'Onafhankelijke Albanese producer en artiest.',ticker:'ONAFHANKELIJKE ALBANESE MUZIEKPRODUCENT EN ARTIST',chooseLanguage:'Kies taal'},
  fr:{home:'Accueil',discography:'Discographie',about:'À propos',contact:'Contact',mainNavigation:'Navigation principale',tagline:'Producteur et artiste albanais indépendant.',ticker:'PRODUCTEUR ET ARTISTE ALBANAIS INDÉPENDANT',chooseLanguage:'Choisir la langue'},
  sq:{home:'Kreu',discography:'Diskografia',about:'Rreth CREZI',contact:'Kontakt',mainNavigation:'Navigimi kryesor',tagline:'Producent dhe artist i pavarur shqiptar.',ticker:'PRODUCENT DHE ARTIST I PAVARUR SHQIPTAR',chooseLanguage:'Zgjidh gjuhën'},
  de:{home:'Start',discography:'Diskografie',about:'Über CREZI',contact:'Kontakt',mainNavigation:'Hauptnavigation',tagline:'Unabhängiger albanischer Produzent und Künstler.',ticker:'UNABHÄNGIGER ALBANISCHER MUSIKPRODUZENT UND KÜNSTLER',chooseLanguage:'Sprache wählen'}
};

const languageMeta = [
  { value: 'en', label: '🇬🇧' },
  { value: 'nl', label: '🇳🇱' },
  { value: 'fr', label: '🇫🇷' },
  { value: 'sq', label: '🇦🇱' },
  { value: 'de', label: '🇩🇪' }
];

let language = 'en';

function ensureLanguageOptions() {
  const picker = $('#languageSelect');
  if (!picker) return;
  picker.innerHTML = languageMeta.map((item) => `<option value="${item.value}">${item.label}</option>`).join('');
  picker.value = language;
}

/* Ticker: builds enough copies to fill any screen, always in two identical halves
   so the -50% animation loops seamlessly. */
let tickerWidth = 0;
let tickerTimer;
function ensureTicker() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  const text = translations[language]?.ticker || 'INDEPENDENT ALBANIAN MUSIC PRODUCER AND ARTIST';
  const make = () => { const s = document.createElement('span'); s.textContent = text; return s; };
  track.replaceChildren(make());
  const one = track.firstElementChild.getBoundingClientRect().width || 600;
  const half = Math.max(2, Math.ceil(window.innerWidth / one) + 1);
  for (let i = 1; i < half * 2; i++) track.appendChild(make());
  track.style.setProperty('--ticker-duration', ((one * half) / 70).toFixed(1) + 's');
  tickerWidth = window.innerWidth;
}
addEventListener('resize', () => {
  clearTimeout(tickerTimer);
  tickerTimer = setTimeout(() => { if (window.innerWidth !== tickerWidth) ensureTicker(); }, 200);
});
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ensureTicker());

const metadataCache = new Map();
const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[char]));
function safeGet(key, fallback) { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } }
function safeSet(key, value) { try { localStorage.setItem(key, value); } catch {} }

async function getTrackMetadata(track) {
  if (metadataCache.has(track.spotify)) return metadataCache.get(track.spotify);
  const request = (async () => {
    if (track.cover) return { cover: track.cover, title: track.title, artist: track.artist || '' };
    try {
      const response = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(track.spotify)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.thumbnail_url) return { cover: data.thumbnail_url, title: data.title || track.title, artist: track.artist || '' };
      }
    } catch {}
    return { cover: '', title: track.title, artist: track.artist || '' };
  })();
  metadataCache.set(track.spotify, request);
  return request;
}

function applyLanguage(next) {
  language = translations[next] ? next : 'en';
  const words = translations[language];
  document.documentElement.lang = language;
  document.title = `CREZI — ${words.tagline}`;
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const value = words[node.dataset.i18n];
    if (value) node.textContent = value;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
    const value = words[node.dataset.i18nPlaceholder];
    if (value) node.placeholder = value;
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((node) => {
    const value = words[node.dataset.i18nAria];
    if (value) node.setAttribute('aria-label', value);
  });
  const picker = $('#languageSelect');
  if (picker) {
    picker.value = language;
    picker.setAttribute('aria-label', words.chooseLanguage);
  }
  const story = $('[data-about-story]');
  if (story) story.textContent = content.aboutStoryTranslations?.[language] || words.tagline;
  safeSet('crezi-language', language);
  ensureTicker();
  renderMusic();
  updateTheme();
}

function renderMusic() {
  const grid = $('#musicGrid');
  if (!grid) return;
  const words = translations[language];
  grid.replaceChildren();
  (content.music || []).forEach((track) => {
    const card = document.createElement('article');
    card.className = 'music-card';
    const cover = document.createElement('div');
    cover.className = 'music-cover';
    cover.setAttribute('aria-label', `${track.title || 'Track'} cover`);
    if (track.cover) {
      const image = document.createElement('img'); image.src = track.cover; image.alt = `${track.title || 'Track'} cover`; image.loading = 'lazy'; cover.appendChild(image);
    } else {
      const title = document.createElement('span'); title.className = 'cover-title'; title.textContent = track.title || 'CREZI'; cover.appendChild(title);
      if (track.spotify) getTrackMetadata(track).then((meta) => {
        if (!cover.isConnected || !meta.cover) return;
        const image = document.createElement('img'); image.src = meta.cover; image.alt = `${track.title || 'Track'} cover`; image.loading = 'lazy';
        image.addEventListener('error', () => image.remove(), { once: true });
        cover.prepend(image); cover.classList.add('has-cover');
      });
    }
    const info = document.createElement('div'); info.className = 'music-card-info';
    const role = track.role === 'Production credit' ? words.production : words.own;
    const desc = track.descriptionKey ? words[track.descriptionKey] : (track.description || '');
    info.innerHTML = `<div class="music-copy"><p class="eyebrow">${escapeHTML(role)}</p><h3>${escapeHTML(track.title || '')}</h3><p class="track-artist">${escapeHTML(track.artist || '')}</p><p class="track-description">${escapeHTML(desc || 'Released by CREZI.')}</p></div>`;
    card.append(cover, info);
    if (track.spotify) {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'embed-toggle'; button.setAttribute('aria-expanded', 'false');
      const playerShell = document.createElement('div'); playerShell.className = 'spotify-player-shell'; playerShell.hidden = true;
      const syncButton = () => { const opened = !playerShell.hidden; button.textContent = opened ? translations[language].hide : translations[language].listen; button.setAttribute('aria-expanded', String(opened)); };
      button.textContent = words.listen;
      button.addEventListener('click', () => {
        if (!playerShell.hidden) { playerShell.hidden = true; playerShell.replaceChildren(); syncButton(); return; }
        const id = track.spotify.match(/track\/([a-zA-Z0-9]+)/)?.[1];
        if (!id) return;
        const iframe = document.createElement('iframe');
        iframe.className = 'spotify-embed';
        iframe.src = `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`;
        iframe.title = `Spotify player: ${track.title} — ${track.artist || 'CREZI'}`;
        iframe.loading = 'lazy';
        iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
        iframe.setAttribute('allowfullscreen', '');
        playerShell.appendChild(iframe);
        playerShell.hidden = false;
        syncButton();
      });
      card.append(button, playerShell);
    }
    grid.appendChild(card);
  });
}

function renderPhotoCarousel() {
  const viewport = $('#carouselViewport'); if (!viewport) return;
  const photos = (content.aboutPhotos || []).filter(Boolean);
  const items = photos.length ? photos : [content.portrait].filter(Boolean);
  if (!items.length) return;
  let index = 0;
  const image = document.createElement('img'); image.src = items[0]; image.alt = 'CREZI'; image.className = 'carousel-photo'; image.loading = 'lazy'; viewport.replaceChildren(image);
  const count = $('#photoCount'), previous = $('#photoPrevious'), next = $('#photoNext');
  const update = (delta) => { index = (index + delta + items.length) % items.length; image.src = items[index]; if (count) count.textContent = `${String(index + 1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`; };
  if (count) count.textContent = `01 / ${String(items.length).padStart(2,'0')}`;
  if (previous) { previous.disabled = items.length < 2; previous.addEventListener('click', () => update(-1)); }
  if (next) { next.disabled = items.length < 2; next.addEventListener('click', () => update(1)); }
}

/* Theme (icons are SVG in index.html; CSS shows the right one) */
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
$('#languageSelect')?.addEventListener('change', (event) => applyLanguage(event.target.value));

/* Mobile menu: no text labels, the button is drawn with CSS and becomes an X */
const menu = $('#mobileMenu'), menuButton = $('#menuToggle');
function setMenu(open) {
  if (!menu || !menuButton) return;
  menu.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
menuButton?.addEventListener('click', () => setMenu(menu.hidden));
menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });
addEventListener('resize', () => { if (window.innerWidth > 900) setMenu(false); });

$('.image-colour-toggle')?.addEventListener('click', (event) => { const button = event.currentTarget; const colour = button.classList.toggle('is-colour'); button.setAttribute('aria-pressed', String(colour)); });
$('#year')?.replaceChildren(document.createTextNode(String(new Date().getFullYear())));
$('#contactForm')?.addEventListener('submit', async (event) => {
  event.preventDefault(); const form = event.currentTarget, button = $('#submitButton'), status = $('#formStatus'), words = translations[language];
  if (!button || !status) return; button.disabled = true; status.textContent = words.sending;
  try { const response = await fetch(content.formProvider || 'https://formsubmit.co/ajax/itsscrezi@gmail.com', { method:'POST', body:new FormData(form), headers:{ Accept:'application/json' } });
    if (!response.ok) throw new Error('Failed');
    status.textContent = words.sent;
    form.reset();
  } catch { status.textContent = words.sendError; }
  finally { button.disabled = false; }
});

ensureLanguageOptions();
applyLanguage(safeGet('crezi-language', 'en'));
renderPhotoCarousel();
ensureTicker();
