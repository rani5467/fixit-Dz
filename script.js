document.addEventListener('DOMContentLoaded', () => {
    // --- تحديد عناصر DOM الرئيسية ---
    // هذه المتغيرات ستُستخدم في عدة دوال لتحديد عناصر الصفحة
    const menuToggleButton = document.getElementById('menu-toggle-button'); // زر قائمة الهامبرغر
    const navLinksContainer = document.querySelector('.nav-links-container'); // حاوية روابط القائمة
    const navLinks = document.querySelectorAll('.nav-links .nav-link'); // جميع روابط القائمة
    const header = document.querySelector('.navbar'); // عنصر الهيدر (شريط التنقل)
    const sections = document.querySelectorAll('.section'); // جميع أقسام الصفحة الرئيسية
    const scrollToTopBtn = document.getElementById('scrollToTopBtn'); // زر العودة للأعلى
    const themeToggleButton = document.getElementById('theme-toggle'); // زر تبديل الثيم (داكن/فاتح)
    const typewriterTextElement = document.getElementById('typewriter-text'); // عنصر النص المتحرك في الهيرو
    const contactFormElement = document.querySelector('.contact-form'); // نموذج الاتصال
    const yearSpan = document.getElementById('currentYear'); // عنصر عرض السنة في التذييل
    const pricingCards = document.querySelectorAll('.pricing-card'); // بطاقات التسعير
    
    // عناصر قسم الطلبات (إذا كانت موجودة في الصفحة)
    const requestsSection = document.getElementById('requests');
    const requestSearchInput = document.getElementById('requestSearchInput');
    const requestFilterSelect = document.getElementById('requestFilterSelect');
    const requestsList = document.getElementById('requestsList'); // لعرض الطلبات كبطاقات
    const requestsTableBody = document.getElementById('requestsTableBody'); // لعرض الطلبات في جدول

    // --- 1. وظيفة تبديل الثيم (الوضع الداكن/الفاتح) ---
    function initThemeToggle() {
        if (!themeToggleButton) {
            // console.warn("لم يتم العثور على زر تبديل الثيم بالمعرف 'theme-toggle'.");
            return;
        }
        const currentTheme = localStorage.getItem('theme'); // قراءة الثيم المحفوظ

        // دالة لتطبيق الثيم المحدد
        function applyTheme(theme) {
            if (theme === 'light') {
                document.body.classList.add('light-mode');
                themeToggleButton.checked = true;
            } else { // الافتراضي هو الوضع الداكن
                document.body.classList.remove('light-mode');
                themeToggleButton.checked = false;
            }
        }

        applyTheme(currentTheme || 'dark'); // تطبيق الثيم المحفوظ أو الداكن كافتراضي

        // الاستماع لتغييرات زر التبديل
        themeToggleButton.addEventListener('change', function() {
            if (this.checked) { // إذا تم تحديد الوضع الفاتح
                applyTheme('light');
                localStorage.setItem('theme', 'light'); // حفظ التفضيل
            } else { // إذا تم تحديد الوضع الداكن
                applyTheme('dark');
                localStorage.setItem('theme', 'dark'); // حفظ التفضيل
            }
        });
    }

    // --- 2. وظيفة قائمة التنقل المتجاوبة (Mobile Menu Toggle) ---
    function initMobileMenu() {
        if (!menuToggleButton || !navLinksContainer) {
            // console.warn("لم يتم العثور على زر قائمة الجوال أو حاوية الروابط.");
            return;
        }

        // عند الضغط على زر القائمة
        menuToggleButton.addEventListener('click', (e) => {
            e.stopPropagation(); // منع انتشار الحدث
            navLinksContainer.classList.toggle('active'); // إظهار/إخفاء القائمة
            menuToggleButton.classList.toggle('active'); // تغيير شكل أيقونة الهامبرغر
            menuToggleButton.setAttribute('aria-expanded', navLinksContainer.classList.contains('active'));
        });

        // إغلاق القائمة عند الضغط على أحد الروابط
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinksContainer.classList.contains('active')) {
                    navLinksContainer.classList.remove('active');
                    menuToggleButton.classList.remove('active');
                    menuToggleButton.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // إغلاق القائمة عند الضغط خارجها
        document.addEventListener('click', (event) => {
            if (navLinksContainer.classList.contains('active') &&
                !navLinksContainer.contains(event.target) && // إذا لم يكن الضغط داخل القائمة
                !menuToggleButton.contains(event.target)) { // وإذا لم يكن الضغط على زر القائمة نفسه
                navLinksContainer.classList.remove('active');
                menuToggleButton.classList.remove('active');
                menuToggleButton.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- 3. وظيفة التمرير السلس (Smooth Scrolling) ---
    function initSmoothScrolling() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                // التأكد أنه رابط داخلي (يبدأ بـ #) وليس مجرد #
                if (href && href.startsWith('#') && href.length > 1) {
                    e.preventDefault(); // منع السلوك الافتراضي للرابط
                    const targetId = href.substring(1); // إزالة # للحصول على ID القسم
                    const targetElement = document.getElementById(targetId);

                    if (targetElement) {
                        const headerOffset = header ? header.offsetHeight : 0; // ارتفاع الهيدر الثابت
                        const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                        const offsetPosition = elementPosition - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth' // التمرير السلس
                        });
                    }
                }
            });
        });
    }

    // --- 4. إبراز الرابط النشط في القائمة وتأثيرات الهيدر عند التمرير ---
    function initScrollDependentEffects() {
        if (!header && sections.length === 0 && navLinks.length === 0 && !scrollToTopBtn) { return; }
        
        const handleScroll = () => {
            const headerHeight = header ? header.offsetHeight : 0;
            const activationOffset = headerHeight + (window.innerHeight * 0.1); // نقطة التفعيل (10% أسفل الهيدر)
            let currentSectionId = '';

            // تحديد القسم الحالي في نافذة العرض
            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                const sectionId = section.getAttribute('id');
                if (!sectionId) continue; // تجاهل الأقسام بدون ID

                const sectionTop = section.offsetTop;
                // تفعيل الرابط إذا كان أعلى القسم مرئيًا أسفل نقطة التفعيل
                if (window.scrollY + activationOffset >= sectionTop) {
                    currentSectionId = sectionId;
                    break; 
                }
            }
            
            // إذا لم يتم العثور على قسم (مثلاً في أعلى الصفحة)، اجعل القسم الأول نشطًا
            if (!currentSectionId && sections.length > 0) {
                const firstSectionWithId = Array.from(sections).find(s => s.getAttribute('id'));
                if (firstSectionWithId && window.scrollY < firstSectionWithId.offsetTop - headerHeight) {
                    currentSectionId = firstSectionWithId.getAttribute('id');
                }
            }
            // إذا كان المستخدم في أسفل الصفحة، اجعل القسم الأخير نشطًا
            if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 20) {
                const lastSectionWithId = Array.from(sections).reverse().find(s => s.getAttribute('id'));
                if (lastSectionWithId) {
                    currentSectionId = lastSectionWithId.getAttribute('id');
                }
            }


            // تحديث كلاس 'active' للروابط
            navLinks.forEach(link => {
                link.classList.remove('active');
                const linkHref = link.getAttribute('href');
                if (linkHref && linkHref === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });

            // تغيير نمط الهيدر عند التمرير
            if (header) {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }

            // إظهار/إخفاء زر العودة للأعلى
            if (scrollToTopBtn) {
                if (window.scrollY > 300) {
                    scrollToTopBtn.classList.add('visible');
                } else {
                    scrollToTopBtn.classList.remove('visible');
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true }); // تحسين أداء التمرير
        handleScroll(); // استدعاء أولي عند تحميل الصفحة
    }

    // --- 5. وظيفة زر العودة للأعلى ---
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

    // --- 6. وظيفة الرسوم المتحركة عند التمرير (باستخدام Intersection Observer) ---
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in');
        if (animatedElements.length === 0) return;

        const observerOptions = {
            root: null, // نسبة إلى نافذة العرض
            rootMargin: '0px 0px -50px 0px', // تشغيل الأنيميشن قبل ظهور العنصر بـ 50 بكسل
            threshold: 0.1 // 10% من العنصر يجب أن يكون مرئيًا
        };

        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('appear'); // إضافة كلاس 'appear' لتشغيل الأنيميشن
                    }, delay);
                    observer.unobserve(entry.target); // إيقاف المراقبة بعد ظهور العنصر مرة واحدة
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => {
            animationObserver.observe(el);
        });
    }

    // --- 7. وظيفة تأثير الكتابة الآلية (Typewriter Effect) ---
    function initTypewriterEffect() {
        if (typewriterTextElement) {
            const textsToType = ["وأنت في مكانك!", "بكل سهولة وأمان.", "بخبرة واحترافية."];
            let textIndex = 0;
            let charIndex = 0;
            const typingSpeed = 100; // سرعة الكتابة (مللي ثانية لكل حرف)
            const erasingSpeed = 50; // سرعة المسح
            const pauseBetweenWords = 2000; // فترة التوقف بعد كتابة كلمة
            const pauseBeforeTypingNewWord = 500; // فترة التوقف قبل بدء كلمة جديدة

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
                    textIndex = (textIndex + 1) % textsToType.length; // الانتقال إلى النص التالي
                    setTimeout(type, pauseBeforeTypingNewWord);
                }
            }
            typewriterTextElement.textContent = ''; // مسح المحتوى الأولي
            setTimeout(type, pauseBeforeTypingNewWord); // بدء التأثير
        }
    }

    // --- 8. وظيفة التحقق من نموذج الاتصال وإرساله (إلى Google Apps Script) ---
    function initContactForm() {
        if (contactFormElement) {
            const submitButton = contactFormElement.querySelector('button[type="submit"]');
            const formMessageArea = contactFormElement.querySelector('.form-message-area');
            const nameInput = contactFormElement.querySelector('#name');
            const emailInput = contactFormElement.querySelector('#email');
            const messageInput = contactFormElement.querySelector('#message');

            // !!! هام جداً: استبدل هذا الرابط برابط تطبيق الويب الخاص بك من Google Apps Script !!!
            const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzbPZJ0RiFXcLrJT8rNtS49jdsAPU2faveAQdT9tU-oZTy2Al90apnOTNF6COmS2h-oPg/exec"; 

            if (!submitButton || !formMessageArea || !nameInput || !emailInput || !messageInput) {
                console.error("أحد عناصر نموذج الاتصال مفقود. يرجى التحقق من HTML IDs: name, email, message, and class: form-message-area.");
                if (formMessageArea) {
                     formMessageArea.innerHTML = '<p style="color: red; background-color: #fdd; padding: 10px; border-radius: var(--border-radius-sm);">خطأ في تهيئة النموذج. يرجى الاتصال بمسؤول الموقع.</p>';
                }
                return;
            }
            
            // لا داعي للتحقق من SCRIPT_URL مقابل القيمة الافتراضية إذا كنت قد أدخلت الرابط الصحيح مباشرة
            if (SCRIPT_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE" || SCRIPT_URL === "") {
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

                // التحقق من صحة الإدخالات
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
                    mode: 'no-cors' // مهم لتطبيقات Google Apps Script الأساسية لتجنب مشاكل CORS
                })
                .then(response => {
                    // مع وضع 'no-cors'، لا يمكننا قراءة نص الاستجابة.
                    // نفترض النجاح إذا تم حل وعد fetch دون خطأ في الشبكة.
                    // Google Apps Script نفسه سيتعامل مع الكتابة في الجدول.
                    // سيتم تسجيل أي أخطاء في Apps Script من جانب Google Apps Script.
                    displayFormMessage('تم إرسال رسالتك بنجاح! سيتم التحقق منها قريباً.', 'success', formMessageArea, formMessageP);
                    contactFormElement.reset(); // مسح حقول النموذج
                    submissionWasSuccessful = true;
                })
                .catch(error => {
                    // هذا الجزء سيتعامل بشكل أساسي مع أخطاء الشبكة أو إذا كان SCRIPT_URL خاطئًا تمامًا.
                    console.error('خطأ في إرسال النموذج إلى Google Apps Script:', error);
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
                            }, 300); // انتظر حتى يكتمل تأثير التلاشي
                        }, 7000); // تبقى الرسالة ظاهرة لمدة 7 ثوانٍ
                    }
                    // رسائل الخطأ ستبقى ظاهرة حتى محاولة الإرسال التالية أو إعادة تحميل الصفحة.
                });
            });

            // دالة مساعدة لعرض رسائل النموذج
            function displayFormMessage(message, type, area, pElement) {
                area.innerHTML = ''; 
                pElement.textContent = message;
                if (type === 'success') {
                    pElement.style.backgroundColor = 'var(--accent-color)';
                    pElement.style.color = 'var(--btn-primary-text)'; 
                } else { // error
                    pElement.style.backgroundColor = '#d9534f'; // أحمر للخطأ
                    pElement.style.color = 'white';
                }
                area.appendChild(pElement);
                // التأكد من أن العنصر في DOM والأنماط مطبقة قبل بدء الانتقال
                requestAnimationFrame(() => {
                    setTimeout(() => { pElement.style.opacity = '1'; }, 10); // تأثير الظهور التدريجي
                });
            }
        }
    }

    // --- 9. وظيفة التفاعل مع بطاقات التسعير ---
    function initPricingCards() {
        if (pricingCards.length > 0 && contactFormElement) { // تأكد من وجود نموذج الاتصال
            pricingCards.forEach(card => {
                const purchaseButton = card.querySelector('.btn-block'); 
                if (purchaseButton) {
                    purchaseButton.addEventListener('click', function(e) {
                        if (this.getAttribute('href') === '#contact') {
                            // اسمح بالتمرير السلس إذا كان الرابط يشير إلى قسم الاتصال
                            return; 
                        }
                        
                        e.preventDefault(); 
                        const cardTitleElement = card.querySelector('.pricing-card-title');
                        const packageName = cardTitleElement ? cardTitleElement.textContent.trim() : "الباقة المحددة";
                        
                        const formMsgArea = contactFormElement.querySelector('.form-message-area');
                        
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
                            alert(`تم اختيار "${packageName}"!`); // كحل بديل إذا لم يتم العثور على منطقة الرسائل
                        }
                    });
                }
            });
        }
    }

    // --- 10. وظيفة تحديث سنة الحقوق المحفوظة في التذييل ---
    function initFooterYear() {
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }

    // --- 11. وظيفة اختيارية: تأثير بسيط عند الضغط على الأزرار ---
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

    // --- 12. وظيفة البحث والفلترة لقسم الطلبات (إذا كان موجودًا في HTML) ---
    // هذه الوظيفة ستعمل فقط إذا كان قسم الطلبات موجودًا في HTML.
    // بما أننا أزلناه من index.html العام، قد لا تجد هذه العناصر.
    function initRequestsSection() {
        if (!requestsSection) { // التحقق أولاً من وجود القسم
            // console.log("قسم الطلبات غير موجود في هذا الملف، سيتم تخطي التهيئة.");
            return; 
        }

        // التحقق من وجود عناصر التحكم والجدول/القائمة
        if ((!requestsList && !requestsTableBody) || !requestSearchInput || !requestFilterSelect) {
            // console.warn("عناصر التحكم في قسم الطلبات أو قائمة/جدول الطلبات غير موجودة.");
            return;
        }
        
        const requestItems = requestsTableBody ? 
                             Array.from(requestsTableBody.querySelectorAll('tr')) : 
                             (requestsList ? Array.from(requestsList.querySelectorAll('.request-card')) : []);

        if(requestItems.length === 0 && (requestsList || requestsTableBody) ) {
            // console.log("لا توجد طلبات لعرضها أو فلترتها مبدئيًا.");
        }

        function filterAndSearchRequests() {
            const searchTerm = requestSearchInput.value.toLowerCase().trim();
            const filterValue = requestFilterSelect.value;

            requestItems.forEach(item => { 
                let textContentToSearch = '';
                if (item.tagName === 'TR') { // إذا كان العنصر صفًا في جدول
                    item.querySelectorAll('td:not(.action-buttons)').forEach(td => {
                        textContentToSearch += (td.textContent || td.innerText || "").toLowerCase() + " ";
                    });
                } else { // إذا كان العنصر بطاقة طلب
                    const title = item.querySelector('.meta h3')?.textContent.toLowerCase() || '';
                    const description = item.querySelector('.request-card-body p')?.textContent.toLowerCase() || '';
                    const service = item.querySelector('.meta p')?.textContent.toLowerCase() || '';
                    textContentToSearch = `${title} ${description} ${service}`;
                }
                
                const status = item.dataset.status || ''; // الحصول على الحالة من data-status

                const matchesSearch = textContentToSearch.includes(searchTerm);
                const matchesFilter = (filterValue === 'all') || (status === filterValue);

                if (matchesSearch && matchesFilter) {
                    item.style.display = ''; // إظهار العنصر
                } else {
                    item.style.display = 'none'; // إخفاء العنصر
                }
            });
        }

        requestSearchInput.addEventListener('input', filterAndSearchRequests);
        requestFilterSelect.addEventListener('change', filterAndSearchRequests);
    }


    // --- تهيئة جميع الوظائف عند تحميل الصفحة ---
    initThemeToggle();
    initMobileMenu();
    initSmoothScrolling();
    initScrollDependentEffects();
    initScrollToTopButton();
    initScrollAnimations();
    initTypewriterEffect();
    initContactForm(); // هذه الدالة ستستخدم الآن رابط Google Apps Script
    initPricingCards();
    initFooterYear();
    initButtonAnimations();
    initRequestsSection(); // سيتم تهيئة هذا الجزء فقط إذا كان قسم الطلبات موجودًا في HTML

}); // نهاية DOMContentLoaded
