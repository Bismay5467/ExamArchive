// import ReplyCommentBox from './CommentBox/ReplyCommentBox';
import { useEffect } from 'react';
import ParentCommentForm from './CommentForm/ParentCommentForm';
import ParentCommentBox from './CommentBox/ParentCommentBox';
import { useComments } from '@/hooks/useComments';
import { IComment } from '@/types/comments';
import Skeleton from './Skeleton/Skeleton';

export default function Comments() {
  const { response, setStartFetching, mutations, isLoading } =
    useComments('COMMENTS');

  useEffect(() => {
    setStartFetching(true);
  }, []);

  const commentData = response ? [...response] : [];
  const reducedCommentData = commentData
    .map(({ data }) => data)
    .map(({ comments }) => comments);

  const commentList: Array<IComment> | undefined = reducedCommentData
    ? [].concat(...reducedCommentData)
    : [];

  return (
    <div className="mt-8 flex flex-col gap-y-4 p-8 min-h-[600px]">
      <ParentCommentForm handleCreateComment={mutations.handleCreateComment} />
      {isLoading && <Skeleton />}
      {commentList.map((comment) => (
        <ParentCommentBox
          key={comment.commentId}
          commentData={comment}
          commentMutations={mutations}
        />
      ))}
    </div>
  );
}
