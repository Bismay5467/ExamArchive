import { AnyZodObject } from 'zod';
import express from 'express';
import { userPrivilege } from '../../middlewares/previlege';
import validate from '../../middlewares/validate';
import { NewUser, Reset, SignIn } from '../../controllers/auth';
import {
  newUserInputSchema,
  resetInputSchema,
  signInUserInputSchema,
} from './schema';

const router = express.Router();

router.post(
  '/newUser',
  [validate(newUserInputSchema, 'BODY'), userPrivilege],
  NewUser
);
router.post('/signIn', validate(signInUserInputSchema, 'BODY'), SignIn);
router.put(
  '/reset',
  validate(resetInputSchema as unknown as AnyZodObject, 'BODY'),
  Reset
);

export default router;
