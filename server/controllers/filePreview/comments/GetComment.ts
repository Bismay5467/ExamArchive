import { z } from 'zod';
import { Request, Response } from 'express';
import mongoose, { SortOrder } from 'mongoose';

import Comment from '../../../models/comment';
import { MAX_COMMENT_FETCH_LIMIT } from '../../../constants/constants/filePreview';
import { MONGO_READ_QUERY_TIMEOUT } from '../../../constants/constants/shared';
import { SUCCESS_CODES } from '../../../constants/statusCode';
import asyncErrorHandler from '../../../utils/errors/asyncErrorHandler';
import { getCommentsInputSchema } from '../../../router/filePreview/comments/schema';

const getSanitizedComments = (
  comments: any,
  currentUserId: mongoose.Types.ObjectId
) => {
  const sanitizedComments = comments.map((comment: any) => {
    const {
      isDeleted,
      isFlagged,
      isEdited,
      _id: commentId,
      message,
      postId,
      userId,
      updatedAt: timestamp,
      upVotes,
      downVotes,
      replyCount,
      parentId,
    } = comment;

    const commentObj = {
      replyCount,
      timestamp,
      userId: {
        // eslint-disable-next-line no-underscore-dangle
        _id: userId?._id?.toString() ?? null,
        username: userId?.username?.toString() ?? 'ExamArchive User',
      },
      postId: postId.toString(),
      commentId: commentId.toString(),
      parentId: parentId === undefined ? undefined : parentId.toString(),
    };

    const hasUpVoted = !!upVotes.voters.find(
      (id: string) => id.toString() === currentUserId.toString()
    );
    const hasDownVoted = !!downVotes.voters.find(
      (id: string) => id.toString() === currentUserId.toString()
    );

    if (isDeleted === true) {
      Object.assign(commentObj, {
        isDeleted,
        message: 'This message was deleted by the user',
      });
    } else if (isFlagged === true) {
      Object.assign(commentObj, {
        isFlagged,
        message: 'This comment was removed by the admin',
      });
    } else {
      Object.assign(commentObj, {
        isEdited,
        message,
        upVotes: { count: upVotes.count, hasUpVoted },
        downVotes: { count: downVotes.count, hasDownVoted },
      });
    }

    return commentObj;
  });
  return sanitizedComments;
};

const GetComments = asyncErrorHandler(async (req: Request, res: Response) => {
  const { userId } = req.body as { userId: string };
  const { postId, page, parentId, commentType } =
    req.query as unknown as z.infer<typeof getCommentsInputSchema>;
  const skipCount = (Number(page) - 1) * MAX_COMMENT_FETCH_LIMIT;
  const query =
    commentType === 'COMMENTS'
      ? { postId, parentId: undefined }
      : { postId, parentId };

  const sortOrder: { [key: string]: SortOrder } | null =
    commentType === 'COMMENTS'
      ? { 'upVotes.count': 'desc', updatedAt: 'desc' }
      : null;

  const getDataFromDBPromises = [
    Comment.find(query)
      .populate({ path: 'userId', select: { username: 1 } })
      .select({ createdAt: 0 })
      .sort(sortOrder)
      .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
      .lean()
      .skip(skipCount)
      .limit(MAX_COMMENT_FETCH_LIMIT),
    Comment.countDocuments(query)
      .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
      .lean()
      .exec(),
  ];

  const [comments, totalComments] = await Promise.all(getDataFromDBPromises);

  const sanitizedComments = getSanitizedComments(
    comments,
    new mongoose.Types.ObjectId(userId)
  );
  const totalPages = Math.ceil(Number(totalComments) / MAX_COMMENT_FETCH_LIMIT);
  const hasMore = totalPages > Number(page);

  return res.status(SUCCESS_CODES.OK).json({
    comments: sanitizedComments,
    totalComments: Number(totalComments),
    hasMore,
  });
});

export default GetComments;
