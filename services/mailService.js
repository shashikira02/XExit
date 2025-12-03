const nodemailer = require("nodemailer");

let transporter = null;

if (process.env.MAIL_HOST && process.env.MAIL_USER) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
}else{
    console.warn("Mail service is not configured properly.");
}

const sendMail = async ({ to, subject, text, html }) => {
  try {
    if (!transporter) {
      console.log(
        `Email skipped (no mail config). To=${to} Subject=${subject}`
      );
      return;
    }

    await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.MAIL_USER,
      to,
      subject,
      text,
      html,
    });

    console.log(`Email sent to ${to} — Subject: ${subject}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendMail };


