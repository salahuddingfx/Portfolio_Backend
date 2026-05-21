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

const createMailTransporter = async () => {
  let hostIp = mailHost;
  try {
    const { address } = await dns.promises.lookup(mailHost, { family: 4 });
    hostIp = address;
  } catch (error) {
    console.warn(`Failed to resolve SMTP host ${mailHost} to IPv4, falling back to hostname:`, error);
  }

  return nodemailer.createTransport({
    host: hostIp,
    port: mailPort,
    secure: mailSecure,
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
};

/* =============================================================================
   RESEND HTTP API FALLBACK (Bypasses SMTP blocks on hosting providers like Render)
   ============================================================================= */

const sendResendEmail = async ({ to, subject, html }) => {
  const fromName = process.env.MAIL_FROM_NAME || 'Salah Uddin';
  // Resend free tier sandbox requires the from address to be 'onboarding@resend.dev' unless domain is verified
  const fromEmail = process.env.RESEND_FROM_ADDRESS || process.env.MAIL_FROM_ADDRESS || 'onboarding@resend.dev';

  console.log(`Sending email to ${to} via Resend API...`);
  
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend API Error (Status ${response.status}): ${errorText}`);
  }

  const result = await response.json();
  console.log(`Email sent successfully via Resend API. ID: ${result.id}`);
  return result;
};

/* =============================================================================
   PUBLIC EXPORTS
   ============================================================================= */

export const sendContactEmails = async (contactData) => {
  const { name, email, message, subject } = contactData;

  const adminSubject = `New Contact Message: ${subject || 'General Inquiry'}`;
  const adminHtml = `
    <h2>New Contact Request</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `;

  const userSubject = `Thank you for contacting Salah Uddin!`;
  const userHtml = `
    <h2>Hi ${name},</h2>
    <p>Thank you for reaching out! I have received your message and will get back to you as soon as possible.</p>
    <p>Best regards,<br><strong>Salah Uddin</strong><br>Digital Architect</p>
  `;

  if (process.env.RESEND_API_KEY) {
    try {
      await sendResendEmail({
        to: process.env.MAIL_FROM_ADDRESS,
        subject: adminSubject,
        html: adminHtml,
      });
      await sendResendEmail({
        to: email,
        subject: userSubject,
        html: userHtml,
      });
    } catch (error) {
      console.error('Failed to send contact emails via Resend, attempting Nodemailer fallback:', error);
      // Try to fallback to Nodemailer SMTP in case Resend credentials fail
      const transporter = await createMailTransporter();
      await transporter.sendMail({
        from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
        to: process.env.MAIL_FROM_ADDRESS,
        subject: adminSubject,
        html: adminHtml,
      });
      await transporter.sendMail({
        from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
        to: email,
        subject: userSubject,
        html: userHtml,
      });
    }
  } else {
    // Standard SMTP path
    const adminMailOptions = {
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: process.env.MAIL_FROM_ADDRESS,
      subject: adminSubject,
      html: adminHtml,
    };

    const userMailOptions = {
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: email,
      subject: userSubject,
      html: userHtml,
    };

    const transporter = await createMailTransporter();
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);
  }
};

export const sendPasswordResetEmail = async ({ to, resetUrl }) => {
  const subject = 'Admin password reset';
  const html = `
    <h2>Password reset request</h2>
    <p>Click the link below to reset your admin password. This link expires in 1 hour.</p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>
  `;

  if (process.env.RESEND_API_KEY) {
    try {
      await sendResendEmail({ to, subject, html });
    } catch (error) {
      console.error('Failed to send reset email via Resend, attempting Nodemailer fallback:', error);
      const mailOptions = {
        from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
        to,
        subject,
        html,
      };
      const transporter = await createMailTransporter();
      await transporter.sendMail(mailOptions);
    }
  } else {
    const mailOptions = {
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to,
      subject,
      html,
    };
    const transporter = await createMailTransporter();
    await transporter.sendMail(mailOptions);
  }
};
