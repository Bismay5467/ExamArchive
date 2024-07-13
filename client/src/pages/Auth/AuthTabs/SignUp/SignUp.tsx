import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button, Spinner } from '@nextui-org/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { newUserInputSchema } from '@/schemas/authSchema';
import { TSignUpFormFields } from '@/types/auth';
import useMultiStepForm from '@/hooks/useMultiStepForm';
import AccountInfo from './FormSteps/AccountInfo';
import OTPInput from './FormSteps/OTPInput';
import { getSignUpObj } from '@/utils/axiosReqObjects';
import fetcher from '@/utils/fetcher/fetcher';
import { CLIENT_ROUTES } from '@/constants/routes';

export default function SignUp() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<TSignUpFormFields>({
    resolver: zodResolver(newUserInputSchema),
  });

  const { next, isFirstStep, step } = useMultiStepForm([
    <AccountInfo
      register={register}
      errors={errors}
      clearErrors={clearErrors}
    />,
    <OTPInput setValue={setValue} errors={errors} clearErrors={clearErrors} />,
  ]);

  const onSubmit: SubmitHandler<TSignUpFormFields> = async (formData) => {
    const reqObj = getSignUpObj({
      ...formData,
      role: 'USER',
      actionType: isFirstStep() ? 'GENERATE' : 'VERIFY',
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
    if (isFirstStep()) {
      toast.success('OTP Generated', {
        description: 'Check your mail!',
        duration: 5000,
      });
      next();
    } else {
      toast.success('Account successfully created!', {
        description: 'You can log in now!',
        duration: 5000,
      });
      navigate(CLIENT_ROUTES.AUTH_LOGIN);
    }
  };

  return (
    <form className="flex flex-col gap-y-4" onSubmit={handleSubmit(onSubmit)}>
      {step}
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
        {isFirstStep() ? 'Next' : 'Sign Up'}
      </Button>
    </form>
  );
}
