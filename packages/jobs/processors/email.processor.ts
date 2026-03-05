import { Job } from 'bull';
import { InviteEmail } from '@repo/email/emails/invite';
import { WelcomeEmail } from '@repo/email/emails/welcome';
import { render } from '@repo/email/render';
import {
  EmailJobData,
  EmailTemplateType,
  JobResult,
  emailJobSchema
} from '../types';
import nodemailer from "nodemailer";

const TestTransportOptions = {
  host: 'smtp-relay.brevo.com',
  port: 587,                   // TLS için 587
  secure: false,               // Güvenlik TLS üzerinden sağlanır
  auth: {
    user: '8165cc001@smtp-brevo.com', // SMTP kullanıcı adı
    pass: "XGBLF9pqaCkTW06m",     // SMTP şifreniz (API anahtarı olabilir)
  },
}

const GetTestMailOptions = (to: string, subject: string, html: string) => ({
  from: 'ersindenim@gmail.com', // Gönderen
  to,                 // Alıcı
  subject: subject,           // Konu
  text: "Reservation",   // Mesaj metni
  html: html, // HTML mesajı
})


/**
 * Mock email sending function
 * Replace this with your actual email service (SendGrid, Nodemailer, etc.)
 */
async function sendEmail(
  to: string,
  subject: string,
  html: string,
  cc?: string[],
  bcc?: string[],
  attachments?: Array<{ filename: string; path: string }>
): Promise<void> {
  // Simulate email sending delay
  // await new Promise(resolve => setTimeout(resolve, 1000));

  const transporter = nodemailer.createTransport(TestTransportOptions);

  await transporter.sendMail(GetTestMailOptions(to, subject, html));

  // TODO: Implement actual email sending logic
  console.log('📧 Sending email:', {
    to,
    subject,
    htmlPreview: html.substring(0, 80) + '...',
    cc,
    bcc,
    attachments: attachments?.map(a => a.filename)
  });

  // Simulate occasional failures for testing retry logic
  if (Math.random() < 0.1) {
    throw new Error('Network error: Could not connect to email server');
  }
}

const subjectByTemplate: Record<EmailTemplateType, string> = {
  welcome: 'Welcome to Midday',
  invite: 'You are invited to join Midday'
};

function renderTemplateHtml(data: EmailJobData): string {
  switch (data.template) {
    case 'welcome':
      return render(WelcomeEmail(data.variables));
    case 'invite':
      return render(InviteEmail(data.variables));
    default:
      throw new Error(`Unsupported email template: ${(data as { template: string }).template}`);
  }
}

/**
 * Process Email Job
 * Handles email sending with progress tracking and error handling
 */
export async function processEmail(job: Job<EmailJobData>): Promise<JobResult> {
  try {
    // Update progress: preparing
    await job.progress(10);
    await job.log('Preparing to send email');

    const parsed = emailJobSchema.safeParse(job.data);
    if (!parsed.success) {
      throw new Error(`Invalid email job payload: ${parsed.error.message}`);
    }
    const { to, cc, bcc, attachments, template } = parsed.data;

    // Update progress: validating
    await job.progress(30);
    await job.log('Email data validated');

    await job.progress(55);
    await job.log(`Rendering email template: ${template}`);

    const html = renderTemplateHtml(parsed.data);
    const subject = parsed.data.subject ?? subjectByTemplate[template];

    // Send email after rendering
    await job.progress(80);
    await job.log('Sending email...');

    await sendEmail(to, subject, html, cc, bcc, attachments);

    // Update progress: completed
    await job.progress(100);
    await job.log('Email sent successfully');

    return {
      success: true,
      message: 'Email sent successfully',
      data: {
        to,
        subject,
        template,
        sentAt: new Date()
      },
      completedAt: new Date()
    };

  } catch (error: any) {
    // Log error
    await job.log(`Error: ${error.message}`);

    // Determine if error is retryable
    const isRetryable =
      error.message.includes('Network error') ||
      error.message.includes('Timeout') ||
      error.message.includes('Connection');

    if (isRetryable && job.attemptsMade < (job.opts.attempts || 3)) {
      // Let Bull retry the job
      throw new Error(`Email could not be sent (attempt ${job.attemptsMade + 1}): ${error.message}`);
    } else {
      // Final failure
      throw new Error(`Email sending failed permanently: ${error.message}`);
    }
  }
}

/**
 * Email processor with concurrency support
 * Export this function to be used by the worker
 */
export default processEmail;
