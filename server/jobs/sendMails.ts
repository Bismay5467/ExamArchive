import { Resend } from '@trigger.dev/resend';
import { z } from 'zod';
import { TriggerClient, eventTrigger } from '@trigger.dev/sdk';

import { MAIL_EVENT_NAME } from '../constants/constants/shared';
import resend from '../config/resendConfig';
import triggerClient from '../config/triggerConfig';

(triggerClient as TriggerClient).defineJob({
  id: 'resend-email-form',
  name: 'Send mails on event trigger',
  version: '1.0.0',
  trigger: eventTrigger({
    name: MAIL_EVENT_NAME,
    schema: z.object({
      to: z.string().array(),
      subject: z.string(),
      html: z.string(),
      from: z.string(),
    }),
  }),
  integrations: { resend: resend as Resend },
  run: async (payload, io) => {
    await io.resend.sendEmail('send-email', payload);
  },
});
