/* eslint-disable jsx-a11y/no-static-element-interactions */

/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Spinner,
} from '@nextui-org/react';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { KeyedMutator } from 'swr';
import { FaHashtag } from 'react-icons/fa';
import TagsEditor from '@/components/TagsEditor/TagsEditor';
import { editTagsObj } from '@/utils/axiosReqObjects';
import { useAuth } from '@/hooks/useAuth';
import fetcher from '@/utils/fetcher/fetcher';
import Tag from '@/components/Tags';

const MAX_TAGS_TO_DISPLAY = 3;

export default function TagsSection({
  tags,
  postId,
  mutate,
  uploaderId,
}: {
  tags: Array<string>;
  postId: string;
  mutate: KeyedMutator<any>;
  uploaderId: string;
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [currentTags, setCurrentTags] = useState<Array<string>>(tags);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    authState: { jwtToken, userId },
  } = useAuth();
  const isDeletable = userId === uploaderId;
  const handleSubmit = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    if (currentTags === tags) {
      onClose();
      return;
    }
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
    setIsLoading(true);
    try {
      await fetcher(reqObject);
    } catch (err: any) {
      toast.error('Somthing went wrong!', {
        description: `${err.response.data.message}`,
        duration: 5000,
      });
      setIsLoading(false);
      return;
    }
    mutate().then(() => {
      toast.success('Tags updated successfully!', {
        duration: 5000,
      });
      onClose();
      setIsLoading(false);
    });
  };

  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
    }
    setCurrentTags(tags);
  }, [isOpen, tags]);

  return (
    <div className="flex flex-col gap-y-2 font-natosans">
      <h2>Tags:</h2>
      <div className="flex flex-row flex-wrap gap-x-2">
        {tags.slice(0, MAX_TAGS_TO_DISPLAY).map((val, idx) => (
          <Tag
            val={val}
            key={idx}
            classNames={{
              base: 'bg-violet-100 border-small border-violet-700',
              content: 'text-violet-700',
            }}
          />
        ))}
        {tags.length > MAX_TAGS_TO_DISPLAY && (
          <div
            onClick={onOpen}
            className="hover:cursor-pointer text-sm text-indigo-800 self-center"
          >
            +{tags.length - MAX_TAGS_TO_DISPLAY} more
          </div>
        )}
        {tags.length <= MAX_TAGS_TO_DISPLAY && (
          <div
            onClick={onOpen}
            className="hover:cursor-pointer text-sm text-indigo-800 self-center"
          >
            Add more tags
          </div>
        )}
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        radius="sm"
        className="font-natosans"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-row gap-x-2">
                <FaHashtag className="self-center text-xl" />
                <p>All tags</p>
              </ModalHeader>
              <ModalBody>
                {isEditing ? (
                  <TagsEditor
                    tags={currentTags}
                    setTags={setCurrentTags}
                    isDeletable={isDeletable}
                  />
                ) : (
                  <>
                    <p className="text-sm">
                      You can contribute by adding more tags by clicking on the
                      add more button!
                    </p>
                    <div className="flex flex-row flex-wrap gap-2 max-h-[200px] overflow-y-auto no-scrollbar">
                      {tags.map((val, idx) => (
                        <Tag
                          val={val}
                          key={idx}
                          classNames={{
                            base: 'bg-violet-100 border-small border-violet-700',
                            content: 'text-violet-700',
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  radius="sm"
                  color="default"
                  variant="bordered"
                  onPress={onClose}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  variant="bordered"
                  onPress={handleSubmit}
                  radius="sm"
                  {...(!isEditing && {
                    startContent: (
                      <IoIosAddCircleOutline className="text-xl font-semibold" />
                    ),
                  })}
                  {...(isLoading && {
                    startContent: <Spinner color="secondary" size="sm" />,
                  })}
                  isDisabled={isLoading}
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
