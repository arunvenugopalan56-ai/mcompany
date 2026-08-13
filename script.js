/* =========================================================================
   KL08 CREATIONS LLP - PREMIUM CINEMATIC INTERACTIVE ENGINE
   ========================================================================= */

// CHANGE WEBSITE LAUNCH DATE AND TIME HERE (ISO-8601 Format: YYYY-MM-DDTHH:MM:SS)
const launchDate = new Date("2026-09-01T00:00:00");

document.addEventListener('DOMContentLoaded', () => {
    // Detect Touch Devices
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    // =========================================================================
    // 1. LENIS SMOOTH SCROLLING
    // =========================================================================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1.0,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    // =========================================================================
    // 2. HERO SECTION LOAD ANIMATIONS
    // =========================================================================
    const heroBgImage = document.getElementById('hero-bg-image');
    const loadTimeline = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.8 } });

    // Background scale down from 1.08 to 1.0
    if (heroBgImage) {
        loadTimeline.fromTo(heroBgImage, 
            { scale: 1.08 },
            { scale: 1.0, duration: 2.5, ease: 'power2.out' },
            0
        );
    }

    // Logo cinematic entrance: scale 0.75 -> 1.0, opacity 0 -> 1, blur 12px -> 0
    loadTimeline.fromTo('#hero-logo',
        { opacity: 0, scale: 0.75, filter: 'blur(12px)' },
        { opacity: 1, scale: 1.0, filter: 'blur(0px)', duration: 2.0, ease: 'power3.out' },
        0.2
    );

    // Scroll explore indicator fades in
    loadTimeline.fromTo('#explore-indicator',
        { opacity: 0, y: 20 },
        { 
            opacity: 1, 
            y: 0, 
            duration: 1.5, 
            ease: 'power3.out',
            onComplete: () => {
                // Subtle logo pulse scale after load finishes (scale 1 -> 1.015 -> 1)
                gsap.to('#hero-logo', {
                    scale: 1.015,
                    duration: 3,
                    yoyo: true,
                    repeat: -1,
                    ease: 'power1.inOut'
                });
            }
        },
        1.2
    );

    // =========================================================================
    // 3. HERO MOUSE PARALLAX (DESKTOP ONLY)
    // =========================================================================
    const heroSection = document.getElementById('hero');

    if (heroSection && heroBgImage && !isTouchDevice) {
        heroSection.addEventListener('mousemove', (e) => {
            const { width, height } = heroSection.getBoundingClientRect();
            // Map coordinates from -0.5 to 0.5
            const xVal = (e.clientX / width) - 0.5;
            const yVal = (e.clientY / height) - 0.5;

            // Subtle parallax for background
            gsap.to(heroBgImage, {
                x: xVal * 15,
                y: yVal * 15,
                duration: 1.2,
                ease: 'power2.out',
                overwrite: 'auto'
            });

            // Subtle parallax for logo image (opposite direction)
            const heroLogoImg = document.getElementById('hero-logo');
            if (heroLogoImg) {
                gsap.to(heroLogoImg, {
                    x: -xVal * 12,
                    y: -yVal * 12,
                    duration: 1.2,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });
            }
        });

        // Reset elements on mouse leave
        heroSection.addEventListener('mouseleave', () => {
            const heroLogoImg = document.getElementById('hero-logo');
            gsap.to(heroBgImage, {
                x: 0,
                y: 0,
                duration: 1.5,
                ease: 'power3.out',
                overwrite: 'auto'
            });
            if (heroLogoImg) {
                gsap.to(heroLogoImg, {
                    x: 0,
                    y: 0,
                    duration: 1.5,
                    ease: 'power3.out',
                    overwrite: 'auto'
                });
            }
        });
    }

    // =========================================================================
    // 3A. HERO SCROLL TRIGGER (PINNING & TRANSFORMATION)
    // =========================================================================
    const heroScrollTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: '+=100%', // Pin for 1 full viewport height distance
            pin: true,
            scrub: true,
            invalidateOnRefresh: true
        }
    });

    // Keep logo large for first 30% of scroll
    heroScrollTimeline.to({}, { duration: 0.3 });

    // Shrink logo wrapper and move up
    heroScrollTimeline.to('#hero-logo-wrap', {
        scale: 0.35,
        y: '-18vh',
        duration: 0.5,
        ease: 'power1.inOut'
    }, 0.3);

    // Reveal tagline text block
    heroScrollTimeline.to('#hero-text-block', {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.5,
        ease: 'power2.out'
    }, 0.35);

    // Fade out explore indicator
    heroScrollTimeline.to('#explore-indicator', {
        opacity: 0,
        y: -30,
        duration: 0.25,
        ease: 'power1.in'
    }, 0.1);

    // Background parallax shifting
    heroScrollTimeline.to('#hero-bg-image', {
        y: '8vh',
        ease: 'none',
        duration: 0.7
    }, 0.3);

    // =========================================================================
    // 4. SERVICES INTERACTIVE ACCORDION / SCROLL STATE (DESKTOP ONLY)
    // =========================================================================
    const serviceItems = gsap.utils.toArray('.service-item');
    
    if (window.innerWidth > 1024 && serviceItems.length > 0) {
        // Initialize the first panel as active on startup
        serviceItems[0].classList.add('active');

        // ScrollTrigger coordinates active items based on screen scrolling center
        serviceItems.forEach((item) => {
            ScrollTrigger.create({
                trigger: item,
                start: 'top 60%',
                end: 'bottom 40%',
                onToggle: (self) => {
                    if (self.isActive) {
                        serviceItems.forEach(el => el.classList.remove('active'));
                        item.classList.add('active');
                    }
                }
            });
        });
    }

    // =========================================================================
    // 5. WEBSITE LAUNCH COUNTDOWN ENGINE
    // =========================================================================
    const daysVal = document.getElementById('days-val');
    const hoursVal = document.getElementById('hours-val');
    const minutesVal = document.getElementById('minutes-val');
    const secondsVal = document.getElementById('seconds-val');
    
    const preLaunchView = document.getElementById('pre-launch-view');
    const postLaunchView = document.getElementById('post-launch-view');

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = launchDate.getTime() - now;

        // If launch date has passed, show Live view
        if (difference <= 0) {
            clearInterval(countdownInterval);
            
            if (preLaunchView && postLaunchView) {
                preLaunchView.style.display = 'none';
                postLaunchView.style.display = 'block';

                // GSAP reveal live elements
                gsap.fromTo(postLaunchView.querySelectorAll('.live-title, .live-subtitle'),
                    { opacity: 0, y: 35 },
                    { opacity: 1, y: 0, stagger: 0.25, duration: 1.6, ease: 'power4.out' }
                );
            }
            return;
        }

        // Calculations for days, hours, minutes and seconds
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Format and set numbers
        const prevSec = secondsVal.textContent;
        
        daysVal.textContent = days.toString().padStart(2, '0');
        hoursVal.textContent = hours.toString().padStart(2, '0');
        minutesVal.textContent = minutes.toString().padStart(2, '0');
        secondsVal.textContent = seconds.toString().padStart(2, '0');

        // Apply a subtle pulse to the seconds text on change
        if (prevSec !== seconds.toString().padStart(2, '0')) {
            secondsVal.classList.add('timer-pulse');
            setTimeout(() => {
                secondsVal.classList.remove('timer-pulse');
            }, 300);
        }
    }

    // Run once initially and set interval
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);

    // Fade-in animations for Countdown Section Entrance
    gsap.fromTo('.fade-up-cnt', 
        { opacity: 0, y: 40 },
        { 
            opacity: 1, 
            y: 0, 
            stagger: 0.15, 
            duration: 1.5, 
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '#launch',
                start: 'top 75%',
                once: true
            }
        }
    );

    // Fade-in animations for Footer Entrance (Staggered Column Reveals)
    const footerTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.footer-section',
            start: 'top 85%',
            once: true
        }
    });

    footerTimeline.fromTo('.brand-col', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
    );

    footerTimeline.fromTo('.address-col', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
        '-=0.9'
    );

    footerTimeline.fromTo('.contact-col', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
        '-=0.9'
    );

    footerTimeline.fromTo('.footer-phone-number', 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 1.0, ease: 'power2.out' },
        '-=0.5'
    );

    footerTimeline.fromTo('.footer-bottom-divider, .footer-copyright', 
        { opacity: 0 },
        { opacity: 1, duration: 1.0, ease: 'power1.out' },
        '-=0.5'
    );

    // =========================================================================
    // 6. SMOOTH ANCHOR LINK NAVIGATION (EXPLORE BUTTON)
    // =========================================================================
    const exploreIndicator = document.getElementById('explore-indicator');
    if (exploreIndicator) {
        exploreIndicator.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector('#services');
            if (target) {
                lenis.scrollTo(target, {
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                });
            }
        });
    }

    // =========================================================================
    // 7. PREMIUM LERPING CUSTOM CURSOR
    // =========================================================================
    const cursor = document.getElementById('custom-cursor');

    if (cursor && !isTouchDevice) {
        const cursorDot = cursor.querySelector('.cursor-dot');
        const cursorRing = cursor.querySelector('.cursor-ring');
        const cursorLabel = cursor.querySelector('.cursor-label');

        let mousePos = { x: 0, y: 0 };
        let dotPos = { x: 0, y: 0 };
        let ringPos = { x: 0, y: 0 };

        // Mouse track
        window.addEventListener('mousemove', (e) => {
            mousePos.x = e.clientX;
            mousePos.y = e.clientY;

            if (cursor.style.opacity === '0' || !cursor.style.opacity) {
                cursor.style.opacity = '1';
            }
        });

        // Hide when mouse exits viewport
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
        });

        // Custom lerp frame ticks
        function renderCursor() {
            const dotLerp = 0.25;
            const ringLerp = 0.14;

            dotPos.x += (mousePos.x - dotPos.x) * dotLerp;
            dotPos.y += (mousePos.y - dotPos.y) * dotLerp;

            ringPos.x += (mousePos.x - ringPos.x) * ringLerp;
            ringPos.y += (mousePos.y - ringPos.y) * ringLerp;

            cursorDot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;
            cursorRing.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
            cursorLabel.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;

            requestAnimationFrame(renderCursor);
        }
        requestAnimationFrame(renderCursor);

        // Standard links hover state
        const standardLinks = document.querySelectorAll('a, button');
        standardLinks.forEach(el => {
            if (el.id !== 'explore-indicator') {
                el.addEventListener('mouseenter', () => {
                    cursor.className = 'custom-cursor state-hover-link';
                });
                el.addEventListener('mouseleave', () => {
                    cursor.className = 'custom-cursor';
                });
            }
        });

        // Hero scroll explore hover state (SCROLL)
        if (exploreIndicator) {
            exploreIndicator.addEventListener('mouseenter', () => {
                cursor.className = 'custom-cursor state-scroll';
                cursorLabel.textContent = 'SCROLL';
            });
            exploreIndicator.addEventListener('mouseleave', () => {
                cursor.className = 'custom-cursor';
                cursorLabel.textContent = '';
            });
        }

        // Service items hover state
        const serviceItemsEl = document.querySelectorAll('.service-item');
        serviceItemsEl.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.className = 'custom-cursor state-service-hover';
            });
            el.addEventListener('mouseleave', () => {
                cursor.className = 'custom-cursor';
            });
        });
    } else if (cursor) {
        // Force hide custom cursor on mobile viewports
        cursor.style.display = 'none';
    }
});
