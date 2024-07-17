import { useState } from 'react';
import { FaRegComments } from 'react-icons/fa';
import { Button, Skeleton } from '@nextui-org/react';
import Comments from './Comments/Comments';
import PreviewContent from './PreviewContent/PreviewContent';

export default function Preview() {
  const [showComments, setShowComments] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const setLoading = (val: boolean) => {
    setIsLoading(val);
  };
  return (
    <section className="min-h-[600px] max-w-[1250px] bg-white p-4 mx-auto">
      <PreviewContent setLoading={setLoading} />
      {showComments === false && isLoading === true && (
        <Skeleton className="h-10 w-[100%] rounded-lg mt-20" />
      )}
      {showComments === false && isLoading === false && (
        <Button
          variant="bordered"
          color="default"
          radius="sm"
          className="w-full font-natosans py-3 mt-10 text-medium"
          onClick={() => setShowComments(true)}
          startContent={<FaRegComments className="text-xl" />}
        >
          Load Discussions
        </Button>
      )}
      {showComments === true && isLoading === false && <Comments />}
    </section>
  );
}
