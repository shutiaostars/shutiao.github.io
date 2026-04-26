/* ═══════════════════════════════════════════════════════════════
   薯条 stars — 天文摄影师个人网站
   Shared JavaScript
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMobileMenu();
  initRevealAnimations();
  initSmoothScroll();
});

/* ── Navigation Scroll State ──────────────────────────────────── */
function initNavigation() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    // Add scrolled class when past hero
    nav.classList.toggle('scrolled', currentScroll > 60);
    
    lastScroll = currentScroll;
  }, { passive: true });
}

/* ── Mobile Menu ──────────────────────────────────────────────── */
function initMobileMenu() {
  const menuBtn = document.querySelector('.nav-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuClose = document.querySelector('.mobile-menu-close');
  const menuLinks = document.querySelectorAll('.mobile-menu a');
  
  if (!menuBtn || !mobileMenu) return;
  
  const openMenu = () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  
  const closeMenu = () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  };
  
  menuBtn.addEventListener('click', openMenu);
  menuClose?.addEventListener('click', closeMenu);
  menuLinks.forEach(link => link.addEventListener('click', closeMenu));
  
  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ── Reveal Animations ────────────────────────────────────────── */
function initRevealAnimations() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => observer.observe(el));
}

/* ── Smooth Scroll ────────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (!target) return;
      
      e.preventDefault();
      
      const navHeight = document.querySelector('.nav')?.offsetHeight || 72;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/* ── Image Lazy Loading ───────────────────────────────────────── */
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  if (!images.length) return;
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  }, {
    rootMargin: '100px 0px'
  });
  
  images.forEach(img => imageObserver.observe(img));
}

/* ── Parallax Effect ──────────────────────────────────────────── */
function initParallax(selector, speed = 0.3) {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    elements.forEach(el => {
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });
}

/* ── Counter Animation ────────────────────────────────────────── */
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

/* ── Filter Works ─────────────────────────────────────────────── */
function initWorkFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');
  
  if (!filterBtns.length || !workCards.length) return;
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Filter cards
      workCards.forEach(card => {
        const categories = card.dataset.category?.split(',') || [];
        
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = '';
          setTimeout(() => card.classList.add('visible'), 10);
        } else {
          card.classList.remove('visible');
          setTimeout(() => card.style.display = 'none', 400);
        }
      });
    });
  });
}

/* ── Lightbox ─────────────────────────────────────────────────── */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  
  if (!lightbox || !lightboxImg) return;
  
  document.querySelectorAll('[data-lightbox]').forEach(item => {
    item.addEventListener('click', () => {
      lightboxImg.src = item.dataset.lightbox;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  
  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };
  
  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox?.classList.contains('open')) {
      closeLightbox();
    }
  });
}

/* ── Tab System ───────────────────────────────────────────────── */
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  
  if (!tabBtns.length) return;
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tab;
      
      // Update buttons
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Update panels
      tabPanels.forEach(panel => {
        panel.classList.toggle('active', panel.id === targetId);
      });
    });
  });
}

/* ── Form Validation ──────────────────────────────────────────── */
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      let isValid = true;
      const inputs = form.querySelectorAll('[required]');
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('error');
        } else {
          input.classList.remove('error');
        }
      });
      
      if (!isValid) {
        e.preventDefault();
      }
    });
  });
}

/* ── Copy to Clipboard ────────────────────────────────────────── */
async function copyToClipboard(text, successCallback) {
  try {
    await navigator.clipboard.writeText(text);
    successCallback?.();
  } catch (err) {
    console.error('Failed to copy:', err);
  }
}

/* ── Format Date ──────────────────────────────────────────────── */
function formatDate(date, locale = 'zh-CN') {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/* ── Debounce ─────────────────────────────────────────────────── */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/* ── Throttle ─────────────────────────────────────────────────── */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
