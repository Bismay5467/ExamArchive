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
  searchParams: string;
}) => {
  const tags = searchParams.split(',');
  const query = {
    tags: { $in: tags.map((tag) => new RegExp(`^${tag}$`, 'i')) },
    isFlagged: false,
  };
  Object.assign(query, {
    ...(examType && { examType: { $in: examType } }),
    ...(subjectName && { subjectName }),
    ...(year && { year: { $in: year } }),
  });
  return query;
};
export const getSortOrder = ({
  sortFilter,
}: {
  sortFilter?: TUserSortFilter;
}) => {
  const sortOrder =
    sortFilter === 'MOST VIEWS'
      ? { 'noOfViews.count': 'desc' }
      : { updatedAt: 'desc' };
  return sortOrder;
};

export const getProjections = () => ({
  uploadedBy: 0,
  file: 0,
  rating: 0,
  isFlagged: 0,
  'noOfViews.userIds': 0,
  'noOfDownloads.userIds': 0,
});
