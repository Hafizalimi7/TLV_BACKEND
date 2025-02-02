const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config(); // For managing sensitive credentials
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // cPanel SMTP server
  port: 465, // Use 465 for SSL or 587 for TLS
  secure: true, // Set to true for port 465 (SSL)
  auth: {
    user: process.env.EMAIL, // Your cPanel email
    pass: process.env.PASS, // Your cPanel email password
  },
});

app.post('/send-email', async (req, res) => {
  const mailOptions = {
    from: process.env.EMAIL, // Must match authenticated user
    to: ['info@thelifevoyage.com', process.env.EMAIL], // Recipient's address
    subject: "New Contact Form Submission",
    text: `Hello Team,

You have received a new contact form submission. Below are the details:

Name: ${req.body.name}
Email: ${req.body.email}
Contact Number: ${req.body.phone}
Source: ${req.body.source}
Enquiry: ${req.body.message}

Please review the submission and follow up as needed.

Best regards,  
Your Website Support Team`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send email.');
  }
});

app.post('/confirmation', async (req, res) => {
  const mailOptions = {
    from: process.env.EMAIL, // Must match authenticated user
    to: ['info@thelifevoyage.com', process.env.EMAIL, req.body.customerEmail], // Recipient's address
    subject: "Payment Confirmation and Next Steps",
    text: `Dear ${req.body.customerName},

Thank you for your payment of £${(req.body.amount / 100).toFixed(2)}. We truly appreciate your promptness in settling this portion of your balance.

As of now, the remaining balance on your account is [remaining amount]. For your next payment, which is the second installment, kindly send a bank transfer to the following account details:

Bank Transfer Details
 Name: H Aasdsmi
Sort Code: 123234
Account Number: 424334
Reference: [First 3 letters of First Name][First 3 letters of Last Name] (e.g., Max Pay)

It is important to include the reference [AbcTda] when making your payment to help us track it effectively.

If you have any questions or need assistance, feel free to reach out to us at info@thelifevoyage.com

Thank you once again for choosing our services.

Warm regards,
The Life Voyage Team`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send email.');
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
