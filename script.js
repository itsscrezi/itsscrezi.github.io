const $ = (selector) => document.querySelector(selector);
const content = window.CREZI_CONTENT || { music: [], aboutPhotos: [], aboutStoryTranslations: {} };
const translations = {
  en:{home:'Home',discography:'Discography',about:'About',contact:'Contact',mainNavigation:'Main navigation',tagline:'Independent Albanian producer and artist.',ticker:'INDEPENDENT ALBANIAN MUSIC PRODUCER AND ARTIST',chooseLanguage:'Choose language',portraitColour:'Show portrait in colour',portraitMono:'Show portrait in black and white',photoGallery:'CREZI photo gallery',previousPhoto:'Previous photo',nextPhoto:'Next photo',socialMedia:'Social media',instagram:'Instagram',tiktok:'TikTok',youtube:'YouTube',spotify:'Spotify',name:'Name',email:'Email',topic:'Topic',question:'Question',beatRequest:'Beat request',collaboration:'Collaboration',business:'Business inquiry',other:'Other',message:'Message',formNote:'Send your message directly to CREZI.',send:'Send',backTop:'Back to top ↑',listen:'Listen on Spotify',hide:'Hide player',own:'Own release',production:'Production credit',sending:'Sending…',sent:'Message sent successfully.',sendError:'Could not send right now. Please email directly.',track1:'Released by CREZI.',track2:'AyFlori · production by CREZI.',switchLight:'Switch to light mode',switchDark:'Switch to dark mode',openMenu:'Open menu',closeMenu:'Close menu'},
  nl:{home:'Home',discography:'Discografie',about:'Over CREZI',contact:'Contact',mainNavigation:'Hoofdnavigatie',tagline:'Onafhankelijke Albanese producer en artiest.',ticker:'ONAFHANKELIJKE ALBANESE MUZIEKPRODUCENT EN ARTIEST',chooseLanguage:'Kies je taal',portraitColour:'Toon de foto in kleur',portraitMono:'Toon de foto in zwart-wit',photoGallery:'Fotogalerij van CREZI',previousPhoto:'Vorige foto',nextPhoto:'Volgende foto',socialMedia:'Sociale media',instagram:'Instagram',tiktok:'TikTok',youtube:'YouTube',spotify:'Spotify',name:'Naam',email:'E-mail',topic:'Onderwerp',question:'Vraag',beatRequest:'Beat aanvragen',collaboration:'Samenwerking',business:'Zakelijke aanvraag',other:'Anders',message:'Bericht',formNote:'Stuur je bericht rechtstreeks naar CREZI.',send:'Verzenden',backTop:'Terug naar boven ↑',listen:'Luister op Spotify',hide:'Speler verbergen',own:'Eigen release',production:'Productiecredit',sending:'Verzenden…',sent:'Bericht verzonden.',sendError:'Verzenden lukt nu niet. Mail rechtstreeks.',track1:'Uitgebracht door CREZI.',track2:'AyFlori · productie door CREZI.',switchLight:'Schakel naar licht thema',switchDark:'Schakel naar donker thema',openMenu:'Menu openen',closeMenu:'Menu sluiten'},
  fr:{home:'Accueil',discography:'Discographie',about:'À propos',contact:'Contact',mainNavigation:'Navigation principale',tagline:'Producteur et artiste albanais indépendant.',ticker:'PRODUCTEUR ET ARTISTE ALBANAIS INDÉPENDANT',chooseLanguage:'Choisir la langue',portraitColour:'Afficher la photo en couleur',portraitMono:'Afficher la photo en noir et blanc',photoGallery:'Galerie photo de CREZI',previousPhoto:'Photo précédente',nextPhoto:'Photo suivante',socialMedia:'Réseaux sociaux',instagram:'Instagram',tiktok:'TikTok',youtube:'YouTube',spotify:'Spotify',name:'Nom',email:'E-mail',topic:'Sujet',question:'Question',beatRequest:'Demande de beat',collaboration:'Collaboration',business:'Demande professionnelle',other:'Autre',message:'Message',formNote:'Envoyez votre message directement à CREZI.',send:'Envoyer',backTop:'Retour en haut ↑',listen:'Écouter sur Spotify',hide:'Masquer le lecteur',own:'Sortie personnelle',production:'Crédit de production',sending:'Envoi…',sent:'Message envoyé.',sendError:'Envoi impossible pour le moment. Écrivez-nous par e-mail.',track1:'Sorti par CREZI.',track2:'AyFlori · production par CREZI.',switchLight:'Passer au thème clair',switchDark:'Passer au thème sombre',openMenu:'Ouvrir le menu',closeMenu:'Fermer le menu'},
  sq:{home:'Kreu',discography:'Diskografia',about:'Rreth CREZI',contact:'Kontakt',mainNavigation:'Navigimi kryesor',tagline:'Producent dhe artist i pavarur shqiptar.',ticker:'PRODUCENT DHE ARTIST I PAVARUR SHQIPTAR I MUZIKËS',chooseLanguage:'Zgjidh gjuhën',portraitColour:'Shfaq fotografinë me ngjyra',portraitMono:'Shfaq fotografinë bardhë e zi',photoGallery:'Galeria e fotografive të CREZI',previousPhoto:'Fotografia e mëparshme',nextPhoto:'Fotografia tjetër',socialMedia:'Rrjetet sociale',instagram:'Instagram',tiktok:'TikTok',youtube:'YouTube',spotify:'Spotify',name:'Emri',email:'Email',topic:'Tema',question:'Pyetje',beatRequest:'Kërkesë për beat',collaboration:'Bashkëpunim',business:'Kërkesë biznesi',other:'Tjetër',message:'Mesazhi',formNote:'Dërgo mesazhin drejtpërdrejt te CREZI.',send:'Dërgo',backTop:'Kthehu lart ↑',listen:'Dëgjo në Spotify',hide:'Fshihe luajtësin',own:'Publikim personal',production:'Krediti i produksionit',sending:'Duke dërguar…',sent:'Mesazhi u dërgua.',sendError:'Dërgimi nuk u krye. Na shkruaj me email.',track1:'Publikuar nga CREZI.',track2:'AyFlori · produksioni nga CREZI.',switchLight:'Kalo te tema e çelët',switchDark:'Kalo te tema e errët',openMenu:'Hap menynë',closeMenu:'Mbyll menynë'},
  de:{home:'Start',discography:'Diskografie',about:'Über CREZI',contact:'Kontakt',mainNavigation:'Hauptnavigation',tagline:'Unabhängiger albanischer Produzent und Künstler.',ticker:'UNABHÄNGIGER ALBANISCHER MUSIKPRODUZENT UND KÜNSTLER',chooseLanguage:'Sprache wählen',portraitColour:'Porträt in Farbe anzeigen',portraitMono:'Porträt in Schwarz-Weiß anzeigen',photoGallery:'CREZI-Fotogalerie',previousPhoto:'Vorheriges Foto',nextPhoto:'Nächstes Foto',socialMedia:'Soziale Medien',instagram:'Instagram',tiktok:'TikTok',youtube:'YouTube',spotify:'Spotify',name:'Name',email:'E-Mail',topic:'Thema',question:'Frage',beatRequest:'Beat-Anfrage',collaboration:'Zusammenarbeit',business:'Geschäftliche Anfrage',other:'Sonstiges',message:'Nachricht',formNote:'Sende deine Nachricht direkt an CREZI.',send:'Senden',backTop:'Nach oben ↑',listen:'Auf Spotify anhören',hide:'Player schließen',own:'Eigene Veröffentlichung',production:'Produktions-Credit',sending:'Wird gesendet…',sent:'Nachricht gesendet.',sendError:'Senden derzeit nicht möglich. Bitte direkt mailen.',track1:'Veröffentlicht von CREZI.',track2:'AyFlori · Produktion von CREZI.',switchLight:'Zum hellen Design wechseln',switchDark:'Zum dunklen Design wechseln',openMenu:'Menü öffnen',closeMenu:'Menü schließen'}
};

let language = 'en';
const metadataCache = new Map();
const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
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
  if (picker) { picker.value = language; picker.setAttribute('aria-label', words.chooseLanguage); }
  const story = $('[data-about-story]');
  if (story) story.textContent = content.aboutStoryTranslations?.[language] || words.tagline;
  safeSet('crezi-language', language);
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
    info.innerHTML = `<div class="music-copy"><p class="eyebrow">${escapeHTML(role)}</p><h3>${escapeHTML(track.title || '')}</h3><p class="track-artist">${escapeHTML(track.artist || '')}</p><p class="track-description">${escapeHTML(desc)}</p></div><div class="music-links">${track.spotify ? `<a href="${escapeHTML(track.spotify)}" target="_blank" rel="noopener noreferrer">Spotify ↗</a>` : ''}${track.youtube ? `<a href="${escapeHTML(track.youtube)}" target="_blank" rel="noopener noreferrer">YouTube ↗</a>` : ''}</div>`;
    card.append(cover, info);
    if (track.spotify) {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'embed-toggle'; button.setAttribute('aria-expanded', 'false');
      const playerShell = document.createElement('div'); playerShell.className = 'spotify-player-shell'; playerShell.hidden = true;
      const syncButton = () => { const opened = !playerShell.hidden; button.textContent = opened ? `− ${translations[language].hide}` : `▶ ${translations[language].listen}`; button.setAttribute('aria-expanded', String(opened)); };
      button.textContent = `▶ ${words.listen}`;
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

const themeToggle = $('#themeToggle'), themeIcon = $('#themeIcon');
document.documentElement.dataset.theme = safeGet('crezi-theme', 'dark');
function updateTheme() { const dark = document.documentElement.dataset.theme === 'dark'; if (themeIcon) themeIcon.textContent = dark ? '☼' : '☾'; if (themeToggle) themeToggle.setAttribute('aria-label', translations[language][dark ? 'switchLight' : 'switchDark']); }
themeToggle?.addEventListener('click', () => { document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; safeSet('crezi-theme', document.documentElement.dataset.theme); updateTheme(); });
$('#languageSelect')?.addEventListener('change', (event) => applyLanguage(event.target.value));
const menu = $('#mobileMenu'), menuButton = $('#menuToggle');
menuButton?.addEventListener('click', () => { menu.hidden = !menu.hidden; menuButton.setAttribute('aria-expanded', String(!menu.hidden)); menuButton.querySelector('span').textContent = menu.hidden ? '☰' : '×'; menuButton.setAttribute('aria-label', translations[language][menu.hidden ? 'openMenu' : 'closeMenu']); });
menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { menu.hidden = true; if (menuButton) { menuButton.setAttribute('aria-expanded','false'); menuButton.querySelector('span').textContent='☰'; menuButton.setAttribute('aria-label',translations[language].openMenu); } }));
$('.image-colour-toggle')?.addEventListener('click', (event) => { const button = event.currentTarget; const colour = button.classList.toggle('is-colour'); button.setAttribute('aria-pressed', String(colour)); button.setAttribute('aria-label', translations[language][colour ? 'portraitMono' : 'portraitColour']); });
$('#year')?.replaceChildren(document.createTextNode(String(new Date().getFullYear())));
$('#contactForm')?.addEventListener('submit', async (event) => {
  event.preventDefault(); const form = event.currentTarget, button = $('#submitButton'), status = $('#formStatus'), words = translations[language];
  if (!button || !status) return; button.disabled = true; status.textContent = words.sending;
  try { const response = await fetch(content.formProvider || 'https://formsubmit.co/ajax/itsscrezi@gmail.com', { method:'POST', body:new FormData(form), headers:{ Accept:'application/json' } }); if (!response.ok) throw new Error('Form service error'); form.reset(); status.textContent = words.sent; }
  catch { status.textContent = words.sendError; }
  finally { button.disabled = false; }
});
applyLanguage(safeGet('crezi-language', 'en'));
renderPhotoCarousel();
