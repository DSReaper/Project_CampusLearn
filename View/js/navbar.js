// Enhanced navigation functionality for both desktop and mobile
document.addEventListener('DOMContentLoaded', function() {
  const allNavItems = document.querySelectorAll('.nav-item, .sidebar-item');
  const mobileNavItems = document.querySelectorAll('.mobile-bottom-nav .nav-item');
  const floatingIndicator = document.getElementById('floatingIndicator');
  const currentPath = window.location.pathname;
  
  // Set active state based on current page
  allNavItems.forEach(item => {
    const href = item.getAttribute('href');
    item.classList.remove('active');
    
    if (href === currentPath || 
        (currentPath === '/' && href === '/') ||
        (currentPath.startsWith(href) && href !== '/')) {
      item.classList.add('active');
    }
  });
  
  // Position floating indicator on mobile
  function updateFloatingIndicator() {
    if (!floatingIndicator || window.innerWidth > 768) return;
    
    const activeItem = document.querySelector('.mobile-bottom-nav .nav-item.active');
    if (activeItem) {
      const index = parseInt(activeItem.getAttribute('data-index'));
      const navContainer = activeItem.closest('.nav-container');
      const containerWidth = navContainer.offsetWidth;
      const itemWidth = containerWidth / 5; // 5 items
      const indicatorPosition = (index * itemWidth) + (itemWidth / 2) - 30; // 30 = half indicator width
      
      floatingIndicator.style.left = `${indicatorPosition}px`;
    }
  }
  
  // Initialize floating indicator position
  updateFloatingIndicator();
  
  // Update on window resize
  window.addEventListener('resize', updateFloatingIndicator);
  
  // Enhanced click handlers
  allNavItems.forEach(item => {
    item.addEventListener('click', function(e) {
      // Skip logout items
      if (this.classList.contains('logout')) return;
      
      // Ripple effect for mobile nav
      if (this.closest('.mobile-bottom-nav')) {
        createRippleEffect(this);
      }
      
      // Add loading state
      this.classList.add('loading');
      
      // Remove active from all corresponding items
      const isMobile = this.closest('.mobile-bottom-nav');
      const targetPage = this.getAttribute('data-page');
      
      if (isMobile) {
        // Update mobile nav
        mobileNavItems.forEach(nav => nav.classList.remove('active'));
        // Update desktop nav
        document.querySelectorAll('.sidebar-item').forEach(nav => {
          if (nav.getAttribute('data-page') === targetPage) {
            nav.classList.remove('active');
          }
        });
      } else {
        // Update desktop nav
        document.querySelectorAll('.sidebar-item').forEach(nav => nav.classList.remove('active'));
        // Update mobile nav
        mobileNavItems.forEach(nav => {
          if (nav.getAttribute('data-page') === targetPage) {
            nav.classList.remove('active');
          }
        });
      }
      
      // Add active to clicked item and corresponding item
      this.classList.add('active');
      if (isMobile) {
        const correspondingSidebarItem = document.querySelector(`.sidebar-item[data-page="${targetPage}"]`);
        if (correspondingSidebarItem) {
          correspondingSidebarItem.classList.add('active');
        }
      } else {
        const correspondingMobileItem = document.querySelector(`.mobile-bottom-nav .nav-item[data-page="${targetPage}"]`);
        if (correspondingMobileItem) {
          correspondingMobileItem.classList.add('active');
        }
      }
      
      // Update floating indicator with smooth animation
      if (isMobile) {
        setTimeout(() => {
          updateFloatingIndicator();
        }, 50);
      }
      
      // Remove loading state after animation
      setTimeout(() => {
        this.classList.remove('loading');
      }, 600);
    });
    
    // Enhanced touch feedback
    item.addEventListener('touchstart', function(e) {
      if (this.closest('.mobile-bottom-nav')) {
        this.style.transform = 'translateY(-8px) scale(0.95)';
      } else {
        this.style.transform = 'scale(0.98)';
      }
    });
    
    item.addEventListener('touchend', function(e) {
      this.style.transform = '';
    });
    
    // Magnetic hover effect for mobile
    if (item.closest('.mobile-bottom-nav')) {
      item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.05)';
      });
      
      item.addEventListener('mouseleave', function() {
        if (!this.classList.contains('active')) {
          this.style.transform = '';
        } else {
          this.style.transform = 'translateY(-8px) scale(1.1)';
        }
      });
    }
  });
  
  // Ripple effect function
  function createRippleEffect(element) {
    const ripple = element.querySelector('.nav-ripple');
    if (!ripple) return;
    
    // Reset ripple
    element.classList.remove('ripple-active');
    
    // Trigger ripple animation
    setTimeout(() => {
      element.classList.add('ripple-active');
    }, 10);
    
    // Remove ripple class after animation
    setTimeout(() => {
      element.classList.remove('ripple-active');
    }, 600);
  }
  
  // Update notification badges with enhanced animation
  function updateNotificationBadge(page, count) {
    const navItems = document.querySelectorAll(`[data-page="${page}"]`);
    navItems.forEach(navItem => {
      if (count > 0) {
        navItem.setAttribute('data-badge', count > 99 ? '99+' : count.toString());
        // Add bounce animation
        navItem.style.animation = 'badge-bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        setTimeout(() => {
          navItem.style.animation = '';
        }, 600);
      } else {
        navItem.removeAttribute('data-badge');
      }
    });
  }
  
  // Parallax effect for floating indicator
  let ticking = false;
  
  function updateParallax() {
    if (!floatingIndicator || window.innerWidth > 768) return;
    
    const scrollY = window.pageYOffset;
    const parallaxSpeed = 0.02;
    
    floatingIndicator.style.transform = `translateY(-50%) translateZ(0) rotateZ(${scrollY * parallaxSpeed}deg)`;
    
    ticking = false;
  }
  
  function requestParallaxTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }
  
  // Add scroll listener for parallax
  window.addEventListener('scroll', requestParallaxTick, { passive: true });
  
  // Intersection Observer for nav animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '-50px 0px'
  };
  
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const nav = document.querySelector('.mobile-bottom-nav');
      if (!nav) return;
      
      if (entry.isIntersecting) {
        nav.style.transform = 'translateY(0)';
        nav.style.opacity = '1';
      } else {
        nav.style.transform = 'translateY(10px)';
        nav.style.opacity = '0.95';
      }
    });
  }, observerOptions);
  
  // Observe main content
  const mainContent = document.querySelector('.wrap, main, .content');
  if (mainContent) {
    navObserver.observe(mainContent);
  }
  
  // Add CSS keyframes for badge bounce
  const style = document.createElement('style');
  style.textContent = `
    @keyframes badge-bounce {
      0% { transform: scale(0) rotate(0deg); }
      50% { transform: scale(1.3) rotate(10deg); }
      100% { transform: scale(1) rotate(0deg); }
    }
  `;
  document.head.appendChild(style);
  
  // Make functions globally available
  window.updateNotificationBadge = updateNotificationBadge;
  window.updateFloatingIndicator = updateFloatingIndicator;
  
  // Auto-hide/show nav on scroll (mobile)
  let lastScrollTop = 0;
  let scrollTimer = null;
  
  window.addEventListener('scroll', function() {
    if (window.innerWidth > 768) return;
    
    const nav = document.querySelector('.mobile-bottom-nav');
    if (!nav) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down
      nav.style.transform = 'translateY(100%)';
    } else {
      // Scrolling up
      nav.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    
    // Clear existing timer
    if (scrollTimer) {
      clearTimeout(scrollTimer);
    }
    
    // Show nav after scroll stops
    scrollTimer = setTimeout(() => {
      nav.style.transform = 'translateY(0)';
    }, 1000);
  }, { passive: true });
});