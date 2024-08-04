import express from 'express';

import { ROLE } from '../../constants/constants/auth';
import privilege from '../../middlewares/previlege';
import validate from '../../middlewares/validate';
import verifyUser from '../../middlewares/verifyUser';
import {
  Add,
  AddInstituteName,
  Get,
  GetInstituteNames,
  Remove,
  UpdateCache,
} from '../../controllers/superadmin';
import {
  addInputSchema,
  addInsitituteNameInputSchema,
  getInputSchema,
  removeInputSchema,
  updateSchema,
} from './schema';

const router = express.Router();

router.post(
  '/add',
  [verifyUser, privilege([ROLE.SUPERADMIN]), validate(addInputSchema, 'BODY')],
  Add
);
router.put(
  '/remove',
  [
    verifyUser,
    privilege([ROLE.SUPERADMIN]),
    validate(removeInputSchema, 'BODY'),
  ],
  Remove
);
router.get(
  '/getInsituteName',
  [verifyUser, privilege([ROLE.SUPERADMIN])],
  GetInstituteNames
);
router.post(
  '/addInsitituteName',
  [
    verifyUser,
    privilege([ROLE.SUPERADMIN]),
    validate(addInsitituteNameInputSchema, 'BODY'),
  ],
  AddInstituteName
);
router.get(
  '/get',
  [verifyUser, privilege([ROLE.SUPERADMIN]), validate(getInputSchema, 'QUERY')],
  Get
);
router.put('/update', validate(updateSchema, 'BODY'), UpdateCache);

export default router;
