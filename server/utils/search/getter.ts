import { TUserFilter, TUserSortFilter } from '../../types/search/types';

export const getQuery = ({
  filter,
  searchParams,
}: {
  filter?: Partial<TUserFilter>;
  searchParams: string;
}) => {
  const tags = searchParams.split(',');
  const query = {
    tags: { $in: tags.map((tag) => new RegExp(`^${tag}$`, 'i')) },
    isFlagged: false,
  };
  if (filter) {
    const { year, subjectName, subjectCode, examType } = filter;
    Object.assign(query, {
      ...(examType && { examType: { $in: examType } }),
      ...(subjectCode && { subjectCode }),
      ...(subjectName && { subjectName }),
      ...(year && { year: { $in: year } }),
    });
  }
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
