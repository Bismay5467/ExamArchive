/* eslint-disable no-confusing-arrow */
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  Input,
} from '@nextui-org/react';
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetInputSchema } from '@/schemas/authSchema';
import { AUTH_TOKEN } from '@/constants/auth';
import { IResetJwtPayload, TResetFormFields } from '@/types/auth';
import { getResetObj } from '@/utils/axiosReqObjects';
import fetcher from '@/utils/fetcher/fetcher';
import { CLIENT_ROUTES } from '@/constants/routes';

interface IRestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onOpenChange: () => void;
}
export default function ResetModal({
  isOpen,
  onClose,
  onOpenChange,
  onOpen,
}: IRestModalProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const authToken = searchParams.get(AUTH_TOKEN);
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { isSubmitting, errors },
  } = useForm<TResetFormFields>({
    resolver: zodResolver(resetInputSchema),
  });

  useEffect(() => {
    if (authToken) onOpen();
  }, [isOpen]);

  const onSubmit: SubmitHandler<TResetFormFields> = async (formData) => {
    const reqObj = getResetObj({
      ...formData,
      action: authToken ? 'RESET' : 'EMAIL',
      ...(authToken && {
        authToken,
        email: (jwtDecode(authToken) as IResetJwtPayload).email,
      }),
    });
    try {
      await fetcher(reqObj);
    } catch (err: any) {
      toast.error('Somthing went wrong!', {
        description: `${err.response.data.message}`,
        duration: 5000,
      });
      return;
    }
    const successMessage = authToken
      ? 'Password Reset Successfully!'
      : 'OTP Generated';
    const successDescription = authToken
      ? 'Log in with your new password'
      : 'Check your mail';
    toast.success(successMessage, {
      description: successDescription,
      duration: 5000,
    });
    if (authToken) {
      navigate(CLIENT_ROUTES.AUTH_LOGIN);
      onClose();
    }
  };

  const renderContent = authToken ? (
    <Input
      isRequired
      label="New Password"
      radius="sm"
      variant="bordered"
      isInvalid={errors.password !== undefined}
      errorMessage={errors.password?.message}
      onFocus={() => errors.password && clearErrors('password')}
      {...register('password')}
    />
  ) : (
    <Input
      isRequired
      label="Email"
      radius="sm"
      variant="bordered"
      isInvalid={errors.email !== undefined}
      errorMessage={errors.email?.message}
      onFocus={() => errors.email && clearErrors('email')}
      {...register('email')}
    />
  );

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="top-center"
      className="font-natosans"
      radius="sm"
      isDismissable={false}
      isKeyboardDismissDisabled
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-row gap-x-3">
              <span>
                Enter your {authToken ? 'new password' : 'details to recover'}
              </span>
            </ModalHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalBody>{renderContent}</ModalBody>
              <ModalFooter>
                <Button
                  radius="sm"
                  color="default"
                  variant="bordered"
                  onPress={onClose}
                  isDisabled={authToken !== null}
                >
                  Cancel
                </Button>
                <Button
                  radius="sm"
                  color="primary"
                  variant="bordered"
                  type="submit"
                  {...(isSubmitting && {
                    startContent: <Spinner color="secondary" size="sm" />,
                  })}
                  isDisabled={isSubmitting}
                >
                  {authToken ? 'Update' : 'Send Mail'}
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
