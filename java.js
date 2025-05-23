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
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                } else {
                    console.warn(`Target element #${targetId} not found for smooth scroll.`);
                }
            }
        });
    });

    // --- Active Nav Link Highlighting on Scroll ---
    const activateNavLink = () => {
        let currentSectionId = '';
        const headerOffset = header ? header.offsetHeight : 0;
        // Use window.scrollY for modern browsers, fallback to pageYOffset
        const scrollPosition = (window.scrollY || window.pageYOffset) + headerOffset + 70; // Added a bit more offset for better accuracy

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        // If no section is actively in view (e.g., at the very top or bottom)
        if (!currentSectionId && sections.length > 0) {
            if ((window.scrollY || window.pageYOffset) < sections[0].offsetTop - headerOffset) {
                currentSectionId = sections[0].getAttribute('id'); // Default to first section if above it
            } else if ((window.scrollY || window.pageYOffset) >= sections[sections.length - 1].offsetTop + sections[sections.length - 1].offsetHeight - window.innerHeight) {
                currentSectionId = sections[sections.length - 1].getAttribute('id'); // Default to last section if at the very bottom
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
    activateNavLink(); // Call on load to set initial active link

    // --- Header Scroll Effect ---
    if (header) {
        window.addEventListener('scroll', () => {
            // Use window.scrollY for modern browsers, fallback to pageYOffset
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
        const originalButtonText = submitButton ? submitButton.textContent : "Send Message";

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent actual form submission

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
            }

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
            // Example:
            // const formData = new FormData(this);
            // fetch('/your-server-endpoint', { method: 'POST', body: formData })
            //   .then(response => response.json())
            //   .then(data => {
            //     // Handle success
            //     formMessage.textContent = 'Message sent successfully!';
            //     formMessage.style.backgroundColor = 'var(--accent-color)';
            //     formMessage.style.color = 'var(--primary-color)';
            //     this.reset(); // Clear the form
            //   })
            //   .catch(error => {
            //     // Handle error
            //     console.error("Form submission error:", error);
            //     formMessage.textContent = 'An error occurred. Please try again.';
            //     formMessage.style.backgroundColor = 'red';
            //     formMessage.style.color = 'white';
            //   })
            //   .finally(() => {
            //      if (submitButton) {
            //          submitButton.disabled = false;
            //          submitButton.textContent = originalButtonText;
            //      }
            //      // Append and show message
            //      if (submitButton) { this.insertBefore(formMessage, submitButton); } else { this.appendChild(formMessage); }
            //      setTimeout(() => formMessage.style.opacity = '1', 10);
            //      setTimeout(() => {
            //          formMessage.style.opacity = '0';
            //          setTimeout(() => { if (formMessage.parentNode) { formMessage.remove(); } }, 500);
            //      }, 5000);
            //   });

            // Demo timeout for now:
            setTimeout(() => {
                try {
                    formMessage.textContent = 'Message sent successfully! (Demo)';
                    formMessage.style.backgroundColor = 'var(--accent-color)';
                    formMessage.style.color = 'var(--primary-color)';
                    
                    // Insert message before the button, or at the end of the form
                    if (submitButton) {
                        this.insertBefore(formMessage, submitButton);
                    } else {
                        this.appendChild(formMessage);
                    }
                    
                    // Ensure layout is updated before starting opacity transition
                    requestAnimationFrame(() => {
                        formMessage.style.opacity = '1';
                    });

                    this.reset(); // Clear the form fields

                    setTimeout(() => {
                        formMessage.style.opacity = '0';
                        setTimeout(() => {
                            if (formMessage.parentNode) { // Check if still in DOM
                                formMessage.remove();
                            }
                        }, 500); // Remove after fade out (500ms transition)
                    }, 5000); // Message visible for 5 seconds

                } catch (error) {
                    console.error("Error displaying success message:", error);
                    formMessage.textContent = 'An error occurred. Please try again.';
                    formMessage.style.backgroundColor = 'red'; // Or a more theme-appropriate error color
                    formMessage.style.color = 'white';
                    if (submitButton) {
                        this.insertBefore(formMessage, submitButton);
                    } else {
                        this.appendChild(formMessage);
                    }
                     requestAnimationFrame(() => {
                        formMessage.style.opacity = '1';
                    });
                } finally {
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.textContent = originalButtonText;
                    }
                }
            }, 1000); // Simulate network delay (increased to 1 second)
        });
    }
});