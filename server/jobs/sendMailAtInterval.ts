/* eslint-disable no-magic-numbers */
import { Resend } from '@trigger.dev/resend';
import { TriggerClient, intervalTrigger } from '@trigger.dev/sdk';

import { SCHEDULED_TIME_SECONDS } from '../constants/constants/shared';
import resend from '../config/resendConfig';
import triggerClient from '../config/triggerConfig';

(triggerClient as TriggerClient).defineJob({
  id: 'scheduled-email-job',
  name: 'Resend: Send mails at interval',
  version: '0.0.1',
  trigger: intervalTrigger({ seconds: SCHEDULED_TIME_SECONDS }),
  integrations: { resend: resend as Resend },
  run: async (payload, io) => {
    await io.logger.info('This is a scheduled job');
  },
});
