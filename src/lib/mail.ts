import nodemailer from "nodemailer";

const smtpConfig: Record<string, unknown> = {
  host: process.env.SMTP_HOST || "mail.appuse.ru",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
};

if (process.env.SMTP_USER) {
  smtpConfig.auth = {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS || "",
  };
}

const transporter = nodemailer.createTransport(smtpConfig as nodemailer.TransportOptions);

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@appuse.ru",
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}: ${subject}`);
    return true;
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    return false;
  }
}

export function buildVerificationEmail(name: string, verificationUrl: string): { subject: string; html: string } {
  return {
    subject: "Подтверждение email — PG Practikum",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #3fb950;">Подтверждение email</h2>
        <p>Привет, ${name}!</p>
        <p>Для завершения регистрации перейдите по ссылке:</p>
        <p style="margin: 20px 0;">
          <a href="${verificationUrl}" style="background: #3fb950; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Подтвердить email
          </a>
        </p>
        <p style="color: #666; font-size: 14px;">Или скопируйте ссылку: ${verificationUrl}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">Если вы не регистрировались в PG Practikum, просто проигнорируйте это письмо.</p>
      </div>
    `,
  };
}

export function buildPasswordResetEmail(name: string, resetUrl: string): { subject: string; html: string } {
  return {
    subject: "Сброс пароля — PG Practikum",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #58a6ff;">Сброс пароля</h2>
        <p>Привет, ${name}!</p>
        <p>Вы запросили сброс пароля. Перейдите по ссылке для создания нового пароля:</p>
        <p style="margin: 20px 0;">
          <a href="${resetUrl}" style="background: #58a6ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Сбросить пароль
          </a>
        </p>
        <p style="color: #666; font-size: 14px;">Или скопируйте ссылку: ${resetUrl}</p>
        <p style="color: #999; font-size: 12px;">Ссылка действительна в течение 1 часа.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.</p>
      </div>
    `,
  };
}
