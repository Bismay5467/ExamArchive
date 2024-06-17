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
import {
  BiUpvote,
  BiSolidUpvote,
  BiSolidDownvote,
  BiDownvote,
} from 'react-icons/bi';
import { BsReply } from 'react-icons/bs';
import { MdReportProblem } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { CiEdit } from 'react-icons/ci';
import React, { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { IComment, ICommentMutations } from '@/types/comments';
import { monthNames } from '@/constants/shared';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import ReportModal from '@/components/ReportModal/ReportModal';
import WarningModal from '@/components/WarningModal/WarningModal';

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
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [toDelete, setToDelete] = useState<boolean>(false);
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
  const editClasses = isEditing ? 'bg-white' : 'bg-[#F2F3F4]';
  const iconClasses =
    'text-xl text-default-500 pointer-events-none flex-shrink-0';

  useEffect(() => {
    if (toDelete) {
      handleDeleteComment(commentId);
      setOptimisticReplyCount((prev) => prev - 1);
    }
  }, [toDelete]);

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

  return (
    <div className="p-4 flex flex-row gap-x-4">
      <Avatar
        isBordered
        radius="sm"
        size="md"
        className="self-start mt-2"
        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
      />

      <div className="w-full flex flex-col gap-y-4">
        <div className="w-full self-start bg-[#F2F3F4] p-2 rounded-xl flex flex-col gap-y-2">
          <div className="flex flex-row justify-between">
            <span className="font-medium self-center">{username}</span>
            <span className="flex flex-row gap-x-3">
              <span className="text-sm self-center opacity-55">
                {isEdited && '[edited]'} {monthNames[month]} {day}, {year}
              </span>
              <Dropdown onOpenChange={(isOpen) => setShowMenu(isOpen)}>
                <DropdownTrigger>
                  <button
                    className="text-gray-500 w-5 h-5 self-center focus:outline-none"
                    type="button"
                  >
                    <span className="sr-only hidden">Open main menu</span>
                    <div className="block w-3 relative transform">
                      <span
                        aria-hidden="true"
                        className={`block absolute h-0.5 w-4 bg-current transform transition duration-500 ease-in-out ${showMenu ? 'rotate-45' : '-translate-y-1.5'}`}
                      />
                      <span
                        aria-hidden="true"
                        className={`block absolute  h-0.5 w-4 bg-current   transform transition duration-500 ease-in-out ${showMenu ? 'opacity-0' : ''}`}
                      />
                      <span
                        aria-hidden="true"
                        className={`block absolute  h-0.5 w-4 bg-current transform  transition duration-500 ease-in-out ${showMenu ? '-rotate-45' : 'translate-y-1.5'}`}
                      />
                    </div>
                  </button>
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
                      <MdReportProblem
                        className={cn(iconClasses, 'text-danger')}
                      />
                    }
                    onClick={onReportOpen}
                  >
                    Report
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
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
            <span
              className="self-center flex flex-row gap-x-2 cursor-pointer"
              onClick={() => setIsReplying(true)}
              role="presentation"
            >
              <BsReply className="text-xl" /> Reply
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
