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

interface IWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  actionText: string;
  actionType: string;
  setEvent: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function WarningModal({
  isOpen,
  onClose,
  onOpenChange,
  actionText,
  actionType,
  setEvent,
}: IWarningModalProps) {
  const handleSubmit = () => {
    setEvent(true);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      radius="sm"
      className="font-natosans"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-row gap-x-2 text-lg text-red-500">
              <MdDeleteOutline className="self-center text-2xl" />
              Delete comment
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
