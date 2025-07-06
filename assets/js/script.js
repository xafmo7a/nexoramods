'use strict';

/**
 * Mobile detection and performance optimizations
 */
const isMobile = window.innerWidth <= 768;
const isSmallMobile = window.innerWidth <= 480;

// Reduce animation complexity on mobile
if (isMobile) {
  // Disable heavy animations on mobile
  document.documentElement.style.setProperty('--transition-1', '0.15s ease');
  document.documentElement.style.setProperty('--transition-2', '0.2s ease');
  
  // Hide SVG background on mobile for better performance
  const svgBackground = document.querySelector('svg[preserveAspectRatio]');
  if (svgBackground) {
    svgBackground.style.display = 'none';
  }
  
  // Optimize scroll performance on mobile
  let ticking = false;
  const originalScrollHandler = window.onscroll;
  
  window.onscroll = function() {
    if (!ticking) {
      requestAnimationFrame(function() {
        if (originalScrollHandler) originalScrollHandler();
        ticking = false;
      });
      ticking = true;
    }
  };
  
  // Reduce touch sensitivity for better performance
  document.addEventListener('touchstart', function() {}, {passive: true});
  document.addEventListener('touchmove', function() {}, {passive: true});
}

/**
 * Splash Screen functionality
 */

const splashScreen = document.getElementById('splashScreen');

const hideSplashScreen = function() {
  if (splashScreen) {
    // Add hidden class to trigger fade out animation
    splashScreen.classList.add('hidden');
    
    // Show the main background when splash screen starts fading
    const mainBackground = document.querySelector('.main-background');
    if (mainBackground) {
      mainBackground.style.opacity = '0';
      mainBackground.style.transition = 'opacity 1.2s ease';
      setTimeout(() => {
        mainBackground.style.opacity = '1';
      }, 100);
    }
    
    // Remove splash screen from DOM after animation completes
    setTimeout(() => {
      splashScreen.remove();
    }, 1200); // Match the CSS transition duration
  }
};

// Hide splash screen after 4 seconds to allow users to see the beautiful animation
setTimeout(hideSplashScreen, 4000);

// Also hide splash screen on user interaction (click, scroll, keypress)
const hideSplashOnInteraction = function() {
  hideSplashScreen();
  // Remove event listeners after first interaction
  document.removeEventListener('click', hideSplashOnInteraction);
  document.removeEventListener('scroll', hideSplashOnInteraction);
  document.removeEventListener('keydown', hideSplashOnInteraction);
};

document.addEventListener('click', hideSplashOnInteraction);
document.addEventListener('scroll', hideSplashOnInteraction);
document.addEventListener('keydown', hideSplashOnInteraction);

/**
 * add Event on elements
 */

const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}



/**
 * navbar toggle
 */

const wrapper = document.querySelector(".wrapper");
const navbarLinks = document.querySelectorAll("[data-nav-link]");

const closeNavbar = function () {
  wrapper.classList.remove("active");
  const overlay = document.querySelector("[data-overlay]");
  if (overlay) overlay.classList.remove("active");
  const menuBtn = document.querySelector(".mobile-menu-btn");
  if (menuBtn) menuBtn.classList.remove("active");
  document.body.style.overflow = "";
  document.body.classList.remove("nav-active");
}

// Close navbar on mobile when clicking links
if (window.innerWidth <= 768) {
  addEventOnElem(navbarLinks, "click", closeNavbar);
}

// Handle menu item active states
const menuItems = document.querySelectorAll(".menu > div > div");

const setActiveMenuItem = function(clickedItem) {
  // Remove active class from all menu items
  menuItems.forEach(item => {
    item.classList.remove("active");
  });
  
  // Add active class to clicked item
  clickedItem.classList.add("active");
  
  // Remove active class after a short delay for visual feedback
  setTimeout(() => {
    clickedItem.classList.remove("active");
  }, 300);
}

// Add click event listeners to menu items
addEventOnElem(menuItems, "click", function() {
  setActiveMenuItem(this);
});



/**
 * Modern dropdown functionality
 */

const dropdowns = document.querySelectorAll('.modern-dropdown');

dropdowns.forEach(dropdown => {
  const trigger = dropdown.querySelector('.dropdown-trigger');
  const menu = dropdown.querySelector('.modern-dropdown-menu');
  
  if (trigger && menu) {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Close other dropdowns
      dropdowns.forEach(otherDropdown => {
        if (otherDropdown !== dropdown) {
          otherDropdown.classList.remove('active');
        }
      });
      
      // Toggle current dropdown
      dropdown.classList.toggle('active');
    });
  }
});

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.modern-dropdown')) {
    dropdowns.forEach(dropdown => {
      dropdown.classList.remove('active');
    });
  }
});

// Close dropdowns on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    dropdowns.forEach(dropdown => {
      dropdown.classList.remove('active');
    });
  }
});



/**
 * header & back top btn show when scroll down to 100px
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const headerActive = function () {
  if (window.scrollY > 80) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
}

addEventOnElem(window, "scroll", headerActive);



/**
 * Contact form functionality
 */

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Create mailto link
    const mailtoLink = `mailto:nexorawebdev@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message
    showFormMessage('Thank you for your message! Your email client should open now.', 'success');
    
    // Reset form
    contactForm.reset();
  });
}

function showFormMessage(message, type) {
  // Remove existing messages
  const existingMessages = document.querySelectorAll('.form-success-message, .form-error-message');
  existingMessages.forEach(msg => msg.remove());
  
  // Create new message element
  const messageElement = document.createElement('div');
  messageElement.className = type === 'success' ? 'form-success-message' : 'form-error-message';
  messageElement.textContent = message;
  messageElement.style.display = 'block';
  
  // Insert message before the form
  contactForm.parentNode.insertBefore(messageElement, contactForm);
  
  // Auto-hide message after 5 seconds
  setTimeout(() => {
    messageElement.style.display = 'none';
  }, 5000);
}



/**
 * Mobile menu functionality
 */

const toggleMenu = function() {
  const wrapper = document.querySelector(".wrapper");
  const overlay = document.querySelector("[data-overlay]");
  const menuBtn = document.querySelector(".mobile-menu-btn");
  
  wrapper.classList.toggle("active");
  overlay.classList.toggle("active");
  menuBtn.classList.toggle("active");
  document.body.classList.toggle("nav-active");
  
  // Prevent background scrolling when menu is open
  if (wrapper.classList.contains("active")) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
}

// Mobile menu button click handler
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleMenu();
  });
}

// Overlay click handler
const overlay = document.querySelector("[data-overlay]");
if (overlay) {
  overlay.addEventListener("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    closeNavbar();
  });
}

// Close menu when clicking nav links (mobile only)
const navLinks = document.querySelectorAll("[data-nav-link]");
navLinks.forEach(link => {
  link.addEventListener("click", function() {
    // Only close menu on mobile
    if (window.innerWidth <= 768) {
      closeNavbar();
    }
  });
});

// Close mobile menu when screen size changes to desktop
window.addEventListener('resize', function() {
  if (window.innerWidth > 768) {
    closeNavbar();
  }
});

// Close mobile menu when clicking outside (on mobile)
document.addEventListener('click', function(e) {
  if (window.innerWidth <= 768) {
    const wrapper = document.querySelector(".wrapper");
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
    const overlay = document.querySelector("[data-overlay]");
    
    // If menu is open and click is outside menu, hamburger button, and overlay
    if (wrapper && wrapper.classList.contains("active") && 
        !wrapper.contains(e.target) && 
        !mobileMenuBtn.contains(e.target) &&
        !overlay.contains(e.target)) {
      closeNavbar();
    }
  }
});

/**
 * Internationalization (i18n) functionality
 */

// Language data
const translations = {
  en: {
    nav: {
      home: "Home",
      services: "Services",
      portfolio: "Portfolio",
      features: "Features",
      blog: "Blog",
      contact: "Contact"
    },
    hero: {
      title: "Building Digital Product, Brand and Experience",
      subtitle: "At Devnexora we specialize in designing, building, shipping and scaling beautiful, usable products with blazing-fast efficiency",
      howItWorks: "How It Works",
      behindScenes: "Behind the scenes"
    },
    services: {
      subtitle: "Our Services",
      title: "Managing you business with our best service",
      individuals: "Individuals",
      companies: "Companies",
      startups: "Startups",
      website: "Website",
      softwareSolutions: "Software Solutions",
      mvp: "MVP",
      forIndividualProfessionals: "For individual professionals",
      forBusinesses: "For businesses and organizations",
      forStartups: "For startups and new ventures"
    },
    features: {
      subtitle: "Why Choose us",
      title: "Specialist in aviding clients of financial challenges",
      fastWorking: {
        title: "Fast working process",
        description: "At Devnexora, we specialize in designing, building, shipping, and scaling beautiful digital products — with speed and efficiency at every step."
      },
      dedicatedTeam: {
        title: "Dedicated team",
        description: "Our dedicated team delivers high-quality solutions by designing, building, shipping, and scaling exceptional products tailored to your needs."
      },
      support: {
        title: "24/7 hours support",
        description: "We provide around-the-clock support to ensure your projects run smoothly — from design and development to scaling and beyond."
      },
      whatsapp: {
        title: "WhatsApp Support",
        description: "Get instant support and quick responses through WhatsApp. Connect with our team directly for fast communication and project updates."
      }
    },
    contact: {
      subtitle: "Get In Touch",
      title: "Let's work together",
      emailUs: "Email Us",
      whatsappUs: "WhatsApp Us",
      callUs: "Call Us",
      visitUs: "Visit Us",
      sendMessage: "Send Message"
    }
  },
  fr: {
    nav: {
      home: "Accueil",
      services: "Services",
      portfolio: "Portfolio",
      features: "Fonctionnalités",
      blog: "Blog",
      contact: "Contact"
    },
    hero: {
      title: "Création de produits digitaux, de marques et d'expériences",
      subtitle: "Chez Devnexora, nous sommes spécialisés dans la conception, le développement, le déploiement et la mise à l'échelle de produits beaux, utilisables et efficaces à une vitesse fulgurante",
      howItWorks: "Comment ça marche",
      behindScenes: "Dans les coulisses"
    },
    services: {
      subtitle: "Nos Services",
      title: "Gérez votre activité grâce à nos meilleurs services",
      individuals: "Individus",
      companies: "Entreprises",
      startups: "Startups",
      website: "Site Web",
      softwareSolutions: "Solutions logicielles",
      mvp: "MVP",
      forIndividualProfessionals: "Pour les professionnels indépendants",
      forBusinesses: "Pour les entreprises et organisations",
      forStartups: "Pour les startups et les nouveaux projets"
    },
    features: {
      subtitle: "Pourquoi nous choisir",
      title: "Spécialistes pour aider nos clients à éviter les défis financiers",
      fastWorking: {
        title: "Processus rapide",
        description: "Chez Devnexora, nous concevons, développons, lançons et faisons évoluer de magnifiques produits numériques — avec rapidité et efficacité à chaque étape."
      },
      dedicatedTeam: {
        title: "Équipe dédiée",
        description: "Notre équipe dédiée livre des solutions de haute qualité en concevant, développant, lançant et faisant évoluer des produits exceptionnels adaptés à vos besoins."
      },
      support: {
        title: "Support 24h/24 et 7j/7",
        description: "Nous assurons un support continu pour garantir le bon déroulement de vos projets — de la conception au développement, jusqu'à la mise à l'échelle."
      },
      whatsapp: {
        title: "Support WhatsApp",
        description: "Recevez une assistance instantanée et des réponses rapides via WhatsApp. Communiquez directement avec notre équipe pour un suivi en temps réel de vos projets."
      }
    },
    contact: {
      subtitle: "Contactez-nous",
      title: "Travaillons ensemble",
      emailUs: "Envoyez-nous un e-mail",
      whatsappUs: "Écrivez-nous sur WhatsApp",
      callUs: "Appelez-nous",
      visitUs: "Rendez-nous visite",
      sendMessage: "Envoyer le message"
    }
  }
  
};

// Current language
let currentLang = 'en';

// Function to update text content
function updateTextContent() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    const keys = key.split('.');
    let value = translations[currentLang];
    
    for (const k of keys) {
      value = value[k];
    }
    
    if (value) {
      element.textContent = value;
    }
  });
}

// Function to switch language
function switchLanguage(lang) {
  currentLang = lang;
  
  // Update active button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-lang="${lang}"]`).classList.add('active');
  
  // Update text content
  updateTextContent();
  
  // Save language preference
  localStorage.setItem('preferred-language', lang);
}

// Initialize language switcher
function initLanguageSwitcher() {
  // Get saved language preference
  const savedLang = localStorage.getItem('preferred-language') || 'en';
  
  // Set initial language
  switchLanguage(savedLang);
  
  // Add event listeners to language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const lang = this.getAttribute('data-lang');
      switchLanguage(lang);
    });
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initLanguageSwitcher();
});