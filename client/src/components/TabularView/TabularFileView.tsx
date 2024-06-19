import { useParams } from 'react-router-dom';

export default function TabularFileView() {
  const { folderId } = useParams();

  return <div>BookmarkFileView for {folderId}</div>;
}
