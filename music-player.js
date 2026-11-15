/* Localized music-card labels and dependable release-artwork lookup. */
const musicWords = {
  en:{listen:'Listen on Spotify',hide:'Hide player',own:'Own release',production:'Production credit',artist:'Artist',prodBy:'Production by CREZI'},
  nl:{listen:'Luister op Spotify',hide:'Speler verbergen',own:'Eigen release',production:'Productiecredit',artist:'Artiest',prodBy:'Productie door CREZI'},
  fr:{listen:'Écouter sur Spotify',hide:'Masquer le lecteur',own:'Sortie personnelle',production:'Crédit de production',artist:'Artiste',prodBy:'Production par CREZI'},
  sq:{listen:'Dëgjo në Spotify',hide:'Fshihe luajtësin',own:'Publikim personal',production:'Krediti i produksionit',artist:'Artisti',prodBy:'Produksion nga CREZI'},
  de:{listen:'Auf Spotify anhören',hide:'Player schließen',own:'Eigene Veröffentlichung',production:'Produktions-Credit',artist:'Künstler',prodBy:'Produktion von CREZI'}
};
const artworkMemo = new Map();
const clean = (value) => String(value || '').toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

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
      url.searchParams.set('entity', 'song');
      url.searchParams.set('limit', '10');
      const response = await fetch(url.toString());
      if (response.ok) {
        const results = (await response.json()).results || [];
        const title = clean(track.title), artist = clean(track.artist);
        const item = results.find((entry) => clean(entry.trackName) === title && (!artist || clean(entry.artistName) === artist))
          || results.find((entry) => clean(entry.trackName) === title);
        if (item?.artworkUrl100) return item.artworkUrl100.replace(/\d+x\d+bb/, '600x600bb');
      }
    } catch {}
    return '';
  })();
  artworkMemo.set(id, lookup);
  return lookup;
}

/* The original HTML already uses Unicode flag emoji. Prefer color-emoji fonts in native pickers. */
const emojiPickerStyle = document.createElement('style');
emojiPickerStyle.textContent = '#languageSelect{font-family:"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif} #languageSelect option{font-family:"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif}';
document.head.appendChild(emojiPickerStyle);

renderMusic = function renderMusicWithArtworkAndCredits() {
  const grid = document.querySelector('#musicGrid');
  if (!grid) return;
  const lang = document.documentElement.lang || 'en';
  const words = musicWords[lang] || musicWords.en;
  grid.replaceChildren();
  (content.music || []).forEach((track) => {
    const card = document.createElement('article'); card.className = 'music-card';
    const cover = document.createElement('div'); cover.className = 'music-cover';
    const image = document.createElement('img'); image.alt = `${track.title || 'Track'} cover`; image.loading = 'lazy'; image.decoding = 'async'; image.hidden = true;
    image.addEventListener('load', () => { image.hidden = false; cover.classList.add('has-cover'); }, { once: true });
    image.addEventListener('error', () => image.remove(), { once: true });
    cover.appendChild(image);
    const fallback = document.createElement('span'); fallback.className = 'cover-title'; fallback.textContent = track.title || 'CREZI'; cover.appendChild(fallback);
    findTrackArtwork(track).then((src) => { if (src && cover.isConnected) image.src = src; });

    const info = document.createElement('div'); info.className = 'music-card-info';
    const copy = document.createElement('div'); copy.className = 'music-copy';
    const role = document.createElement('p'); role.className = 'eyebrow'; role.textContent = track.role === 'Production credit' ? words.production : words.own;
    const title = document.createElement('h3'); title.textContent = track.title || '';
    const artist = document.createElement('p'); artist.className = 'track-artist'; artist.textContent = track.artist || 'CREZI';
    const credit = document.createElement('p'); credit.className = 'track-description';
    credit.textContent = track.role === 'Production credit' ? `${words.prodBy} · ${track.artist || 'Artist'}` : (lang === 'nl' ? 'Uitgebracht door CREZI.' : lang === 'fr' ? 'Sorti par CREZI.' : lang === 'sq' ? 'Publikuar nga CREZI.' : lang === 'de' ? 'Veröffentlicht von CREZI.' : 'Released by CREZI.');
    copy.append(role, title, artist, credit);
    const links = document.createElement('div'); links.className = 'music-links';
    if (track.spotify) { const a = document.createElement('a'); a.href = track.spotify; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = 'Spotify ↗'; links.appendChild(a); }
    if (track.youtube) { const a = document.createElement('a'); a.href = track.youtube; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = 'YouTube ↗'; links.appendChild(a); }
    info.append(copy, links); card.append(cover, info);

    if (track.spotify) {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'embed-toggle'; button.textContent = `▶ ${words.listen}`; button.setAttribute('aria-expanded', 'false');
      const region = document.createElement('div'); region.className = 'spotify-player-shell'; region.hidden = true;
      button.addEventListener('click', () => {
        if (!region.hidden) { region.hidden = true; region.replaceChildren(); button.textContent = `▶ ${(musicWords[document.documentElement.lang] || musicWords.en).listen}`; button.setAttribute('aria-expanded', 'false'); return; }
        const id = track.spotify.match(/track\/([a-zA-Z0-9]+)/)?.[1]; if (!id) return;
        const iframe = document.createElement('iframe'); iframe.className = 'spotify-embed'; iframe.src = `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`; iframe.title = `Spotify player — ${track.title} by ${track.artist || 'CREZI'}`; iframe.loading = 'lazy'; iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'; iframe.setAttribute('allowfullscreen', '');
        region.appendChild(iframe); region.hidden = false; button.textContent = `− ${(musicWords[document.documentElement.lang] || musicWords.en).hide}`; button.setAttribute('aria-expanded', 'true');
      });
      card.append(button, region);
    }
    grid.appendChild(card);
  });
};
renderMusic();
