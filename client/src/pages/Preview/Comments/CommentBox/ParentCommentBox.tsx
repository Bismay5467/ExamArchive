/* eslint-disable no-nested-ternary */
import { Avatar, Button, useDisclosure } from '@nextui-org/react';
import { BiSolidLike, BiSolidDislike, BiLike, BiDislike } from 'react-icons/bi';
import { BsReply } from 'react-icons/bs';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { CiEdit } from 'react-icons/ci';
import { FaRegComment } from 'react-icons/fa6';
import { useEffect, useMemo, useState } from 'react';
import { IoFlagOutline } from 'react-icons/io5';
import { IComment, ICommentMutations, IDropDownProps } from '@/types/comments';
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
import CustomDropDown from '@/components/Dropdown';

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
  }, [isReplying, showReplies]);

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
  const iconClasses = 'text-xl pointer-events-none flex-shrink-0';

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    handleDeleteComment(commentId);
  };

  const dropdownMenu: IDropDownProps[] = useMemo(
    () => [
      {
        icon: <CiEdit className={iconClasses} />,
        value: 'Edit comment',
        action: handleEdit,
        itemClassName: isMutable,
      },
      {
        icon: <RiDeleteBin6Line className={iconClasses} />,
        value: 'Delete comment',
        action: onWarningOpen,
        itemClassName: isMutable,
      },
      {
        icon: <IoFlagOutline className="text-lg pointer-events-none" />,
        value: 'Report',
        action: onReportOpen,
      },
    ],
    []
  );

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
            <span className="self-center font-medium sm:text-medium">
              {username}
            </span>
          </span>
          <span className="flex flex-row gap-x-2">
            <span className="text-xs self-center opacity-55 sm:text-sm">
              {isEdited && '[edited]'} {monthNames[month]} {day}, {year}
            </span>
            <CustomDropDown menu={dropdownMenu} />
          </span>
        </span>
        <Textarea
          value={textMessage}
          className={cn('w-full h-fit resize-none', editClasses)}
          disabled={!isEditing}
          onChange={(e) => setTextMessage(e.target.value)}
        />
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-x-6 text-sm opacity-55">
            <span className="self-center flex flex-row gap-x-4">
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
              <Button
                color="default"
                variant="bordered"
                radius="sm"
                size="sm"
                onClick={() => {
                  setTextMessage(message);
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                type="submit"
                variant="bordered"
                radius="sm"
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
        eventHandler={handleDelete}
        actionType="comment"
      />
    </div>
  );
}
