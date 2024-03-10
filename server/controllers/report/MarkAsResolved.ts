import { TRPCError } from '@trpc/server';
import mongoose from 'mongoose';

import { MONGO_WRITE_QUERY_TIMEOUT } from '../../constants/constants/shared';
import { Comment, Question, Report } from '../../models';

const MarkAsResolved = async ({
  adminId,
  reportId,
  postId,
  contentType,
}: {
  adminId: string;
  reportId: string;
  postId: string;
  contentType: 'COMMENT' | 'POST';
}) => {
  const Collection: any = contentType === 'COMMENT' ? Comment : Question;
  const session = await mongoose.startSession();

  await session.withTransaction(async () => {
    const [isReportMarkedResolved, isContentFlagged] = await Promise.all([
      Report.findOneAndUpdate(
        { _id: reportId, resolved: { isResolved: false } },
        { resolved: { isResolved: true, adminId } },
        { upsert: false, new: true }
      )
        .select({ _id: 1 })
        .session(session)
        .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
        .lean()
        .exec(),
      Collection.findOneAndUpdate(
        { _id: postId, isFlagged: false },
        { isFlagged: true },
        { upsert: false, new: true }
      )
        .select({ _id: 1 })
        .session(session)
        .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
        .lean()
        .exec(),
    ]);
    if (!(isReportMarkedResolved && isContentFlagged)) {
      await session.abortTransaction();
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'No document found matching the specified id',
      });
    }
  });
  await session.endSession();
};

export default MarkAsResolved;
