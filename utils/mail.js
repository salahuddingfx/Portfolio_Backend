import dns from 'node:dns';
import nodemailer from 'nodemailer';

if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

const toBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === '') return fallback;
  return String(value).toLowerCase() === 'true';
};

const mailHost = process.env.MAIL_HOST || 'smtp.gmail.com';
const mailPort = Number(process.env.MAIL_PORT || 0) || (toBoolean(process.env.MAIL_SECURE) ? 465 : 587);
const mailSecure = toBoolean(process.env.MAIL_SECURE, mailPort === 465);

const transporter = nodemailer.createTransport({
  host: mailHost,
  port: mailPort,
  secure: mailSecure,
  family: 4,
  lookup: (hostname, options, callback) => {
    const lookupOptions = typeof options === 'number'
      ? { family: 4 }
      : { ...options, family: 4 };
    dns.lookup(hostname, lookupOptions, callback);
  },
  requireTLS: !mailSecure,
  tls: {
    servername: mailHost,
  },
  connectionTimeout: Number(process.env.MAIL_CONNECTION_TIMEOUT || 15000),
  greetingTimeout: Number(process.env.MAIL_GREETING_TIMEOUT || 15000),
  socketTimeout: Number(process.env.MAIL_SOCKET_TIMEOUT || 20000),
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const sendContactEmails = async (contactData) => {
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

export const sendPasswordResetEmail = async ({ to, resetUrl }) => {
  const mailOptions = {
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
    to,
    subject: 'Admin password reset',
    html: `
      <h2>Password reset request</h2>
      <p>Click the link below to reset your admin password. This link expires in 1 hour.</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
