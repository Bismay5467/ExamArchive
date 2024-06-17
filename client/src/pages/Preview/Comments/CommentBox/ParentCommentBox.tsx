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
import { FaRegComment } from 'react-icons/fa6';
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
import Skeleton from '../Skeleton/Skeleton';
import WarningModal from '@/components/WarningModal/WarningModal';

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
  const [showMenu, setShowMenu] = useState<boolean>(false);
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
              radius="md"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
            <span className="self-center text-xl font-medium">{username}</span>
          </span>
          <span className="flex flex-row gap-x-2">
            <span className="text-sm self-center opacity-55">
              {isEdited && '[edited]'} {monthNames[month]} {day}, {year}
            </span>
            <Dropdown onOpenChange={(isOpen) => setShowMenu(isOpen)}>
              <DropdownTrigger>
                <button
                  className="text-gray-500 w-10 h-10 relative focus:outline-none bg-white"
                  type="button"
                >
                  <span className="sr-only">Open main menu</span>
                  <div className="block w-5 absolute left-1/2 top-1/2   transform  -translate-x-1/2 -translate-y-1/2">
                    <span
                      aria-hidden="true"
                      className={`block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${showMenu ? 'rotate-45' : '-translate-y-1.5'}`}
                    />
                    <span
                      aria-hidden="true"
                      className={`block absolute  h-0.5 w-5 bg-current   transform transition duration-500 ease-in-out ${showMenu ? 'opacity-0' : ''}`}
                    />
                    <span
                      aria-hidden="true"
                      className={`block absolute  h-0.5 w-5 bg-current transform  transition duration-500 ease-in-out ${showMenu ? '-rotate-45' : 'translate-y-1.5'}`}
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
          <Skeleton />
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
