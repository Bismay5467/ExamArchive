/* eslint-disable no-nested-ternary */
import { Avatar, Button, useDisclosure } from '@nextui-org/react';
import { BiSolidLike, BiSolidDislike, BiLike, BiDislike } from 'react-icons/bi';
import { BsReply } from 'react-icons/bs';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { CiEdit } from 'react-icons/ci';
import React, { useMemo, useState } from 'react';
import { IoFlagOutline, IoPersonOutline } from 'react-icons/io5';
import { Textarea } from '@/components/ui/textarea';
import { IComment, ICommentMutations, IDropDownProps } from '@/types/comments';
import { monthNames } from '@/constants/shared';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import ReportModal from '@/components/ReportModal/ReportModal';
import WarningModal from '@/components/WarningModal/WarningModal';
import CustomDropDown from '@/components/Dropdown';
import { getAvatar } from '@/constants/auth';

export default function ReplyCommentBox({
  replyCommentData,
  replyMutations: {
    handleDeleteComment,
    handleEditComment,
    handleUpvoteComment,
    handleDownVoteComment,
  },
  setIsReplying,
  setOptimisticReplyCount,
}: {
  replyCommentData: IComment;
  replyMutations: ICommentMutations;
  setIsReplying: React.Dispatch<React.SetStateAction<boolean>>;
  setOptimisticReplyCount: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const {
    authState: { userId },
  } = useAuth();
  const {
    message,
    userId: { username, _id },
    timestamp,
    commentId,
    isEdited,
    downVotes: { hasDownVoted, count: downVoteCount },
    upVotes: { hasUpVoted, count: upvoteCount },
  } = replyCommentData;
  const [textMessage, setTextMessage] = useState<string>(message);
  const isMutable: string = userId
    ? userId === _id
      ? ''
      : 'hidden'
    : 'hidden';
  const editClasses = isEditing ? 'bg-white' : 'bg-[#f7f7f7]';
  const iconClasses =
    'text-xl text-default-500 pointer-events-none flex-shrink-0';

  const date = new Date(timestamp);
  const day = date.getUTCDate();
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();

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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    handleDeleteComment(commentId);
    setOptimisticReplyCount((prev) => prev - 1);
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
    <div className="p-4 flex flex-row gap-x-4">
      <Avatar
        isBordered
        radius="sm"
        size="md"
        className="self-start mt-2 h-7 w-7 sm:h-9 sm:w-9"
        src={getAvatar(username)}
        fallback={<IoPersonOutline className="text-xl" />}
      />

      <div className="w-full flex flex-col gap-y-4">
        <div className="w-full self-start bg-[#f7f7f7] p-2 rounded-lg flex flex-col gap-y-2">
          <div className="flex flex-row justify-between">
            <span className="font-medium text-sm self-center sm:text-medium">
              {username}
            </span>
            <span className="flex flex-row gap-x-3">
              <span className="text-xs self-center opacity-55 sm:text-sm">
                {isEdited && '[edited]'} {monthNames[month]} {day}, {year}
              </span>
              <CustomDropDown menu={dropdownMenu} />
            </span>
          </div>
          <Textarea
            value={textMessage}
            className={cn('w-full h-fit resize-none', editClasses)}
            disabled={!isEditing}
            onChange={(e) => setTextMessage(e.target.value)}
          />
        </div>
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
