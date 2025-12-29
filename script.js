// ===== MOBILE MENU TOGGLE =====
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuToggle && navMenu) {
        // Toggle menu on hamburger click
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
});







/* ========================================
   HOTEL SR INDORE - 3-STEP BOOKING SYSTEM
   Complete Working Solution
======================================== */

// Room Catalog
const ROOMS = {
  'regular': { name: 'Regular Room (2 Person)', price: 999 },
  'deluxe-ac': { name: 'Deluxe A.C. Room (2 Person)', price: 1599 },
  'extra-mattress': { name: 'Extra Mattress', price: 449 },
  'dormitory': { name: 'Dormitory (Per Person)', price: 499 },
  'small-hall': { name: 'Small Party Hall (30-50 Guests)', price: 0 },
  'banquet-hall': { name: 'Banquet Hall (80-120 Guests)', price: 0 }
};

let roomCounter = 0;
let bookingData = {
  guest: {},
  rooms: [],
  payment: {},
  grandTotal: 0
};

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  console.log('🏨 Hotel SR - Booking System Loading...');
  
  // Initialize other features
  initializeHeader();
  initializeMobileMenu();
  initializeScrollTop();
  
  // Initialize booking system
  if (document.getElementById('roomSelectionArea')) {
    addRoomSelector(); // Add first room automatically
    console.log('✅ Booking System Ready!');
  }
});

// ========================================
// ADD ROOM SELECTOR
// ========================================
function addRoomSelector() {
  roomCounter++;
  const container = document.getElementById('roomSelectionArea');
  
  if (!container) return;
  
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().split('T')[0];
  
  const html = `
    <div class="room-selector" id="roomSelector${roomCounter}" data-id="${roomCounter}">
      <div class="room-selector-header">
        <span class="room-selector-number">Room/Service #${roomCounter}</span>
        ${roomCounter > 1 ? `
          <button type="button" class="btn-remove-room" onclick="removeRoom(${roomCounter})">
            <i class="fas fa-trash"></i> Remove
          </button>
        ` : ''}
      </div>
      
      <div class="room-selector-grid">
        <div class="form-group">
          <label>Select Room/Service *</label>
          <select class="room-type" data-room="${roomCounter}" onchange="calculateTotal()">
            <option value="">-- Select Room Type --</option>
            <option value="deluxe-ac" data-price="1599">Deluxe A.C. Room - ₹15,99/night</option>
            <option value="regular" data-price="999">Regular Room - ₹999/night</option>
            <option value="extra-mattress" data-price="449">Extra Mattress - ₹449/night</option>
            <option value="dormitory" data-price="499">Dormitory - ₹499/person/night</option>
            <option value="small-hall" data-price="0">Small Party Hall (Call for Quote)</option>
            <option value="banquet-hall" data-price="0">Banquet Hall (Call for Quote)</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Quantity *</label>
          <input type="number" class="room-qty" min="1" max="10" value="1" data-room="${roomCounter}" oninput="calculateTotal()">
        </div>
        
        <div class="form-group">
          <label>Check-In Date *</label>
          <input type="date" class="room-checkin" min="${today}" data-room="${roomCounter}" onchange="calculateTotal()">
        </div>
        
        <div class="form-group">
          <label>Check-Out Date *</label>
          <input type="date" class="room-checkout" min="${tomorrowDate}" value="${tomorrowDate}" data-room="${roomCounter}" onchange="calculateTotal()">
        </div>
      </div>
      
      <div class="room-total" id="roomTotal${roomCounter}" style="display:none;">
        Subtotal: ₹<span class="room-amount">0</span>
      </div>
    </div>
  `;
  
  container.insertAdjacentHTML('beforeend', html);
  console.log(`✅ Room Selector #${roomCounter} added`);
}

// ========================================
// REMOVE ROOM
// ========================================
function removeRoom(id) {
  const room = document.getElementById(`roomSelector${id}`);
  if (room) {
    room.remove();
    calculateTotal();
    console.log(`🗑️ Room #${id} removed`);
  }
}

// ========================================
// CALCULATE TOTAL
// ========================================
function calculateTotal() {
  const summaryList = document.getElementById('summaryList');
  const grandTotalEl = document.getElementById('grandTotal');
  
  if (!summaryList || !grandTotalEl) return;
  
  let grandTotal = 0;
  let summaryHTML = '';
  const rooms = document.querySelectorAll('.room-selector');
  
  rooms.forEach(room => {
    const roomId = room.dataset.id;
    const typeEl = room.querySelector('.room-type');
    const qtyEl = room.querySelector('.room-qty');
    const checkinEl = room.querySelector('.room-checkin');
    const checkoutEl = room.querySelector('.room-checkout');
    const roomTotalDiv = room.querySelector('.room-total');
    const roomAmountSpan = room.querySelector('.room-amount');
    
    if (!typeEl.value || !checkinEl.value || !checkoutEl.value) {
      roomTotalDiv.style.display = 'none';
      return;
    }
    
    const roomType = typeEl.value;
    const qty = parseInt(qtyEl.value) || 1;
    const price = parseInt(typeEl.options[typeEl.selectedIndex].dataset.price) || 0;
    
    // Calculate nights
    const checkin = new Date(checkinEl.value);
    const checkout = new Date(checkoutEl.value);
    const nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) {
      alert('Check-out must be after check-in');
      return;
    }
    
    const roomTotal = price * qty * nights;
    
    // Update room subtotal
    if (price > 0) {
      roomAmountSpan.textContent = roomTotal.toLocaleString('en-IN');
      roomTotalDiv.style.display = 'block';
      grandTotal += roomTotal;
      
      // Add to summary
      const roomName = ROOMS[roomType].name;
      summaryHTML += `
        <div class="summary-row">
          <span>${roomName} x${qty} | ${nights} night(s)</span>
          <strong>₹${roomTotal.toLocaleString('en-IN')}</strong>
        </div>
      `;
    } else {
      roomTotalDiv.style.display = 'none';
      summaryHTML += `
        <div class="summary-row">
          <span>${ROOMS[roomType].name}</span>
          <strong>Call for Quote</strong>
        </div>
      `;
    }
  });
  
  // Update summary
  summaryList.innerHTML = summaryHTML || '<p style="text-align:center;color:#999;">No rooms selected yet</p>';
  grandTotalEl.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
  
  // Update payment amount
  const payAmount = document.getElementById('payAmount');
  if (payAmount) {
    payAmount.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
  }
  
  bookingData.grandTotal = grandTotal;
  
  console.log(`💰 Total Updated: ₹${grandTotal.toLocaleString('en-IN')}`);
}

// ========================================
// STEP NAVIGATION
// ========================================
function goToStep2() {
  // Validate Step 1
  const name = document.getElementById('guestName').value.trim();
  const phone = document.getElementById('guestPhone').value.trim();
  const email = document.getElementById('guestEmail').value.trim();
  const guests = document.getElementById('totalGuests').value;
  
  if (!name || name.length < 3) {
    alert('Please enter your full name');
    document.getElementById('guestName').focus();
    return;
  }
  
  if (!/^[6-9][0-9]{9}$/.test(phone)) {
    alert('Please enter a valid 10-digit mobile number');
    document.getElementById('guestPhone').focus();
    return;
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert('Please enter a valid email address');
    document.getElementById('guestEmail').focus();
    return;
  }
  
  if (!guests || guests < 1) {
    alert('Please enter total number of guests');
    return;
  }
  
  // Check at least one room selected
  const rooms = document.querySelectorAll('.room-selector');
  let hasRoom = false;
  rooms.forEach(room => {
    const type = room.querySelector('.room-type').value;
    if (type) hasRoom = true;
  });
  
  if (!hasRoom) {
    alert('Please select at least one room');
    return;
  }
  
  // Save guest data
  bookingData.guest = { name, phone, email, guests };
  
  // Change to step 2
  changeStep(2);
}

function goToStep1() {
  changeStep(1);
}

function changeStep(stepNumber) {
  // Hide all steps
  document.querySelectorAll('.booking-step').forEach(step => {
    step.classList.remove('active');
  });
  
  // Show selected step
  document.getElementById(`step${stepNumber}`).classList.add('active');
  
  // Update indicators
  document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
    if (index < stepNumber) {
      indicator.classList.add('active');
    } else {
      indicator.classList.remove('active');
    }
  });
  
  // Scroll to top
  window.scrollTo({ booking: 0, behavior: 'smooth' });
}

// ========================================
// SUBMIT BOOKING
// ========================================
function submitBooking() {
  const transactionId = document.getElementById('transactionId').value.trim();
  const idType = document.getElementById('idType').value;
  const idNumber = document.getElementById('idNumber').value.trim();
  const agreeTerms = document.getElementById('agreeTerms').checked;
  
  if (!transactionId || transactionId.length < 10) {
    alert('Please enter valid UPI Transaction ID');
    return;
  }
  
  if (!idType) {
    alert('Please select ID proof type');
    return;
  }
  
  if (!idNumber || idNumber.length < 4) {
    alert('Please enter valid ID number');
    return;
  }
  
  if (!agreeTerms) {
    alert('Please agree to send documents on WhatsApp');
    return;
  }
  
  // Save payment data
  bookingData.payment = { transactionId, idType, idNumber };
  
  // Collect room details
  bookingData.rooms = [];
  document.querySelectorAll('.room-selector').forEach(room => {
    const type = room.querySelector('.room-type').value;
    if (!type) return;
    
    const qty = room.querySelector('.room-qty').value;
    const checkin = room.querySelector('.room-checkin').value;
    const checkout = room.querySelector('.room-checkout').value;
    const price = parseInt(room.querySelector('.room-type').options[room.querySelector('.room-type').selectedIndex].dataset.price);
    
    const nights = Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24));
    const total = price * qty * nights;
    
    bookingData.rooms.push({
      name: ROOMS[type].name,
      qty, checkin, checkout, nights, total
    });
  });
  
  // Send Email (if EmailJS configured)
  if (typeof emailjs !== 'undefined') {
    sendBookingEmail();
  }
  
  // Show success
  showSuccessPage();
}

// ========================================
// SUCCESS PAGE
// ========================================
function showSuccessPage() {
  const step3 = document.getElementById('step3');
  
  step3.innerHTML = `
    <div class="booking-card" style="text-align:center;">
      <div style="font-size:80px;color:#4caf50;margin-bottom:20px;">
        <i class="fas fa-check-circle"></i>
      </div>
      <h2 style="color:#4caf50;margin-bottom:15px;">🎉 Booking Confirmed!</h2>
      <p style="font-size:18px;color:#666;margin-bottom:30px;">
        Thank you <strong>${bookingData.guest.name}</strong>!<br>
        Your booking request has been received.
      </p>
      
      <div style="background:#fff3cd;padding:25px;border-radius:12px;margin-bottom:30px;">
        <h3 style="color:#856404;margin-bottom:15px;">📸 Next Step: Send Documents on WhatsApp</h3>
        <ol style="text-align:left;max-width:400px;margin:0 auto;color:#664d03;">
          <li>Payment Screenshot</li>
          <li>ID Proof Photo (${bookingData.payment.idType})</li>
        </ol>
      </div>
      
      <button class="btn-confirm" onclick="openWhatsApp()" style="font-size:16px;padding:18px 40px;">
        <i class="fab fa-whatsapp"></i> Open WhatsApp Now
      </button>
    </div>
  `;
  
  changeStep(3);
  
  // Auto-open WhatsApp after 2 seconds
  setTimeout(openWhatsApp, 2000);
}

// ========================================
// WHATSAPP MESSAGE
// ========================================
function openWhatsApp() {
  let message = `🏨 *Hotel SR Indore - Booking*\n\n`;
  message += `*Guest:* ${bookingData.guest.name}\n`;
  message += `*Phone:* ${bookingData.guest.phone}\n`;
  message += `*Email:* ${bookingData.guest.email}\n`;
  message += `*Total Guests:* ${bookingData.guest.guests}\n\n`;
  
  message += `*Rooms:*\n`;
  bookingData.rooms.forEach((room, i) => {
    message += `${i + 1}. ${room.name} x${room.qty}\n`;
    message += `   ${room.checkin} → ${room.checkout} (${room.nights} nights)\n`;
    if (room.total > 0) {
      message += `   Amount: ₹${room.total.toLocaleString('en-IN')}\n`;
    }
    message += `\n`;
  });
  
  if (bookingData.grandTotal > 0) {
    message += `*Total: ₹${bookingData.grandTotal.toLocaleString('en-IN')}*\n\n`;
  }
  
  message += `*Payment:*\n`;
  message += `Transaction ID: ${bookingData.payment.transactionId}\n`;
  message += `ID: ${bookingData.payment.idType} - ${bookingData.payment.idNumber}\n\n`;
  message += `📸 Sending payment screenshot + ID proof now`;
  
  const url = `https://wa.me/919165000090?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// ========================================
// EMAIL SENDING (EMAILJS)
// ========================================
function sendBookingEmail() {
  // Check if EmailJS is configured
  if (!window.EMAILJS_CONFIG || !window.EMAILJS_CONFIG.serviceId) {
    console.warn('⚠️ EmailJS not configured');
    return;
  }
  
  let roomsHTML = '';
  bookingData.rooms.forEach((room, i) => {
    roomsHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${room.name}</td>
        <td>${room.qty}</td>
        <td>${room.nights}</td>
        <td>${room.checkin}</td>
        <td>${room.checkout}</td>
        <td>₹${room.total.toLocaleString('en-IN')}</td>
      </tr>
    `;
  });
  
  const templateParams = {
    guest_name: bookingData.guest.name,
    guest_email: bookingData.guest.email,
    guest_phone: bookingData.guest.phone,
    total_guests: bookingData.guest.guests,
    rooms_details: roomsHTML,
    grand_total: `₹${bookingData.grandTotal.toLocaleString('en-IN')}`,
    transaction_id: bookingData.payment.transactionId,
    id_type: bookingData.payment.idType,
    id_number: bookingData.payment.idNumber,
    booking_date: new Date().toLocaleString('en-IN')
  };
  
  emailjs.send(
    window.EMAILJS_CONFIG.serviceId,
    window.EMAILJS_CONFIG.templates.booking,
    templateParams
  )
  .then(response => {
    console.log('✅ Email sent successfully:', response);
  })
  .catch(error => {
    console.error('❌ Email failed:', error);
  });
}

// ========================================
// HEADER & OTHER FUNCTIONS
// ========================================
function initializeHeader() {
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
}

function initializeMobileMenu() {
  const toggle = document.getElementById('mobileMenuToggle');
  const navbar = document.getElementById('navbar');
  
  if (toggle && navbar) {
    toggle.addEventListener('click', () => {
      navbar.classList.toggle('active');
      toggle.classList.toggle('active');
    });
  }
}

function initializeScrollTop() {
  const btn = document.getElementById('scrollToTop');
  if (btn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

console.log('✅ Hotel SR - All Systems Ready!');
