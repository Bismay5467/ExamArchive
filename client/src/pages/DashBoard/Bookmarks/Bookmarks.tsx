import useSWR from 'swr';
import { useAuth } from '@/hooks/useAuth';
import { getFolderNameObj } from '@/utils/axiosReqObjects/folder';
import BookmarkFileView from './BookmarkFileView/BookmarkFileView';

export default function Bookmarks() {
  const {
    authState: { jwtToken },
  } = useAuth();

  const { data: response } = useSWR(getFolderNameObj('BOOKMARK', jwtToken));
  const folderNames: Array<{ _id: string; name: string }> =
    response?.data?.data;

  return (
    <div className="flex flex-col gap-y-4">
      {folderNames.map(({ _id, name }) => (
        <span key={_id} className="p-4 border-2 border-gray-400 cursor-pointer">
          {name}
        </span>
      ))}
      <BookmarkFileView />
    </div>
  );
}
