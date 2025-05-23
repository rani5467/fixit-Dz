document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selections ---
    const menuToggleButton = document.getElementById('menu-toggle-button');
    const navLinksContainer = document.querySelector('.nav-links-container');
    const navLinks = document.querySelectorAll('.nav-links .nav-link');
    const header = document.querySelector('.navbar'); // HTML uses class="navbar" for the header element
    const sections = document.querySelectorAll('.section');
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    const themeToggleButton = document.getElementById('theme-toggle');
    const typewriterTextElement = document.getElementById('typewriter-text');
    const contactFormElement = document.querySelector('.contact-form');
    const yearSpan = document.getElementById('currentYear');
    const pricingCards = document.querySelectorAll('.pricing-card');

    // --- 1. Theme Toggle Functionality ---
    function initThemeToggle() {
        if (!themeToggleButton) {
            console.warn("Theme toggle button with ID 'theme-toggle' not found.");
            return;
        }

        const currentTheme = localStorage.getItem('theme');

        function applyTheme(theme) {
            if (theme === 'light') {
                document.body.classList.add('light-mode');
                themeToggleButton.checked = true;
            } else { // Default to dark mode
                document.body.classList.remove('light-mode');
                themeToggleButton.checked = false;
            }
        }

        // Apply the saved theme on initial load or default to dark
        applyTheme(currentTheme || 'dark');


        themeToggleButton.addEventListener('change', function() {
            if (this.checked) {
                applyTheme('light');
                localStorage.setItem('theme', 'light');
            } else {
                applyTheme('dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // --- 2. Mobile Menu Toggle ---
    function initMobileMenu() {
        if (!menuToggleButton || !navLinksContainer) {
            console.warn("Menu toggle button or nav links container not found.");
            return;
        }

        menuToggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinksContainer.classList.toggle('active');
            menuToggleButton.classList.toggle('active'); // For animating the hamburger icon itself
            const isExpanded = navLinksContainer.classList.contains('active');
            menuToggleButton.setAttribute('aria-expanded', String(isExpanded));
        });

        // Close menu when a nav link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinksContainer.classList.contains('active')) {
                    navLinksContainer.classList.remove('active');
                    menuToggleButton.classList.remove('active'); // Ensure hamburger icon resets
                    menuToggleButton.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Close mobile menu when clicking outside of it
        document.addEventListener('click', (event) => {
            if (navLinksContainer.classList.contains('active') &&
                !navLinksContainer.contains(event.target) &&
                !menuToggleButton.contains(event.target)) {
                navLinksContainer.classList.remove('active');
                menuToggleButton.classList.remove('active'); // Ensure hamburger icon resets
                menuToggleButton.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- 3. Smooth Scrolling for Navigation Links ---
    function initSmoothScrolling() {
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
    }

    // --- 4. Active Nav Link Highlighting & Header Scroll Effect ---
    function initScrollDependentEffects() {
        if (!header && sections.length === 0 && navLinks.length === 0 && !scrollToTopBtn) {
            return; // No elements to work with
        }

        const handleScroll = () => {
            const headerHeight = header ? header.offsetHeight : 0;
            // Adjust the offset for active link highlighting. Consider the middle of the viewport.
            const scrollThreshold = window.innerHeight * 0.4; 

            let currentSectionId = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop - headerHeight; 
                const sectionBottom = sectionTop + section.offsetHeight;
                // Check if the top of the section is above the threshold and bottom is below
                if (window.scrollY >= sectionTop - scrollThreshold && window.scrollY < sectionBottom - scrollThreshold) {
                    currentSectionId = section.getAttribute('id');
                }
            });
            
            // Fallback for top/bottom of page
            if (!currentSectionId && sections.length > 0) {
                if (window.scrollY < sections[0].offsetTop - headerHeight) {
                    currentSectionId = sections[0].getAttribute('id'); // Default to first section
                } else if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 20) { // Near bottom
                    currentSectionId = sections[sections.length - 1].getAttribute('id'); // Default to last section
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
        handleScroll(); // Initial call
    }

    // --- 5. Scroll-to-Top Button Functionality ---
    function initScrollToTopButton() {
        if (scrollToTopBtn) {
            scrollToTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // --- 6. Scroll Animations (Fade-in, Slide-in, etc.) ---
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in');
        if (animatedElements.length === 0) {
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px', // Start animation a bit before element is fully visible
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

    // --- 7. Typewriter Effect ---
    function initTypewriterEffect() {
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
                    textIndex = (textIndex + 1) % textsToType.length; // Move to the next text
                    setTimeout(type, pauseBeforeTypingNewWord);
                }
            }
            typewriterTextElement.textContent = ''; // Clear initial content
            setTimeout(type, pauseBeforeTypingNewWord); // Start the typing animation
        }
    }

    // --- 8. Contact Form Validation and Submission ---
    function initContactForm() {
        if (contactFormElement) {
            const submitButton = contactFormElement.querySelector('button[type="submit"]');
            const formMessageArea = contactFormElement.querySelector('.form-message-area');
            const nameInput = contactFormElement.querySelector('#name');
            const emailInput = contactFormElement.querySelector('#email');
            const messageInput = contactFormElement.querySelector('#message');

            if (!submitButton || !formMessageArea || !nameInput || !emailInput || !messageInput) {
                console.error("أحد عناصر نموذج الاتصال مفقود. يرجى التحقق من HTML IDs: name, email, message, and class: form-message-area.");
                if (formMessageArea) {
                     formMessageArea.innerHTML = '<p style="color: red; background-color: #fdd; padding: 10px; border-radius: var(--border-radius-sm);">خطأ في تهيئة النموذج. يرجى الاتصال بمسؤول الموقع.</p>';
                }
                return;
            }

            const originalButtonText = submitButton.textContent;

            contactFormElement.addEventListener('submit', function(e) {
                e.preventDefault(); 

                formMessageArea.innerHTML = '';
                const formMessageP = document.createElement('p'); 
                formMessageP.style.padding = '10px';
                formMessageP.style.marginTop = '15px';
                formMessageP.style.borderRadius = 'var(--border-radius-sm)';
                formMessageP.style.textAlign = 'center';
                formMessageP.style.transition = 'opacity 0.3s ease-in-out';
                formMessageP.style.opacity = '0';

                // Validation
                if (nameInput.value.trim() === '') {
                    displayFormMessage('الرجاء إدخال الاسم الكامل.', 'error', formMessageArea, formMessageP);
                    return;
                }
                if (emailInput.value.trim() === '') {
                    displayFormMessage('الرجاء إدخال البريد الإلكتروني.', 'error', formMessageArea, formMessageP);
                    return;
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value.trim())) {
                    displayFormMessage('الرجاء إدخال عنوان بريد إلكتروني صالح.', 'error', formMessageArea, formMessageP);
                    return;
                }
                if (messageInput.value.trim() === '') {
                    displayFormMessage('الرجاء كتابة رسالتك.', 'error', formMessageArea, formMessageP);
                    return;
                }

                submitButton.disabled = true;
                submitButton.textContent = 'جاري الإرسال...';

                const formData = new FormData(this);
                let submissionWasSuccessful = false;
                
                // IMPORTANT: Replace with your Google Apps Script URL if using that method
                // const SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
                const SCRIPT_URL = 'send_email.php'; // For PHP backend

                fetch(SCRIPT_URL, {
                    method: 'POST',
                    body: formData
                    // If using Google Apps Script and facing CORS issues, add: mode: 'no-cors'
                })
                .then(response => {
                    if (!response.ok) {
                        return response.text().then(text => { 
                            throw new Error(`خطأ من الخادم: ${response.status} ${response.statusText}. الرد: ${text}`);
                        });
                    }
                    return response.json(); 
                })
                .then(data => {
                    if (data && data.status === 'success') {
                        displayFormMessage(data.message || 'تم إرسال رسالتك بنجاح! سيتم التواصل معك قريباً.', 'success', formMessageArea, formMessageP);
                        contactFormElement.reset();
                        submissionWasSuccessful = true;
                    } else {
                        displayFormMessage((data && data.message) ? data.message : 'حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.', 'error', formMessageArea, formMessageP);
                        submissionWasSuccessful = false;
                    }
                })
                .catch(error => {
                    console.error('Error submitting form:', error);
                    displayFormMessage('حدث خطأ في الاتصال أو في معالجة الطلب. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.', 'error', formMessageArea, formMessageP);
                    submissionWasSuccessful = false;
                })
                .finally(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;

                    if (submissionWasSuccessful) {
                        setTimeout(() => {
                            if (formMessageP.parentNode) formMessageP.style.opacity = '0';
                            setTimeout(() => {
                                if (formMessageP.parentNode) formMessageP.remove();
                            }, 300);
                        }, 7000);
                    }
                });
            });

            function displayFormMessage(message, type, area, pElement) {
                area.innerHTML = ''; 
                pElement.textContent = message;
                if (type === 'success') {
                    pElement.style.backgroundColor = 'var(--accent-color)';
                    pElement.style.color = 'var(--primary-color-dark)'; // Ensure good contrast
                } else { 
                    pElement.style.backgroundColor = '#d9534f'; // Standard error red
                    pElement.style.color = 'white';
                }
                area.appendChild(pElement);
                requestAnimationFrame(() => {
                    setTimeout(() => { pElement.style.opacity = '1'; }, 10);
                });
            }
        }
    }

    // --- 9. Pricing Card Interaction ---
    function initPricingCards() {
        if (pricingCards.length > 0) {
            pricingCards.forEach(card => {
                const purchaseButton = card.querySelector('.btn-block'); // Assumes .btn-block is unique to these buttons
                if (purchaseButton) {
                    purchaseButton.addEventListener('click', function(e) {
                        if (this.getAttribute('href') === '#contact') {
                            // Allow default smooth scroll to contact section if it's a direct link
                            return;
                        }
                        
                        e.preventDefault(); // Prevent default for other cases or if it's just a button
                        const cardTitleElement = card.querySelector('.pricing-card-title');
                        const packageName = cardTitleElement ? cardTitleElement.textContent.trim() : "الباقة المحددة";
                        
                        const formMsgArea = contactFormElement ? contactFormElement.querySelector('.form-message-area') : null;
                        
                        if (formMsgArea) {
                            formMsgArea.innerHTML = ''; // Clear previous messages
                            const messageP = document.createElement('p');
                            messageP.textContent = `تم اختيار "${packageName}"! يرجى ملء النموذج أدناه لإكمال الطلب.`;
                            messageP.style.backgroundColor = 'var(--accent-color)';
                            messageP.style.color = 'var(--primary-color-dark)';
                            messageP.style.padding = '10px';
                            messageP.style.marginTop = '15px';
                            messageP.style.borderRadius = 'var(--border-radius-sm)';
                            messageP.style.textAlign = 'center';
                            messageP.style.transition = 'opacity 0.3s ease-in-out';
                            messageP.style.opacity = '0';
                            formMsgArea.appendChild(messageP);
                            requestAnimationFrame(() => {
                               setTimeout(() => { messageP.style.opacity = '1'; }, 10);
                            });

                            const contactSection = document.getElementById('contact');
                            if (contactSection) {
                                const headerOffset = header ? header.offsetHeight : 0;
                                const elementPosition = contactSection.getBoundingClientRect().top + window.scrollY;
                                const offsetPosition = elementPosition - headerOffset;
                                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                            }
                             setTimeout(() => {
                                if (messageP.parentNode) messageP.style.opacity = '0';
                                setTimeout(() => {
                                    if (messageP.parentNode) messageP.remove();
                                }, 300);
                            }, 7000);
                        } else {
                            // Fallback if form message area is not found
                            alert(`تم اختيار "${packageName}"!`);
                        }
                    });
                }
            });
        }
    }

    // --- 10. Update Footer Year ---
    function initFooterYear() {
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }

    // --- 11. Optional: Button Click Animation ---
    function initButtonAnimations() {
        const allButtons = document.querySelectorAll('.btn');
        allButtons.forEach(button => {
            button.addEventListener('mousedown', function() {
                this.classList.add('btn-pressed');
            });
            button.addEventListener('mouseup', function() {
                this.classList.remove('btn-pressed');
            });
            button.addEventListener('mouseleave', function() { 
                this.classList.remove('btn-pressed');
            });
        });
    }

    // --- Initialize all functionalities ---
    initThemeToggle();
    initMobileMenu();
    initSmoothScrolling();
    initScrollDependentEffects();
    initScrollToTopButton();
    initScrollAnimations();
    initTypewriterEffect();
    initContactForm();
    initPricingCards();
    initFooterYear();
    initButtonAnimations();

}); // End of DOMContentLoaded
