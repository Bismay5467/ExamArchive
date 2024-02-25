/* eslint-disable no-magic-numbers */
import bcrypt from 'bcrypt';
import validator from 'validator';
import mongoose, { Schema } from 'mongoose';

const UserSchema: Schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      maxLength: [10, 'Minimum length of the username should be 10'],
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
      maxLength: [8, 'Minimum length of the password should be 8'],
      validate: {
        validator(password: string) {
          const digitRegex = /\d/;
          const symbolRegex = /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/;
          return digitRegex.test(password) && symbolRegex.test(password);
        },
        message: 'Password should contain atleast one digit and one symbol',
      },
    },
  },
  { strict: true }
);

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
