/* eslint-disable no-underscore-dangle */
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { viewReportsObj } from '@/utils/axiosReqObjects';
import { FilterSheet } from './FilterSheet/FilterSheet';
import ReportCard from './ReportCard/ReportCard';
import {
  IReportFilterFields,
  IReportPreview,
  TReportAction,
} from '@/types/report';

export default function ReportDisplay({ action }: { action: TReportAction }) {
  const {
    authState: { jwtToken },
  } = useAuth();
  const [reportFilters, setReportFilters] = useState<IReportFilterFields>({
    action,
  });

  const getKey: SWRInfiniteKeyLoader = (pageIndex, previousPageData) => {
    // TODO: Content of previousPageData needs further testing

    if (previousPageData && !previousPageData.data.hasMore) return null;
    return viewReportsObj(reportFilters, (pageIndex + 1).toString(), jwtToken);
  };
  const { data: response } = useSWRInfinite(getKey);

  const reportData = response ? [...response] : [];
  const reducedReportData = reportData
    .map(({ data }) => data)
    .map(({ data }) => data.result);

  const reportDataList: Array<IReportPreview> = reducedReportData
    ? [].concat(...reducedReportData)
    : [];
  return (
    <div className="max-w-[1200px] mx-auto">
      <FilterSheet action={action} setReportFilters={setReportFilters} />
      <div className="flex flex-col gap-y-8 justify-center mt-8 sm:px-24">
        {reportDataList.map((val) => (
          <ReportCard reportData={val} key={val._id} />
        ))}
      </div>
    </div>
  );
}
