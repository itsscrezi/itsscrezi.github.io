const $ = (selector) => document.querySelector(selector);
const content = window.CREZI_CONTENT || { music: [], aboutPhotos: [], aboutStory: '' };
const translations = {
  en:{home:'Home',discography:'Discography',about:'About',contact:'Contact',tagline:'Independent Albanian producer and artist.',ticker:'INDEPENDENT ALBANIAN MUSIC PRODUCER AND ARTIST',chooseLanguage:'Choose language',name:'Name',email:'Email',topic:'Topic',question:'Question',beatRequest:'Beat request',collaboration:'Collaboration',business:'Business inquiry',other:'Other',message:'Message',formNote:'Send your message directly to CREZI.',send:'Send',backTop:'Back to top ↑',listen:'Listen on Spotify',hide:'Hide player',own:'Own release',production:'Production credit',sending:'Sending…',sent:'Message sent successfully.',sendError:'Could not send right now. Please email directly.'},
  nl:{home:'Home',discography:'Discografie',about:'Over',contact:'Contact',tagline:'Onafhankelijke Albanese producer en artiest.',ticker:'ONAFHANKELIJKE ALBANESE MUZIEKPRODUCENT EN ARTIEST',chooseLanguage:'Kies taal',name:'Naam',email:'E-mail',topic:'Onderwerp',question:'Vraag',beatRequest:'Beat aanvragen',collaboration:'Samenwerking',business:'Zakelijke aanvraag',other:'Anders',message:'Bericht',formNote:'Stuur je bericht rechtstreeks naar CREZI.',send:'Verzenden',backTop:'Terug naar boven ↑',listen:'Luister op Spotify',hide:'Verberg speler',own:'Eigen release',production:'Productiecredit',sending:'Verzenden…',sent:'Bericht verzonden.',sendError:'Verzenden lukt niet. Mail rechtstreeks.'},
  fr:{home:'Accueil',discography:'Discographie',about:'À propos',contact:'Contact',tagline:'Producteur et artiste albanais indépendant.',ticker:'PRODUCTEUR ET ARTISTE ALBANAIS INDÉPENDANT',chooseLanguage:'Choisir la langue',name:'Nom',email:'E-mail',topic:'Sujet',question:'Question',beatRequest:'Demande de beat',collaboration:'Collaboration',business:'Demande professionnelle',other:'Autre',message:'Message',formNote:'Envoyez votre message directement à CREZI.',send:'Envoyer',backTop:'Retour en haut ↑',listen:'Écouter sur Spotify',hide:'Masquer le lecteur',own:'Sortie personnelle',production:'Crédit de production',sending:'Envoi…',sent:'Message envoyé.',sendError:'Envoi impossible. Contactez-nous par e-mail.'},
  sq:{home:'Kreu',discography:'Diskografia',about:'Rreth meje',contact:'Kontakt',tagline:'Producent dhe artist i pavarur shqiptar.',ticker:'PRODUCENT DHE ARTIST I PAVARUR SHQIPTAR I MUZIKËS',chooseLanguage:'Zgjidh gjuhën',name:'Emri',email:'Email',topic:'Tema',question:'Pyetje',beatRequest:'Kërkesë për beat',collaboration:'Bashkëpunim',business:'Kërkesë biznesi',other:'Tjetër',message:'Mesazhi',formNote:'Dërgo mesazhin drejtpërdrejt te CREZI.',send:'Dërgo',backTop:'Kthehu lart ↑',listen:'Dëgjo në Spotify',hide:'Fshihe luajtësin',own:'Publikim personal',production:'Krediti i produksionit',sending:'Duke dërguar…',sent:'Mesazhi u dërgua.',sendError:'Dërgimi dështoi. Na shkruaj me email.'},
  de:{home:'Start',discography:'Diskografie',about:'Über mich',contact:'Kontakt',tagline:'Unabhängiger albanischer Produzent und Künstler.',ticker:'UNABHÄNGIGER ALBANISCHER MUSIKPRODUZENT UND KÜNSTLER',chooseLanguage:'Sprache wählen',name:'Name',email:'E-Mail',topic:'Thema',question:'Frage',beatRequest:'Beat-Anfrage',collaboration:'Zusammenarbeit',business:'Geschäftliche Anfrage',other:'Sonstiges',message:'Nachricht',formNote:'Sende deine Nachricht direkt an CREZI.',send:'Senden',backTop:'Nach oben ↑',listen:'Auf Spotify anhören',hide:'Player schließen',own:'Eigene Veröffentlichung',production:'Produktions-Credit',sending:'Wird gesendet…',sent:'Nachricht gesendet.',sendError:'Senden fehlgeschlagen. Bitte direkt mailen.'}
};
const esc=(value)=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let language=localStorage.getItem('crezi-language')||'en';
function applyLanguage(next){
  language=translations[next]?next:'en';const words=translations[language];document.documentElement.lang=language;
  document.querySelectorAll('[data-i18n]').forEach(node=>{const key=node.dataset.i18n;if(words[key])node.textContent=words[key];});
  document.querySelectorAll('[data-i18n-placeholder]').forEach(node=>{const key=node.dataset.i18nPlaceholder;if(words[key])node.placeholder=words[key];});
  const picker=$('#languageSelect');if(picker){picker.value=language;picker.setAttribute('aria-label',words.chooseLanguage);}
  localStorage.setItem('crezi-language',language);renderMusic();
}
function renderMusic(){
  const grid=$('#musicGrid');if(!grid)return;grid.replaceChildren();const words=translations[language];
  (content.music||[]).forEach((track,index)=>{
    const card=document.createElement('article');card.className='music-card';
    const cover=track.cover?`<img src="${esc(track.cover)}" alt="${esc(track.title)}" loading="lazy">`:`<div class="cover-placeholder"><span>${esc(track.title||'CREZI')}</span><b>${String(index+1).padStart(2,'0')}</b></div>`;
    const role=track.role==='Production credit'?words.production:words.own;
    card.innerHTML=`${cover}<div class="music-card-info"><div><p class="eyebrow">${esc(role)}</p><h3>${esc(track.title||'')}</h3><p>${esc(track.description||'')}</p></div><div class="music-links">${track.spotify?`<a href="${esc(track.spotify)}" target="_blank" rel="noopener noreferrer">Spotify ↗</a>`:''}${track.youtube?`<a href="${esc(track.youtube)}" target="_blank" rel="noopener noreferrer">YouTube ↗</a>`:''}</div></div>`;
    if(track.spotify){const button=document.createElement('button');button.type='button';button.className='embed-toggle';button.textContent=`▶ ${words.listen}`;button.setAttribute('aria-expanded','false');
      button.addEventListener('click',()=>{let player=card.querySelector('.spotify-embed');if(player){player.remove();button.textContent=`▶ ${translations[language].listen}`;button.setAttribute('aria-expanded','false');return;}
        const id=track.spotify.match(/track\/([a-zA-Z0-9]+)/)?.[1];if(!id)return;player=document.createElement('iframe');player.className='spotify-embed';player.src=`https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`;player.title=`Spotify player: ${track.title}`;player.width='100%';player.height='152';player.loading='lazy';player.allow='autoplay;clipboard-write;encrypted-media;fullscreen;picture-in-picture';player.setAttribute('allowfullscreen','');card.appendChild(player);button.textContent=`− ${translations[language].hide}`;button.setAttribute('aria-expanded','true');});card.appendChild(button);
    }
    grid.appendChild(card);
  });
}
function renderPhotoCarousel(){
  const viewport=$('#carouselViewport');if(!viewport)return;const photos=(content.aboutPhotos||[]).filter(Boolean);const items=photos.length?photos:[content.portrait].filter(Boolean);if(!items.length)return;
  let index=0;const image=document.createElement('img');image.src=items[0];image.alt='CREZI';image.className='carousel-photo';image.loading='lazy';viewport.replaceChildren(image);
  const count=$('#photoCount'),prev=$('#photoPrevious'),next=$('#photoNext');const update=delta=>{index=(index+delta+items.length)%items.length;image.src=items[index];if(count)count.textContent=`${String(index+1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`;};
  if(count)count.textContent=`01 / ${String(items.length).padStart(2,'0')}`;if(prev){prev.disabled=items.length<2;prev.addEventListener('click',()=>update(-1));}if(next){next.disabled=items.length<2;next.addEventListener('click',()=>update(1));}
}
const themeToggle=$('#themeToggle'),themeIcon=$('#themeIcon');document.documentElement.dataset.theme=localStorage.getItem('crezi-theme')||'dark';
function updateTheme(){const dark=document.documentElement.dataset.theme==='dark';if(themeIcon)themeIcon.textContent=dark?'☼':'☾';if(themeToggle)themeToggle.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');}updateTheme();
themeToggle?.addEventListener('click',()=>{document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';localStorage.setItem('crezi-theme',document.documentElement.dataset.theme);updateTheme();});
$('#languageSelect')?.addEventListener('change',event=>applyLanguage(event.target.value));
const menu=$('#mobileMenu'),menuButton=$('#menuToggle');menuButton?.addEventListener('click',()=>{menu.hidden=!menu.hidden;menuButton.setAttribute('aria-expanded',String(!menu.hidden));});menu?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{menu.hidden=true;menuButton?.setAttribute('aria-expanded','false');}));
$('.image-colour-toggle')?.addEventListener('click',event=>{const button=event.currentTarget;const colour=button.classList.toggle('is-colour');button.setAttribute('aria-pressed',String(colour));button.setAttribute('aria-label',colour?'Show portrait in black and white':'Show portrait in colour');});
const story=document.querySelector('[data-about-story]');if(story)story.textContent=content.aboutStory||'Independent Albanian producer and artist.';
$('#year')?.replaceChildren(document.createTextNode(String(new Date().getFullYear())));
$('#contactForm')?.addEventListener('submit',async event=>{event.preventDefault();const form=event.currentTarget,button=$('#submitButton'),status=$('#formStatus'),words=translations[language];button.disabled=true;status.textContent=words.sending;
  try{const response=await fetch(content.formProvider||'https://formsubmit.co/ajax/itsscrezi@gmail.com',{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});if(!response.ok)throw new Error('Form service error');form.reset();status.textContent=words.sent;}
  catch{status.textContent=words.sendError;}
  finally{button.disabled=false;}
});
applyLanguage(language);renderPhotoCarousel();
