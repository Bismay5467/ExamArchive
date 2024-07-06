import mongoose, { Schema } from 'mongoose';

import User from './user';
import { reasonsForReport } from '../constants/constants/report';

const reasonSubSchema: Schema = new mongoose.Schema({
  reason: { type: String, enum: reasonsForReport, required: true },
  count: { type: Number, default: 0, required: true },
});

const ReportSchema: Schema = new mongoose.Schema(
  {
    docModel: {
      type: String,
      required: true,
      enum: ['Comment', 'Question'],
    },
    postId: {
      type: mongoose.Types.ObjectId,
      required: true,
      index: true,
      refPath: 'docModel',
    },
    totalReport: { type: Number, default: 0, index: true },
    reasons: [reasonSubSchema],
    resolved: {
      isResolved: { type: Boolean, default: false },
      adminId: { type: mongoose.Types.ObjectId, ref: User },
    },
  },
  { schema: true, timestamps: true }
);

const Report = mongoose.models.report || mongoose.model('report', ReportSchema);

export default Report;
