import { Avatar } from '@nextui-org/react';

export default function ReplyCommentBox() {
  return (
    <div className="p-4 flex flex-row gap-x-4">
      <Avatar
        isBordered
        radius="sm"
        size="md"
        className="self-start w-[50px]"
        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
      />

      <div className="self-start bg-[#F2F3F4] p-2 rounded-xl flex flex-col gap-y-2">
        <div className="flex flex-row justify-between">
          <span className="font-medium">Jane Doe</span>
          <span className="text-sm opacity-55">May 27, 2025</span>
        </div>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. At accusamus
        dicta dolorum? Sint culpa enim quas laudantium, dicta sit ratione
        provident dignissimos quaerat aliquam. Tenetur iure quaerat consequuntur
        ex debitis!
      </div>
    </div>
  );
}
