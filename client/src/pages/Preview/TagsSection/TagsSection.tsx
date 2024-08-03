/* eslint-disable no-nested-ternary */
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
import React, { useEffect, useState } from 'react';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { MdDriveFileRenameOutline } from 'react-icons/md';
import { KeyedMutator } from 'swr';
import { FaHashtag } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import TagsEditor from '@/components/TagsEditor/TagsEditor';
import { editTagsObj } from '@/utils/axiosReqObjects';
import { useAuth } from '@/hooks/useAuth';
import fetcher from '@/utils/fetcher/fetcher';
import Tag from '@/components/Tags';
import { KEY_CODES } from '@/constants/shared';
import { IsUserAuthenticated } from '@/utils/helpers';

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
    authState: { jwtToken, userId, isAuth },
  } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isDeletable = userId === uploaderId;
  const handleSubmit = async () => {
    if (!IsUserAuthenticated(isAuth, navigate, pathname)) {
      return;
    }
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

  const handleKeyEvent = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.code === KEY_CODES.ENTER) handleSubmit();
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 font-natosans">
      <div>Tags: </div>
      <div className="flex flex-row flex-wrap gap-2">
        {tags.slice(0, MAX_TAGS_TO_DISPLAY).map((val, idx) => (
          <Tag
            val={val}
            key={idx}
            classNames={{
              base: 'dark:bg-violet-400/20 bg-violet-100 self-center border-small border-violet-700',
              content: 'dark:text-violet-400 text-violet-500',
            }}
          />
        ))}
        <Button
          className="pl-3 text-sm text-blue-600 self-center hover:cursor-pointer"
          size="sm"
          variant="light"
          onClick={onOpen}
        >
          Show more
        </Button>
      </div>
      <Modal
        isOpen={isOpen}
        placement="center"
        onOpenChange={onOpenChange}
        radius="sm"
        className="font-natosans"
        onKeyDown={handleKeyEvent}
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
                            base: 'dark:bg-violet-400/20 bg-violet-100 border-small border-violet-700',
                            content: 'dark:text-violet-400 text-violet-500',
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
                    startContent: isDeletable ? (
                      <MdDriveFileRenameOutline className="text-xl font-semibold" />
                    ) : (
                      <IoIosAddCircleOutline className="text-xl font-semibold" />
                    ),
                  })}
                  {...(isLoading && {
                    startContent: <Spinner color="secondary" size="sm" />,
                  })}
                  isDisabled={isLoading}
                >
                  {isEditing
                    ? 'Save and publish'
                    : isDeletable
                      ? 'Edit'
                      : 'Add more'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
