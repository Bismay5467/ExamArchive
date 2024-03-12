/* eslint-disable no-magic-numbers */
/* eslint-disable prefer-destructuring */
import { MONGO_WRITE_QUERY_TIMEOUT } from '../../constants/constants/shared';
import { Question } from '../../models';

const NotificationWebhook = async ({
  publicId,
  url,
}: {
  publicId: string;
  url: string;
}) => {
  const sanitizedFileName = publicId.split('/').slice(-1)[0];
  await Question.findOneAndUpdate(
    { 'file.filename': sanitizedFileName },
    { 'file.publicId': publicId, 'file.url': url },
    { upsert: false, new: true }
  )
    .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
    .lean()
    .exec();
};

export default NotificationWebhook;
