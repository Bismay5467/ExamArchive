/* eslint-disable no-magic-numbers */
import { Resend } from '@trigger.dev/resend';
import z from 'zod';
import { TriggerClient, eventTrigger } from '@trigger.dev/sdk';

import { MAIL_EVENT_NAME } from '../constants/constants/shared';
import resend from '../config/resendConfig';
import triggerClient from '../config/triggerConfig';

(triggerClient as TriggerClient).defineJob({
  id: 'email-job',
  name: 'Resend: Send mails asynchornously',
  version: '0.0.1',
  trigger: eventTrigger({
    name: MAIL_EVENT_NAME,
    schema: z.object({
      to: z.array(z.string().email()),
      from: z.string(),
      subject: z.string().min(1).max(30),
      body: z.any(),
    }),
  }),
  integrations: { resend: resend as Resend },
  run: async (payload, io) => {
    await io.resend.emails.send('send-email', {
      to: payload.to,
      from: payload.from,
      subject: payload.subject,
      react: payload.body,
    });
  },
});
