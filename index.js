const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'https://arojit-mondal.netlify.app' }));
// app.use(cors());
app.use(bodyParser.json());

// Route to send email
app.post('/send', async (req, res) => {
  const { username, email, phoneNumber, subject, message } = req.body;

  if (!username || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // or use other SMTP services
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email details
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVER_EMAIL, // Your email address
      subject: `Contact Form Submission: ${subject}`,
      text: `Name: ${username}\nEmail: ${email}\nPhone: ${phoneNumber}\n\nMessage:\n${message}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email. Please try again later." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on:${PORT}`);
});
