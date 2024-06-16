import { useEffect } from 'react';
import useFiles from '@/hooks/useFiles';

export default function BookmarkFileView({ folderId }: { folderId: string }) {
  const { setStartFetching } = useFiles('BOOKMARK', folderId);
  useEffect(() => {
    setStartFetching(true);
  }, []);

  //   console.log(response);

  return <div>BookmarkFileView</div>;
}
