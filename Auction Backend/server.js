const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const auctionRoutes = require("./routes/auctions");
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
const nodemailer = require('nodemailer');


app.use("/auctions", auctionRoutes);
app.get("/ping", (req, res) => res.send("Hello World"))

async function sendOtpEmail(to, otp) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // true for 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Auction Auth" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}`,
    html: `<p>Your OTP is <b>${otp}</b>. It will expire in 5 minutes.</p>`,
  });
}

const otpStore = {};

app.post('/send-otp', async (req, res) => {
  const { contact } = req.body;

  if (!contact || !contact.includes('@')) {
    return res.status(400).json({ success: false, message: 'Invalid email address' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  otpStore[contact] = { otp, expiresAt, attempts: 0 };
  console.log(otpStore)

  try {
    await sendOtpEmail(contact, otp);

    if (process.env.NODE_ENV !== 'production') {
      console.log(`OTP for ${contact}: ${otp}`);
    }

    return res.json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ success: false, message: 'Failed to send OTP email' });
  }
});

// Verify OTP
app.post('/verify-otp', (req, res) => {
  const { contact, otp } = req.body;

  if (!contact || !otp) {
    return res.status(400).json({ success: false, message: 'Missing contact or OTP' });
  }

  const record = otpStore[contact];

  if (!record) {
    return res.status(400).json({ success: false, message: 'No OTP sent to this email' });
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[contact];
    return res.status(400).json({ success: false, message: 'OTP expired' });
  }

  if (record.attempts >= 5) {
    delete otpStore[contact];
    return res.status(429).json({ success: false, message: 'Too many attempts' });
  }

  if (otp !== record.otp) {
    otpStore[contact].attempts++;
    return res.status(400).json({ success: false, message: 'Incorrect OTP' });
  }

  delete otpStore[contact];
  return res.json({ success: true, message: 'OTP verified successfully' });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});