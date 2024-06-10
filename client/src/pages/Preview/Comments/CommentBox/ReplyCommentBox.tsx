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
import { useState } from 'react';

export default function ReplyCommentBox() {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  return (
    <div
      className="p-4 flex flex-row gap-x-4"
      onMouseEnter={() => setShowDropDown(true)}
      onMouseLeave={() => setShowDropDown(false)}
    >
      <Avatar
        isBordered
        radius="sm"
        size="md"
        className="self-start w-[50px]"
        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
      />

      <div className="flex flex-col gap-y-4">
        <div className="self-start bg-[#F2F3F4] p-2 rounded-xl flex flex-col gap-y-2">
          <div className="flex flex-row justify-between">
            <span className="font-medium">Jane Doe</span>
            <span className="text-sm opacity-55">May 27, 2025</span>
          </div>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. At accusamus
          dicta dolorum? Sint culpa enim quas laudantium, dicta sit ratione
          provident dignissimos quaerat aliquam. Tenetur iure quaerat
          consequuntur ex debitis!
        </div>
        <div className="flex flex-row gap-x-4 text-sm opacity-55">
          <span className="self-center flex flex-row gap-x-2">
            <BiUpvote className="self-center text-lg" />
            <span className="self-center">2</span>
            <BiDownvote className="self-center text-lg" />
          </span>
          <span className="self-center flex flex-row gap-x-2">
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
    </div>
  );
}
