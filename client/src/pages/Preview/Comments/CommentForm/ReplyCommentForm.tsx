import { Avatar, Button } from '@nextui-org/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
// import { useComments } from '@/hooks/useComments';

interface commentFormInput {
  message: string;
}

export default function ReplyCommentForm({
  setIsReplying,
  setShowReplies,
  setOptimisticReplyCount,
  handleCreateComment,
}: {
  setIsReplying: React.Dispatch<React.SetStateAction<boolean>>;
  setShowReplies: React.Dispatch<React.SetStateAction<boolean>>;
  setOptimisticReplyCount: React.Dispatch<React.SetStateAction<number>>;
  handleCreateComment: (_message: string) => Promise<void>;
}) {
  const { register, handleSubmit, reset } = useForm<commentFormInput>();

  const onSubmit: SubmitHandler<commentFormInput> = (formData) => {
    handleCreateComment(formData.message);
    reset();
    setIsReplying(false);
    setShowReplies(true);
    setOptimisticReplyCount((prev) => prev + 1);
  };

  return (
    <div className="flex flex-row py-4 gap-x-4">
      <Avatar
        isBordered
        radius="sm"
        size="sm"
        className="self-start"
        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
      />
      <div className="w-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-4"
        >
          <Textarea
            placeholder="Type your comment here..."
            className="resize-none rounded-xl shadow-md "
            {...register('message')}
          />
          <span className="flex flex-row justify-end">
            <Button
              color="default"
              variant="flat"
              className="font-semibold mr-2 opacity-60"
              size="sm"
              onClick={() => setIsReplying(false)}
            >
              Cancel
            </Button>
            <Button
              color="success"
              className="font-semibold text-white tracking-wide"
              type="submit"
              size="sm"
            >
              Comment
            </Button>
          </span>
        </form>
      </div>
    </div>
  );
}
