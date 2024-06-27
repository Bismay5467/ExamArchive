import Rating from '@mui/material/Rating';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';

export default function RatingSection() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row gap-x-4">
        <p className="self-center">Ratings ( 1.2K+ users voted )</p>
        <Button size="sm" radius="sm" className="text-small" onPress={onOpen}>
          Rate Here
        </Button>
      </div>
      <div className="grid grid-cols-3 grid-rows-3 sm:gap-x-4 gap-y-2 w-fit">
        <p>Helpful</p>
        <Rating name="read-only" value={4.7} precision={0.1} readOnly />
        <p className="text-center sm:text-left">4.7 / 5</p>
        <p>Standard</p>
        <Rating name="read-only" value={4.7} precision={0.1} readOnly />
        <p className="text-center sm:text-left">4.7 / 5</p>
        <p>Relevance</p>
        <Rating name="read-only" value={4.7} precision={0.1} readOnly />
        <p className="text-center sm:text-left">4.7 / 5</p>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modal Title
              </ModalHeader>
              <ModalBody>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Magna exercitation reprehenderit magna aute tempor cupidatat
                  consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
                  incididunt cillum quis. Velit duis sit officia eiusmod Lorem
                  aliqua enim laboris do dolor eiusmod. Et mollit incididunt
                  nisi consectetur esse laborum eiusmod pariatur proident Lorem
                  eiusmod et. Culpa deserunt nostrud ad veniam.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
