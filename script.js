const $ = (selector) => document.querySelector(selector);
const content = window.CREZI_CONTENT || { music: [], beats: [] };

const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));

function renderMusic() {
  const grid = $('#musicGrid');
  if (!grid) return;
  grid.replaceChildren();
  (content.music || []).forEach((track, index) => {
    const card = document.createElement('article');
    card.className = 'music-card';
    const cover = track.cover
      ? `<img src="${escapeHTML(track.cover)}" alt="" loading="lazy">`
      : `<div class="cover-placeholder"><span>CREZI</span><b>${String(index + 1).padStart(2, '0')}</b></div>`;
    const links = [
      track.spotify ? `<a href="${escapeHTML(track.spotify)}" target="_blank" rel="noopener noreferrer">Listen on Spotify ↗</a>` : '',
      track.youtube ? `<a href="${escapeHTML(track.youtube)}" target="_blank" rel="noopener noreferrer">YouTube ↗</a>` : ''
    ].filter(Boolean).join('');
    card.innerHTML = `${cover}<div class="music-card-info"><div><p class="eyebrow">${escapeHTML(track.role || 'Own release')}</p><h3>${escapeHTML(track.title || 'Track')}</h3><p>${escapeHTML(track.description || '')}</p></div><div class="music-links">${links}</div></div>`;
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
        card.appendChild(frame);
        button.textContent = '− Hide player';
      });
      card.appendChild(button);
    }
    grid.appendChild(card);
  });
}

function syncBeatFields() {
  const typeSelect = document.getElementById('contactType');
  const beatFields = document.getElementById('beatFields');
  const beatName = document.getElementById('beatName');
  const beatFormat = document.getElementById('beatFormat');
  if (!typeSelect || !beatFields || !beatName || !beatFormat) return;
  const show = typeSelect.value === 'Beats';
  beatFields.hidden = !show;
  beatName.required = show;
  beatFormat.required = show;
}

function openEmailDraft(form, subject, status) {
  const data = new FormData(form);
  const body = [...data.entries()].map(([key, value]) => `${key}: ${String(value).trim()}`).join('\n');
  window.location.href = `mailto:itsscrezi@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  if (status) status.textContent = 'Your email app should open with the request ready. Press Send there to submit it.';
}

const savedTheme = localStorage.getItem('crezi-theme') || 'dark';
document.documentElement.dataset.theme = savedTheme;
const themeIcon = $('#themeIcon');
if (themeIcon) themeIcon.textContent = savedTheme === 'dark' ? '☼' : '☾';
$('#themeToggle')?.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('crezi-theme', next);
  if (themeIcon) themeIcon.textContent = next === 'dark' ? '☼' : '☾';
});

const menuToggle = $('#menuToggle');
const mobileMenu = $('#mobileMenu');
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const open = mobileMenu.hidden;
    mobileMenu.hidden = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    mobileMenu.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
  }));
}

$('#year').textContent = new Date().getFullYear();
const contactType = document.getElementById('contactType');
contactType?.addEventListener('change', syncBeatFields);
syncBeatFields();

$('#contactForm')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const subject = form.elements.subject.value || 'CREZI website enquiry';
  openEmailDraft(form, subject, $('#formStatus'));
});

renderMusic();
