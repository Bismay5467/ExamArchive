// import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite';
// import { useAuth } from '@/hooks/useAuth';
// import { getFilesForFolderNameObj } from '@/utils/axiosReqObjects';

// export default function BookmarkFileView({
//   folderId,
// }: {
//   folderId: string | undefined;
// }) {
//   const {
//     authState: { jwtToken },
//   } = useAuth();
//   const getKey: SWRInfiniteKeyLoader = (pageIndex, previousPageData) => {
//     // TODO: Content of previousPageData needs further testing

//     if (previousPageData && !previousPageData.hasMore) return null;
//     if (!folderId) return null;
//     return getFilesForFolderNameObj(
//       'BOOKMARK',
//       pageIndex + 1,
//       folderId,
//       jwtToken
//     );
//   };

//   const { data: response, setSize, isLoading } = useSWRInfinite(getKey);

//   return <div>BookmarkFileView</div>;
// }

export default function BookmarkFileView() {
  return <div>BookmarkFileView</div>;
}
