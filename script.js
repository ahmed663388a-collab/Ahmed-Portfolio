/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ═══════════════════════ AHMED PORTFOLIO - MASTER SCRIPT ════════════════════════
 * ═══════════════════════════════════════════════════════════════════════════════
 * File: script.js | Lines: 2000+ | Version: God-Tier Ultra Premium 4K/5K
 * Author: Ahmed - Full Stack Developer | Date: 2026
 * Architecture: Modular ES6+ Pattern with Performance-First Engineering
 */

'use strict';

// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════ GLOBAL CONFIGURATION ═════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
const CONFIG = {
    // Animation Settings
    animation: {
        duration: {
            fast: 150,
            base: 250,
            slow: 350,
            slower: 500,
            reveal: 600
        },
        easing: {
            default: 'cubic-bezier(0.4, 0, 0.2, 1)',
            bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
        }
    },

    // Scroll Settings
    scroll: {
        offset: 100,
        debounceDelay: 16,
        throttleDelay: 100
    },

    // Loading Screen
    loading: {
        minDuration: 1500,
        maxDuration: 5000,
        progressStep: 2
    },

    // Intersection Observer
    observer: {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    },

    // Particles
    particles: {
        count: 30,
        minSize: 2,
        maxSize: 6,
        minSpeed: 0.5,
        maxSpeed: 2,
        colors: ['#00cfff', '#00e5ff', '#3b82f6', '#8b5cf6', '#ec4899']
    },

    // Comments System
    comments: {
        maxLength: 500,
        storageKey: 'ahmed_portfolio_comments',
        sortDefault: 'newest'
    },

    // Toast
    toast: {
        duration: 4000,
        maxVisible: 3
    },

    // Mobile Detection
    mobile: {
        breakpoint: 1024,
        touchDelay: 300
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════ UTILITY FUNCTIONS ══════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
const Utils = {
    /**
     * Debounce function execution
     * @param {Function} func - Function to debounce
     * @param {number} wait - Delay in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait = CONFIG.scroll.debounceDelay) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function execution
     * @param {Function} func - Function to throttle
     * @param {number} limit - Limit in milliseconds
     * @returns {Function} Throttled function
     */
    throttle(func, limit = CONFIG.scroll.throttleDelay) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Generate unique ID
     * @returns {string} Unique identifier
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Format date to relative time
     * @param {Date|string} date - Date to format
     * @returns {string} Relative time string
     */
    timeAgo(date) {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return interval === 1 ? `منذ ${unit}` : `منذ ${interval} ${unit}`;
            }
        }
        return 'الآن';
    },

    /**
     * Format date to Arabic locale
     * @param {Date|string} date - Date to format
     * @returns {string} Formatted date string
     */
    formatDate(date) {
        return new Date(date).toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    /**
     * Animate number counting
     * @param {HTMLElement} element - Element to animate
     * @param {number} target - Target number
     * @param {number} duration - Animation duration
     */
    animateNumber(element, target, duration = 2000) {
        const start = 0;
        const startTime = performance.now();

        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeOut);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = target;
            }
        };

        requestAnimationFrame(updateNumber);
    },

    /**
     * Check if element is in viewport
     * @param {HTMLElement} element - Element to check
     * @returns {boolean} Whether element is in viewport
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= -100 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight + 100) &&
            rect.right <= window.innerWidth
        );
    },

    /**
     * Smooth scroll to element
     * @param {string|HTMLElement} target - Target element or selector
     * @param {number} offset - Offset from top
     */
    smoothScroll(target, offset = CONFIG.scroll.offset) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (!element) return;

        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    },

    /**
     * Create ripple effect on element
     * @param {MouseEvent|TouchEvent} event - Trigger event
     * @param {HTMLElement} element - Target element
     */
    createRipple(event, element) {
        const rect = element.getBoundingClientRect();
        const clientX = event.clientX || (event.touches && event.touches[0].clientX);
        const clientY = event.clientY || (event.touches && event.touches[0].clientY);

        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;

        element.style.setProperty('--x', `${x}%`);
        element.style.setProperty('--y', `${y}%`);
    },

    /**
     * Check if device is touch-enabled
     * @returns {boolean} Whether device supports touch
     */
    isTouchDevice() {
        return window.matchMedia('(pointer: coarse)').matches;
    },

    /**
     * Check if device is mobile
     * @returns {boolean} Whether device is mobile
     */
    isMobile() {
        return window.innerWidth < CONFIG.mobile.breakpoint;
    },

    /**
     * Preload image
     * @param {string} src - Image source URL
     * @returns {Promise} Promise that resolves when image loads
     */
    preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = src;
        });
    },

    /**
     * Clamp value between min and max
     * @param {number} value - Value to clamp
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Clamped value
     */
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    /**
     * Linear interpolation
     * @param {number} start - Start value
     * @param {number} end - End value
     * @param {number} factor - Interpolation factor (0-1)
     * @returns {number} Interpolated value
     */
    lerp(start, end, factor) {
        return start + (end - start) * factor;
    },

    /**
     * Map value from one range to another
     * @param {number} value - Value to map
     * @param {number} inMin - Input minimum
     * @param {number} inMax - Input maximum
     * @param {number} outMin - Output minimum
     * @param {number} outMax - Output maximum
     * @returns {number} Mapped value
     */
    mapRange(value, inMin, inMax, outMin, outMax) {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    },

    /**
     * Get random number in range
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random number
     */
    random(min, max) {
        return Math.random() * (max - min) + min;
    },

    /**
     * Get random item from array
     * @param {Array} array - Array to pick from
     * @returns {*} Random item
     */
    randomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    /**
     * Shuffle array
     * @param {Array} array - Array to shuffle
     * @returns {Array} Shuffled array
     */
    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    /**
     * Escape HTML special characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Truncate text with ellipsis
     * @param {string} text - Text to truncate
     * @param {number} maxLength - Maximum length
     * @returns {string} Truncated text
     */
    truncate(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    },

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} Whether copy succeeded
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.warn('Clipboard API failed, falling back:', err);
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                return true;
            } catch (e) {
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    },

    /**
     * Get initials from name
     * @param {string} name - Name to get initials from
     * @returns {string} Initials
     */
    getInitials(name) {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    },

    /**
     * Generate random color from palette
     * @returns {string} Random color
     */
    randomColor() {
        return Utils.randomItem(CONFIG.particles.colors);
    },

    /**
     * Parse JSON safely
     * @param {string} json - JSON string to parse
     * @param {*} defaultValue - Default value if parsing fails
     * @returns {*} Parsed value or default
     */
    safeJsonParse(json, defaultValue = null) {
        try {
            return JSON.parse(json);
        } catch {
            return defaultValue;
        }
    },

    /**
     * Stringify JSON safely
     * @param {*} value - Value to stringify
     * @returns {string|null} JSON string or null
     */
    safeJsonStringify(value) {
        try {
            return JSON.stringify(value);
        } catch {
            return null;
        }
    },

    /**
     * Add event listener with automatic cleanup tracking
     * @param {HTMLElement} element - Element to attach to
     * @param {string} event - Event name
     * @param {Function} handler - Event handler
     * @param {Object} options - Event options
     * @returns {Function} Cleanup function
     */
    addEvent(element, event, handler, options = {}) {
        element.addEventListener(event, handler, options);
        return () => element.removeEventListener(event, handler, options);
    },

    /**
     * Measure element performance
     * @param {string} label - Measurement label
     * @param {Function} callback - Function to measure
     * @returns {*} Callback result
     */
    measurePerformance(label, callback) {
        const start = performance.now();
        const result = callback();
        const end = performance.now();
        console.log(`[Performance] ${label}: ${(end - start).toFixed(2)}ms`);
        return result;
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════ LOADING SCREEN SYSTEM ═════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
class LoadingScreen {
    constructor() {
        this.element = document.getElementById('loading-screen');
        this.progressBar = document.getElementById('loading-progress-bar');
        this.percentage = document.getElementById('loading-percentage');
        this.particlesContainer = document.getElementById('loading-particles');
        this.progress = 0;
        this.isComplete = false;
        this.startTime = Date.now();

        this.init();
    }

    init() {
        if (!this.element) return;

        this.createParticles();
        this.simulateProgress();
        this.preloadCriticalAssets();
    }

    createParticles() {
        if (!this.particlesContainer) return;

        const particleCount = 15;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'loading-particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Utils.random(2, 6)}px;
                height: ${Utils.random(2, 6)}px;
                background: ${Utils.randomColor()};
                border-radius: 50%;
                left: ${Utils.random(0, 100)}%;
                top: ${Utils.random(0, 100)}%;
                opacity: ${Utils.random(0.3, 0.8)};
                animation: loadingParticleFloat ${Utils.random(3, 8)}s ease-in-out infinite;
                animation-delay: ${Utils.random(0, 5)}s;
                pointer-events: none;
            `;
            this.particlesContainer.appendChild(particle);
        }

        // Add particle animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes loadingParticleFloat {
                0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
                50% { transform: translate(${Utils.random(-30, 30)}px, ${Utils.random(-30, 30)}px) scale(1.2); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    simulateProgress() {
        const interval = setInterval(() => {
            if (this.isComplete) {
                clearInterval(interval);
                return;
            }

            // Random increment
            const increment = Utils.random(1, 5);
            this.progress = Math.min(this.progress + increment, 95);
            this.updateProgress();

            if (this.progress >= 95) {
                clearInterval(interval);
            }
        }, 100);
    }

    async preloadCriticalAssets() {
        const criticalImages = [
            'images/logo.png'
        ];

        const promises = criticalImages.map(src => 
            Utils.preloadImage(src).catch(() => null)
        );

        await Promise.all(promises);

        // Ensure minimum display time
        const elapsed = Date.now() - this.startTime;
        const remaining = Math.max(0, CONFIG.loading.minDuration - elapsed);

        setTimeout(() => {
            this.complete();
        }, remaining);
    }

    updateProgress() {
        if (this.progressBar) {
            this.progressBar.style.width = `${this.progress}%`;
        }
        if (this.percentage) {
            this.percentage.textContent = `${Math.floor(this.progress)}%`;
        }
    }

    complete() {
        if (this.isComplete) return;
        this.isComplete = true;

        this.progress = 100;
        this.updateProgress();

        setTimeout(() => {
            if (this.element) {
                this.element.classList.add('hidden');

                setTimeout(() => {
                    this.element.style.display = 'none';
                    document.body.classList.remove('loading');

                    // Trigger entrance animations
                    document.dispatchEvent(new CustomEvent('loadingComplete'));
                }, 800);
            }
        }, 300);
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════ SCROLL PROGRESS SYSTEM ════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
class ScrollProgress {
    constructor() {
        this.bar = document.getElementById('scroll-progress-bar');
        this.container = document.getElementById('scroll-progress-container');
        this.lastScrollY = 0;
        this.ticking = false;

        this.init();
    }

    init() {
        if (!this.bar) return;

        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.update();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }, { passive: true });

        this.update();
    }

    update() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        if (this.bar) {
            this.bar.style.width = `${Math.min(progress, 100)}%`;
        }

        this.lastScrollY = scrollTop;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════ CUSTOM CURSOR SYSTEM ═══════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
class CustomCursor {
    constructor() {
        this.cursor = document.getElementById('custom-cursor');
        this.trail = document.getElementById('custom-cursor-trail');
        this.glow = document.getElementById('cursor-glow');

        this.mouseX = 0;
        this.mouseY = 0;
        this.cursorX = 0;
        this.cursorY = 0;
        this.trailX = 0;
        this.trailY = 0;
        this.isActive = false;
        this.isHovering = false;
        this.rafId = null;

        this.init();
    }

    init() {
        if (!this.cursor || Utils.isTouchDevice()) return;

        this.cursor.classList.add('active');
        if (this.trail) this.trail.classList.add('active');
        if (this.glow) this.glow.classList.add('active');

        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.isActive = true;
        });

        document.addEventListener('mouseenter', () => {
            this.isActive = true;
        });

        document.addEventListener('mouseleave', () => {
            this.isActive = false;
        });

        // Track hoverable elements
        const hoverables = document.querySelectorAll('a, button, [data-tilt], .project-card, .service-card');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.isHovering = true;
                this.cursor.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                this.isHovering = false;
                this.cursor.classList.remove('hovering');
            });
        });

        this.animate();
    }

    animate() {
        if (!this.isActive) {
            this.rafId = requestAnimationFrame(() => this.animate());
            return;
        }

        // Smooth cursor following
        const cursorSpeed = this.isHovering ? 0.2 : 0.15;
        this.cursorX = Utils.lerp(this.cursorX, this.mouseX, cursorSpeed);
        this.cursorY = Utils.lerp(this.cursorY, this.mouseY, cursorSpeed);

        // Trail follows with more delay
        this.trailX = Utils.lerp(this.trailX, this.mouseX, 0.08);
        this.trailY = Utils.lerp(this.trailY, this.mouseY, 0.08);

        if (this.cursor) {
            this.cursor.style.left = `${this.cursorX}px`;
            this.cursor.style.top = `${this.cursorY}px`;
        }

        if (this.trail) {
            this.trail.style.left = `${this.trailX}px`;
            this.trail.style.top = `${this.trailY}px`;
        }

        if (this.glow) {
            this.glow.style.left = `${this.mouseX}px`;
            this.glow.style.top = `${this.mouseY}px`;
        }

        this.rafId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════ NAVIGATION SYSTEM ══════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
class Navigation {
    constructor() {
        this.navbar = document.getElementById('main-navbar');
        this.toggler = document.getElementById('navbar-toggler');
        this.mobileMenu = document.getElementById('navbar-mobile-menu');
        this.mobileClose = document.getElementById('mobile-menu-close');
        this.menuBackdrop = document.querySelector('.mobile-menu-backdrop');
        this.navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        this.langToggle = document.getElementById('lang-toggle');
        this.themeToggle = document.getElementById('theme-toggle');

        this.isOpen = false;
        this.currentLang = 'ar';
        this.currentTheme = 'dark';

        this.init();
    }

    init() {
        this.bindEvents();
        this.setupScrollBehavior();
        this.setupActiveLinkTracking();
        this.loadSavedPreferences();
    }

    bindEvents() {
        // Mobile menu toggle
        if (this.toggler) {
            this.toggler.addEventListener('click', () => this.toggleMenu());
        }

        if (this.mobileClose) {
            this.mobileClose.addEventListener('click', () => this.closeMenu());
        }

        if (this.menuBackdrop) {
            this.menuBackdrop.addEventListener('click', () => this.closeMenu());
        }

        // Smooth scroll for nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    Utils.smoothScroll(href);
                    this.closeMenu();
                }
            });
        });

        // Language toggle
        if (this.langToggle) {
            this.langToggle.addEventListener('click', () => this.toggleLanguage());
        }

        // Theme toggle
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.isOpen = !this.isOpen;

        if (this.toggler) {
            this.toggler.classList.toggle('active', this.isOpen);
            this.toggler.setAttribute('aria-expanded', this.isOpen);
        }

        if (this.mobileMenu) {
            this.mobileMenu.classList.toggle('active', this.isOpen);
        }

        document.body.classList.toggle('no-scroll', this.isOpen);
    }

    closeMenu() {
        this.isOpen = false;

        if (this.toggler) {
            this.toggler.classList.remove('active');
            this.toggler.setAttribute('aria-expanded', 'false');
        }

        if (this.mobileMenu) {
            this.mobileMenu.classList.remove('active');
        }

        document.body.classList.remove('no-scroll');
    }

    setupScrollBehavior() {
        let lastScroll = 0;

        window.addEventListener('scroll', Utils.throttle(() => {
            const currentScroll = window.scrollY;

            // Add/remove scrolled class
            if (this.navbar) {
                this.navbar.classList.toggle('scrolled', currentScroll > 50);
            }

            lastScroll = currentScroll;
        }, 100), { passive: true });
    }

    setupActiveLinkTracking() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');

                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('data-section') === id);
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-100px 0px -50% 0px'
        });

        sections.forEach(section => observer.observe(section));
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'ar' ? 'en' : 'ar';
        document.documentElement.lang = this.currentLang;
        document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';

        if (this.langToggle) {
            const text = this.langToggle.querySelector('.lang-toggle-text');
            if (text) text.textContent = this.currentLang === 'ar' ? 'EN' : 'AR';
        }

        localStorage.setItem('ahmed_portfolio_lang', this.currentLang);

        // Show toast
        ToastSystem.show(
            this.currentLang === 'ar' ? 'تم تغيير اللغة إلى العربية' : 'Language changed to English',
            'info'
        );
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.currentTheme);

        localStorage.setItem('ahmed_portfolio_theme', this.currentTheme);

        ToastSystem.show(
            this.currentTheme === 'dark' ? 'تم تفعيل الوضع الداكن' : 'Light mode activated',
            'info'
        );
    }

    loadSavedPreferences() {
        // Load theme
        const savedTheme = localStorage.getItem('ahmed_portfolio_theme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
            document.documentElement.setAttribute('data-theme', savedTheme);
        }

        // Load language
        const savedLang = localStorage.getItem('ahmed_portfolio_lang');
        if (savedLang) {
            this.currentLang = savedLang;
            document.documentElement.lang = savedLang;
            document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';

            if (this.langToggle) {
                const text = this.langToggle.querySelector('.lang-toggle-text');
                if (text) text.textContent = savedLang === 'ar' ? 'EN' : 'AR';
            }
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════ HERO SECTION SYSTEM ═══════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
class HeroSystem {
    constructor() {
        this.section = document.getElementById('hero');
        this.particlesContainer = document.getElementById('hero-particles');
        this.statsNumbers = document.querySelectorAll('.hero-stat-number[data-count]');
        this.title = document.getElementById('hero-title');
        this.subtitle = document.getElementById('hero-subtitle');
        this.description = document.getElementById('hero-description');
        this.cta = document.getElementById('hero-cta');
        this.scrollIndicator = document.getElementById('hero-scroll-indicator');
        this.logoWrapper = document.getElementById('hero-logo-wrapper');
        this.badge = document.getElementById('hero-badge');

        this.particles = [];
        this.rafId = null;
        this.isVisible = false;

        this.init();
    }

    init() {
        this.createParticles();
        this.setupScrollAnimations();
        this.setupStatCounters();
        this.setupParallax();

        // Entrance animations
        document.addEventListener('loadingComplete', () => {
            this.triggerEntranceAnimations();
        });
    }

    createParticles() {
        if (!this.particlesContainer || Utils.isTouchDevice()) return;

        const count = Utils.isMobile() ? 15 : CONFIG.particles.count;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            const size = Utils.random(CONFIG.particles.minSize, CONFIG.particles.maxSize);

            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${Utils.randomColor()};
                border-radius: 50%;
                pointer-events: none;
                will-change: transform;
            `;

            this.particlesContainer.appendChild(particle);

            this.particles.push({
                element: particle,
                x: Utils.random(0, 100),
                y: Utils.random(0, 100),
                speedX: Utils.random(-CONFIG.particles.maxSpeed, CONFIG.particles.maxSpeed),
                speedY: Utils.random(-CONFIG.particles.maxSpeed, CONFIG.particles.maxSpeed),
                size: size,
                opacity: Utils.random(0.3, 0.8)
            });
        }

        this.animateParticles();
    }

    animateParticles() {
        if (!this.isVisible && Utils.isMobile()) {
            this.rafId = requestAnimationFrame(() => this.animateParticles());
            return;
        }

        this.particles.forEach(p => {
            p.x += p.speedX * 0.1;
            p.y += p.speedY * 0.1;

            // Wrap around
            if (p.x < -5) p.x = 105;
            if (p.x > 105) p.x = -5;
            if (p.y < -5) p.y = 105;
            if (p.y > 105) p.y = -5;

            p.element.style.transform = `translate(${p.x}vw, ${p.y}vh)`;
            p.element.style.opacity = p.opacity;
        });

        this.rafId = requestAnimationFrame(() => this.animateParticles());
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.isVisible = entry.isIntersecting;
            });
        }, { threshold: 0.1 });

        if (this.section) {
            observer.observe(this.section);
        }
    }

    setupStatCounters() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.count);
                    Utils.animateNumber(entry.target, target, 2000);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.statsNumbers.forEach(stat => observer.observe(stat));
    }

    setupParallax() {
        if (Utils.isTouchDevice()) return;

        const orbs = document.querySelectorAll('.hero-orb');

        window.addEventListener('mousemove', Utils.throttle((e) => {
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;

            orbs.forEach((orb, index) => {
                const depth = (index + 1) * 20;
                const x = mouseX * depth;
                const y = mouseY * depth;
                orb.style.transform = `translate(${x}px, ${y}px)`;
            });
        }, 50));
    }

    triggerEntranceAnimations() {
        const elements = [
            { el: this.badge, delay: 200 },
            { el: this.logoWrapper, delay: 400 },
            { el: this.title, delay: 600 },
            { el: this.subtitle, delay: 800 },
            { el: this.description, delay: 1000 },
            { el: document.getElementById('hero-stats'), delay: 1200 },
            { el: this.cta, delay: 1400 },
            { el: this.scrollIndicator, delay: 1800 }
        ];

        elements.forEach(({ el, delay }) => {
            if (el) {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, delay);
            }
        });
    }

    destroy() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════ SCROLL REVEAL SYSTEM ═══════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .project-card, .service-card, .skills-category, .skill-item');
        this.observer = null;

        this.init();
    }

    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add stagger delay based on index
                    const delay = Array.from(this.elements).indexOf(entry.target) * 50;

                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, Math.min(delay, 500));

                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: CONFIG.observer.threshold,
            rootMargin: CONFIG.observer.rootMargin
        });

        this.elements.forEach(el => this.observer.observe(el));
    }

    refresh() {
        this.elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .project-card, .service-card, .skills-category, .skill-item');
        this.elements.forEach(el => {
            el.classList.remove('visible');
            this.observer.observe(el);
        });
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════ PROJECTS FILTER SYSTEM ════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
class ProjectsFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');

        this.init();
    }

    init() {
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                this.applyFilter(filter);
                this.updateActiveButton(btn);
            });
        });
    }

    applyFilter(filter) {
        this.projectCards.forEach(card => {
            const category = card.dataset.category;
            const shouldShow = filter === 'all' || category === filter;

            if (shouldShow) {
                card.style.display = '';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    updateActiveButton(activeBtn) {
        this.filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn === activeBtn);
        });
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════ 3D TILT SYSTEM ═══════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
class TiltSystem {
    constructor() {
        this.cards = document.querySelectorAll('[data-tilt]');

        this.init();
    }

    init() {
        if (Utils.isTouchDevice()) return;

        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
            card.addEventListener('mouseleave', () => this.handleMouseLeave(card));
            card.addEventListener('mouseenter', () => this.handleMouseEnter(card));
        });
    }

    handleMouseMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        card.style.transition = 'transform 0.1s ease-out';
    }

    handleMouseLeave(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        card.style.transition = 'transform 0.5s ease-out';
    }

    handleMouseEnter(card) {
        card.style.transition = 'transform 0.1s ease-out';
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════ SKILLS PROGRESS SYSTEM ═════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
class SkillsProgress {
    constructor() {
        this.bars = document.querySelectorAll('.skill-progress-bar');

        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.dataset.width;

                    setTimeout(() => {
                        bar.style.width = `${width}%`;
                    }, 200);

                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });

        this.bars.forEach(bar => observer.observe(bar));
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════ COMMENTS SYSTEM ══════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
class CommentsSystem {
    constructor() {
        this.form = document.getElementById('comments-form');
        this.list = document.getElementById('comments-list');
        this.empty = document.getElementById('comments-empty');
        this.count = document.getElementById('comments-count');
        this.commentersCount = document.getElementById('commenters-count');
        this.charCount = document.getElementById('char-count');
        this.messageInput = document.getElementById('comment-message');
        this.nameInput = document.getElementById('comment-name');
        this.emailInput = document.getElementById('comment-email');
        this.starRating = document.getElementById('star-rating');
        this.sortButtons = document.querySelectorAll('.sort-btn');

        this.comments = [];
        this.currentRating = 0;
        this.currentSort = 'newest';

        this.init();
    }

    init() {
        this.loadComments();
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        // Form submission
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addComment();
            });
        }

        // Character count
        if (this.messageInput) {
            this.messageInput.addEventListener('input', () => {
                const length = this.messageInput.value.length;
                if (this.charCount) {
                    this.charCount.textContent = length;
                }
            });
        }

        // Star rating
        if (this.starRating) {
            const stars = this.starRating.querySelectorAll('.star-btn');
            stars.forEach((star, index) => {
                star.addEventListener('click', () => {
                    this.currentRating = index + 1;
                    this.updateStarDisplay();
                });

                star.addEventListener('mouseenter', () => {
                    this.highlightStars(index + 1);
                });
            });

            this.starRating.addEventListener('mouseleave', () => {
                this.updateStarDisplay();
            });
        }

        // Sort buttons
        this.sortButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentSort = btn.dataset.sort;
                this.updateSortButtons();
                this.sortComments();
                this.render();
            });
        });
    }

    loadComments() {
        const stored = localStorage.getItem(CONFIG.comments.storageKey);
        if (stored) {
            this.comments = Utils.safeJsonParse(stored, []);
        }
    }

    saveComments() {
        localStorage.setItem(CONFIG.comments.storageKey, Utils.safeJsonStringify(this.comments));
    }

    addComment() {
        if (!this.nameInput || !this.messageInput) return;

        const name = this.nameInput.value.trim();
        const email = this.emailInput ? this.emailInput.value.trim() : '';
        const message = this.messageInput.value.trim();

        if (!name || !message) {
            ToastSystem.show('الرجاء ملء جميع الحقول المطلوبة', 'error');
            return;
        }

        if (message.length < 5) {
            ToastSystem.show('التعليق قصير جداً', 'error');
            return;
        }

        const comment = {
            id: Utils.generateId(),
            name: Utils.escapeHtml(name),
            email: Utils.escapeHtml(email),
            message: Utils.escapeHtml(message),
            rating: this.currentRating,
            timestamp: new Date().toISOString(),
            avatar: Utils.getInitials(name)
        };

        this.comments.unshift(comment);
        this.saveComments();

        // Reset form
        this.form.reset();
        this.currentRating = 0;
        this.updateStarDisplay();
        if (this.charCount) {
            this.charCount.textContent = '0';
        }

        // Show success
        ToastSystem.show('تم نشر التعليق بنجاح!', 'success');

        // Render and scroll
        this.render();
        this.scrollToComments();
    }

    deleteComment(id) {
        this.comments = this.comments.filter(c => c.id !== id);
        this.saveComments();
        this.render();
        ToastSystem.show('تم حذف التعليق', 'info');
    }

    sortComments() {
        if (this.currentSort === 'newest') {
            this.comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        } else {
            this.comments.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        }
    }

    updateStarDisplay() {
        if (!this.starRating) return;
        const stars = this.starRating.querySelectorAll('.star-btn');
        stars.forEach((star, index) => {
            star.classList.toggle('active', index < this.currentRating);
        });
    }

    highlightStars(count) {
        if (!this.starRating) return;
        const stars = this.starRating.querySelectorAll('.star-btn');
        stars.forEach((star, index) => {
            star.classList.toggle('active', index < count);
        });
    }

    updateSortButtons() {
        this.sortButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.sort === this.currentSort);
        });
    }

    render() {
        if (!this.list || !this.empty || !this.count || !this.commentersCount) return;

        // Update counts
        this.count.textContent = this.comments.length;
        const uniqueCommenters = new Set(this.comments.map(c => c.name)).size;
        this.commentersCount.textContent = uniqueCommenters;

        // Show/hide empty state
        const hasComments = this.comments.length > 0;
        this.empty.style.display = hasComments ? 'none' : 'block';
        this.list.style.display = hasComments ? 'flex' : 'none';

        if (!hasComments) return;

        // Render comments
        this.list.innerHTML = this.comments.map(comment => this.createCommentHTML(comment)).join('');

        // Bind delete buttons
        this.list.querySelectorAll('.comment-delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                if (confirm('هل أنت متأكد من حذف هذا التعليق؟')) {
                    this.deleteComment(id);
                }
            });
        });
    }

    createCommentHTML(comment) {
        const stars = '⭐'.repeat(comment.rating || 0);
        const timeAgo = Utils.timeAgo(comment.timestamp);
        const fullDate = Utils.formatDate(comment.timestamp);

        return `
            <div class="comment-card" data-id="${comment.id}">
                <div class="comment-header">
                    <div class="comment-author">
                        <div class="comment-avatar">${comment.avatar}</div>
                        <div class="comment-meta">
                            <span class="comment-name">${comment.name}</span>
                            <span class="comment-time" title="${fullDate}">${timeAgo}</span>
                        </div>
                    </div>
                    <div class="comment-rating">${stars}</div>
                </div>
                <div class="comment-body">${comment.message}</div>
                <div class="comment-footer">
                    <div class="comment-actions">
                        <button class="comment-action-btn comment-delete-btn" data-id="${comment.id}" aria-label="حذف التعليق">
                            <span>🗑️</span>
                            <span>حذف</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    scrollToComments() {
        if (this.list) {
            this.list.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════ CONTACT FORM SYSTEM ══════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.submitBtn = document.getElementById('contact-submit-btn');

        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Ripple effect on buttons
        const buttons = this.form.querySelectorAll('.form-submit-btn, .contact-quick-btn');
        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => Utils.createRipple(e, btn));
        });
    }

    handleSubmit() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());

        // Simulate form submission
        this.setLoading(true);

        setTimeout(() => {
            this.setLoading(false);
            this.form.reset();

            ToastSystem.show('تم إرسال رسالتك بنجاح! سأتواصل معك قريباً.', 'success');

            // Log for demo (in production, send to server)
            console.log('Contact Form Data:', data);
        }, 1500);
    }

    setLoading(loading) {
        if (!this.submitBtn) return;

        const text = this.submitBtn.querySelector('.form-submit-text');
        const icon = this.submitBtn.querySelector('.form-submit-icon');

        if (loading) {
            this.submitBtn.disabled = true;
            if (text) text.textContent = 'جاري الإرسال...';
            if (icon) icon.textContent = '⏳';
            this.submitBtn.style.opacity = '0.7';
        } else {
            this.submitBtn.disabled = false;
            if (text) text.textContent = 'إرسال الرسالة';
            if (icon) icon.textContent = '🚀';
            this.submitBtn.style.opacity = '1';
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════ TOAST NOTIFICATION SYSTEM ════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
class ToastSystem {
    static container = null;
    static toasts = [];
    static maxVisible = CONFIG.toast.maxVisible;

    static init() {
        this.container = document.getElementById('toast-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    }

    static show(message, type = 'info', duration = CONFIG.toast.duration) {
        if (!this.container) this.init();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        };

        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span>${message}</span>
        `;

        this.container.appendChild(toast);
        this.toasts.push(toast);

        // Remove old toasts if exceeding max
        while (this.toasts.length > this.maxVisible) {
            const oldToast = this.toasts.shift();
            if (oldToast && oldToast.parentNode) {
                oldToast.classList.add('hiding');
                setTimeout(() => {
                    if (oldToast.parentNode) {
                        oldToast.parentNode.removeChild(oldToast);
                    }
                }, 400);
            }
        }

        // Auto remove
        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
                this.toasts = this.toasts.filter(t => t !== toast);
            }, 400);
        }, duration);
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════ BACK TO TOP SYSTEM ══════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
class BackToTop {
    constructor() {
        this.button = document.getElementById('back-to-top');

        this.init();
    }

    init() {
        if (!this.button) return;

        window.addEventListener('scroll', Utils.throttle(() => {
            const scrollY = window.scrollY;
            this.button.classList.toggle('visible', scrollY > 500);
        }, 200), { passive: true });

        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════ RIPPLE EFFECT SYSTEM ═════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
class RippleSystem {
    constructor() {
        this.init();
    }

    init() {
        const buttons = document.querySelectorAll('.hero-btn, .form-submit-btn, .about-btn, .projects-btn');

        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => Utils.createRipple(e, btn));

            // Touch ripple for mobile
            btn.addEventListener('touchstart', (e) => {
                if (e.touches.length > 0) {
                    Utils.createRipple(e.touches[0], btn);
                }
            }, { passive: true });
        });
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════ PERFORMANCE MONITOR ════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        // Monitor Core Web Vitals
        if ('PerformanceObserver' in window) {
            // LCP
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.lcp = lastEntry.startTime;
                console.log(`[Performance] LCP: ${lastEntry.startTime.toFixed(2)}ms`);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // FID
            const fidObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    const delay = entry.processingStart - entry.startTime;
                    this.metrics.fid = delay;
                    console.log(`[Performance] FID: ${delay.toFixed(2)}ms`);
                }
            });
            fidObserver.observe({ entryTypes: ['first-input'] });

            // CLS
            const clsObserver = new PerformanceObserver((list) => {
                let clsValue = 0;
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                this.metrics.cls = clsValue;
                console.log(`[Performance] CLS: ${clsValue.toFixed(4)}`);
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }

        // Log page load time
        window.addEventListener('load', () => {
            const timing = performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            console.log(`[Performance] Page Load Time: ${loadTime}ms`);
        });
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════ APP INITIALIZATION ═══════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
class App {
    constructor() {
        this.modules = {};
        this.isReady = false;
    }

    async init() {
        console.log('[App] Initializing Portfolio System...');

        try {
            // Initialize core systems
            this.modules.loading = new LoadingScreen();
            this.modules.scrollProgress = new ScrollProgress();
            this.modules.cursor = new CustomCursor();
            this.modules.navigation = new Navigation();
            this.modules.hero = new HeroSystem();
            this.modules.scrollReveal = new ScrollReveal();
            this.modules.projectsFilter = new ProjectsFilter();
            this.modules.tilt = new TiltSystem();
            this.modules.skillsProgress = new SkillsProgress();
            this.modules.comments = new CommentsSystem();
            this.modules.contact = new ContactForm();
            this.modules.backToTop = new BackToTop();
            this.modules.ripple = new RippleSystem();
            this.modules.performance = new PerformanceMonitor();

            // Initialize toast system
            ToastSystem.init();

            // Setup global event listeners
            this.setupGlobalEvents();

            // Mark as ready
            this.isReady = true;
            console.log('[App] Portfolio System Initialized Successfully!');

        } catch (error) {
            console.error('[App] Initialization Error:', error);
            ToastSystem.show('حدث خطأ في تحميل الموقع. الرجاء تحديث الصفحة.', 'error');
        }
    }

    setupGlobalEvents() {
        // Handle visibility change (pause animations when tab hidden)
        document.addEventListener('visibilitychange', () => {
            const isVisible = document.visibilityState === 'visible';

            if (this.modules.hero) {
                if (isVisible) {
                    this.modules.hero.isVisible = true;
                } else {
                    this.modules.hero.isVisible = false;
                }
            }
        });

        // Handle resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Refresh scroll reveal on resize
                if (this.modules.scrollReveal) {
                    this.modules.scrollReveal.refresh();
                }
            }, 250);
        });

        // Handle orientation change on mobile
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 300);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // ESC to close mobile menu
            if (e.key === 'Escape') {
                if (this.modules.navigation) {
                    this.modules.navigation.closeMenu();
                }
            }
        });

        // Prevent context menu on images (optional security)
        document.addEventListener('contextmenu', (e) => {
            if (e.target.tagName === 'IMG') {
                // Allow context menu but could disable for production
            }
        });
    }

    destroy() {
        // Cleanup all modules
        Object.values(this.modules).forEach(module => {
            if (module && typeof module.destroy === 'function') {
                module.destroy();
            }
        });

        this.modules = {};
        this.isReady = false;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════ DOM READY INITIALIZATION ═══════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
let app = null;

document.addEventListener('DOMContentLoaded', () => {
    // Add loading class to body
    document.body.classList.add('loading');

    // Initialize app
    app = new App();
    app.init();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (app) {
        app.destroy();
    }
});

// Expose app to global scope for debugging (remove in production)
if (typeof window !== 'undefined') {
    window.AhmedPortfolio = {
        app: () => app,
        utils: Utils,
        config: CONFIG,
        version: '2026.1.0-god-tier'
    };
}

console.log('%c Ahmed Portfolio System ', 'background: linear-gradient(135deg, #00cfff, #8b5cf6); color: white; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 10px;');
console.log('%c Built with passion by Ahmed - Full Stack Developer ', 'color: #00cfff; font-size: 14px;');
console.log('%c 50+ Projects | React | Next.js | Node.js | Flutter ', 'color: #8b5cf6; font-size: 12px;');
