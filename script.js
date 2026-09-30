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
    const heroLogoEl = document.getElementById('hero-logo');
    const heroSection = document.getElementById('hero');

    if (heroSection) {
        const loadTimeline = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.8 } });

        // Background scale down from 1.08 to 1.0
        if (heroBgImage) {
            loadTimeline.fromTo(heroBgImage, 
                { scale: 1.08 },
                { scale: 1.0, duration: 2.5, ease: 'power2.out' },
                0
            );
        }

        // Logo cinematic entrance: scale 0.85 -> 1.0, opacity 0 -> 1
        if (heroLogoEl) {
            loadTimeline.fromTo('#hero-logo',
                { opacity: 0, scale: 0.85 },
                { opacity: 1, scale: 1.0, duration: 1.5, ease: 'power3.out' },
                0.2
            );
        }

        // Scroll explore indicator fades in
        if (document.getElementById('explore-indicator')) {
            loadTimeline.fromTo('#explore-indicator',
                { opacity: 0, y: 20 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 1.5, 
                    ease: 'power3.out',
                    onComplete: () => {
                        if (heroLogoEl) {
                            gsap.to('#hero-logo', {
                                scale: 1.015,
                                duration: 3,
                                yoyo: true,
                                repeat: -1,
                                ease: 'power1.inOut'
                            });
                        }
                    }
                },
                1.0
            );
        }
    }

    // =========================================================================
    // 3. HERO MOUSE PARALLAX (DESKTOP ONLY)
    // =========================================================================
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
    if (heroSection) {
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

        // Keep logo large for first 10% of scroll
        heroScrollTimeline.to({}, { duration: 0.1 });

        // 1. Move logo up cleanly into upper viewport (safely beneath 80px navbar) and scale to balanced size
        heroScrollTimeline.to('#hero-logo-wrap', {
            scale: 0.46,
            y: '-17vh',
            duration: 0.48,
            ease: 'power2.inOut'
        }, 0.12);

        // 2. Reveal text block container directly underneath the translated logo
        heroScrollTimeline.to('#hero-text-block', {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.4,
            ease: 'power2.out'
        }, 0.28);

        // 3. Make inner-text ("WE FRAME" & "YOUR VISION") come up cleanly from under the logo
        heroScrollTimeline.to('#hero-title .inner-text', {
            y: '0%',
            stagger: 0.08,
            duration: 0.42,
            ease: 'power3.out'
        }, 0.30);

        // 4. Reveal subtitle text under the title
        heroScrollTimeline.to('#hero-subtitle', {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: 'power2.out'
        }, 0.38);

        // Fade out explore indicator quickly as scroll starts
        heroScrollTimeline.to('#explore-indicator', {
            opacity: 0,
            y: -20,
            duration: 0.2,
            ease: 'power1.in'
        }, 0.05);

        // Background parallax shifting
        heroScrollTimeline.to('#hero-bg-image', {
            y: '8vh',
            ease: 'none',
            duration: 0.6
        }, 0.2);
    }

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

    if (daysVal && hoursVal && minutesVal && secondsVal) {
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
    }

    // Fade-in animations for Countdown Section Entrance
    if (document.getElementById('launch')) {
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
    }

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

    // =========================================================================
    // 8. SITE HEADER SCROLL ELEVATION
    // =========================================================================
    const siteHeader = document.getElementById('site-header');
    if (siteHeader) {
        const handleHeaderScroll = () => {
            if (window.scrollY > 40) {
                siteHeader.classList.add('scrolled');
            } else {
                siteHeader.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleHeaderScroll, { passive: true });
        handleHeaderScroll();
    }

    // =========================================================================
    // 9. RESPONSIVE MOBILE NAVIGATION DRAWER
    // =========================================================================
    const navToggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.classList.toggle('open');
            mobileMenu.classList.toggle('active', isOpen);
            navToggle.setAttribute('aria-expanded', isOpen.toString());
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close when clicking mobile menu links
        const closeLinks = mobileMenu.querySelectorAll('.mobile-nav-link, .mobile-menu-cta');
        closeLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                mobileMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Close on ESC key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                navToggle.classList.remove('open');
                mobileMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    // =========================================================================
    // 10. FAQ ACCORDION ENGINE (CONTACT PAGE)
    // =========================================================================
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const questionBtn = item.querySelector('.faq-question');
            if (questionBtn) {
                questionBtn.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    faqItems.forEach(other => other.classList.remove('active'));
                    if (!isActive) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    // =========================================================================
    // 11. INTERACTIVE CONTACT FORM SUBMISSION
    // =========================================================================
    const contactForm = document.getElementById('contact-form');
    const formSuccessAlert = document.getElementById('form-success-alert');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.form-submit-btn');
            const originalText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending Message...';

            setTimeout(() => {
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;

                if (formSuccessAlert) {
                    formSuccessAlert.style.display = 'block';
                    formSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    setTimeout(() => {
                        formSuccessAlert.style.display = 'none';
                    }, 8000);
                }
            }, 900);
        });

        // Auto-select service dropdown if specified in URL query
        const urlParams = new URLSearchParams(window.location.search);
        const serviceParam = urlParams.get('service');
        const serviceSelect = document.getElementById('contact-service');
        if (serviceParam && serviceSelect) {
            const cleanParam = serviceParam.toLowerCase().replace(/[^a-z0-9]/g, '');
            for (let i = 0; i < serviceSelect.options.length; i++) {
                const optText = serviceSelect.options[i].text.toLowerCase().replace(/[^a-z0-9]/g, '');
                const optVal = serviceSelect.options[i].value.toLowerCase().replace(/[^a-z0-9]/g, '');
                if (optText.includes(cleanParam) || optVal.includes(cleanParam) || cleanParam.includes(optVal)) {
                    serviceSelect.selectedIndex = i;
                    break;
                }
            }
        }
    }

    // =========================================================================
    // 12. SERVICES QUICK-NAV SCROLL SPY (SERVICES PAGE)
    // =========================================================================
    const quickNavLinks = document.querySelectorAll('.quick-nav-link');
    const serviceCards = document.querySelectorAll('.service-showcase-card');

    if (quickNavLinks.length > 0 && serviceCards.length > 0) {
        window.addEventListener('scroll', () => {
            let currentActiveId = '';
            const scrollPos = window.scrollY + 220;

            serviceCards.forEach(card => {
                const top = card.offsetTop;
                const height = card.offsetHeight;
                if (scrollPos >= top && scrollPos < top + height) {
                    currentActiveId = card.id;
                }
            });

            if (currentActiveId) {
                quickNavLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === '#' + currentActiveId) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        }, { passive: true });
    }
});
