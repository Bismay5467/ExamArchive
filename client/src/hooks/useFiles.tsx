import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite';
import { useState } from 'react';
import { IAction } from '@/types/folder';
import { getFilesDataObj } from '@/utils/axiosReqObjects';
import { useAuth } from './useAuth';

export default function useFiles(action: IAction, parentId: string = '') {
  const {
    authState: { jwtToken },
  } = useAuth();
  const [startFetching, setStartFetching] = useState(false);

  const getKey: SWRInfiniteKeyLoader = (pageIndex, previousPageData) => {
    // TODO: Content of previousPageData needs further testing

    if (previousPageData && !previousPageData.hasMore) return null;
    if (!startFetching) return null;
    return getFilesDataObj(
      { action, page: pageIndex.toString(), parentId },
      jwtToken
    );
  };

  const { data: response, setSize, isLoading } = useSWRInfinite(getKey);

  return { response, setSize, isLoading, setStartFetching };
}
