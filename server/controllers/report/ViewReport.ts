import { z } from 'zod';
import { Request, Response } from 'express';

import { MAX_REPORT_FETCH_LIMIT } from '../../constants/constants/report';
import { MONGO_READ_QUERY_TIMEOUT } from '../../constants/constants/shared';
import { Report } from '../../models';
import { SUCCESS_CODES } from '../../constants/statusCode';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import { viewReportInputSchema } from '../../router/report/schema';
import { getQuery, getSortOptions } from '../../utils/report/getter';

const ViewReport = asyncErrorHandler(async (req: Request, res: Response) => {
  const { page, action, sortFilters, contentType, countOfReports } =
    req.query as unknown as z.infer<typeof viewReportInputSchema>;
  const skipCount = (Number(page) - 1) * MAX_REPORT_FETCH_LIMIT;
  const query = getQuery({ action, contentType });
  const sortOptions = getSortOptions({
    sortFilters,
    countOfReports,
  });
  const [result, totalDocuments] = await Promise.all([
    Report.find(query)
      .sort(sortOptions)
      .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
      .lean()
      .skip(skipCount)
      .limit(MAX_REPORT_FETCH_LIMIT),
    Report.countDocuments(query)
      .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
      .lean()
      .exec(),
  ]);
  const totalReports = Math.ceil(
    Number(totalDocuments) / MAX_REPORT_FETCH_LIMIT
  );
  const hasMore = totalReports > Number(page);
  return res
    .status(SUCCESS_CODES.OK)
    .json({ data: { result, totalDocuments, hasMore } });
});

export default ViewReport;
