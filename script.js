document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selections ---
    const menuToggleButton = document.getElementById('menu-toggle-button');
    const navLinksContainer = document.querySelector('.nav-links-container');
    const navLinks = document.querySelectorAll('.nav-links .nav-link');
    const header = document.querySelector('.navbar');
    const sections = document.querySelectorAll('.section'); // All sections with class="section"
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    const themeToggleButton = document.getElementById('theme-toggle');
    const typewriterTextElement = document.getElementById('typewriter-text');
    const contactFormElement = document.querySelector('.contact-form');
    const yearSpan = document.getElementById('currentYear');
    const pricingCards = document.querySelectorAll('.pricing-card');
    // Elements for the "Requests" section (if they exist in the current HTML)
    const requestSearchInput = document.getElementById('requestSearchInput');
    const requestFilterSelect = document.getElementById('requestFilterSelect');
    const requestsList = document.getElementById('requestsList'); // For card-based list
    const requestsTableBody = document.getElementById('requestsTableBody'); // For table-based list

    // --- 1. Theme Toggle Functionality ---
    function initThemeToggle() {
        if (!themeToggleButton) {
            // console.warn("Theme toggle button with ID 'theme-toggle' not found.");
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
        applyTheme(currentTheme || 'dark'); // Default to dark if no theme saved
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
            // console.warn("Menu toggle button or nav links container not found.");
            return;
        }
        menuToggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinksContainer.classList.toggle('active');
            menuToggleButton.classList.toggle('active');
            menuToggleButton.setAttribute('aria-expanded', navLinksContainer.classList.contains('active'));
        });
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinksContainer.classList.contains('active')) {
                    navLinksContainer.classList.remove('active');
                    menuToggleButton.classList.remove('active');
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

    // --- 3. Smooth Scrolling ---
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
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    }
                }
            });
        });
    }

    // --- 4. Active Nav Link Highlighting & Header Scroll Effect ---
    function initScrollDependentEffects() {
        if (!header && sections.length === 0 && navLinks.length === 0 && !scrollToTopBtn) { return; }
        const handleScroll = () => {
            const headerHeight = header ? header.offsetHeight : 0;
            const scrollThreshold = window.innerHeight * 0.4;
            let currentSectionId = '';

            sections.forEach(section => {
                const sectionId = section.getAttribute('id');
                if (!sectionId) return; 
                const sectionTop = section.offsetTop - headerHeight;
                const sectionBottom = sectionTop + section.offsetHeight;
                if (window.scrollY >= sectionTop - scrollThreshold && window.scrollY < sectionBottom - scrollThreshold ) {
                     currentSectionId = sectionId;
                }
            });
            
            if (!currentSectionId && sections.length > 0) {
                const firstSectionWithId = Array.from(sections).find(s => s.getAttribute('id'));
                const lastSectionWithId = Array.from(sections).reverse().find(s => s.getAttribute('id'));

                if (firstSectionWithId && window.scrollY < firstSectionWithId.offsetTop - headerHeight) {
                    currentSectionId = firstSectionWithId.getAttribute('id');
                } else if (lastSectionWithId && window.scrollY + window.innerHeight >= document.body.scrollHeight - 20) {
                    currentSectionId = lastSectionWithId.getAttribute('id');
                }
            }

            navLinks.forEach(link => {
                link.classList.remove('active');
                const linkHref = link.getAttribute('href');
                if (linkHref && linkHref === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });

            if (header) {
                if (window.scrollY > 50) header.classList.add('scrolled');
                else header.classList.remove('scrolled');
            }
            if (scrollToTopBtn) {
                if (window.scrollY > 300) scrollToTopBtn.classList.add('visible');
                else scrollToTopBtn.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    // --- 5. Scroll-to-Top Button ---
    function initScrollToTopButton() {
        if (scrollToTopBtn) {
            scrollToTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    // --- 6. Scroll Animations ---
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in');
        if (animatedElements.length === 0) return;
        const observerOptions = { root: null, rootMargin: '0px 0px -50px 0px', threshold: 0.1 };
        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay) || 0;
                    setTimeout(() => entry.target.classList.add('appear'), delay);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        animatedElements.forEach(el => animationObserver.observe(el));
    }

    // --- 7. Typewriter Effect ---
    function initTypewriterEffect() {
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
    }

    // --- 8. Contact Form Validation and Submission (to Google Apps Script) ---
    function initContactForm() {
        if (contactFormElement) {
            const submitButton = contactFormElement.querySelector('button[type="submit"]');
            const formMessageArea = contactFormElement.querySelector('.form-message-area');
            const nameInput = contactFormElement.querySelector('#name');
            const emailInput = contactFormElement.querySelector('#email');
            const messageInput = contactFormElement.querySelector('#message');

            // !!! هذا هو الرابط الذي قدمته لـ Google Apps Script !!!
            const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzbPZJ0RiFXcLrJT8rNtS49jdsAPU2faveAQdT9tU-oZTy2Al90apnOTNF6COmS2h-oPg/exec";

            if (!submitButton || !formMessageArea || !nameInput || !emailInput || !messageInput) {
                console.error("أحد عناصر نموذج الاتصال مفقود. يرجى التحقق من HTML IDs: name, email, message, and class: form-message-area.");
                if (formMessageArea) {
                     formMessageArea.innerHTML = '<p style="color: red; background-color: #fdd; padding: 10px; border-radius: var(--border-radius-sm);">خطأ في تهيئة النموذج. يرجى الاتصال بمسؤول الموقع.</p>';
                }
                return;
            }
            if (SCRIPT_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE" || SCRIPT_URL === "") { // Safety check, though you provided it
                console.error("لم يتم تعيين رابط Google Apps Script في script.js. لن يعمل إرسال النموذج.");
                displayFormMessage('تهيئة النموذج غير مكتملة. الإرسال معطل.', 'error', formMessageArea, document.createElement('p'));
                if(submitButton) submitButton.disabled = true;
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

                if (nameInput.value.trim() === '') {
                    displayFormMessage('الرجاء إدخال الاسم الكامل.', 'error', formMessageArea, formMessageP);
                    nameInput.focus(); return;
                }
                if (emailInput.value.trim() === '') {
                    displayFormMessage('الرجاء إدخال البريد الإلكتروني.', 'error', formMessageArea, formMessageP);
                    emailInput.focus(); return;
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value.trim())) {
                    displayFormMessage('الرجاء إدخال عنوان بريد إلكتروني صالح.', 'error', formMessageArea, formMessageP);
                    emailInput.focus(); return;
                }
                if (messageInput.value.trim() === '') {
                    displayFormMessage('الرجاء كتابة رسالتك.', 'error', formMessageArea, formMessageP);
                    messageInput.focus(); return;
                }

                submitButton.disabled = true;
                submitButton.textContent = 'جاري الإرسال...';

                const formData = new FormData(this);
                let submissionWasSuccessful = false;

                fetch(SCRIPT_URL, {
                    method: 'POST',
                    body: formData,
                    mode: 'no-cors' // Important for basic Google Apps Script web apps
                })
                .then(response => {
                    // With mode: 'no-cors', response is opaque. We can't check response.ok or response.json().
                    // We proceed optimistically. The Apps Script should handle errors and log them.
                    displayFormMessage('تم إرسال رسالتك بنجاح! سيتم التحقق منها قريباً.', 'success', formMessageArea, formMessageP);
                    contactFormElement.reset();
                    submissionWasSuccessful = true;
                })
                .catch(error => {
                    // This catch block will primarily handle network errors or if the SCRIPT_URL is entirely wrong.
                    console.error('Error submitting form to Google Apps Script:', error);
                    displayFormMessage('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.', 'error', formMessageArea, formMessageP);
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
                    pElement.style.color = 'var(--btn-primary-text)'; 
                } else { 
                    pElement.style.backgroundColor = '#d9534f'; 
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
                const purchaseButton = card.querySelector('.btn-block'); 
                if (purchaseButton) {
                    purchaseButton.addEventListener('click', function(e) {
                        if (this.getAttribute('href') === '#contact') {
                            return; 
                        }
                        
                        e.preventDefault(); 
                        const cardTitleElement = card.querySelector('.pricing-card-title');
                        const packageName = cardTitleElement ? cardTitleElement.textContent.trim() : "الباقة المحددة";
                        
                        const formMsgArea = contactFormElement ? contactFormElement.querySelector('.form-message-area') : null;
                        
                        if (formMsgArea) {
                            formMsgArea.innerHTML = ''; 
                            const messageP = document.createElement('p');
                            messageP.textContent = `تم اختيار "${packageName}"! يرجى ملء النموذج أدناه لإكمال الطلب.`;
                            messageP.style.backgroundColor = 'var(--accent-color)';
                            messageP.style.color = 'var(--btn-primary-text)';
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

    // --- 12. Requests Section Search and Filter (Client-side for HTML structure if it exists) ---
    function initRequestsSection() {
        const requestsSection = document.getElementById('requests');
        if (!requestsSection) { // Check if the section exists
            // console.log("Requests section not found in this HTML, skipping initialization.");
            return; 
        }

        // Proceed only if the section and its child elements exist
        if (!requestsList && !requestsTableBody) { // Check if either card list or table body exists
             // console.warn("Neither requestsList nor requestsTableBody found for filtering.");
            return;
        }
        if (!requestSearchInput || !requestFilterSelect) {
            // console.warn("Requests section filter/search controls not found.");
            return;
        }
        
        const requestItems = requestsTableBody ? 
                             Array.from(requestsTableBody.querySelectorAll('tr')) : 
                             Array.from(requestsList.querySelectorAll('.request-card'));

        if(requestItems.length === 0) return; // No items to filter/search


        function filterAndSearchRequests() {
            const searchTerm = requestSearchInput.value.toLowerCase().trim();
            const filterValue = requestFilterSelect.value;

            requestItems.forEach(item => { 
                let textContentToSearch = '';
                if (item.tagName === 'TR') {
                    item.querySelectorAll('td:not(.action-buttons)').forEach(td => {
                        textContentToSearch += (td.textContent || td.innerText || "").toLowerCase() + " ";
                    });
                } else { 
                    const title = item.querySelector('.meta h3')?.textContent.toLowerCase() || '';
                    const description = item.querySelector('.request-card-body p')?.textContent.toLowerCase() || '';
                    const service = item.querySelector('.meta p')?.textContent.toLowerCase() || '';
                    textContentToSearch = `${title} ${description} ${service}`;
                }
                
                const status = item.dataset.status || '';

                const matchesSearch = textContentToSearch.includes(searchTerm);
                const matchesFilter = (filterValue === 'all') || (status === filterValue);

                if (matchesSearch && matchesFilter) {
                    item.style.display = ''; 
                } else {
                    item.style.display = 'none';
                }
            });
        }

        requestSearchInput.addEventListener('input', filterAndSearchRequests);
        requestFilterSelect.addEventListener('change', filterAndSearchRequests);
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
    initRequestsSection(); // Call this last or ensure its elements are available

}); // End of DOMContentLoaded
