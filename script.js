// Custom JavaScript for Si Tayeb Toufik Portfolio

document.addEventListener('DOMContentLoaded', () => {
    const menuIcon = document.getElementById('menu-icon');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('.section'); // For active link highlighting

    // --- Mobile Menu Toggle ---
    if (menuIcon && navbar) {
        menuIcon.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent click from bubbling to document
            navbar.classList.toggle('active');
            // Toggle ARIA expanded attribute for accessibility
            const isExpanded = navbar.classList.contains('active');
            menuIcon.setAttribute('aria-expanded', String(isExpanded));
            if (isExpanded) {
                menuIcon.classList.remove('bx-menu');
                menuIcon.classList.add('bx-x'); // Change to close icon
            } else {
                menuIcon.classList.remove('bx-x');
                menuIcon.classList.add('bx-menu'); // Change back to menu icon
            }
        });

        // Close mobile menu when a nav link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbar.classList.contains('active')) {
                    navbar.classList.remove('active');
                    menuIcon.setAttribute('aria-expanded', 'false');
                    menuIcon.classList.remove('bx-x');
                    menuIcon.classList.add('bx-menu');
                }
            });
        });

        // Close mobile menu when clicking outside of it
        document.addEventListener('click', (event) => {
            if (navbar.classList.contains('active')) {
                const isClickInsideNavbar = navbar.contains(event.target);
                const isClickOnMenuIcon = menuIcon && menuIcon.contains(event.target);
                if (!isClickInsideNavbar && !isClickOnMenuIcon) {
                    navbar.classList.remove('active');
                    menuIcon.setAttribute('aria-expanded', 'false');
                    menuIcon.classList.remove('bx-x');
                    menuIcon.classList.add('bx-menu');
                }
            }
        });
    }

    // --- Smooth Scrolling ---
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Ensure it's an internal link
            if (href && href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const targetId = href.substring(1); // Remove '#'
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const headerOffset = header ? header.offsetHeight : 0;
                    // window.pageYOffset is deprecated, window.scrollY is the modern equivalent
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

    // --- Active Nav Link Highlighting on Scroll ---
    const activateNavLink = () => {
        // Guard against missing elements
        if (!header || sections.length === 0 || navLinks.length === 0) {
            return;
        }

        let currentSectionId = '';
        const headerHeight = header.offsetHeight;
        const scrollPosition = (window.scrollY || window.pageYOffset) + headerHeight + 70; // Offset for better timing

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        // Fallback logic for top/bottom of page
        if (!currentSectionId) {
            if ((window.scrollY || window.pageYOffset) < sections[0].offsetTop - headerHeight) {
                currentSectionId = sections[0].getAttribute('id');
            } else {
                // If scrolled past all sections, keep the last one active or clear all
                // For simplicity, let's try to find the closest one if scrolled past all
                let lastVisibleSection = '';
                for (let i = sections.length - 1; i >= 0; i--) {
                    if ((window.scrollY || window.pageYOffset) >= sections[i].offsetTop - headerHeight - 50) {
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
    activateNavLink(); // Initial call to set active link on page load

    // --- Header Scroll Effect ---
    if (header) {
        window.addEventListener('scroll', () => {
            if ((window.scrollY || window.pageYOffset) > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // --- Scroll Animations with Intersection Observer ---
    const animatedElements = document.querySelectorAll('.fade-in');

    if (animatedElements.length > 0) {
        const observerOptions = {
            root: null, // relative to document viewport
            rootMargin: '0px 0px -50px 0px', // Trigger a bit before element is fully in view
            threshold: 0.1 // 10% of the element is visible
        };

        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('appear');
                    }, delay);
                    observer.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => {
            animationObserver.observe(el);
        });
    } else {
        // console.warn("No elements with class 'fade-in' found for IntersectionObserver.");
    }

    // --- Typewriter Effect ---
    const typewriterTextElement = document.getElementById('typewriter-text');
    if (typewriterTextElement) {
        const textsToType = ["Security", "Tech Support", "Problem Solving"];
        let textIndex = 0;
        let charIndex = 0;
        const typingSpeed = 120; // Milliseconds per character
        const erasingSpeed = 60; // Milliseconds per character for erasing
        const pauseBetweenWords = 2000; // Pause after typing a word
        const pauseBeforeTypingNewWord = 500; // Pause before starting a new word

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
                textIndex = (textIndex + 1) % textsToType.length; // Move to the next text
                setTimeout(type, pauseBeforeTypingNewWord);
            }
        }

        setTimeout(type, pauseBeforeTypingNewWord); // Start the typing animation
    }


    // --- Contact Form Submission (Demo) ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        
        // Ensure submitButton exists before proceeding
        if (!submitButton) {
            console.error("Submit button not found in the contact form. Please ensure your form has a button with type='submit'.");
            return; // Stop further execution for this form if no submit button
        }
        
        const originalButtonText = submitButton.textContent;

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent actual form submission

            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            // Remove any existing message
            const existingMessage = this.querySelector('.form-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            const formMessage = document.createElement('p');
            formMessage.classList.add('form-message');
            formMessage.style.marginTop = '1rem';
            formMessage.style.padding = '0.75rem';
            formMessage.style.borderRadius = 'var(--border-radius-sm)';
            formMessage.style.textAlign = 'center';
            formMessage.style.transition = 'opacity 0.5s ease-in-out';
            formMessage.style.opacity = '0'; // Start transparent for fade-in

            // Simulate form submission (replace with actual submission logic if needed)
            // For a real backend, you would use fetch() or XMLHttpRequest here.
            setTimeout(() => {
                try {
                    // Simulate success
                    formMessage.textContent = 'Message sent successfully! (Demo)';
                    formMessage.style.backgroundColor = 'var(--accent-color)';
                    formMessage.style.color = 'var(--primary-color)';
                    
                    // Insert message before the button
                    this.insertBefore(formMessage, submitButton);
                    
                    // Ensure layout is updated before starting opacity transition
                    requestAnimationFrame(() => {
                        formMessage.style.opacity = '1'; // Fade in
                    });

                    this.reset(); // Clear the form fields

                    // Set timeout to remove the message after a few seconds
                    setTimeout(() => {
                        formMessage.style.opacity = '0'; // Fade out
                        setTimeout(() => {
                            if (formMessage.parentNode) { // Check if still in DOM before removing
                                formMessage.remove();
                            }
                        }, 500); // Remove after fade out animation (500ms)
                    }, 5000); // Message visible for 5 seconds

                } catch (error) {
                    console.error("Error displaying success/error message:", error);
                    // Display an error message to the user
                    formMessage.textContent = 'An error occurred. Please try again.';
                    formMessage.style.backgroundColor = 'red'; // Or a more theme-appropriate error color
                    formMessage.style.color = 'white';
                    this.insertBefore(formMessage, submitButton);
                     requestAnimationFrame(() => { // Ensure DOM update before opacity change
                        formMessage.style.opacity = '1';
                    });
                } finally {
                    // This block will execute regardless of whether an error occurred or not
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }
            }, 1000); // Simulate network delay (e.g., 1 second)
        });
    } else {
        // console.warn("Contact form with class '.contact-form' not found.");
    }
});
