const $ = (selector) => document.querySelector(selector);
const content = window.CREZI_CONTENT || { music: [], aboutPhotos: [], aboutStoryTranslations: {} };
const translations = {
  en:{home:'Home',discography:'Discography',about:'About',contact:'Contact',mainNavigation:'Main navigation',tagline:'Independent Albanian producer and artist.',ticker:'INDEPENDENT ALBANIAN MUSIC PRODUCER AND ARTIST',chooseLanguage:'Choose language',portraitColour:'Show portrait in colour',portraitMono:'Show portrait in black and white',photoGallery:'CREZI photo gallery',previousPhoto:'Previous photo',nextPhoto:'Next photo',socialMedia:'Social media',instagram:'Instagram',tiktok:'TikTok',youtube:'YouTube',spotify:'Spotify',name:'Name',email:'Email',topic:'Topic',question:'Question',beatRequest:'Beat request',collaboration:'Collaboration',business:'Business inquiry',other:'Other',message:'Message',formNote:'Send your message directly to CREZI.',send:'Send',backTop:'Back to top ↑',listen:'Listen on Spotify',hide:'Hide player',own:'Own release',production:'Production credit',sending:'Sending…',sent:'Message sent successfully.',sendError:'Could not send right now. Please email directly.',track1:'A release by CREZI.',track2:'Produced by CREZI, released with AyFlori.'},
  nl:{home:'Home',discography:'Discografie',about:'Over CREZI',contact:'Contact',mainNavigation:'Hoofdnavigatie',tagline:'Onafhankelijke Albanese producer en artiest.',ticker:'ONAFHANKELIJKE ALBANESE MUZIEKPRODUCENT EN ARTIEST',chooseLanguage:'Kies je taal',portraitColour:'Toon de foto in kleur',portraitMono:'Toon de foto in zwart-wit',photoGallery:'Fotogalerij van CREZI',previousPhoto:'Vorige foto',nextPhoto:'Volgende foto',socialMedia:'Sociale media',instagram:'Instagram',tiktok:'TikTok',youtube:'YouTube',spotify:'Spotify',name:'Naam',email:'E-mail',topic:'Onderwerp',question:'Vraag',beatRequest:'Beat aanvragen',collaboration:'Samenwerking',business:'Zakelijke aanvraag',other:'Anders',message:'Bericht',formNote:'Stuur je bericht rechtstreeks naar CREZI.',send:'Verzenden',backTop:'Terug naar boven ↑',listen:'Luister op Spotify',hide:'Speler verbergen',own:'Eigen release',production:'Productiecredit',sending:'Verzenden…',sent:'Bericht verzonden.',sendError:'Verzenden lukt nu niet. Mail rechtstreeks.',track1:'Een release van CREZI.',track2:'Geproduceerd door CREZI, uitgebracht met AyFlori.'},
  fr:{home:'Accueil',discography:'Discographie',about:'À propos',contact:'Contact',mainNavigation:'Navigation principale',tagline:'Producteur et artiste albanais indépendant.',ticker:'PRODUCTEUR ET ARTISTE ALBANAIS INDÉPENDANT',chooseLanguage:'Choisir la langue',portraitColour:'Afficher la photo en couleur',portraitMono:'Afficher la photo en noir et blanc',photoGallery:'Galerie photo de CREZI',previousPhoto:'Photo précédente',nextPhoto:'Photo suivante',socialMedia:'Réseaux sociaux',instagram:'Instagram',tiktok:'TikTok',youtube:'YouTube',spotify:'Spotify',name:'Nom',email:'E-mail',topic:'Sujet',question:'Question',beatRequest:'Demande de beat',collaboration:'Collaboration',business:'Demande professionnelle',other:'Autre',message:'Message',formNote:'Envoyez votre message directement à CREZI.',send:'Envoyer',backTop:'Retour en haut ↑',listen:'Écouter sur Spotify',hide:'Masquer le lecteur',own:'Sortie personnelle',production:'Crédit de production',sending:'Envoi…',sent:'Message envoyé.',sendError:'Envoi impossible pour le moment. Écrivez-nous par e-mail.',track1:'Un titre de CREZI.',track2:'Produit par CREZI, sorti avec AyFlori.'},
  sq:{home:'Kreu',discography:'Diskografia',about:'Rreth CREZI',contact:'Kontakt',mainNavigation:'Navigimi kryesor',tagline:'Producent dhe artist i pavarur shqiptar.',ticker:'PRODUCENT DHE ARTIST I PAVARUR SHQIPTAR I MUZIKËS',chooseLanguage:'Zgjidh gjuhën',portraitColour:'Shfaq fotografinë me ngjyra',portraitMono:'Shfaq fotografinë bardhë e zi',photoGallery:'Galeria e fotografive të CREZI',previousPhoto:'Fotografia e mëparshme',nextPhoto:'Fotografia tjetër',socialMedia:'Rrjetet sociale',instagram:'Instagram',tiktok:'TikTok',youtube:'YouTube',spotify:'Spotify',name:'Emri',email:'Email',topic:'Tema',question:'Pyetje',beatRequest:'Kërkesë për beat',collaboration:'Bashkëpunim',business:'Kërkesë biznesi',other:'Tjetër',message:'Mesazhi',formNote:'Dërgo mesazhin drejtpërdrejt te CREZI.',send:'Dërgo',backTop:'Kthehu lart ↑',listen:'Dëgjo në Spotify',hide:'Fshihe luajtësin',own:'Publikim personal',production:'Krediti i produksionit',sending:'Duke dërguar…',sent:'Mesazhi u dërgua.',sendError:'Dërgimi nuk u krye. Na shkruaj me email.',track1:'Një publikim nga CREZI.',track2:'Prodhuar nga CREZI, publikuar me AyFlori.'},
  de:{home:'Start',discography:'Diskografie',about:'Über CREZI',contact:'Kontakt',mainNavigation:'Hauptnavigation',tagline:'Unabhängiger albanischer Produzent und Künstler.',ticker:'UNABHÄNGIGER ALBANISCHER MUSIKPRODUZENT UND KÜNSTLER',chooseLanguage:'Sprache wählen',portraitColour:'Porträt in Farbe anzeigen',portraitMono:'Porträt in Schwarz-Weiß anzeigen',photoGallery:'CREZI-Fotogalerie',previousPhoto:'Vorheriges Foto',nextPhoto:'Nächstes Foto',socialMedia:'Soziale Medien',instagram:'Instagram',tiktok:'TikTok',youtube:'YouTube',spotify:'Spotify',name:'Name',email:'E-Mail',topic:'Thema',question:'Frage',beatRequest:'Beat-Anfrage',collaboration:'Zusammenarbeit',business:'Geschäftliche Anfrage',other:'Sonstiges',message:'Nachricht',formNote:'Sende deine Nachricht direkt an CREZI.',send:'Senden',backTop:'Nach oben ↑',listen:'Auf Spotify anhören',hide:'Player schließen',own:'Eigene Veröffentlichung',production:'Produktions-Credit',sending:'Wird gesendet…',sent:'Nachricht gesendet.',sendError:'Senden derzeit nicht möglich. Bitte direkt mailen.',track1:'Eine Veröffentlichung von CREZI.',track2:'Produziert von CREZI, veröffentlicht mit AyFlori.'}
};
let language = 'en';
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
  if (story) story.textContent = content.aboutStoryTranslations?.[language] || words.aboutStory || words.tagline;
  localStorage.setItem('crezi-language', language);
  renderMusic();
}
function renderMusic() {
  const grid = $('#musicGrid');
  if (!grid) return;
  const words = translations[language];
  grid.replaceChildren();
  (content.music || []).forEach((track, index) => {
    const card = document.createElement('article');
    card.className = 'music-card';
    const cover = track.cover
      ? `<div class="music-cover"><img src="${escapeHTML(track.cover)}" alt="${escapeHTML(track.title || '')}" loading="lazy"></div>`
      : `<div class="music-cover cover-placeholder"><span>${escapeHTML(track.title || 'CREZI')}</span><b>${String(index + 1).padStart(2, '0')}</b></div>`;
    const role = track.role === 'Production credit' ? words.production : words.own;
    const description = track.descriptionKey ? words[track.descriptionKey] : (track.description || '');
    card.innerHTML = `${cover}<div class="music-card-info"><div class="music-copy"><p class="eyebrow">${escapeHTML(role)}</p><h3>${escapeHTML(track.title || '')}</h3><p>${escapeHTML(description)}</p></div><div class="music-links">${track.spotify ? `<a href="${escapeHTML(track.spotify)}" target="_blank" rel="noopener noreferrer">Spotify ↗</a>` : ''}${track.youtube ? `<a href="${escapeHTML(track.youtube)}" target="_blank" rel="noopener noreferrer">YouTube ↗</a>` : ''}</div></div>`;
    if (track.spotify) {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'embed-toggle'; button.setAttribute('aria-expanded', 'false');
      const label = () => { const player = card.querySelector('.spotify-embed'); button.textContent = player ? `− ${translations[language].hide}` : `▶ ${translations[language].listen}`; button.setAttribute('aria-expanded', String(Boolean(player))); };
      label();
      button.addEventListener('click', () => {
        let player = card.querySelector('.spotify-embed');
        if (player) { player.remove(); label(); return; }
        const id = track.spotify.match(/track\/([a-zA-Z0-9]+)/)?.[1];
        if (!id) return;
        player = document.createElement('iframe'); player.className = 'spotify-embed';
        player.src = `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`;
        player.title = `Spotify player: ${track.title}`; player.loading = 'lazy';
        player.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
        player.setAttribute('allowfullscreen', ''); player.style.border = '0';
        card.appendChild(player); label();
      });
      card.appendChild(button);
    }
    grid.appendChild(card);
  });
}
function renderPhotoCarousel() {
  const viewport = $('#carouselViewport');
  if (!viewport) return;
  const photos = (content.aboutPhotos || []).filter(Boolean);
  const items = photos.length ? photos : [content.portrait].filter(Boolean);
  if (!items.length) return;
  let index = 0;
  const image = document.createElement('img');
  image.src = items[0]; image.alt = 'CREZI'; image.className = 'carousel-photo'; image.loading = 'lazy';
  viewport.replaceChildren(image);
  const count = $('#photoCount'), previous = $('#photoPrevious'), next = $('#photoNext');
  const update = (delta) => { index = (index + delta + items.length) % items.length; image.src = items[index]; if (count) count.textContent = `${String(index + 1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`; };
  if (count) count.textContent = `01 / ${String(items.length).padStart(2,'0')}`;
  if (previous) { previous.disabled = items.length < 2; previous.addEventListener('click', () => update(-1)); }
  if (next) { next.disabled = items.length < 2; next.addEventListener('click', () => update(1)); }
}
function safeGet(key, fallback) { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } }
function safeSet(key, value) { try { localStorage.setItem(key, value); } catch {} }
const themeToggle = $('#themeToggle'), themeIcon = $('#themeIcon');
document.documentElement.dataset.theme = safeGet('crezi-theme', 'dark');
function updateTheme() { const dark = document.documentElement.dataset.theme === 'dark'; if (themeIcon) themeIcon.textContent = dark ? '☼' : '☾'; if (themeToggle) themeToggle.setAttribute('aria-label', dark ? translations[language].switchLight : translations[language].switchDark); }
themeToggle?.addEventListener('click', () => { document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; safeSet('crezi-theme', document.documentElement.dataset.theme); updateTheme(); });
$('#languageSelect')?.addEventListener('change', (event) => { applyLanguage(event.target.value); updateTheme(); });
const menu = $('#mobileMenu'), menuButton = $('#menuToggle');
menuButton?.addEventListener('click', () => { menu.hidden = !menu.hidden; menuButton.setAttribute('aria-expanded', String(!menu.hidden)); menuButton.querySelector('span').textContent = menu.hidden ? '☰' : '×'; menuButton.setAttribute('aria-label', menu.hidden ? translations[language].openMenu : translations[language].closeMenu); });
menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { menu.hidden = true; if (menuButton) { menuButton.setAttribute('aria-expanded','false'); menuButton.querySelector('span').textContent='☰'; menuButton.setAttribute('aria-label', translations[language].openMenu); } }));
$('.image-colour-toggle')?.addEventListener('click', (event) => { const button = event.currentTarget; const colour = button.classList.toggle('is-colour'); button.setAttribute('aria-pressed', String(colour)); button.setAttribute('aria-label', translations[language][colour ? 'portraitMono' : 'portraitColour']); });
$('#year')?.replaceChildren(document.createTextNode(String(new Date().getFullYear())));
$('#contactForm')?.addEventListener('submit', async (event) => {
  event.preventDefault(); const form = event.currentTarget, button = $('#submitButton'), status = $('#formStatus'); const words = translations[language]; button.disabled = true; status.textContent = words.sending;
  try { const response = await fetch(content.formProvider || 'https://formsubmit.co/ajax/itsscrezi@gmail.com', { method:'POST', body:new FormData(form), headers:{ Accept:'application/json' } }); if (!response.ok) throw new Error('Form service error'); form.reset(); status.textContent = words.sent; }
  catch { status.textContent = words.sendError; }
  finally { button.disabled = false; }
});
applyLanguage(safeGet('crezi-language', 'en'));
updateTheme();
renderPhotoCarousel();
function escapeHTML(value) { return String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])); }
