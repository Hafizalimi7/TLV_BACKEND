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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
