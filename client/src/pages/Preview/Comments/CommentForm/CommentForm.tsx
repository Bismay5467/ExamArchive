import { Textarea } from '@/components/ui/textarea';
import { FaCode } from 'react-icons/fa';
import { IoMdLink } from 'react-icons/io';
import { FaAt } from 'react-icons/fa';
import { Button } from '@nextui-org/react';

export default function CommentForm() {
  return (
    <div className="py-4 rounded-xl shadow-md flex flex-col gap-y-4">
      <Textarea
        placeholder="Type your comment here...(Markdown enabled)"
        className="resize-none"
      />
      <div className="px-4 flex flex-row justify-between">
        <span className="flex flex-row gap-x-4 self-center px-2 opacity-60">
          <FaCode /> <IoMdLink /> <FaAt />
        </span>
        <span>
          <Button
            color="default"
            variant="flat"
            className="font-semibold mr-2 opacity-60"
          >
            Preview
          </Button>
          <Button
            color="success"
            className="font-semibold text-white tracking-wide"
          >
            Comment
          </Button>
        </span>
      </div>
    </div>
  );
}
