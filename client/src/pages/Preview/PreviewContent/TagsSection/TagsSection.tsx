import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Chip,
  ChipProps,
} from '@nextui-org/react';
import { IoPricetags } from 'react-icons/io5';

const tagsColorMap: Array<ChipProps['color']> = [
  'danger',
  'default',
  'primary',
  'secondary',
  'success',
  'warning',
];
const MAX_TAGS_TO_DISPLAY = 3;

export default function TagsSection({ tags }: { tags: Array<string> }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex flex-col gap-y-2">
      <h2>Tags:</h2>
      <div className="flex flex-row gap-x-2">
        {tags.slice(0, MAX_TAGS_TO_DISPLAY).map((val, idx) => (
          <Chip
            color={tagsColorMap[idx % tagsColorMap.length]}
            variant="flat"
            key={val}
            className="self-center"
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
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-row gap-x-2">
                <IoPricetags className="self-center text-2xl text-red-600" />
                <p>All tags</p>
              </ModalHeader>
              <ModalBody>
                <p className="text-sm opacity-60">
                  You can contribute by adding more tags by clicking on the add
                  more button!
                </p>
                <div className="flex flex-row flex-wrap gap-2">
                  {tags.map((val, idx) => (
                    <Chip
                      color={tagsColorMap[idx % tagsColorMap.length]}
                      variant="flat"
                      key={val}
                      className="self-center"
                    >
                      {val}
                    </Chip>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Add more
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
