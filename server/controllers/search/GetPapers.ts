import { MAX_SEARCH_RESULT_FETCH_LIMIT } from '../../constants/constants/search';
import { MONGO_READ_QUERY_TIMEOUT } from '../../constants/constants/shared';
import { Question } from '../../models';
import { TSearchParams } from '../../types/search/types';
import {
  getProjections,
  getQuery,
  getSortOrder,
} from '../../utils/search/getter';

const GetPapers = async (params: TSearchParams) => {
  const { filter, searchParams, sortFilter, page } = params;
  const skipCount = (page - 1) * MAX_SEARCH_RESULT_FETCH_LIMIT;
  const query = getQuery({ searchParams, filter });
  const sortOrder = getSortOrder({ sortFilter });
  const project = getProjections();

  const searchResults = await Question.aggregate(
    [
      { $match: query },
      { $sort: sortOrder },
      { $project: project },
      { $skip: skipCount },
      { $limit: MAX_SEARCH_RESULT_FETCH_LIMIT },
    ],
    { allowDiskUse: true, maxTimeMS: MONGO_READ_QUERY_TIMEOUT, lean: true }
  );

  return searchResults;
};

export default GetPapers;
