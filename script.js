/* ==========================================
   NESTBRIDGE SERVICES — GLOBAL SCRIPTS
   Covers: index.html + gallery.html
   ========================================== */

// ===== MOBILE MENU TOGGLE =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
} else {
    console.warn('Mobile menu: hamburger or navLinks not found on this page.');
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== CONTACT FORM — EmailJS (index.html only) =====
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (contactForm) {
    // Initialize EmailJS with YOUR real public key
    (function() {
        if (typeof emailjs !== 'undefined') {
            emailjs.init("gtk8dp7JN_SxXrvXq"); // ← MUST have quotes!
        }
    })();

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        if (typeof emailjs !== 'undefined') {
            emailjs.sendForm("service_kw5hgvg", "template_uaxt8m9", this)
                .then(() => {
                    formMessage.style.color = '#2d6a4f';
                    formMessage.textContent = '✅ Message sent successfully! We\'ll get back to you soon.';
                    contactForm.reset();
                })
                .catch(error => {
                    formMessage.style.color = '#dc2626';
                    formMessage.textContent = '❌ Failed to send. Please WhatsApp us instead.';
                    console.error('EmailJS error:', error);
                })
                .finally(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        } else {
            formMessage.style.color = '#dc2626';
            formMessage.textContent = '❌ Email service not configured. Please WhatsApp us.';
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ===== SCROLL REVEAL ANIMATION (index.html) =====
const sections = document.querySelectorAll('section');

if (sections.length > 0) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        // Only apply to index page sections (not gallery page)
        if (!section.classList.contains('page-header') && 
            !section.classList.contains('filter-section') && 
            !section.classList.contains('gallery-wrapper') &&
            !section.classList.contains('cta-banner')) {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(section);
        }
    });

    // Trigger visible sections on load
    window.addEventListener('load', () => {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    });
}

// ==========================================
// GALLERY PAGE SCRIPTS
// ==========================================

// ===== FILTER FUNCTIONALITY =====
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

if (filterButtons.length > 0 && galleryItems.length > 0) {
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    setTimeout(() => { item.style.opacity = '1'; }, 10);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// ===== LIGHTBOX FUNCTIONALITY =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

if (lightbox && lightboxImg) {
    let currentImageIndex = 0;
    let visibleImages = [];

    // Open lightbox
    const masonryGrid = document.getElementById('masonryGrid');
    if (masonryGrid) {
        masonryGrid.addEventListener('click', (e) => {
            const galleryItem = e.target.closest('.gallery-item');
            if (!galleryItem) return;

            visibleImages = Array.from(galleryItems).filter(item => item.style.display !== 'none');
            currentImageIndex = visibleImages.indexOf(galleryItem);

            updateLightbox();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    function updateLightbox() {
        if (visibleImages.length === 0) return;

        const item = visibleImages[currentImageIndex];
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-overlay');

        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;

        if (caption) {
            lightboxCaption.textContent = caption.querySelector('h4')?.textContent + 
                                          ' — ' + 
                                          caption.querySelector('span')?.textContent;
        }
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Navigate
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
        updateLightbox();
    });

    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
        updateLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') {
            currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
            updateLightbox();
        }
        if (e.key === 'ArrowRight') {
            currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
            updateLightbox();
        }
    });
}

// ==========================================
// TESTIMONIAL SLIDER
// ==========================================

const testimonialCards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('#testimonialDots .dot');
const prevBtn = document.getElementById('testimonialPrev');
const nextBtn = document.getElementById('testimonialNext');

if (testimonialCards.length > 0 && dots.length > 0) {
    let currentSlide = 0;
    let autoSlideInterval;

    function showSlide(index) {
        // Hide all cards
        testimonialCards.forEach(card => card.classList.remove('active'));
        // Remove active from all dots
        dots.forEach(dot => dot.classList.remove('active'));

        // Show selected
        testimonialCards[index].classList.add('active');
        dots[index].classList.add('active');

        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % testimonialCards.length;
        showSlide(next);
    }

    function prevSlide() {
        const prev = (currentSlide - 1 + testimonialCards.length) % testimonialCards.length;
        showSlide(prev);
    }

    // Button clicks
    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });

    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });

    // Dot clicks
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            showSlide(index);
            resetAutoSlide();
        });
    });

    // Auto-slide every 5 seconds
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Start auto-sliding
    startAutoSlide();

    // Pause on hover
    const slider = document.getElementById('testimonialSlider');
    if (slider) {
        slider.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        slider.addEventListener('mouseleave', startAutoSlide);
    }
}// ==========================================
// DARK MODE TOGGLE
// ==========================================

const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme in localStorage
const savedTheme = localStorage.getItem('nestbridge-theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    updateThemeIcon(true);
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDark = body.classList.toggle('dark-mode');
        
        // Save preference
        localStorage.setItem('nestbridge-theme', isDark ? 'dark' : 'light');
        
        // Update icon
        updateThemeIcon(isDark);
        
        // Small animation
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'rotate(0deg)';
        }, 400);
    });
}

function updateThemeIcon(isDark) {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    if (isDark) {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}
// ==========================================
// BLOG NEWSLETTER SIGNUP
// ==========================================

const newsletterForm = document.getElementById('newsletterForm');
const newsletterMessage = document.getElementById('newsletterMessage');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();

        if (email && email.includes('@') && email.includes('.')) {
            newsletterMessage.style.color = '#2d6a4f';
            newsletterMessage.textContent = '🎉 Thanks for subscribing! We\'ll keep you updated.';
            emailInput.value = '';
        } else {
            newsletterMessage.style.color = '#dc2626';
            newsletterMessage.textContent = 'Please enter a valid email address.';
        }
    });
}
console.log('🌾 Nestbridge Services — scripts loaded successfully!');