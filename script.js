// Custom JavaScript for Si Tayeb Toufik Portfolio

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selections ---
    const menuToggle = document.getElementById('menu-toggle-button');
    const navLinksContainer = document.querySelector('.nav-links-container');
    const navLinks = document.querySelectorAll('.nav-links .nav-link');
    const header = document.querySelector('.navbar'); // HTML uses class="navbar" for the header element
    const sections = document.querySelectorAll('.section');
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    const themeToggleButton = document.getElementById('theme-toggle');
    const typewriterTextElement = document.getElementById('typewriter-text');
    const contactFormElement = document.querySelector('.contact-form');
    const yearSpan = document.getElementById('currentYear');

    // --- Theme Toggle Functionality ---
    if (themeToggleButton) {
        const currentTheme = localStorage.getItem('theme');

        function applyTheme(theme) {
            if (theme === 'light') {
                document.body.classList.add('light-mode');
                themeToggleButton.checked = true;
            } else {
                document.body.classList.remove('light-mode');
                themeToggleButton.checked = false;
            }
        }

        // Apply the saved theme on initial load
        if (currentTheme) {
            applyTheme(currentTheme);
        } else {
            // Optional: Check for system preference if no theme is saved
            // const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
            // if (prefersDarkScheme.matches) {
            //     applyTheme('dark');
            // } else {
            //     applyTheme('light');
            // }
            // For now, defaults to dark as per CSS if no theme is saved.
        }

        themeToggleButton.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('light-mode');
                localStorage.setItem('theme', 'light');
            } else {
                document.body.classList.remove('light-mode');
                localStorage.setItem('theme', 'dark');
            }
        });
    } else {
        console.warn("Theme toggle button with ID 'theme-toggle' not found.");
    }

    // --- Mobile Menu Toggle ---
    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent click from bubbling to document
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
            if (navLinksContainer.classList.contains('active') && 
                !navLinksContainer.contains(event.target) && 
                !menuToggle.contains(event.target)) {
                navLinksContainer.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    } else {
        console.warn("Menu toggle button or nav links container not found. Ensure IDs and classes match HTML.");
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
        if (!header || sections.length === 0 || navLinks.length === 0) {
            return;
        }

        let currentSectionId = '';
        const headerHeight = header.offsetHeight;
        // Add a buffer to make highlighting more accurate when sections are short or scrolling fast
        const scrollPosition = window.scrollY + headerHeight + (window.innerHeight * 0.3); 

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        // Fallback for top/bottom of page
        if (!currentSectionId && sections.length > 0) {
            if (window.scrollY < sections[0].offsetTop - headerHeight) {
                currentSectionId = sections[0].getAttribute('id');
            } else if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 50) { // Check if near bottom
                currentSectionId = sections[sections.length - 1].getAttribute('id');
            }
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref && linkHref === `#${currentSectionId}`) {
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
    handleScroll(); // Initial call to set active link and header state

    // --- Scroll-to-Top Button Functionality ---
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    } else {
        // console.warn("Scroll to top button not found.");
    }

    // --- Scroll Animations with Intersection Observer ---
    const animatedElements = document.querySelectorAll('.fade-in');
    if (animatedElements.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px', // Trigger when element is 50px from bottom of viewport
            threshold: 0.1 // At least 10% of the element is visible
        };

        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('appear');
                    }, delay);
                    observer.unobserve(entry.target); // Animate only once
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => {
            animationObserver.observe(el);
        });
    }

    // --- Typewriter Effect ---
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
        typewriterTextElement.textContent = ''; // Clear initial content
        setTimeout(type, pauseBeforeTypingNewWord); // Start the typing animation
    } else {
        // console.warn("Typewriter text element with ID 'typewriter-text' not found.");
    }

    // --- Contact Form Submission (Using Fetch API for PHP backend) ---
    if (contactFormElement) {
        const submitButton = contactFormElement.querySelector('button[type="submit"]');
        const formMessageArea = contactFormElement.querySelector('.form-message-area');

        if (!submitButton) {
            console.error("Submit button not found in the contact form. Ensure your form has a button with type='submit'.");
        } else if (!formMessageArea) {
            console.error("Form message area (.form-message-area) not found in the contact form. Ensure this div exists within your form in index.html.");
        } else {
            const originalButtonText = submitButton.textContent;

            contactFormElement.addEventListener('submit', function(e) {
                e.preventDefault(); // Prevent default browser submission

                submitButton.disabled = true;
                submitButton.textContent = 'جاري الإرسال...'; // Sending...

                formMessageArea.innerHTML = ''; // Clear previous messages
                const formMessage = document.createElement('p');
                formMessage.style.padding = '10px';
                formMessage.style.marginTop = '15px';
                formMessage.style.borderRadius = 'var(--border-radius-sm)';
                formMessage.style.textAlign = 'center';
                formMessage.style.transition = 'opacity 0.3s ease-in-out';
                formMessage.style.opacity = '0'; // Start transparent for fade-in

                const formData = new FormData(this);
                let submissionWasSuccessful = false;

                fetch('send_email.php', { // Ensure send_email.php is in the same directory or provide correct path
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    if (!response.ok) {
                        // If server response is not OK (e.g., 404, 500), try to get text for more info
                        return response.text().then(text => {
                            throw new Error(`خطأ من الخادم: ${response.status} ${response.statusText}. الرد: ${text}`);
                        });
                    }
                    return response.json(); // Only parse as JSON if response is OK
                })
                .then(data => {
                    if (data && data.status === 'success') {
                        formMessage.textContent = data.message || 'تم إرسال رسالتك بنجاح!';
                        formMessage.style.backgroundColor = 'var(--accent-color)';
                        formMessage.style.color = 'var(--primary-color-dark)'; // Use dark primary for text on accent bg
                        contactFormElement.reset(); // Clear the form fields
                        submissionWasSuccessful = true;
                    } else {
                        formMessage.textContent = (data && data.message) ? data.message : 'حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.';
                        formMessage.style.backgroundColor = '#d9534f'; // A common error red color
                        formMessage.style.color = 'white';
                        submissionWasSuccessful = false;
                    }
                })
                .catch(error => {
                    console.error('Error submitting form:', error);
                    formMessage.textContent = 'حدث خطأ في الاتصال أو في معالجة الطلب. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.';
                    formMessage.style.backgroundColor = '#d9534f';
                    formMessage.style.color = 'white';
                    submissionWasSuccessful = false;
                })
                .finally(() => {
                    formMessageArea.appendChild(formMessage);
                    // Ensure the message element is in the DOM before trying to animate opacity
                    requestAnimationFrame(() => {
                        setTimeout(() => { // Brief delay to ensure styling is applied before transition starts
                            formMessage.style.opacity = '1'; // Fade in
                        }, 10);
                    });

                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;

                    // Hide the message after some time only if it was a success message
                    if (submissionWasSuccessful) {
                        setTimeout(() => {
                            formMessage.style.opacity = '0'; // Fade out
                            setTimeout(() => {
                                if (formMessage.parentNode) { // Check if the element is still part of the DOM
                                    formMessage.remove();
                                }
                            }, 300); // Wait for fade out transition to complete
                        }, 7000); // Message visible for 7 seconds
                    }
                    // Error messages will persist until the next submission attempt or page reload.
                });
            });
        }
    } else {
        // console.warn("Contact form with class '.contact-form' not found.");
    }

    // --- Update Footer Year ---
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    } else {
        // console.warn("Element with ID 'currentYear' not found in the footer.");
    }

}); // End of DOMContentLoaded
