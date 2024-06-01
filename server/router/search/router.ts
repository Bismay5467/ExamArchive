import express from 'express';

import { searchInputSchema } from './schema';
import validate from '../../middlewares/validate';
import { GetPapers, GetSubjectFilters } from '../../controllers/search';

const router = express.Router();

router.get('/', validate(searchInputSchema, 'QUERY'), GetPapers);
router.get('/getSubjectFilters', GetSubjectFilters);

export default router;
