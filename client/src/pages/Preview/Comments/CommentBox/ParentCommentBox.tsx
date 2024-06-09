import { Avatar } from '@nextui-org/react';
import { BiUpvote } from 'react-icons/bi';
import { BiDownvote } from 'react-icons/bi';
import { BsReply } from 'react-icons/bs';
import { FaRegComment } from 'react-icons/fa6';

//TODO: BiSolidUpvote & BiSolidDownvote (for animation)

export default function ParentCommentBox() {
  return (
    <div className=" border-gray-300 p-4 flex flex-col gap-y-4">
      <span className="flex flex-row justify-between">
        <span className="flex flex-row gap-x-4">
          <Avatar
            isBordered
            radius="md"
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          />
          <span className="self-center text-xl font-medium">Jane Doe</span>
        </span>
        <span className="text-sm opacity-55">May 27, 2025</span>
      </span>
      <div>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloremque
        illo libero asperiores est dolore harum illum ipsam laborum, reiciendis
        mollitia, consequuntur quae, debitis nemo animi aut nihil exercitationem
        totam cupiditate?
      </div>
      <div className="flex flex-row gap-x-4 text-sm opacity-55">
        <span className="flex flex-row gap-x-2">
          <BiUpvote className="self-center text-lg" />
          <span className="self-center">2</span>
          <BiDownvote className="self-center text-lg" />
        </span>
        <span className="flex flex-row gap-x-2">
          <FaRegComment className="self-center text-lg" /> Show 2 Replies
        </span>
        <span className="flex flex-row gap-x-2">
          <BsReply className="text-xl" /> Reply
        </span>
      </div>
    </div>
  );
}
