import { Input } from '@nextui-org/react';
import { toast } from 'sonner';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ROLES } from '@/constants/auth';
import Tag from '../Tags';

export default function TagsEditor({
  tags,
  setTags,
}: {
  tags: Array<string>;
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [newTagValue, setNewTagValue] = useState<string>('');
  const {
    authState: { role },
  } = useAuth();
  const isDeletable = role === ROLES.ADMIN;

  useEffect(() => {
    const tagsSection = document.querySelector('#tags-section');
    if (tagsSection) tagsSection.scrollTop = tagsSection.scrollHeight;
  }, [tags]);
  const handleAddNewTag = () => {
    if (newTagValue.length === 0) {
      toast.error('New tag value must contain atleast 1 charaters', {
        duration: 5000,
      });
      return;
    }
    if (tags.includes(newTagValue)) {
      toast.error('Entered tag value already exists!', {
        duration: 1000,
      });
      return;
    }
    setTags((prev) => [...prev, newTagValue]);
  };

  const handleDeleteTag = (tagValue: string) => {
    setTags(tags.filter((tag) => tag !== tagValue));
  };

  return (
    <div className="flex flex-col gap-y-4 font-natosans">
      <div
        id="tags-section"
        className="flex flex-row flex-wrap gap-2 max-h-[200px] overflow-y-auto no-scrollbar"
      >
        {tags.map((val, idx) => (
          <Tag
            val={val}
            key={idx}
            classNames={{
              base: 'bg-violet-100 border-small border-violet-700',
              content: 'text-violet-700',
            }}
            {...(isDeletable && { handleDeleteTag })}
          />
        ))}
      </div>
      <Input
        isClearable
        placeholder="Type a tag and press enter to add it to the list"
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
