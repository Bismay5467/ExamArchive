/* eslint-disable function-paren-newline */
import { toast } from 'sonner';
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from '@nextui-org/react';
import { useCallback, useState } from 'react';
import { IoPersonAddOutline } from 'react-icons/io5';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useSWR, { KeyedMutator } from 'swr';
import { useAuth } from '@/hooks/useAuth';
import { IModerator, TModeratorRole } from '@/types/moderator';
import { addModeratorObj } from '@/utils/axiosReqObjects';
import fetcher from '@/utils/fetcher/fetcher';
import { toCamelCase } from '@/utils/helpers';
import {
  addInstitueNamesObj,
  getInstitueNamesObj,
} from '@/utils/axiosReqObjects/superadmin';
import { addModeratorInputSchema } from '@/schemas/moderatorSchema';

interface IInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  role: TModeratorRole;
  mutate: KeyedMutator<any>;
}

export default function InviteModal({
  isOpen,
  onClose,
  onOpenChange,
  role,
  mutate,
}: IInviteModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<IModerator>({ resolver: zodResolver(addModeratorInputSchema) });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    authState: { jwtToken },
  } = useAuth();

  const { data: response, mutate: mutateInstituteNames } = useSWR(
    getInstitueNamesObj(jwtToken)
  );
  const instituteNames: Array<string> = response?.data?.data ?? [];

  const handleAddInstituteName = useCallback(async (name: string) => {
    const reqObj = addInstitueNamesObj(name, jwtToken);
    if (!reqObj) {
      toast.error('Something went wrong!', {
        duration: 5000,
      });
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
    }
    toast.success('New Institute added 🚀', {
      description: name,
      duration: 5000,
    });
  }, []);

  const onSubmit: SubmitHandler<IModerator> = async (formData) => {
    const { instituteName } = formData;
    if (!instituteNames.includes(instituteName)) {
      await handleAddInstituteName(instituteName);
    }
    const reqObj = addModeratorObj(formData, jwtToken);
    if (!reqObj) {
      toast.error('Something went wrong!', {
        duration: 5000,
      });
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
      return;
    }
    await mutate().then(() =>
      toast.success('Invitation sent successfully', {
        duration: 5000,
      })
    );
    mutateInstituteNames();
    setIsLoading(false);
    reset();
    onClose();
  };

  const handleInvite = useCallback(() => {
    setValue('role', role);
    handleSubmit(onSubmit)();
  }, []);

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
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-5 gap-2"
              >
                <Input
                  isDisabled
                  label="Privilage"
                  type="text"
                  isRequired
                  value={toCamelCase(role)}
                  className="col-span-2"
                  variant="bordered"
                  radius="sm"
                />
                <Input
                  type="text"
                  label="Username"
                  variant="bordered"
                  radius="sm"
                  {...register('username')}
                  isInvalid={errors.username !== undefined}
                  errorMessage={errors.username?.message}
                  onFocus={() => errors.username && clearErrors('username')}
                  isRequired
                  className="col-span-3"
                />
                <Input
                  type="email"
                  label="Email"
                  variant="bordered"
                  radius="sm"
                  size="sm"
                  {...register('email')}
                  isInvalid={errors.email !== undefined}
                  errorMessage={errors.email?.message}
                  onFocus={() => errors.email && clearErrors('email')}
                  isRequired
                  className="col-span-full"
                />
                <Autocomplete
                  label="Institute Name"
                  allowsCustomValue
                  size="sm"
                  radius="sm"
                  variant="bordered"
                  className="col-span-full"
                  onValueChange={(e) => setValue('instituteName', e as string)}
                  onSelectionChange={(e) =>
                    setValue('instituteName', e as string)
                  }
                  isRequired
                  isInvalid={errors.instituteName !== undefined}
                  errorMessage="*Required"
                  onFocus={() =>
                    errors.instituteName && clearErrors('instituteName')
                  }
                >
                  {instituteNames?.map((val) => (
                    <AutocompleteItem key={val} value={val}>
                      {val}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </form>
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
                onPress={handleInvite}
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
