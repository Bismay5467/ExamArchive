import { Avatar, Button } from '@nextui-org/react';
import { BiUpvote, BiDownvote } from 'react-icons/bi';
import { BsReply, BsThreeDots } from 'react-icons/bs';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { CiEdit } from 'react-icons/ci';
import { FaRegComment } from 'react-icons/fa6';
import { useState } from 'react';
import { IComment } from '@/types/comments';
import { monthNames } from '@/constants/shared';
import { useAuth } from '@/hooks/useAuth';
import { ReportModal } from '@/components/ReportModal/ReportModal';
import { useComments } from '@/hooks/useComments';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import ReplyCommentBox from './ReplyCommentBox';
import ReplyCommentForm from '../CommentForm/ReplyCommentForm';
// TODO: BiSolidUpvote & BiSolidDownvote (for animation)

export default function ParentCommentBox({
  commentData,
}: {
  commentData: IComment;
}) {
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const {
    authState: { userId },
  } = useAuth();
  const {
    message,
    userId: { username, _id },
    replyCount,
    timestamp,
    commentId,
  } = commentData;
  const [textMessage, setTextMessage] = useState<string>(message);
  const { handleDeleteComment, handleEditComment } = useComments('COMMENTS');
  const { response } = useComments('REPLIES', commentId);

  const replyData = response ? [...response] : [];
  const reducedReplyData = replyData
    .map(({ data }) => data)
    .map(({ comments }) => comments);

  const replyList: Array<IComment> | undefined = reducedReplyData
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
            {monthNames[month]} {day}, {year}
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
              <BiUpvote className="self-center text-lg cursor-pointer" />
              <span className="self-center">2</span>
              <BiDownvote className="self-center text-lg cursor-pointer" />
            </span>
            {replyCount !== 0 && (
              <span className="self-center flex flex-row gap-x-2 cursor-pointer">
                <FaRegComment className="self-center text-lg" /> Show{' '}
                {replyCount} Replies
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
            parentId={commentId}
            setIsReplying={setIsReplying}
          />
        )}
        {replyList?.map((val) => (
          <ReplyCommentBox key={val.commentId} replyCommentData={val} />
        ))}
      </div>
    </div>
  );
}
