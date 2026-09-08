/* SMAIT Personas - vanilla JS SPA (no build step, no external deps) */
(function(){
'use strict';

const IMG = window.__SMAIT_IMG__; // {expert,hype,challenger,group} data URIs

const PERSONAS = [
  { id:'expert', name:'The Expert', descriptor:'Thoughtful, data-led and useful.',
    sample:'The deeper point is consistency. If the experience is clear, people tend to stay with it.',
    image: IMG.expert, badge:'Insightful' },
  { id:'challenger', name:'The Challenger', descriptor:'Bold, direct and willing to disagree.',
    sample:'Popular does not always mean useful. The better question is whether it changes what people do next.',
    image: IMG.challenger, badge:'Direct' },
  { id:'hype', name:'The Hype Person', descriptor:'Energetic, positive and expressive.',
    sample:'This is the kind of idea people will actually talk about. Strong message, simple hook, easy to share.',
    image: IMG.hype, badge:'Energetic' },
];

const OBJECTIVES = [
  { id:'replies', title:'Get replies', description:'Start conversations and build engagement.', icon:'msg' },
  { id:'clicks', title:'Drive clicks', description:'Send people to your link, page or offer.', icon:'click' },
  { id:'authority', title:'Build authority', description:'Position your brand as a useful voice.', icon:'crown' },
];

const VOICES = ['Clear and confident','Warm and conversational','Sharp and insightful','Playful and energetic'];

// ---------- tiny state helpers (in-memory, persisted to localStorage for this artifact's own origin) ----------
const store = {
  get(k, d){ try { const v = localStorage.getItem('smait:'+k); return v===null? d : v; } catch(e){ return d; } },
  set(k, v){ try { localStorage.setItem('smait:'+k, v); } catch(e){} },
};

// apply saved theme immediately, before first paint, so there's no light-mode flash
(function(){
  try {
    const saved = store.get('theme', '');
    if(saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  } catch(e){}
})();

let route = location.hash.replace('#','') || '/';
window.addEventListener('hashchange', () => { route = location.hash.replace('#','') || '/'; render(); });
function nav(path){ location.hash = path; }

// ---------- icon set (inline SVG, stroke-based, mirrors lucide look) ----------
function icon(name, size){
  size = size || 20;
  const paths = {
    menu: '<line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/>',
    sparkles: '<path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M5 17l.7 2.1L8 20l-2.3.9L5 23l-.7-2.1L2 20l2.3-.9z"/>',
    link: '<path d="M9 17H7a5 5 0 0 1 0-10h2"/><path d="M15 7h2a5 5 0 0 1 0 10h-2"/><line x1="8" y1="12" x2="16" y2="12"/>',
    arrow: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
    back: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
    msg: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
    click: '<path d="M9 9l11 4-4.5 1.8L14 19z"/><path d="M3 3l3 8"/>',
    crown: '<path d="M2 18h20"/><path d="M4 18l1-9 5 5 2-8 2 8 5-5 1 9"/>',
    ext: '<path d="M15 3h6v6"/><path d="M10 14L21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    shuffle: '<polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
    chevron: '<polyline points="9 18 15 12 9 6"/>',
    send: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/>',
    apple: '<path d="M16.5 7.4c-.9 0-2 .5-2.7.5-.8 0-1.7-.5-2.7-.5-1.4 0-2.7.8-3.4 2.1-1.5 2.6-.4 6.4 1.1 8.5.7 1 1.5 2.2 2.6 2.1 1-.1 1.4-.7 2.7-.7s1.6.7 2.7.6c1.1 0 1.8-1 2.5-2 .8-1.1 1.1-2.2 1.1-2.3-2.4-1-2.8-4.4-.4-5.7-1-1.3-2.4-1.6-2.5-1.6z"/><path d="M14.5 4.5c.5-.6.8-1.4.7-2.2-.7 0-1.6.5-2.1 1.1-.5.5-.9 1.4-.8 2.1.8.1 1.6-.4 2.2-1z"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>',
    cursor: '<path d="M3 3l7.1 18.1 2.1-7.6 7.6-2.1z"/>',
    trend: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
    up: '<line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>',
    card: '<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
    cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    dash: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a8 8 0 0 1 16 0v1"/>',
    loader: '<line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.9" y1="4.9" x2="7.8" y2="7.8"/><line x1="16.2" y1="16.2" x2="19.1" y2="19.1"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.9" y1="19.1" x2="7.8" y2="16.2"/><line x1="16.2" y1="7.8" x2="19.1" y2="4.9"/>',
    sun: '<circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.9" y1="4.9" x2="6.3" y2="6.3"/><line x1="17.7" y1="17.7" x2="19.1" y2="19.1"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.9" y1="19.1" x2="6.3" y2="17.7"/><line x1="17.7" y1="6.3" x2="19.1" y2="4.9"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
    trendUp: '<polyline points="3 17 9 11 13 15 21 6"/><polyline points="15 6 21 6 21 12"/>',
    google: null,
  };
  if(name==='google'){
    return `<svg width="${size}" height="${size}" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.6 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.7 18.9 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.6 6 29.6 4 24 4 16 4 9 8.5 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.4 0 10.3-1.9 14-5.1l-6.5-5.4C29.3 35.4 26.8 36 24 36c-5.3 0-9.9-3.4-11.5-8.1l-6.6 5C9 39.4 16 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 3-3.3 5.4-6.4 6.9l6.5 5.4C39.6 37.6 44 31.5 44 24c0-1.3-.1-2.7-.4-3.5z"/></svg>`;
  }
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||''}</svg>`;
}

// ---------- shell (sidebar + bottom nav) ----------
function initCometCards(){
  const cards = document.querySelectorAll('.comet-card');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduceMotion) return;

  cards.forEach(card => {
    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      const dx = x - xc;
      const dy = y - yc;
      const tiltX = (dy / yc) * -6;
      const tiltY = (dx / xc) * 6;
      card.style.setProperty('--comet-tilt-x', `${tiltX.toFixed(2)}deg`);
      card.style.setProperty('--comet-tilt-y', `${tiltY.toFixed(2)}deg`);
      card.style.setProperty('--comet-glow-x', `${(x / rect.width * 100).toFixed(1)}%`);
      card.style.setProperty('--comet-glow-y', `${(y / rect.height * 100).toFixed(1)}%`);
    };
    const onLeave = () => {
      card.style.setProperty('--comet-tilt-x', '0deg');
      card.style.setProperty('--comet-tilt-y', '0deg');
    };
    card.addEventListener('pointermove', onMove, { passive: true });
    card.addEventListener('pointerleave', onLeave, { passive: true });
  });
}

function initDockNavigation(){
  const dock = document.querySelector('.dock-nav');
  if(!dock) return;
  const items = Array.from(dock.querySelectorAll('[data-dock-item]'));
  const reset = () => items.forEach(item => item.style.setProperty('--dock-scale', '1'));
  const onPointerMove = (event) => {
    const rect = dock.getBoundingClientRect();
    const influence = 88;
    items.forEach(item => {
      const itemRect = item.getBoundingClientRect();
      const center = itemRect.left + itemRect.width / 2;
      const distance = Math.abs(event.clientX - center);
      const proximity = Math.max(0, 1 - distance / influence);
      const scale = 1 + proximity * 0.38;
      item.style.setProperty('--dock-scale', scale.toFixed(3));
    });
  };
  dock.addEventListener('pointermove', onPointerMove, { passive: true });
  dock.addEventListener('pointerleave', reset, { passive: true });
  reset();
}
// ---------- screens ----------
function useTypewriter(text, speed, startDelay, onTick){
  // returns a controller; onTick(displayed, done) is called on every change
  let i = 0, timer = null, delayTimer = null;
  function start(){
    delayTimer = setTimeout(() => {
      timer = setInterval(() => {
        i++;
        const displayed = text.slice(0, i);
        const done = i >= text.length;
        onTick(displayed, done);
        if(done) clearInterval(timer);
      }, speed);
    }, startDelay);
  }
  function stop(){ clearTimeout(delayTimer); clearInterval(timer); }
  return { start, stop };
}

// ---------- TOONHUB-style persona carousel hero ----------
const TH_ITEMS = [
  { key:'challenger', name:'Witty One', tagline:'Fun, sharp and expressive.', image: IMG.challenger, bg:'#E0146E', panel:'#ED4F93' },
  { key:'expert', name:'Thinker', tagline:'Curious, smart and insightful.', image: IMG.expert, bg:'#E0146E', panel:'#ED4F93' },
  { key:'hype', name:'Connector', tagline:'Empathetic, real and trustworthy.', image: IMG.hype, bg:'#E0146E', panel:'#ED4F93' },
];
const VOICE_ITEMS = [
  { name:'Maya Chen', role:'Clear · Curious · Informed', tenure:'Approachable', image:'/manus-storage/01-expert-maya-chen_69f4b707.png', description:'Maya makes complicated things feel simple without making them feel small. She brings context, clarity and practical thinking to conversations, helping people understand what matters and what to do next.' },
  { name:'Sipho Dlamini', role:'Experienced · Composed · Pragmatic', tenure:'Credible', image:'/manus-storage/02-expert-sipho-dlamini_45262a95.png', description:'Sipho has the calm of someone who has seen a few cycles before. He separates signal from noise, adds perspective and gives people the information they need to make a more considered decision.' },
  { name:'Anika Patel', role:'Thoughtful · Patient · Precise', tenure:'Reassuring', image:'/manus-storage/03-expert-anika-patel_b37ce3c1.png', description:'Anika believes good advice should leave people more capable than it found them. She explains the detail, asks the useful question and brings a steady human perspective to complex conversations.' },
  { name:'Daniel Brooks', role:'Seasoned · Direct · Analytical', tenure:'Grounded', image:'/manus-storage/04-expert-daniel-brooks_0a444413.png', description:'Daniel brings experience without needing to announce it. He notices patterns, remembers what came before and turns complicated developments into clear observations people can actually use.' },
  { name:'Zanele Mokoena', role:'Sharp · Confident · Curious', tenure:'Contemporary', image:'/manus-storage/05-challenger-zanele-mokoena_88060648.png', description:'Zanele rarely accepts the first answer simply because everyone else has. She asks the question others skipped, tests the logic and brings a fresh perspective without turning every conversation into an argument.' },
  { name:'Arjun Mehta', role:'Analytical · Independent · Witty', tenure:'Questioning', image:'/manus-storage/06-challenger-arjun-mehta_387c7e3c.png', description:'Arjun enjoys finding the assumption hiding underneath the obvious answer. He challenges ideas with logic, asks for evidence and pushes conversations toward stronger conclusions rather than louder opinions.' },
  { name:'Claire Bennett', role:'Direct · Perceptive · Balanced', tenure:'Confident', image:'/manus-storage/07-challenger-claire-bennett_a1b10555.png', description:'Claire knows that agreement is not always the same as understanding. She introduces the uncomfortable question at the right moment and helps people examine an issue from another side.' },
  { name:'Kenji Sato', role:'Reserved · Intelligent · Sceptical', tenure:'Deliberate', image:'/manus-storage/08-challenger-kenji-sato_1dd43bf6.png', description:'Kenji is quietly difficult to convince, and that is the point. He looks for what has been overlooked, tests whether an argument holds up and challenges people without needing to dominate them.' },
  { name:'Priya Nair', role:'Warm · Upbeat · Expressive', tenure:'Social', image:'/manus-storage/09-hype-person-priya-nair_285669b4.png', description:'Priya brings the energy people usually find after the meeting gets interesting. She spots what is worth celebrating, makes useful ideas feel exciting and pulls other people naturally into the conversation.' },
  { name:'Marcus Reed', role:'Charismatic · Positive · Conversational', tenure:'Assured', image:'/manus-storage/10-hype-person-marcus-reed_cc475ab6.png', description:'Marcus knows how to turn good news into something people actually want to talk about. He brings optimism without exaggeration and gives momentum to ideas, achievements and moments worth noticing.' },
  { name:'Sophie Walker', role:'Playful · Energetic · Informal', tenure:'Expressive', image:'/manus-storage/11-hype-person-sophie-walker_274ebcea.png', description:'Sophie reacts the way the internet moves: quickly, visually and with personality. She picks up the interesting part of a story and gives people an easy reason to join the conversation.' },
  { name:'Hiro Tanaka', role:'Warm · Optimistic · Generous', tenure:'Personable', image:'/manus-storage/12-hype-person-hiro-tanaka_4468820c.png', description:'Hiro proves enthusiasm does not have an age limit. He celebrates progress, encourages people generously and brings the kind of positive perspective that makes a conversation feel lighter without losing substance.' },
];
const TH_GRAIN_SVG = `<svg xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.08 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`;
const TH_GRAIN_URI = 'data:image/svg+xml,' + encodeURIComponent(TH_GRAIN_SVG);

// mirrors motion-primitives <TextEffect per="char" preset="fade">: each character
// is its own span, fading + rising in with a small stagger.
function thPerCharFade(text, opts){
  opts = opts || {};
  const stagger = opts.stagger != null ? opts.stagger : 0.035;
  const baseDelay = opts.baseDelay != null ? opts.baseDelay : 0.1;
  return text.split('').map((ch, i) => {
    const delay = (baseDelay + i * stagger).toFixed(3);
    const display = ch === ' ' ? '&nbsp;' : escapeHtml(ch);
    return `<span class="th-char" style="animation-delay:${delay}s">${display}</span>`;
  }).join('');
}

// mirrors motion-primitives <TextEffect per="word" preset="blur">: each word
// fades in from a blurred, slightly-raised state, one after another.
function thPerWordBlur(words, opts){
  opts = opts || {};
  const stagger = opts.stagger != null ? opts.stagger : 0.09;
  const baseDelay = opts.baseDelay != null ? opts.baseDelay : 0.15;
  return words.map((w, i) => {
    const delay = (baseDelay + i * stagger).toFixed(3);
    const cls = 'th-word' + (w.em ? ' th-word-em' : '');
    return `<span class="${cls}" style="animation-delay:${delay}s">${escapeHtml(w.text)}</span>`;
  }).join(' ');
}

// mirrors motion-primitives <TextShimmerWave>: a band of brightness sweeps
// left-to-right through the text, looping, via per-char staggered animation.
function thShimmerWave(text, opts){
  opts = opts || {};
  const duration = opts.duration != null ? opts.duration : 1.6;
  const stagger = opts.stagger != null ? opts.stagger : 0.045;
  return text.split('').map((ch, i) => {
    const delay = (i * stagger).toFixed(3);
    const display = ch === ' ' ? '&nbsp;' : escapeHtml(ch);
    return `<span class="th-shimmer-char" style="animation-delay:${delay}s;animation-duration:${duration}s">${display}</span>`;
  }).join('');
}

/* ---------- magicui <DiaTextReveal> - per-word masked reveal with blur ---------- */
// Splits a heading into word-units (text words + any existing accent spans),
// wraps each in an overflow-hidden mask with an inner span that slides up +
// de-blurs, staggered. Triggered when the heading scrolls into view.
function initDiaReveal(){
  const headings = document.querySelectorAll('.th-dia');
  if(!headings.length || !('IntersectionObserver' in window)) return;

  headings.forEach(h => {
    if(h.dataset.diaReady) return;
    h.dataset.diaReady = '1';
    const units = [];
    h.childNodes.forEach(node => {
      if(node.nodeType === 3){ // text node
        const words = node.nodeValue.split(/(\s+)/);
        words.forEach(w => { if(w.trim()) units.push(document.createTextNode(w)); });
      } else if(node.nodeType === 1){ // element (accent span) - keep as one unit
        units.push(node);
      }
    });

    h.innerHTML = '';
    units.forEach((unit, i) => {
      const wrap = document.createElement('span');
      wrap.className = 'th-dia-word';
      wrap.style.transitionDelay = (i * 0.08).toFixed(3) + 's';
      const inner = document.createElement('span');
      inner.className = 'th-dia-inner';
      inner.appendChild(unit);
      wrap.appendChild(inner);
      h.appendChild(wrap);
      h.appendChild(document.createTextNode(' '));
    });
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add('is-revealed');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  headings.forEach(h => io.observe(h));
}

// simple monochrome platform glyphs for the "where personas reply" logo strip
const SMAIT_PLATFORM_ICONS = {
  x: '<svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-7.6 8.7L23.3 22H16.9l-5-6.5L6 22H2.9l8.1-9.3L1.9 2h6.6l4.5 6 5.9-6zm-1.2 18h1.7L7.4 3.9H5.6L17.7 20z"/></svg>',
  facebook: '<svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z"/></svg>',
  instagram: '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="5"/><circle cx="12" cy="12" r="4.3"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/></svg>',
  tiktok: '<svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 2h-3.2v13.8a2.9 2.9 0 1 1-2.9-2.9c.2 0 .5 0 .7.1V9.7a6.1 6.1 0 1 0 5.4 6V8.6a7.7 7.7 0 0 0 4.4 1.4V6.8a4.5 4.5 0 0 1-4.4-4.4z"/></svg>',
  youtube: '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="M10.5 9.3v5.4l4.7-2.7z" fill="currentColor" stroke="none"/></svg>',
  linkedin: '<svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="7.2" cy="8.2" r="1.3"/><rect x="6.2" y="10.6" width="2" height="7.2"/><path d="M10.8 10.6h1.9v1c.5-.8 1.4-1.2 2.4-1.2 2 0 2.9 1.3 2.9 3.5v4h-2v-3.6c0-1-.4-1.7-1.3-1.7-1 0-1.5.7-1.5 1.7v3.6h-2z"/></svg>',
  whatsapp: '<svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm5.8 14.2c-.3.7-1.4 1.3-2 1.4-.5.1-1.1.2-3.5-.8-2.9-1.2-4.8-4.2-5-4.4-.1-.2-1.2-1.6-1.2-3 0-1.4.8-2.1 1-2.4.3-.3.6-.3.8-.3h.6c.2 0 .5 0 .7.6l1 2.3c.1.2.1.4 0 .6l-.5.7c-.1.2-.2.4 0 .6.3.6 1 1.4 1.9 2.1 1 .8 1.6 1.1 1.9 1.2.2.1.4.1.6-.1l.8-.9c.2-.2.4-.2.6-.1l2 .9c.2.1.4.2.5.3.1.2.1.9-.2 1.6z"/></svg>',
  sms: '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-8.4 8.4H4.6l2-3.6a8.4 8.4 0 1 1 14.4-4.8z"/><line x1="7.5" y1="11.5" x2="7.5" y2="11.5"/><line x1="12" y1="11.5" x2="12" y2="11.5"/><line x1="16.5" y1="11.5" x2="16.5" y2="11.5"/></svg>',
};

const SMAIT_PLATFORMS = [
  { key:'x', label:'X' },
  { key:'facebook', label:'Facebook' },
  { key:'instagram', label:'Instagram' },
  { key:'tiktok', label:'TikTok' },
  { key:'youtube', label:'YouTube' },
  { key:'linkedin', label:'LinkedIn' },
  { key:'whatsapp', label:'WhatsApp' },
  { key:'sms', label:'SMS' },
];

function smaitLogoSlider(){
  const items = SMAIT_PLATFORMS.map(p => `
    <div class="smait-logo-item" title="${escapeHtml(p.label)}">
      ${SMAIT_PLATFORM_ICONS[p.key]}
      <span>${escapeHtml(p.label)}</span>
    </div>`).join('');
  return `
  <section class="smait-logos" id="smait-logos-section">
    <p class="smait-logos-label">Where your personas show up</p>
    <div class="smait-logos-viewport">
      <div class="smait-logos-fade smait-logos-fade-left" aria-hidden="true"></div>
      <div class="smait-logos-track">
        ${items}
        ${items}
      </div>
      <div class="smait-logos-fade smait-logos-fade-right" aria-hidden="true"></div>
    </div>
  </section>`;
}

function thFingerprintIcon(){
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4"/><path d="M5 19.5C7.5 22 10.5 21.5 12 20"/><path d="M4 15.5C2 12 3 8 5 6"/><path d="M8 20C4.5 15 5 8 8 6c3-2 6.5-1 8 1"/><path d="M12 20c-2-3-2.5-6-2.5-8 0-2.5 1.5-4 4-4S17 9.5 17 12"/><path d="M20 14c0 2-1 3.5-2 4.5"/><path d="M17.5 17.5c1.5-1.5 2.5-3.5 2.5-6a8 8 0 0 0-1-4"/></svg>`;
}

function publicNav(active){
  const links = [
    ['features','Features'], ['personas','Personas'], ['contact','Contact'],
  ];
  const wordmark = active === 'home' ? '' : '<a href="#/" class="public-wordmark">SMAIT<span>.</span></a>';
  return `<header class="public-nav${active==='home'?' public-nav--overlay':''}" data-public-nav="${active==='home'?'landing':'interior'}">
    ${wordmark}
    <nav data-public-nav-panel aria-label="Primary navigation">${links.map(([key,label]) => `<a href="#/${key}" class="${active===key?'active':''}">${label}</a>`).join('')}</nav>
    <button class="public-nav-menu" data-public-nav-toggle type="button" aria-label="Open navigation" aria-expanded="false">${icon('menu',20)}</button>
  </header>`;
}
function publicFooter(){
  return `<footer class="smait-footer">
    <div class="smait-footer-grid">
      <div class="smait-footer-col">
        <div class="smait-footer-logo">SMAIT</div>
        <p>Personas that reply exactly like you would, at scale.</p>
      </div>
      <div class="smait-footer-col">
        <h4>Navigation</h4>
        <ul>
          <li><a href="#/features" data-cursor="Visit">Features</a></li>
          <li><a href="#/personas" data-cursor="Visit">Personas</a></li>
          <li><a href="#/" data-cursor="Visit">Testimonials</a></li>
          <li><a href="#/contact" data-cursor="Visit">Contact</a></li>
        </ul>
      </div>
      <div class="smait-footer-col">
        <h4>Pages</h4>
        <ul>
          <li><a href="#/" data-cursor="Visit">Home</a></li>
          <li><a href="#/contact" data-cursor="Visit">Contact</a></li>
          <li><a href="#/404" data-cursor="Visit">404</a></li>
        </ul>
      </div>
      <div class="smait-footer-col smait-footer-news">
        <h4>Newsletter</h4>
        <p>Join our newsletter and get notified.</p>
        <form class="smait-footer-form" id="smait-newsletter-form">
          <input type="email" placeholder="Enter your email..." required data-cursor="Join" />
          <button type="submit" data-cursor="Join">Subscribe</button>
        </form>
      </div>
    </div>
    <div class="smait-footer-bottom">
      <span>All rights reserved. &copy; 2026 SMAIT</span>
      <span class="smait-footer-pink-line">
        Personas, powered by pink.
        <button type="button" class="th-theme-toggle" id="th-theme-toggle" aria-label="Toggle dark mode" data-cursor="View">
          <span class="th-theme-knob">
            <span class="th-theme-icon th-theme-icon-sun">${icon('sun',15)}</span>
            <span class="th-theme-icon th-theme-icon-moon">${icon('moon',15)}</span>
          </span>
        </button>
      </span>
    </div>
  </footer>`;
}
function publicMobileShell(active){
  const items = [
    ['home','Home','/','dash'],
    ['features','Features','/features','sparkles'],
    ['personas','Personas','/personas','users'],
    ['contact','Contact','/contact','mail'],
    ['waitlist','Join','/waitlist','plus'],
  ];
  return `<div class="public-mobile-shell" aria-label="Mobile app navigation">
    <div class="public-mobile-shell-brand"><a href="#/" aria-label="SMAIT home">SMAIT<span>.</span></a><span>Make every reply intentional.</span></div>
    <nav class="public-mobile-dock" aria-label="Mobile primary navigation">
      ${items.map(([key,label,path,glyph]) => `<a href="#${path}" class="${active===key?'is-active':''}${key==='waitlist'?' public-mobile-dock-join':''}" aria-current="${active===key?'page':'false'}" data-cursor="${label}"><span class="public-mobile-dock-icon">${icon(glyph,18)}</span><span>${label}</span></a>`).join('')}
    </nav>
  </div>`;
}
function publicPage(active, content){
  return `<div class="public-page">${publicNav(active)}${publicMobileShell(active)}<main>${content}</main>${publicFooter()}<div class="th-cursor" id="th-cursor"><span class="th-cursor-label" id="th-cursor-label"></span></div></div>`;
}
function screenFeatures(){
  return publicPage('features', `<section class="public-hero public-hero--split"><div><p class="public-kicker">Built for the reply</p><h1>Make every response feel <em>intentional.</em></h1><p class="public-lead">SMAIT gives your team a set of distinct voices that stay close to your brand, your goals, and the moment.</p><a class="public-button" href="#/waitlist">Meet the system ${icon('arrow',16)}</a></div><div class="public-hero-art public-hero-art--pink"><img src="${IMG.expert}" alt="SMAIT persona" /></div></section><section class="public-section"><div class="public-section-intro"><p class="public-kicker">One clear workflow</p><h2>Less switching. More signal.</h2></div><div class="public-feature-accordion"><article class="public-feature-accordion-item comet-card is-open"><button type="button" aria-expanded="true"><span class="public-feature-accordion-heading"><span class="public-feature-number">01</span><span>Distinct voices</span></span><span class="public-feature-accordion-mark" aria-hidden="true">−</span></button><div class="public-feature-accordion-panel"><p>Switch from thoughtful to bold to energetic without losing the thread of your brand.</p></div></article><article class="public-feature-accordion-item comet-card"><button type="button" aria-expanded="false"><span class="public-feature-accordion-heading"><span class="public-feature-number">02</span><span>Human direction</span></span><span class="public-feature-accordion-mark" aria-hidden="true">+</span></button><div class="public-feature-accordion-panel"><p>Give every reply a clear objective before a persona turns it into language.</p></div></article><article class="public-feature-accordion-item comet-card"><button type="button" aria-expanded="false"><span class="public-feature-accordion-heading"><span class="public-feature-number">03</span><span>Review before live</span></span><span class="public-feature-accordion-mark" aria-hidden="true">+</span></button><div class="public-feature-accordion-panel"><p>Keep your approval step. SMAIT supports the decision instead of hiding it.</p></div></article></div></section>`);
}
function screenPersonas(){
  const personaCards = TH_ITEMS.map((p, i) => `<article class="public-persona-card comet-card"><div class="public-persona-art"><img src="${p.image}" alt="${p.name}" /></div><div><p class="public-kicker">0${i+1}</p><h2>${p.name}</h2><p>${p.tagline}</p><a href="#/waitlist">Choose this voice ${icon('arrow',15)}</a></div></article>`).join('');
  const voiceBackdrops = VOICE_ITEMS.map((voice, i) => `<div class="public-voice-backdrop${i===0?' is-active':''}" data-voice-backdrop="${i}" style="background-image:url('${voice.image}')" aria-hidden="true"></div>`).join('');
  const voiceAvatars = VOICE_ITEMS.map((voice, i) => `<button type="button" class="public-voice-avatar${i===0?' is-active':''}" data-voice-index="${i}" aria-label="Show ${voice.name}" aria-selected="${i===0?'true':'false'}"><span class="public-voice-dot" aria-hidden="true"></span><span class="public-voice-avatar-image"><img loading="lazy" src="${voice.image}" alt="${voice.name}" /></span></button>`).join('');
  return publicPage('personas', `<section class="public-hero public-hero--compact"><p class="public-kicker">Personas with a point of view</p><h1 class="smait-text-effect"><span class="smait-text-line">Three ways to sound</span><br class="smait-heading-break" /><em class="smait-text-line smait-text-line--nowrap">like you.</em></h1><p class="public-lead">A persona represents a demographic group. A voice is the individual character within it.</p></section><section class="public-persona-grid">${personaCards}</section><section class="public-voices-stage" id="public-voices-stage"><div class="public-voices-backdrops">${voiceBackdrops}</div><div class="public-voices-scrim" aria-hidden="true"></div><div class="public-voices-stage-content"><div class="public-voices-stage-top"><div><p class="public-voices-eyebrow">Different voices</p><h2 class="smait-text-effect">voices behind<br class="smait-heading-break" /><span class="smait-text-line smait-text-line--nowrap">every <span class="public-voice-highlight">conversation</span>.</span></h2></div><p class="public-voice-description" id="public-voice-description">${VOICE_ITEMS[0].description}</p></div><div class="public-voices-stage-bottom"><div class="public-voice-picker" role="tablist" aria-label="Choose a voice">${voiceAvatars}</div><div class="public-voice-meta-rail"><span class="public-voice-name" id="public-voice-name">${VOICE_ITEMS[0].name}</span><span class="public-voice-role" id="public-voice-role">${VOICE_ITEMS[0].role}</span><span class="public-voice-tenure">${VOICE_ITEMS[0].tenure}</span><a class="public-voice-whatsapp" href="#/contact">WhatsApp</a></div></div></div></section>`);
}
function screenPricing(){
  const tiers = [['Starter','For finding your first signal.','3 personas','Reply previews','Approval queue'],['Team','For teams moving every day.','3 personas + custom voice','Shared reply review','Priority support'],['Studio','For brands scaling the conversation.','Custom persona system','Multi-brand workspaces','Managed rollout']];
  return publicPage('pricing', `<section class="public-hero public-hero--compact"><p class="public-kicker">Simple by design</p><h1 class="smait-text-effect"><span class="smait-text-line">Choose your level of</span><br class="smait-heading-break" /><em class="smait-text-line smait-text-line--nowrap">direction.</em></h1><p class="public-lead">Start with the voices you need now. Add depth as your team finds its rhythm.</p></section><section class="public-pricing-grid">${tiers.map((tier, i) => `<article class="public-price-card comet-card${i===1?' is-featured':''}">${i===1?'<span class="public-price-badge">Most flexible</span>':''}<p class="public-kicker">${tier[0]}</p><h2>${tier[1]}</h2><ul>${tier.slice(2).map(item=>`<li>${icon('check',14)}${item}</li>`).join('')}</ul><a class="public-button${i===1?' public-button--dark':''}" href="#/waitlist">Join the waitlist ${icon('arrow',15)}</a></article>`).join('')}</section>`);
}
function screenContact(){
  return publicPage('contact', `<section class="public-hero public-hero--split public-contact"><div><p class="public-kicker">Start a conversation</p><h1 class="smait-text-effect"><span class="smait-text-line">Let’s make your next reply</span><br class="smait-heading-break" /><em class="smait-text-line smait-text-line--nowrap">sound like you.</em></h1><p class="public-lead">Tell us where your team is headed and we’ll show you how SMAIT can help you get there.</p></div><form class="public-contact-form comet-card" id="public-contact-form"><label>Name<input name="name" required placeholder="Your name" /></label><label>Email<input name="email" type="email" required placeholder="you@company.com" /></label><label>What are you building?<textarea name="message" rows="4" placeholder="A little context helps."></textarea></label><button class="public-button" type="submit">Send note ${icon('arrow',15)}</button><p class="public-form-success" id="public-contact-success" hidden>Thanks — your note is ready for the SMAIT team.</p></form></section>`);
}
function screenWaitlist(){
  return publicPage('waitlist', `<section class="public-hero public-hero--compact public-waitlist-head"><p class="public-kicker">Early access</p><h1>Get closer to the next <em>reply.</em></h1><p class="public-lead">Leave your details and we’ll keep you close to the next release.</p></section><section class="public-waitlist"><form id="public-waitlist-form" class="public-waitlist-form comet-card"><label>Name<input name="name" required placeholder="Your name" /></label><label>Email<input name="email" type="email" required placeholder="you@company.com" /></label><label>Brand or team<input name="brand" placeholder="Who are you building for?" /></label><button class="public-button" type="submit">Join waitlist ${icon('arrow',15)}</button><p class="public-form-success" id="public-waitlist-success" hidden>You’re on the list. We’ll be in touch soon.</p></form><aside class="public-waitlist-note comet-card"><span>“</span><p>The best reply is the one that sounds like it was meant for this exact moment.</p><small>SMAIT principle 01</small></aside></section>`);
}
function screenLanding(){
  return `
  <div id="smait-landing-page">
  <div class="th-hero" id="th-hero" style="background-color:${TH_ITEMS[0].bg}">
    ${publicNav('home')}
    ${publicMobileShell('home')}
    <div class="th-grain" style="background-image:url('${TH_GRAIN_URI}')" aria-hidden="true"></div>
    <div class="th-hero-veil" aria-hidden="true"></div>

    <div class="th-ghost-group">
      <p id="th-persona-desc">${thShimmerWave(TH_ITEMS[0].tagline)}</p>
      <div class="th-ghost" aria-hidden="true"><span id="th-ghost-text">${thPerCharFade(TH_ITEMS[0].name.toUpperCase())}</span></div>
    </div>

    <div class="th-headline">
      <h1>${thPerWordBlur([{text:'every'},{text:'persona'}])}<br>${thPerWordBlur([{text:'is'},{text:'unique',em:true}], {baseDelay:0.33})}</h1>
      <p>Different voices.<br><strong>One purpose.</strong></p>
    </div>

    <div class="th-carousel" id="th-carousel">
      ${TH_ITEMS.map((it,i) => `
        <div class="th-item" data-idx="${i}" data-cursor="Reply">
          <img class="th-item-base" src="${it.image}" alt="${it.name}" draggable="false" />
          <img class="th-item-reveal" src="${it.image}" alt="${it.name} persona preview" draggable="false" />
        </div>`).join('')}
    </div>

    <div class="th-action-bar">
      <div class="th-bottom-left">
        <p>Meet personas</p>
        <div class="th-arrows">
          <button id="th-prev" aria-label="Previous persona" data-cursor="Back">${icon('back',24)}</button>
          <button id="th-next" aria-label="Next persona" data-cursor="Next">${icon('arrow',24)}</button>
        </div>
      </div>

    </div>

    <div class="th-cursor" id="th-cursor"><span class="th-cursor-label" id="th-cursor-label"></span></div>

    <div class="th-dialog-overlay" id="th-dialog-overlay">
      <div class="th-dialog th-dialog--wide" role="dialog" aria-modal="true" aria-labelledby="th-dialog-title">
        <div class="th-dialog-head">
          <h2 id="th-dialog-title">Join the waitlist</h2>
          <button type="button" class="th-dialog-close" id="th-dialog-close" aria-label="Close"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        <div class="th-dialog-split">
          <form class="th-dialog-form" id="th-dialog-form">
            <div class="th-dialog-field">
              <label for="th-dialog-name">Your name</label>
              <input id="th-dialog-name" type="text" placeholder="Your name" autocomplete="name" required />
            </div>
            <div class="th-dialog-field">
              <label for="th-dialog-email">Email</label>
              <input id="th-dialog-email" type="email" inputmode="email" placeholder="Email address" autocomplete="email" required />
            </div>
            <div class="th-dialog-field">
              <label for="th-dialog-brand">Brand name</label>
              <input id="th-dialog-brand" type="text" placeholder="Brand name" autocomplete="organization" required />
            </div>
            <div class="th-dialog-field">
              <label for="th-dialog-about">A bit about your brand</label>
              <textarea id="th-dialog-about" rows="3" placeholder="What do you sell, and who do you sell it to?"></textarea>
            </div>
            <label class="th-dialog-meet-toggle" for="th-dialog-meet">
              <input id="th-dialog-meet" type="checkbox" />
              <span class="th-dialog-meet-box">${icon('check',12)}</span>
              <span class="th-dialog-meet-copy">
                <strong>Book a quick intro call</strong>
                <em>We'll walk you through SMAIT before you go live.</em>
              </span>
            </label>
            <div class="th-dialog-field th-dialog-meet-time" id="th-dialog-meet-time-wrap" hidden>
              <label>Pick a date &amp; time</label>
              <button type="button" class="th-schedule-trigger" id="th-schedule-trigger" aria-haspopup="true" aria-expanded="false">
                <span id="th-schedule-trigger-label">Select a date</span>
                <span class="th-dialog-select-chevron">${icon('chevron',14)}</span>
              </button>
              <div class="th-schedule-pop" id="th-schedule-pop" hidden>
                <div class="th-schedule-presets" id="th-schedule-presets">
                  ${[['today','Today'],['tomorrow','Tomorrow'],['week','This week'],['nextweek','Next week'],['custom','Custom']].map(([id,label]) => `<button type="button" class="th-schedule-preset" data-preset="${id}">${label}</button>`).join('')}
                </div>
                <div class="th-schedule-cal">
                  <div class="th-schedule-cal-head">
                    <button type="button" class="th-schedule-nav" id="th-schedule-prev" aria-label="Previous month">${icon('back',14)}</button>
                    <span id="th-schedule-month-label"></span>
                    <button type="button" class="th-schedule-nav" id="th-schedule-next" aria-label="Next month">${icon('arrow',14)}</button>
                  </div>
                  <div class="th-schedule-cal-days">${['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => `<span>${d}</span>`).join('')}</div>
                  <div class="th-schedule-cal-grid" id="th-schedule-cal-grid"></div>
                  <div class="th-schedule-times" id="th-schedule-times">
                    ${['9:00am','10:00am','11:00am','1:00pm','2:00pm','3:00pm','4:00pm'].map(t => `<button type="button" class="th-schedule-time" data-time="${t}">${t}</button>`).join('')}
                  </div>
                </div>
                <div class="th-schedule-footer">
                  <button type="button" class="th-dialog-cancel" id="th-schedule-cancel">Cancel</button>
                  <button type="button" class="th-dialog-submit" id="th-schedule-apply">Apply</button>
                </div>
              </div>
            </div>
          </form>
          <div class="th-dialog-divider" aria-hidden="true"></div>
          <div class="th-dialog-preview">
            <span class="th-dialog-preview-label">Pick your favourite persona</span>
            <div class="th-dialog-avatar-wrap">
              <img class="th-dialog-avatar" id="th-dialog-avatar" src="${TH_ITEMS[0].image}" alt="${TH_ITEMS[0].name} persona portrait" />
            </div>
            <p class="th-dialog-avatar-name" id="th-dialog-avatar-name">${TH_ITEMS[0].name}</p>
            <p class="th-dialog-avatar-tagline" id="th-dialog-avatar-tagline">${TH_ITEMS[0].tagline}</p>
            <div class="th-dialog-persona-row" id="th-dialog-persona-row">
              ${TH_ITEMS.map((p, i) => `<button type="button" class="th-dialog-persona-pick${i===0?' active':''}" data-persona="${p.key}" aria-label="${p.name}"><img src="${p.image}" alt="${p.name} persona portrait" /></button>`).join('')}
            </div>
          </div>
        </div>
        <div class="th-dialog-footer">
          <button type="button" class="th-dialog-cancel" id="th-dialog-cancel">Cancel</button>
          <button type="submit" form="th-dialog-form" class="th-dialog-submit">Join Waitlist ${icon('arrow',16)}</button>
        </div>
      </div>
    </div>
  </div>

  ${smaitLogoSlider()}

  ${smaitTestimonials()}

  ${smaitFalconSection()}

  ${smaitBentoMetrics()}

  ${smaitCtaFaqFooter()}
  </div>`;
}

const SMAIT_FAQS = [
  { q: 'What is SMAIT?', a: 'SMAIT is intelligence for communications. It listens to conversations, understands what is changing, and helps organisations respond with the right voice at the right moment.' },
  { q: 'What is a persona?', a: 'A persona is the role being played in a conversation. An Expert adds clarity. A Challenger introduces another perspective. A Hype Person brings energy and momentum.' },
  { q: 'What is a voice?', a: 'A voice is the individual behind the persona. Each has their own age, background, personality, vocabulary and way of expressing an idea.' },
  { q: 'Why have multiple voices?', a: 'Because people do not all speak the same way. Different voices allow the same idea to enter different conversations naturally, without sounding copied or repetitive.' },
  { q: 'Can two voices from the same persona respond differently?', a: 'Yes. They share the same strategic role, but not the same personality. An Expert might be curious and conversational, while another is more experienced and measured.' },
  { q: 'Do voices replace social media managers?', a: 'No. They extend what people can do. Humans set the direction, objectives and boundaries. SMAIT helps carry that work across more relevant conversations.' },
  { q: 'Does every response need human approval?', a: 'That depends on how the organisation configures SMAIT. Responses can begin with human review and gradually operate with greater autonomy as the system learns the organisation\'s standards and boundaries.' },
  { q: 'Does SMAIT learn over time?', a: 'Yes. Voices become more familiar with context, tone, preferences and previous decisions. The aim is not simply to respond more often, but to become more useful over time.' },
  { q: 'How many conversations can a voice respond to?', a: 'There is no arbitrary daily conversation limit. If conversations remain relevant to the objective and fall within the configured rules, SMAIT can continue responding.' },
  { q: 'How does SMAIT decide what is relevant?', a: 'It looks at signals including context, topic, keywords, sentiment, intent and the objective of the campaign before deciding whether a conversation deserves a response.' },
  { q: 'Will every person receive the same message?', a: 'No. The underlying idea can remain consistent while the language, perspective and delivery change according to the conversation and the voice responding.' },
  { q: 'Can we test a message before publishing it?', a: 'Yes. SMAIT can show how different personas and voices may interpret or respond to a message before it is released, helping teams see potential reactions earlier.' },
  { q: 'Can SMAIT help with misinformation?', a: 'Yes. SMAIT can detect relevant conversations, surface questionable claims and help verified information enter those conversations through appropriate voices.' },
  { q: 'Is SMAIT only for social media?', a: 'No. The model is built around conversations and communication workflows, not a single platform. It can support different channels as they are connected to the system.' },
  { q: 'What industries can use SMAIT?', a: 'Any industry where public conversation, reputation, customer understanding or communication matters. That includes technology, finance, telecommunications, retail, healthcare, government, education, manufacturing, travel and hospitality, and consumer brands.' },
  { q: 'Can we choose which voices are used?', a: 'Yes. Teams can select a persona, choose individual voices, or create a combination suited to the objective and audience.' },
  { q: 'Can a brand create its own voices?', a: 'Yes. Voices can be shaped around the organisation\'s audience, language, tone and communication requirements while remaining distinct enough to feel human.' },
  { q: 'What happens before a response goes live?', a: 'SMAIT identifies the conversation, considers the objective, selects an appropriate persona and voice, prepares the response, applies the configured review rules and then publishes when approved or authorised.' },
  { q: 'How do we know whether the voices are working?', a: 'SMAIT tracks what happens after they participate, including replies, engagement, reach, profile activity and other campaign outcomes.' },
  { q: 'What makes SMAIT different?', a: 'Most communication tools help teams publish. SMAIT helps them participate. It senses what people are saying, makes sense of it, acts through distinct voices, influences the conversation and tracks what changes. Sense. Make. Act. Influence. Track.' },
];

/* ---------- bento grid: platform health/metrics, below "Personas at Work" ---------- */
function smaitBentoMetrics(){
  const bars = [40, 70, 45, 90, 65, 85, 35, 60, 50, 80, 55, 75];
  const services = [
    { name: 'Reply Engine', pct: 99.99 },
    { name: 'Sentiment Model', pct: 99.97 },
    { name: 'Voice Match', pct: 99.98 },
  ];
  const totalBars = 32;
  const filledBars = 23;
  return `
  <section class="smait-bento-wrap">
    <div class="smait-bento-intro">
      <h2 class="th-dia smait-text-effect">Built for <span class="smait-bento-accent">scale</span>, not just replies</h2>
      <p>The infrastructure behind every SMAIT persona, always watching, always on.</p>
    </div>
    <div class="smait-bento-grid">
      <div class="smait-bento-card smait-bento-card--wide">
        <div class="smait-bento-visual">
          <div class="smait-bento-chart-head">
            <div>
              <span class="smait-bento-eyebrow">Live Reply Volume</span>
              <span class="smait-bento-stat">12,450 <em>replies/hr</em></span>
            </div>
          </div>
          <div class="smait-bento-bars">
            ${bars.map((h,i) => `<span class="smait-bento-bar" style="--h:${h}%; --d:${(i*0.05).toFixed(2)}s"></span>`).join('')}
          </div>
        </div>
        <div class="smait-bento-copy">
          <h3>Real-time Metrics</h3>
          <p>Watch every persona's reply volume, sentiment and reach update live. No refresh needed.</p>
        </div>
      </div>

      <div class="smait-bento-card">
        <div class="smait-bento-copy">
          <h3>99.99% Uptime</h3>
          <p>Enterprise-grade reliability, whatever the traffic spike.</p>
        </div>
        <div class="smait-bento-visual">
          <div class="smait-bento-net-head">
            <span class="smait-bento-eyebrow">Persona Network</span>
            <span class="smait-bento-live"><i></i>100% Healthy</span>
          </div>
          <div class="smait-bento-services">
            ${services.map(s => `
              <div class="smait-bento-service">
                <div class="smait-bento-service-top">
                  <span>${escapeHtml(s.name)}</span>
                  <span class="smait-bento-service-pct">${s.pct}%</span>
                </div>
                <div class="smait-bento-service-track"><span class="smait-bento-service-fill" style="--w:${s.pct}%"></span></div>
              </div>`).join('')}
          </div>
        </div>
      </div>

      <div class="smait-bento-card">
        <div class="smait-bento-visual smait-bento-visual--center">
          <div class="smait-bento-bell">
            ${icon('bell',20)}
            <span class="smait-bento-ping"></span>
          </div>
          <div class="smait-bento-toast">
            <span class="smait-bento-toast-dot"></span>
            <div>
              <strong>Sentiment Dip Detected</strong>
              <em>Escalated to your team</em>
            </div>
          </div>
        </div>
        <div class="smait-bento-copy">
          <h3>Smart Alerts</h3>
          <p>Get notified before a bad conversation becomes a bad review.</p>
        </div>
      </div>

      <div class="smait-bento-card smait-bento-card--wide smait-bento-card--engage">
        <div class="smait-engage-head">
          <div>
            <h3>Weekly Engagement</h3>
            <p>Community interaction is growing steadily</p>
          </div>
          <button type="button" class="smait-engage-more" aria-label="More options">${icon('more', 18)}</button>
        </div>
        <div class="smait-engage-figure">
          <div class="smait-engage-pct">72%</div>
          <div class="smait-engage-trend">
            <span class="smait-engage-trend-pill">${icon('trendUp', 14)}<span>+12%</span></span>
            <span class="smait-engage-trend-label">vs last week</span>
          </div>
        </div>
        <div class="smait-engage-bars">
          ${Array.from({ length: totalBars }).map((_, i) => `<span class="smait-engage-bar${i < filledBars ? ' is-filled' : ''}" style="--d:${(i * 0.02).toFixed(2)}s"></span>`).join('')}
        </div>
      </div>
    </div>
  </section>`;
}

function smaitCtaFaqFooter(){

  return `
  <section class="smait-cta-wrap">
    <div class="smait-cta-inner">
      <main class="smait-cta-grid">
        <div class="smait-cta-card">
          <img class="smait-cta-persona" src="${IMG.hype}" alt="Hype Person persona illustration" />
          <h2>Ready to Meet<br>Your Personas?</h2>
          <p>Let three distinct voices handle replies at scale</p>
          <button type="button" class="smait-cta-btn" id="smait-cta-btn" data-cursor="Waitlist">Join Waitlist</button>
        </div>

        <div class="smait-faq comet-card" id="smait-faq">
          <div class="smait-faq-viewport" id="smait-faq-viewport">
            <div class="smait-faq-slide" id="smait-faq-slide"></div>
          </div>
          <div class="smait-faq-nav">
            <button type="button" class="smait-faq-btn" id="smait-faq-prev" data-cursor="View">Previous</button>
            <button type="button" class="smait-faq-btn" id="smait-faq-next" data-cursor="View">Next</button>
          </div>
        </div>
      </main>




      <footer class="smait-footer">
        <div class="smait-footer-grid">
          <div class="smait-footer-col">
            <div class="smait-footer-logo">SMAIT</div>
            <p>Personas that reply exactly like you would, at scale.</p>
          </div>
          <div class="smait-footer-col">
            <h4>Navigation</h4>
            <ul>
              <li><a href="#/" data-cursor="Visit">Features</a></li>
              <li><a href="#/" data-cursor="Visit">Personas</a></li>
              <li><a href="#smait-testi" data-cursor="Visit">Testimonials</a></li>
              <li><a href="#/contact" data-cursor="Visit">Contact</a></li>
            </ul>
          </div>
          <div class="smait-footer-col">
            <h4>Pages</h4>
            <ul>
              <li><a href="#/" data-cursor="Visit">Home</a></li>
              <li><a href="#/" data-cursor="Visit">Contact</a></li>
              <li><a href="#/" data-cursor="Visit">404</a></li>
            </ul>
          </div>
          <div class="smait-footer-col smait-footer-news">
            <h4>Newsletter</h4>
            <p>Join our newsletter and get notified.</p>
            <form class="smait-footer-form" id="smait-newsletter-form">
              <input type="email" placeholder="Enter your email..." required data-cursor="Join" />
              <button type="submit" data-cursor="Join">Subscribe</button>
            </form>
          </div>
        </div>
        <div class="smait-footer-bottom">
          <span>All rights reserved. &copy; 2026 SMAIT</span>
          <span class="smait-footer-pink-line">
            Personas, powered by pink.
            <button type="button" class="th-theme-toggle" id="th-theme-toggle" aria-label="Toggle dark mode" data-cursor="View">
              <span class="th-theme-knob">
                <span class="th-theme-icon th-theme-icon-sun">${icon('sun',15)}</span>
                <span class="th-theme-icon th-theme-icon-moon">${icon('moon',15)}</span>
              </span>
            </button>
          </span>
        </div>
      </footer>
    </div>
  </section>`;
}

/* ---------- Falcon-style operations triptych (scoped, appears on scroll) ---------- */
function smaitFalconSection(){
  return `
  <section class="falcon-wrap">
    <img id="falcon-witty-bg" class="falcon-witty-bg" src="${TH_ITEMS[0].image}" alt="Witty One persona illustration" />
    <div class="falcon-intro">
      <h2 class="th-dia smait-text-effect">Personas at <span class="falcon-intro-accent">Work</span></h2>
      <p>A look inside what SMAIT personas report: conversations, sentiment, reach and outcomes.</p>
    </div>
    <section class="falcon-scene" aria-label="SMAIT operations overview">
      <section class="cards" aria-label="Product benefits">

        <article class="card comet-card">
          <div class="panel" aria-label="Visibility timeline chart">
            <div class="timeline"><span>06 AM</span><i></i><span>12 PM</span><i></i><span>06 PM</span></div>
            <div class="bars" aria-hidden="true">
              ${[20,33,48,56,51,47,39,31,53,55,60,56].map(h=>`<i class="bar" style="--h:${h}%"></i>`).join('')}
              <i class="bar active" style="--h:100%"></i>
              ${[92,76,67,62,65,59,70,74,87,83,77].map(h=>`<i class="bar" style="--h:${h}%"></i>`).join('')}
            </div>
            <div class="value-chip">24.7K</div>
            <div class="axis" style="justify-content:flex-end"><span>COMPLETE</span></div>
          </div>
          <div class="card-copy">
            <h3>Instant Visibility</h3>
            <p>Real-time conversations across your<br>coffee campaign.</p>
            <span class="corner-icon"><i class="spark"></i></span>
          </div>
        </article>

        <article class="card comet-card">
          <div class="panel">
            <div class="assistant-head"><span class="badge"><i class="spark"></i></span><span>SMAIT</span></div>
            <p class="question">What are people saying about our coffee?</p>
            <div class="prompt">Positive mentions are rising during morning hours,<br>with taste leading the conversation and service<br>driving most negative replies.</div>
            <div class="automate" data-cursor="Analyse">
              <span class="automate-label">Analyse campaign</span>
              <canvas class="magic" data-sparkle-icon aria-hidden="true"></canvas>
            </div>
            <i class="cursor" aria-hidden="true"></i>
          </div>
          <div class="card-copy">
            <h3>Performance Reporting</h3>
            <p>Track outcomes across all<br>your personas.</p>
            <span class="corner-icon"><i class="flow-icon"></i></span>
          </div>
        </article>

        <article class="card comet-card">
          <div class="panel">
            <div class="metric">
              <div class="metric-label">Positive sentiment</div>
              <div class="metric-row"><strong>72%</strong><span>&uarr; 18% this week</span></div>
            </div>
            <div class="decision-flow">
              <canvas data-flow-chart aria-label="Conversation signals converging into one clear campaign view"></canvas>
            </div>
            <div class="tag action">Action: Amplify</div>
            <div class="tag confidence">Response Confidence: 98%</div>
            <div class="tag path">Positive Shift: +14.2%</div>
          </div>
          <div class="card-copy">
            <h3>Faster Decisions</h3>
            <p>Turn conversation signals into<br>action instantly.</p>
            <span class="corner-icon"><i class="speed"></i></span>
          </div>
        </article>

      </section>
    </section>
  </section>`;
}

const SMAIT_TESTIMONIALS = [
  { name: 'Priya Nandan', role: 'Social Lead, Fernway', quote: 'Our replies used to take hours to sound right. Now the personas nail our tone in seconds, every time.' },
  { name: 'Marcus Ade', role: 'Founder, Loop Studio', quote: 'The Witty One gets more engagement than our old team ever did. Genuinely surprised how well it fits our brand.' },
  { name: 'Sana Iqbal', role: 'Community Manager, Huxley', quote: 'Switching between voices per platform used to be a headache. SMAIT just handles it, consistently.' },
  { name: 'Devon Clarke', role: 'Head of Growth, Basecamp Co.', quote: 'Thinker gives us replies that actually add value instead of generic filler. Our audience notices the difference.' },
  { name: 'Yuki Tanaka', role: 'Social Ops, Ridgeline', quote: 'Connector feels like our best rep wrote every reply herself. That empathy is hard to fake, this doesn’t.' },
  { name: 'Alina Voss', role: 'Marketing Director, Kindred', quote: 'We onboarded in a day and our response time dropped by more than half. It just works.' },
];

function smaitTestimonials(){
  const initials = (name) => name.split(' ').map(n => n[0]).join('');
  const card = (t) => `
    <div class="smait-testi-card" data-cursor="Read">
      <div class="smait-testi-card-top">
        <div class="smait-testi-avatar">${initials(t.name)}</div>
        <div class="smait-testi-who">
          <span class="smait-testi-name">${escapeHtml(t.name)}</span>
          <span class="smait-testi-role">${escapeHtml(t.role)}</span>
        </div>
        ${icon('msg',18)}
      </div>
      <p class="smait-testi-quote">&ldquo;${escapeHtml(t.quote)}&rdquo;</p>
    </div>`;
  const cards = SMAIT_TESTIMONIALS.map(card).join('');
  return `
  <section class="smait-testi" id="smait-testi">
    <img id="smait-testi-persona-bg" class="smait-testi-persona-bg" src="${TH_ITEMS[1].image}" alt="Thinker persona illustration" />
    <div class="smait-testi-inner">
      <div class="smait-testi-copy">
        <h2 class="th-dia smait-text-effect">Trusted by teams who move <span class="smait-testi-accent">fast on social</span></h2>
        <p>Real feedback from teams who let their personas handle the replies.</p>
      </div>
      <div class="smait-testi-viewport" id="smait-testi-viewport">
        <div class="smait-testi-fade smait-testi-fade-top" aria-hidden="true"></div>
        <div class="smait-testi-track" id="smait-testi-track">
          ${cards}
          ${cards}
        </div>
        <div class="smait-testi-fade smait-testi-fade-bottom" aria-hidden="true"></div>
      </div>
    </div>
  </section>`;
}

// text-scramble effect, modeled after the motion-primitives <TextScramble> component:
// characters resolve left-to-right, trickling through a random glyph set before locking in.
const TH_SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*_+-=/[]{}';
function scrambleText(el, newText, opts){
  opts = opts || {};
  const duration = opts.duration || 700;
  const speed = opts.speed || 32; // ms per tick
  const trickle = opts.trickle || 0.28; // fraction of duration spread across the reveal
  if(el._scrambleTimer) clearInterval(el._scrambleTimer);
  const chars = newText.split('');
  const totalTicks = Math.max(1, Math.round(duration / speed));
  const revealSpread = Math.max(1, Math.round(totalTicks * trickle));
  let tick = 0;
  el._scrambleTimer = setInterval(() => {
    tick++;
    let out = '';
    for(let i = 0; i < chars.length; i++){
      const ch = chars[i];
      if(ch === ' '){ out += ' '; continue; }
      const revealAt = (i / chars.length) * (totalTicks - revealSpread);
      if(tick >= revealAt + revealSpread){
        out += ch;
      } else if(tick >= revealAt){
        out += TH_SCRAMBLE_CHARS[Math.floor(Math.random() * TH_SCRAMBLE_CHARS.length)];
      } else {
        out += TH_SCRAMBLE_CHARS[Math.floor(Math.random() * TH_SCRAMBLE_CHARS.length)];
      }
    }
    el.textContent = out;
    if(tick >= totalTicks){
      el.textContent = newText;
      clearInterval(el._scrambleTimer);
      el._scrambleTimer = null;
    }
  }, speed);
}

function bindLanding(){
  const hero = document.getElementById('th-hero');
  const carousel = document.getElementById('th-carousel');
  const items = Array.from(carousel.querySelectorAll('.th-item'));
  const ghostTextEl = document.getElementById('th-ghost-text');
  const personaDescEl = document.getElementById('th-persona-desc');
  const isMobile = () => window.innerWidth < 640;
  let activeIndex = 0;
  let isAnimating = false;

  function applyRoles(){
    const mobile = isMobile();
    const n = TH_ITEMS.length;
    items.forEach((el, i) => {
      let role;
      if(i === activeIndex) role = 'center';
      else if(i === (activeIndex + 1) % n) role = 'right';
      else role = 'left';
      el.dataset.role = role;
      if(role === 'center'){
        el.style.left = '50%';
        el.style.height = mobile ? '58%' : '88%';
        el.style.bottom = mobile ? '20%' : '0%';
        el.style.transform = `translateX(-50%) scale(${mobile ? 1.2 : 1.55})`;
        el.style.filter = 'blur(0px)';
        el.style.opacity = '1';
        el.style.zIndex = '20';
      } else if(role === 'left'){
        el.style.left = mobile ? '14%' : '24%';
        el.style.height = mobile ? '16%' : '30%';
        el.style.bottom = mobile ? '28%' : '10%';
        el.style.transform = 'translateX(-50%) scale(1)';
        el.style.filter = 'blur(2px)';
        el.style.opacity = '0.82';
        el.style.zIndex = '10';
      } else {
        el.style.left = mobile ? '86%' : '76%';
        el.style.height = mobile ? '16%' : '30%';
        el.style.bottom = mobile ? '28%' : '10%';
        el.style.transform = 'translateX(-50%) scale(1)';
        el.style.filter = 'blur(2px)';
        el.style.opacity = '0.82';
        el.style.zIndex = '10';
      }
    });
    hero.style.backgroundColor = TH_ITEMS[activeIndex].bg;

    // mirror the active persona behind the testimonials heading, blurred under
    // a soft whitish overlay, so scrolling down keeps their presence in view.
    // testimonials keep the Thinker persona fixed in the background - it does
    // not follow the active carousel persona.
    // Personas at Work keeps the Witty One in the background regardless of the
    // active carousel persona - intentionally not synced like the testimonials one.

    // the persona's name takes over the giant ghost text, with its tagline
    // sitting directly underneath - each swap re-triggers the per-char/
    // crossfade reveal so it reads as a fresh entrance every time.
    if(ghostTextEl){
      ghostTextEl.innerHTML = thPerCharFade(TH_ITEMS[activeIndex].name.toUpperCase(), { stagger: 0.02, baseDelay: 0 });
    }
    if(personaDescEl){
      personaDescEl.classList.add('th-subtext-out');
      setTimeout(() => {
        personaDescEl.innerHTML = thShimmerWave(TH_ITEMS[activeIndex].tagline);
        personaDescEl.classList.remove('th-subtext-out');
      }, 220);
    }
  }

  function navigate(dir){
    if(isAnimating) return;
    isAnimating = true;
    const n = TH_ITEMS.length;
    activeIndex = dir === 'next' ? (activeIndex + 1) % n : (activeIndex + n - 1) % n;
    applyRoles();
    setTimeout(() => { isAnimating = false; }, 650);
  }

  const prevBtn = document.getElementById('th-prev');
  const nextBtn = document.getElementById('th-next');
  if(prevBtn) prevBtn.addEventListener('click', () => { navigate('prev'); restartAutoplay(); });
  if(nextBtn) nextBtn.addEventListener('click', () => { navigate('next'); restartAutoplay(); });
  window.addEventListener('resize', applyRoles);

  // auto-advance through personas every 3s until the user interacts, then
  // resume from wherever they left off.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let autoplayTimer = null;
  function startAutoplay(){
    if(reduceMotion) return;
    stopAutoplay();
    autoplayTimer = setInterval(() => navigate('next'), 3000);
  }
  function stopAutoplay(){
    if(autoplayTimer){ clearInterval(autoplayTimer); autoplayTimer = null; }
  }
  function restartAutoplay(){ startAutoplay(); }
  document.addEventListener('visibilitychange', () => {
    if(document.hidden) stopAutoplay(); else startAutoplay();
  });
  hero.addEventListener('mouseenter', stopAutoplay);
  hero.addEventListener('mouseleave', startAutoplay);
  startAutoplay();

  applyRoles();
  initTHCursor(hero);
  initTHDialog(hero);
  initTHTheme();
  initTHSpotlight(items);
  initFalconSection();
  initDiaReveal();
  bindSmaitCtaFaqFooter();
}

function bindSmaitCtaFaqFooter(){
  const viewport = document.getElementById('smait-faq-viewport');
  const slide = document.getElementById('smait-faq-slide');
  const prevBtn = document.getElementById('smait-faq-prev');
  const nextBtn = document.getElementById('smait-faq-next');
  const faqCard = document.getElementById('smait-faq');

  /* magicui MagicCard - track mouse for pink gradient border */
  if(faqCard){
    faqCard.addEventListener('mousemove', (e) => {
      const r = faqCard.getBoundingClientRect();
      faqCard.style.setProperty('--smait-magic-x', `${e.clientX - r.left}px`);
      faqCard.style.setProperty('--smait-magic-y', `${e.clientY - r.top}px`);
      faqCard.classList.add('is-magic');
    });
    faqCard.addEventListener('mouseleave', () => faqCard.classList.remove('is-magic'));
  }

  if(viewport && slide && prevBtn && nextBtn){
    let activeIndex = 0;
    const n = SMAIT_FAQS.length;

    function renderSlide(){
      const f = SMAIT_FAQS[activeIndex];
      slide.innerHTML = `
        <div class="smait-faq-body">
          <h3 class="smait-faq-question">${escapeHtml(f.q)}</h3>
          <p class="smait-faq-answer">${escapeHtml(f.a)}</p>
        </div>`;
      viewport.style.height = slide.scrollHeight + 'px';
    }

    function updateNav(){
      prevBtn.classList.toggle('is-hidden', activeIndex === 0);
      nextBtn.textContent = activeIndex === n - 1 ? 'Join Waitlist' : 'Next';
    }

    function goTo(newIndex, dir){
      if(newIndex < 0 || newIndex >= n || newIndex === activeIndex) return;
      slide.classList.add(dir > 0 ? 'is-exiting-left' : 'is-exiting-right');
      setTimeout(() => {
        activeIndex = newIndex;
        renderSlide();
        slide.classList.remove('is-exiting-left', 'is-exiting-right');
        slide.classList.add(dir > 0 ? 'is-entering-right' : 'is-entering-left');
        // force reflow so the entering transform is applied before animating out of it
        void slide.offsetWidth;
        requestAnimationFrame(() => {
          slide.classList.remove('is-entering-right', 'is-entering-left');
        });
        updateNav();
      }, 220);
    }

    prevBtn.addEventListener('click', () => goTo(activeIndex - 1, -1));
    nextBtn.addEventListener('click', () => {
      if(activeIndex === n - 1){
        const discoverBtn = document.getElementById('th-discover-btn');
        if(discoverBtn) discoverBtn.click();
        return;
      }
      goTo(activeIndex + 1, 1);
    });

    renderSlide();
    updateNav();
    window.addEventListener('resize', () => { viewport.style.height = slide.scrollHeight + 'px'; });
  }

  const ctaBtn = document.getElementById('smait-cta-btn');

  if(ctaBtn){
    ctaBtn.addEventListener('click', () => {
      const discoverBtn = document.getElementById('th-discover-btn');
      if(discoverBtn) discoverBtn.click();
    });
  }
  const newsletterForm = document.getElementById('smait-newsletter-form');
  if(newsletterForm){
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      const btn = newsletterForm.querySelector('button');
      if(btn){ btn.textContent = 'Subscribed'; }
      if(input){ input.disabled = true; }
    });
  }
}

/* ---------- Falcon triptych: canvas art + scroll-triggered entrance ---------- */
function falconRoundedPolygon(ctx, points, roundness){
  const n = points.length;
  const lerp = (a,b,t) => [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t];
  const start = lerp(points[n-1], points[0], 1-roundness);
  ctx.moveTo(start[0], start[1]);
  for(let i=0;i<n;i++){
    const cur = points[i];
    const next = points[(i+1)%n];
    const before = lerp(points[(i-1+n)%n], cur, 1-roundness);
    const after = lerp(cur, next, roundness);
    ctx.lineTo(before[0], before[1]);
    ctx.quadraticCurveTo(cur[0], cur[1], after[0], after[1]);
  }
  ctx.closePath();
}
const FALCON_SPARKLE_POINTS = [[.50,.06],[.59,.41],[.94,.50],[.59,.59],[.50,.94],[.41,.59],[.06,.50],[.41,.41]];
const FALCON_SPARKLES = [{x:.01,y:.01,size:.50},{x:.28,y:.26,size:.72}];

function falconDrawSparkle(canvas){
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const w = Math.max(1, rect.width), h = Math.max(1, rect.height);
  canvas.width = Math.round(w*dpr); canvas.height = Math.round(h*dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.clearRect(0,0,w,h);
  FALCON_SPARKLES.forEach(s => {
    const size = Math.min(w,h) * s.size;
    const ox = s.x * w, oy = s.y * h;
    const pts = FALCON_SPARKLE_POINTS.map(p => [ox + p[0]*size, oy + p[1]*size]);
    ctx.beginPath();
    falconRoundedPolygon(ctx, pts, .34);
    ctx.fillStyle = 'rgba(255,214,232,.6)';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = Math.max(1.1, size*.15);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(255,255,255,.78)';
    ctx.shadowBlur = size*.06;
    ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0;
  });
}

const FALCON_BANDS = [
  {source:[.08,.26], target:[.29,.32],  color:'rgba(255,161,203,.60)'},
  {source:[.23,.42], target:[.30,.335], color:'rgba(247,113,169,.70)'},
  {source:[.50,.75], target:[.32,.355], color:'rgba(237,79,147,.82)'},
  {source:[.69,.98], target:[.33,.365], color:'rgba(255,141,196,.54)'},
  {source:[.39,.51], target:[.31,.345], color:'rgba(224,20,110,.96)'},
];
const FALCON_THREADS = [
  {source:.05, target:.30,  alpha:.68},
  {source:.20, target:.315, alpha:.60},
  {source:.62, target:.342, alpha:.84},
  {source:.82, target:.352, alpha:.74},
  {source:.97, target:.36,  alpha:.64},
];
const FALCON_SOURCE_HOLD = .38, FALCON_TARGET_APPROACH = .74, FALCON_THREAD_W = .00135;

function falconDrawFlow(canvas){
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const w = Math.max(1, rect.width), h = Math.max(1, rect.height);
  canvas.width = Math.round(w*dpr); canvas.height = Math.round(h*dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.clearRect(0,0,w,h);
  FALCON_BANDS.forEach(b => {
    const sTop = b.source[0]*h, sBot = b.source[1]*h;
    const tTop = b.target[0]*h, tBot = b.target[1]*h;
    ctx.beginPath();
    ctx.moveTo(0, sTop);
    ctx.bezierCurveTo(w*FALCON_SOURCE_HOLD, sTop, w*FALCON_TARGET_APPROACH, tTop, w, tTop);
    ctx.lineTo(w, tBot);
    ctx.bezierCurveTo(w*FALCON_TARGET_APPROACH, tBot, w*FALCON_SOURCE_HOLD, sBot, 0, sBot);
    ctx.closePath();
    ctx.fillStyle = b.color;
    ctx.fill();
  });
  FALCON_THREADS.forEach(t => {
    const sY = t.source*h, tY = t.target*h;
    ctx.beginPath();
    ctx.moveTo(0, sY);
    ctx.bezierCurveTo(w*FALCON_SOURCE_HOLD, sY, w*FALCON_TARGET_APPROACH, tY, w, tY);
    ctx.strokeStyle = `rgba(255,255,255,${t.alpha})`;
    ctx.lineWidth = Math.max(.72, w*FALCON_THREAD_W);
    ctx.stroke();
  });
}

function falconBindResize(el, draw){
  if(!el) return;
  draw(el);
  if(window.ResizeObserver){
    const ro = new ResizeObserver(() => draw(el));
    ro.observe(el);
  } else {
    window.addEventListener('resize', () => draw(el));
  }
}

function falconRunEntrance(scene){
  const cards = Array.from(scene.querySelectorAll('.card'));
  if(!cards.length) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce || !(window.Element && Element.prototype.animate)){
    return;
  }
  scene.classList.add('falcon-entrance-pending');

  requestAnimationFrame(() => requestAnimationFrame(() => {
    try{
      const vw = window.innerWidth;
      const rects = cards.map(c => ({ el:c, rect:c.getBoundingClientRect() }));
      const topMost = Math.min(...rects.map(r => r.rect.top));
      const tol = Math.max(4, window.innerHeight*0.04);
      const singleRow = rects.every(r => Math.abs(r.rect.top - topMost) <= tol);
      const centreX = vw/2;

      let ordered;
      if(singleRow){
        const centreEl = cards[1] || cards[0];
        ordered = rects.slice().sort((a,b) => Math.abs((a.rect.left+a.rect.width/2)-centreX) - Math.abs((b.rect.left+b.rect.width/2)-centreX));
        ordered = [{el:centreEl, rect:centreEl.getBoundingClientRect()}].concat(ordered.filter(r => r.el !== centreEl));
      } else {
        ordered = rects.slice().sort((a,b) => Math.abs(a.rect.top-b.rect.top) > 1 ? a.rect.top-b.rect.top : a.rect.left-b.rect.left);
      }

      const compact = vw <= 512;
      const rise = compact ? 11 : 16;
      const easePlace = 'cubic-bezier(.16,1,.3,1)';
      const easeWipe = 'cubic-bezier(.24,.86,.28,1)';

      scene.classList.add('falcon-entrance-active');
      scene.classList.remove('falcon-entrance-pending');

      const anims = [];
      ordered.forEach((item, order) => {
        const card = item.el, r = item.rect;
        let delay, drift = 0;
        if(singleRow){
          if(order === 0){ delay = 60; }
          else {
            delay = 245 + (order-1)*85;
            const offset = (r.left+r.width/2) - centreX;
            const sign = offset > 0 ? 1 : (offset < 0 ? -1 : 0);
            drift = -sign * Math.min(vw*0.018, 7);
          }
        } else { delay = 70 + order*115; }

        const panel = card.querySelector('.panel');
        const copy = card.querySelector('.card-copy');
        const heading = card.querySelector('.card-copy h3');
        const desc = card.querySelector('.card-copy p');
        const accent = card.querySelector('.corner-icon');

        anims.push(card.animate([
          {opacity:0, transform:`translate3d(${drift}px,${rise}px,0) scale(.985)`},
          {opacity:1, transform:'none'}
        ], { duration: compact?780:(order===0?960:900), delay, easing: easePlace, fill:'both' }));

        if(panel){
          const wipe = compact ? 26 : 34;
          anims.push(panel.animate([
            {opacity:0, transform:'scale(.994)', clipPath:`inset(0 0 ${wipe}% 0)`},
            {opacity:1, transform:'none', clipPath:'inset(0 0 0% 0)'}
          ], { duration: compact?620:720, delay: delay+200, easing: easeWipe, fill:'both' }));
        }
        if(copy){
          anims.push(copy.animate([
            {opacity:0, transform:`translate3d(0,${compact?8:11}px,0)`},
            {opacity:1, transform:'none'}
          ], { duration: compact?540:620, delay: delay+330, easing: easePlace, fill:'both' }));
        }
        if(heading){
          anims.push(heading.animate([
            {opacity:0, clipPath:'inset(-30% 0 100% 0)'},
            {opacity:1, clipPath:'inset(-30% 0 -30% 0)'}
          ], { duration: compact?470:540, delay: delay+350, easing: easeWipe, fill:'both' }));
        }
        if(desc){
          anims.push(desc.animate([
            {opacity:0, clipPath:'inset(-30% 0 100% 0)'},
            {opacity:1, clipPath:'inset(-30% 0 -30% 0)'}
          ], { duration: compact?430:490, delay: delay+450, easing: easeWipe, fill:'both' }));
        }
        if(accent){
          anims.push(accent.animate([
            {opacity:0, transform:'scale(.88)'},
            {opacity:1, transform:'none'}
          ], { duration: compact?340:400, delay: delay+540, easing: easePlace, fill:'both' }));
        }
      });

      let pending = anims.length;
      const reveal = () => { scene.classList.remove('falcon-entrance-pending','falcon-entrance-active'); };
      if(!pending){ reveal(); return; }
      anims.forEach(a => {
        a.onfinish = a.oncancel = () => {
          pending--;
          if(pending <= 0){ anims.forEach(x => { try{ x.cancel(); }catch(e){} }); reveal(); }
        };
      });
    }catch(e){
      scene.classList.remove('falcon-entrance-pending','falcon-entrance-active');
    }
  }));
}

function initFalconSection(){
  const scene = document.querySelector('.falcon-scene');
  if(!scene) return;
  falconBindResize(scene.querySelector('[data-sparkle-icon]'), falconDrawSparkle);
  falconBindResize(scene.querySelector('[data-flow-chart]'), falconDrawFlow);

  let started = false;
  if(window.IntersectionObserver){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting && !started){
          started = true;
          falconRunEntrance(scene);
          io.disconnect();
        }
      });
    }, { threshold: 0.25 });
    io.observe(scene);
  }
}

// canvas-driven spotlight reveal: touching/hovering a persona figure unmasks an
// "energized" duplicate of that same artwork through a soft circular gradient
// that follows the pointer, smoothed with a small lerp each frame.
function initTHSpotlight(items){
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const state = new Map(); // item -> {revealEl, active, curX, curY, tgtX, tgtY, w, h}
  let raf = null;

  items.forEach((item) => {
    const revealEl = item.querySelector('.th-item-reveal');
    if(!revealEl) return;
    state.set(item, { revealEl, active: false, curX: -999, curY: -999, tgtX: -999, tgtY: -999, w: 0, h: 0 });

    function pointFromEvent(e){
      const rect = item.getBoundingClientRect();
      const p = e.touches && e.touches[0] ? e.touches[0] : e;
      return { x: p.clientX - rect.left, y: p.clientY - rect.top, w: rect.width, h: rect.height };
    }
    function activate(e){
      const s = state.get(item);
      const pt = pointFromEvent(e);
      s.active = true; s.w = pt.w; s.h = pt.h;
      s.curX = s.tgtX = pt.x; s.curY = s.tgtY = pt.y;
      revealEl.classList.add('active');
      if(!raf) loop();
    }
    function move(e){
      const s = state.get(item);
      if(!s.active) return;
      const pt = pointFromEvent(e);
      s.tgtX = pt.x; s.tgtY = pt.y; s.w = pt.w; s.h = pt.h;
    }
    function deactivate(){
      const s = state.get(item);
      s.active = false;
      revealEl.classList.remove('active');
    }

    item.addEventListener('mouseenter', activate);
    item.addEventListener('mousemove', move);
    item.addEventListener('mouseleave', deactivate);
    item.addEventListener('touchstart', activate, { passive: true });
    item.addEventListener('touchmove', move, { passive: true });
    item.addEventListener('touchend', deactivate);
    item.addEventListener('touchcancel', deactivate);
  });

  function drawMask(s){
    const w = Math.max(1, Math.round(s.w));
    const h = Math.max(1, Math.round(s.h));
    if(canvas.width !== w) canvas.width = w;
    if(canvas.height !== h) canvas.height = h;
    ctx.clearRect(0, 0, w, h);
    const radius = Math.max(w, h) * 0.42;
    const grad = ctx.createRadialGradient(s.curX, s.curY, 0, s.curX, s.curY, radius);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.55, 'rgba(255,255,255,0.85)');
    grad.addColorStop(0.8, 'rgba(255,255,255,0.35)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(s.curX, s.curY, radius, 0, Math.PI * 2);
    ctx.fill();
    const dataUrl = canvas.toDataURL();
    s.revealEl.style.maskImage = `url(${dataUrl})`;
    s.revealEl.style.webkitMaskImage = `url(${dataUrl})`;
  }

  function loop(){
    let anyActive = false;
    state.forEach((s) => {
      if(!s.active) return;
      anyActive = true;
      const lerp = reduceMotion ? 1 : 0.18;
      s.curX += (s.tgtX - s.curX) * lerp;
      s.curY += (s.tgtY - s.curY) * lerp;
      drawMask(s);
    });
    raf = anyActive ? requestAnimationFrame(loop) : null;
  }
}

function initTHTheme(){
  const btn = document.getElementById('th-theme-toggle');
  if(!btn) return;
  function isDark(){ return document.documentElement.getAttribute('data-theme') === 'dark'; }
  function apply(dark){
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    btn.classList.toggle('is-dark', dark);
    btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
    store.set('theme', dark ? 'dark' : 'light');
  }
  apply(isDark());
  btn.addEventListener('click', () => apply(!isDark()));
}

function initTHDialog(hero){
  const overlay = document.getElementById('th-dialog-overlay');
  if(!overlay) return;
  const dialog = overlay.querySelector('.th-dialog');
  const openBtn = document.getElementById('th-discover-btn');
  const closeBtn = document.getElementById('th-dialog-close');
  const form = document.getElementById('th-dialog-form');
  const nameInput = document.getElementById('th-dialog-name');
  const emailInput = document.getElementById('th-dialog-email');
  const brandInput = document.getElementById('th-dialog-brand');
  const aboutInput = document.getElementById('th-dialog-about');
  const meetCheck = document.getElementById('th-dialog-meet');
  const meetTimeWrap = document.getElementById('th-dialog-meet-time-wrap');
  const scheduleTrigger = document.getElementById('th-schedule-trigger');
  const scheduleTriggerLabel = document.getElementById('th-schedule-trigger-label');
  const schedulePop = document.getElementById('th-schedule-pop');
  const presetsWrap = document.getElementById('th-schedule-presets');
  const prevBtn = document.getElementById('th-schedule-prev');
  const nextBtn = document.getElementById('th-schedule-next');
  const monthLabel = document.getElementById('th-schedule-month-label');
  const calGrid = document.getElementById('th-schedule-cal-grid');
  const timesWrap = document.getElementById('th-schedule-times');
  const scheduleCancelBtn = document.getElementById('th-schedule-cancel');
  const scheduleApplyBtn = document.getElementById('th-schedule-apply');
  const personaRow = document.getElementById('th-dialog-persona-row');
  const personaBtns = personaRow ? Array.from(personaRow.querySelectorAll('.th-dialog-persona-pick')) : [];
  const avatarImg = document.getElementById('th-dialog-avatar');
  const avatarName = document.getElementById('th-dialog-avatar-name');
  const avatarTagline = document.getElementById('th-dialog-avatar-tagline');
  const cursor = document.getElementById('th-cursor');
  let lastFocused = null;

  function applyPersona(key){
    const item = TH_ITEMS.find(p => p.key === key) || TH_ITEMS[0];
    avatarImg.src = item.image;
    avatarName.textContent = item.name;
    avatarTagline.textContent = item.tagline;
    personaBtns.forEach(b => b.classList.toggle('active', b.dataset.persona === item.key));
    store.set('demoPersona', item.key);
  }
  personaBtns.forEach(btn => {
    btn.addEventListener('click', () => applyPersona(btn.dataset.persona));
  });
  if(meetCheck){
    meetCheck.addEventListener('change', () => {
      meetTimeWrap.hidden = !meetCheck.checked;
      if(!meetCheck.checked) closeSchedule();
    });
  }

  // -- schedule-a-call date/time picker (compact single-month calendar + presets) --
  const todayStamp = new Date();
  todayStamp.setHours(0,0,0,0);
  let viewDate = new Date(todayStamp.getFullYear(), todayStamp.getMonth(), 1);
  let pendingDate = null, pendingTime = null; // being edited inside the popover
  let selectedDate = null, selectedTime = null; // committed via Apply

  function fmtMonth(d){ return d.toLocaleString('default', { month:'long', year:'numeric' }); }
  function fmtDay(d){ return d.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' }); }
  function sameDay(a,b){ return a && b && a.toDateString() === b.toDateString(); }

  function renderCalendar(){
    monthLabel.textContent = fmtMonth(viewDate);
    const year = viewDate.getFullYear(), month = viewDate.getMonth();
    const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let html = '';
    for(let i=0;i<firstDay;i++) html += '<span class="th-schedule-cal-empty"></span>';
    for(let day=1; day<=daysInMonth; day++){
      const d = new Date(year, month, day);
      const past = d < todayStamp;
      const active = sameDay(d, pendingDate);
      html += `<button type="button" class="th-schedule-day${active?' active':''}${past?' disabled':''}" data-day="${day}" ${past?'disabled':''}>${day}</button>`;
    }
    calGrid.innerHTML = html;
    calGrid.querySelectorAll('.th-schedule-day').forEach(btn => {
      btn.addEventListener('click', () => {
        pendingDate = new Date(year, month, Number(btn.dataset.day));
        setPreset('custom');
        renderCalendar();
      });
    });
  }
  function setPreset(id){
    if(presetsWrap){
      presetsWrap.querySelectorAll('.th-schedule-preset').forEach(b => b.classList.toggle('active', b.dataset.preset === id));
    }
    if(id === 'today'){ pendingDate = new Date(todayStamp); viewDate = new Date(pendingDate.getFullYear(), pendingDate.getMonth(), 1); }
    else if(id === 'tomorrow'){ pendingDate = new Date(todayStamp); pendingDate.setDate(pendingDate.getDate()+1); viewDate = new Date(pendingDate.getFullYear(), pendingDate.getMonth(), 1); }
    else if(id === 'week'){ pendingDate = new Date(todayStamp); pendingDate.setDate(pendingDate.getDate() + (7 - pendingDate.getDay())); viewDate = new Date(pendingDate.getFullYear(), pendingDate.getMonth(), 1); }
    else if(id === 'nextweek'){ pendingDate = new Date(todayStamp); pendingDate.setDate(pendingDate.getDate() + (14 - pendingDate.getDay())); viewDate = new Date(pendingDate.getFullYear(), pendingDate.getMonth(), 1); }
    renderCalendar();
  }
  if(presetsWrap){
    presetsWrap.querySelectorAll('.th-schedule-preset').forEach(btn => {
      btn.addEventListener('click', () => setPreset(btn.dataset.preset));
    });
  }
  if(timesWrap){
    timesWrap.querySelectorAll('.th-schedule-time').forEach(btn => {
      btn.addEventListener('click', () => {
        pendingTime = btn.dataset.time;
        timesWrap.querySelectorAll('.th-schedule-time').forEach(b => b.classList.toggle('active', b === btn));
      });
    });
  }
  if(prevBtn) prevBtn.addEventListener('click', () => { viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth()-1, 1); renderCalendar(); });
  if(nextBtn) nextBtn.addEventListener('click', () => { viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth()+1, 1); renderCalendar(); });

  function updateTriggerLabel(){
    if(selectedDate && selectedTime) scheduleTriggerLabel.textContent = `${fmtDay(selectedDate)} · ${selectedTime}`;
    else if(selectedDate) scheduleTriggerLabel.textContent = fmtDay(selectedDate);
    else scheduleTriggerLabel.textContent = 'Select a date';
  }
  function openSchedule(){
    pendingDate = selectedDate;
    pendingTime = selectedTime;
    viewDate = new Date((selectedDate||todayStamp).getFullYear(), (selectedDate||todayStamp).getMonth(), 1);
    renderCalendar();
    if(timesWrap) timesWrap.querySelectorAll('.th-schedule-time').forEach(b => b.classList.toggle('active', b.dataset.time === pendingTime));
    schedulePop.hidden = false;
    scheduleTrigger.setAttribute('aria-expanded', 'true');
  }
  function closeSchedule(){
    schedulePop.hidden = true;
    scheduleTrigger.setAttribute('aria-expanded', 'false');
  }
  if(scheduleTrigger){
    scheduleTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      if(schedulePop.hidden) openSchedule(); else closeSchedule();
    });
  }
  if(schedulePop) schedulePop.addEventListener('click', (e) => e.stopPropagation());
  document.addEventListener('click', () => { if(schedulePop && !schedulePop.hidden) closeSchedule(); });
  if(scheduleCancelBtn) scheduleCancelBtn.addEventListener('click', closeSchedule);
  if(scheduleApplyBtn){
    scheduleApplyBtn.addEventListener('click', () => {
      selectedDate = pendingDate;
      selectedTime = pendingTime;
      updateTriggerLabel();
      closeSchedule();
    });
  }

  function open(){
    lastFocused = document.activeElement;
    nameInput.value = store.get('demoName','');
    emailInput.value = store.get('demoEmail','');
    brandInput.value = store.get('demoBrand','');
    aboutInput.value = store.get('demoAbout','');
    applyPersona(store.get('demoPersona', TH_ITEMS[0].key));
    const wantsMeet = store.get('demoWantsMeeting', '') === 'true';
    meetCheck.checked = wantsMeet;
    meetTimeWrap.hidden = !wantsMeet;
    const savedDateStr = store.get('demoMeetDate','');
    selectedDate = savedDateStr ? new Date(savedDateStr) : null;
    selectedTime = store.get('demoMeetTimeSlot','') || null;
    updateTriggerLabel();
    closeSchedule();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    // hand the pointer back to the OS while the dialog is up - the liquid-glass
    // cursor covers the whole landing page but shouldn't fight normal clicking in a modal.
    document.body.classList.remove('smait-custom-cursor');
    if(cursor){ cursor.classList.remove('visible','expanded'); }
    setTimeout(() => nameInput.focus(), 60);
    document.addEventListener('keydown', onKeydown);
  }
  function close(){
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if(window.matchMedia('(hover: hover) and (pointer: fine)').matches){
      document.body.classList.add('smait-custom-cursor');
    }
    document.removeEventListener('keydown', onKeydown);
    if(lastFocused && lastFocused.focus) lastFocused.focus();
    closeSchedule();
  }
  function onKeydown(e){
    if(e.key !== 'Escape') return;
    if(schedulePop && !schedulePop.hidden){ closeSchedule(); return; }
    close();
  }

  const cancelBtn = document.getElementById('th-dialog-cancel');
  if(openBtn) openBtn.addEventListener('click', open);
  if(closeBtn) closeBtn.addEventListener('click', close);
  if(cancelBtn) cancelBtn.addEventListener('click', close);
  overlay.addEventListener('mousedown', (e) => { if(e.target === overlay) close(); });
  if(!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    store.set('demoName', nameInput.value.trim());
    store.set('demoEmail', emailInput.value.trim());
    store.set('demoBrand', brandInput.value.trim());
    store.set('demoAbout', aboutInput.value.trim());
    store.set('demoWantsMeeting', meetCheck.checked);
    store.set('demoMeetDate', (meetCheck.checked && selectedDate) ? selectedDate.toDateString() : '');
    store.set('demoMeetTimeSlot', (meetCheck.checked && selectedTime) ? selectedTime : '');
    close();
    nav('/waitlist');
  });
}

// liquid-glass custom cursor: a small glass dot that follows the pointer with a
// spring-like lag, and blooms into a pill carrying a social-media-flavored word
// whenever it passes over an interactive element (data-cursor="...").
const TH_CURSOR_ICONS = {
  Reply: 'msg', Back: 'back', Next: 'arrow', Demo: 'send', Start: 'send', Waitlist: 'send',
  View: 'chevron', Read: 'msg', Visit: 'ext', Join: 'mail', Analyse: 'sparkles',
};
function initTHCursor(hero){
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!supportsHover || reduceMotion) return;

  const cursor = document.getElementById('th-cursor');
  const label = document.getElementById('th-cursor-label');
  const page = document.getElementById('smait-landing-page') || hero || document.querySelector('.public-page');
  if(!cursor || !label || !page) return;
  document.body.classList.add('smait-custom-cursor');

  let mouseX = 0, mouseY = 0, curX = 0, curY = 0, vx = 0, vy = 0, raf = null, activeLabel = null;
  const stiffness = 0.18;
  const damping = 0.72;
  function loop(){
    vx = (vx + (mouseX - curX) * stiffness) * damping;
    vy = (vy + (mouseY - curY) * stiffness) * damping;
    curX += vx;
    curY += vy;
    cursor.style.transform = `translate(${curX}px, ${curY}px) translate(-50%,-50%)`;
    raf = requestAnimationFrame(loop);
  }
  function onMouseMove(e){
    mouseX = e.clientX;
    mouseY = e.clientY;
    if(!raf) { curX = mouseX; curY = mouseY; vx = 0; vy = 0; loop(); }
  }
  document.addEventListener('mousemove', onMouseMove);
  function setLabel(text){
    if(text === activeLabel) return;
    activeLabel = text;
    if(text){
      const iconName = TH_CURSOR_ICONS[text] || 'sparkles';
      label.innerHTML = `${icon(iconName,13)}<span>${escapeHtml(text)}</span>`;
      cursor.classList.add('expanded');
    } else {
      cursor.classList.remove('expanded');
      setTimeout(() => { if(!activeLabel) label.innerHTML = ''; }, 150);
    }
  }
  function onPageEnter(){ cursor.classList.add('visible'); }
  function onPageLeave(){ cursor.classList.remove('visible'); setLabel(null); }
  page.addEventListener('mouseenter', onPageEnter);
  page.addEventListener('mouseleave', onPageLeave);
  const targets = page.querySelectorAll('[data-cursor], a, button, input, textarea, select');
  const targetBindings = [];
  targets.forEach((el) => {
    const text = el.dataset.cursor || (el.tagName === 'BUTTON' ? 'View' : el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' ? 'Join' : 'Visit');
    const enter = () => setLabel(text);
    const leave = () => setLabel(null);
    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);
    targetBindings.push([el, enter, leave]);
  });
  window.__smaitCursorCleanup = () => {
    document.removeEventListener('mousemove', onMouseMove);
    page.removeEventListener('mouseenter', onPageEnter);
    page.removeEventListener('mouseleave', onPageLeave);
    targetBindings.forEach(([el, enter, leave]) => { el.removeEventListener('mouseenter', enter); el.removeEventListener('mouseleave', leave); });
    if(raf) cancelAnimationFrame(raf);
    cursor.classList.remove('visible','expanded');
    document.body.classList.remove('smait-custom-cursor');
    window.__smaitCursorCleanup = null;
  };
}

function screenNotFound(){
  return publicPage('', `<section class="public-hero public-hero--compact public-not-found"><p class="public-kicker">404 / No signal here</p><h1>This page took a <em>different route.</em></h1><p class="public-lead">The link may have moved, but the conversation is still happening.</p><a class="public-button" href="#/">Return home ${icon('arrow',15)}</a></section>`);
}
function bindVoiceNavigator(){
  const stage = document.getElementById('public-voices-stage');
  if(!stage) return;
  if(window.__smaitVoiceCleanup) window.__smaitVoiceCleanup();
  const description = document.getElementById('public-voice-description');
  const name = document.getElementById('public-voice-name');
  const role = document.getElementById('public-voice-role');
  const avatars = Array.from(stage.querySelectorAll('[data-voice-index]'));
  const backdrops = Array.from(stage.querySelectorAll('[data-voice-backdrop]'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeIndex = 0;
  let rotationTimer = null;
  let paused = false;
  const setActive = (index) => {
    activeIndex = index;
    const voice = VOICE_ITEMS[index];
    avatars.forEach((avatar, i) => {
      const active = i === index;
      avatar.classList.toggle('is-active', active);
      avatar.setAttribute('aria-selected', String(active));
    });
    backdrops.forEach((backdrop, i) => backdrop.classList.toggle('is-active', i === index));
    [description, name, role].forEach((node) => { node.classList.remove('is-changing'); void node.offsetWidth; node.classList.add('is-changing'); });
    description.textContent = voice.description;
    name.textContent = voice.name;
    role.textContent = voice.role;
  };
  const stopRotation = () => {
    if(rotationTimer) { clearInterval(rotationTimer); rotationTimer = null; }
  };
  const startRotation = () => {
    stopRotation();
    if(reduceMotion || document.hidden || paused) return;
    rotationTimer = setInterval(() => setActive((activeIndex + 1) % VOICE_ITEMS.length), 5000);
  };
  const onVisibilityChange = () => document.hidden ? stopRotation() : startRotation();
  const pause = () => { paused = true; stopRotation(); };
  const resume = () => { paused = false; startRotation(); };
  avatars.forEach((avatar) => avatar.addEventListener('click', () => { setActive(Number(avatar.dataset.voiceIndex)); startRotation(); }));
  stage.addEventListener('mouseenter', pause);
  stage.addEventListener('mouseleave', resume);
  stage.addEventListener('focusin', pause);
  stage.addEventListener('focusout', (event) => { if(!stage.contains(event.relatedTarget)) resume(); });
  document.addEventListener('visibilitychange', onVisibilityChange);
  window.__smaitVoiceCleanup = () => {
    stopRotation();
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.__smaitVoiceCleanup = null;
  };
  setActive(0);
  startRotation();
}
function bindPersonasPage(){
  bindPublicPage();
  bindVoiceNavigator();
}
function bindFeatureAccordion(){
  const items = Array.from(document.querySelectorAll('.public-feature-accordion-item'));
  items.forEach((item) => {
    const button = item.querySelector('button');
    const mark = item.querySelector('.public-feature-accordion-mark');
    button.addEventListener('click', () => {
      const open = item.classList.contains('is-open');
      items.forEach((other) => {
        other.classList.remove('is-open');
        other.querySelector('button').setAttribute('aria-expanded', 'false');
        other.querySelector('.public-feature-accordion-mark').textContent = '+';
      });
      if(!open){
        item.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
        mark.textContent = '−';
      }
    });
  });
}
function bindFeaturesPage(){
  bindPublicPage();
  bindFeatureAccordion();
}
function bindPublicPage(){
  const navRoot = document.querySelector('[data-public-nav]');
  const menu = navRoot?.querySelector('[data-public-nav-toggle]');
  const navEl = navRoot?.querySelector('[data-public-nav-panel]');
  if(menu && navEl){
    menu.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const open = navEl.classList.toggle('is-open');
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    navEl.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      navEl.classList.remove('is-open');
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Open navigation');
    }));
    document.addEventListener('keydown', (event) => {
      if(event.key === 'Escape'){
        navEl.classList.remove('is-open');
        menu.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-label', 'Open navigation');
      }
    });
  }
  const waitlist = document.getElementById('public-waitlist-form');
  if(waitlist) waitlist.addEventListener('submit', (event) => {
    event.preventDefault();
    document.getElementById('public-waitlist-success').hidden = false;
    waitlist.reset();
  });
  const contact = document.getElementById('public-contact-form');
  if(contact) contact.addEventListener('submit', (event) => {
    event.preventDefault();
    document.getElementById('public-contact-success').hidden = false;
    contact.reset();
  });
  const newsletterForm = document.getElementById('smait-newsletter-form');
  if(newsletterForm) newsletterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = newsletterForm.querySelector('input');
    const button = newsletterForm.querySelector('button');
    if(button) button.textContent = 'Subscribed';
    if(input) input.disabled = true;
  });
}

// ---------- helpers ----------
function initTextEffects(root = document){
  const targets = Array.from(root.querySelectorAll('.smait-text-effect:not([data-text-effect-ready])'));
  targets.forEach((element) => {
    element.dataset.textEffectReady = 'true';
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while(walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach((node) => {
      if(!node.nodeValue || !node.nodeValue.trim()) return;
      const fragment = document.createDocumentFragment();
      const tokens = node.nodeValue.split(/(\s+)/);
      let charIndex = 0;
      tokens.forEach((token) => {
        if(!token) return;
        if(/^\s+$/.test(token)){
          fragment.appendChild(document.createTextNode(token));
          return;
        }
        const word = document.createElement('span');
        word.className = 'smait-text-word';
        Array.from(token).forEach((character) => {
          const span = document.createElement('span');
          span.className = 'smait-text-char';
          span.style.setProperty('--char-index', charIndex++);
          span.textContent = character;
          word.appendChild(span);
        });
        fragment.appendChild(word);
      });
      node.replaceWith(fragment);
    });
    requestAnimationFrame(() => element.classList.add('is-text-revealed'));
  });
}
function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function escapeAttr(s){ return escapeHtml(s); }

// ---------- router ----------
const ROUTES = {
  '/': { render: screenLanding, bind: bindLanding },
  '/features': { render: screenFeatures, bind: bindFeaturesPage },
  '/personas': { render: screenPersonas, bind: bindPersonasPage },
  '/contact': { render: screenContact, bind: bindPublicPage },
  '/waitlist': { render: screenWaitlist, bind: bindPublicPage },
  '/404': { render: screenNotFound, bind: bindPublicPage },
};

const root = document.getElementById('root');
function render(){
  const entry = ROUTES[route] || ROUTES['/404'];
  document.title = route === '/' ? 'SMAIT | AI Personas for Social Replies' : document.title;
  if(window.__smaitVoiceCleanup) window.__smaitVoiceCleanup();
  if(window.__smaitCursorCleanup) window.__smaitCursorCleanup();
  document.body.classList.remove('smait-custom-cursor');
  root.innerHTML = entry.render();
  window.scrollTo(0,0);
  if(entry.bind) entry.bind();
  if(entry.render === screenLanding){
    initDockNavigation();
    initCometCards();
  }
  if(document.querySelector('.public-nav')) bindPublicPage();
  if(document.querySelector('.public-page')) {
    initCometCards();
    initTHCursor(document.querySelector('.public-page'));
    initTHTheme();
  }
  initTextEffects(document);
}

render();
})();
