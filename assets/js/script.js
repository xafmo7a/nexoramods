'use strict';



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

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
}

addEventOnElem(navTogglers, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  overlay.classList.remove("active");
}

addEventOnElem(navbarLinks, "click", closeNavbar);



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
  const navbar = document.querySelector("[data-navbar]");
  const overlay = document.querySelector("[data-overlay]");
  const menuBtn = document.querySelector("[data-nav-toggler]");
  
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  menuBtn.classList.toggle("active");
  document.body.classList.toggle("nav-active");
  
  // Prevent background scrolling when menu is open
  if (navbar.classList.contains("active")) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
}

// Ensure all click events are properly set
document.querySelector("[data-nav-toggler]").addEventListener("click", toggleMenu);
document.querySelector("[data-overlay]").addEventListener("click", toggleMenu);

// Close menu when clicking nav links
const navLinks = document.querySelectorAll("[data-nav-link]");
navLinks.forEach(link => {
  link.addEventListener("click", toggleMenu);
});