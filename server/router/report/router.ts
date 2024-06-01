import express from 'express';

import { ROLE } from '../../constants/constants/auth';
import privilege from '../../middlewares/previlege';
import validate from '../../middlewares/validate';
import verifyUser from '../../middlewares/verifyUser';
import {
  MarkAsResolved,
  ReportContent,
  ViewReport,
} from '../../controllers/report';
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
    privilege([ROLE.ADMIN, ROLE.USER]),
    validate(reportContentInputSchema, 'BODY'),
  ],
  ReportContent
);
router.get(
  '/view',
  [
    verifyUser,
    privilege([ROLE.SUPERADMIN]),
    validate(viewReportInputSchema, 'QUERY'),
  ],
  ViewReport
);
router.put(
  '/markResolved',
  [
    verifyUser,
    privilege([ROLE.SUPERADMIN]),
    validate(markAsResolvedInputSchema, 'BODY'),
  ],
  MarkAsResolved
);

export default router;
