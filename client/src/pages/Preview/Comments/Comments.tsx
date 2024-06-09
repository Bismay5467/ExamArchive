// import ParentCommentBox from './CommentBox/ParentCommentBox';
import ReplyCommentBox from './CommentBox/ReplyCommentBox';
// import CommentForm from './CommentForm/CommentForm';

export default function Comments() {
  return (
    <div className="mt-8 border-2 border-red-400 rounded-lg p-8 min-h-[600px]">
      <ReplyCommentBox />
    </div>
  );
}
