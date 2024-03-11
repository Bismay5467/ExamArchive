import { TRPCError } from '@trpc/server';
import { Types } from 'mongoose';

import { MONGO_READ_QUERY_TIMEOUT } from '../../../constants/constants/shared';
import Question from '../../../models/question';
import redisClient from '../../../config/redisConfig';
import sendNotification from '../../../utils/notification/sendNotification';
import {
  DOC_INFO_TTL_IN_SECONDS,
  NOVU_EDIT_TAGS,
} from '../../../constants/constants/filePreview';

const EditTags = async ({
  postId,
  tagsToAdd,
  tagsToRemove,
}: {
  postId: string;
  tagsToAdd: string[];
  tagsToRemove: string[];
}) => {
  const docInfo = await Question.findOne({ _id: postId })
    .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
    .exec();
  if (docInfo === null) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `No question paper found with the id ${postId}`,
    });
  }
  const { tags } = docInfo as unknown as { tags: string[] };
  const updatedTags = new Set<string>([...tagsToAdd, ...tags]);
  tagsToRemove.forEach((tag) => updatedTags.delete(tag));
  (docInfo as any).tags = Array.from(updatedTags);
  const redisKey = `post:${postId}`;
  await Promise.all([
    docInfo.save(),
    redisClient?.set(
      redisKey,
      JSON.stringify(docInfo),
      'EX',
      DOC_INFO_TTL_IN_SECONDS
    ),
  ]);
  if (tagsToAdd.length > 0) {
    const { uploadedBy: ownerId } = docInfo as unknown as {
      uploadedBy: Types.ObjectId;
    };
    await sendNotification({
      ownerId,
      postId,
      type: 'tags',
      workflowIndentifier: NOVU_EDIT_TAGS,
    });
  }
};

export default EditTags;
