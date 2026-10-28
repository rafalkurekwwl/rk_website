// script.js (clean — bez menu overlay i przycisków)

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('pageshow', (e) => {
  if (e.persisted) ScrollTrigger.refresh();
});

document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    initPreloader();
  } else {
    const pageWrapper = document.querySelector('.page-wrapper');
    if (pageWrapper) pageWrapper.classList.add('is-visible');
    initApp();
    initCookieBanner();
  }
  initPageTransitions();
});

function initPreloader() {
  const preloader = document.querySelector('.preloader');
  const pageWrapper = document.querySelector('.page-wrapper');
  const percentageElement = document.getElementById('percentage');
  const words = document.querySelectorAll('.preloader-words .word');
  const topLayer = document.querySelector('.preloader-layer--main');
  const bottomLayer = document.querySelector('.preloader-layer--purple');

  if (!preloader || !pageWrapper || !percentageElement || !topLayer || !bottomLayer) return;

  let currentWordIndex = 0;

  const changeWord = () => {
    if (words[currentWordIndex]) words[currentWordIndex].classList.remove('active');
    currentWordIndex = (currentWordIndex + 1) % words.length;
    if (words[currentWordIndex]) words[currentWordIndex].classList.add('active');
  };
  const wordInterval = setInterval(changeWord, 200);

  const counterObj = { value: 0 };
  
  gsap.to(counterObj, {
    value: 100,
    duration: 0.8,
    ease: "power1.out",
    onUpdate: () => {
      percentageElement.textContent = Math.floor(counterObj.value);
    },
    onComplete: () => {
      clearInterval(wordInterval);
      finishWithDualMask();
    }
  });

  function finishWithDualMask() {
    pageWrapper.classList.add('is-visible');

    const tl = gsap.timeline({
      onComplete: () => {
        preloader.style.display = 'none';
      }
    });

    tl.to(topLayer, {
      clipPath: 'inset(0% 0% 100% 0%)',
      duration: 0.9,
      ease: 'power4.inOut'
    })
    .to(bottomLayer, {
      clipPath: 'inset(0% 0% 100% 0%)',
      duration: 0.6,
      ease: 'power4.inOut',
      onStart: () => {
        try {
          if (typeof initApp === 'function') initApp();
          if (typeof initCookieBanner === 'function') initCookieBanner();
        } catch (error) {
          console.error("Błąd podczas inicjalizacji skryptów strony:", error);
        }
      }
    }, '-=0.3'); 
  }
}

let lenis;

function initApp() {
  stylizeSpecialCharacters();
  initLenisAndScrollbar();
  initScrollAnimations();
  initNavigation();
  initProjectHeroAnimation();
  initCustomCursor();
  initDynamicYear();
  initTextRevealAnimation();
  initNavRevealAnimation();
  initInfoBoxRevealAnimation();
  initLogoSwitcher();
  initLogoText();
  initAutoHideMainNav();
  initInteractiveElements();
  initHoverImages();
  initCustomCursors();
  initCookieBanner();
  initSpecialLinks();
  initInfoBoxAnimation();
  initPageTransition();
  initLinkTransitions();
  initImageRevealAnimation();
  initBackgroundColorChange();
  initHeroLogoMasking();
  initStaticMenuActiveState();
  // initMenuImageHover(); // USUNIĘTE (menu overlay)
  initServicesSection();
  initScrollingGallery();
  initDynamicHeader();

  if (typeof runHomepageAnimations === 'function' && document.getElementById('hero-section')) {
    runHomepageAnimations();
  }

  setTimeout(() => ScrollTrigger.refresh(), 100);
}

function stylizeSpecialCharacters() {
  const charsToStylize = ['t'];
  const elements = document.querySelectorAll('.js-stylize-letters');
  if (!elements.length) return;
  elements.forEach(el => {
    if (el.id === 'reveal-text') return; /* pomijamy — stylizacja po SplitType */
    el.innerHTML = el.innerHTML.replace(new RegExp(`(${charsToStylize.join('|')})`, 'g'), '<span class="stylized-char">$1</span>');
  });
}

function initScrollAnimations() {
  ScrollTrigger.matchMedia({
    "(min-width: 768px)": function () {
      const columns = gsap.utils.toArray('.column');
      if (columns.length) {
        const speedMultipliers = [0.74, 0.9, 1.4, 1.15, 0.8, 0.9];
        columns.forEach((column, index) => {
          gsap.to(column, {
            scaleY: 1, ease: "none",
            scrollTrigger: { trigger: ".page-wrapper", start: "top top", end: () => `+=${window.innerHeight * speedMultipliers[index]}`, scrub: true, invalidateOnRefresh: true }
          });
        });
      }
    },
    "(max-width: 767px)": function () {
      const columns = gsap.utils.toArray('.column');
      if (columns.length) {
        const speedMultipliers = [0.84, 0.84, 0.84, 0.93, 0.93, 0.93];
        columns.forEach((column, index) => {
          gsap.to(column, {
            scaleY: 1, ease: "none",
            scrollTrigger: { trigger: ".page-wrapper", start: "top top", end: () => `+=${window.innerHeight * speedMultipliers[index]}`, scrub: true, invalidateOnRefresh: true }
          });
        });
      }
    }
  });

  if (document.querySelector(".pin-container")) {
    ScrollTrigger.create({ trigger: ".pin-container", pin: ".text-wrapper", pinSpacing: false, start: "top top", end: "bottom bottom", scrub: true, invalidateOnRefresh: true });
  }

  if (document.querySelector(".parallax-bg")) {
    gsap.to(".parallax-bg", { yPercent: -30, ease: "none", scrollTrigger: { trigger: ".content", start: "top top", end: "bottom bottom", scrub: true } });
  }

  const isAboutPage = window.location.pathname.endsWith('omnie.html');
    let headingSelectors = [
    '.scroll-section:not(.hero-section) a',
    '.scroll-section:not(.hero-section) .monopo-link',
    '.liquid-button',
    '.pinned-main-text',
    '.pinned-subtitle',
    '.sticky-text h1',
    '.image-reveal-wrapper'
  ];
  if (!isAboutPage) headingSelectors.push('.scroll-section:not(.hero-section) p:not(.sticky-text-img p)');
  const headings = gsap.utils.toArray(headingSelectors.join(', '));
  headings.forEach(heading => {
    gsap.from(heading, { opacity: 1, y: 0, ease: "none", scrollTrigger: { trigger: heading, start: "top 97%", end: "top 65%", scrub: true } });
  });

  if (document.querySelector('.image-zoom-section')) {
    gsap.fromTo(".image-mask", { width: "33vw" }, { width: "66vw", ease: "none", scrollTrigger: { trigger: ".image-zoom-section", start: "top bottom", end: "center center", scrub: true } });
  }

  if (document.querySelector('#reveal-text')) {
    const revealTextInstance = new SplitType('#reveal-text', { types: 'words, chars' });

    /* Zapobiegaj łamaniu wyrazów */
    revealTextInstance.words.forEach(word => {
      word.style.whiteSpace = 'nowrap';
      word.style.display = 'inline-block';
    });

    /* Stylizuj litery 't' po SplitType — na gotowych .char spanach */
    revealTextInstance.chars.forEach(charEl => {
      if (charEl.textContent === 't') {
        charEl.classList.add('stylized-char');
      }
    });

    gsap.to(revealTextInstance.chars, { opacity: 1, ease: "none", stagger: 0.5, scrollTrigger: { trigger: '#reveal-text', start: 'top 70%', end: 'top 30%', scrub: true } });
  }
}

function initLenisAndScrollbar() {
  lenis = new Lenis();
  window.lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  const progressIndicator = document.querySelector('.scroll-progress-indicator');
  const percentageContainer = document.querySelector('.scroll-progress-percentage');
  const percentageValue = document.getElementById('scroll-percentage-value');
  const scrollbarContainer = document.querySelector('.custom-scrollbar');
  const scrollbarThumb = document.querySelector('.scrollbar-thumb');

  if (progressIndicator || percentageContainer || scrollbarContainer) {
    const startColor  = "#e6a9e1";
    const endColor    = "#7258a7";
    const colorInterp = gsap.utils.interpolate(startColor, endColor);

    const st = ScrollTrigger.create({
    trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 0.1,
    onUpdate: (self) => {
    const progress     = self.progress;
    const percent      = Math.round(progress * 100);
    const currentColor = colorInterp(progress);

    if (progressIndicator) gsap.set(progressIndicator, { scaleY: progress, backgroundColor: currentColor });
    if (percentageContainer && percentageValue) {
      const indicatorHeight = progress * window.innerHeight;
      gsap.set(percentageContainer, { y: indicatorHeight });
      percentageValue.textContent = percent;
      percentageContainer.classList.toggle('is-visible', percent >= 45);
    }
    if (scrollbarContainer && scrollbarThumb) {
      const thumbPosition = progress * (scrollbarContainer.clientHeight - scrollbarThumb.clientHeight);
      gsap.set(scrollbarThumb, { y: thumbPosition });
    }
    }
  });

    if (scrollbarContainer && scrollbarThumb) {
      let isDragging = false;
      scrollbarThumb.addEventListener('mousedown', () => {
        isDragging = true;
        document.body.classList.add('is-dragging');
        scrollbarContainer.classList.add('is-dragging');
      });
      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const trackTop = scrollbarContainer.getBoundingClientRect().top;
        const mouseOffsetY = e.clientY - trackTop;
        let progress = mouseOffsetY / scrollbarContainer.clientHeight;
        progress = Math.max(0, Math.min(1, progress));
        const y = st.start + (st.end - st.start) * progress;

        if (lenis) {
          lenis.scrollTo(y, { immediate: true });
        } else {
          window.scrollTo({ top: y, behavior: 'auto' });
        }
      });
      window.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          document.body.classList.remove('is-dragging');
          scrollbarContainer.classList.remove('is-dragging');
        }
      });
    }
  }

  const refreshTriggers = () => {
    requestAnimationFrame(() => { if (window.ScrollTrigger) ScrollTrigger.refresh(); });
  };
  window.addEventListener('load', refreshTriggers);
  window.addEventListener('resize', refreshTriggers);
}

function initNavigation() {
  const menuToggle = document.querySelector('.menu-toggle-btn');
  const menuOverlay = document.querySelector('.menu-overlay');
  const pageWrapper = document.querySelector('.page-wrapper');
  
  if (!menuToggle || !menuOverlay) return;

  let isOpen = false;

  const openMenu = () => {
    isOpen = true;
    menuToggle.classList.add('is-active');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuOverlay.classList.add('is-active');
    menuOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('overlay-open');
    
    gsap.to('.menu-overlay', {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      duration: 0.6,
      ease: 'power3.inOut'
    });
  };

  const closeMenu = () => {
    isOpen = false;
    menuToggle.classList.remove('is-active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('overlay-open');
    
    gsap.to('.menu-overlay', {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
      duration: 0.6,
      ease: 'power3.inOut',
      onComplete: () => {
        menuOverlay.classList.remove('is-active');
      }
    });
  };

  menuToggle.addEventListener('click', () => {
    isOpen ? closeMenu() : openMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });
}

function initMenuImageHover() {
  const menuImage = document.querySelector('.menu-media-wrapper img');
  const menuImageHover = document.querySelector('.menu-image-hover');
  const menuLinks = document.querySelectorAll('.menu-col-main nav a');
  
  if (!menuImage || !menuLinks.length) return;

  menuLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const hoverImg = link.dataset.menuImage;
      if (hoverImg && menuImageHover) {
        menuImageHover.src = hoverImg;
        menuImageHover.style.opacity = '1';
      }
    });
    
    link.addEventListener('mouseleave', () => {
      if (menuImageHover) {
        menuImageHover.style.opacity = '0';
      }
    });
  });
}

function initCustomCursor() {
  const cursorEl = document.querySelector('.custom-cursor');
  if (!cursorEl) return;
  const interactiveElements = document.querySelectorAll('a, button, .modern-cta, .cookie-accept-button, .scrollbar-thumb, input[type="submit"], .showreel-trigger');
  let isPermanentlyDisabled = false;

  const disablePermanently = () => {
    if (isPermanentlyDisabled) return;
    isPermanentlyDisabled = true;
    gsap.to(cursorEl, { opacity: 0, scale: 0, duration: 0.3, ease: 'power3.in' });
    document.body.classList.remove('custom-cursor-active');
    window.removeEventListener('scroll', disablePermanently);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mousemove', onFirstMove);
    interactiveElements.forEach(el => el.removeEventListener('mouseenter', disablePermanently));
  };

  const onMouseMove = (e) => gsap.set(cursorEl, { x: e.clientX, y: e.clientY });
  const onFirstMove = (e) => {
    gsap.set(cursorEl, { x: e.clientX, y: e.clientY });
    gsap.to(cursorEl, { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' });
    document.body.classList.add('custom-cursor-active');
    window.removeEventListener('mousemove', onFirstMove);
    window.addEventListener('mousemove', onMouseMove);
  };

  window.addEventListener('mousemove', onFirstMove);
  window.addEventListener('scroll', disablePermanently, { once: true });
  interactiveElements.forEach(el => el.addEventListener('mouseenter', disablePermanently));

  const darkSections = document.querySelectorAll('.section-dark-bg');
  darkSections.forEach(section => {
    ScrollTrigger.create({
      trigger: section, start: "top 70%", end: "bottom 70%",
      onToggle: self => {
        if (self.isActive && !isPermanentlyDisabled) cursorEl.classList.add('is-inverted');
        else cursorEl.classList.remove('is-inverted');
      }
    });
  });
}

function initLogoSwitcher() {
  const logoContainers = document.querySelectorAll(".logo-mask-container");
  if (!logoContainers.length) return;

  const blackLogoWrapper = logoContainers[0]?.querySelector('.logo-inner-wrapper') || null;
  const whiteLogoWrapper = logoContainers[1]?.querySelector('.logo-inner-wrapper') || null;

  const blackLogoImages = {
    full: blackLogoWrapper?.querySelector('.logo-full') || null,
    short: blackLogoWrapper?.querySelector('.logo-short') || null,
  };
  const whiteLogoImages = {
    full: whiteLogoWrapper?.querySelector('.logo-full') || null,
    short: whiteLogoWrapper?.querySelector('.logo-short') || null,
  };

  if (!blackLogoWrapper || !whiteLogoWrapper) return;

  const logoHeight = logoContainers[0].offsetHeight;
  const svgPaths = {
    full: { light: "svg/logo-full-white.svg", dark: "svg/logo-full-black.svg" },
    short: { light: "svg/logo-short-white.svg", dark: "svg/logo-short-black.svg" }
  };

  if (window.scrollY < 50) {
      gsap.to([blackLogoWrapper, whiteLogoWrapper], { y: 0, duration: 2, ease: "power2.Out", delay: -1 });
  } else {
      gsap.set([blackLogoWrapper, whiteLogoWrapper], { y: 0 });
  }

  const switchLogoAnimation = gsap.timeline({ paused: true, defaults: { duration: 0.6, ease: "power2.inOut" } })
    .fromTo([blackLogoWrapper, whiteLogoWrapper], 
        { y: 0 }, 
        { y: -logoHeight }
    );

  let currentGlobalTheme = "dark";

  function updateAllLogoSources(theme) {
    if (blackLogoImages.full)  blackLogoImages.full.src  = (theme === "dark") ? svgPaths.full.dark : svgPaths.full.light;
    if (blackLogoImages.short) blackLogoImages.short.src = (theme === "dark") ? svgPaths.short.dark : svgPaths.short.light;

    if (whiteLogoImages.full)  whiteLogoImages.full.src  = svgPaths.full.light;
    if (whiteLogoImages.short) whiteLogoImages.short.src = svgPaths.short.light;
  }

  const logoSections = gsap.utils.toArray(".js-color-section, [data-logo-theme]");
  if (logoSections.length) {
    const firstSection = logoSections[0];
    currentGlobalTheme = firstSection.dataset.logoTheme || (firstSection.classList.contains('section-dark-bg') ? 'light' : 'dark');
  }
  updateAllLogoSources(currentGlobalTheme);

  ScrollTrigger.create({
    trigger: document.body,
    start: "top top-=" + (window.innerHeight * 0.01),
    end: "top top-=" + (window.innerHeight * 0.005),
    onEnter: () => switchLogoAnimation.play(),
    onLeaveBack: () => switchLogoAnimation.reverse()
  });

  logoSections.forEach((section) => {
    ScrollTrigger.create({
      trigger: section, start: "top top+=45px", end: "bottom top+=45px",
      onToggle: (self) => {
        if (self.isActive) {
          const theme = section.dataset.logoTheme || (section.classList.contains('section-dark-bg') ? 'light' : 'dark');
          if (theme !== currentGlobalTheme) {
            currentGlobalTheme = theme;
            updateAllLogoSources(currentGlobalTheme);
          }
        }
      }
    });
  });
}

function initLogoText() {
  const descriptor = document.querySelector('.logo-descriptor');
  if (!descriptor) return;
  const split = new SplitType(descriptor, { types: 'chars' });
  gsap.to(split.chars, {
    opacity: 0,
    stagger: { each: 0.05, from: "random" },
    scrollTrigger: { trigger: "body", start: "top top", end: `+=${window.innerHeight / 2}`, scrub: 1 }
  });
}

function initAutoHideMainNav() {
  const header = document.querySelector('.main-header');
  if (!header) return;

  const getY = () =>
    (window.lenis && typeof window.lenis.scroll === 'number')
      ? window.lenis.scroll
      : window.pageYOffset || window.scrollY || 0;

  const TOP_CLAMP = 10; 
  const DELTA = 5;
  const BOTTOM_THRESHOLD = 50;

  let lastY = getY();
  let ticking = false;

  const update = () => {
    const currentY = getY();
    const dy = currentY - lastY;

    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const isAtBottom = (currentY + windowHeight) >= (documentHeight - BOTTOM_THRESHOLD);

    if (currentY <= TOP_CLAMP) {
      header.classList.remove('is-hidden');
    } 
    else if (isAtBottom) {
      header.classList.remove('is-hidden');
    } 
    else if (Math.abs(dy) < DELTA) {
      ticking = false;
      return;
    } 
    else if (dy > 0) {
      header.classList.add('is-hidden');
    } 
    else {
      header.classList.remove('is-hidden');
    }

    lastY = currentY;
    ticking = false;
  };

  const requestTick = () => {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  };

  if (window.lenis && typeof window.lenis.on === 'function') {
    window.lenis.on('scroll', requestTick);
  } else {
    window.addEventListener('scroll', requestTick, { passive: true });
  }

  update();
}


function initInteractiveElements() {
  const magneticItems = document.querySelectorAll('.magnetic-item');
  magneticItems.forEach(item => {
    let boundingRect = item.getBoundingClientRect();
    window.addEventListener('resize', () => { boundingRect = item.getBoundingClientRect(); });
    item.addEventListener('mousemove', function (event) {
      const mousePosX = event.clientX - boundingRect.left;
      const mousePosY = event.clientY - boundingRect.top;
      gsap.to(this, { x: (mousePosX - boundingRect.width / 2) * 0.4, y: (mousePosY - boundingRect.height / 2) * 0.4, duration: 0.1, ease: 'power3.out' });
    });
    item.addEventListener('mouseleave', function () {
      gsap.to(this, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' });
    });
  });
}

function initCustomCursors() {
  const portfolioCursor = document.querySelector('.portfolio-cursor');
  const smileCursor = document.querySelector('.logo-hover-cursor');
  const allCursors = [portfolioCursor, smileCursor].filter(c => c);
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const logoFooters = document.querySelectorAll('.logo-footer, .logo-footer-two'); 
  if (!allCursors.length) return;

  window.addEventListener('mousemove', (e) => {
    gsap.to(allCursors, { x: e.clientX, y: e.clientY, duration: 0.2, ease: 'power2.out' });
  });

  const showCursor = (el) => gsap.to(el, { opacity: 1, scale: 1, duration: 0.1, ease: 'power3.out', overwrite: true });
  const hideCursors = () => gsap.to(allCursors, { opacity: 0, scale: 0.7, duration: 0.2, ease: 'power3.in', overwrite: true });

  portfolioItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      hideCursors();
      const color = item.dataset.color || '#000000';
      gsap.set(portfolioCursor, { backgroundColor: color });
      showCursor(portfolioCursor);
    });
    item.addEventListener('mouseleave', hideCursors);
  });

  logoFooters.forEach(logo => {
    logo.addEventListener('mouseenter', () => { 
        hideCursors(); 
        if (smileCursor) showCursor(smileCursor); 
    });
    logo.addEventListener('mouseleave', hideCursors);
  });
}

function initSpecialLinks() {
    const scrollLinks = document.querySelectorAll('.js-scroll-to');
    
    if (scrollLinks.length && typeof lenis !== 'undefined') {
        scrollLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSelector = link.getAttribute('href');
                
                if (!targetSelector || targetSelector === '#') {
                    lenis.scrollTo(0, { duration: 2 });
                    return;
                }
                
                lenis.scrollTo(targetSelector, {
                    duration: 2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
            });
        });
    }
}

function initCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  const acceptBtn = document.getElementById('cookieAcceptBtn');
  if (!banner || !acceptBtn || localStorage.getItem('cookiesAccepted') === 'true') return;

  setTimeout(() => { banner.classList.add('is-visible'); }, 1200);
  acceptBtn.addEventListener('click', (e) => {
    e.preventDefault();
    banner.classList.remove('is-visible');
    localStorage.setItem('cookiesAccepted', 'true');
  });
}

function initHoverImages() {
  const hoverTriggers = gsap.utils.toArray('.has-hover-image');
  if (!hoverTriggers.length) return;

  const hoverContainer = document.createElement('div');
  hoverContainer.className = 'hover-reveal';
  hoverContainer.innerHTML = `<div class="hover-reveal__inner"><div class="hover-reveal__img"></div></div>`;
  document.body.appendChild(hoverContainer);

  const revealInner = hoverContainer.querySelector('.hover-reveal__inner');
  const revealImg = hoverContainer.querySelector('.hover-reveal__img');

  gsap.set(hoverContainer, { top: "-100%", left: "-100%" });

  window.addEventListener('mousemove', (e) => {
    gsap.to(hoverContainer, { top: e.clientY - (hoverContainer.clientHeight / 2), left: e.clientX - (hoverContainer.clientWidth / 2), duration: 0.5, ease: "power3.out" });
  });

  hoverTriggers.forEach(trigger => {
    let revealTimeline;
    trigger.addEventListener('mouseenter', () => {
      gsap.set(revealImg, { backgroundImage: `url(${trigger.dataset.img})` });
      if (revealTimeline) revealTimeline.kill();
      gsap.set(hoverContainer, { opacity: 1 });
      revealTimeline = gsap.timeline()
        .fromTo(revealInner, { xPercent: -100, autoAlpha: 1 }, { xPercent: 0, duration: 0.3, ease: "power2.out" })
        .fromTo(revealImg, { xPercent: 100 }, { xPercent: 0, duration: 0.3, ease: "power2.out" }, "<");
    });
    trigger.addEventListener('mouseleave', () => {
      if (revealTimeline) revealTimeline.kill();
      revealTimeline = gsap.timeline({ onComplete: () => gsap.set(hoverContainer, { opacity: 0 }) })
        .to(revealInner, { xPercent: 100, duration: 0.3, ease: "power2.in" })
        .to(revealImg, { xPercent: -100, duration: 0.3, ease: "power2.in" }, "<");
    });
  });
}

function initDynamicYear() {
  const rokPoczatkowy = 2006;
  const idElementu = 'liczba-lat';
  const aktualnyRok = new Date().getFullYear();
  const obliczonaWartosc = aktualnyRok - rokPoczatkowy;
  const elementDocelowy = document.getElementById(idElementu);
  if (elementDocelowy) elementDocelowy.textContent = obliczonaWartosc;
}

function initProjectHeroAnimation() {
  const projectTitle = document.querySelector('.project-title');
  if (projectTitle) {
    gsap.set(projectTitle, { opacity: 1 });
    const split = new SplitType(projectTitle, { types: 'lines, words' });
    gsap.fromTo(split.words, { y: "100%", opacity: 0 }, {
      y: "0%", opacity: 1, duration: 1, ease: "power3.out", stagger: 0.12,
      scrollTrigger: { trigger: projectTitle, start: "top 80%", toggleActions: "play none none none", once: true }
    });

    const track = document.querySelector(".animated-background-track");
    if (track) {
      const trackWidth = track.scrollWidth / 2;
      gsap.set(track, { x: 0 });
      gsap.to(track, { opacity: 1, delay: 0.8, duration: 1 });
      gsap.to(track, {
        x: -trackWidth, duration: 70, ease: "none", repeat: -1,
        modifiers: { x: gsap.utils.unitize(gsap.utils.wrap(-trackWidth, 0)) }
      });
    }
  }

  const zoomSection = document.querySelector('.zoom-section-wrapper');
  const zoomImageMask = document.querySelector('.hero-image-reveal-mask');
  const zoomImage = zoomImageMask ? zoomImageMask.querySelector('.zoom-image') : null;
  if (!zoomSection || !zoomImageMask || !zoomImage) return;

  const revealTimeline = gsap.timeline({ scrollTrigger: { trigger: zoomImageMask, start: "top 85%", toggleActions: "play none none none" } });
  revealTimeline
    .to(zoomImageMask, { clipPath: "inset(0% 0 0% 0)", duration: 1.5, ease: "power2.out" })
    .to(zoomImage, { scale: 1, duration: 1.5, ease: "power2.out" }, "<");

  gsap.to(zoomImageMask, { width: "100vw", height: "100vh", ease: "none", overwrite: "auto",
    scrollTrigger: { trigger: zoomSection, start: "top top", end: "center center", scrub: 1 } });
}

function initLogoSvgMask() {
  const maskHole = document.getElementById('mask-hole');
  const zoomContainer = document.querySelector('.zoom-pin-container');
  if (!maskHole || !zoomContainer) return;
  gsap.ticker.add(() => {
    const rect = zoomContainer.getBoundingClientRect();
    gsap.set(maskHole, { attr: { x: rect.left, y: rect.top, width: rect.width, height: rect.height } });
  });
}

function initInfoBoxAnimation() {
  const infoBox = document.querySelector('.project-info-box');
  const triggerSection = document.querySelector('.zoom-section-wrapper');
  if (!infoBox || !triggerSection) return;

  gsap.to(infoBox, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.8 });
  gsap.to(infoBox, { opacity: 0, y: -40, ease: "none",
    scrollTrigger: { trigger: triggerSection, start: "top top+=200px", end: "center center+=200px", scrub: 1 } });
}

function initImageRevealAnimation() {
  const revealBackgrounds = gsap.utils.toArray('.image-reveal-background');
  if (!revealBackgrounds.length) return;
  revealBackgrounds.forEach(background => {
    const mask = background.querySelector('.image-reveal-mask');
    const image = mask.querySelector('img');
    gsap.set(background, { autoAlpha: 1, y: 40 });
    gsap.set(image, { visibility: "visible", scale: 1.2 });
    gsap.set(mask, { clipPath: "inset(100% 0 0 0)" });
    const tl = gsap.timeline({ scrollTrigger: { trigger: background, start: "top 75%", toggleActions: "play none none none" } });
    tl.to(mask, { clipPath: "inset(0% 0 0% 0)", duration: 0.7, ease: "power2.in" });
    tl.to(image, { scale: 1, duration: 0.9, ease: "power2.in" }, "<");
    tl.to(background, { y: 0, duration: 0.7, ease: "power2.in" }, "<");
  });
}

function initPageTransition() {
  const trigger = document.querySelector('.page-end-trigger');
  const loader = document.querySelector('.next-project-loader');
  const progressBar = loader ? loader.querySelector('.loader-bar-progress') : null;
  const overlay = document.querySelector('.page-transition-overlay');
  
  if (!trigger || !loader || !progressBar || !overlay) return;

  const nextPageUrl = trigger.dataset.nextPage;
  let transitionTimeline, progressAnimation;

  ScrollTrigger.create({
    trigger: trigger, 
    start: "top bottom",
    onEnter: () => {
      loader.classList.add('is-visible');
      
      // Pobieramy kolor z triggera lub ustawiamy domyślny
      const transitionColor = trigger.dataset.transitionColor || '#c1c1c1';
      
      // Upewniamy się, że overlay startuje z pozycji zdefiniowanej w Twoim CSS (top: 100%)
      gsap.set(overlay, { 
        backgroundColor: transitionColor, 
        top: '100%',
        pointerEvents: 'auto' // Blokujemy kliknięcia podczas trwania animacji
      });

      // Odliczanie 2 sekund paska progresu
      transitionTimeline = gsap.delayedCall(2, () => {
        if (window.lenis) window.lenis.stop();
        
        const tl = gsap.timeline({ 
          onComplete: () => { 
            setTimeout(() => { window.location.href = nextPageUrl; }, 100); 
          } 
        });
        
        // Animujemy 'top' do 0 – dokładnie tak samo jak w Twojej funkcji dla kliknięć (links)
        tl.to(overlay, { 
          top: 0, 
          duration: 0.7, // dopasowałem czas (0.7s) do Twojej drugiej funkcji
          ease: "power3.inOut" 
        }, 0);
        
        // Opcjonalnie: lekkie przesunięcie obecnej strony do góry dla lepszego efektu głębi
        tl.to('.page-wrapper', { 
          y: "-15vh", 
          opacity: 0.3, 
          duration: 0.7, 
          ease: "power3.inOut" 
        }, 0);
      });

      // Uruchomienie paska ładowania na 2 sekundy
      progressAnimation = gsap.to(progressBar, { scaleX: 1, duration: 2, ease: "linear" });
    },
    onLeaveBack: () => {
      // Jeśli użytkownik cofnie scroll przed końcem ładowania
      loader.classList.remove('is-visible');
      if (transitionTimeline) transitionTimeline.kill();
      if (progressAnimation) {
        progressAnimation.kill();
        gsap.to(progressBar, { scaleX: 0, duration: 0.3, ease: "power2.out" });
      }
      // Chowamy overlay z powrotem na top: 100% i przywracamy domyślne pointer-events
      gsap.to(overlay, { 
        top: '100%', 
        duration: 0.3, 
        ease: "power2.out",
        onComplete: () => { gsap.set(overlay, { pointerEvents: 'none' }); }
      });
    }
  });
}

function initLinkTransitions() {
  const transitionLinks = document.querySelectorAll('.js-transition-link');
  const curtain = document.querySelector('.link-transition-curtain');
  if (!transitionLinks.length || !curtain) return;

  const curtainColumns = curtain.querySelectorAll('.link-curtain-column');
  const columnDelays = [0.2, 0.15, 0.13, 0.12, 0.2, 0.26];

  transitionLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const destinationUrl = link.href;
      const destinationBg = link.dataset.bg || '#FFFFFF';
      gsap.set(curtainColumns, { backgroundColor: destinationBg });

      if (window.lenis) window.lenis.stop();

      const tl = gsap.timeline({ onComplete: () => { window.location.href = destinationUrl; } });
      tl.to('.page-wrapper', { y: "70vh", opacity: 0.7, duration: 1, ease: "power2.in" });
      curtainColumns.forEach((column, index) => {
        tl.to(column, { scaleY: 1, duration: 0.6, ease: "power2.in", delay: columnDelays[index] }, 0);
      });
    });
  });
}

function initTextRevealAnimation() {
  const textElements = gsap.utils.toArray('.js-reveal-text');
  if (textElements.length) {
    gsap.to(textElements, { opacity: 1, y: 0, duration: 1.4, ease: "power2.out", stagger: 0.2, delay: 0.2 });
  }
}

function initNavRevealAnimation() {
  const navItems = gsap.utils.toArray('.js-reveal-nav-item');
  if (navItems.length) {
    gsap.to(navItems, { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.1, delay: 0.5, clearProps: "opacity" });
  }
}

function initInfoBoxRevealAnimation() {
  const infoBox = document.querySelector('.js-reveal-box');
  if (infoBox) gsap.to(infoBox, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.4 });
}

function initBackgroundColorChange() {
  const colorSections = gsap.utils.toArray('.js-color-section');
  const body = document.body;
  if (!colorSections.length) return;

  colorSections.forEach((section, index) => {
    const bgColor = section.dataset.bgColor;
    const fontColor = section.dataset.fontColor;
    const duration = (index === 0) ? 0 : 0.3;

    ScrollTrigger.create({
      trigger: section, start: "top 50%", end: "bottom 50%",
      onEnter: () => gsap.to(body, { backgroundColor: bgColor, color: fontColor, duration, overwrite: "auto" }),
      onEnterBack: () => gsap.to(body, { backgroundColor: bgColor, color: fontColor, duration, overwrite: "auto" }),
    });
  });
}

function initHeroLogoMasking() {
  const imageMask = document.querySelector(".hero-image-reveal-mask");
  const logoWhite = document.querySelector('.logo-white-version');
  if (!imageMask || !logoWhite) return;

  function updateLogoMask() {
    const logoRect = logoWhite.getBoundingClientRect();
    if (logoRect.bottom < 0 || logoRect.top > window.innerHeight) return;
    const imageRect = imageMask.getBoundingClientRect();
    const top = Math.max(0, imageRect.top - logoRect.top);
    const left = Math.max(0, imageRect.left - logoRect.left);
    const bottom = Math.max(0, logoRect.bottom - imageRect.bottom);
    const right = Math.max(0, logoRect.right - imageRect.right);
    gsap.set(logoWhite, { clipPath: `inset(${top}px ${right}px ${bottom}px ${left}px)` });
  }
  gsap.ticker.add(updateLogoMask);
}

function initStaticMenuActiveState() {
  const currentPagePath = window.location.pathname;
  const allMenuLinks = document.querySelectorAll('.main-header nav a');
  allMenuLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (currentPagePath.endsWith(linkHref)) link.classList.add('is-active-page');
  });
  if ((currentPagePath === '/' || currentPagePath.endsWith('/index.html'))) {
    document.querySelectorAll('a[href="index.html"]').forEach(link => link.classList.add('is-active-page'));
  }
}

function initServicesSection() {
    const mainWrapper = document.getElementById('accordion-main');
    if (!mainWrapper) return;

    const tagsData = {
        investors: [
            { text: 'Reports 2023' },
            { text: 'Stock Info' },
            { text: 'Dividends' },
            { text: 'Strategy' }
        ],
        sustainability: [
            { text: 'Zero Waste' },
            { text: 'Eco Materials' },
            { text: 'Green Energy' },
            { text: 'Recycling' },
            { text: 'Carbon Neutral' }
        ],
        news: [
            { text: 'Press Release' },
            { text: 'Awards' },
            { text: 'Events' },
            { text: 'New Office' }
        ]
    };

    const Engine = Matter.Engine,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite,
          Body = Matter.Body;

    const engine = Engine.create();
    const baseGravity = 0.8;
    engine.world.gravity.y = baseGravity; 
    
    const runner = Runner.create();
    Runner.run(runner, engine);

    const activeTags = [];
    const canvasContainer = document.getElementById('physics-canvas');

    function updatePhysicsDOM() {
        for (let i = activeTags.length - 1; i >= 0; i--) {
            const item = activeTags[i];
            const body = item.body;
            const element = item.element;
            
            if (!element.parentNode) {
                Composite.remove(engine.world, body);
                activeTags.splice(i, 1);
                continue;
            }

            const x = body.position.x - element.offsetWidth / 2;
            const y = body.position.y - element.offsetHeight / 2;
            const angle = body.angle;

            element.style.transform = `translate(${x}px, ${y}px) rotate(${angle}rad)`;

            if (y > window.innerHeight + 200) {
                Composite.remove(engine.world, body);
                element.remove();
                activeTags.splice(i, 1);
            }
        }
        requestAnimationFrame(updatePhysicsDOM);
    }
    updatePhysicsDOM();

    const accordionHeaders = document.querySelectorAll('.accordion-header');
    let currentActiveItem = null; 

    accordionHeaders.forEach(header => {
        header.addEventListener('click', (e) => {
            const parentItem = header.closest('.accordion-item');
            const content = parentItem.querySelector('.accordion-content');
            const contentInner = parentItem.querySelector('.accordion-content-inner');
            const icon = parentItem.querySelector('.icon-plus');
            
            if (gsap.isTweening(content)) return; 

            const category = parentItem.dataset.category;
            const tags = tagsData[category] || [];

            if (currentActiveItem === parentItem) {
                closeItem(parentItem);
                mainWrapper.classList.remove('has-active');
                currentActiveItem = null;
            } 
            else {
                if (currentActiveItem) {
                    closeItem(currentActiveItem);
                }

                gsap.to(content, { height: "auto", duration: 0.5, ease: "power3.inOut" });
                gsap.to(contentInner, { opacity: 1, duration: 0.5, delay: 0.2 });
                gsap.to(icon, { rotation: 45, duration: 0.5, ease: "power3.inOut" }); 

                parentItem.classList.add('is-active');
                mainWrapper.classList.add('has-active');
                currentActiveItem = parentItem;

                tags.forEach((tag, index) => {
                    setTimeout(() => {
                        createTag(tag.text); 
                    }, index * 80); 
                });
            }
        });
    });

    function closeItem(item) {
        const content = item.querySelector('.accordion-content');
        const contentInner = item.querySelector('.accordion-content-inner');
        const icon = item.querySelector('.icon-plus');
        
        gsap.to(content, { height: 0, duration: 0.6, ease: "power3.inOut" });
        gsap.to(contentInner, { opacity: 0, duration: 0.4 });
        gsap.to(icon, { rotation: 0, duration: 0.6, ease: "power3.inOut" });
        
        item.classList.remove('is-active');
    }

    function createTag(text) {
        if (!canvasContainer) return;

        const el = document.createElement('div');
        el.classList.add('tag');
        el.textContent = text; 
        
        const tagColors = ['#fff', '#fff']; 
        const randomColor = tagColors[Math.floor(Math.random() * tagColors.length)];
        el.style.backgroundColor = randomColor;
        
        canvasContainer.appendChild(el);

        const width = el.offsetWidth;
        const height = el.offsetHeight;
        const startY = -100; 
        
        const leftSideX = window.innerWidth * 0.25; 
        const randomX = leftSideX + (Math.random() * 200 - 100);

        const randomFrictionAir = Math.random() * 0.05 + 0.05;
        const randomRestitution = Math.random() * 0.4 + 0.5;
        const randomDensity = Math.random() * 0.035 + 0.03;

        const body = Bodies.rectangle(randomX, startY, width, height, {
            chamfer: { radius: height / 2 },
            restitution: randomRestitution,
            frictionAir: randomFrictionAir,
            density: randomDensity,
        });

        Body.setVelocity(body, { 
            x: (Math.random() - 0.5) * 2,
            y: Math.random() * 6 + 2
        });

        Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.3);

        Composite.add(engine.world, body);
        activeTags.push({ body: body, element: el });
    }

    if (window.lenis) {
        window.lenis.on('scroll', ({ velocity }) => {
            if (velocity < -2) {
                const boost = Math.abs(velocity) * 0.2;
                engine.world.gravity.y = baseGravity + boost;
            } else {
                engine.world.gravity.y = baseGravity;
            }
        });
    }
}

function initScrollingGallery() {

}

function initDynamicHeader() {
  const textEl = document.querySelector('.logo-descriptor');
  const sections = document.querySelectorAll('[data-header-text]');

  if (!textEl || !sections.length) return;

  if (window.scrollY < 50) {
      const firstText = sections[0].dataset.headerText;
      textEl.textContent = firstText;
      gsap.fromTo(textEl, 
          { y: '100%' }, 
          { y: '0%', duration: 0.8, delay: 0.2, ease: 'power3.out', overwrite: true }
      );
  }

  sections.forEach((section, index) => {
    const textContent = section.dataset.headerText;

    ScrollTrigger.create({
      trigger: section,
      start: "top top",   
      end: "+=140",       
      
      onEnter: () => {
          if (textEl.textContent === textContent && gsap.getProperty(textEl, "y") === 0) return;
          if (textEl.textContent !== textContent) textEl.textContent = textContent;
          gsap.fromTo(textEl, 
              { y: '100%' }, 
              { y: '0%', duration: 0.4, ease: 'power3.out', overwrite: true }
          );
      },

      onLeave: () => {
          gsap.to(textEl, { 
              y: '-120%', 
              duration: 0.7, 
              ease: 'power3.in', 
              overwrite: true 
          });
      },

      onEnterBack: () => {
          if (textEl.textContent !== textContent) textEl.textContent = textContent;
          gsap.fromTo(textEl, 
              { y: '-120%' }, 
              { y: '0%', duration: 0.7, ease: 'power3.out', overwrite: true }
          );
      },

      onLeaveBack: () => {
          if (index === 0) return;

          gsap.to(textEl, { 
              y: '100%', 
              duration: 0.4, 
              ease: 'power3.in', 
              overwrite: true 
          });
      }
    });
  });
}

function initPageTransitions() {
    const overlay = document.querySelector('.page-transition-overlay');
    const links = document.querySelectorAll('a');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            if (!href || 
                href.startsWith('#') || 
                href.startsWith('mailto:') || 
                href.startsWith('tel:') || 
                link.target === '_blank' ||
                e.ctrlKey || e.shiftKey || e.metaKey) {
                return;
            }

            e.preventDefault();

            const isContact = href.includes('kontakt');
            const targetColor = isContact ? getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim() : '#c1c1c1';
            
            gsap.set(overlay, { backgroundColor: targetColor, top: '100%' });

            gsap.to(overlay, {
                top: 0,
                duration: 0.7,
                ease: "power3.inOut",
                onComplete: () => {
                    window.location.href = href;
                }
            });
        });
    });
}