import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react';
import { BsQuestionCircleFill } from 'react-icons/bs';
import React from 'react';

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
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-row gap-x-2 text-xl">
              <BsQuestionCircleFill className="self-center text-2xl text-[#DB1256]" />
              Are you sure?
            </ModalHeader>
            <ModalBody className="font-medium tracking-wide opacity-70">
              Are you sure you want to {actionText.toLowerCase()} this{' '}
              {actionType.toLowerCase()}?
            </ModalBody>
            <ModalFooter>
              <Button className="bg-slate-200" onPress={onClose}>
                Close
              </Button>
              <Button color="danger" onPress={handleSubmit}>
                {actionText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
