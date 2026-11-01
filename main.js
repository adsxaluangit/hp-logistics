/* =============================================
   HP LOGISTICS – JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ─── Navbar scroll effect ───────────────────
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ─── Hamburger menu ─────────────────────────
    const hamburger = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    // Close menu on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
        });
    });

    // ─── Smooth scroll for all anchor links ─────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ─── Particle animation ─────────────────────
    const particlesContainer = document.getElementById('particles-container');
    const PARTICLE_COUNT = 25;

    function createParticle() {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 4 + 2;
        p.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${Math.random() * 100}%;
            animation-duration: ${Math.random() * 15 + 10}s;
            animation-delay: ${Math.random() * 10}s;
            opacity: ${Math.random() * 0.5 + 0.1};
        `;
        particlesContainer.appendChild(p);
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        createParticle();
    }

    // ─── Scroll reveal animation ─────────────────
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // stagger children
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, 0);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => revealObserver.observe(el));

    // ─── Counter animation ───────────────────────
    function animateCounter(el, target, duration = 2000) {
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) {
                start = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(start);
        }, 16);
    }

    const statsSection = document.getElementById('stats');
    let statsAnimated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                document.querySelectorAll('.stat-value[data-target]').forEach(el => {
                    const target = parseInt(el.getAttribute('data-target'));
                    animateCounter(el, target);
                });
            }
        });
    }, { threshold: 0.3 });

    if (statsSection) statsObserver.observe(statsSection);

    // ─── Contact form ────────────────────────────
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const service = document.getElementById('service').value;

            if (!name || !phone || !service) {
                // Simple highlight missing fields
                if (!name) document.getElementById('name').style.borderColor = '#FF6B35';
                if (!phone) document.getElementById('phone').style.borderColor = '#FF6B35';
                if (!service) document.getElementById('service').style.borderColor = '#FF6B35';

                setTimeout(() => {
                    document.getElementById('name').style.borderColor = '';
                    document.getElementById('phone').style.borderColor = '';
                    document.getElementById('service').style.borderColor = '';
                }, 3000);
                return;
            }

            // Simulate sending
            btnText.textContent = 'Đang gửi...';
            submitBtn.disabled = true;

            setTimeout(() => {
                btnText.textContent = 'Gửi Yêu Cầu Ngay';
                submitBtn.disabled = false;
                formSuccess.classList.add('show');
                contactForm.reset();
                setTimeout(() => {
                    formSuccess.classList.remove('show');
                }, 5000);
            }, 1500);
        });

        // Reset border on input
        contactForm.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('input', () => {
                input.style.borderColor = '';
            });
        });
    }

    // ─── Active nav link on scroll ───────────────
    const sections = document.querySelectorAll('section[id]');
    const navLinkEls = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinkEls.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${current}`) {
                link.style.color = 'var(--white)';
            }
        });
    });

    // ─── Floating CTA visibility ─────────────────
    const floatingCta = document.getElementById('floating-cta');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            floatingCta.style.opacity = '1';
            floatingCta.style.pointerEvents = 'auto';
        } else {
            floatingCta.style.opacity = '0';
            floatingCta.style.pointerEvents = 'none';
        }
    });
    // Initially hidden
    floatingCta.style.opacity = '0';
    floatingCta.style.transition = 'opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease';
    floatingCta.style.pointerEvents = 'none';

    // ─── Service card hover parallax ────────────
    document.querySelectorAll('.service-image-wrap').forEach(wrap => {
        wrap.addEventListener('mousemove', (e) => {
            const rect = wrap.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            const img = wrap.querySelector('.service-img');
            if (img) {
                img.style.transform = `scale(1.05) translate(${x * 10}px, ${y * 10}px)`;
            }
        });
        wrap.addEventListener('mouseleave', () => {
            const img = wrap.querySelector('.service-img');
            if (img) img.style.transform = '';
        });
    });

    // ─── Why cards stagger ───────────────────────
    document.querySelectorAll('.why-card').forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.08}s`;
    });

    document.querySelectorAll('.stat-card').forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.1}s`;
    });

    // ─── Scroll Progress Bar (Animate UI) ────────
    const progressBar = document.getElementById('scroll-progress-bar');
    window.addEventListener('scroll', () => {
        if (progressBar) {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = `${progress}%`;
        }
    }, { passive: true });

    // ─── Interactive Card Spotlight (Animate UI) ──
    const spotlightCards = document.querySelectorAll('.spotlight-card, .stat-card, .why-card, .testimonial-card, .about-card-main');
    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

});

