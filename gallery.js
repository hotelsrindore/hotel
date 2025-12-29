/* ========================================
   HOTEL SR INDORE - GALLERY PAGE
   Developed by The Unlock Sales
   Image Gallery with Filtering & Lightbox
======================================== */

// Gallery State
let currentFilter = 'all';
let currentLightboxIndex = 0;
let galleryImages = [];

/* ========================================
   INITIALIZE GALLERY
======================================== */
document.addEventListener('DOMContentLoaded', function() {
  initGallery();
  initFilterButtons();
  initLightbox();
});

/* ========================================
   INITIALIZE GALLERY ITEMS
======================================== */
function initGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-info h3')?.textContent || '';
    const description = item.querySelector('.gallery-info p')?.textContent || '';
    
    if (img) {
      galleryImages.push({
        src: img.src,
        alt: img.alt,
        title: title,
        description: description,
        element: item
      });
    }
  });

  updateGalleryCount();
}

/* ========================================
   FILTER BUTTONS
======================================== */
function initFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Get filter category
      const filterValue = this.getAttribute('data-filter');
      currentFilter = filterValue;
      
      // Filter gallery items
      filterGallery(filterValue);
    });
  });
}

/* ========================================
   FILTER GALLERY ITEMS
======================================== */
function filterGallery(category) {
  const galleryItems = document.querySelectorAll('.gallery-item');
  let visibleCount = 0;

  galleryItems.forEach(item => {
    const itemCategory = item.getAttribute('data-category');
    
    if (category === 'all' || itemCategory === category) {
      item.style.display = 'block';
      
      // Re-trigger AOS animation
      setTimeout(() => {
        item.classList.add('aos-animate');
      }, 50);
      
      visibleCount++;
    } else {
      item.style.display = 'none';
      item.classList.remove('aos-animate');
    }
  });

  // Update count
  document.getElementById('currentCount').textContent = visibleCount;
  
  // Smooth scroll to gallery
  const gallerySection = document.querySelector('.gallery-section');
  if (gallerySection) {
    const yOffset = -100;
    const y = gallerySection.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}

/* ========================================
   UPDATE GALLERY COUNT
======================================== */
function updateGalleryCount() {
  const totalItems = document.querySelectorAll('.gallery-item').length;
  const visibleItems = document.querySelectorAll('.gallery-item[style*="display: block"], .gallery-item:not([style*="display: none"])').length;
  
  document.getElementById('totalCount').textContent = totalItems;
  document.getElementById('currentCount').textContent = visibleItems || totalItems;
}

/* ========================================
   LIGHTBOX FUNCTIONALITY
======================================== */
function initLightbox() {
  const modal = document.getElementById('lightboxModal');
  
  // Close on background click
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (modal.classList.contains('active')) {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        lightboxNavigate(-1);
      } else if (e.key === 'ArrowRight') {
        lightboxNavigate(1);
      }
    }
  });
}

/* ========================================
   OPEN LIGHTBOX
======================================== */
function openLightbox(button) {
  const galleryItem = button.closest('.gallery-item');
  const img = galleryItem.querySelector('img');
  const title = galleryItem.querySelector('.gallery-info h3')?.textContent || '';
  const description = galleryItem.querySelector('.gallery-info p')?.textContent || '';
  
  // Find index in visible images
  const visibleImages = Array.from(document.querySelectorAll('.gallery-item'))
    .filter(item => item.style.display !== 'none')
    .map(item => ({
      src: item.querySelector('img').src,
      alt: item.querySelector('img').alt,
      title: item.querySelector('.gallery-info h3')?.textContent || '',
      description: item.querySelector('.gallery-info p')?.textContent || ''
    }));
  
  currentLightboxIndex = visibleImages.findIndex(image => image.src === img.src);
  galleryImages = visibleImages;
  
  // Set lightbox content
  const modal = document.getElementById('lightboxModal');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  
  lightboxImage.src = img.src;
  lightboxImage.alt = img.alt;
  lightboxCaption.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
  
  // Show modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/* ========================================
   CLOSE LIGHTBOX
======================================== */
function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

/* ========================================
   LIGHTBOX NAVIGATION
======================================== */
function lightboxNavigate(direction) {
  currentLightboxIndex += direction;
  
  // Loop around
  if (currentLightboxIndex < 0) {
    currentLightboxIndex = galleryImages.length - 1;
  } else if (currentLightboxIndex >= galleryImages.length) {
    currentLightboxIndex = 0;
  }
  
  // Update lightbox content
  const image = galleryImages[currentLightboxIndex];
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  
  // Fade effect
  lightboxImage.style.opacity = '0';
  
  setTimeout(() => {
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.innerHTML = `<h3>${image.title}</h3><p>${image.description}</p>`;
    lightboxImage.style.opacity = '1';
  }, 200);
}

/* ========================================
   LAZY LOADING (PERFORMANCE)
======================================== */
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

/* ========================================
   CONSOLE BRANDING
======================================== */
console.log('%c📸 Gallery Loaded', 'color: #D4AF37; font-size: 16px; font-weight: bold;');
console.log('%c✨ Developed by The Unlock Sales', 'color: #1A2F4B; font-size: 12px;');
