import { FILE_UPLOAD_STATUS } from '../../constants/constants/upload';
import { TUserSortFilter } from '../../types/search/types';

export const getQuery = ({
  subjectName,
  year,
  examType,
  searchParams,
}: {
  subjectName?: string;
  year?: Array<number>;
  examType?: Array<string>;
  searchParams: Array<string>;
}) => {
  const tags = searchParams.filter(Boolean);
  const query = {
    isFlagged: false,
    status: FILE_UPLOAD_STATUS.UPLOADED,
  };
  Object.assign(query, {
    ...(tags.length > 0 && {
      tags: { $in: tags.map((tag) => new RegExp(tag, 'i')) },
    }),
    ...(examType && examType.length > 0 && { examType: { $in: examType } }),
    ...(subjectName && { subjectName: new RegExp(`^${subjectName}$`, 'i') }),
    ...(year && year.length > 0 && { year: { $in: year } }),
  });
  return query;
};
export const getSortOrder = ({
  sortFilter,
}: {
  sortFilter?: TUserSortFilter;
}) => {
  const sortOrder =
    sortFilter === 'Most Views'
      ? { 'noOfViews.count': 'desc' }
      : { createdAt: 'desc' };
  return sortOrder;
};

export const getProjections = () => ({
  file: 0,
  rating: 0,
  isFlagged: 0,
  'noOfViews.userIds': 0,
  'noOfDownloads.userIds': 0,
});
