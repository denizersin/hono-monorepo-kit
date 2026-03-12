import { z } from 'zod';

export const welcomeEmailVariablesSchema = z.object({
  fullName: z.string().min(1)
});

export const inviteEmailVariablesSchema = z.object({
  locale: z.string().default('en'),
  email: z.string().email(),
  invitedByEmail: z.string().email(),
  invitedByName: z.string().min(1),
  teamName: z.string().min(1),
  ip: z.string().min(1)
});

export const emailTemplateVariablesSchemaMap = {
  welcome: welcomeEmailVariablesSchema,
  invite: inviteEmailVariablesSchema
} as const;

export type EmailTemplateType = keyof typeof emailTemplateVariablesSchemaMap;

export type EmailTemplateVariablesMap = {
  [K in EmailTemplateType]: z.infer<(typeof emailTemplateVariablesSchemaMap)[K]>;
};

const baseEmailJobSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1).optional(),
  cc: z.array(z.string().email()).optional(),
  bcc: z.array(z.string().email()).optional(),
  attachments: z.array(
    z.object({
      filename: z.string().min(1),
      path: z.string().min(1)
    })
  ).optional()
});

export const emailJobSchema = z.discriminatedUnion('template', [
  baseEmailJobSchema.extend({
    template: z.literal('welcome'),
    variables: welcomeEmailVariablesSchema
  }),
  baseEmailJobSchema.extend({
    template: z.literal('invite'),
    variables: inviteEmailVariablesSchema
  })
]);

export type EmailJobData = z.infer<typeof emailJobSchema>;
export type EmailJobDataFor<T extends EmailTemplateType> = Extract<EmailJobData, { template: T }>;
