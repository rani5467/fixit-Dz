document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle-button');
    const navLinksContainer = document.querySelector('.nav-links-container');
    const navLinks = document.querySelectorAll('.nav-links .nav-link'); // More specific selector
    const header = document.querySelector('.navbar'); // HTML uses class="navbar" for the header
    const sections = document.querySelectorAll('.section');
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    // --- Mobile Menu Toggle ---
    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinksContainer.classList.toggle('active');
            menuToggle.classList.toggle('active'); // For animating the hamburger icon itself
            const isExpanded = navLinksContainer.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', String(isExpanded));
        });

        // Close menu when a nav link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinksContainer.classList.contains('active')) {
                    navLinksContainer.classList.remove('active');
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Close mobile menu when clicking outside of it
        document.addEventListener('click', (event) => {
            if (navLinksContainer.classList.contains('active') && !navLinksContainer.contains(event.target) && !menuToggle.contains(event.target)) {
                navLinksContainer.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    } else {
        console.warn("Menu toggle button or nav links container not found.");
    }

    // --- Smooth Scrolling ---
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
                } else {
                    console.warn(`Smooth scroll target not found: #${targetId}`);
                }
            }
        });
    });

    // --- Active Nav Link Highlighting & Header Scroll Effect ---
    const handleScroll = () => {
        let currentSectionId = '';
        const headerHeight = header ? header.offsetHeight : 0;
        const scrollPosition = window.scrollY + headerHeight + 70; // Offset for better timing

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

        // Header scroll effect
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Scroll-to-top button visibility
        if (scrollToTopBtn) {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    // --- Scroll-to-Top Button Functionality ---
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    // --- Scroll Animations with Intersection Observer ---
    const animatedElements = document.querySelectorAll('.fade-in');
    if (animatedElements.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

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

        animatedElements.forEach(el => {
            animationObserver.observe(el);
        });
    }

    // --- Typewriter Effect ---
    const typewriterTextElement = document.getElementById('typewriter-text');
    if (typewriterTextElement) {
        const textsToType = ["وأنت في مكانك!", "بكل سهولة وأمان.", "بخبرة واحترافية."];
        let textIndex = 0;
        let charIndex = 0;
        const typingSpeed = 100;
        const erasingSpeed = 50;
        const pauseBetweenWords = 2000;
        const pauseBeforeTypingNewWord = 500;

        function type() {
            if (charIndex < textsToType[textIndex].length) {
                typewriterTextElement.textContent += textsToType[textIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, typingSpeed);
            } else {
                setTimeout(erase, pauseBetweenWords);
            }
        }

        function erase() {
            if (charIndex > 0) {
                typewriterTextElement.textContent = textsToType[textIndex].substring(0, charIndex - 1);
                charIndex--;
                setTimeout(erase, erasingSpeed);
            } else {
                textIndex = (textIndex + 1) % textsToType.length;
                setTimeout(type, pauseBeforeTypingNewWord);
            }
        }
        // Clear initial placeholder content if any, then start typing
        typewriterTextElement.textContent = '';
        setTimeout(type, pauseBeforeTypingNewWord);
    }

    // --- Contact Form Submission (Demo) ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const formMessageArea = contactForm.querySelector('.form-message-area'); // Get the message area

        if (!submitButton) {
            console.error("Submit button not found in the contact form.");
            return;
        }
        if (!formMessageArea) {
            console.error("Form message area (.form-message-area) not found in the contact form.");
            return;
        }
        
        const originalButtonText = submitButton.textContent;

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Crucial to prevent default submission and 405 error

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


            // Simulate form submission (replace with actual AJAX/Fetch call to your backend)
            setTimeout(() => {
                try {
                    // Simulate success
                    formMessage.textContent = 'تم إرسال رسالتك بنجاح! (تجريبي)'; // Message sent successfully! (Demo)
                    formMessage.style.backgroundColor = 'var(--accent-color)';
                    formMessage.style.color = 'var(--primary-color)';
                    
                    formMessageArea.appendChild(formMessage);
                    requestAnimationFrame(() => { // Ensure element is in DOM for transition
                         setTimeout(() => formMessage.style.opacity = '1', 10); // Fade in
                    });

                    this.reset(); // Clear the form fields

                    setTimeout(() => {
                        formMessage.style.opacity = '0';
                        setTimeout(() => {
                            if (formMessage.parentNode) {
                                formMessage.remove();
                            }
                        }, 300); // Remove after fade out
                    }, 5000); // Message visible for 5 seconds

                } catch (error) {
                    console.error("Error displaying success/error message:", error);
                    formMessage.textContent = 'حدث خطأ. يرجى المحاولة مرة أخرى.'; // An error occurred. Please try again.
                    formMessage.style.backgroundColor = '#d9534f'; // Bootstrap danger color
                    formMessage.style.color = 'white';
                    formMessageArea.appendChild(formMessage);
                    requestAnimationFrame(() => {
                         setTimeout(() => formMessage.style.opacity = '1', 10);
                    });
                } finally {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }
            }, 1000); // Simulate network delay
        });
    } else {
        // console.warn("Contact form with class '.contact-form' not found.");
    }

    // --- Update Footer Year ---
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
