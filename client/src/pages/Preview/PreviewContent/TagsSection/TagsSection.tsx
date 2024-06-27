/* eslint-disable function-paren-newline */
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Chip,
} from '@nextui-org/react';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { IoPricetags } from 'react-icons/io5';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { KeyedMutator } from 'swr';
import { tagsBgColorMap, tagsTextColorMap } from '@/constants/shared';
import TagsEditor from '@/components/TagsEditor/TagsEditor';
import { editTagsObj } from '@/utils/axiosReqObjects';
import { useAuth } from '@/hooks/useAuth';
import fetcher from '@/utils/fetcher/fetcher';

const MAX_TAGS_TO_DISPLAY = 3;

export default function TagsSection({
  tags,
  postId,
  mutate,
}: {
  tags: Array<string>;
  postId: string;
  mutate: KeyedMutator<any>;
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [currentTags, setCurrentTags] = useState<Array<string>>(tags);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const {
    authState: { jwtToken },
  } = useAuth();

  const handleSubmit = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    if (currentTags === tags) {
      onClose();
      return;
    }
    onClose();
    const tagsToRemove: Array<string> = tags.filter(
      (tag) => !currentTags.includes(tag)
    );
    const tagsToAdd: Array<string> = currentTags.filter(
      (tag) => !tags.includes(tag)
    );
    const reqObject = editTagsObj(
      { tagsToAdd, tagsToRemove, postId },
      jwtToken
    );
    if (!reqObject) {
      toast.error('Somthing went wrong!', {
        duration: 5000,
      });
      return;
    }
    try {
      await fetcher(reqObject);
    } catch (err) {
      toast.error('Somthing went wrong!', {
        description: `${err}`,
        duration: 5000,
      });
      return;
    }
    mutate().then(() => {
      toast.success('Tags updated successfully!', {
        duration: 5000,
      });
    });
  };

  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
    }
    setCurrentTags(tags);
  }, [isOpen, tags]);

  return (
    <div className="flex flex-col gap-y-2">
      <h2>Tags:</h2>
      <div className="flex flex-row gap-x-2">
        {tags.slice(0, MAX_TAGS_TO_DISPLAY).map((val, idx) => (
          <Chip
            variant="flat"
            key={val}
            className={`self-center ${tagsBgColorMap[idx % tagsBgColorMap.length]} ${tagsTextColorMap[idx % tagsTextColorMap.length]}`}
          >
            {val}
          </Chip>
        ))}
        <Button variant="light" size="sm" onPress={onOpen}>
          +{tags.length - MAX_TAGS_TO_DISPLAY} more
        </Button>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-row gap-x-2">
                <IoPricetags className="self-center text-2xl text-red-600" />
                <p>All tags</p>
              </ModalHeader>
              <ModalBody>
                {isEditing ? (
                  <TagsEditor tags={currentTags} setTags={setCurrentTags} />
                ) : (
                  <>
                    <p className="text-sm opacity-60">
                      You can contribute by adding more tags by clicking on the
                      add more button!
                    </p>
                    <div className="flex flex-row flex-wrap gap-2">
                      {tags.map((val, idx) => (
                        <Chip
                          variant="flat"
                          key={val}
                          className={`self-center ${tagsBgColorMap[idx % tagsBgColorMap.length]} ${tagsTextColorMap[idx % tagsTextColorMap.length]}`}
                        >
                          {val}
                        </Chip>
                      ))}
                    </div>
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  radius="sm"
                  onPress={onClose}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={handleSubmit}
                  radius="sm"
                  {...(!isEditing && {
                    endContent: (
                      <IoIosAddCircleOutline className="text-xl font-semibold" />
                    ),
                  })}
                >
                  {isEditing ? 'Save and publish' : 'Add more'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
