/* ========================================
   HOTEL SR INDORE - CONTACT PAGE
   Developed by The Unlock Sales
   Contact Form Handler & Validation
======================================== */

document.addEventListener('DOMContentLoaded', function() {
  initContactForm();
  initFAQAccordion();
});

/* ========================================
   CONTACT FORM HANDLER
======================================== */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  
  if (!contactForm) return;

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const formData = {
      name: document.getElementById('contactName').value.trim(),
      phone: document.getElementById('contactPhone').value.trim(),
      email: document.getElementById('contactEmail').value.trim(),
      subject: document.getElementById('contactSubject').value,
      message: document.getElementById('contactMessage').value.trim()
    };

    // Validate form
    if (!validateContactForm(formData)) {
      return;
    }

    // Show loading state
    const submitBtn = contactForm.querySelector('.btn-submit-contact');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Send via WhatsApp (Primary Method)
    sendViaWhatsApp(formData);

    // Show success message
    setTimeout(() => {
      const successMsg = document.getElementById('contactSuccess');
      successMsg.style.display = 'block';
      
      // Reset form
      contactForm.reset();
      
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;

      // Hide success message after 5 seconds
      setTimeout(() => {
        successMsg.style.display = 'none';
      }, 5000);
      
      // Scroll to success message
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1500);
  });
}

/* ========================================
   FORM VALIDATION
======================================== */
function validateContactForm(data) {
  // Name validation
  if (data.name.length < 2) {
    showError('Please enter a valid name (minimum 2 characters)');
    document.getElementById('contactName').focus();
    return false;
  }

  // Phone validation (Indian format)
  const phoneRegex = /^[6-9]\d{9}$/;
  const cleanPhone = data.phone.replace(/[^0-9]/g, '');
  
  if (!phoneRegex.test(cleanPhone)) {
    showError('Please enter a valid 10-digit Indian phone number');
    document.getElementById('contactPhone').focus();
    return false;
  }

  // Email validation (if provided)
  if (data.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      showError('Please enter a valid email address');
      document.getElementById('contactEmail').focus();
      return false;
    }
  }

  // Subject validation
  if (!data.subject) {
    showError('Please select a subject');
    document.getElementById('contactSubject').focus();
    return false;
  }

  // Message validation
  if (data.message.length < 10) {
    showError('Please enter a message (minimum 10 characters)');
    document.getElementById('contactMessage').focus();
    return false;
  }

  return true;
}

/* ========================================
   SEND VIA WHATSAPP
======================================== */
function sendViaWhatsApp(data) {
  const message = `
🏨 *Hotel SR Indore - Contact Form*

👤 *Name:* ${data.name}
📱 *Phone:* ${data.phone}
📧 *Email:* ${data.email || 'Not provided'}
📋 *Subject:* ${data.subject}

💬 *Message:*
${data.message}

---
Sent from Hotel SR Website
  `.trim();

  const whatsappURL = `https://wa.me/919165000090?text=${encodeURIComponent(message)}`;
  
  // Open WhatsApp in new tab
  window.open(whatsappURL, '_blank');
}

/* ========================================
   SHOW ERROR MESSAGE
======================================== */
function showError(message) {
  // Create error notification
  const errorDiv = document.createElement('div');
  errorDiv.className = 'form-error-notification';
  errorDiv.innerHTML = `
    <i class="fas fa-exclamation-circle"></i>
    <span>${message}</span>
  `;

  // Add to body
  document.body.appendChild(errorDiv);

  // Show animation
  setTimeout(() => {
    errorDiv.classList.add('show');
  }, 100);

  // Auto-hide after 4 seconds
  setTimeout(() => {
    errorDiv.classList.remove('show');
    setTimeout(() => {
      errorDiv.remove();
    }, 300);
  }, 4000);
}

/* ========================================
   FAQ ACCORDION (OPTIONAL)
======================================== */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    if (question) {
      question.addEventListener('click', function() {
        // Toggle active state
        item.classList.toggle('active');
        
        // Close other FAQs (optional)
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });
      });
    }
  });
}

/* ========================================
   PHONE NUMBER FORMATTING
======================================== */
document.getElementById('contactPhone')?.addEventListener('input', function(e) {
  let value = e.target.value.replace(/[^0-9]/g, '');
  
  // Limit to 10 digits
  if (value.length > 10) {
    value = value.substr(0, 10);
  }

  // Format: +91 00000 00000
  if (value.length > 0) {
    if (value.length <= 5) {
      value = '+91 ' + value;
    } else {
      value = '+91 ' + value.substr(0, 5) + ' ' + value.substr(5);
    }
  }

  e.target.value = value;
});

/* ========================================
   SMOOTH SCROLL TO MAP
======================================== */
document.querySelectorAll('a[href="#map"]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const mapSection = document.getElementById('map');
    if (mapSection) {
      const yOffset = -100;
      const y = mapSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });
});

/* ========================================
   CONSOLE BRANDING
======================================== */
console.log('%c📞 Contact Page Loaded', 'color: #D4AF37; font-size: 16px; font-weight: bold;');
console.log('%c✨ Developed by The Unlock Sales', 'color: #1A2F4B; font-size: 12px;');
