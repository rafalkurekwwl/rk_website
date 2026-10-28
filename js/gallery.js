/* ==========================================================================
   GALERIA OSOBISTA + DRAGGABLE LIGHTBOX + SHOWREEL
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initPersonalGallery();
    initMobileSwipeGallery();
    initShowreel();
    initSocialProof();
    initExpandShowreel(); 
    initProcessWidget();
});

function initPersonalGallery() {
    const gallerySection = document.querySelector('.gallery-section');
    const nextBtn = document.getElementById('btn-next');
    
    if (!gallerySection || !nextBtn) return;

    // 1. Płaska baza wszystkich 8 zdjęć
    const pagesData = [
        [ 
            { src: '../img/personal/1.webp', desc: 'Subtraction isn\'t minimalism, it\'s discipline. What you leave out says everything.' },
            { src: '../img/personal/2.webp', desc: 'Every decision you make becomes a mirror. Good design isn\'t about what you build.' },
            { src: '../img/personal/3.webp', desc: 'Nobody remembers the deliverables. They remember the feeling. That\'s what I build for.' },
            { src: '../img/personal/4.webp', desc: 'It\'s authorship. Curation. Responsibility. It\'s the invisible pressure behind every pixel.' }
        ],
        [ 
            { src: '../img/personal/5.webp', desc: 'Space is not empty, it is full of possibilities. It gives your content room to breathe.' },
            { src: '../img/personal/6.webp', desc: 'Words have meaning, but typography conveys emotion. Choose your typefaces carefully.' },
            { src: '../img/personal/7.webp', desc: 'Animation shouldn\'t just be decorative. It must guide the eye, provide context, and delight.' },
            { src: '../img/personal/8.webp', desc: 'A strong foundation allows for creative freedom. Break the rules only after you have mastered them.' }
        ]
    ];
    const allImages = pagesData.flat();

    const currentImgs = document.querySelectorAll('.img-current');
    const maskWrappers = document.querySelectorAll('.mask-wrapper');
    const nextImgs = document.querySelectorAll('.img-next');
    const textWrappers = document.querySelectorAll('.card-text-wrapper');
    const descs = document.querySelectorAll('.card-desc');
    const cards = document.querySelectorAll('.desktop-only .gallery-card');

    let isAnimating = false;
    let autoPlayTimer;
    const AUTO_PLAY_DELAY = 3000; 

    // Przechowuje "wewnętrzny licznik" dla każdej z 4 kart
    let slotCounters = [0, 0, 0, 0];

    // --- FUNKCJE POMOCNICZE DLA RESPONSORWNOŚCI ---

    // Pobiera tylko te karty, które nie są ukryte w CSS (display: none)
    function getVisibleIndices() {
        const indices = [];
        cards.forEach((card, i) => {
            if (window.getComputedStyle(card).display !== 'none') indices.push(i);
        });
        return indices;
    }

    // Dynamicznie rozdziela 8 zdjęć na widoczne karty
    // Np. jak są 2 karty, karta nr 0 dostaje zdjęcia [0, 2, 4, 6]
    function getPhotosForSlot(slotIndex, totalVisible) {
        const photos = [];
        for (let i = slotIndex; i < allImages.length; i += totalVisible) {
            photos.push(allImages[i]);
        }
        return photos;
    }

    // --- LOGIKA ANIMACJI ---

    function animateCards(indicesToAnimate) {
        if (isAnimating) return;
        isAnimating = true;

        const totalVisible = getVisibleIndices().length;

        // Ustawienie zdjęć i masek dla nowych obrazów
        indicesToAnimate.forEach(i => {
            const photos = getPhotosForSlot(i, totalVisible);
            const photoData = photos[slotCounters[i]]; 
            nextImgs[i].src = photoData.src;
            gsap.set(nextImgs[i], { x: 90 });
            gsap.set(maskWrappers[i], { clipPath: "inset(0 0 0 100%)" });
        });

        const targetTexts = indicesToAnimate.map(i => textWrappers[i]);
        const targetCurrent = indicesToAnimate.map(i => currentImgs[i]);
        const targetMasks = indicesToAnimate.map(i => maskWrappers[i]);
        const targetNext = indicesToAnimate.map(i => nextImgs[i]);

        const tl = gsap.timeline({
            onComplete: () => {
                indicesToAnimate.forEach(i => {
                    const photos = getPhotosForSlot(i, totalVisible);
                    currentImgs[i].src = photos[slotCounters[i]].src; 
                    gsap.set(currentImgs[i], { x: 0 });  
                    gsap.set(maskWrappers[i], { clipPath: "inset(0 0 0 100%)" }); 
                });
                isAnimating = false;
                if (!document.body.classList.contains('lightbox-is-open')) startAutoPlay();
            }
        });

        const dur = 0.8; 
        const ease = "power3.inOut";

        tl.to(targetTexts, { opacity: 0, duration: 0.4, ease: "power2.inOut" }, 0); 
        tl.to(targetCurrent, { x: -90, duration: dur, ease: ease }, 0); 
        tl.to(targetMasks, { clipPath: "inset(0 0 0 0%)", duration: dur, ease: ease }, 0);
        tl.to(targetNext, { x: 0, duration: dur, ease: ease }, 0);

        tl.call(() => {
            indicesToAnimate.forEach(i => {
                const photos = getPhotosForSlot(i, totalVisible);
                descs[i].textContent = photos[slotCounters[i]].desc;
            });
        }, null, 0.4);

        tl.to(targetTexts, { opacity: 1, duration: 0.6, ease: "power2.inOut" }, 0.4); 
    }

    function startAutoPlay() {
        clearInterval(autoPlayTimer);
        autoPlayTimer = setInterval(() => {
            if (!isAnimating && !document.body.classList.contains('lightbox-is-open')) {
                const visibleIndices = getVisibleIndices();
                if (visibleIndices.length === 0) return; // Zabezpieczenie dla mobile

                const randomSlot = visibleIndices[Math.floor(Math.random() * visibleIndices.length)];
                const photos = getPhotosForSlot(randomSlot, visibleIndices.length);
                
                // Zwiększ licznik tylko dla wylosowanego slota i zapętl
                slotCounters[randomSlot] = (slotCounters[randomSlot] + 1) % photos.length;
                animateCards([randomSlot]);
            }
        }, AUTO_PLAY_DELAY);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayTimer);
    }

    startAutoPlay();

    cards.forEach(card => {
        card.addEventListener('mouseenter', stopAutoPlay);
        card.addEventListener('mouseleave', () => {
            if (!isAnimating && !document.body.classList.contains('lightbox-is-open')) startAutoPlay();
        });
    });

    nextBtn.addEventListener('click', () => {
        if (isAnimating) return;
        stopAutoPlay();

        const visibleIndices = getVisibleIndices();
        visibleIndices.forEach(i => {
            const photos = getPhotosForSlot(i, visibleIndices.length);
            slotCounters[i] = (slotCounters[i] + 1) % photos.length;
        });

        animateCards(visibleIndices);
    });
    
    // --- LIGHTBOX ---
    // (Pomiń wklejanie, kod Lightboxa z trackiem, counterem itd. zostaje ten sam!
    // Poniżej wklejam tylko zaktualizowany EVENT nasłuchiwania na kliknięcie w kartę)

    /* TU JEST TWÓJ KOD TWORZENIA LIGHTBOXA (Zostaw to co miałeś) */
    let lightbox = document.querySelector('.lightbox-overlay');
    
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.className = 'lightbox-overlay';
        lightbox.innerHTML = `
            <button class="lightbox-close-btn">ZAMKNIJ</button>
            <div class="lightbox-track"></div>
            <div class="lightbox-counter">1 / ${allImages.length}</div>
        `;
        document.body.appendChild(lightbox);
    }

    const track = lightbox.querySelector('.lightbox-track');
    const counter = lightbox.querySelector('.lightbox-counter');
    const closeBtn = lightbox.querySelector('.lightbox-close-btn');

    track.innerHTML = '';
    const lightboxSlides = [];

    allImages.forEach((data) => {
        const slide = document.createElement('div');
        slide.className = 'lightbox-slide';
        slide.innerHTML = `<img src="${data.src}" alt="" draggable="false">`;
        track.appendChild(slide);
        lightboxSlides.push(slide);
    });

    let currentActiveIndex = 0;
    let isLightboxOpen = false;
    let isDraggingLB = false;
    let startX = 0;
    let isTransitioning = false;
    let currentSlide, prevSlide, nextSlide;

    function openLightbox(index) {
        currentActiveIndex = index;
        isLightboxOpen = true;
        
        document.body.classList.add('lightbox-is-open');
        if (window.lenis) window.lenis.stop(); 
        stopAutoPlay();
        
        updateSlidesPosition(false);
        updateCounter();

        lightbox.classList.add('is-open');
        track.addEventListener('pointerdown', handleDragStartLB);
    }

    function closeLightbox() {
        if (!isLightboxOpen) return;
        isLightboxOpen = false;
        
        document.body.classList.remove('lightbox-is-open');
        lightbox.classList.remove('is-open'); 
        document.body.style.cursor = 'default'; 
        
        if (window.lenis) window.lenis.start(); 
        startAutoPlay();

        setTimeout(() => {
            lightboxSlides.forEach(s => {
                s.classList.remove('is-visible', 'is-active');
                s.style.display = 'none'; 
            });
        }, 400);
        
        track.removeEventListener('pointerdown', handleDragStartLB);
    }

    function updateSlidesPosition(animate = true, direction = 0) {
        const prevIndex = (currentActiveIndex - 1 + allImages.length) % allImages.length;
        const nextIndex = (currentActiveIndex + 1) % allImages.length;

        currentSlide = lightboxSlides[currentActiveIndex];
        prevSlide = lightboxSlides[prevIndex];
        nextSlide = lightboxSlides[nextIndex];

        const gap = 40;
        const screenW = window.innerWidth + gap;

        if (direction === 1) {
            gsap.set(nextSlide, { x: screenW * 2 });
        } else if (direction === -1) {
            gsap.set(prevSlide, { x: -screenW * 2 });
        }

        lightboxSlides.forEach(s => {
            s.classList.remove('is-visible', 'is-active');
            if (s !== currentSlide && s !== prevSlide && s !== nextSlide) {
                 gsap.set(s, { display: 'none', opacity: 0 }); 
            }
        });

        [currentSlide, prevSlide, nextSlide].forEach(s => {
            s.classList.add('is-visible');
            s.style.display = 'flex';
            gsap.set(s, { opacity: 1 });
        });
        
        currentSlide.classList.add('is-active');

        const duration = animate ? 0.5 : 0;
        const ease = "power2.out";

        gsap.to(currentSlide, { x: 0, duration: duration, ease: ease });
        gsap.to(prevSlide, { x: -screenW, duration: duration, ease: ease });
        gsap.to(nextSlide, { x: screenW, duration: duration, ease: ease });
    }

    function updateCounter() {
        counter.textContent = `${currentActiveIndex + 1} / ${allImages.length}`;
    }

    function handleDragStartLB(e) {
        if (isTransitioning) return;
        if (e.button === 2) return;
        
        startX = e.clientX;
        isDraggingLB = true;
        
        const img = currentSlide.querySelector('img');
        if(img) img.classList.add('is-grabbing');

        window.addEventListener('pointermove', handleDragMoveLB);
        window.addEventListener('pointerup', handleDragEndLB);
        window.addEventListener('pointercancel', handleDragEndLB);
    }

    function handleDragMoveLB(e) {
        if (!isDraggingLB) return;
        const currentX = e.clientX;
        const diff = currentX - startX;
        const gap = 40;
        const screenW = window.innerWidth + gap;

        gsap.set(currentSlide, { x: diff });
        gsap.set(prevSlide, { x: diff - screenW });
        gsap.set(nextSlide, { x: diff + screenW });
    }

    function handleDragEndLB(e) {
        if (!isDraggingLB) return;
        isDraggingLB = false;
        
        const img = currentSlide.querySelector('img');
        if(img) img.classList.remove('is-grabbing');

        window.removeEventListener('pointermove', handleDragMoveLB);
        window.removeEventListener('pointerup', handleDragEndLB);
        window.removeEventListener('pointercancel', handleDragEndLB);

        const currentX = gsap.getProperty(currentSlide, "x");
        const threshold = window.innerWidth * 0.15; 

        if (currentX < -threshold) {
            changeSlide(1); 
        } else if (currentX > threshold) {
            changeSlide(-1); 
        } else {
            snapBack(); 
        }
    }

    function changeSlide(dir) {
        if (isTransitioning) return;
        isTransitioning = true;
        
        currentActiveIndex = (currentActiveIndex + dir + allImages.length) % allImages.length;
        updateCounter();
        updateSlidesPosition(true, dir);

        setTimeout(() => { isTransitioning = false; }, 550);
    }

    function snapBack() {
        updateSlidesPosition(true, 0);
    }


    // --- ZAKTUALIZOWANE OTWIERANIE LIGHTBOXA ---
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            if (window.innerWidth <= 768) return; 

            const totalVisible = getVisibleIndices().length;
            const photos = getPhotosForSlot(index, totalVisible);
            const activePhotoData = photos[slotCounters[index]];

            // Znajduje ten konkretny obrazek w bazie, nieważne na którym ekranie jesteśmy
            const globalIndex = allImages.findIndex(img => img.src === activePhotoData.src);
            openLightbox(globalIndex);
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    window.addEventListener('keydown', (e) => { 
        if (e.key === 'Escape') closeLightbox(); 
        if (isLightboxOpen && e.key === 'ArrowRight') changeSlide(1);
        if (isLightboxOpen && e.key === 'ArrowLeft') changeSlide(-1);
    });
}

function initMobileSwipeGallery() {
    const dragArea = document.getElementById('mg-drag-area');
    if (!dragArea) return;

    // Wspólne dane galerii
    const pagesData = [
        [ 
            { src: 'img/personal/1.webp', desc: 'Subtraction isn\'t minimalism, it\'s discipline. What you leave out says everything.' },
            { src: 'img/personal/2.webp', desc: 'Every decision you make becomes a mirror. Good design isn\'t about what you build, it\'s about what you reveal.' },
            { src: 'img/personal/3.webp', desc: 'Nobody remembers the deliverables. They remember the feeling. That\'s what I build for.' },
            { src: 'img/personal/4.webp', desc: 'It\'s authorship. Curation. Responsibility. It\'s the invisible pressure behind every pixel.' }
        ],
        [ 
            { src: 'img/personal/5.webp', desc: 'Space is not empty, it is full of possibilities. It gives your content room to breathe.' },
            { src: 'img/personal/6.webp', desc: 'Words have meaning, but typography conveys emotion. Choose your typefaces carefully.' },
            { src: 'img/personal/7.webp', desc: 'Animation shouldn\'t just be decorative. It must guide the eye, provide context, and delight.' },
            { src: 'img/personal/8.webp', desc: 'A strong foundation allows for creative freedom. Break the rules only after you have mastered them.' }
        ]
    ];
    const galleryData = pagesData.flat();

    const imgCurrent = document.getElementById('mg-img-current');
    const imgNext = document.getElementById('mg-img-next');
    const maskWrapper = document.getElementById('mg-mask-wrapper');
    const textWrapper = document.getElementById('mg-text-wrapper');
    const descEl = document.getElementById('mg-card-desc');

    let currentIndex = 0;
    let isAnimating = false; 
    let isDragging = false;
    
    let startX = 0;
    let dragDirection = 0; 
    let nextIndex = 0;

    // Funkcja pobierająca szerokość (żeby dbała o zmianę orientacji telefonu)
    const getScreenW = () => window.innerWidth;

    function handleDragStart(e) {
        if (isAnimating || getScreenW() > 768) return; // Działa tylko na Mobile
        isDragging = true;
        
        startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        dragDirection = 0;

        gsap.to(textWrapper, { opacity: 0, duration: 0.3, ease: "power2.out" });
    }

    function handleDragMove(e) {
        if (!isDragging || isAnimating) return;
        
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const diffX = clientX - startX;
        
        if (Math.abs(diffX) < 10 && dragDirection === 0) return;

        if (dragDirection === 0 && Math.abs(diffX) > 10) {
            dragDirection = diffX < 0 ? 1 : -1; 
            
            nextIndex = (currentIndex + dragDirection + galleryData.length) % galleryData.length;
            imgNext.src = galleryData[nextIndex].src;
            
            const imgNextStartX = dragDirection === 1 ? 50 : -50;
            gsap.set(imgNext, { x: imgNextStartX });
        }

        if (dragDirection === 0) return; 

        let progress = Math.abs(diffX) / getScreenW();
        progress = Math.min(Math.max(progress, 0), 1); 
        const percent = progress * 100;

        if (dragDirection === 1) {
            gsap.set(maskWrapper, { clipPath: `inset(0% 0% 0% ${100 - percent}%)` });
            gsap.set(imgCurrent, { x: -progress * 50 });
            gsap.set(imgNext, { x: 50 - (progress * 50) });
        } else {
            gsap.set(maskWrapper, { clipPath: `inset(0% ${100 - percent}% 0% 0%)` });
            gsap.set(imgCurrent, { x: progress * 50 });
            gsap.set(imgNext, { x: -50 + (progress * 50) });
        }
    }

    function handleDragEnd(e) {
        if (!isDragging || isAnimating || dragDirection === 0) return;
        isDragging = false;
        isAnimating = true;
        
        const endX = e.type.includes('mouse') ? e.clientX : e.changedTouches[0].clientX;
        const diffX = endX - startX;
        const progress = Math.abs(diffX) / getScreenW();
        
        if (progress > 0.2) completeTransition(dragDirection);
        else cancelTransition(dragDirection);
    }

    function completeTransition(direction) {
        const dur = 0.5; 
        const ease = "power2.out";
        
        const finalClipPath = "inset(0% 0% 0% 0%)"; 
        const targetCurrentX = direction === 1 ? -50 : 50;

        const tl = gsap.timeline({
            onComplete: () => {
                imgCurrent.src = galleryData[nextIndex].src;
                gsap.set(imgCurrent, { x: 0 });
                gsap.set(maskWrapper, { clipPath: "inset(0% 0% 0% 100%)" }); 
                currentIndex = nextIndex;
                isAnimating = false;
            }
        });

        tl.to(maskWrapper, { clipPath: finalClipPath, duration: dur, ease: ease }, 0);
        tl.to(imgCurrent, { x: targetCurrentX, duration: dur, ease: ease }, 0);
        tl.to(imgNext, { x: 0, duration: dur, ease: ease }, 0);

        tl.call(() => { descEl.textContent = galleryData[nextIndex].desc; }, null, dur * 0.5);
        tl.to(textWrapper, { opacity: 1, duration: 0.4, ease: "power2.out" }, dur * 0.5);
    }

    function cancelTransition(direction) {
        const dur = 0.4; 
        const ease = "power3.out";
        const startClipPath = direction === 1 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)";

        const tl = gsap.timeline({
            onComplete: () => {
                gsap.set(maskWrapper, { clipPath: "inset(0% 0% 0% 100%)" }); 
                isAnimating = false;
            }
        });

        tl.to(maskWrapper, { clipPath: startClipPath, duration: dur, ease: ease }, 0);
        tl.to(imgCurrent, { x: 0, duration: dur, ease: ease }, 0);
        tl.to(textWrapper, { opacity: 1, duration: 0.3, ease: "power2.out" }, 0.1);
    }

    dragArea.addEventListener('mousedown', handleDragStart);
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    dragArea.addEventListener('touchstart', handleDragStart, { passive: true });
    dragArea.addEventListener('touchmove', handleDragMove, { passive: true });
    dragArea.addEventListener('touchend', handleDragEnd);
}


/* ==========================================================================
   === SKRYPT DLA SEKCJI SHOWREEL (Twój oryginalny kod) ===
   ========================================================================== */
function initShowreel() {
    const wrapper = document.querySelector('.showreel-section-wrapper');
    if (!wrapper) return;

    const section = wrapper.querySelector('.showreel-section');
    const video = wrapper.querySelector('.showreel-video');
    const cursor = wrapper.querySelector('.showreel-cursor');
    const progressIndicator = wrapper.querySelector('.progress-indicator');

    let isPlaying = false;
    let progressAnimation;

    gsap.set(cursor, { 
        x: section.offsetWidth / 2, 
        y: section.offsetHeight / 2 
    });

    section.addEventListener('mouseenter', (e) => {
        if (isPlaying) return;
        gsap.killTweensOf(cursor);
        section.classList.add('is-hovered');
        const rect = section.getBoundingClientRect();
        gsap.to(cursor, {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            duration: 0.3,
            ease: 'power3.out'
        });
    });
    
    section.addEventListener('mousemove', (e) => {
        if (isPlaying) return;
        const rect = section.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        gsap.to(cursor, {
            x: x,
            y: y,
            duration: 0.8,
            ease: 'power3.out'
        });
    });

    section.addEventListener('mouseleave', () => {
        if (isPlaying) return;
        section.classList.remove('is-hovered');
        gsap.killTweensOf(cursor);
        gsap.to(cursor, {
            x: section.offsetWidth / 2,
            y: section.offsetHeight / 2,
            duration: 0.5,
            ease: 'power3.out'
        });
    });

    function formatTime(seconds) {
        if (isNaN(seconds)) return "00:00";
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function playShowreel() {
        isPlaying = true;
        wrapper.classList.add('is-playing');
        section.classList.remove('is-hovered');
        section.classList.add('is-playing');
        video.loop = false;
        video.muted = false;
        video.currentTime = 0;
        video.play();
        setupProgressAnimation();
        video.addEventListener('timeupdate', updateProgressText);
        video.addEventListener('ended', stopShowreel);
    }

    function stopShowreel() {
        isPlaying = false;
        wrapper.classList.remove('is-playing');
        section.classList.remove('is-playing');
        video.loop = true;
        video.muted = true;
        video.play();
        if (progressAnimation) progressAnimation.kill();
        gsap.set(progressIndicator, { x: 0 });
        video.removeEventListener('timeupdate', updateProgressText);
        video.removeEventListener('ended', stopShowreel);
    }

    function setupProgressAnimation() {
        if (progressAnimation) progressAnimation.kill();
        if (isNaN(video.duration) || video.duration === 0) {
            video.addEventListener('loadedmetadata', setupProgressAnimation, { once: true });
            return;
        }
        const duration = video.duration;
        progressIndicator.textContent = `${formatTime(duration)} / ${formatTime(duration)}`;
        const containerWidth = wrapper.offsetWidth;
        const indicatorWidth = progressIndicator.offsetWidth;
        const travelDistance = containerWidth - indicatorWidth;
        progressIndicator.textContent = `00:00 / ${formatTime(duration)}`;
        gsap.set(progressIndicator, { x: 0 });
        progressAnimation = gsap.to(progressIndicator, {
            x: travelDistance,
            duration: duration,
            ease: 'none'
        });
    }

    function updateProgressText() {
        if (!video.duration) return;
        progressIndicator.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    }
    
    video.addEventListener('loadedmetadata', () => {
        progressIndicator.textContent = `00:00 / ${formatTime(video.duration)}`;
    }, { once: true });

    section.addEventListener('click', () => {
        if (isPlaying) stopShowreel();
        else playShowreel();
    });
}

function initSocialProof() {
    const cards = document.querySelectorAll('.testimonial-card');
    
    if (cards.length === 0) return;

    cards.forEach(card => {
        const fullText = card.getAttribute('data-quote');
        const textContainer = card.querySelector('.quote-text');
        
        if (!fullText || !textContainer) return;

        if (fullText.length > 100) {
            
            let cutIndex = fullText.lastIndexOf(' ', 100); 
            if (cutIndex === -1) cutIndex = 100; 
            
            const visiblePart = fullText.substring(0, cutIndex);
            const hiddenPart = fullText.substring(cutIndex);

            const words = hiddenPart.split(' ');
            
            const hiddenCharsHTML = words.map(word => {
                if(word === '') return '';
                // Zmieniona klasa na quote-char
                const wordChars = word.split('').map(char => {
                    return `<span class="quote-char">${char}</span>`;
                }).join('');
                // Zmieniona klasa na quote-word
                return `<span class="quote-word">${wordChars}</span>`;
            }).join(' ');

            textContainer.innerHTML = `
                <span class="quote-visible-part">${visiblePart}</span><span class="quote-dots">...</span><span class="quote-hidden-wrapper">${hiddenCharsHTML}</span>
            `;

            const dots = textContainer.querySelector('.quote-dots');
            const hiddenWrapper = textContainer.querySelector('.quote-hidden-wrapper');
            const chars = textContainer.querySelectorAll('.quote-char');
            
            const tl = gsap.timeline({ paused: true });

            tl.set(dots, { display: 'none' })
              .set(hiddenWrapper, { display: 'inline' })
              .to(chars, {
                  opacity: 1,
                  duration: 0.15, 
                  stagger: 0.0038, 
                  ease: "none"
              });

            let leaveTimeout;

            card.addEventListener('mouseenter', () => {
                clearTimeout(leaveTimeout);
                tl.play();
            });

            card.addEventListener('mouseleave', () => {
                leaveTimeout = setTimeout(() => {
                    tl.reverse();
                }, 500); 
            });

        } else {
            textContainer.innerHTML = fullText;
        }
    });
}

function initExpandShowreel() {
    const section = document.querySelector('.fullscreen-sr-section');
    const mask = document.querySelector('.sr-mask-container');
    const img = document.querySelector('.sr-bg-image');
    const cursor = document.querySelector('.fullscreen-sr-section .showreel-cursor');

    // Elementy nowego Lightboxa
    const lightbox = document.querySelector('.showreel-lightbox-overlay');
    const video = lightbox ? lightbox.querySelector('.showreel-lightbox-video') : null;
    const closeBtn = lightbox ? lightbox.querySelector('.showreel-lightbox-close-btn') : null;
    const progressIndicator = lightbox ? lightbox.querySelector('.progress-indicator') : null;
    const progressWrapper = lightbox ? lightbox.querySelector('.showreel-lightbox-progress') : null;

    if (!section || !mask) return;

    // --- 1. ANIMACJA SCROLLA ---
    gsap.to(mask, {
        width: "100%",
        ease: "none",
        scrollTrigger: {
            trigger: section,
            start: "top 60%",
            end: "top 20%",
            scrub: true
        }
    });

    gsap.to(img, {
        scale: 1,
        ease: "none",
        scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top top",
            scrub: true
        }
    });

    // --- 2. LOGIKA KURSORA ---
    if (cursor) {
        let isHovered = false;

        gsap.set(cursor, { x: mask.offsetWidth / 2, y: mask.offsetHeight / 2 });

        mask.addEventListener('mouseenter', (e) => {
            isHovered = true;
            mask.classList.add('is-hovered');
            gsap.killTweensOf(cursor);
            const rect = mask.getBoundingClientRect();
            gsap.to(cursor, {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                duration: 0.3,
                ease: 'power3.out'
            });
        });
        
        mask.addEventListener('mousemove', (e) => {
            const rect = mask.getBoundingClientRect();
            gsap.to(cursor, {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                duration: 0.5,
                ease: 'power3.out'
            });
        });

        mask.addEventListener('mouseleave', () => {
            isHovered = false;
            mask.classList.remove('is-hovered');
            gsap.killTweensOf(cursor);
            gsap.to(cursor, {
                x: mask.offsetWidth / 2,
                y: mask.offsetHeight / 2,
                duration: 0.5,
                ease: 'power3.out'
            });
        });

        gsap.ticker.add(() => {
            if (!isHovered && !gsap.isTweening(cursor)) {
                gsap.set(cursor, {
                    x: mask.offsetWidth / 2,
                    y: mask.offsetHeight / 2
                });
            }
        });
    }

     // --- 3. LOGIKA WIDEO LIGHTBOXA ---
    if (lightbox && video) {
        let progressAnimation;
        const closeCursor = document.querySelector('.video-close-cursor'); // Łapiemy kursor z HTML

        function formatTime(seconds) {
            if (isNaN(seconds)) return "00:00";
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }

        // Funkcja poruszania kursorem ZAMKNIJ
        function moveCloseCursor(e) {
            if (!closeCursor) return;
            gsap.to(closeCursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.4, // Bardzo szybkie śledzenie dla responsywności
                ease: 'power2.out'
            });
        }

        // Otwieranie
        function openLightbox() {
            lightbox.classList.add('is-open');
            if (window.lenis) window.lenis.stop(); 

            video.currentTime = 0; 
            video.play();
            setupProgressAnimation();
            
            video.addEventListener('timeupdate', updateProgressText);
            video.addEventListener('ended', closeLightbox); 

            // Pokazujemy nasz kursor "ZAMKNIJ"
            if (closeCursor) {
                // Ustawiamy go na start w miejscu kliknięcia, żeby nie "leciał" z rogu
                gsap.set(closeCursor, { x: window.innerWidth / 2, y: window.innerHeight / 2 });
                gsap.to(closeCursor, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.2, 0.5)' });
                window.addEventListener('mousemove', moveCloseCursor);
            }
        }

        // Zamykanie
        function closeLightbox() {
            lightbox.classList.remove('is-open');
            if (window.lenis) window.lenis.start(); 

            video.pause();
            if (progressAnimation) progressAnimation.kill();
            gsap.set(progressIndicator, { x: 0 });
            
            video.removeEventListener('timeupdate', updateProgressText);
            video.removeEventListener('ended', closeLightbox);

            // Ukrywamy kursor "ZAMKNIJ"
            if (closeCursor) {
                gsap.to(closeCursor, { opacity: 0, scale: 0.5, duration: 0.3, ease: 'power3.in' });
                window.removeEventListener('mousemove', moveCloseCursor);
            }
        }

        function setupProgressAnimation() {
            if (progressAnimation) progressAnimation.kill();
            if (isNaN(video.duration) || video.duration === 0) {
                video.addEventListener('loadedmetadata', setupProgressAnimation, { once: true });
                return;
            }
            const duration = video.duration;
            const containerWidth = progressWrapper.offsetWidth;
            const indicatorWidth = progressIndicator.offsetWidth;
            const travelDistance = containerWidth - indicatorWidth;

            gsap.set(progressIndicator, { x: 0 });
            progressAnimation = gsap.to(progressIndicator, {
                x: travelDistance,
                duration: duration,
                ease: 'none'
            });
        }

        function updateProgressText() {
            if (!video.duration) return;
            progressIndicator.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
        }

        video.addEventListener('loadedmetadata', () => {
            progressIndicator.textContent = `00:00 / ${formatTime(video.duration)}`;
        }, { once: true });

        // EVENTY
        mask.addEventListener('click', openLightbox); 
        
        // ZMIANA: Kliknięcie gdziekolwiek w Lightbox zamyka go
        lightbox.addEventListener('click', closeLightbox);
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
                closeLightbox();
            }
        });
    }
    
}

function initProcessWidget() {
    const widgetList = document.querySelector('.process-titles-list');
    if (!widgetList) return;

    // Mamy teraz tylko teksty opisów (tytuły są stałe w HTML po lewej)
    const processDescData = [
        "Każdy projekt zaczynam od poznania Twojego biznesu, celów i wyzwań. Dobry design wymaga kontekstu.",
        "Określam pozycjonowanie, grupę docelową i wyróżniki marki. To fundament, na którym buduję każdą decyzję projektową.",
        "Projektuję, prezentuję, omawiam, dopracowuję. Każdy etap konsultuję z Tobą, żeby efekt końcowy był dokładnie tam, gdzie powinien.",
        "Dostarczam gotowe materiały wraz z wytycznymi do ich stosowania. Po wdrożeniu pozostaję dostępny, jeśli zajdzie taka potrzeba."
    ];

    let currentIndex = 0;
    let isAnimating = false;
    let autoPlayTimer;
    const AUTOPLAY_DELAY = 9000; 

    const animGroup = document.querySelector('.process-anim-group');
    const descEl = document.getElementById('proc-desc');
    const buttons = document.querySelectorAll('.process-title-btn');

    function goToStep(newIndex) {
        if (newIndex === currentIndex || isAnimating) return;
        isAnimating = true;

        // Przełączenie klasy active (zmienia opacity na liście)
        buttons.forEach(btn => btn.classList.remove('is-active'));
        buttons[newIndex].classList.add('is-active');

        // ZMIANA ANIMACJI: Zamiast "x", używamy "y" (ruch w dół)
        gsap.to(animGroup, {
            y: 10, // Osuwa się w dół znikając
            opacity: 0,
            duration: 0.4,
            ease: "power2.in",
            onComplete: () => {
                // Podmiana tekstu
                descEl.textContent = processDescData[newIndex];
                
                // Pojawia się lekko z góry i opada na swoje miejsce
                gsap.fromTo(animGroup, 
                    { y: -10, opacity: 0 }, 
                    { 
                        y: 0, 
                        opacity: 1, 
                        duration: 0.2, 
                        ease: "power2.out",
                        onComplete: () => {
                            currentIndex = newIndex;
                            isAnimating = false;
                        }
                    }
                );
            }
        });
    }

    function startAutoPlay() {
        clearInterval(autoPlayTimer);
        autoPlayTimer = setInterval(() => {
            const nextIndex = (currentIndex + 1) % processDescData.length;
            goToStep(nextIndex);
        }, AUTOPLAY_DELAY);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayTimer);
    }

    // Obsługa kliknięć w teksty-tytuły
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // currentTarget zapobiega błędom, gdyby ktoś kliknął w <span>
            const clickedIndex = parseInt(e.currentTarget.getAttribute('data-index'));
            goToStep(clickedIndex);
            stopAutoPlay();
            startAutoPlay(); 
        });
    });

    // Uruchamia autoplay dopiero, gdy widget pojawi się na ekranie
    ScrollTrigger.create({
        trigger: widgetList,
        start: "top 80%", 
        end: "bottom 20%", 
        onEnter: startAutoPlay,
        onLeave: stopAutoPlay,
        onEnterBack: startAutoPlay,
        onLeaveBack: stopAutoPlay
    });
}