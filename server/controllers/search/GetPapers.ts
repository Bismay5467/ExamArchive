import { z } from 'zod';
import { Request, Response } from 'express';

import { MAX_SEARCH_RESULT_FETCH_LIMIT } from '../../constants/constants/search';
import { MONGO_READ_QUERY_TIMEOUT } from '../../constants/constants/shared';
import { Question } from '../../models';
import { SUCCESS_CODES } from '../../constants/statusCode';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import { searchInputSchema } from '../../router/search/schema';
import {
  getProjections,
  getQuery,
  getSortOrder,
} from '../../utils/search/getter';

const GetPapers = asyncErrorHandler(async (req: Request, res: Response) => {
  const { searchParams, sortFilter, page, subjectName, year, examType } =
    req.query as unknown as z.infer<typeof searchInputSchema>;
  const skipCount = (page - 1) * MAX_SEARCH_RESULT_FETCH_LIMIT;
  const query = getQuery({ searchParams, subjectName, year, examType });
  const sortOrder = getSortOrder({ sortFilter });
  const project = getProjections();

  const [searchResults, totalSearches] = await Promise.all([
    Question.find(query)
      .populate({ path: 'uploadedBy', select: { username: 1, _id: 1 } })
      .select(project)
      .sort(sortOrder as any)
      .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
      .lean()
      .skip(skipCount)
      .limit(MAX_SEARCH_RESULT_FETCH_LIMIT),
    Question.countDocuments(query)
      .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
      .lean()
      .exec(),
  ]);
  const totalPages = Math.ceil(
    Number(totalSearches) / MAX_SEARCH_RESULT_FETCH_LIMIT
  );
  const hasMore = totalPages > page;
  return res
    .status(SUCCESS_CODES.OK)
    .json({ data: searchResults, hasMore, totalSearches });
});

export default GetPapers;
