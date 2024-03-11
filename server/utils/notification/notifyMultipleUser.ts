/* eslint-disable consistent-return */
import { ITriggerPayload } from '@novu/shared';
import { ITopicPayload, TriggerRecipientsTypeEnum } from '@novu/node';

import novuClient from '../../config/novuConfig';

const notifyMutipleUsers = async ({
  topic,
  subscribers,
  workflowIndentifier,
  payload,
}: {
  topic: ITopicPayload;
  subscribers: Array<string>;
  workflowIndentifier: string;
  payload: ITriggerPayload;
}) => {
  if (novuClient === null) return null;
  const { key: topicKey } = topic;
  const isTopicPresent = await novuClient.topics.get(topicKey);
  if (Object.keys(isTopicPresent).length === 0) {
    await novuClient.topics.create(topic);
  }
  await novuClient.topics.addSubscribers(topicKey, {
    subscribers,
  });
  await novuClient.trigger(workflowIndentifier, {
    to: [{ type: TriggerRecipientsTypeEnum.TOPIC, topicKey }],
    payload,
  });
};

export default notifyMutipleUsers;
