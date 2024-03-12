import mongoose, { Schema } from 'mongoose';

import { MAX_COMMENT_LENGTH } from '../constants/constants/filePreview';
import Question from '../models/question';
import User from '../models/user';

const CommentSchema: Schema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Types.ObjectId,
      required: true,
      index: true,
      ref: Question,
    },
    isEdited: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isFlagged: { type: Boolean, default: false },
    parentId: { type: mongoose.Types.ObjectId, index: true },
    upVotes: {
      count: { type: Number, default: 0 },
      voters: [mongoose.Types.ObjectId],
    },
    downVotes: {
      count: { type: Number, default: 0 },
      voters: [mongoose.Types.ObjectId],
    },
    userId: { type: mongoose.Types.ObjectId, required: true, ref: User },
    replyCount: { type: Number, default: 0 },
    message: {
      type: String,
      required: true,
      maxLength: [
        MAX_COMMENT_LENGTH,
        'Message has exceeded the max comment length',
      ],
    },
  },
  { timestamps: true, strict: true }
);

const Comment = mongoose.model('comment', CommentSchema);

export default Comment;
