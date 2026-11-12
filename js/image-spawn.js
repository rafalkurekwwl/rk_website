document.addEventListener('DOMContentLoaded', () => {

    const spawnArea = document.getElementById('image-spawn-area');
    if (!spawnArea) {
        return;
    }

    const imageFolderPath = 'img/logo/';
    const totalImages = 10;
    const imageExtension = 'webp';

    const distanceThreshold = 120;
    let lastMousePos = { x: 0, y: 0 };
    let zIndexCounter = 10;
    let lastImageIndex = -1;

    let isAtTop = true;

    function spawnImage(event) {

        if (!isAtTop) return;

        const img = document.createElement('img');
        img.classList.add('spawned-image');

        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * totalImages) + 1;
        } while (randomIndex === lastImageIndex);
        lastImageIndex = randomIndex;

        img.src = `${imageFolderPath}${randomIndex}.${imageExtension}`;

        gsap.set(img, {
            left: event.clientX,
            top: event.clientY,
            zIndex: zIndexCounter++
        });

        document.body.appendChild(img);

        const tl = gsap.timeline({ onComplete: () => img.remove() });
        tl.fromTo(img,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" }
        );
        tl.to(img,
            { scale: 0.8, opacity: 0, duration: 0.3, ease: "power2.in", delay: 0.2 }
        );
    }

    function handleScroll() {
        if (window.scrollY > 0 && isAtTop) {

            isAtTop = false;
            gsap.to(spawnArea, {
                opacity: 0,
                duration: 0.4,
                pointerEvents: 'none',
                ease: "power2.out"
            });
        } else if (window.scrollY === 0 && !isAtTop) {

            isAtTop = true;
            gsap.to(spawnArea, {
                opacity: 1,
                duration: 0.4,
                pointerEvents: 'auto',
                ease: "power2.out"
            });
        }
    }

    function handleMouseMove(event) {

        if (!isAtTop) return;

        const distance = Math.hypot(
            event.clientX - lastMousePos.x,
            event.clientY - lastMousePos.y
        );

        if (distance > distanceThreshold) {
            spawnImage(event);
            lastMousePos = { x: event.clientX, y: event.clientY };
        }
    }

    spawnArea.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

});
