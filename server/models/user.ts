/* eslint-disable no-magic-numbers */
import bcrypt from 'bcrypt';
import validator from 'validator';
import mongoose, { Schema } from 'mongoose';

import { INVITATION_STATUS, ROLE } from '../constants/constants/auth';

const UserSchema: Schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      maxLength: [10, 'Maximum length of the username should be 10'],
    },
    invitationStatus: {
      type: String,
      default: INVITATION_STATUS.ACCEPTED,
      enum: Object.values(INVITATION_STATUS),
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: true,
      minLength: [6, 'Minimum length of the password should be 6'],
      maxLength: [8, 'Maximum length of the password should be 8'],
      validate: {
        validator(password: string) {
          const digitRegex = /\d/;
          const symbolRegex = /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/;
          return digitRegex.test(password) && symbolRegex.test(password);
        },
        message: 'Password should contain atleast one digit and one symbol',
      },
    },
    role: {
      type: String,
      enum: Object.values(ROLE),
      default: ROLE.USER,
    },
  },
  { strict: true }
);

/*
no of downloads
no of paper uploaded
display badges if no of download counts | view counts of the paper
user have uploaded reach certain milestone
bookmarked papers - store id
uploaded question paper - store id
preferences of topics => P1
*/

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string | Buffer, salt);
});

UserSchema.methods.comparePassword = function (
  enteredPassword: string,
  hashedPassword: string
) {
  return bcrypt.compareSync(enteredPassword, hashedPassword);
};

const User = mongoose.models.user || mongoose.model('user', UserSchema);

export default User;
