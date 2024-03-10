import { MAX_REPORT_FETCH_LIMIT } from '../../constants/constants/report';
import { MONGO_READ_QUERY_TIMEOUT } from '../../constants/constants/shared';
import { Report } from '../../models';

const ViewReport = async ({ page = 1 }: { page: number }) => {
  const skipCount = (page - 1) * MAX_REPORT_FETCH_LIMIT;
  const query = { 'resolved.isResolved': false };
  const [result, totalDocuments] = await Promise.all([
    Report.find(query)
      .select({ resolved: 0 })
      .sort({ totalReport: 'desc', updatedAt: 'desc' })
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
  const hasMore = totalReports > page;
  return { result, totalDocuments, hasMore };
};

export default ViewReport;
