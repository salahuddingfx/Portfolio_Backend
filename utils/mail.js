const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendContactEmails = async (contactData) => {
  const { name, email, message, subject } = contactData;

  // 1. Send email to Admin (User)
  const adminMailOptions = {
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
    to: process.env.MAIL_FROM_ADDRESS,
    subject: `New Contact Message: ${subject || 'General Inquiry'}`,
    html: `
      <h2>New Contact Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  // 2. Send Auto-reply to Contactor
  const userMailOptions = {
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
    to: email,
    subject: `Thank you for contacting Salah Uddin!`,
    html: `
      <h2>Hi ${name},</h2>
      <p>Thank you for reaching out! I have received your message and will get back to you as soon as possible.</p>
      <p>Best regards,<br><strong>Salah Uddin</strong><br>Digital Architect</p>
    `,
  };

  await transporter.sendMail(adminMailOptions);
  await transporter.sendMail(userMailOptions);
};

module.exports = { sendContactEmails };
