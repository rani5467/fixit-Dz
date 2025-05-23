// (Keep all your existing JavaScript code for menu, scroll, animations, etc.)

// --- Contact Form Submission (Modified for PHP backend) ---
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formMessageArea = contactForm.querySelector('.form-message-area');

    if (!submitButton) {
        console.error("Submit button not found in the contact form.");
    } else if (!formMessageArea) {
        console.error("Form message area (.form-message-area) not found in the contact form.");
    } else {
        const originalButtonText = submitButton.textContent;

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default browser submission

            submitButton.disabled = true;
            submitButton.textContent = 'جاري الإرسال...'; // Sending...

            // Clear previous messages
            formMessageArea.innerHTML = '';
            const formMessage = document.createElement('p');
            formMessage.style.padding = '10px';
            formMessage.style.marginTop = '15px';
            formMessage.style.borderRadius = 'var(--border-radius-sm)';
            formMessage.style.textAlign = 'center';
            formMessage.style.transition = 'opacity 0.3s ease-in-out';
            formMessage.style.opacity = '0';

            const formData = new FormData(this);

            fetch('send_email.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    formMessage.textContent = data.message || 'تم إرسال رسالتك بنجاح!';
                    formMessage.style.backgroundColor = 'var(--accent-color)';
                    formMessage.style.color = 'var(--primary-color)';
                    contactForm.reset(); // Clear the form fields
                } else {
                    formMessage.textContent = data.message || 'حدث خطأ. يرجى المحاولة مرة أخرى.';
                    formMessage.style.backgroundColor = '#d9534f'; // Error red
                    formMessage.style.color = 'white';
                }
            })
            .catch(error => {
                console.error('Error submitting form:', error);
                formMessage.textContent = 'حدث خطأ في الاتصال. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.';
                formMessage.style.backgroundColor = '#d9534f';
                formMessage.style.color = 'white';
            })
            .finally(() => {
                formMessageArea.appendChild(formMessage);
                requestAnimationFrame(() => {
                    setTimeout(() => formMessage.style.opacity = '1', 10); // Fade in
                });

                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;

                // Optionally hide the message after some time, unless it's an error users need to see
                if (formMessage.style.backgroundColor !== 'red') { // Or check data.status
                    setTimeout(() => {
                        formMessage.style.opacity = '0';
                        setTimeout(() => {
                            if (formMessage.parentNode) {
                                formMessage.remove();
                            }
                        }, 300);
                    }, 7000); // Message visible for 7 seconds
                }
            });
        });
    }
}

// --- Ensure other JavaScript functions from the previous version are here ---
// For example: Mobile Menu Toggle, Smooth Scrolling, Active Nav Link Highlighting,
// Header Scroll Effect, Scroll Animations with Intersection Observer, Typewriter Effect,
// Update Footer Year, Scroll-to-Top Button.

// Example of other functions that should remain:
const menuToggle = document.getElementById('menu-toggle-button');
const navLinksContainer = document.querySelector('.nav-links-container');
const navLinks = document.querySelectorAll('.nav-links .nav-link');
const header = document.querySelector('.navbar');
const sections = document.querySelectorAll('.section');
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

if (menuToggle && navLinksContainer) {
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinksContainer.classList.toggle('active');
        menuToggle.classList.toggle('active');
        const isExpanded = navLinksContainer.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', String(isExpanded));
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    document.addEventListener('click', (event) => {
        if (navLinksContainer.classList.contains('active') && !navLinksContainer.contains(event.target) && !menuToggle.contains(event.target)) {
            navLinksContainer.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#') && href.length > 1) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerOffset = header ? header.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

const activateNavLink = () => {
    if (!header || sections.length === 0 || navLinks.length === 0) { return; }
    let currentSectionId = '';
    const headerHeight = header.offsetHeight;
    const scrollPosition = window.scrollY + headerHeight + 70;
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            currentSectionId = section.getAttribute('id');
        }
    });
    if (!currentSectionId && sections.length > 0) {
        if (window.scrollY < sections[0].offsetTop - headerHeight) {
            currentSectionId = sections[0].getAttribute('id');
        } else {
            let lastVisibleSection = '';
            for (let i = sections.length - 1; i >= 0; i--) {
                if (window.scrollY >= sections[i].offsetTop - headerHeight - 50) {
                    lastVisibleSection = sections[i].getAttribute('id');
                    break;
                }
            }
            currentSectionId = lastVisibleSection || (sections.length > 0 ? sections[0].getAttribute('id') : '');
        }
    }
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
        }
    });
};
window.addEventListener('scroll', activateNavLink, { passive: true });
activateNavLink();

if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });
}

const animatedElements = document.querySelectorAll('.fade-in');
if (animatedElements.length > 0) {
    const observerOptions = { root: null, rootMargin: '0px 0px -50px 0px', threshold: 0.1 };
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('appear');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    animatedElements.forEach(el => animationObserver.observe(el));
}

const typewriterTextElement = document.getElementById('typewriter-text');
if (typewriterTextElement) {
    const textsToType = ["وأنت في مكانك!", "بكل سهولة وأمان.", "بخبرة واحترافية."];
    let textIndex = 0, charIndex = 0;
    const typeSpeed = 100, eraseSpeed = 50, pauseBetween = 2000, pauseBeforeNew = 500;
    function type() {
        if (charIndex < textsToType[textIndex].length) {
            typewriterTextElement.textContent += textsToType[textIndex].charAt(charIndex++);
            setTimeout(type, typeSpeed);
        } else {
            setTimeout(erase, pauseBetween);
        }
    }
    function erase() {
        if (charIndex > 0) {
            typewriterTextElement.textContent = textsToType[textIndex].substring(0, --charIndex);
            setTimeout(erase, eraseSpeed);
        } else {
            textIndex = (textIndex + 1) % textsToType.length;
            setTimeout(type, pauseBeforeNew);
        }
    }
    typewriterTextElement.textContent = '';
    setTimeout(type, pauseBeforeNew);
}

if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
     window.addEventListener('scroll', () => { // Keep this for scroll-to-top visibility
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }, { passive: true });
}


const yearSpan = document.getElementById('currentYear');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

}); // End of DOMContentLoaded
