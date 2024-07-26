import { Button } from '@nextui-org/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';

interface commentFormInput {
  message: string;
}

export default function ParentCommentForm({
  handleCreateComment,
}: {
  handleCreateComment: (_message: string) => Promise<void>;
}) {
  const { register, handleSubmit, reset } = useForm<commentFormInput>();

  const onSubmit: SubmitHandler<commentFormInput> = (formData) => {
    handleCreateComment(formData.message);
    reset();
  };

  return (
    <div
      className="pb-4 pt-2 rounded-lg flex flex-col gap-y-4 dark:bg-[#191919]"
      style={{
        boxShadow:
          'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Textarea
          placeholder="Type your comment here..."
          className="resize-none min-h-[50px] dark:bg-[#191919]"
          {...register('message')}
        />

        <div className="px-4 flex flex-row justify-end">
          <span>
            <Button
              radius="sm"
              variant="bordered"
              color="primary"
              type="submit"
            >
              Comment
            </Button>
          </span>
        </div>
      </form>
    </div>
  );
}
