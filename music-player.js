/* Rebuild music cards with artwork, clear credits and an in-flow Spotify player. */
const musicWords = {
  en: { listen: 'Listen on Spotify', hide: 'Hide player', own: 'Own release', production: 'Production credit', artist: 'Artist' },
  nl: { listen: 'Luister op Spotify', hide: 'Speler verbergen', own: 'Eigen release', production: 'Productiecredit', artist: 'Artiest' },
  fr: { listen: 'Écouter sur Spotify', hide: 'Masquer le lecteur', own: 'Sortie personnelle', production: 'Crédit de production', artist: 'Artiste' },
  sq: { listen: 'Dëgjo në Spotify', hide: 'Fshihe luajtësin', own: 'Publikim personal', production: 'Krediti i produksionit', artist: 'Artisti' },
  de: { listen: 'Auf Spotify anhören', hide: 'Player schließen', own: 'Eigene Veröffentlichung', production: 'Produktions-Credit', artist: 'Künstler' }
};
const coverLookupCache = new Map();

async function findTrackArtwork(track) {
  if (track.cover) return track.cover;
  const key = `${track.title}|${track.artist || ''}`;
  if (coverLookupCache.has(key)) return coverLookupCache.get(key);
  const lookup = (async () => {
    // Spotify's oEmbed thumbnail is preferred. iTunes artwork is a CORS-enabled fallback
    // for browsers that block Spotify's oEmbed response.
    try {
      const response = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(track.spotify)}`);
      if (response.ok) {
        const info = await response.json();
        if (info.thumbnail_url) return info.thumbnail_url;
      }
    } catch {}
    try {
      const term = encodeURIComponent(`${track.title} ${track.artist || ''}`.trim());
      const response = await fetch(`https://itunes.apple.com/search?term=${term}&entity=song&limit=8`);
      if (response.ok) {
        const results = (await response.json()).results || [];
        const normalizedTitle = (track.title || '').toLocaleLowerCase();
        const match = results.find((result) => result.artworkUrl100 && result.trackName?.toLocaleLowerCase() === normalizedTitle)
          || results.find((result) => result.artworkUrl100);
        if (match) return match.artworkUrl100.replace(/\d+x\d+bb/, '600x600bb');
      }
    } catch {}
    return '';
  })();
  coverLookupCache.set(key, lookup);
  return lookup;
}

renderMusic = function renderMusicWithInCardPlayers() {
  const grid = document.querySelector('#musicGrid');
  if (!grid) return;
  const language = document.documentElement.lang || 'en';
  const words = musicWords[language] || musicWords.en;
  grid.replaceChildren();

  (content.music || []).forEach((track) => {
    const card = document.createElement('article');
    card.className = 'music-card';
    const cover = document.createElement('div');
    cover.className = 'music-cover';
    const image = document.createElement('img');
    image.alt = `${track.title || 'Track'} cover`;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.hidden = true;
    image.addEventListener('load', () => { image.hidden = false; cover.classList.add('has-cover'); }, { once: true });
    image.addEventListener('error', () => { image.remove(); cover.classList.remove('has-cover'); }, { once: true });
    cover.appendChild(image);
    const fallback = document.createElement('span');
    fallback.className = 'cover-title';
    fallback.textContent = track.title || 'CREZI';
    cover.appendChild(fallback);
    findTrackArtwork(track).then((src) => { if (src && cover.isConnected) image.src = src; });

    const details = document.createElement('div');
    details.className = 'music-card-info';
    const copy = document.createElement('div');
    copy.className = 'music-copy';
    const role = document.createElement('p');
    role.className = 'eyebrow';
    role.textContent = track.role === 'Production credit' ? words.production : words.own;
    const title = document.createElement('h3');
    title.textContent = track.title || '';
    const artist = document.createElement('p');
    artist.className = 'track-artist';
    artist.textContent = `${words.artist}: ${track.artist || 'CREZI'}`;
    const credit = document.createElement('p');
    credit.className = 'track-description';
    credit.textContent = track.role === 'Production credit'
      ? `${track.artist || 'Artist'} · production by CREZI`
      : (track.description || 'Released by CREZI.');
    copy.append(role, title, artist, credit);
    details.appendChild(copy);

    const links = document.createElement('div');
    links.className = 'music-links';
    if (track.spotify) {
      const spotifyLink = document.createElement('a');
      spotifyLink.href = track.spotify;
      spotifyLink.target = '_blank';
      spotifyLink.rel = 'noopener noreferrer';
      spotifyLink.textContent = 'Spotify ↗';
      links.appendChild(spotifyLink);
    }
    if (track.youtube) {
      const youtubeLink = document.createElement('a');
      youtubeLink.href = track.youtube;
      youtubeLink.target = '_blank';
      youtubeLink.rel = 'noopener noreferrer';
      youtubeLink.textContent = 'YouTube ↗';
      links.appendChild(youtubeLink);
    }
    details.appendChild(links);
    card.append(cover, details);

    if (track.spotify) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'embed-toggle';
      button.textContent = `▶ ${words.listen}`;
      button.setAttribute('aria-expanded', 'false');
      const playerRegion = document.createElement('div');
      playerRegion.className = 'spotify-player-shell';
      playerRegion.hidden = true;
      button.addEventListener('click', () => {
        if (!playerRegion.hidden) {
          playerRegion.hidden = true;
          playerRegion.replaceChildren();
          button.textContent = `▶ ${(musicWords[document.documentElement.lang] || musicWords.en).listen}`;
          button.setAttribute('aria-expanded', 'false');
          return;
        }
        const id = track.spotify.match(/track\/([a-zA-Z0-9]+)/)?.[1];
        if (!id) return;
        const player = document.createElement('iframe');
        player.className = 'spotify-embed';
        player.src = `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`;
        player.title = `Spotify player — ${track.title} by ${track.artist || 'CREZI'}`;
        player.loading = 'lazy';
        player.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
        player.setAttribute('allowfullscreen', '');
        playerRegion.appendChild(player);
        playerRegion.hidden = false;
        button.textContent = `− ${(musicWords[document.documentElement.lang] || musicWords.en).hide}`;
        button.setAttribute('aria-expanded', 'true');
      });
      card.append(button, playerRegion);
    }
    grid.appendChild(card);
  });
};
renderMusic();
