import { Chip, Input } from '@nextui-org/react';
import { toast } from 'sonner';
import React, { useState } from 'react';
import { tagsBgColorMap, tagsTextColorMap } from '@/constants/shared';
import { useAuth } from '@/hooks/useAuth';
import { ROLES } from '@/constants/auth';

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
  const handleAddNewTag = () => {
    if (newTagValue.length === 0) {
      toast.error('New tag value must contain atleast 1 charaters', {
        duration: 5000,
      });
      return;
    }
    setTags((prev) => [...prev, newTagValue]);
  };

  const handleDeleteTag = (tagValue: string) => {
    setTags(tags.filter((tag) => tag !== tagValue));
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row flex-wrap gap-2">
        {tags.map((val, idx) => (
          <Chip
            variant="flat"
            key={val}
            className={`self-center ${tagsBgColorMap[idx % tagsBgColorMap.length]} ${tagsTextColorMap[idx % tagsTextColorMap.length]}`}
            {...(isDeletable && { onClose: () => handleDeleteTag(val) })}
          >
            {val}
          </Chip>
        ))}
      </div>
      <Input
        placeholder="Likh aur enter mar maderchod!"
        radius="sm"
        size="md"
        onValueChange={setNewTagValue}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleAddNewTag();
        }}
      />
    </div>
  );
}
