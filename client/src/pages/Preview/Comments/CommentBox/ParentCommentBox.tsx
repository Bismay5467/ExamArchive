import { Avatar, Button } from '@nextui-org/react';
import {
  BiUpvote,
  BiSolidUpvote,
  BiSolidDownvote,
  BiDownvote,
} from 'react-icons/bi';
import { BsReply, BsThreeDots } from 'react-icons/bs';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { CiEdit } from 'react-icons/ci';
import { FaRegComment } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import { IComment, ICommentMutations } from '@/types/comments';
import { monthNames } from '@/constants/shared';
import { useAuth } from '@/hooks/useAuth';
import { ReportModal } from '@/components/ReportModal/ReportModal';
import { useComments } from '@/hooks/useComments';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import ReplyCommentBox from './ReplyCommentBox';
import ReplyCommentForm from '../CommentForm/ReplyCommentForm';
import Skeleton from '../Skeleton/Skeleton';

export default function ParentCommentBox({
  commentData,
  commentMutations: {
    handleDeleteComment,
    handleEditComment,
    handleUpvoteComment,
    handleDownVoteComment,
  },
}: {
  commentData: IComment;
  commentMutations: ICommentMutations;
}) {
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const {
    authState: { userId },
  } = useAuth();

  const {
    message,
    userId: { username, _id },
    replyCount,
    timestamp,
    commentId,
    isEdited,
    upVotes: { count: upvoteCount, hasUpVoted },
    downVotes: { count: downVoteCount, hasDownVoted },
  } = commentData;
  const [textMessage, setTextMessage] = useState<string>(message);
  const [optimisticReplyCount, setOptimisticReplyCount] =
    useState<number>(replyCount);
  const { response, setStartFetching, mutations, isLoading } = useComments(
    'REPLIES',
    commentId
  );
  const handleUpVote = async () => {
    if (hasUpVoted) {
      handleUpvoteComment(commentId, 'RETRACE');
      return;
    }
    if (hasDownVoted) await handleDownVoteComment(commentId, 'RETRACE');
    handleUpvoteComment(commentId, 'VOTE');
  };

  const handleDownVote = async () => {
    if (hasDownVoted) {
      handleDownVoteComment(commentId, 'RETRACE');
      return;
    }
    if (hasUpVoted) await handleUpvoteComment(commentId, 'RETRACE');
    handleDownVoteComment(commentId, 'VOTE');
  };

  useEffect(() => {
    if (isReplying || showReplies) setStartFetching(true);
  }, [isReplying, showReplies]);

  const replyData = response ? [...response] : [];
  const reducedReplyData = replyData
    .map(({ data }) => data)
    .map(({ comments }) => comments);

  const replyList: Array<IComment> = reducedReplyData
    ? [].concat(...reducedReplyData)
    : [];

  const isMutable: boolean = userId ? userId === _id : false;
  const editClasses = isEditing ? 'bg-slate-100' : '';

  const date = new Date(timestamp);
  const day = date.getUTCDate();
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();

  return (
    <div>
      <div
        className=" border-gray-300 p-4 flex flex-col gap-y-4"
        onMouseEnter={() => setIsHidden(true)}
        onMouseLeave={() => setIsHidden(false)}
      >
        <span className="flex flex-row justify-between">
          <span className="flex flex-row gap-x-4">
            <Avatar
              isBordered
              radius="md"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
            <span className="self-center text-xl font-medium">{username}</span>
          </span>
          <span className="text-sm opacity-55">
            {isEdited && '[edited]'} {monthNames[month]} {day}, {year}
          </span>
        </span>
        <Textarea
          value={textMessage}
          className={cn('w-full h-fit resize-none', editClasses)}
          disabled={!isEditing}
          onChange={(e) => setTextMessage(e.target.value)}
        />
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-x-4 text-sm opacity-55">
            <span className="self-center flex flex-row gap-x-2">
              <span onClick={handleUpVote} role="presentation">
                {hasUpVoted ? (
                  <BiSolidUpvote className="self-center text-lg cursor-pointer text-red-600" />
                ) : (
                  <BiUpvote className="self-center text-lg cursor-pointer" />
                )}
              </span>
              <span className="self-center">{upvoteCount}</span>
              <span onClick={handleDownVote} role="presentation">
                {hasDownVoted ? (
                  <BiSolidDownvote className="self-center text-lg cursor-pointer text-red-600" />
                ) : (
                  <BiDownvote className="self-center text-lg cursor-pointer" />
                )}
              </span>
              <span className="self-center">{downVoteCount}</span>
            </span>
            {optimisticReplyCount !== 0 && (
              <span
                className="self-center flex flex-row gap-x-2 cursor-pointer"
                onClick={() => {
                  setShowReplies((prev) => !prev);
                }}
                role="presentation"
              >
                <FaRegComment className="self-center text-lg" />{' '}
                {showReplies
                  ? 'Hide Replies'
                  : `Show ${optimisticReplyCount} Replies`}
              </span>
            )}
            <span
              className="self-center flex flex-row gap-x-2 cursor-pointer"
              onClick={() => setIsReplying(true)}
              role="presentation"
            >
              <BsReply className="text-xl" /> Reply
            </span>
            <span
              className={`self-center flex flex-row gap-x-4 ${isHidden ? 'visible' : 'invisible'}`}
            >
              {!isEditing && (
                <span
                  className="self-center flex flex-row gap-x-2 cursor-pointer"
                  onClick={() => setIsEditing(true)}
                  role="presentation"
                >
                  <CiEdit className="text-xl" /> Edit
                </span>
              )}
              <span
                className="self-center flex flex-row gap-x-2 cursor-pointer"
                onClick={() => handleDeleteComment(commentId)}
                role="presentation"
              >
                <RiDeleteBin6Line className="text-lg" /> Delete
              </span>
              {!isMutable && (
                <ReportModal
                  contentType="COMMENT"
                  postId={commentId}
                  endContent={<BsThreeDots />}
                  className="-translate-x-2"
                />
              )}
            </span>
          </div>
          {isEditing && (
            <div className="flex flex-row gap-x-2">
              <span className="self-center mr-6 text-sm opacity-60 font-medium">
                Preview
              </span>
              <Button
                color="default"
                variant="flat"
                className="font-semibold mr-2 opacity-60"
                size="sm"
                onClick={() => {
                  setTextMessage(message);
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button
                color="success"
                className="font-semibold text-white text-medium tracking-wide"
                type="submit"
                size="sm"
                onClick={() => {
                  handleEditComment(commentId, textMessage);
                  setIsEditing(false);
                }}
              >
                Edit
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="pl-8">
        {isReplying && (
          <ReplyCommentForm
            setIsReplying={setIsReplying}
            setShowReplies={setShowReplies}
            setOptimisticReplyCount={setOptimisticReplyCount}
            handleCreateComment={mutations.handleCreateComment}
          />
        )}
        {isLoading && !isReplying && <Skeleton />}
        {showReplies &&
          replyList.map((val) => (
            <ReplyCommentBox
              key={val.commentId}
              replyCommentData={val}
              replyMutations={mutations}
              setOptimisticReplyCount={setOptimisticReplyCount}
              setIsReplying={setIsReplying}
            />
          ))}
      </div>
    </div>
  );
}
