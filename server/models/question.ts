/* eslint-disable no-magic-numbers */
import mongoose, { Schema } from 'mongoose';

import User from './user';
import examNames from '../utils/filePreview/examNames';
import { EXAM_TYPES, SEMESTER } from '../constants/constants/shared';

const QuestionSchema: Schema = new mongoose.Schema(
  {
    uploadedBy: { type: mongoose.Types.ObjectId, required: true, ref: User },
    year: {
      type: String,
      validate: {
        validator(year: string) {
          const digitRegex = /\d/;
          const yearInt = Number(year);
          const date = new Date();
          const presentYear = date.getFullYear();
          if (digitRegex.test(year) === false || year.length !== 4) {
            return false;
          }
          if (yearInt < 1950 || yearInt > presentYear) return false;
          return true;
        },
      },
      required: true,
      index: true,
    },
    file: {
      filename: { type: String, index: true },
      publicId: { type: String },
      url: { type: String },
    },
    examType: {
      type: String,
      required: true,
      enum: examNames(EXAM_TYPES),
      index: true,
    },
    rating: [
      {
        ratingType: { type: String, default: 'helpful' },
        totalRating: { type: Number, default: 0 },
        averageRating: {
          type: Number,
          default: 0,
          min: 0,
          max: 5,
        },
      },
      {
        ratingType: { type: String, default: 'standard' },
        totalRating: { type: Number, default: 0 },
        averageRating: {
          type: Number,
          default: 0,
          min: 0,
          max: 5,
        },
      },
      {
        ratingType: { type: String, default: 'relevance' },
        totalRating: { type: Number, default: 0 },
        averageRating: {
          type: Number,
          default: 0,
          min: 0,
          max: 5,
        },
      },
    ],
    noOfDownloads: {
      count: { type: Number, default: 0 },
      userIds: [mongoose.Types.ObjectId],
    },
    noOfViews: {
      count: { type: Number, default: 0 },
      userIds: [mongoose.Types.ObjectId],
    },
    tags: [{ type: String, index: true }],
    institutionName: { type: String, index: true },
    semester: { type: String, enum: Object.keys(SEMESTER), index: true },
    branch: { type: String, index: true },
    subjectCode: { type: String, index: true },
    subjectName: { type: String, index: true },
    isFlagged: { type: Boolean, default: false },
  },
  { timestamps: true, strict: true }
);

const Question =
  mongoose.models.question || mongoose.model('question', QuestionSchema);

export default Question;
