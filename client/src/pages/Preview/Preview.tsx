import { useState } from 'react';
import Comments from './Comments/Comments';
import PreviewContent from './PreviewContent/PreviewContent';

export default function Preview() {
  const [showComment, setShowComment] = useState<boolean>(false);
  const handleClick = () => {
    setShowComment(true);
  };
  return (
    <section className="min-h-[600px] max-w-[1250px] bg-white p-4 mx-auto">
      <PreviewContent handleClick={handleClick} />
      <div id="disscussion-forum">{showComment && <Comments />}</div>
    </section>
  );
}
