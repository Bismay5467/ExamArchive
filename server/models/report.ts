import mongoose, { Schema } from 'mongoose';

import Question from './question';
import User from './user';

const ReportSchema: Schema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Types.ObjectId,
      required: true,
      index: true,
      ref: Question,
    },
    postType: { type: String, required: true, enum: ['COMMENT', 'DOC'] },
    totalReport: { type: Number, default: 0, required: true, index: true },
    reasons: {
      type: [
        {
          reason: { type: String, required: true },
          totalReports: { type: Number, required: true },
          userIds: [{ type: mongoose.Types.ObjectId, ref: User }],
        },
      ],
      required: true,
    },
    isResolved: { type: Boolean, default: false },
  },
  { strict: true, timestamps: true }
);

const Report = mongoose.models.rating || mongoose.model('report', ReportSchema);

export default Report;
