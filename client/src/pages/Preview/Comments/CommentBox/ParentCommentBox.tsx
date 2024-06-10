import {
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@nextui-org/react';
import { BiUpvote, BiDownvote } from 'react-icons/bi';
import { BsReply, BsThreeDots } from 'react-icons/bs';
import { FaRegComment } from 'react-icons/fa6';
import { useState } from 'react';

// TODO: BiSolidUpvote & BiSolidDownvote (for animation)

export default function ParentCommentBox() {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);

  return (
    <div
      className=" border-gray-300 p-4 flex flex-col gap-y-4"
      onMouseEnter={() => setShowDropDown(true)}
      onMouseLeave={() => setShowDropDown(false)}
    >
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
        <span className="self-center flex flex-row gap-x-2">
          <BiUpvote className="self-center text-lg cursor-pointer" />
          <span className="self-center">2</span>
          <BiDownvote className="self-center text-lg cursor-pointer" />
        </span>
        <span className="self-center flex flex-row gap-x-2 cursor-pointer">
          <FaRegComment className="self-center text-lg" /> Show 2 Replies
        </span>
        <span className="self-center flex flex-row gap-x-2 cursor-pointer">
          <BsReply className="text-xl" /> Reply
        </span>
        <Dropdown>
          <DropdownTrigger>
            <Button
              startContent={<BsThreeDots />}
              size="sm"
              className={`bg-transparent text-lg -translate-x-[10px] ${showDropDown ? 'visible' : 'invisible'}`}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="new" color="danger">
              Report
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}
