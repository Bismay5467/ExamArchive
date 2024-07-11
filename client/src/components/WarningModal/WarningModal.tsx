import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react';
import { MdDeleteOutline } from 'react-icons/md';

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
