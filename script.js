const $ = (selector) => document.querySelector(selector);
const content = window.CREZI_CONTENT || { music: [], beats: [], formspreeEndpoint: "" };

const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[char]));

function renderMusic() {
  const grid = $('#musicGrid');
  if (!grid) return;
  grid.innerHTML = '';

  (content.music || []).forEach((track, index) => {
    const card = document.createElement('article');
    card.className = 'music-card';

    const cover = track.cover
      ? `<img src="${track.cover}" alt="" loading="lazy">`
      : `<div class="cover-placeholder"><span>CREZI</span><b>${String(index + 1).padStart(2, '0')}</b></div>`;

    const role = track.role === 'Own release' ? 'Own release' : 'Production credit';
    const links = [
      track.spotify ? `<a href="${track.spotify}" target="_blank" rel="noopener noreferrer">Listen on Spotify ↗</a>` : '',
      track.youtube ? `<a href="${track.youtube}" target="_blank" rel="noopener noreferrer">YouTube ↗</a>` : ''
    ].filter(Boolean).join('');

    card.innerHTML = `${cover}<div class="music-card-info"><div><p class="eyebrow">${role}</p><h3>${escapeHTML(track.title)}</h3><p>${escapeHTML(track.description || '')}</p></div><div class="music-links">${links}</div></div>`;

    if (track.spotify) {
      const button = document.createElement('button');
      button.className = 'embed-toggle';
      button.type = 'button';
      button.textContent = '＋ Listen here';

      button.addEventListener('click', () => {
        const existing = card.querySelector('.spotify-embed');
        if (existing) {
          existing.remove();
          button.textContent = '＋ Listen here';
          return;
        }

        const id = track.spotify.match(/track\/([a-zA-Z0-9]+)/)?.[1];
        if (!id) return;

        const frame = document.createElement('iframe');
        frame.className = 'spotify-embed';
        frame.src = `https://open.spotify.com/embed/track/${id}`;
        frame.title = `Spotify player: ${track.title}`;
        frame.width = '100%';
        frame.height = '152';
        frame.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
        frame.loading = 'lazy';
        frame.style.border = '0';
        frame.style.borderRadius = '12px';
        card.appendChild(frame);
        button.textContent = '− Hide player';
      });

      card.appendChild(button);
    }

    grid.appendChild(card);
  });
}

function renderBeats() {
  const box = $('.beat-placeholder');
  if (!box || !(content.beats || []).length) return;
  box.innerHTML = '<span class="beat-index">BEAT STORE</span><div class="beat-list"></div>';
  const list = box.querySelector('.beat-list');

  content.beats.forEach((beat) => {
    const item = document.createElement('div');
    item.className = 'beat-item';
    item.innerHTML = `<div><strong>${escapeHTML(beat.title)}</strong><small>${escapeHTML(beat.genre || 'Instrumental')} · ${escapeHTML(beat.bpm || '')} BPM</small></div><strong>${escapeHTML(beat.price || '')}</strong>`;

    if (beat.preview) {
      const audio = document.createElement('audio');
      audio.controls = true;
      audio.src = beat.preview;
      audio.preload = 'none';
      item.appendChild(audio);
    }

    const a = document.createElement('a');
    a.className = 'beat-buy';
    a.href = beat.checkoutUrl || '#contact';
    a.target = beat.checkoutUrl ? '_blank' : '';
    a.rel = beat.checkoutUrl ? 'noopener noreferrer' : '';
    a.textContent = beat.checkoutUrl ? 'Buy ↗' : 'Enquire ↗';
    item.appendChild(a);
    list.appendChild(item);
  });
}

const savedTheme = localStorage.getItem('crezi-theme') || 'dark';
document.documentElement.dataset.theme = savedTheme;
$('#themeIcon').textContent = savedTheme === 'dark' ? '☼' : '☾';

$('#themeToggle').addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('crezi-theme', next);
  $('#themeIcon').textContent = next === 'dark' ? '☼' : '☾';
});

$('#menuToggle').addEventListener('click', () => {
  const menu = $('#mobileMenu');
  const open = menu.hidden;
  menu.hidden = !open;
  $('#menuToggle').setAttribute('aria-expanded', String(open));
});

$('#mobileMenu').querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    $('#mobileMenu').hidden = true;
    $('#menuToggle').setAttribute('aria-expanded', 'false');
  });
});

$('#year').textContent = new Date().getFullYear();

$('#contactForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const status = $('#formStatus');
  const endpoint = content.formspreeEndpoint;

  if (!endpoint) {
    status.textContent = 'The contact form is not connected yet. Please use the email link.';
    return;
  }

  const button = $('#submitButton');
  button.disabled = true;
  status.textContent = 'Sending...';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: new FormData(event.currentTarget),
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) throw new Error('Form submission failed');
    event.currentTarget.reset();
    status.textContent = 'Thanks — your message was sent.';
  } catch {
    status.textContent = 'Something went wrong. Please email me directly.';
  } finally {
    button.disabled = false;
  }
});

renderMusic();
renderBeats();
