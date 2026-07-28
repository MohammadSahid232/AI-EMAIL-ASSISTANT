const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  return null;
};

/**
 * Sends transactional email (Password Reset, Email Verification, Subscription Notices)
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log('---------------------------------------------------------');
    console.log(`[TRANSACTIONAL EMAIL DEMO MODE]`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${text || html}`);
    console.log('---------------------------------------------------------');
    return { success: true, mode: 'demo-log' };
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || '"AI Email Assistant" <noreply@aiemailassistant.com>',
      to,
      subject,
      text,
      html
    });
    console.log(`Email dispatched successfully to ${to}. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`Email dispatch failed to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
};

const sendPasswordResetEmail = async (userEmail, resetToken, req) => {
  const host = req ? `${req.protocol}://${req.get('host')}` : 'http://localhost:5173';
  const resetUrl = `${host}/reset-password/${resetToken}`;

  const subject = 'Password Reset Request — AI Email Assistant';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded-radius: 8px;">
      <h2 style="color: #4f46e5;">AI Email Assistant</h2>
      <p>Hello,</p>
      <p>You requested a password reset for your account. Please click the link below to set a new password:</p>
      <p style="margin: 24px 0;">
        <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
      </p>
      <p style="color: #64748b; font-size: 13px;">This link will expire in 10 minutes. If you did not request this, please ignore this email.</p>
    </div>
  `;
  const text = `Reset your password by visiting this URL: ${resetUrl}`;

  return await sendEmail({ to: userEmail, subject, html, text });
};

const sendVerificationEmail = async (userEmail, verifyToken, req) => {
  const host = req ? `${req.protocol}://${req.get('host')}` : 'http://localhost:5173';
  const verifyUrl = `${host}/verify-email/${verifyToken}`;

  const subject = 'Welcome! Verify your Email — AI Email Assistant';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0;">
      <h2 style="color: #4f46e5;">Welcome to AI Email Assistant</h2>
      <p>Thank you for signing up! Please verify your email address to unlock full access:</p>
      <p style="margin: 24px 0;">
        <a href="${verifyUrl}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Verify Email Address</a>
      </p>
    </div>
  `;
  const text = `Verify your email address: ${verifyUrl}`;

  return await sendEmail({ to: userEmail, subject, html, text });
};

module.exports = { sendEmail, sendPasswordResetEmail, sendVerificationEmail };
