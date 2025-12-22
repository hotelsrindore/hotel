/* ========================================
   HOTEL SR INDORE - COMPLETE JAVASCRIPT
   Developed by The Unlock Sales
   Features: 3-Step Booking, Payment, WhatsApp Integration
======================================== */

// Global Booking Data
let bookingData = {
    bookingId: '',
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    guests: 1,
    checkIn: '',
    checkOut: '',
    roomType: '',
    roomPrice: 0,
    nights: 0,
    subtotal: 0,
    gst: 0,
    total: 0,
    specialRequests: '',
    transactionId: '',
    paymentProof: null
};

/* ========================================
   HEADER SCROLL EFFECT
======================================== */
const header = document.getElementById('header');
if (header) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ========================================
   MOBILE MENU TOGGLE
======================================== */
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navbar = document.getElementById('navbar');

if (mobileMenuToggle && navbar) {
    const navMenu = navbar.querySelector('.nav-menu');
    
    mobileMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking on a link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navbar.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ========================================
   SCROLL TO TOP BUTTON
======================================== */
const scrollToTopBtn = document.getElementById('scrollToTop');
if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 400) {
            scrollToTopBtn.classList.add('active');
        } else {
            scrollToTopBtn.classList.remove('active');
        }
    });
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ========================================
   SMOOTH SCROLL FOR ANCHOR LINKS
======================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId.length > 1 && document.querySelector(targetId)) {
            e.preventDefault();
            const target = document.querySelector(targetId);
            const offset = 100;
            const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: y,
                behavior: 'smooth'
            });
        }
    });
});

/* ========================================
   BOOKING SYSTEM - DATE VALIDATION
======================================== */
const checkInInput = document.getElementById('checkIn');
const checkOutInput = document.getElementById('checkOut');

if (checkInInput && checkOutInput) {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    checkInInput.setAttribute('min', today);
    checkOutInput.setAttribute('min', today);
    
    // Update checkout min date when check-in changes
    checkInInput.addEventListener('change', function() {
        const checkInDate = new Date(this.value);
        checkInDate.setDate(checkInDate.getDate() + 1);
        const minCheckOut = checkInDate.toISOString().split('T')[0];
        checkOutInput.setAttribute('min', minCheckOut);
        
        if (checkOutInput.value && checkOutInput.value < minCheckOut) {
            checkOutInput.value = '';
        }
        
        calculateBookingAmount();
    });
    
    checkOutInput.addEventListener('change', calculateBookingAmount);
    
    const roomTypeSelect = document.getElementById('roomType');
    if (roomTypeSelect) {
        roomTypeSelect.addEventListener('change', calculateBookingAmount);
    }
}

/* ========================================
   CALCULATE BOOKING AMOUNT
======================================== */
function calculateBookingAmount() {
    const checkIn = document.getElementById('checkIn')?.value;
    const checkOut = document.getElementById('checkOut')?.value;
    const roomTypeSelect = document.getElementById('roomType');
    
    if (!checkIn || !checkOut || !roomTypeSelect?.value) {
        return;
    }
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    if (nights < 1) {
        return;
    }
    
    const roomPrice = parseInt(roomTypeSelect.options[roomTypeSelect.selectedIndex].getAttribute('data-price'));
    const subtotal = roomPrice * nights;
    const gst = Math.round(subtotal * 0.12);
    const total = subtotal + gst;
    
    // Update display elements
    updateElement('displayNights', nights);
    updateElement('displayRate', `₹${roomPrice.toLocaleString('en-IN')}/night`);
    updateElement('displaySubtotal', `₹${subtotal.toLocaleString('en-IN')}`);
    updateElement('displayGst', `₹${gst.toLocaleString('en-IN')}`);
    updateElement('displayTotal', `₹${total.toLocaleString('en-IN')}`);
}

/* ========================================
   UPDATE ELEMENT TEXT
======================================== */
function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

/* ========================================
   GENERATE BOOKING ID
======================================== */
function generateBookingId() {
    const prefix = 'HSR';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
}

/* ========================================
   STEP NAVIGATION
======================================== */
function goToStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.booking-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show current step
    const currentStep = document.getElementById(`step${stepNumber}`);
    if (currentStep) {
        currentStep.classList.add('active');
    }
    
    // Update step indicators
    document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
        if (index + 1 <= stepNumber) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
    
    // Scroll to booking section
    const bookingSection = document.querySelector('.booking-section');
    if (bookingSection) {
        const yOffset = -100;
        const y = bookingSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
}

/* ========================================
   GO TO PAYMENT (STEP 2)
======================================== */
function goToPayment() {
    const guestName = document.getElementById('guestName')?.value.trim();
    const guestPhone = document.getElementById('guestPhone')?.value.trim();
    const guestEmail = document.getElementById('guestEmail')?.value.trim();
    const guests = parseInt(document.getElementById('guests')?.value || 1);
    const checkIn = document.getElementById('checkIn')?.value;
    const checkOut = document.getElementById('checkOut')?.value;
    const roomTypeSelect = document.getElementById('roomType');
    const specialRequests = document.getElementById('specialRequests')?.value.trim();
    
    // Validation
    if (!guestName || !guestPhone || !guestEmail || !checkIn || !checkOut || !roomTypeSelect?.value) {
        alert('Please fill in all required fields marked with *');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestEmail)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Phone validation (10 digits starting with 6-9)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(guestPhone)) {
        alert('Please enter a valid 10-digit mobile number starting with 6-9');
        return;
    }
    
    // Calculate booking details
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    if (nights < 1) {
        alert('Check-out date must be after check-in date');
        return;
    }
    
    const roomPrice = parseInt(roomTypeSelect.options[roomTypeSelect.selectedIndex].getAttribute('data-price'));
    const roomTypeName = roomTypeSelect.options[roomTypeSelect.selectedIndex].text;
    const subtotal = roomPrice * nights;
    const gst = Math.round(subtotal * 0.12);
    const total = subtotal + gst;
    
    // Store booking data
    bookingData = {
        bookingId: generateBookingId(),
        guestName,
        guestPhone,
        guestEmail,
        guests,
        checkIn,
        checkOut,
        roomType: roomTypeName,
        roomPrice,
        nights,
        subtotal,
        gst,
        total,
        specialRequests,
        transactionId: '',
        paymentProof: null
    };
    
    // Update payment amount
    updateElement('payAmount', `₹${total.toLocaleString('en-IN')}`);
    
    // Go to step 2
    goToStep(2);
}

/* ========================================
   BACK TO DETAILS (STEP 1)
======================================== */
function backToDetails() {
    goToStep(1);
}

/* ========================================
   PAYMENT PROOF UPLOAD PREVIEW
======================================== */
const paymentProofInput = document.getElementById('paymentProof');
if (paymentProofInput) {
    paymentProofInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file (JPG, PNG, etc.)');
                this.value = '';
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size should not exceed 5MB');
                this.value = '';
                return;
            }
            
            bookingData.paymentProof = file;
            
            // Show preview
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.getElementById('uploadPreview');
                if (preview) {
                    preview.innerHTML = `
                        <div style="text-align: center; margin-top: 20px;">
                            <img src="${e.target.result}" alt="Payment Proof" style="max-width: 240px; border-radius: 12px; box-shadow: 0 5px 20px rgba(0,0,0,0.2);">
                            <p style="color: #2ECC71; margin-top: 15px; font-weight: 600; font-size: 14px;">
                                <i class="fas fa-check-circle"></i> Screenshot uploaded successfully
                            </p>
                        </div>
                    `;
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

/* ========================================
   CONFIRM BOOKING (STEP 3)
======================================== */
function confirmBooking() {
    const transactionId = document.getElementById('transactionId')?.value.trim();
    const paymentProof = bookingData.paymentProof;
    
    if (!paymentProof) {
        alert('Please upload payment screenshot');
        return;
    }
    
    if (!transactionId || transactionId.length < 8) {
        alert('Please enter a valid transaction ID (minimum 8 characters)');
        return;
    }
    
    bookingData.transactionId = transactionId;
    
    // Send booking data to hotel WhatsApp
    sendBookingToHotel();
    
    // Display confirmation
    displayConfirmation();
    
    // Go to step 3
    goToStep(3);
}

/* ========================================
   FORMAT DATE
======================================== */
function formatDate(dateString) {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

/* ========================================
   SEND BOOKING TO HOTEL WHATSAPP
======================================== */
function sendBookingToHotel() {
    const message = `
🆕 *NEW BOOKING REQUEST - Hotel SR*

*Booking ID:* ${bookingData.bookingId}

*Guest Details:*
📝 Name: ${bookingData.guestName}
📞 Phone: ${bookingData.guestPhone}
📧 Email: ${bookingData.guestEmail}
👥 Guests: ${bookingData.guests}

*Booking Details:*
🛏️ Room: ${bookingData.roomType.split(' – ')[0]}
📅 Check-in: ${formatDate(bookingData.checkIn)} at 12:00 PM
📅 Check-out: ${formatDate(bookingData.checkOut)} at 11:00 AM
🌙 Total Nights: ${bookingData.nights}

*Payment Details:*
💰 Room Rate: ₹${bookingData.roomPrice.toLocaleString('en-IN')}/night
💵 Subtotal: ₹${bookingData.subtotal.toLocaleString('en-IN')}
🧾 GST (12%): ₹${bookingData.gst.toLocaleString('en-IN')}
*💳 Total Paid: ₹${bookingData.total.toLocaleString('en-IN')}*

*🔢 Transaction ID:* ${bookingData.transactionId}
${bookingData.specialRequests ? `\n*📝 Special Requests:*\n${bookingData.specialRequests}\n` : ''}
⚠️ *Action Required:*
Please verify the UPI payment screenshot and confirm the booking to guest.

✅ Guest has uploaded payment proof.
    `.trim();
    
    const encodedMessage = encodeURIComponent(message);
    const hotelWhatsApp = `https://wa.me/919165000090?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(hotelWhatsApp, '_blank');
    
    // Log booking data (for debugging)
    console.log('✅ Booking Submitted:', bookingData);
}

/* ========================================
   DISPLAY CONFIRMATION
======================================== */
function displayConfirmation() {
    updateElement('confirmBookingId', bookingData.bookingId);
    updateElement('confirmName', bookingData.guestName);
    updateElement('confirmCheckIn', formatDate(bookingData.checkIn) + ' (12:00 PM)');
    updateElement('confirmCheckOut', formatDate(bookingData.checkOut) + ' (11:00 AM)');
    updateElement('confirmRoom', bookingData.roomType.split(' – ')[0]);
    updateElement('confirmAmount', `₹${bookingData.total.toLocaleString('en-IN')}`);
}

/* ========================================
   SEND TO GUEST WHATSAPP
======================================== */
function sendToWhatsApp() {
    const message = `
✅ *BOOKING SUBMITTED - Hotel SR Indore*

Hi ${bookingData.guestName},

Your booking request has been submitted successfully! 🎉

*Booking ID:* ${bookingData.bookingId}

*Booking Details:*
🛏️ Room: ${bookingData.roomType.split(' – ')[0]}
📅 Check-in: ${formatDate(bookingData.checkIn)} (12:00 PM)
📅 Check-out: ${formatDate(bookingData.checkOut)} (11:00 AM)
👥 Guests: ${bookingData.guests}
🌙 Nights: ${bookingData.nights}

*💳 Total Amount Paid:* ₹${bookingData.total.toLocaleString('en-IN')}

*What's Next?*
✓ We will verify your payment
✓ Confirmation within 30 minutes via WhatsApp
✓ Please carry valid ID proof at check-in

📍 *Hotel SR Indore*
98/1/8, AB Road, Dewas Naka, Lasudia Mori, Indore
📞 9165000090

Thank you for choosing Hotel SR! 🏨
    `.trim();
    
    const encodedMessage = encodeURIComponent(message);
    const guestWhatsApp = `https://wa.me/91${bookingData.guestPhone}?text=${encodedMessage}`;
    
    window.open(guestWhatsApp, '_blank');
}

/* ========================================
   MAKE FUNCTIONS GLOBALLY ACCESSIBLE
======================================== */
window.goToPayment = goToPayment;
window.backToDetails = backToDetails;
window.confirmBooking = confirmBooking;
window.sendToWhatsApp = sendToWhatsApp;

/* ========================================
   PAGE LOAD ANIMATION & CONSOLE LOG
======================================== */
window.addEventListener('load', () => {
    // Calculate page load time
    const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    
    // Styled console logs
    console.log('%c🏨 Hotel SR Indore', 'color: #D4AF37; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);');
    console.log(`%c✅ Website Loaded Successfully in ${loadTime}ms`, 'color: #2ECC71; font-size: 14px; font-weight: bold;');
    console.log('%c📱 3-Step Booking System Active', 'color: #1A2F4B; font-size: 12px;');
    console.log('%c💻 Developed by The Unlock Sales', 'color: #666; font-size: 12px;');
    console.log('%c🔗 https://theunlocksales.github.io/theunlocksales/', 'color: #D4AF37; font-size: 11px;');
    
    // Performance metrics
    console.log('%c⚡ Performance Metrics:', 'color: #3498db; font-weight: bold;');
    console.table({
        'DNS Lookup': `${window.performance.timing.domainLookupEnd - window.performance.timing.domainLookupStart}ms`,
        'Server Response': `${window.performance.timing.responseEnd - window.performance.timing.requestStart}ms`,
        'DOM Processing': `${window.performance.timing.domComplete - window.performance.timing.domLoading}ms`,
        'Total Load Time': `${loadTime}ms`
    });
});

/* ========================================
   ACTIVE PAGE NAVIGATION HIGHLIGHT
======================================== */
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

/* ========================================
   FORM VALIDATION HELPER
======================================== */
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return true;
    
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#E74C3C';
            isValid = false;
        } else {
            input.style.borderColor = '#E0E0E0';
        }
    });
    
    return isValid;
}

/* ========================================
   PREVENT FORM DOUBLE SUBMISSION
======================================== */
let isSubmitting = false;

function preventDoubleSubmit(callback) {
    if (isSubmitting) {
        alert('Please wait, processing your request...');
        return;
    }
    
    isSubmitting = true;
    callback();
    
    setTimeout(() => {
        isSubmitting = false;
    }, 3000);
}

/* ========================================
   ACCESSIBILITY: KEYBOARD NAVIGATION
======================================== */
document.addEventListener('keydown', (e) => {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && navMenu.classList.contains('active')) {
            document.getElementById('mobileMenuToggle').click();
        }
    }
});

/* ========================================
   LAZY LOADING OPTIMIZATION (Future)
======================================== */
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

/* ========================================
   ERROR HANDLING
======================================== */
window.addEventListener('error', (e) => {
    console.error('🚨 Error detected:', e.message);
    // You can send this to an error tracking service in production
});

/* ========================================
   SAFARI iOS FIX: Prevent 100vh Issues
======================================== */
function setVH() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setVH();
window.addEventListener('resize', setVH);

/* ========================================
   END OF SCRIPT
======================================== */
console.log('%c✨ All systems ready!', 'color: #2ECC71; font-weight: bold;');
