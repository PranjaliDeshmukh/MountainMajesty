# Email Notification Setup Guide

This guide will help you set up email notifications for booking confirmations to `mymountainmajestykarjat@gmail.com`.

## Option 1: EmailJS (Recommended - No Backend Required)

EmailJS allows you to send emails directly from your frontend application.

### Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (supports 200 emails/month)
3. Verify your email address

### Step 2: Add Email Service

1. Go to **Email Services** in the dashboard
2. Click **Add New Service**
3. Choose **Gmail** (or your preferred provider)
4. Connect your Gmail account (`mymountainmajestykarjat@gmail.com`)
5. Copy the **Service ID** (e.g., `service_abc123`)

### Step 3: Create Email Template

1. Go to **Email Templates** in the dashboard
2. Click **Create New Template**
3. Set **Template Name**: `booking_confirmation`
4. Configure the template:

**To Email:**
```
{{to_email}}
```

**Subject:**
```
New Booking: {{property_name}}
```

**Email Body:**
```html
<h2>New Booking Received</h2>

<h3>Guest Details:</h3>
<ul>
  <li><strong>Name:</strong> {{guest_name}}</li>
  <li><strong>Email:</strong> {{guest_email}}</li>
  <li><strong>Mobile:</strong> {{guest_mobile}}</li>
</ul>

<h3>Booking Details:</h3>
<ul>
  <li><strong>Property:</strong> {{property_name}}</li>
  <li><strong>Location:</strong> {{location}}</li>
  <li><strong>Check-in Date:</strong> {{check_in_date}}</li>
  <li><strong>Price:</strong> ₹{{price}}/night</li>
</ul>

<p><strong>Booking Time:</strong> {{booking_date}}</p>
```

5. Save the template and copy the **Template ID** (e.g., `template_xyz789`)

### Step 4: Get Your Public Key

1. Go to **Account** → **General**
2. Find your **Public Key** (e.g., `aBcDeFgHiJkLmNoPqRs`)

### Step 5: Configure Environment Variables

Create a `.env` file in the `weekend-home` folder:

```env
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
```

Replace the values with your actual EmailJS credentials.

### Step 6: Restart Development Server

```bash
npm run dev
```

### Step 7: Test the Integration

1. Go to your application
2. Click on any property
3. Click **Reserve**
4. Fill in the booking form
5. Click **Confirm Booking**
6. Check `mymountainmajestykarjat@gmail.com` inbox for the email

---

## Option 2: Direct mailto (Fallback - No Setup Required)

If you don't set up EmailJS, the app will automatically fall back to opening the default email client with a pre-filled email. This requires the user to manually send the email.

This option is already configured and will work without any setup, but it's less automated.

---

## Option 3: Backend API (Most Robust)

For production use, you may want to set up a backend email service.

### Using Node.js + Nodemailer:

1. Create a backend server (Express.js)
2. Install Nodemailer: `npm install nodemailer`
3. Configure Gmail SMTP:

```javascript
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mymountainmajestykarjat@gmail.com',
    pass: 'your-app-specific-password' // Generate in Gmail settings
  }
})

app.post('/api/send-booking-email', async (req, res) => {
  const { room, date, guest } = req.body
  
  const mailOptions = {
    from: 'noreply@mountainmajesty.com',
    to: 'mymountainmajestykarjat@gmail.com',
    subject: `New Booking: ${room.name}`,
    html: `
      <h2>New Booking Received</h2>
      <p><strong>Guest:</strong> ${guest.name}</p>
      <p><strong>Email:</strong> ${guest.email}</p>
      <p><strong>Mobile:</strong> ${guest.mobile}</p>
      <p><strong>Property:</strong> ${room.name}</p>
      <p><strong>Check-in:</strong> ${date}</p>
    `
  }
  
  await transporter.sendMail(mailOptions)
  res.json({ success: true })
})
```

4. Update the frontend to use the API endpoint (already configured in `emailService.js`)

---

## Gmail App Password Setup (for Option 3)

If using Gmail SMTP:

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Enable 2-Step Verification
3. Go to **Security** → **2-Step Verification** → **App passwords**
4. Generate an app password for "Mail"
5. Use this password in your backend configuration

---

## Troubleshooting

### EmailJS: "Public Key is invalid"
- Make sure you copied the correct Public Key from EmailJS dashboard
- Check that the key is properly set in `.env` file
- Restart the development server after changing `.env`

### Emails not being received
- Check spam/junk folder
- Verify the template variables match exactly
- Check EmailJS dashboard for error logs
- Ensure you haven't exceeded the free tier limit (200 emails/month)

### CORS errors
- EmailJS should work from localhost
- If deploying, add your domain to EmailJS allowed origins

---

## Current Status

✅ Email service integrated in the app
✅ Fallback to mailto if EmailJS not configured
✅ Form shows "Sending..." while processing
✅ Email includes all booking details

**To enable automated emails:** Follow Option 1 (EmailJS) setup above.

**Default behavior:** Opens email client with pre-filled email (requires manual send).
