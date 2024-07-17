/* eslint-disable indent */
import { Button, Card, CardBody, Input, Spinner } from '@nextui-org/react';
import { toast } from 'sonner';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IoPersonOutline } from 'react-icons/io5';
import { zodResolver } from '@hookform/resolvers/zod';
import { jwtDecode } from 'jwt-decode';
import { RiLoginCircleLine } from 'react-icons/ri';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { IResetJwtPayload, TResetFormFields } from '@/types/auth';
import { resetInputSchema } from '@/schemas/authSchema';
import { AUTH_TOKEN } from '@/constants/auth';
import { getResetObj } from '@/utils/axiosReqObjects';
import fetcher from '@/utils/fetcher/fetcher';
import { CLIENT_ROUTES } from '@/constants/routes';

export default function Reset() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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
    }
  };

  return (
    <div className="max-w-full w-[450px] h-[500px]">
      <Card className="pb-6 font-natosans" radius="sm">
        <CardBody className="overflow-hidden">
          <form
            className="flex flex-col gap-y-4 px-8 pt-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              isRequired
              label="Email"
              radius="sm"
              variant="underlined"
              isInvalid={errors.email !== undefined}
              errorMessage={errors.email?.message}
              onFocus={() => errors.email && clearErrors('email')}
              {...register('email')}
              {...(authToken && {
                value: (jwtDecode(authToken) as IResetJwtPayload).email,
                isDisabled: true,
              })}
              endContent={
                <IoPersonOutline className="text-2xl text-slate-500" />
              }
            />
            {authToken && (
              <Input
                isRequired
                label="New Password"
                radius="sm"
                variant="underlined"
                type={isPasswordVisible ? 'text' : 'password'}
                isInvalid={errors.password !== undefined}
                errorMessage={errors.password?.message}
                onFocus={() => errors.password && clearErrors('password')}
                {...register('password')}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={() => setIsPasswordVisible((prev) => !prev)}
                  >
                    {isPasswordVisible ? (
                      <FaEye className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
              />
            )}
            <Button
              type="submit"
              fullWidth
              color="primary"
              {...(isSubmitting
                ? {
                    startContent: <Spinner color="default" size="sm" />,
                  }
                : { endContent: <RiLoginCircleLine className="text-lg" /> })}
              isDisabled={isSubmitting}
              variant="bordered"
              radius="sm"
              className="mt-5 py-5"
            >
              {authToken ? 'Reset' : 'Send OTP'}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

// import { zodResolver } from '@hookform/resolvers/zod';
// import { toast } from 'sonner';
// import {
//   Modal,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Button,
//   Spinner,
//   Input,
// } from '@nextui-org/react';
// import { jwtDecode } from 'jwt-decode';
// import { useEffect } from 'react';
// import { SubmitHandler, useForm } from 'react-hook-form';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { CiUnlock } from 'react-icons/ci';
// import { resetInputSchema } from '@/schemas/authSchema';
// import { AUTH_TOKEN } from '@/constants/auth';
// import { IResetJwtPayload, TResetFormFields } from '@/types/auth';
// import { getResetObj } from '@/utils/axiosReqObjects';
// import fetcher from '@/utils/fetcher/fetcher';
// import { CLIENT_ROUTES } from '@/constants/routes';

// interface IRestModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onOpen: () => void;
//   onOpenChange: () => void;
// }
// export default function ResetModal({
//   isOpen,
//   onClose,
//   onOpenChange,
//   onOpen,
// }: IRestModalProps) {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const authToken = searchParams.get(AUTH_TOKEN);
//   const {
//     register,
//     handleSubmit,
//     clearErrors,
//     formState: { isSubmitting, errors },
//   } = useForm<TResetFormFields>({
//     resolver: zodResolver(resetInputSchema),
//   });

//   useEffect(() => {
//     if (authToken) onOpen();
//   }, [isOpen]);

//   const onSubmit: SubmitHandler<TResetFormFields> = async (formData) => {
//     const reqObj = getResetObj({
//       ...formData,
//       action: authToken ? 'RESET' : 'EMAIL',
//       ...(authToken && {
//         authToken,
//         email: (jwtDecode(authToken) as IResetJwtPayload).email,
//       }),
//     });
//     try {
//       await fetcher(reqObj);
//     } catch (err: any) {
//       toast.error('Somthing went wrong!', {
//         description: `${err.response.data.message}`,
//         duration: 5000,
//       });
//       return;
//     }
//     const successMessage = authToken
//       ? 'Password Reset Successfully!'
//       : 'OTP Generated';
//     const successDescription = authToken
//       ? 'Log in with your new password'
//       : 'Check your mail';
//     toast.success(successMessage, {
//       description: successDescription,
//       duration: 5000,
//     });
//     if (authToken) {
//       navigate(CLIENT_ROUTES.AUTH_LOGIN);
//       onClose();
//     }
//   };

//   const renderContent = authToken ? (
//     <Input
//       isRequired
//       label="New Password"
//       radius="sm"
//       variant="bordered"
//       isInvalid={errors.password !== undefined}
//       errorMessage={errors.password?.message}
//       onFocus={() => errors.password && clearErrors('password')}
//       {...register('password')}
//     />
//   ) : (
//     <Input
//       isRequired
//       label="Email"
//       radius="sm"
//       variant="bordered"
//       isInvalid={errors.email !== undefined}
//       errorMessage={errors.email?.message}
//       onFocus={() => errors.email && clearErrors('email')}
//       {...register('email')}
//     />
//   );

//   return (
//     <Modal
//       isOpen={isOpen}
//       onOpenChange={onOpenChange}
//       placement="center"
//       className="font-natosans"
//       radius="sm"
//       isDismissable={false}
//       isKeyboardDismissDisabled
//     >
//       <ModalContent>
//         {() => (
//           <>
//             <ModalHeader className="flex flex-row gap-x-3">
//               <CiUnlock className="text-2xl" />{' '}
//               <span>
//                 Enter your {authToken ? 'new password' : 'details to recover'}
//               </span>
//             </ModalHeader>
//             <form onSubmit={handleSubmit(onSubmit)}>
//               <ModalBody>{renderContent}</ModalBody>
//               <ModalFooter>
//                 <Button
//                   radius="sm"
//                   color="default"
//                   variant="bordered"
//                   onPress={onClose}
//                   isDisabled={authToken !== null}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   radius="sm"
//                   color="primary"
//                   variant="bordered"
//                   type="submit"
//                   {...(isSubmitting && {
//                     startContent: <Spinner color="secondary" size="sm" />,
//                   })}
//                   isDisabled={isSubmitting}
//                 >
//                   {authToken ? 'Update' : 'Send OTP'}
//                 </Button>
//               </ModalFooter>
//             </form>
//           </>
//         )}
//       </ModalContent>
//     </Modal>
//   );
// }
