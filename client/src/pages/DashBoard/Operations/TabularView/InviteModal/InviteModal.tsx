import { toast } from 'sonner';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from '@nextui-org/react';
import { useCallback, useMemo, useState } from 'react';
import { IoPersonAddOutline } from 'react-icons/io5';
import { useAuth } from '@/hooks/useAuth';
import { TModeratorRole } from '@/types/moderator';
import { addModeratorObj } from '@/utils/axiosReqObjects';
import fetcher from '@/utils/fetcher/fetcher';

interface IInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  role: TModeratorRole;
}
const MIN_USERNAME_LENGTH = 2;

export default function InviteModal({
  isOpen,
  onClose,
  onOpenChange,
  role,
}: IInviteModalProps) {
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    authState: { jwtToken },
  } = useAuth();
  const mailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, []);

  const handleSubmit = useCallback(async () => {
    if (email.length === 0 || !mailRegex.test(email)) {
      toast.error('Please enter a valid mail!', {
        duration: 5000,
      });
      return;
    }
    if (username.length < MIN_USERNAME_LENGTH) {
      toast.error('Username should be of minimum 2 charaters', {
        duration: 5000,
      });
      return;
    }
    const reqObj = addModeratorObj({ email, role, username }, jwtToken);
    if (!reqObj) {
      toast.error('Something went wrong!', {
        duration: 5000,
      });
      onClose();
      return;
    }
    setIsLoading(true);
    try {
      await fetcher(reqObj);
    } catch (err: any) {
      toast.error(`${err.response.data.message}`, {
        duration: 5000,
      });
      setIsLoading(false);
      onClose();
      return;
    }
    toast.success('Invitation sent successfully', {
      duration: 5000,
    });
    setIsLoading(false);
    onClose();
  }, [email, username, role]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="top-center"
      radius="sm"
      className="font-natosans"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-row gap-x-4">
              <IoPersonAddOutline className="self-center text-xl" />
              <span className="self-center text-large">Invite new</span>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-row gap-x-2">
                <Input
                  isReadOnly
                  type="text"
                  value={role}
                  variant="bordered"
                  disabled
                  radius="sm"
                />
              </div>
              <div className="flex flex-row gap-x-2">
                <Input
                  type="text"
                  label="Username"
                  variant="bordered"
                  radius="sm"
                  onValueChange={setUsername}
                />
              </div>
              <div className="flex flex-row gap-x-2">
                <Input
                  type="email"
                  label="Email"
                  variant="bordered"
                  onValueChange={setEmail}
                  radius="sm"
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                onPress={onClose}
                radius="sm"
                color="default"
                variant="bordered"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                radius="sm"
                variant="bordered"
                onPress={handleSubmit}
                isDisabled={isLoading}
                {...(isLoading && {
                  endContent: <Spinner size="sm" color="secondary" />,
                })}
              >
                Send invite
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
