/* Artwork fetch helper; Spotify oEmbed can be unavailable cross-origin, so use Apple's public artwork endpoint as fallback. */
const artworkMemo = new Map();
async function lookupArtwork(track) {
  if (track.cover) return track.cover;
  const id = track.spotify?.match(/track\/([a-zA-Z0-9]+)/)?.[1];
  if (!id) return '';
  if (artworkMemo.has(id)) return artworkMemo.get(id);
  const task = (async () => {
    try {
      const spotify = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(`https://open.spotify.com/track/${id}`)}`);
      if (spotify.ok) {
        const data = await spotify.json();
        if (data.thumbnail_url) return data.thumbnail_url;
      }
    } catch {}
    try {
      const search = new URL('https://itunes.apple.com/search');
      search.searchParams.set('term', `${track.title || ''} ${track.artist || ''}`.trim());
      search.searchParams.set('entity', 'song');
      search.searchParams.set('limit', '10');
      const response = await fetch(search.toString());
      if (response.ok) {
        const results = (await response.json()).results || [];
        const norm = (value) => String(value || '').toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
        const title = norm(track.title);
        const artist = norm(track.artist);
        const chosen = results.find((item) => norm(item.trackName) === title && (!artist || norm(item.artistName) === artist))
          || results.find((item) => norm(item.trackName) === title)
          || results.find((item) => item.artworkUrl100);
        if (chosen?.artworkUrl100) return chosen.artworkUrl100.replace(/\d+x\d+bb/, '600x600bb');
      }
    } catch {}
    return '';
  })();
  artworkMemo.set(id, task);
  return task;
}
