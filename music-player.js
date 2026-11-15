/* Reliable music cards, cross-device language flags, full About photos, and the sliding ticker. */
const musicWords = {
  en:{listen:'Listen on Spotify',hide:'Hide player',own:'Own release',production:'Production credit',artist:'Artist',prodBy:'Production by CREZI'},
  nl:{listen:'Luister op Spotify',hide:'Speler verbergen',own:'Eigen release',production:'Productiecredit',artist:'Artiest',prodBy:'Productie door CREZI'},
  fr:{listen:'Écouter sur Spotify',hide:'Masquer le lecteur',own:'Sortie personnelle',production:'Crédit de production',artist:'Artiste',prodBy:'Production par CREZI'},
  sq:{listen:'Dëgjo në Spotify',hide:'Fshihe luajtësin',own:'Publikim personal',production:'Krediti i produksionit',artist:'Artisti',prodBy:'Produksion nga CREZI'},
  de:{listen:'Auf Spotify anhören',hide:'Player schließen',own:'Eigene Veröffentlichung',production:'Produktions-Credit',artist:'Künstler',prodBy:'Produktion von CREZI'}
};
const artworkMemo = new Map();
const textNorm = (value) => String(value || '').toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

async function findTrackArtwork(track) {
  if (track.cover) return track.cover;
  const id = track.spotify?.match(/track\/([a-zA-Z0-9]+)/)?.[1];
  if (!id) return '';
  if (artworkMemo.has(id)) return artworkMemo.get(id);
  const lookup = (async () => {
    try {
      const response = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(`https://open.spotify.com/track/${id}`)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.thumbnail_url) return data.thumbnail_url;
      }
    } catch {}
    try {
      const url = new URL('https://itunes.apple.com/search');
      url.searchParams.set('term', `${track.title || ''} ${track.artist || ''}`.trim());
      url.searchParams.set('entity', 'song'); url.searchParams.set('limit', '15');
      const response = await fetch(url.toString());
      if (response.ok) {
        const results = (await response.json()).results || [];
        const title = textNorm(track.title), artist = textNorm(track.artist);
        const match = results.find((item) => textNorm(item.trackName) === title && (!artist || textNorm(item.artistName) === artist))
          || results.find((item) => textNorm(item.trackName) === title);
        if (match?.artworkUrl100) return match.artworkUrl100.replace(/\d+x\d+bb/, '600x600bb');
      }
    } catch {}
    return '';
  })();
  artworkMemo.set(id, lookup);
  return lookup;
}

function ensureSiteFixes() {
  const style = document.createElement('style');
  style.textContent = `
    /* Preserve whole photos and let their natural aspect ratio determine the height. */
    #carouselViewport { display:grid !important; place-items:center !important; overflow:visible !important; height:auto !important; max-height:none !important; }
    #carouselViewport .carousel-photo { display:block !important; width:auto !important; height:auto !important; max-width:100% !important; max-height:78svh !important; aspect-ratio:auto !important; object-fit:contain !important; object-position:center !important; }
    /* A continuous, visible, two-copy ticker. */
    .marquee-wrap { display:block !important; width:100% !important; overflow:hidden !important; }
    .marquee-track { display:flex !important; width:max-content !important; max-width:none !important; animation:crezi-glide 28s linear infinite !important; will-change:transform; }
    .marquee-track span { display:block !important; flex:0 0 auto !important; white-space:nowrap !important; }
    @keyframes crezi-glide { from { transform:translate3d(0,0,0); } to { transform:translate3d(-50%,0,0); } }
    .marquee-wrap:hover .marquee-track { animation-play-state:paused !important; }
    /* Keep card content and embeds in normal flow at every viewport size. */
    #musicGrid { display:grid !important; grid-template-columns:repeat(2,minmax(0,1fr)) !important; align-items:start !important; gap:clamp(22px,3vw,40px) !important; }
    #musicGrid > .music-card { display:flex !important; position:relative !important; flex-direction:column !important; align-self:start !important; width:100% !important; height:auto !important; min-height:0 !important; margin:0 !important; padding:clamp(14px,2vw,22px) !important; overflow:hidden !important; contain:none !important; }
    #musicGrid .music-cover { position:relative !important; display:block !important; width:100% !important; height:auto !important; aspect-ratio:1/1 !important; margin:0 0 20px !important; padding:0 !important; overflow:hidden !important; }
    #musicGrid .music-cover > img { position:absolute !important; inset:0 !important; display:block !important; width:100% !important; height:100% !important; object-fit:cover !important; border:0 !important; }
    #musicGrid .music-cover > img[hidden] { display:none !important; }
    #musicGrid .music-cover.has-cover .cover-title { display:none !important; }
    #musicGrid .cover-title { position:absolute !important; inset:auto 0 0 !important; display:flex; align-items:flex-end; min-height:38%; width:100%; padding:24px !important; background:linear-gradient(transparent,rgba(0,0,0,.55)); color:#fff; font-size:clamp(1.7rem,4vw,3rem); line-height:1.1; }
    #musicGrid .music-card-info { position:static !important; display:flex !important; flex-direction:column !important; align-items:stretch !important; width:100% !important; padding:0 0 12px !important; gap:14px !important; }
    #musicGrid .music-copy { width:100% !important; min-width:0 !important; }
    #musicGrid .music-copy .eyebrow { margin:0 0 12px !important; }
    #musicGrid .music-copy h3 { margin:0 0 10px !important; line-height:1.2 !important; letter-spacing:-.025em !important; overflow-wrap:anywhere; }
    #musicGrid .music-copy p { margin:7px 0 0 !important; line-height:1.6 !important; overflow-wrap:anywhere; }
    #musicGrid .track-artist { color:var(--text) !important; font-weight:600; }
    #musicGrid .track-description { color:var(--muted) !important; }
    #musicGrid .music-links { position:static !important; display:flex !important; flex-flow:row wrap !important; justify-content:flex-start !important; gap:12px 18px !important; width:100% !important; margin-top:4px !important; }
    #musicGrid .embed-toggle { position:static !important; display:inline-flex !important; align-self:flex-start !important; width:auto !important; max-width:100% !important; min-height:46px !important; margin:8px 0 14px !important; padding:11px 16px !important; line-height:1.4; white-space:normal !important; }
    #musicGrid .spotify-player-shell, #musicGrid .spotify-player-shell:not([hidden]) { position:static !important; display:block !important; flex:0 0 auto !important; width:100% !important; height:auto !important; min-height:0 !important; max-height:none !important; margin:0 0 6px !important; padding:0 !important; overflow:hidden !important; border-radius:12px; }
    #musicGrid .spotify-player-shell[hidden] { display:none !important; }
    #musicGrid iframe.spotify-embed { position:static !important; display:block !important; float:none !important; transform:none !important; box-sizing:border-box !important; width:100% !important; min-width:0 !important; max-width:100% !important; height:152px !important; min-height:152px !important; max-height:152px !important; margin:0 !important; padding:0 !important; border:0 !important; border-radius:12px !important; }
    /* Language picker uses inline vector flags so flags render consistently on desktop and mobile. */
    .language-wrap { position:relative; }
    .language-wrap select.language-native-hidden { position:absolute !important; width:1px !important; height:1px !important; padding:0 !important; margin:-1px !important; overflow:hidden !important; clip:rect(0,0,0,0) !important; white-space:nowrap !important; border:0 !important; }
    .language-visual { position:relative; }
    .language-visual-toggle { min-height:40px; display:flex; align-items:center; gap:8px; padding:0 10px; border:1px solid var(--line); background:var(--bg); color:var(--text); font:inherit; font-size:.72rem; cursor:pointer; }
    .language-visual-toggle svg { display:block; width:22px; height:15px; flex:none; border-radius:2px; box-shadow:0 0 0 1px rgba(127,127,127,.25); }
    .language-visual-menu { position:absolute; z-index:100; top:calc(100% + 8px); right:0; display:grid; min-width:150px; padding:6px; border:1px solid var(--line); background:var(--surface); box-shadow:var(--shadow); }
    .language-visual-menu[hidden] { display:none !important; }
    .language-visual-option { display:flex; align-items:center; gap:9px; width:100%; padding:9px; border:0; background:transparent; color:var(--text); text-align:left; cursor:pointer; }
    .language-visual-option:hover,.language-visual-option:focus-visible { background:var(--accent-soft); }
    .language-visual-option svg { display:block; width:22px; height:15px; flex:none; border-radius:2px; }
    @media (max-width:700px) { #musicGrid { grid-template-columns:minmax(0,1fr) !important; gap:24px !important; } #musicGrid > .music-card { padding:16px !important; } }
    @media (prefers-reduced-motion:reduce) { .marquee-track { animation:none !important; transform:none !important; } }
  `;
  document.head.appendChild(style);
}

const flagSvg = {
  en:'<svg viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="16" fill="#18316b"/><path d="M0 0l24 16M24 0L0 16" stroke="#fff" stroke-width="4"/><path d="M0 0l24 16M24 0L0 16" stroke="#c8102e" stroke-width="1.7"/><path d="M12 0v16M0 8h24" stroke="#fff" stroke-width="6"/><path d="M12 0v16M0 8h24" stroke="#c8102e" stroke-width="2.6"/></svg>',
  nl:'<svg viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="5.34" fill="#ae1c28"/><rect y="5.33" width="24" height="5.34" fill="#fff"/><rect y="10.66" width="24" height="5.34" fill="#21468b"/></svg>',
  fr:'<svg viewBox="0 0 24 16" aria-hidden="true"><rect width="8" height="16" fill="#002395"/><rect x="8" width="8" height="16" fill="#fff"/><rect x="16" width="8" height="16" fill="#ed2939"/></svg>',
  sq:'<svg viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="16" fill="#e41e20"/><path d="M12 3.2 14 6l3.2-1.1-1.1 3.2 2.8 2-3.4.2L14 13l-2-2.7-3.4.1 2-2.7-1.2-3.1L12 6z" fill="#111"/></svg>',
  de:'<svg viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="5.34" fill="#111"/><rect y="5.33" width="24" height="5.34" fill="#d00"/><rect y="10.66" width="24" height="5.34" fill="#ffce00"/></svg>'
};
const languageNames = { en:'English', nl:'Nederlands', fr:'Français', sq:'Shqip', de:'Deutsch' };
function installVisualLanguagePicker() {
  const select = document.querySelector('#languageSelect');
  const label = select?.closest('.language-wrap');
  if (!select || !label || label.querySelector('.language-visual')) return;
  select.classList.add('language-native-hidden');
  select.tabIndex = -1;
  select.setAttribute('aria-hidden','true');
  const wrapper = document.createElement('div'); wrapper.className = 'language-visual';
  const toggle = document.createElement('button'); toggle.type = 'button'; toggle.className = 'language-visual-toggle'; toggle.setAttribute('aria-haspopup','true'); toggle.setAttribute('aria-expanded','false');
  const menu = document.createElement('div'); menu.className = 'language-visual-menu'; menu.hidden = true;
  const update = () => { const code = select.value || 'en'; toggle.innerHTML = `${flagSvg[code] || flagSvg.en}<span>${languageNames[code] || languageNames.en}</span><span aria-hidden="true">⌄</span>`; };
  Object.keys(languageNames).forEach((code) => {
    const option = document.createElement('button'); option.type = 'button'; option.className = 'language-visual-option'; option.innerHTML = `${flagSvg[code]}<span>${languageNames[code]}</span>`; option.setAttribute('role','option');
    option.addEventListener('click', () => { select.value = code; select.dispatchEvent(new Event('change',{bubbles:true})); menu.hidden = true; toggle.setAttribute('aria-expanded','false'); toggle.focus(); });
    menu.appendChild(option);
  });
  toggle.addEventListener('click', () => { menu.hidden = !menu.hidden; toggle.setAttribute('aria-expanded',String(!menu.hidden)); });
  document.addEventListener('click', (event) => { if (!wrapper.contains(event.target)) { menu.hidden = true; toggle.setAttribute('aria-expanded','false'); } });
  select.addEventListener('change', update);
  wrapper.append(toggle,menu); select.insertAdjacentElement('afterend',wrapper); update();
}

renderMusic = function renderMusicWithArtworkAndFlow() {
  const grid = document.querySelector('#musicGrid'); if (!grid) return;
  const lang = document.documentElement.lang || 'en'; const words = musicWords[lang] || musicWords.en;
  grid.replaceChildren();
  (content.music || []).forEach((track) => {
    const card = document.createElement('article'); card.className = 'music-card';
    const cover = document.createElement('div'); cover.className = 'music-cover';
    const image = document.createElement('img'); image.alt = `${track.title || 'Track'} cover`; image.loading = 'lazy'; image.decoding = 'async'; image.hidden = true;
    image.addEventListener('load', () => { image.hidden = false; cover.classList.add('has-cover'); }, { once:true });
    image.addEventListener('error', () => image.remove(), { once:true }); cover.appendChild(image);
    const fallback = document.createElement('span'); fallback.className = 'cover-title'; fallback.textContent = track.title || 'CREZI'; cover.appendChild(fallback);
    findTrackArtwork(track).then((src) => { if (src && cover.isConnected) image.src = src; });
    const info = document.createElement('div'); info.className = 'music-card-info';
    const copy = document.createElement('div'); copy.className = 'music-copy';
    const role = document.createElement('p'); role.className = 'eyebrow'; role.textContent = track.role === 'Production credit' ? words.production : words.own;
    const title = document.createElement('h3'); title.textContent = track.title || '';
    const artist = document.createElement('p'); artist.className = 'track-artist'; artist.textContent = track.artist || 'CREZI';
    const credit = document.createElement('p'); credit.className = 'track-description'; credit.textContent = track.role === 'Production credit' ? `${words.prodBy} · ${track.artist || 'Artist'}` : (lang === 'nl' ? 'Uitgebracht door CREZI.' : lang === 'fr' ? 'Sorti par CREZI.' : lang === 'sq' ? 'Publikuar nga CREZI.' : lang === 'de' ? 'Veröffentlicht von CREZI.' : 'Released by CREZI.');
    copy.append(role,title,artist,credit);
    const links = document.createElement('div'); links.className = 'music-links';
    if (track.spotify) { const a = document.createElement('a'); a.href = track.spotify; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = 'Spotify ↗'; links.appendChild(a); }
    if (track.youtube) { const a = document.createElement('a'); a.href = track.youtube; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = 'YouTube ↗'; links.appendChild(a); }
    info.append(copy,links); card.append(cover,info);
    if (track.spotify) {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'embed-toggle'; button.textContent = `▶ ${words.listen}`; button.setAttribute('aria-expanded','false');
      const region = document.createElement('div'); region.className = 'spotify-player-shell'; region.hidden = true;
      button.addEventListener('click', () => {
        if (!region.hidden) { region.hidden = true; region.replaceChildren(); button.textContent = `▶ ${(musicWords[document.documentElement.lang] || musicWords.en).listen}`; button.setAttribute('aria-expanded','false'); return; }
        const id = track.spotify.match(/track\/([a-zA-Z0-9]+)/)?.[1]; if (!id) return;
        const player = document.createElement('iframe'); player.className = 'spotify-embed'; player.src = `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`; player.title = `Spotify player — ${track.title} by ${track.artist || 'CREZI'}`; player.loading = 'lazy'; player.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'; player.setAttribute('allowfullscreen','');
        region.appendChild(player); region.hidden = false; button.textContent = `− ${(musicWords[document.documentElement.lang] || musicWords.en).hide}`; button.setAttribute('aria-expanded','true');
      });
      card.append(button,region);
    }
    grid.appendChild(card);
  });
};

ensureSiteFixes();
installVisualLanguagePicker();
const about = document.querySelector('[data-about-story]');
if (about) about.textContent = content.aboutStoryTranslations?.[document.documentElement.lang || 'en'] || content.aboutStoryTranslations?.en || '';
renderMusic();
