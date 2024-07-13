import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button, Input, Spinner, useDisclosure } from '@nextui-org/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { signInUserInputSchema } from '@/schemas/authSchema';
import { TSignInFormFields } from '@/types/auth';
import { getSignInObj } from '@/utils/axiosReqObjects';
import fetcher from '@/utils/fetcher/fetcher';
import { useAuth } from '@/hooks/useAuth';
import { CLIENT_ROUTES } from '@/constants/routes';
import ResetModal from '../../ResetModal/ResetModal';

export default function Login() {
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { isSubmitting, errors },
  } = useForm<TSignInFormFields>({
    resolver: zodResolver(signInUserInputSchema),
  });
  const { onOpen, onClose, onOpenChange, isOpen } = useDisclosure();
  const { state } = useLocation();
  const navigate = useNavigate();
  const from = state?.from || CLIENT_ROUTES.HOME;
  const { SET } = useAuth();
  const onSubmit: SubmitHandler<TSignInFormFields> = async (formData) => {
    const reqObj = getSignInObj(formData);
    try {
      await fetcher(reqObj);
    } catch (err: any) {
      toast.error('Somthing went wrong!', {
        description: `${err.response.data.message}`,
        duration: 5000,
      });
      return;
    }
    SET();
    toast.success('Welcome Back! Nice to see you 😇', {
      duration: 5000,
    });
    navigate(from, { replace: true });
  };

  return (
    <>
      <form className="flex flex-col gap-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          isRequired
          label="Email/Username"
          radius="sm"
          variant="bordered"
          isInvalid={errors.username !== undefined}
          errorMessage={errors.username?.message}
          onFocus={() => errors.username && clearErrors('username')}
          {...register('username')}
        />
        <Input
          isRequired
          label="Password"
          radius="sm"
          variant="bordered"
          type="password"
          isInvalid={errors.password !== undefined}
          errorMessage={errors.password?.message}
          onFocus={() => errors.password && clearErrors('password')}
          {...register('password')}
        />
        <button
          type="button"
          className="text-xs w-fit self-end font-semibold opacity-60 cursor-pointer hover:underline"
          onClick={onOpen}
        >
          Recover Password
        </button>
        <Button
          type="submit"
          fullWidth
          color="primary"
          {...(isSubmitting && {
            startContent: <Spinner color="secondary" size="sm" />,
          })}
          isDisabled={isSubmitting}
          variant="bordered"
          radius="sm"
        >
          Log in
        </Button>
      </form>
      <ResetModal
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
      />
    </>
  );
}
