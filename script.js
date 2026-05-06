/* ==========================================
   NESTBRIDGE SERVICES — GLOBAL SCRIPTS
   Covers: all pages
   ========================================== */

// ===== MOBILE MENU TOGGLE =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
        });
    });
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== CONTACT FORM — EmailJS =====
var contactForm = document.getElementById('contact-form');
var formMessage = document.getElementById('form-message');

if (contactForm) {
    (function() {
        if (typeof emailjs !== 'undefined') {
            emailjs.init("gtk8dp7JN_SxXrvXq");
        }
    })();

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        var submitBtn = contactForm.querySelector('button[type="submit"]');
        var originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        if (typeof emailjs !== 'undefined') {
            emailjs.sendForm("service_kw5hgvg", "template_uaxt8m9", this)
                .then(function() {
                    formMessage.style.color = '#2d6a4f';
                    formMessage.textContent = '✅ Message sent successfully! We\'ll get back to you soon.';
                    contactForm.reset();
                })
                .catch(function(error) {
                    formMessage.style.color = '#dc2626';
                    formMessage.textContent = '❌ Failed to send. Please WhatsApp us instead.';
                    console.error('EmailJS error:', error);
                })
                .finally(function() {
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

// ===== SCROLL REVEAL ANIMATION =====
var sections = document.querySelectorAll('section');

if (sections.length > 0) {
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    sections.forEach(function(section) {
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

    window.addEventListener('load', function() {
        sections.forEach(function(section) {
            var rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    });
}

// ===== GALLERY FILTER =====
var filterButtons = document.querySelectorAll('.filter-btn');
var galleryItems = document.querySelectorAll('.gallery-item');

if (filterButtons.length > 0 && galleryItems.length > 0) {
    filterButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            filterButtons.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');

            var filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(function(item) {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    setTimeout(function() { item.style.opacity = '1'; }, 10);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// ===== LIGHTBOX =====
var lightbox = document.getElementById('lightbox');
var lightboxImg = document.getElementById('lightboxImg');
var lightboxCaption = document.getElementById('lightboxCaption');
var lightboxClose = document.getElementById('lightboxClose');
var lightboxPrev = document.getElementById('lightboxPrev');
var lightboxNext = document.getElementById('lightboxNext');

if (lightbox && lightboxImg) {
    var currentImageIndex = 0;
    var visibleImages = [];

    var masonryGrid = document.getElementById('masonryGrid');
    if (masonryGrid) {
        masonryGrid.addEventListener('click', function(e) {
            var galleryItem = e.target.closest('.gallery-item');
            if (!galleryItem) return;

            visibleImages = Array.from(galleryItems).filter(function(item) {
                return item.style.display !== 'none';
            });
            currentImageIndex = visibleImages.indexOf(galleryItem);

            updateLightbox();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    function updateLightbox() {
        if (visibleImages.length === 0) return;
        var item = visibleImages[currentImageIndex];
        var img = item.querySelector('img');
        var caption = item.querySelector('.gallery-overlay');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        if (caption) {
            lightboxCaption.textContent = caption.querySelector('h4').textContent + ' — ' + caption.querySelector('span').textContent;
        }
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) closeLightbox();
    });

    lightboxPrev.addEventListener('click', function(e) {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
        updateLightbox();
    });

    lightboxNext.addEventListener('click', function(e) {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
        updateLightbox();
    });

    document.addEventListener('keydown', function(e) {
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

// ===== TESTIMONIAL SLIDER =====
var testimonialCards = document.querySelectorAll('.testimonial-card');
var dots = document.querySelectorAll('#testimonialDots .dot');
var prevBtn = document.getElementById('testimonialPrev');
var nextBtn = document.getElementById('testimonialNext');

if (testimonialCards.length > 0 && dots.length > 0) {
    var currentSlide = 0;
    var autoSlideInterval;

    function showSlide(index) {
        testimonialCards.forEach(function(card) { card.classList.remove('active'); });
        dots.forEach(function(dot) { dot.classList.remove('active'); });
        testimonialCards[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        var next = (currentSlide + 1) % testimonialCards.length;
        showSlide(next);
    }

    function prevSlide() {
        var prev = (currentSlide - 1 + testimonialCards.length) % testimonialCards.length;
        showSlide(prev);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            prevSlide();
            resetAutoSlide();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nextSlide();
            resetAutoSlide();
        });
    }

    dots.forEach(function(dot) {
        dot.addEventListener('click', function() {
            var index = parseInt(dot.getAttribute('data-index'));
            showSlide(index);
            resetAutoSlide();
        });
    });

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    startAutoSlide();

    var slider = document.getElementById('testimonialSlider');
    if (slider) {
        slider.addEventListener('mouseenter', function() { clearInterval(autoSlideInterval); });
        slider.addEventListener('mouseleave', startAutoSlide);
    }
}

// ===== DARK MODE TOGGLE =====
var themeToggle = document.getElementById('themeToggle');
var body = document.body;

var savedTheme = localStorage.getItem('nestbridge-theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    updateThemeIcon(true);
}

if (themeToggle) {
    themeToggle.addEventListener('click', function() {
        var isDark = body.classList.toggle('dark-mode');
        localStorage.setItem('nestbridge-theme', isDark ? 'dark' : 'light');
        updateThemeIcon(isDark);
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(function() {
            themeToggle.style.transform = 'rotate(0deg)';
        }, 400);
    });
}

function updateThemeIcon(isDark) {
    if (!themeToggle) return;
    var icon = themeToggle.querySelector('i');
    if (icon) {
        if (isDark) {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
}

// ===== BLOG NEWSLETTER SIGNUP =====
var newsletterForm = document.getElementById('newsletterForm');
var newsletterMessage = document.getElementById('newsletterMessage');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var emailInput = this.querySelector('input[type="email"]');
        var email = emailInput.value.trim();

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