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
import { IoMdPersonAdd } from 'react-icons/io';
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
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-row gap-x-4">
              <IoMdPersonAdd className="self-center text-3xl text-[#595EFC]" />
              <span className="self-center text-large">Invite new</span>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-row gap-x-2">
                <Input
                  type="text"
                  placeholder="Username"
                  variant="bordered"
                  className="h-full"
                  radius="sm"
                  onValueChange={setUsername}
                />
                <Input
                  isReadOnly
                  type="text"
                  value={role}
                  variant="bordered"
                  className="h-full opacity-60"
                  radius="sm"
                />
              </div>
              <div className="flex flex-row gap-x-2">
                <Input
                  type="email"
                  label="Email"
                  variant="bordered"
                  onValueChange={setEmail}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button className="bg-slate-200 text-medium" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="success"
                onPress={handleSubmit}
                className="font-medium text-white tracking-wide bg-[#595EFC]"
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
