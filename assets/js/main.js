/* Espaço Recreativo · interações */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.remove('no-js');

  /* ---------- Navbar: translúcida ao rolar + botão flutuante ---------- */
  const nav = $('.nav');
  const wa = $('.wa-float');
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle('is-scrolled', y > 24);
    wa.classList.toggle('is-visible', y > innerHeight * .6);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* link ativo conforme a seção visível */
  const links = $$('.nav__links a');
  const secObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  links.forEach(a => { const s = $(a.getAttribute('href')); if (s) secObs.observe(s); });

  /* ---------- Gaveta mobile ---------- */
  const drawer = $('#drawer');
  const burger = $('.burger');
  const setDrawer = open => {
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) setTimeout(() => $('.drawer__close', drawer).focus(), 50); else burger.focus({ preventScroll: true });
  };
  burger.addEventListener('click', () => setDrawer(true));
  drawer.addEventListener('click', e => {
    if (e.target.closest('[data-close]') || e.target.closest('nav a')) setDrawer(false);
  });

  /* ---------- Animações de entrada ---------- */
  const revObs = new IntersectionObserver((entries, o) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); o.unobserve(e.target); } });
  }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal, .routine__peek').forEach(el => revObs.observe(el));

  /* ---------- Parallax dos confetes no hero ---------- */
  const hero = $('.hero');
  $$('.px', hero).forEach(el => el.style.setProperty('--depth', el.dataset.depth));
  if (!reduce && matchMedia('(pointer: fine)').matches) {
    let raf;
    hero.addEventListener('pointermove', e => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = hero.getBoundingClientRect();
        hero.style.setProperty('--mx', ((e.clientX - r.left) / r.width - .5).toFixed(3));
        hero.style.setProperty('--my', ((e.clientY - r.top) / r.height - .5).toFixed(3));
      });
    });
    hero.addEventListener('pointerleave', () => { hero.style.setProperty('--mx', 0); hero.style.setProperty('--my', 0); });
  }

  /* ---------- Galeria: filtros + entrada escalonada ---------- */
  const items = $$('.ph');
  const galObs = new IntersectionObserver((entries, o) => {
    let i = 0;
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.style.setProperty('--stagger', (i++ * .08) + 's');
      e.target.classList.add('is-in');
      o.unobserve(e.target);
    });
  }, { threshold: .08 });
  items.forEach(el => galObs.observe(el));

  $$('.filter').forEach(btn => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    $$('.filter').forEach(b => { b.classList.toggle('is-active', b === btn); b.setAttribute('aria-pressed', String(b === btn)); });
    let i = 0;
    items.forEach(el => {
      const show = f === 'todos' || el.dataset.cat === f;
      el.classList.toggle('is-hidden', !show);
      if (show) {
        el.classList.remove('is-in');
        el.style.setProperty('--stagger', (i++ * .06) + 's');
        requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-in')));
      }
    });
  }));

  /* ---------- Lightbox ---------- */
  const lb = $('#lightbox');
  const lbImg = $('.lb__img', lb);
  const lbCap = $('.lb__cap', lb);
  const lbCount = $('.lb__count', lb);
  let list = [], idx = 0, lastFocus = null;

  const render = () => {
    const fig = list[idx];
    const img = $('img', fig);
    lbImg.classList.add('is-swapping');
    setTimeout(() => {
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = $('figcaption', fig).textContent;
      lbCount.textContent = `${idx + 1}/${list.length}`;
      lbImg.onload = () => lbImg.classList.remove('is-swapping');
      if (lbImg.complete) lbImg.classList.remove('is-swapping');
    }, reduce ? 0 : 160);
  };
  const go = d => { idx = (idx + d + list.length) % list.length; render(); };
  const openLb = fig => {
    list = items.filter(el => !el.classList.contains('is-hidden'));
    idx = list.indexOf(fig);
    lastFocus = document.activeElement;
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    render();
    requestAnimationFrame(() => lb.classList.add('is-open'));
    $('.lb__close', lb).focus();
  };
  const closeLb = () => {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => { lb.hidden = true; }, reduce ? 0 : 300);
    lastFocus && lastFocus.focus({ preventScroll: true });
  };
  items.forEach(fig => $('button', fig).addEventListener('click', () => openLb(fig)));
  $('.lb__close', lb).addEventListener('click', closeLb);
  $('.lb__prev', lb).addEventListener('click', () => go(-1));
  $('.lb__next', lb).addEventListener('click', () => go(1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });

  /* swipe no celular */
  let sx = 0, sy = 0;
  lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  lb.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
  });

  /* teclado: ESC fecha, setas navegam, Tab fica preso no modal */
  document.addEventListener('keydown', e => {
    if (!lb.hidden) {
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Tab') {
        const f = $$('button', lb), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    } else if (e.key === 'Escape' && drawer.classList.contains('is-open')) setDrawer(false);
  });

  /* ---------- Carrossel de depoimentos ---------- */
  const car = $('.carousel');
  const track = $('.carousel__track', car);
  const slides = $$('.testi', car);
  const dotsBox = $('.dots', car);
  let cur = 0, timer;
  const dots = slides.map((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', `Depoimento ${i + 1}`);
    b.addEventListener('click', () => { show(i); restart(); });
    dotsBox.appendChild(b);
    return b;
  });
  const show = i => {
    cur = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${cur * 100}%)`;
    slides.forEach((s, k) => { s.classList.toggle('is-current', k === cur); s.setAttribute('aria-hidden', String(k !== cur)); });
    dots.forEach((d, k) => { d.setAttribute('aria-current', String(k === cur)); d.setAttribute('aria-pressed', String(k === cur)); });
  };
  const play = () => { if (!reduce) timer = setInterval(() => show(cur + 1), 5500); };
  const stop = () => clearInterval(timer);
  const restart = () => { stop(); play(); };
  $('.car-prev', car).addEventListener('click', () => { show(cur - 1); restart(); });
  $('.car-next', car).addEventListener('click', () => { show(cur + 1); restart(); });
  car.addEventListener('mouseenter', stop);
  car.addEventListener('mouseleave', play);
  car.addEventListener('focusin', stop);
  car.addEventListener('focusout', play);
  let tx = 0;
  car.addEventListener('touchstart', e => { tx = e.touches[0].clientX; stop(); }, { passive: true });
  car.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 45) show(cur + (dx < 0 ? 1 : -1));
    play();
  });
  show(0); play();

  /* ---------- FAQ: abre/fecha com animação de altura ---------- */
  $$('.qa').forEach(d => {
    const sum = $('summary', d), body = $('.qa__body', d);
    sum.addEventListener('click', e => {
      if (reduce) return;
      e.preventDefault();
      if (d.open) {
        body.animate([{ height: body.offsetHeight + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 320, easing: 'cubic-bezier(.22,1,.36,1)' })
          .onfinish = () => { d.open = false; };
        d.classList.add('closing');
        d.querySelector('.qa__ico').style.transform = 'rotate(0deg)';
        setTimeout(() => { d.querySelector('.qa__ico').style.transform = ''; d.classList.remove('closing'); }, 330);
      } else {
        d.open = true;
        const h = body.offsetHeight;
        body.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
      }
    });
  });

  /* ano no rodapé */
  $('#ano').textContent = new Date().getFullYear();
})();
