const $ = (selector) => document.querySelector(selector);
const content = window.CREZI_CONTENT || { music: [], aboutPhotos: [], aboutStory: '' };

const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));

const storyNode = document.querySelector('[data-about-story]');
if (storyNode) {
  storyNode.textContent = content.aboutStory || 'Independent Albanian producer and artist.';
}

const languages = {
  en:{home:'Home',discography:'Discography',about:'About',contact:'Contact',tagline:'Independent Albanian producer and artist.',explore:'Explore',ticker:'INDEPENDENT ALBANIAN MUSIC PRODUCER AND ARTIST',chooseLanguage:'Choose language',name:'Name',email:'Email',topic:'Topic',question:'Question',beatRequest:'Beat request',collaboration:'Collaboration',business:'Business inquiry',other:'Other',message:'Message',formNote:'Send your message directly to CREZI.',send:'Send',backTop:'Back to top ↑',listen:'Listen',pause:'Pause',own:'Own release',production:'Production credit',playUnavailable:'Preview unavailable — open on Spotify'},
  nl:{home:'Home',discography:'Discografie',about:'Over',contact:'Contact',tagline:'Onafhankelijke Albanese producer en artiest.',explore:'Ontdek',ticker:'ONAFHANKELIJKE ALBANESE MUZIEKPRODUCENT EN ARTIEST',chooseLanguage:'Kies taal',name:'Naam',email:'E-mail',topic:'Onderwerp',question:'Vraag',beatRequest:'Beat aanvragen',collaboration:'Samenwerking',business:'Zakelijke aanvraag',other:'Anders',message:'Bericht',formNote:'Stuur je bericht rechtstreeks naar CREZI.',send:'Verzenden',backTop:'Terug naar boven ↑',listen:'Luister',pause:'Pauze',own:'Eigen release',production:'Productiecredit',playUnavailable:'Preview niet beschikbaar — open op Spotify'},
  fr:{home:'Accueil',discography:'Discographie',about:'À propos',contact:'Contact',tagline:'Producteur et artiste albanais indépendant.',explore:'Explorer',ticker:'PRODUCTEUR ET ARTISTE ALBANAIS INDÉPENDANT',chooseLanguage:'Choisir la langue',name:'Nom',email:'E-mail',topic:'Sujet',question:'Question',beatRequest:'Demande de beat',collaboration:'Collaboration',business:'Demande professionnelle',other:'Autre',message:'Message',formNote:'Envoyez votre message directement à CREZI.',send:'Envoyer',backTop:'Retour en haut ↑',listen:'Écouter',pause:'Pause',own:'Sortie personnelle',production:'Crédit de production',playUnavailable:'Aperçu indisponible — ouvrir sur Spotify'},
  sq:{home:'Kreu',discography:'Diskografia',about:'Rreth meje',contact:'Kontakt',tagline:'Producent dhe artist i pavarur shqiptar.',explore:'Eksploro',ticker:'PRODUCENT DHE ARTIST I PAVARUR SHQIPTAR I MUZIKËS',chooseLanguage:'Zgjidh gjuhën',name:'Emri',email:'Email',topic:'Tema',question:'Pyetje',beatRequest:'Kërkesë për beat',collaboration:'Bashkëpunim',business:'Kërkesë biznesi',other:'Tjetër',message:'Mesazhi',formNote:'Dërgo mesazhin drejtpërdrejt te CREZI.',send:'Dërgo',backTop:'Kthehu lart ↑',listen:'Dëgjo',pause:'Ndalo',own:'Publikim personal',production:'Krediti i produksionit',playUnavailable:'Pamja paraprake nuk është e disponueshme — hap në Spotify'},
  de:{home:'Start',discography:'Diskografie',about:'Über mich',contact:'Kontakt',tagline:'Unabhängiger albanischer Produzent und Künstler.',explore:'Entdecken',ticker:'UNABHÄNGIGER ALBANISCHER MUSIKPRODUZENT UND KÜNSTLER',chooseLanguage:'Sprache wählen',name:'Name',email:'E-Mail',topic:'Thema',question:'Frage',beatRequest:'Beat-Anfrage',collaboration:'Zusammenarbeit',business:'Geschäftliche Anfrage',other:'Sonstiges',message:'Nachricht',formNote:'Sende deine Nachricht direkt an CREZI.',send:'Senden',backTop:'Nach oben ↑',listen:'Anhören',pause:'Pause',own:'Eigene Veröffentlichung',production:'Produktions-Credit',playUnavailable:'Keine Vorschau verfügbar — auf Spotify öffnen'}
};

let language = localStorage.getItem('crezi-language') || 'en';
let activeAudio = null;
let activeCoverButton = null;
const metadataCache = new Map();

function applyLanguage(next) {
  language = languages[next] ? next : 'en';
  const words = languages[language];
  document.documentElement.lang = language;
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.dataset.i18n;
    if (words[key]) node.textContent = words[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
    const key = node.dataset.i18nPlaceholder;
    if (words[key]) node.placeholder = words[key];
  });
  const picker = $('#languageSelect');
  if (picker) { picker.value = language; picker.setAttribute('aria-label', words.chooseLanguage); }
  localStorage.setItem('crezi-language', language);
  renderMusic();
}

function spotifyTrackId(url) {
  return url?.match(/track\/([a-zA-Z0-9]+)/)?.[1] || '';
}

async function getTrackInfo(track) {
  if (metadataCache.has(track.spotify)) return metadataCache.get(track.spotify);
  const pending = (async () => {
    const info = { cover: track.cover || '', preview: track.preview || '' };
    const id = spotifyTrackId(track.spotify);
    if (id && !info.cover) {
      try {
        const response = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(`https://open.spotify.com/track/${id}`)}`);
        if (response.ok) info.cover = (await response.json()).thumbnail_url || '';
      } catch {}
    }
    if (!info.preview) {
      try {
        const q = encodeURIComponent(`${track.title} ${track.artist || 'CREZI'}`);
        const response = await fetch(`https://itunes.apple.com/search?term=${q}&entity=song&limit=5`);
        if (response.ok) {
          const result = (await response.json()).results?.find((item) => item.previewUrl);
          if (result) {
            info.preview = result.previewUrl;
            if (!info.cover) info.cover = result.artworkUrl100?.replace('100x100bb', '600x600bb') || '';
          }
        }
      } catch {}
    }
    return info;
  })();
  metadataCache.set(track.spotify, pending);
  return pending;
}

function setPlayback(button, playing) {
  const words = languages[language];
  button.classList.toggle('is-playing', playing);
  button.setAttribute('aria-label', `${playing ? words.pause : words.listen}: ${button.dataset.title}`);
  const label = button.querySelector('.play-label');
  const symbol = button.querySelector('.play-symbol');
  if (label) label.textContent = playing ? words.pause : words.listen;
  if (symbol) symbol.textContent = playing ? 'Ⅱ' : '▶';
}

async function toggleTrack(track, button) {
  if (activeCoverButton === button && activeAudio) {
    if (activeAudio.paused) {
      try { await activeAudio.play(); setPlayback(button, true); } catch {}
    } else {
      activeAudio.pause();
      setPlayback(button, false);
    }
    return;
  }

  if (activeAudio) {
    activeAudio.pause();
    activeAudio.src = '';
  }
  if (activeCoverButton) setPlayback(activeCoverButton, false);

  activeCoverButton = button;
  button.disabled = true;
  const info = await getTrackInfo(track);
  button.disabled = false;

  if (!info.preview) {
    button.title = languages[language].playUnavailable;
    window.open(track.spotify, '_blank', 'noopener,noreferrer');
    return;
  }

  if (info.cover && !button.querySelector('.cover-art')) {
    const image = document.createElement('img');
    image.src = info.cover;
    image.alt = '';
    image.loading = 'lazy';
    image.className = 'cover-art';
    button.prepend(image);
    button.classList.add('has-art');
  }

  activeAudio = new Audio(info.preview);
  activeAudio.preload = 'none';
  activeAudio.addEventListener('ended', () => setPlayback(button, false), { once: true });
  activeAudio.addEventListener('play', () => setPlayback(button, true));
  activeAudio.addEventListener('pause', () => setPlayback(button, false));

  try { await activeAudio.play(); } catch { setPlayback(button, false); }
}

function renderMusic() {
  const grid = $('#musicGrid');
  if (!grid) return;
  const words = languages[language];
  grid.replaceChildren();

  (content.music || []).forEach((track) => {
    const card = document.createElement('article');
    card.className = 'music-card';

    const role = track.role === 'Production credit' ? words.production : words.own;
    const cover = document.createElement('button');
    cover.type = 'button';
    cover.className = 'cover-play';
    cover.dataset.title = track.title;
    cover.setAttribute('aria-label', `${words.listen}: ${track.title}`);
    cover.innerHTML = `<span class="cover-placeholder">${esc(track.title)}</span><span class="cover-overlay"><span class="play-symbol">▶</span><span class="play-label">${words.listen}</span></span>`;

    const info = document.createElement('div');
    info.className = 'music-card-info';
    info.innerHTML = `
      <div>
        <p class="eyebrow">${esc(role)}</p>
        <h3>${esc(track.title)}</h3>
      </div>
      <div class="music-links">
        <a class="spotify-link" href="${esc(track.spotify)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(track.title)} on Spotify">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M6.5 9c4.2-1.1 8.5-.6 11.5 1.2M7.2 12c3.4-.8 7-.35 9.7 1.15M8 15c2.8-.55 5.4-.2 7.7.95"/></svg>
          <span>Spotify</span>
        </a>
        ${track.youtube ? `<a href="${esc(track.youtube)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(track.title)} on YouTube"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="4"/><path class="icon-fill" d="m10 9 5 3-5 3z"/></svg><span>YouTube</span></a>` : ''}
      </div>
    `;

    cover.addEventListener('click', () => toggleTrack(track, cover));
    card.append(cover, info);
    grid.appendChild(card);

    getTrackInfo(track).then((meta) => {
      if (meta.cover && cover.isConnected && !cover.querySelector('.cover-art')) {
        const image = document.createElement('img');
        image.src = meta.cover;
        image.alt = '';
        image.loading = 'lazy';
        image.className = 'cover-art';
        cover.prepend(image);
      }
    });
  });
}

function renderPhotoCarousel() {
  const viewport = $('#carouselViewport');
  if (!viewport) return;
  const photos = (content.aboutPhotos || []).filter(Boolean);
  const available = photos.length ? photos : [content.portrait].filter(Boolean);
  if (!available.length) return;

  let index = 0;
  const image = document.createElement('img');
  image.src = available[0];
  image.alt = 'CREZI';
  image.className = 'carousel-photo';
  image.loading = 'lazy';
  viewport.replaceChildren(image);

  const count = $('#photoCount');
  const prev = $('#photoPrevious');
  const next = $('#photoNext');

  const update = (direction) => {
    index = (index + direction + available.length) % available.length;
    image.src = available[index];
    if (count) {
      count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(available.length).padStart(2, '0')}`;
    }
  };

  if (prev) prev.disabled = available.length < 2;
  if (next) next.disabled = available.length < 2;
  if (prev) prev.addEventListener('click', () => update(-1));
  if (next) next.addEventListener('click', () => update(1));
  if (count) count.textContent = `01 / ${String(available.length).padStart(2, '0')}`;
}

const themeToggle = $('#themeToggle');
const themeIcon = $('#themeIcon');
if (themeToggle && themeIcon) {
  document.documentElement.dataset.theme = localStorage.getItem('crezi-theme') || 'dark';
  const updateTheme = () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    themeIcon.textContent = dark ? '☼' : '☾';
    themeToggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  };
  updateTheme();
  themeToggle.addEventListener('click', () => {
    document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('crezi-theme', document.documentElement.dataset.theme);
    updateTheme();
  });
}

$('#languageSelect')?.addEventListener('change', (event) => applyLanguage(event.target.value));

const menu = $('#mobileMenu');
const menuButton = $('#menuToggle');
if (menu && menuButton) {
  menuButton.addEventListener('click', () => {
    menu.hidden = !menu.hidden;
    menuButton.setAttribute('aria-expanded', String(!menu.hidden));
  });
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
  }));
}

$('.image-colour-toggle')?.addEventListener('click', (event) => {
  const button = event.currentTarget;
  const colour = button.classList.toggle('is-colour');
  button.setAttribute('aria-pressed', String(colour));
  button.setAttribute('aria-label', colour ? 'Show portrait in black and white' : 'Show portrait in colour');
});

$('#contactForm')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = $('#submitButton');
  const status = $('#formStatus');
  button.disabled = true;
  status.textContent = language === 'nl' ? 'Verzenden…' : language === 'fr' ? 'Envoi…' : language === 'sq' ? 'Duke dërguar…' : language === 'de' ? 'Wird gesendet…' : 'Sending…';

  try {
    const endpoint = content.formProvider || 'https://formsubmit.co/ajax/itsscrezi@gmail.com';
    const response = await fetch(endpoint, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error('Form service error');
    form.reset();
    status.textContent = language === 'nl' ? 'Bericht verzonden.' : language === 'fr' ? 'Message envoyé.' : language === 'sq' ? 'Mesazhi u dërgua.' : language === 'de' ? 'Nachricht gesendet.' : 'Message sent.';
  } catch {
    status.textContent = language === 'nl' ? 'Verzenden mislukt. Mail ons rechtstreeks.' : language === 'fr' ? 'Échec de l’envoi. Écrivez-nous directement.' : language === 'sq' ? 'Dërgimi dështoi. Na shkruaj drejtpërdrejt.' : language === 'de' ? 'Senden fehlgeschlagen. Schreib direkt eine E-Mail.' : 'Could not send. Please email directly.';
  } finally {
    button.disabled = false;
  }
});

$('#year').textContent = new Date().getFullYear();
applyLanguage(language);
renderPhotoCarousel();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
}
