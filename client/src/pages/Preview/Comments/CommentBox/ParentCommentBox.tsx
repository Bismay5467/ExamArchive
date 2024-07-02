/* eslint-disable no-nested-ternary */
import {
  Avatar,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
} from '@nextui-org/react';
import { BiSolidLike, BiSolidDislike, BiLike, BiDislike } from 'react-icons/bi';
import { FaFlag } from 'react-icons/fa';
import { BsReply } from 'react-icons/bs';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { CiEdit } from 'react-icons/ci';
import { FaEllipsisVertical, FaRegComment } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import { IComment, ICommentMutations } from '@/types/comments';
import { monthNames } from '@/constants/shared';
import { useAuth } from '@/hooks/useAuth';
import ReportModal from '@/components/ReportModal/ReportModal';
import { useComments } from '@/hooks/useComments';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import ReplyCommentBox from './ReplyCommentBox';
import ReplyCommentForm from '../CommentForm/ReplyCommentForm';
import WarningModal from '@/components/WarningModal/WarningModal';
import CommentShimmer from '../../Shimmer/Shimmer';

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
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [toDelete, setToDelete] = useState<boolean>(false);
  const {
    isOpen: isReportOpen,
    onOpen: onReportOpen,
    onClose: onReportClose,
    onOpenChange: onReportOpenChange,
  } = useDisclosure();
  const {
    isOpen: isWarningOpen,
    onOpen: onWarningOpen,
    onClose: onWarningClose,
    onOpenChange: onWarningOpenChange,
  } = useDisclosure();
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
  const {
    response,
    setStartFetching,
    mutations,
    isLoading,
    isValidating,
    isLastPage,
    setSize,
  } = useComments('REPLIES', commentId);
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
    else if (toDelete) handleDeleteComment(commentId);
  }, [isReplying, showReplies, toDelete]);

  const replyData = response ? [...response] : [];
  const reducedReplyData = replyData
    .map(({ data }) => data)
    .map(({ comments }) => comments);

  const replyList: Array<IComment> = reducedReplyData
    ? [].concat(...reducedReplyData)
    : [];

  const isMutable: string = userId
    ? userId === _id
      ? ''
      : 'hidden'
    : 'hidden';
  const editClasses = isEditing ? 'bg-slate-100' : '';

  const date = new Date(timestamp);
  const day = date.getUTCDate();
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();
  const iconClasses =
    'text-xl text-default-500 pointer-events-none flex-shrink-0';

  return (
    <div>
      <div className=" border-gray-300 p-4 flex flex-col gap-y-4">
        <span className="flex flex-row justify-between">
          <span className="flex flex-row gap-x-4">
            <Avatar
              isBordered
              radius="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              className="h-7 w-7 sm:h-9 sm:w-9"
            />
            <span className="self-center font-medium sm:text-xl">
              {username}
            </span>
          </span>
          <span className="flex flex-row gap-x-2">
            <span className="text-xs self-center opacity-55 sm:text-sm">
              {isEdited && '[edited]'} {monthNames[month]} {day}, {year}
            </span>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="light"
                  size="sm"
                  isIconOnly
                  className="self-center"
                >
                  <FaEllipsisVertical className="text-lg" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem
                  key="edit"
                  startContent={<CiEdit className={iconClasses} />}
                  onClick={() => setIsEditing(true)}
                  className={isMutable}
                >
                  Edit
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  startContent={<RiDeleteBin6Line className={iconClasses} />}
                  onClick={onWarningOpen}
                  className={isMutable}
                >
                  Delete
                </DropdownItem>
                <DropdownItem
                  key="report"
                  color="danger"
                  className="text-danger"
                  startContent={
                    <FaFlag className="text-lg pointer-events-none" />
                  }
                  onClick={onReportOpen}
                >
                  Report
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
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
                  <BiSolidLike className="self-center text-lg cursor-pointer text-red-500" />
                ) : (
                  <BiLike className="self-center text-lg cursor-pointer" />
                )}
              </span>
              <span className="self-center">{upvoteCount}</span>
              <span onClick={handleDownVote} role="presentation">
                {hasDownVoted ? (
                  <BiSolidDislike className="self-center text-lg cursor-pointer text-red-500" />
                ) : (
                  <BiDislike className="self-center text-lg cursor-pointer" />
                )}
              </span>
              <span className="self-center">{downVoteCount}</span>
            </span>
            {optimisticReplyCount !== 0 && (
              <span
                className="self-center flex flex-row gap-x-2 cursor-pointer text-xs sm:text-sm"
                onClick={() => {
                  setShowReplies((prev) => !prev);
                }}
                role="presentation"
              >
                <FaRegComment className="self-center sm:text-lg" />{' '}
                {showReplies
                  ? 'Hide Replies'
                  : `Show ${optimisticReplyCount} Replies`}
              </span>
            )}
            <span
              className="self-center flex flex-row gap-x-2 cursor-pointer text-xs sm:text-sm"
              onClick={() => setIsReplying(true)}
              role="presentation"
            >
              <BsReply className="text-lg sm:text-xl" /> Reply
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
        {(isLoading || isValidating) && !isLastPage && !isReplying && (
          <CommentShimmer />
        )}
        {showReplies && !isLoading && !isValidating && !isLastPage && (
          <button
            className="text-blue-600 font-semibold cursor-pointer w-fit self-center text-sm"
            type="button"
            onClick={() => setSize((prev) => prev + 1)}
          >
            Load more replies...
          </button>
        )}
      </div>
      <ReportModal
        contentType="COMMENT"
        isOpen={isReportOpen}
        onClose={onReportClose}
        onOpenChange={onReportOpenChange}
        postId={commentId}
      />
      <WarningModal
        actionText="Delete"
        isOpen={isWarningOpen}
        onClose={onWarningClose}
        onOpenChange={onWarningOpenChange}
        setEvent={setToDelete}
        actionType="comment"
      />
    </div>
  );
}
