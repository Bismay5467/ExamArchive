// import ReplyCommentBox from './CommentBox/ReplyCommentBox';
import ParentCommentForm from './CommentForm/ParentCommentForm';
import ParentCommentBox from './CommentBox/ParentCommentBox';
import { useComments } from '@/hooks/useComments';
import { IComment } from '@/types/comments';

export default function Comments() {
  const { response } = useComments('COMMENTS');

  const commentData = response ? [...response] : [];
  const reducedCommentData = commentData
    .map(({ data }) => data)
    .map(({ comments }) => comments);

  const commentList: Array<IComment> | undefined = reducedCommentData
    ? [].concat(...reducedCommentData)
    : [];

  return (
    <div className="mt-8 flex flex-col gap-y-4 p-8 min-h-[600px]">
      <ParentCommentForm />
      {commentList?.map((val) => (
        <ParentCommentBox key={val.commentId} commentData={val} />
      ))}
    </div>
  );
}
