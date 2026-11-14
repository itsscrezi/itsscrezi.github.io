const $ = (selector) => document.querySelector(selector);
const content = window.CREZI_CONTENT || { music: [], beats: [] };

const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[char]));

function buildWaveform() {
  return Array.from({ length: 20 }, (_, index) => `<span style="height:${[28, 44, 30, 52, 28, 68, 41, 75, 56, 64, 38, 59, 49, 72, 46, 65, 35, 70, 42, 58][index]}%"></span>`).join('');
}

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

    const links = [
      track.spotify ? `<a href="${track.spotify}" target="_blank" rel="noopener noreferrer">Listen on Spotify ↗</a>` : '',
      track.youtube ? `<a href="${track.youtube}" target="_blank" rel="noopener noreferrer">YouTube ↗</a>` : ''
    ].filter(Boolean).join('');

    card.innerHTML = `
      ${cover}
      <div class="music-card-info">
        <div>
          <p class="eyebrow">${escapeHTML(track.role || 'Own release')}</p>
          <h3>${escapeHTML(track.title || 'Track')}</h3>
          <p>${escapeHTML(track.description || '')}</p>
        </div>
        <div class="music-links">${links}</div>
      </div>
    `;

    if (track.spotify) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'embed-toggle';
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
        frame.src = `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`;
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

function handleBeatPurchase(beat) {
  const finalCheckout = beat.checkoutUrl || 'mailto:itsscrezi@gmail.com?subject=' + encodeURIComponent('Beat order — ' + beat.title);
  window.open(finalCheckout, '_blank', 'noopener,noreferrer');
}

function renderBeats() {
  const grid = $('#beatGrid');
  if (!grid) return;

  grid.innerHTML = '';

  (content.beats || []).forEach((beat, index) => {
    const card = document.createElement('article');
    card.className = 'beat-card';

    const tags = (beat.tags || []).map((tag) => `<span>${escapeHTML(tag)}</span>`).join('');

    card.innerHTML = `
      <div class="beat-top">
        <span class="beat-index">Beat ${String(index + 1).padStart(2, '0')}</span>
        <span class="beat-price">${escapeHTML(beat.price || '€25')}</span>
      </div>
      <h3>${escapeHTML(beat.title || 'Beat')}</h3>
      <div class="beat-tags">${tags}</div>
      <div class="preview-block">${buildWaveform()}</div>
      <div class="beat-actions">
        <button type="button" class="preview-toggle" data-preview="${escapeHTML(beat.preview || '')}">Preview</button>
        <button type="button" class="buy-button">Buy</button>
      </div>
    `;

    const previewButton = card.querySelector('.preview-toggle');
    if (beat.preview) {
      const audio = document.createElement('audio');
      audio.controls = true;
      audio.src = beat.preview;
      audio.preload = 'none';

      previewButton.addEventListener('click', () => {
        const existing = card.querySelector('audio');
        if (existing) {
          existing.remove();
          previewButton.textContent = 'Preview';
          return;
        }

        card.appendChild(audio);
        previewButton.textContent = 'Close';
      });
    } else {
      previewButton.addEventListener('click', () => {
        const existing = card.querySelector('audio');
        if (existing) existing.remove();
        previewButton.textContent = 'Preview not yet uploaded';
        previewButton.disabled = true;
      });
    }

    card.querySelector('.buy-button').addEventListener('click', () => handleBeatPurchase(beat));
    grid.appendChild(card);
  });
}

const savedTheme = localStorage.getItem('crezi-theme') || 'dark';
document.documentElement.dataset.theme = savedTheme;
const themeIcon = $('#themeIcon');
if (themeIcon) themeIcon.textContent = savedTheme === 'dark' ? '☼' : '☾';

const themeToggle = $('#themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('crezi-theme', next);
    if (themeIcon) themeIcon.textContent = next === 'dark' ? '☼' : '☾';
  });
}

const menuToggle = $('#menuToggle');
const mobileMenu = $('#mobileMenu');
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const open = mobileMenu.hidden;
    mobileMenu.hidden = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.hidden = true;
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const contactForm = $('#contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = $('#formStatus');
    const button = $('#submitButton');

    if (button) button.disabled = true;
    if (status) status.textContent = 'Sending...';

    try {
      const response = await fetch('https://formspree.io/f/xpwojodd', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(event.currentTarget)
      });

      if (!response.ok) throw new Error('Submission failed');
      event.currentTarget.reset();
      if (status) status.textContent = 'Thanks — your message was sent.';
    } catch {
      if (status) status.textContent = 'Something went wrong. Please use the email link directly.';
    } finally {
      if (button) button.disabled = false;
    }
  });
}

renderMusic();
renderBeats();
