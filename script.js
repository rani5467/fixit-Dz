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
    const serviceOrderButtons = document.querySelectorAll('.service-card .btn'); // "اطلب الخدمة" buttons

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
            } else {
                document.body.classList.remove('light-mode');
                themeToggleButton.checked = false;
            }
        }

        if (currentTheme) {
            applyTheme(currentTheme);
        } else {
            // Default to dark mode if no theme is saved (CSS also defaults to dark)
            applyTheme('dark');
        }

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
            menuToggleButton.classList.toggle('active');
            const isExpanded = navLinksContainer.classList.contains('active');
            menuToggleButton.setAttribute('aria-expanded', String(isExpanded));
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinksContainer.classList.contains('active')) {
                    navLinksContainer.classList.remove('active');
                    menuToggle.classList.remove('active');
                    menuToggleButton.setAttribute('aria-expanded', 'false');
                }
            });
        });

        document.addEventListener('click', (event) => {
            if (navLinksContainer.classList.contains('active') &&
                !navLinksContainer.contains(event.target) &&
                !menuToggleButton.contains(event.target)) {
                navLinksContainer.classList.remove('active');
                menuToggleButton.classList.remove('active');
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
            const scrollPosition = window.scrollY + headerHeight + (window.innerHeight * 0.3); // Adjusted offset

            // Active link highlighting
            if (sections.length > 0 && navLinks.length > 0) {
                let currentSectionId = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionBottom = sectionTop + section.offsetHeight;
                    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                        currentSectionId = section.getAttribute('id');
                    }
                });

                if (!currentSectionId) {
                    if (window.scrollY < sections[0].offsetTop - headerHeight) {
                        currentSectionId = sections[0].getAttribute('id');
                    } else if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 50) {
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
            }

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
        } else {
            // console.warn("Scroll to top button not found.");
        }
    }

    // --- 6. Scroll Animations (Fade-in, Slide-in, etc.) ---
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in');
        if (animatedElements.length === 0) {
            // console.warn("No elements with class 'fade-in' found for IntersectionObserver.");
            return;
        }

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
                    textIndex = (textIndex + 1) % textsToType.length;
                    setTimeout(type, pauseBeforeTypingNewWord);
                }
            }
            typewriterTextElement.textContent = ''; // Clear initial content
            setTimeout(type, pauseBeforeTypingNewWord);
        } else {
            // console.warn("Typewriter text element with ID 'typewriter-text' not found.");
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
                console.error("أحد عناصر نموذج الاتصال مفقود. يرجى التحقق من HTML.");
                if (formMessageArea) { // Provide feedback if possible
                     formMessageArea.innerHTML = '<p style="color: red; background-color: #fdd; padding: 10px; border-radius: var(--border-radius-sm);">خطأ في تهيئة النموذج. يرجى الاتصال بمسؤول الموقع.</p>';
                }
                return;
            }

            const originalButtonText = submitButton.textContent;

            contactFormElement.addEventListener('submit', function(e) {
                e.preventDefault(); // منع الإرسال الافتراضي للمتصفح

                // مسح الرسائل السابقة
                formMessageArea.innerHTML = '';
                const formMessage = document.createElement('p');
                formMessage.style.padding = '10px';
                formMessage.style.marginTop = '15px';
                formMessage.style.borderRadius = 'var(--border-radius-sm)';
                formMessage.style.textAlign = 'center';
                formMessage.style.transition = 'opacity 0.3s ease-in-out';
                formMessage.style.opacity = '0';

                // التحقق من الحقول
                if (nameInput.value.trim() === '') {
                    displayFormMessage('الرجاء إدخال الاسم الكامل.', 'error');
                    return;
                }
                if (emailInput.value.trim() === '') {
                    displayFormMessage('الرجاء إدخال البريد الإلكتروني.', 'error');
                    return;
                }
                // RegEx بسيط للتحقق من البريد الإلكتروني
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value.trim())) {
                    displayFormMessage('الرجاء إدخال عنوان بريد إلكتروني صالح.', 'error');
                    return;
                }
                if (messageInput.value.trim() === '') {
                    displayFormMessage('الرجاء كتابة رسالتك.', 'error');
                    return;
                }

                submitButton.disabled = true;
                submitButton.textContent = 'جاري الإرسال...';

                const formData = new FormData(this);
                let submissionWasSuccessful = false;

                fetch('send_email.php', { // Target PHP script
                    method: 'POST',
                    body: formData
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
                        displayFormMessage(data.message || 'تم إرسال رسالتك بنجاح! سيتم التواصل معك قريباً.', 'success');
                        contactFormElement.reset();
                        submissionWasSuccessful = true;
                    } else {
                        displayFormMessage((data && data.message) ? data.message : 'حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.', 'error');
                        submissionWasSuccessful = false;
                    }
                })
                .catch(error => {
                    console.error('Error submitting form:', error);
                    displayFormMessage('حدث خطأ في الاتصال أو في معالجة الطلب. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.', 'error');
                    submissionWasSuccessful = false;
                })
                .finally(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;

                    if (submissionWasSuccessful) {
                        setTimeout(() => {
                            const currentMsg = formMessageArea.querySelector('p');
                            if (currentMsg) currentMsg.style.opacity = '0';
                            setTimeout(() => {
                                if (currentMsg && currentMsg.parentNode) {
                                    currentMsg.remove();
                                }
                            }, 300);
                        }, 7000);
                    }
                });
            });

            function displayFormMessage(message, type) {
                formMessageArea.innerHTML = ''; // Clear previous messages
                const p = document.createElement('p');
                p.textContent = message;
                if (type === 'success') {
                    p.style.backgroundColor = 'var(--accent-color)';
                    p.style.color = 'var(--primary-color-dark)'; // Ensure contrast
                } else { // error
                    p.style.backgroundColor = '#d9534f'; // Red for error
                    p.style.color = 'white';
                }
                p.style.padding = '10px';
                p.style.marginTop = '15px';
                p.style.borderRadius = 'var(--border-radius-sm)';
                p.style.textAlign = 'center';
                p.style.transition = 'opacity 0.3s ease-in-out';
                p.style.opacity = '0';
                formMessageArea.appendChild(p);
                requestAnimationFrame(() => {
                    setTimeout(() => { p.style.opacity = '1'; }, 10);
                });
            }
        } else {
            // console.warn("Contact form with class '.contact-form' not found.");
        }
    }

    // --- 9. Pricing Card Interaction ---
    function initPricingCards() {
        if (pricingCards.length > 0) {
            pricingCards.forEach(card => {
                // Hover effect is primarily CSS driven, but JS can add classes if needed
                // For this request, CSS :hover should suffice for highlight.

                const purchaseButton = card.querySelector('.btn-block'); // Assuming all pricing buttons are .btn-block
                if (purchaseButton) {
                    purchaseButton.addEventListener('click', function(e) {
                        // If the button is a link to #contact, let smooth scroll handle it
                        if (this.getAttribute('href') === '#contact') {
                            return; // Allow smooth scroll to proceed
                        }
                        
                        e.preventDefault(); // Prevent default if it's not a #contact link
                        const cardTitle = card.querySelector('.pricing-card-title');
                        const packageName = cardTitle ? cardTitle.textContent.trim() : "الباقة المحددة";
                        
                        const formMessageArea = contactFormElement ? contactFormElement.querySelector('.form-message-area') : null;
                        const messageP = document.createElement('p');
                        messageP.textContent = `تم اختيار "${packageName}"! يرجى ملء النموذج أدناه لإكمال الطلب.`;
                        messageP.style.backgroundColor = 'var(--accent-color)';
                        messageP.style.color = 'var(--primary-color-dark)';
                        messageP.style.padding = '10px';
                        messageP.style.marginTop = '15px';
                        messageP.style.borderRadius = 'var(--border-radius-sm)';
                        messageP.style.textAlign = 'center';
                        
                        if (formMessageArea) {
                            formMessageArea.innerHTML = ''; // Clear previous messages
                            formMessageArea.appendChild(messageP);
                            // Scroll to contact form
                            const contactSection = document.getElementById('contact');
                            if (contactSection) {
                                const headerOffset = header ? header.offsetHeight : 0;
                                const elementPosition = contactSection.getBoundingClientRect().top + window.scrollY;
                                const offsetPosition = elementPosition - headerOffset;
                                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                            }
                             setTimeout(() => {
                                if (messageP.parentNode) messageP.remove();
                            }, 7000); // Remove message after 7 seconds
                        } else {
                            // Fallback if formMessageArea is not found on the page (e.g. if contact form is on a different page)
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
        } else {
            // console.warn("Element with ID 'currentYear' not found in the footer.");
        }
    }

    // --- 11. Optional: Button Click Animation (Simple CSS class toggle) ---
    function initButtonAnimations() {
        const allButtons = document.querySelectorAll('.btn'); // General buttons
        allButtons.forEach(button => {
            button.addEventListener('mousedown', function() {
                this.classList.add('btn-pressed');
            });
            button.addEventListener('mouseup', function() {
                this.classList.remove('btn-pressed');
            });
            button.addEventListener('mouseleave', function() { // Remove if mouse leaves while pressed
                this.classList.remove('btn-pressed');
            });
        });
    }
    // Add CSS for .btn-pressed:
    // .btn.btn-pressed { transform: translateY(1px) scale(0.98); box-shadow: 0 2px 5px rgba(var(--accent-color-rgb), 0.2); }


    // --- Initialize all functionalities ---
    initThemeToggle();
    initMobileMenu();
    initSmoothScrolling();
    initScrollDependentEffects(); // Includes active link, header scroll, scroll-to-top visibility
    initScrollToTopButton();
    initScrollAnimations();
    initTypewriterEffect();
    initContactForm();
    initPricingCards();
    initFooterYear();
    initButtonAnimations(); // Optional button press effect

}); // End of DOMContentLoaded
