(() => {
  'use strict';
  const tabs = [...document.querySelectorAll('button[data-view]')];
  const panels = [...document.querySelectorAll('[data-panel]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const story = document.querySelector('.scroll-story');
  const slides = [...document.querySelectorAll('.story-slide')];
  const dots = [...document.querySelectorAll('.story-dots button')];
  let activeView = 'myself', currentStep = -1, framePending = false;
  function showStep(step) {
    if (currentStep === step && !reduced.matches) return;
    currentStep = step;
    story.dataset.step = String(step);
    slides.forEach((slide, index) => {
      slide.classList.toggle('is-current', index === step);
      slide.inert = !reduced.matches && index !== step;
    });
    dots.forEach((dot, index) => {
      dot.classList.toggle('current', index === step);
      dot.setAttribute('aria-pressed', String(index === step));
    });
    document.querySelector('.story-count').textContent = `0${step + 1} / 03`;
    document.querySelector('.art-center').textContent = ['AI', '</>', '↑'][step];
  }
  function updateScroll() {
    framePending = false;
    const extent = document.documentElement.scrollHeight - innerHeight;
    document.querySelector('.scroll-progress').style.transform = `scaleX(${extent > 0 ? scrollY / extent : 0})`;
    if (activeView !== 'myself') return;
    const range = story.offsetHeight - document.querySelector('.story-pin').offsetHeight;
    const fraction = range > 0 ? Math.max(0, Math.min(1, (document.querySelector('header').offsetHeight - story.getBoundingClientRect().top) / range)) : 0;
    showStep(Math.min(2, Math.floor(fraction * 3)));
  }
  function scheduleScroll() {
    if (!framePending) { framePending = true; requestAnimationFrame(updateScroll); }
  }
  function setView(name, navigate = true, move = true) {
    if (!panels.some(panel => panel.dataset.panel === name)) name = 'myself';
    activeView = name;
    document.body.dataset.view = name;
    const business = name === 'business';
    const brand = document.querySelector('#header-brand');
    brand.querySelector('.brand-monogram').innerHTML = business ? 'm<span>·</span>k' : 'm<span>·</span>m';
    brand.querySelector('.brand-label').innerHTML = business ? 'MK<br>SYSTEMS' : 'MUHAMMAD<br>MUZAMMIL';
    brand.setAttribute('aria-label', business ? 'MK Systems home' : 'Muhammad Muzammil home');
    document.querySelector('#hero-identity').textContent = business
      ? 'MK SYSTEMS / WEBSITES · POS · ERP'
      : 'MUHAMMAD MUZAMMIL / AI ENGINEER & FOUNDER, MK SYSTEMS';
    tabs.forEach(tab => {
      const active = tab.dataset.view === name;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-pressed', String(active));
    });
    panels.forEach(panel => {
      const active = panel.dataset.panel === name;
      panel.hidden = !active;
      panel.classList.toggle('active', active);
    });
    document.querySelector('#hero-heading').innerHTML = name === 'business'
      ? 'Local ambition.<br>Digital <span class="serif">possibilities.</span>'
      : 'Engineering ideas.<br>Building <span class="serif">what’s next.</span>';
    document.querySelector('#hero-description').textContent = name === 'business'
      ? 'MK Systems brings websites, POS, and ERP solutions to local clients and shops. Founded by Muhammad Muzammil, it turns everyday business needs into practical digital experiences.'
      : 'I’m Muhammad Muzammil, a Senior Backend & AI Engineer turning complex ideas into intelligent systems—and practical digital solutions through MK Systems.';
    // file:// previews may restrict history; switching never depends on it.
    if (navigate) { try { history.replaceState(null, '', `#${name}`); } catch (_) {} }
    if (move) document.querySelector('#explore').scrollIntoView({ behavior: 'instant', block: 'start' });
    scheduleScroll();
  }
  tabs.forEach(tab => tab.addEventListener('click', () => setView(tab.dataset.view)));
  document.querySelectorAll('[data-switch]').forEach(button => button.addEventListener('click', () => {
    setView(button.dataset.switch);
    document.querySelector(`button[data-view="${button.dataset.switch}"]`).focus({ preventScroll: true });
  }));
  dots.forEach((dot, index) => dot.addEventListener('click', () => {
    const range = story.offsetHeight - document.querySelector('.story-pin').offsetHeight;
    const target = scrollY + story.getBoundingClientRect().top - document.querySelector('header').offsetHeight + range * ((index + .5) / 3);
    window.scrollTo({ top: target, behavior: reduced.matches ? 'instant' : 'smooth' });
  }));
  window.addEventListener('hashchange', () => {
    if (['#business', '#myself'].includes(location.hash)) setView(location.hash.slice(1), false);
  });
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', scheduleScroll);
  reduced.addEventListener('change', () => { currentStep = -1; updateScroll(); });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: .06 });
    document.querySelectorAll('.section, .switch-section, .contact').forEach(section => {
      section.classList.add('reveal'); observer.observe(section);
    });
  }
  setView(location.hash === '#business' ? 'business' : 'myself', false, false);
  updateScroll();
})();
