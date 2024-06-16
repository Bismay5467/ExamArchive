import { useEffect } from 'react';
// import BookmarkFileView from './BookmarkFileView/BookmarkFileView';
import useFiles from '@/hooks/useFiles';

export default function Bookmarks() {
  const { response, setStartFetching } = useFiles('BOOKMARK');

  const folderResults = response ? [...response] : [];
  const reducedFolderResults = folderResults
    .map(({ data }) => data)
    .map(({ files }) => files);

  const folderNames = reducedFolderResults
    ? [].concat(...reducedFolderResults)
    : [];

  useEffect(() => {
    setStartFetching(true);
  }, []);

  return (
    <div className="flex flex-col gap-y-4">
      {folderNames.map(({ _id, name }) => (
        <p
          key={_id}
          className="p-4 border-2 border-gray-400 cursor-pointer"
          role="presentation"
        >
          {name}
        </p>
      ))}
      {/* <BookmarkFileView folderId="666b9ce4eb6e1fcf6ec3cd85" /> */}
    </div>
  );
}
