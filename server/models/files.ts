import mongoose, { Schema } from 'mongoose';

import { FILE_TYPE } from '../constants/constants/upload';
import Question from './question';
import User from './user';

const FileSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: User,
      index: true,
      required: true,
    },
    fileType: { type: String, enum: Object.values(FILE_TYPE), required: true },
    name: { type: String, required: true },
    parentId: { type: mongoose.Types.ObjectId, index: true, default: null },
    metadata: {
      type: mongoose.Types.ObjectId,
      ref: Question,
      default: null,
      index: true,
    },
    noOfFiles: { type: Number, default: 0 },
    isPinned: { type: Boolean, default: false },
  },
  { strict: true, timestamps: true }
);

const UploadedFiles = mongoose.model('uploadedfile', FileSchema);
const BookMarkedFile = mongoose.model('bookmarkedFile', FileSchema);

export { BookMarkedFile, UploadedFiles };
