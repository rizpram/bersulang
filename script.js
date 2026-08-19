const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

const $ = (selector) => document.querySelector(selector);

function escapeHTML(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function setText(selector, value) {
  const node = $(selector);
  if (node && value !== undefined && value !== null) node.textContent = value;
}

function setMeta(selector, value) {
  const node = $(selector);
  if (node && value) node.setAttribute('content', value);
}

function normalizeHref(value) {
  return value && String(value).trim() ? String(value).trim() : '#';
}

function isExternalHref(href) {
  return /^https?:\/\//i.test(String(href || ''));
}

function dataEventName(prefix, value) {
  return `${prefix}_${String(value || 'link').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')}`;
}

function trackEvent(eventName, params = {}) {
  if (typeof window.gtag === 'function') window.gtag('event', eventName, params);
}

document.addEventListener('click', (event) => {
  const tracked = event.target.closest('[data-event]');
  if (!tracked) return;
  trackEvent(tracked.getAttribute('data-event'), {
    link_text: tracked.textContent.trim(),
    link_url: tracked.getAttribute('href') || ''
  });
});

async function loadCMSContent() {
  try {
    const response = await fetch('/content/site.json', { cache: 'no-store' });
    if (!response.ok) return;
    const data = await response.json();

    applySEO(data.seo);
    applyHero(data.hero);
    applyRelease(data.release);
    applySmartlinks(data.smartlink);
    applyReleases(data.releases);
    applyArtist(data.artist);
    applyPressKit(data.pressKit);
    applyJournal(data.journal);
    applyMerch(data.merch);
    applyContact(data.contact);
  } catch (error) {
    console.warn('CMS content failed to load:', error);
  }
}

function applySEO(seo = {}) {
  if (seo.title) document.title = seo.title;
  setMeta('meta[name="description"]', seo.description);
  setMeta('meta[name="keywords"]', seo.keywords);
  setMeta('meta[property="og:title"]', seo.ogTitle || seo.title);
  setMeta('meta[property="og:description"]', seo.ogDescription || seo.description);
  setMeta('meta[property="og:image"]', seo.ogImage);
}

function applyHero(hero = {}) {
  setText('.hero .eyebrow', hero.eyebrow);
  const heading = $('.hero h1');
  if (heading && hero.artist && hero.title) {
    heading.innerHTML = `${escapeHTML(hero.artist)}<br><span>${escapeHTML(hero.title)}</span>`;
  }
  setText('.hero .subline', hero.subline);
  setText('.hero .release-date', hero.releaseDateLine);

  const coverTitle = $('.cover-title');
  if (coverTitle && hero.artist && hero.title) {
    coverTitle.innerHTML = `
      <small>${escapeHTML(hero.artist)}</small>
      <strong>${escapeHTML(hero.coverTitle || hero.title).replace(/ & /g, ' &amp; ').replace(/\n/g, '<br>')}</strong>
      <em>${escapeHTML(hero.coverLine || hero.subline || '')}</em>
    `;
  }

  const marquee = $('.marquee div');
  if (marquee && hero.marquee) marquee.textContent = hero.marquee;
}

function applyRelease(release = {}) {
  setText('#release .eyebrow', release.eyebrow);
  setText('#release h2', release.title);
  const paragraphs = document.querySelectorAll('#release .content-block > p');
  if (paragraphs[0] && release.description) paragraphs[0].textContent = release.description;
  if (paragraphs[1] && release.soundDirection) paragraphs[1].textContent = release.soundDirection;

  const credits = $('#release .credits');
  if (credits && Array.isArray(release.credits)) {
    credits.innerHTML = release.credits
      .map((item) => `<p><b>${escapeHTML(item.label)}</b> ${escapeHTML(item.value)}</p>`)
      .join('');
  }

  setText('.quote-section blockquote', release.quote);
}

function applySmartlinks(smartlink = {}) {
  setText('#smartlink .eyebrow', smartlink.eyebrow);
  setText('#smartlink h2', smartlink.title);
  setText('#smartlink .section-head p:last-child', smartlink.note);
  const grid = $('#smartlink .link-grid');
  if (grid && Array.isArray(smartlink.platforms)) {
    grid.innerHTML = smartlink.platforms
      .map((platform) => {
        const href = normalizeHref(platform.url);
        const target = isExternalHref(href) ? ' target="_blank" rel="noopener"' : '';
        const eventName = dataEventName('smartlink_click', platform.name);
        return `
          <a class="platform" href="${escapeHTML(href)}"${target} data-event="${escapeHTML(eventName)}">
            <span>${escapeHTML(platform.name)}</span><small>${escapeHTML(platform.status || '')}</small>
          </a>
        `;
      })
      .join('');
  }
}

function applyReleases(releases = {}) {
  setText('#releases .eyebrow', releases.eyebrow);
  setText('#releases h2', releases.title);
  const cards = $('#releases .cards');
  if (cards && Array.isArray(releases.items)) {
    cards.innerHTML = releases.items
      .map((item, index) => `
        <article class="release-card${index === 0 ? ' featured' : ''}">
          <div class="thumb${index === 0 ? ' mini-cover' : ''}"></div>
          <div>
            <p class="tag">${escapeHTML(item.tag || '')}</p>
            <h3>${escapeHTML(item.title || '')}</h3>
            <p>${escapeHTML(item.description || '')}</p>
          </div>
        </article>
      `)
      .join('');
  }
}

function applyArtist(artist = {}) {
  setText('#artist .eyebrow', artist.eyebrow);
  setText('#artist h2', artist.name);
  const bio = $('#artist .content-block > p');
  if (bio && artist.bio) bio.textContent = artist.bio;
  const buttons = $('#artist .button-list');
  if (buttons && Array.isArray(artist.links)) {
    buttons.innerHTML = artist.links
      .map((link) => `<a href="${escapeHTML(normalizeHref(link.url))}" data-event="${escapeHTML(dataEventName('artist_click', link.label))}">${escapeHTML(link.label)}</a>`)
      .join('');
  }
}

function applyPressKit(pressKit = {}) {
  setText('#press .eyebrow', pressKit.eyebrow);
  setText('#press h2', pressKit.title);
  setText('#press .section-head p:last-child', pressKit.description);
  const grid = $('#press .press-grid');
  if (grid && Array.isArray(pressKit.items)) {
    grid.innerHTML = pressKit.items
      .map((item) => `
        <div class="press-box">
          <h3>${escapeHTML(item.title || '')}</h3>
          <p>${escapeHTML(item.description || '')}</p>
          <a href="${escapeHTML(normalizeHref(item.file))}" download data-event="${escapeHTML(dataEventName('presskit_download', item.title))}">${escapeHTML(item.cta || 'Download')}</a>
        </div>
      `)
      .join('');
  }
}

function applyJournal(journal = {}) {
  setText('#journal .eyebrow', journal.eyebrow);
  setText('#journal h2', journal.title);
  const list = $('#journal .journal-list');
  if (list && Array.isArray(journal.items)) {
    list.innerHTML = journal.items
      .map((item) => `
        <a href="${escapeHTML(normalizeHref(item.url))}" data-event="${escapeHTML(dataEventName('story_click', item.title))}">
          <span>${escapeHTML(item.title || '')}</span>
          <small>${escapeHTML(item.description || '')}</small>
        </a>
      `)
      .join('');
  }
}

function applyMerch(merch = {}) {
  setText('#merch .eyebrow', merch.eyebrow);
  setText('#merch h2', merch.title);
  const paragraph = $('#merch .content-block p');
  if (paragraph && merch.description) paragraph.textContent = merch.description;
  const link = $('#merch .content-block .btn');
  if (link && merch.ctaLabel) link.textContent = merch.ctaLabel;
  if (link && merch.ctaUrl) link.setAttribute('href', merch.ctaUrl);
  if (link) link.setAttribute('data-event', 'merch_click');
}

function applyContact(contact = {}) {
  setText('#contact .eyebrow', contact.eyebrow);
  setText('#contact h2', contact.title);
  const form = $('.contact-form');
  if (form && contact.email) form.setAttribute('action', `mailto:${contact.email}`);
}

loadCMSContent();
