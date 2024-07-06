import { useState } from 'react';
import { FaRegComments } from 'react-icons/fa';
import { Button } from '@nextui-org/react';
import Comments from './Comments/Comments';
import PreviewContent from './PreviewContent/PreviewContent';

export default function Preview() {
  const [showComments, setShowComments] = useState<boolean>(false);
  return (
    <section className="min-h-[600px] max-w-[1250px] bg-white p-4 mx-auto">
      <PreviewContent />
      {showComments === false && (
        <Button
          variant="bordered"
          color="default"
          radius="sm"
          className="w-[100%] font-natosans py-3 mt-8 text-medium"
          onClick={() => setShowComments(true)}
          startContent={<FaRegComments className="text-xl" />}
        >
          Load Discussions
        </Button>
      )}
      {showComments === true && <Comments />}
    </section>
  );
}
