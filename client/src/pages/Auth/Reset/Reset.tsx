import Logo from '@/assets/Logo.png';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Spinner from '@/components/ui/spinner';
import { useForm, SubmitHandler } from 'react-hook-form';
import { resetInputSchema } from '@/constants/authSchema/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResetFormFields } from '@/types/auth';
import useSWR from 'swr';
import axios, { AxiosRequestConfig } from 'axios';
import Email from './Email/Email';
import Update from './Update/Update';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SUCCESS_CODES } from '@/constants/statusCodes';

const fetcher = async (obj: AxiosRequestConfig<any>) => {
  const response = await axios(obj);
  return response;
};

export default function Reset() {
  const [data, setData] = useState<ResetFormFields>();
  const navigate = useNavigate();
  const [searchParams, _] = useSearchParams();
  const hasResetToken = searchParams.has('AUTH_TOKEN');

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ResetFormFields>({
    resolver: zodResolver(resetInputSchema),
  });

  const getAxiosObj = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const url = BASE_URL.concat('auth/reset');
    const axiosObj = {
      url,
      data: { data },
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    };

    return axiosObj;
  };

  const { data: user, isValidating } = useSWR(
    data ? getAxiosObj() : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );
  console.log(user);

  const onSubmit: SubmitHandler<ResetFormFields> = async (formData) => {
    if (hasResetToken) {
      setData({ ...formData, action: 'RESET' });
      if (user && user.status === SUCCESS_CODES.CREATED)
        navigate('/auth/login');
    } else {
      setData({ ...formData, action: 'EMAIL' });
    }
  };

  return (
    <div className="p-4 h-full lg:grid lg:grid-cols-2 lg:gap-x-4">
      <div className="h-full lg:col-span-1 py-12 ">
        <div className=" max-w-[360px] mx-auto mt-12 min-h-[100px] flex flex-col items-center gap-y-8">
          <div className="flex flex-col items-center gap-y-4">
            <img src={Logo} alt="" className="w-[180px]" />
            <div>
              <h1 className="text-3xl font-semibold text-center">
                {hasResetToken
                  ? `Just one more step!`
                  : `Forgot your Password?`}
              </h1>
              <h3 className="text-sm opacity-60 mt-2 text-center">
                Enter your details to recover!
              </h3>
            </div>
          </div>
          <form className="w-full relative" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-2">
              {!hasResetToken && <Email register={register} errors={errors} />}
              {hasResetToken && <Update register={register} errors={errors} />}
            </div>
            <Button
              type="submit"
              className="w-full mt-8"
              disabled={isSubmitting || isValidating}
            >
              {hasResetToken ? `Update` : `Send Mail`}
              {(isSubmitting || isValidating) && (
                <Spinner className={`w-4 h-4 ml-3 `} />
              )}
            </Button>
          </form>
        </div>
      </div>
      <div className="hidden bg-reset-banner bg-no-repeat bg-cover bg-right lg:block lg:col-span-1 lg:rounded-3xl"></div>
    </div>
  );
}
