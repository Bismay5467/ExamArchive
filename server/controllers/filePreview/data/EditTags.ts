import { Types } from 'mongoose';
import { z } from 'zod';
import { Request, Response } from 'express';

import { ErrorHandler } from '../../../utils/errors/errorHandler';
import { MONGO_READ_QUERY_TIMEOUT } from '../../../constants/constants/shared';
import Question from '../../../models/question';
import asyncErrorHandler from '../../../utils/errors/asyncErrorHandler';
import { editTagsInputSchema } from '../../../router/filePreview/data/schema';
import redisClient from '../../../config/redisConfig';
import sendNotification from '../../../utils/notification/sendNotification';
import {
  DOC_INFO_TTL_IN_SECONDS,
  NOVU_EDIT_TAGS,
} from '../../../constants/constants/filePreview';
import { ERROR_CODES, SUCCESS_CODES } from '../../../constants/statusCode';

const EditTags = asyncErrorHandler(async (req: Request, res: Response) => {
  const { postId, tagsToAdd, tagsToRemove } = req.body.data as z.infer<
    typeof editTagsInputSchema
  >;
  const docInfo = await Question.findOne({ _id: postId })
    .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
    .exec();
  if (docInfo === null) {
    throw new ErrorHandler(
      'No post found with given postId',
      ERROR_CODES['NOT FOUND']
    );
  }
  if (docInfo === null) {
    throw new ErrorHandler('Post doesnot exists', ERROR_CODES['NOT FOUND']);
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
  return res.status(SUCCESS_CODES.OK).json({ message: 'Tags updated' });
});

export default EditTags;
