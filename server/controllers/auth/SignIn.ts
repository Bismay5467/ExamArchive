import { TRPCError } from '@trpc/server';
import isEmail from 'validator/lib/isEmail';

import { JWT_MAX_AGE } from '../../constants/constants/auth';
import { MONGO_READ_QUERY_TIMEOUT } from '../../constants/constants/shared';
import User from '../../models/user';
import { signTokens } from '../../utils/auth/jsonwebtokens';

const SignIn = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  const email = isEmail(username) ? username : undefined;
  const user = await User.findOne({
    $or: [{ email }, { username }],
  })
    .select({ _id: 1, password: 1, username: 1, email: 1 })
    .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
    .exec();
  if (!user) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: "Username doesn't exists",
    });
  }
  const isPasswordCorrect = await user.comparePassword(password, user.password);
  if (!isPasswordCorrect) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message:
        'Invalid username or password. Please check your credentials and try again',
    });
  }
  const payload = {
    // eslint-disable-next-line no-underscore-dangle
    userId: user._id.toString(),
    username: (user as any).username,
    email: (user as any).email,
  };
  const token = await signTokens({ payload, JWT_MAX_AGE });
  if (token === null) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: "Couldn't generate a JWT token",
    });
  }
  return token;
};

export default SignIn;
