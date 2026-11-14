const $ = (selector) => document.querySelector(selector);
const content = window.CREZI_CONTENT || { music: [] };

const translations = {
  en: {
    navHome:'Home', navMusic:'Discography', navAbout:'About', navContact:'Contact', tagline:'Independent Albanian producer and artist.', explore:'Explore',
    ticker:'CREZI / MUSIC / BEATS / PRODUCER / ARTIST /', follow:'Follow', name:'Name', namePlaceholder:'Your name', email:'Email', topic:'Topic', question:'Question', beatRequest:'Beat request', collaboration:'Collaboration', inquiry:'Business inquiry', other:'Other', subject:'Subject', subjectPlaceholder:'Subject', beatIdea:'Beat name or idea', beatIdeaPlaceholder:'Optional', format:'Format', message:'Message', messagePlaceholder:'Write your message', formNote:'Opens your email app to send this message.', send:'Send', backTop:'Back to top ↑', languageLabel:'Choose language', listenSpotify:'Listen on Spotify ↗', youtube:'YouTube ↗', listenHere:'＋ Listen here', hidePlayer:'− Hide player', ownRelease:'Own release', productionCredit:'Production credit', sentDraft:'Your email app should open with the message ready. Press Send there.'
  },
  nl: {
    navHome:'Home', navMusic:'Discografie', navAbout:'Over', navContact:'Contact', tagline:'Onafhankelijke Albanese producer en artiest.', explore:'Ontdek',
    ticker:'CREZI / MUZIEK / BEATS / PRODUCER / ARTIEST /', follow:'Volg', name:'Naam', namePlaceholder:'Je naam', email:'E-mail', topic:'Onderwerp', question:'Vraag', beatRequest:'Beat aanvragen', collaboration:'Samenwerking', inquiry:'Zakelijke aanvraag', other:'Anders', subject:'Onderwerp', subjectPlaceholder:'Onderwerp', beatIdea:'Beatnaam of idee', beatIdeaPlaceholder:'Optioneel', format:'Formaat', message:'Bericht', messagePlaceholder:'Schrijf je bericht', formNote:'Opent je e-mailapp om dit bericht te versturen.', send:'Verzenden', backTop:'Terug naar boven ↑', languageLabel:'Kies taal', listenSpotify:'Luister op Spotify ↗', youtube:'YouTube ↗', listenHere:'＋ Luister hier', hidePlayer:'− Verberg speler', ownRelease:'Eigen release', productionCredit:'Productiecredit', sentDraft:'Je e-mailapp opent met het bericht klaar. Druk daar op Verzenden.'
  },
  fr: {
    navHome:'Accueil', navMusic:'Discographie', navAbout:'À propos', navContact:'Contact', tagline:'Producteur et artiste albanais indépendant.', explore:'Explorer',
    ticker:'CREZI / MUSIQUE / BEATS / PRODUCTEUR / ARTISTE /', follow:'Suivre', name:'Nom', namePlaceholder:'Votre nom', email:'E-mail', topic:'Sujet', question:'Question', beatRequest:'Demande de beat', collaboration:'Collaboration', inquiry:'Demande professionnelle', other:'Autre', subject:'Objet', subjectPlaceholder:'Objet', beatIdea:'Nom du beat ou idée', beatIdeaPlaceholder:'Facultatif', format:'Format', message:'Message', messagePlaceholder:'Écrivez votre message', formNote:'Ouvre votre application e-mail pour envoyer ce message.', send:'Envoyer', backTop:'Retour en haut ↑', languageLabel:'Choisir la langue', listenSpotify:'Écouter sur Spotify ↗', youtube:'YouTube ↗', listenHere:'＋ Écouter ici', hidePlayer:'− Masquer le lecteur', ownRelease:'Sortie personnelle', productionCredit:'Crédit de production', sentDraft:'Votre application e-mail devrait afficher le message. Appuyez sur Envoyer.'
  },
  sq: {
    navHome:'Kreu', navMusic:'Diskografia', navAbout:'Rreth meje', navContact:'Kontakt', tagline:'Producent dhe artist i pavarur shqiptar.', explore:'Eksploro',
    ticker:'CREZI / MUZIKË / BEATS / PRODUCENT / ARTIST /', follow:'Ndiq', name:'Emri', namePlaceholder:'Emri yt', email:'Email', topic:'Tema', question:'Pyetje', beatRequest:'Kërkesë për beat', collaboration:'Bashkëpunim', inquiry:'Kërkesë biznesi', other:'Tjetër', subject:'Subjekti', subjectPlaceholder:'Subjekti', beatIdea:'Emri ose ideja e beat-it', beatIdeaPlaceholder:'Opsionale', format:'Formati', message:'Mesazhi', messagePlaceholder:'Shkruaj mesazhin', formNote:'Hap aplikacionin e email-it për të dërguar mesazhin.', send:'Dërgo', backTop:'Kthehu lart ↑', languageLabel:'Zgjidh gjuhën', listenSpotify:'Dëgjo në Spotify ↗', youtube:'YouTube ↗', listenHere:'＋ Dëgjo këtu', hidePlayer:'− Fshihe luajtësin', ownRelease:'Publikim personal', productionCredit:'Krediti i produksionit', sentDraft:'Aplikacioni i email-it duhet të hapet me mesazhin gati. Shtyp Dërgo.'
  },
  de: {
    navHome:'Start', navMusic:'Diskografie', navAbout:'Über mich', navContact:'Kontakt', tagline:'Unabhängiger albanischer Produzent und Künstler.', explore:'Entdecken',
    ticker:'CREZI / MUSIK / BEATS / PRODUZENT / KÜNSTLER /', follow:'Folgen', name:'Name', namePlaceholder:'Dein Name', email:'E-Mail', topic:'Thema', question:'Frage', beatRequest:'Beat-Anfrage', collaboration:'Zusammenarbeit', inquiry:'Geschäftliche Anfrage', other:'Sonstiges', subject:'Betreff', subjectPlaceholder:'Betreff', beatIdea:'Beatname oder Idee', beatIdeaPlaceholder:'Optional', format:'Format', message:'Nachricht', messagePlaceholder:'Schreib deine Nachricht', formNote:'Öffnet dein E-Mail-Programm zum Senden dieser Nachricht.', send:'Senden', backTop:'Nach oben ↑', languageLabel:'Sprache wählen', listenSpotify:'Auf Spotify anhören ↗', youtube:'YouTube ↗', listenHere:'＋ Hier anhören', hidePlayer:'− Player schließen', ownRelease:'Eigene Veröffentlichung', productionCredit:'Produktions-Credit', sentDraft:'Dein E-Mail-Programm sollte die Nachricht öffnen. Klicke dort auf Senden.'
  }
};

const languageNames = { en:'English', nl:'Nederlands', fr:'Français', sq:'Shqip', de:'Deutsch' };
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
let currentLanguage = localStorage.getItem('crezi-language') || 'en';

function applyLanguage(language) {
  const selected = translations[language] ? language : 'en';
  currentLanguage = selected;
  const words = translations[selected];
  document.documentElement.lang = selected;
  document.title = `CREZI — ${words.tagline}`;
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const value = words[element.dataset.i18n];
    if (value) element.textContent = value;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    const value = words[element.dataset.i18nPlaceholder];
    if (value) element.placeholder = value;
  });
  const languageSelect = $('#languageSelect');
  if (languageSelect) {
    languageSelect.value = selected;
    languageSelect.setAttribute('aria-label', words.languageLabel);
  }
  renderMusic();
  localStorage.setItem('crezi-language', selected);
}

function renderMusic() {
  const grid = $('#musicGrid');
  if (!grid) return;
  const words = translations[currentLanguage];
  grid.replaceChildren();
  (content.music || []).forEach((track) => {
    const card = document.createElement('article');
    card.className = 'music-card';
    const roleKey = track.role === 'Production credit' ? 'productionCredit' : 'ownRelease';
    const links = [
      track.spotify ? `<a href="${escapeHTML(track.spotify)}" target="_blank" rel="noopener noreferrer">${words.listenSpotify}</a>` : '',
      track.youtube ? `<a href="${escapeHTML(track.youtube)}" target="_blank" rel="noopener noreferrer">${words.youtube}</a>` : ''
    ].filter(Boolean).join('');
    const cover = track.cover
      ? `<img src="${escapeHTML(track.cover)}" alt="${escapeHTML(track.title || 'CREZI')}" loading="lazy">`
      : `<div class="cover-placeholder" aria-hidden="true">CREZI</div>`;
    card.innerHTML = `${cover}<div class="music-card-info"><div><p class="eyebrow">${words[roleKey]}</p><h3>${escapeHTML(track.title || '')}</h3></div><div class="music-links">${links}</div></div>`;
    if (track.spotify) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'embed-toggle';
      button.textContent = words.listenHere;
      button.addEventListener('click', () => {
        const existing = card.querySelector('.spotify-embed');
        if (existing) {
          existing.remove();
          button.textContent = words.listenHere;
          return;
        }
        const id = track.spotify.match(/track\/([a-zA-Z0-9]+)/)?.[1];
        if (!id) return;
        const frame = document.createElement('iframe');
        frame.className = 'spotify-embed';
        frame.src = `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`;
        frame.title = `${track.title} Spotify player`;
        frame.loading = 'lazy';
        frame.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
        card.appendChild(frame);
        button.textContent = words.hidePlayer;
      });
      card.appendChild(button);
    }
    grid.appendChild(card);
  });
}

function syncBeatFields() {
  const isBeatRequest = $('#contactType')?.value === 'Beat request';
  const fields = $('#beatFields');
  const idea = $('#beatName');
  const format = $('#beatFormat');
  if (!fields || !idea || !format) return;
  fields.hidden = !isBeatRequest;
  idea.required = false;
  format.required = false;
}

const savedTheme = localStorage.getItem('crezi-theme') || 'dark';
document.documentElement.dataset.theme = savedTheme;
const themeIcon = $('#themeIcon');
const themeToggle = $('#themeToggle');
function updateThemeControl() {
  const isDark = document.documentElement.dataset.theme === 'dark';
  if (themeIcon) themeIcon.textContent = isDark ? '☼' : '☾';
  if (themeToggle) themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
}
updateThemeControl();
themeToggle?.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('crezi-theme', next);
  updateThemeControl();
});

$('#languageSelect')?.addEventListener('change', (event) => applyLanguage(event.currentTarget.value));

const menuToggle = $('#menuToggle');
const mobileMenu = $('#mobileMenu');
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const open = mobileMenu.hidden;
    mobileMenu.hidden = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    mobileMenu.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
  }));
}

$('#year').textContent = new Date().getFullYear();
$('#contactType')?.addEventListener('change', syncBeatFields);
syncBeatFields();
$('#contactForm')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const subject = data.get('subject') || `CREZI — ${data.get('type')}`;
  const body = [...data.entries()].map(([key, value]) => `${key.replaceAll('_', ' ')}: ${String(value).trim()}`).join('\n');
  const mailto = `mailto:itsscrezi@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  $('#formStatus').textContent = translations[currentLanguage].sentDraft;
  window.location.href = mailto;
});

applyLanguage(currentLanguage);
