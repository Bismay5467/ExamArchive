/* eslint-disable no-case-declarations */
import { Types } from 'mongoose';

import { MONGO_READ_QUERY_TIMEOUT } from '../../constants/constants/shared';
import { NOTIF_FREQ } from '../../constants/constants/filePreview';
import { User } from '../../models';
import inAppNotification from './inApp';
import { TNotif, TNotifType } from '../../types/filePreview/types';

const getSubscriberPayload = async ({
  ownerId,
}: {
  ownerId: Types.ObjectId;
}) => {
  const user = await User.findById({ _id: ownerId })
    .select({ email: 1, username: 1 })
    .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
    .lean()
    .exec();
  if (user === null) return {};
  const { email, username: firstName } = user as unknown as {
    email: string;
    username: string;
  };
  const subscriberPayload = { email, firstName };
  return subscriberPayload;
};

const sendNotification = async (params: TNotif<TNotifType>) => {
  const { type, ownerId, workflowIndentifier, postId } = params;
  const subscriberId = ownerId.toString();
  let subscriberPayload;
  let payload = {};
  switch (type) {
    case 'downloads':
    case 'views':
      const { count } = params as TNotif<Exclude<TNotifType, 'tags'>>;
      if (Number(count) === 0 || Number(count) % NOTIF_FREQ !== 0) {
        return undefined;
      }
      subscriberPayload = await getSubscriberPayload({ ownerId });
      if (Object.keys(subscriberPayload).length === 0) return undefined;
      payload = { numbers: count, type, postId };
      break;
    case 'tags':
      subscriberPayload = await getSubscriberPayload({ ownerId });
      if (Object.keys(subscriberPayload).length === 0) return undefined;
      break;
    default:
      return null;
  }
  const data = await inAppNotification({
    subscriberPayload,
    subscriberId,
    workflowIndentifier,
    payload,
  });
  return data;
};

export default sendNotification;
