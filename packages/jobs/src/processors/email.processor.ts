import { Job } from 'bullmq';
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
  port: 587,
  secure: false,
  auth: {
    user: '8165cc001@smtp-brevo.com',
    pass: "XGBLF9pqaCkTW06m",
  },
}

const GetTestMailOptions = (to: string, subject: string, html: string) => ({
  from: 'ersindenim@gmail.com',
  to,
  subject: subject,
  text: "Reservation",
  html: html,
})

/**
 * Send email via nodemailer
 */
async function sendEmail(
  to: string,
  subject: string,
  html: string,
  cc?: string[],
  bcc?: string[],
  attachments?: Array<{ filename: string; path: string }>
): Promise<void> {
  const transporter = nodemailer.createTransport(TestTransportOptions);

  await transporter.sendMail(GetTestMailOptions(to, subject, html));

  console.log('📧 Sending email:', {
    to,
    subject,
    htmlPreview: html.substring(0, 80) + '...',
    cc,
    bcc,
    attachments: attachments?.map(a => a.filename)
  });

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
 * BullMQ processor: receives a Job instance and returns the result
 */
export async function processEmail(job: Job<EmailJobData>): Promise<JobResult> {
  try {
    // Update progress: preparing
    await job.updateProgress(10);
    await job.log('Preparing to send email');

    const parsed = emailJobSchema.safeParse(job.data);
    if (!parsed.success) {
      throw new Error(`Invalid email job payload: ${parsed.error.message}`);
    }
    const { to, cc, bcc, attachments, template } = parsed.data;

    await job.updateProgress(30);
    await job.log('Email data validated');

    await job.updateProgress(55);
    await job.log(`Rendering email template: ${template}`);

    const html = renderTemplateHtml(parsed.data);
    const subject = parsed.data.subject ?? subjectByTemplate[template];

    await job.updateProgress(80);
    await job.log('Sending email...');

    await sendEmail(to, subject, html, cc, bcc, attachments);

    await job.updateProgress(100);
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
    await job.log(`Error: ${error.message}`);

    const isRetryable =
      error.message.includes('Network error') ||
      error.message.includes('Timeout') ||
      error.message.includes('Connection');

    if (isRetryable && job.attemptsMade < (job.opts.attempts ?? 3)) {
      throw new Error(`Email could not be sent (attempt ${job.attemptsMade + 1}): ${error.message}`);
    } else {
      throw new Error(`Email sending failed permanently: ${error.message}`);
    }
  }
}

export default processEmail;
