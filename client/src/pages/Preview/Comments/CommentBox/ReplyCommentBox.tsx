import { Avatar, Button } from '@nextui-org/react';
import { BiUpvote, BiDownvote } from 'react-icons/bi';
import { BsReply, BsThreeDots } from 'react-icons/bs';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { CiEdit } from 'react-icons/ci';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { IComment } from '@/types/comments';
import { monthNames } from '@/constants/shared';
import { ReportModal } from '@/components/ReportModal/ReportModal';
import { useAuth } from '@/hooks/useAuth';
import { useComments } from '@/hooks/useComments';
import { cn } from '@/lib/utils';

export default function ReplyCommentBox({
  replyCommentData,
  parentId,
}: {
  replyCommentData: IComment;
  parentId: string;
}) {
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const {
    authState: { userId },
  } = useAuth();
  const {
    message,
    userId: { username, _id },
    timestamp,
    commentId,
  } = replyCommentData;
  const [textMessage, setTextMessage] = useState<string>(message);
  const isMutable: boolean = userId ? userId === _id : false;
  const editClasses = isEditing ? 'bg-white' : 'bg-[#F2F3F4]';

  const { handleDeleteComment, handleEditComment } = useComments(
    'REPLIES',
    parentId
  );

  const date = new Date(timestamp);
  const day = date.getUTCDate();
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();

  return (
    <div
      className="p-4 flex flex-row gap-x-4"
      onMouseEnter={() => setIsHidden(true)}
      onMouseLeave={() => setIsHidden(false)}
    >
      <Avatar
        isBordered
        radius="sm"
        size="md"
        className="self-start"
        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
      />

      <div className="w-full flex flex-col gap-y-4">
        <div className="w-full self-start bg-[#F2F3F4] p-2 rounded-xl flex flex-col gap-y-2">
          <div className="flex flex-row justify-between">
            <span className="font-medium">{username}</span>
            <span className="text-sm opacity-55">
              {monthNames[month]} {day}, {year}
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
              <BiUpvote className="self-center text-lg" />
              <span className="self-center">2</span>
              <BiDownvote className="self-center text-lg" />
            </span>
            <span className="self-center flex flex-row gap-x-2">
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
    </div>
  );
}
