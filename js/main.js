/**
 * CAREER LAUNCHPAD - Main JavaScript
 * Handles: Navigation, Animations, FAQ, Scroll Effects, Counters
 */

(function () {
  'use strict';

  // ============================================================
  // 1. NAVIGATION — Sticky + Active State + Mobile Toggle
  // ============================================================

  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');

  // Sticky navbar on scroll
  function handleNavbarScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Run on load

  // Mobile menu toggle
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      const isOpen = mobileNav.classList.toggle('open');
      // Animate hamburger to X
      const spans = menuToggle.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close mobile menu on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });
  }

  // ============================================================
  // 2. SCROLL ANIMATIONS — Intersection Observer
  // ============================================================

  function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            // Once animated, stop observing
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
      }
    );

    elements.forEach((el) => observer.observe(el));
  }

  // ============================================================
  // 3. FAQ ACCORDION
  // ============================================================

  function toggleFAQ(button) {
    const faqItem = button.closest('.faq-item');
    const isOpen = faqItem.classList.contains('open');

    // Close all other open FAQs
    document.querySelectorAll('.faq-item.open').forEach(item => {
      if (item !== faqItem) {
        item.classList.remove('open');
      }
    });

    // Toggle current
    faqItem.classList.toggle('open', !isOpen);
  }

  // Make toggleFAQ globally available
  window.toggleFAQ = toggleFAQ;

  // ============================================================
  // 4. COUNTER ANIMATION — For Metrics
  // ============================================================

  function animateCounter(el) {
    const target = el.dataset.target;
    const isFloat = target.includes('.');
    const numericValue = parseFloat(target.replace(/[^0-9.]/g, ''));
    const suffix = target.replace(/[0-9.,]/g, '');
    const prefix = '';
    const duration = 1800;
    const steps = 60;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = numericValue * eased;
      
      el.textContent = isFloat 
        ? current.toFixed(1) + suffix
        : Math.floor(current).toLocaleString('en-IN') + suffix;

      if (currentStep >= steps) {
        clearInterval(timer);
        el.textContent = target.includes('+') 
          ? Math.floor(numericValue).toLocaleString('en-IN') + '+'
          : target;
      }
    }, stepTime);
  }

  function initCounters() {
    const counters = document.querySelectorAll('[data-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !entry.target.dataset.counted) {
            entry.target.dataset.counted = 'true';
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(counter => observer.observe(counter));
  }

  // ============================================================
  // 5. SMOOTH SCROLL for anchor links
  // ============================================================

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const navHeight = parseInt(
            getComputedStyle(document.documentElement)
              .getPropertyValue('--nav-height')
          ) || 72;
          
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ============================================================
  // 6. HERO STATS — Animated number reveal
  // ============================================================

  function initHeroStats() {
    const statNumbers = document.querySelectorAll('.hero-stat-number');
    const stats = [
      { el: statNumbers[0], from: 0, to: 50, suffix: '+', label: '' },
      { el: statNumbers[1], from: 0, to: 5000, suffix: '+', label: '' },
      { el: statNumbers[2], from: 1, to: 3, suffix: '×', label: '' },
    ];
    
    // These are set statically via HTML, so just ensure they're visible after load
    setTimeout(() => {
      statNumbers.forEach(el => {
        el.style.opacity = '1';
      });
    }, 800);
  }

  // ============================================================
  // 7. PARALLAX HERO ORBS (subtle mouse tracking)
  // ============================================================

  function initParallax() {
    const orbs = document.querySelectorAll('.hero-orb');
    if (!orbs.length) return;

    let mouseX = 0, mouseY = 0;
    let rafId = null;

    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          orbs.forEach((orb, i) => {
            const factor = i === 0 ? 20 : 15;
            orb.style.transform = `translate(${mouseX * factor}px, ${mouseY * factor}px)`;
          });
          rafId = null;
        });
      }
    });
  }

  // ============================================================
  // 8. CARD TILT EFFECT — Subtle 3D tilt on hover
  // ============================================================

  function initCardTilt() {
    const cards = document.querySelectorAll('.feature-card, .course-card, .testimonial-card');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;
        
        card.style.transform = `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s ease';
        setTimeout(() => {
          card.style.transition = '';
        }, 500);
      });
    });
  }

  // ============================================================
  // 9. PAGE LOAD PROGRESS INDICATOR
  // ============================================================

  function initLoadingBar() {
    const bar = document.createElement('div');
    bar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, #3B82F6, #8B5CF6);
      z-index: 9999;
      transition: width 0.3s ease, opacity 0.3s ease;
      width: 0%;
    `;
    document.body.appendChild(bar);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 90) progress = 90;
      bar.style.width = progress + '%';
    }, 100);

    window.addEventListener('load', () => {
      clearInterval(interval);
      bar.style.width = '100%';
      setTimeout(() => {
        bar.style.opacity = '0';
        setTimeout(() => bar.remove(), 300);
      }, 400);
    });
  }

  // ============================================================
  // 10. ACTIVE NAV LINK HIGHLIGHTING (current page)
  // ============================================================

  function setActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
    
    navLinks.forEach(link => {
      const linkPath = link.getAttribute('href');
      if (linkPath === currentPath || 
          (currentPath === '' && linkPath === 'index.html') ||
          (linkPath && linkPath.includes(currentPath) && currentPath !== 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // ============================================================
  // 11. WHATSAPP BUTTON PULSE
  // ============================================================

  function initWhatsAppPulse() {
    const btn = document.querySelector('.whatsapp-float');
    if (!btn) return;

    // Add pulse ring
    const ring = document.createElement('div');
    ring.style.cssText = `
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 2px solid rgba(37, 211, 102, 0.4);
      animation: waPulse 2s ease-out infinite;
      pointer-events: none;
    `;
    btn.style.position = 'relative';
    btn.appendChild(ring);

    // Add CSS keyframe
    const style = document.createElement('style');
    style.textContent = `
      @keyframes waPulse {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(1.5); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // ============================================================
  // 12. FORM VALIDATION FEEDBACK
  // ============================================================

  function initFormValidation() {
    const inputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        if (input.hasAttribute('required') && !input.value.trim()) {
          input.style.borderColor = 'rgba(239,68,68,0.5)';
          input.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.08)';
        } else if (input.value.trim()) {
          input.style.borderColor = 'rgba(16,185,129,0.4)';
          input.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.08)';
        }
      });

      input.addEventListener('focus', () => {
        input.style.borderColor = '';
        input.style.boxShadow = '';
      });
    });
  }

  // ============================================================
  // 13. SECTION REVEAL — Background gradient follows scroll
  // ============================================================

  function initScrollGlow() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const maxScroll = window.innerHeight;
      const opacity = Math.max(0, 1 - scrollY / maxScroll);
      hero.querySelector('.hero-gradient').style.opacity = opacity;
    }, { passive: true });
  }

  // ============================================================
  // INIT ALL
  // ============================================================

  function init() {
    initLoadingBar();
    initScrollAnimations();
    initCounters();
    initSmoothScroll();
    initHeroStats();
    setActiveNavLink();
    initFormValidation();
    
    // Only run heavy effects on desktop
    if (window.innerWidth > 768) {
      initParallax();
      initCardTilt();
      initScrollGlow();
    }

    // Delayed init for non-critical effects
    setTimeout(() => {
      initWhatsAppPulse();
    }, 2000);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
