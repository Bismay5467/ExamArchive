// import ReplyCommentBox from './CommentBox/ReplyCommentBox';
import { useEffect } from 'react';
import ParentCommentForm from './CommentForm/ParentCommentForm';
import ParentCommentBox from './CommentBox/ParentCommentBox';
import { useComments } from '@/hooks/useComments';
import { IComment } from '@/types/comments';
import CommentShimmer from '../Shimmer/Shimmer';

export default function Comments() {
  const {
    response,
    setStartFetching,
    mutations,
    isLoading,
    setSize,
    isValidating,
    isLastPage,
  } = useComments('COMMENTS');

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      isLoading ||
      isValidating
    ) {
      return;
    }
    if (!isLastPage) setSize((prev) => prev + 1);
  };

  useEffect(() => {
    setStartFetching(true);
  }, []);
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading]);

  const commentData = response ? [...response] : [];
  const reducedCommentData = commentData
    .map(({ data }) => data)
    .map(({ comments }) => comments);

  const commentList: Array<IComment> | undefined = reducedCommentData
    ? [].concat(...reducedCommentData)
    : [];

  return (
    <div className="mt-20 flex flex-col gap-y-4 p-4 min-h-[600px] font-natosans">
      <ParentCommentForm handleCreateComment={mutations.handleCreateComment} />
      {commentList.map((comment) => (
        <ParentCommentBox
          key={comment.commentId}
          commentData={comment}
          commentMutations={mutations}
        />
      ))}
      {(isLoading || isValidating) && !isLastPage && <CommentShimmer />}
      {isLastPage && (
        <p className="text-slate-400 font-medium cursor-pointer w-fit self-center">
          End of disscussion...
        </p>
      )}
    </div>
  );
}
