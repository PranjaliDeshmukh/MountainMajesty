// Email service using EmailJS
// Setup instructions:
// 1. Sign up at https://www.emailjs.com/
// 2. Create an email service (Gmail, Outlook, etc.)
// 3. Create an email template
// 4. Get your Public Key, Service ID, and Template ID
// 5. Add them to your .env file

const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY'
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID'
const RECIPIENT_EMAIL = 'mymountainmajestykarjat@gmail.com'

/**
 * Send booking confirmation email
 * @param {Object} bookingData - Booking details
 * @returns {Promise<boolean>} Success status
 */
export async function sendBookingEmail(bookingData) {
  const { room, date, guest } = bookingData

  // Email template parameters
  const templateParams = {
    to_email: RECIPIENT_EMAIL,
    from_name: guest.name,
    guest_name: guest.name,
    guest_email: guest.email,
    guest_mobile: guest.mobile,
    property_name: room.name,
    check_in_date: date,
    location: room.location,
    price: room.price,
    guests: bookingData.totalGuests || 1,
    booking_date: new Date().toLocaleString('en-IN', { 
      dateStyle: 'full', 
      timeStyle: 'short' 
    })
  }

  try {
    // Load EmailJS script if not already loaded
    if (!window.emailjs) {
      await loadEmailJS()
    }

    // Initialize EmailJS
    window.emailjs.init(EMAILJS_PUBLIC_KEY)

    // Send email
    const response = await window.emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    )

    console.log('Email sent successfully:', response)
    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    // Fall back to mailto link
    fallbackMailto(templateParams)
    return false
  }
}

/**
 * Load EmailJS script dynamically
 */
function loadEmailJS() {
  return new Promise((resolve, reject) => {
    if (window.emailjs) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js'
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

/**
 * Fallback to mailto link if EmailJS fails
 */
function fallbackMailto(params) {
  const subject = `New Booking: ${params.property_name}`
  const body = `
New Booking Received

Guest Details:
Name: ${params.guest_name}
Email: ${params.guest_email}
Mobile: ${params.guest_mobile}

Booking Details:
Property: ${params.property_name}
Location: ${params.location}
Check-in Date: ${params.check_in_date}
Number of Guests: ${params.guests}
Price: ₹${params.price}/night

Booking Time: ${params.booking_date}
  `.trim()

  const mailtoLink = `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  window.open(mailtoLink, '_blank')
}

/**
 * Alternative: Simple email notification using a serverless function
 * This requires setting up a backend endpoint
 */
export async function sendBookingEmailViaAPI(bookingData) {
  try {
    const response = await fetch('/api/send-booking-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...bookingData,
        recipientEmail: RECIPIENT_EMAIL
      })
    })

    if (!response.ok) {
      throw new Error('Failed to send email')
    }

    return true
  } catch (error) {
    console.error('Failed to send email via API:', error)
    return false
  }
}
