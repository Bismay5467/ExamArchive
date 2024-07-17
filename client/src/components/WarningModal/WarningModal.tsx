import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react';
import React from 'react';
import { MdDeleteOutline } from 'react-icons/md';
import { KEY_CODES } from '@/constants/shared';

interface IWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  actionText: string;
  actionType: string;
  eventHandler: () => void;
}

export default function WarningModal({
  isOpen,
  onClose,
  onOpenChange,
  actionText,
  actionType,
  eventHandler,
}: IWarningModalProps) {
  const handleSubmit = () => {
    eventHandler();
    onClose();
  };

  const handleKeyEvent = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.code === KEY_CODES.ENTER) handleSubmit();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      radius="sm"
      className="font-natosans"
      onKeyDown={handleKeyEvent}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-row gap-x-2 text-lg text-red-500">
              <MdDeleteOutline className="self-center text-2xl" />
              Delete {actionType.toLowerCase()}
            </ModalHeader>
            <ModalBody className="font-sm">
              Are you sure you want to {actionText.toLowerCase()} this{' '}
              {actionType.toLowerCase()}? This action is irreversible.
            </ModalBody>
            <ModalFooter>
              <Button
                variant="bordered"
                color="default"
                onPress={onClose}
                radius="sm"
              >
                Close
              </Button>
              <Button
                variant="bordered"
                color="danger"
                onPress={handleSubmit}
                radius="sm"
              >
                {actionText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
