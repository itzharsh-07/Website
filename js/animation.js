/**
 * animation.js — GSAP-powered luxury motion layer.
 * Requires gsap + ScrollTrigger to be loaded via CDN before this file.
 */
(function () {
  'use strict';
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Hero entrance ---------------- */
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  if (document.querySelector('.hero')) {
    heroTl
      .from('.hero-media img', { scale: 1.22, duration: 1.6, ease: 'power2.out' }, 0)
      .from('.hero-content .eyebrow', { y: 24, opacity: 0, duration: 0.7 }, 0.2)
      .from('.hero-title', { y: 40, opacity: 0, duration: 0.9 }, 0.32)
      .from('.hero-desc', { y: 24, opacity: 0, duration: 0.8 }, 0.5)
      .from('.hero-actions .btn', { y: 20, opacity: 0, duration: 0.6, stagger: 0.12 }, 0.62)
      .from('.hero-scroll', { opacity: 0, duration: 0.6 }, 0.9);
  }
  gsap.from('.site-header', { y: -40, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 });

  /* ---------------- Parallax hero image ---------------- */
  if (!reduceMotion && document.querySelector('.hero-media img')) {
    gsap.to('.hero-media img', {
      yPercent: 14,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  }

  /* ---------------- Generic reveal on scroll ---------------- */
  gsap.utils.toArray('.reveal').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
      delay: (i % 4) * 0.06,
    });
  });

  /* ---------------- Stagger groups ---------------- */
  document.querySelectorAll('[data-stagger]').forEach((group) => {
    const items = group.querySelectorAll('.reveal');
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: { trigger: group, start: 'top 85%' },
    });
  });

  /* ---------------- Number counters ---------------- */
  document.querySelectorAll('[data-counter]').forEach((el) => {
    const target = Number(el.dataset.counter);
    const isDecimal = !Number.isInteger(target);
    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = isDecimal ? obj.val.toFixed(1) : Math.floor(obj.val).toLocaleString();
          },
        });
      },
    });
  });

  /* ---------------- Section head reveal ---------------- */
  gsap.utils.toArray('.section-head').forEach((el) => {
    gsap.from(el.children, {
      opacity: 0,
      y: 24,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  /* ---------------- Floating cards (subtle idle motion) ---------------- */
  gsap.utils.toArray('.float-card').forEach((el, i) => {
    gsap.to(el, {
      y: i % 2 === 0 ? -10 : 10,
      duration: 2.6 + (i % 3) * 0.4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  });

  window.LumiereAnim = { refresh: () => ScrollTrigger.refresh() };
})();
