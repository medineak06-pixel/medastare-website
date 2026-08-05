const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const progress = document.querySelector('.scroll-progress');
const header = document.querySelector('.site-header');

const updateScrollUI = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = maxScroll > 0 ? scrollTop / maxScroll : 0;
  if (progress) progress.style.transform = `scaleX(${ratio})`;
  if (header) header.classList.toggle('scrolled', scrollTop > 24);
};

updateScrollUI();
window.addEventListener('scroll', updateScrollUI, { passive: true });

const revealTargets = document.querySelectorAll('[data-reveal]');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealTargets.forEach((element) => element.classList.add('visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

  revealTargets.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    revealObserver.observe(element);
  });
}

const spotlightTargets = document.querySelectorAll('[data-spotlight], .product-card');
spotlightTargets.forEach((element) => {
  element.addEventListener('pointermove', (event) => {
    const rect = element.getBoundingClientRect();
    element.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
    element.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
  });
});

if (finePointer && !reduceMotion) {
  const aura = document.querySelector('.cursor-aura');
  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let auraX = pointerX;
  let auraY = pointerY;

  window.addEventListener('pointermove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (aura) aura.style.opacity = '1';
  }, { passive: true });

  document.documentElement.addEventListener('mouseleave', () => {
    if (aura) aura.style.opacity = '0';
  });

  const animateAura = () => {
    auraX += (pointerX - auraX) * 0.08;
    auraY += (pointerY - auraY) * 0.08;
    if (aura) aura.style.transform = `translate3d(${auraX - 260}px, ${auraY - 260}px, 0)`;
    requestAnimationFrame(animateAura);
  };
  animateAura();

  document.querySelectorAll('[data-magnetic]').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      element.style.transform = `translate3d(${x * 0.12}px, ${y * 0.16}px, 0)`;
    });
    element.addEventListener('pointerleave', () => {
      element.style.transform = 'translate3d(0,0,0)';
    });
  });

  document.querySelectorAll('[data-tilt]').forEach((element) => {
    const baseTransform = getComputedStyle(element).transform;
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      if (element.classList.contains('product-card')) {
        element.style.setProperty('--rx', `${-y * 3.4}deg`);
        element.style.setProperty('--ry', `${x * 4.2}deg`);
      } else if (element.classList.contains('device')) {
        const base = element.classList.contains('device-left')
          ? 'rotate(-12deg) translate(46px, 54px)'
          : element.classList.contains('device-right')
            ? 'rotate(12deg) translate(-46px, 54px)'
            : 'translateY(-8px)';
        element.style.transform = `${base} rotateX(${-y * 3}deg) rotateY(${x * 5}deg) translateZ(10px)`;
      }
    });

    element.addEventListener('pointerleave', () => {
      if (element.classList.contains('product-card')) {
        element.style.setProperty('--rx', '0deg');
        element.style.setProperty('--ry', '0deg');
      } else if (element.classList.contains('device-left')) {
        element.style.transform = 'rotate(-12deg) translate(46px, 54px)';
      } else if (element.classList.contains('device-right')) {
        element.style.transform = 'rotate(12deg) translate(-46px, 54px)';
      } else if (element.classList.contains('device-center')) {
        element.style.transform = 'translateY(-8px)';
      } else if (baseTransform && baseTransform !== 'none') {
        element.style.transform = baseTransform;
      }
    });
  });

  const hero = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero-content');
  const deviceStage = document.querySelector('.device-stage');
  if (hero && heroContent && deviceStage) {
    hero.addEventListener('pointermove', (event) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      heroContent.style.transform = `translate3d(${x * -7}px, ${y * -5}px, 0)`;
      deviceStage.style.translate = `${x * 11}px ${y * 8}px`;
    });
    hero.addEventListener('pointerleave', () => {
      heroContent.style.transform = 'translate3d(0,0,0)';
      deviceStage.style.translate = '0 0';
    });
  }
}
