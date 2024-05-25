import express from 'express';

import validate from '../../middlewares/validate';
import verifyUser from '../../middlewares/verifyUser';
import {
  MarkAsResolved,
  ReportContent,
  ViewReport,
} from '../../controllers/report';
import {
  adminPrevilege,
  superAdminPrivilege,
  userPrivilege,
} from '../../middlewares/previlege';
import {
  markAsResolvedInputSchema,
  reportContentInputSchema,
  viewReportInputSchema,
} from './schema';

const router = express.Router();

router.post(
  '/',
  [
    verifyUser,
    userPrivilege,
    adminPrevilege,
    validate(reportContentInputSchema, 'BODY'),
  ],
  ReportContent
);
router.get(
  '/view',
  [verifyUser, superAdminPrivilege, validate(viewReportInputSchema, 'QUERY')],
  ViewReport
);
router.put(
  '/markResolved',
  [
    verifyUser,
    superAdminPrivilege,
    validate(markAsResolvedInputSchema, 'BODY'),
  ],
  MarkAsResolved
);

export default router;
