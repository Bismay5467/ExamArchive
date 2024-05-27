import express from 'express';
import { superAdminPrivilege } from '../../middlewares/previlege';
import validate from '../../middlewares/validate';
import verifyUser from '../../middlewares/verifyUser';
import { Add, Get, Remove, UpdateCache } from '../../controllers/superadmin';
import {
  addInputSchema,
  getInputSchema,
  removeInputSchema,
  updateSchema,
} from './schema';

const router = express.Router();

router.post(
  '/add',
  [verifyUser, superAdminPrivilege, validate(addInputSchema, 'BODY')],
  Add
);
router.put(
  '/remove',
  [verifyUser, superAdminPrivilege, validate(removeInputSchema, 'BODY')],
  Remove
);
router.get(
  '/get',
  [verifyUser, superAdminPrivilege, validate(getInputSchema, 'QUERY')],
  Get
);
router.put('/update', validate(updateSchema, 'BODY'), UpdateCache);

export default router;
