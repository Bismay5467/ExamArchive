import { ISubscriberPayload } from '@novu/node';
import { ITriggerPayload } from '@novu/shared';
import novuClient from '../../config/novuConfig';

const inAppNotification = async ({
  payload,
  subscriberId,
  subscriberPayload,
  workflowIndentifier,
}: {
  payload: ITriggerPayload;
  subscriberId: string;
  subscriberPayload: ISubscriberPayload;
  workflowIndentifier: string;
}) => {
  if (novuClient === null) return null;
  await novuClient.subscribers.identify(subscriberId, subscriberPayload);
  const { data } = await novuClient.trigger(workflowIndentifier, {
    to: { subscriberId },
    payload: { ...payload },
  });
  return data;
};

export default inAppNotification;
