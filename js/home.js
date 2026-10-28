// plik: home.js
 
function debounce(fn, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}
 
function runHomepageAnimations() {
  initMarquee();
  runHeroIntroSequence();
  initTriggerSlideshow();
  initVideoHoverEffect();
  initHeroScrollZoom();
  initTriggerVisibility();
  initLargePortfolioItems();
  initGalleryEntranceAnimations();
 
  const debouncedRefresh = debounce(() => {
    ScrollTrigger.refresh();
  }, 120);
  window.addEventListener('resize', debouncedRefresh);
  document.fonts?.ready?.then(debouncedRefresh);
}
 
/* =========================
   TRIGGER SLIDESHOW (Zmiana obrazków)
   ========================= */
function initTriggerSlideshow() {
    const trigger = document.querySelector('.showreel-trigger');
    const images = document.querySelectorAll('.trigger-img');
    
    if (!trigger || images.length === 0) return;
 
    let interval;
    let currentIndex = 0;
 
    const nextSlide = () => {
        images[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add('active');
    };
 
    const startSlideshow = () => {
        clearInterval(interval);
        interval = setInterval(nextSlide, 200); 
    };
 
    const stopSlideshow = () => {
        clearInterval(interval);
    };
 
    startSlideshow();
 
    trigger.addEventListener('mouseenter', stopSlideshow);
    
    trigger.addEventListener('mouseleave', () => {
        if (!document.body.classList.contains('is-video-playing')) {
            startSlideshow();
        }
    });
 
    trigger.addEventListener('click', stopSlideshow);
 
    window.addEventListener('videoClosed', () => {
        if (!trigger.matches(':hover')) {
            startSlideshow();
        }
    });
}
 
/* =========================
   CHOWANIE TRIGGERA PO SCROLLU
   ========================= */
function initTriggerVisibility() {
    const trigger = document.querySelector('.showreel-trigger');
    if (!trigger) return;
 
    ScrollTrigger.create({
        trigger: "body",
        start: "top top",       
        end: "50px top",        
        onLeave: () => {
            gsap.to(trigger, { autoAlpha: 0, duration: 0.3, ease: "power2.out" });
        },
        onEnterBack: () => {
             gsap.to(trigger, { autoAlpha: 1, duration: 0.3, ease: "power2.out" });
        }
    });
}
 
/* =========================
   HOVER + CLICK + LIGHTBOX (KURTYNA) + CLIP PATH TRIGGERA
   ========================= */
function initVideoHoverEffect() {
  const group = document.querySelector('.hero-center-group');
  const videoContainer = document.querySelector('.showreel-container');
  const coverImage = document.querySelector('.showreel-cover-image');
  const videoElement = document.querySelector('.showreel-image');
  const trigger = document.querySelector('.showreel-trigger');
  const curtain = document.querySelector('.video-focus-curtain');
 
  if (!group || !videoContainer || !coverImage || !trigger || !videoElement) return;
 
  // --- SETUP ---
  group.style.pointerEvents = 'none'; 
  let isLocked = false;
  let isMouseOver = false;
  
  gsap.set(trigger, { clipPath: 'inset(0% 0% 0% 0%)' });
  const isMobile = window.matchMedia('(max-width: 1439px)').matches;

  if (isMobile) {
    gsap.set(videoContainer, {
      transformOrigin: '0% 0%',
      xPercent: 0,
      yPercent: 0,
      left: '0%',
      top: '0%',
      position: 'relative'
    });
  } else {
    gsap.set(videoContainer, {
      transformOrigin: '50% 50%',
      xPercent: -50,
      yPercent: -50,
      left: '50%',
      top: '50%',
      position: 'absolute'
    });
  }
 
  const hoverTl = gsap.timeline({
    paused: true,
    defaults: { duration: 0.35, ease: 'power2.inOut' }
  });
 
  const targetWidth = window.innerWidth * 0.44;
  const targetHeight = targetWidth * 9 / 16;
 
  hoverTl
    .to(videoContainer, { width: targetWidth, height: targetHeight }, 0)
    .to(coverImage, { opacity: 0 }, 0);
 
 
  // --- FUNKCJE STERUJĄCE (Hover) ---
 
  const enablePreview = () => {
      document.body.classList.add('is-showreel-active'); 
      hoverTl.play();
  };
 
  const disablePreview = () => {
      hoverTl.reverse();
      hoverTl.eventCallback("onReverseComplete", () => {
          if (!isLocked && !isMouseOver) {
              document.body.classList.remove('is-showreel-active');
              gsap.set(videoContainer, { clearProps: "width,height" });
          }
          hoverTl.eventCallback("onReverseComplete", null);
      });
  };
 
 
  const startVideoMode = () => {
    isLocked = true;
    
    document.body.classList.add('is-showreel-active'); 
    document.body.classList.add('is-video-playing');
    
    // Wideo na wierzch
    gsap.set(group, { zIndex: 1600 }); 
    
    if (window.lenis) window.lenis.stop();
 
    videoElement.muted = false;
    videoElement.loop = false;
    videoElement.currentTime = 0;
    videoElement.play();
    
    hoverTl.play(); 
 
    gsap.to(trigger, {
        clipPath: 'inset(100% 0% 0% 0%)',
        duration: 0.6,
        ease: 'expo.inOut'
    });
 
    if (curtain) {
      gsap.fromTo(curtain, 
        { y: '-100%' }, 
        { y: '0%', duration: 0.8, ease: 'expo.inOut' }
      );
    }
  };
 
  const stopVideoMode = () => {
    isLocked = false;
    
    videoElement.muted = true;
    videoElement.loop = true;
    videoElement.play();
 
    gsap.to(trigger, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.6,
        ease: 'expo.inOut',
        delay: 0.2
    });
 
    if (curtain) {
      gsap.to(curtain, { 
        y: '100%', 
        duration: 0.8, 
        ease: 'expo.inOut',
        onComplete: () => {
            document.body.classList.remove('is-video-playing');
            gsap.set(group, { clearProps: 'zIndex' });
            gsap.set(curtain, { y: '-100%' });
            
            if (window.lenis) window.lenis.start();
 
            window.dispatchEvent(new Event('videoClosed'));
 
            if (!isMouseOver) {
                disablePreview();
            }
        }
      });
    } else {
        document.body.classList.remove('is-video-playing');
        gsap.set(group, { clearProps: 'zIndex' });
        if (window.lenis) window.lenis.start();
        window.dispatchEvent(new Event('videoClosed'));
        if (!isMouseOver) disablePreview();
    }
  };
 
  const toggleVideoMode = () => {
    if (isLocked) stopVideoMode();
    else startVideoMode();
  };
 
 
  // --- LISTENERY ---
 
  trigger.addEventListener('mouseenter', () => {
    isMouseOver = true;
    if (!isLocked) {
      enablePreview();
    }
  });
 
  trigger.addEventListener('mouseleave', () => {
    isMouseOver = false;
    if (!isLocked) {
      disablePreview();
    }
  });
 
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleVideoMode();
  });
 
  videoContainer.addEventListener('click', (e) => {
    if (isLocked) {
      e.stopPropagation();
      stopVideoMode();
    }
  });
 
  // --- KURSOR ZAMYKANIA I STREFY BEZPIECZNE ---
  
  const safeSelectors = '.main-header, .logo-mask-container, .menu-toggle-btn';
 
  if (curtain) {
      curtain.addEventListener('click', (e) => {
          if (isLocked) {
              if (e.target.closest(safeSelectors)) return;
              stopVideoMode();
          }
      });
  }
 
  const closeCursor = document.querySelector('.video-close-cursor');
  
  if (closeCursor) {
      const moveCursor = (e) => {
          if (isLocked) {
              gsap.to(closeCursor, {
                  x: e.clientX + 25, 
                  y: e.clientY + 25, 
                  duration: 0.5, 
                  ease: "power2.out"
              });
          }
      };
      
      window.addEventListener('mousemove', moveCursor);
 
      const safeZones = document.querySelectorAll(safeSelectors);
      
      safeZones.forEach(zone => {
          zone.addEventListener('mouseenter', () => {
              if (isLocked) closeCursor.classList.add('is-hidden-area');
          });
          zone.addEventListener('mouseleave', () => {
              if (isLocked) closeCursor.classList.remove('is-hidden-area');
          });
      });
  }
 
  videoElement.addEventListener('ended', () => {
    if (isLocked) stopVideoMode();
  });
}
 
/* =========================
   SCROLL ZOOM
   ========================= */
function initHeroScrollZoom() {
  const videoContainer = document.querySelector('.showreel-container');
  const heroSection = document.querySelector('#hero-section');
 
  if (!videoContainer || !heroSection) return;
  if (window.innerWidth < 1440) return;
 
  gsap.fromTo(videoContainer, 
    { minWidth: '23vw' },
    {
      minWidth: '38vw', 
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top', 
        end: 'bottom top',
        scrub: true        
      }
    }
  );
}
 
/* =========================
   MARQUEE (Twoje ustawienia)
   ========================= */
function initMarquee() {
  const marqueeWrapper = document.querySelector('.hero-title-wrapper');
  if (!marqueeWrapper) return;
 
  if (marqueeWrapper.marqueeTween) {
    marqueeWrapper.marqueeTween.kill();
  }
 
  if (!marqueeWrapper.getAttribute('data-cloned')) {
     const content = marqueeWrapper.innerHTML;
     marqueeWrapper.innerHTML = content + content; 
     marqueeWrapper.setAttribute('data-cloned', 'true');
  }
 
  const duration = 80; 
  
  marqueeWrapper.marqueeTween = gsap.fromTo(marqueeWrapper, 
    { xPercent: 0 },
    { 
      xPercent: -50, 
      duration: duration, 
      ease: "none", 
      repeat: -1 
    }
  );
}
 
/* =========================
   INTRO HERO
   ========================= */
function runHeroIntroSequence() {
  const introParagraph = document.querySelector('.hero-intro-text p');
  const introLink = document.querySelector('.hero-intro-text .hero-btn-wrapper');
  const showreelContainer = document.querySelector('.showreel-container');
  const serviceItems = document.querySelectorAll('.hero-services-list h2');
 
  if (!introParagraph || !introLink || !showreelContainer || !serviceItems.length) {
    ScrollTrigger.refresh();
    return;
  }
 
  const splitIntro = new SplitType(introParagraph, { types: 'lines' });
  const splitServices = new SplitType(serviceItems, { types: 'lines' });
 
  gsap.set(splitIntro.lines, { y: '100%', opacity: 0 });
  gsap.set(introLink, { y: 30, opacity: 0 });
  gsap.set(splitServices.lines, { y: '100%', opacity: 0 });
 
  const introTl = gsap.timeline({
    delay: 0.5,
    onComplete: () => {
      ScrollTrigger.refresh();
    }
  });
 
  introTl
    .set([introParagraph, introLink, serviceItems], { visibility: 'visible' }, 0)
    .to(splitIntro.lines, { y: '0%', opacity: 1, duration: 1, ease: 'power2.out', stagger: 0.1 })
    .to(introLink, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, "-=0.7")
    .to(showreelContainer, { autoAlpha: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.out' }, "-=1.2")
    .to(splitServices.lines, { y: '0%', opacity: 1, duration: 0.8, ease: 'power2.out', stagger: 0.1 }, "-=1.2");
}
 
/* =========================
   PORTFOLIO HOVER (Twoje ustawienia)
   ========================= */
function initLargePortfolioItems() {
  const largeItems = document.querySelectorAll('.portfolio-item--large');
  if (!largeItems.length) return;
 
  largeItems.forEach(item => {
    const mask = item.querySelector('.portfolio-image-mask');
    const image = item.querySelector('.portfolio-image');
    const title = item.querySelector('.portfolio-caption-title');
    
    if (!mask || !image) return;
 
    gsap.set(mask, { clipPath: 'inset(0px)' });
    gsap.set(image, { scale: 1.0 });
    
    if (title) {
        gsap.set(title, { x: 0 });
    }
 
    const animSettings = { 
      duration: 0.5, 
      ease: 'power2.out', 
      overwrite: 'auto' 
    };
 
    item.addEventListener('mouseenter', () => {
      gsap.to(mask, { clipPath: 'inset(20px)', ...animSettings });
      gsap.to(image, { scale: 1.08, ...animSettings });
      if (title) gsap.to(title, { x: 20, ...animSettings });
    });
 
    item.addEventListener('mouseleave', () => {
      gsap.to(mask, { clipPath: 'inset(0px)', ...animSettings });
      gsap.to(image, { scale: 1.0, ...animSettings });
      if (title) gsap.to(title, { x: 0, ...animSettings });
    });
  });
}
 
/* =========================
   GALLERY ENTRANCE 
   ========================= */
function initGalleryEntranceAnimations() {
  const elements = gsap.utils.toArray('.opengallery');
  if (!elements.length) return;
 
  elements.forEach(element => {
    gsap.fromTo(element, 
      { 
        scale: 0.8, 
        transformOrigin: 'center center' 
      },
      { 
        scale: 1, 
        ease: 'none', 
        
        scrollTrigger: {
          trigger: element,
          start: "top 100%", 
          end: "top 70%",   
          scrub: true 
        }
      }
    );
  });
}