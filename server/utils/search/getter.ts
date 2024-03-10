import { TUserFilter, TUserSortFilter } from '../../types/search/types';

export const getQuery = ({
  filter,
  searchParams,
}: {
  filter?: Partial<TUserFilter>;
  searchParams: Array<string>;
}) => {
  const query = { tags: { $in: searchParams }, isFlagged: false };
  if (filter) {
    const { institutionName, subjectName, subjectCode, examType } = filter;
    if (examType) Object.assign(query, { examType: { $in: examType } });
    if (subjectCode) Object.assign(query, { subjectCode });
    if (subjectName) Object.assign(query, { subjectName });
    if (institutionName) {
      Object.assign(query, { institutionName: { $in: institutionName } });
    }
  }
  return query;
};
export const getSortOrder = ({
  sortFilter,
}: {
  sortFilter?: TUserSortFilter;
}) => {
  const sortOrder = {};
  if (sortFilter === 'MOST RECENT') {
    Object.assign(sortOrder, { updatedAt: 'desc' });
  } else if (sortFilter === 'MOST VIEWS') {
    Object.assign(sortOrder, { 'noOfViews.count': 'desc' });
  }
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
