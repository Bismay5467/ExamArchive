import { cn, Input } from '@nextui-org/react';
import { IoAddCircleOutline } from 'react-icons/io5';
import { toast } from 'sonner';
import React, { useEffect, useState } from 'react';
import Tag from '../Tags';

const MAX_TAG_LENGTH = 30;

export default function TagsEditor({
  tags,
  className,
  setTags,
  isDeletable,
}: {
  tags: Array<string>;
  className?: string;
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  isDeletable: boolean;
}) {
  const [newTagValue, setNewTagValue] = useState<string>('');

  useEffect(() => {
    const tagsSection = document.querySelector('#tags-section');
    if (tagsSection) tagsSection.scrollTop = tagsSection.scrollHeight;
  }, [tags]);

  const tagFilter = (tag: string) => {
    if (tag.length === 0 || tag.length > MAX_TAG_LENGTH) {
      toast.error('Invalid tag length', {
        description: 'Length should be between 1 and 30 charaters',
        duration: 5000,
      });
      return false;
    }

    return true;
  };

  const handleAddNewTag = () => {
    if (newTagValue.length === 0) {
      toast.error('New tag value must contain atleast 1 charaters', {
        duration: 5000,
      });
      return;
    }
    if (tags.includes(newTagValue.toLowerCase())) {
      toast.error('Entered tag value already exists!', {
        duration: 1000,
      });
      return;
    }
    setTags((prev) => [
      ...prev,
      ...newTagValue.trim().toLowerCase().split(',').filter(tagFilter),
    ]);
    setNewTagValue('');
  };

  const handleDeleteTag = (tagValue: string) => {
    setTags(tags.filter((tag) => tag !== tagValue));
  };

  return (
    <div className={cn('flex flex-col gap-y-4 font-natosans', className)}>
      <div
        id="tags-section"
        className="flex flex-row flex-wrap gap-2 max-h-[80px] overflow-y-auto no-scrollbar"
      >
        {tags.map((val, idx) => (
          <Tag
            val={val}
            key={idx}
            classNames={{
              base: 'dark:bg-violet-400/20 bg-violet-100 border-small border-violet-700',
              content: 'dark:text-violet-400 text-violet-500',
            }}
            {...(isDeletable && { handleDeleteTag })}
          />
        ))}
      </div>
      <Input
        value={newTagValue}
        {...(newTagValue.length && {
          endContent: (
            <button
              type="button"
              aria-label="add-btn"
              onClick={handleAddNewTag}
              className="flex flex-row text-xs gap-x-1 border-1 border-slate-100 px-2 py-1 rounded-md"
            >
              Add <IoAddCircleOutline className="self-center text-sm" />
            </button>
          ),
        })}
        placeholder="Enter a new tag"
        radius="sm"
        size="md"
        variant="bordered"
        onValueChange={setNewTagValue}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleAddNewTag();
        }}
      />
    </div>
  );
}
