import Logo from '@/assets/Logo.png';

import useMultiStepForm from './MultiStepForm/useMultiStepForm';
import AccountForm from './MultiStepForm/AccountForm';
import OTPForm from './MultiStepForm/OTPForm';

export default function Signup() {
  const { next, step } = useMultiStepForm([<AccountForm />, <OTPForm />]);
  return (
    <div className="p-4 h-full lg:grid lg:grid-cols-2 lg:gap-x-4">
      <div className="hidden bg-signup-banner bg-no-repeat bg-cover bg-right lg:block lg:col-span-1 lg:rounded-3xl"></div>
      <div className="h-full lg:col-span-1 py-12 ">
        <div className=" max-w-[360px] mx-auto mt-12 min-h-[100px] flex flex-col items-center gap-y-8">
          <div className="flex flex-col items-center gap-y-4">
            <img src={Logo} alt="" className="w-[180px]" />
            <div>
              <h1 className="text-3xl font-semibold text-center">
                Create your account
              </h1>
              <h3 className="text-sm opacity-60 mt-2 text-center">
                Enter your details to proceed further
              </h3>
            </div>
          </div>
          {step}
          <div className="flex flex-row gap-x-2">
            <div className="h-0.5 w-24 self-center bg-slate-200"></div>
            <p>Or</p>
            <div className="h-0.5 w-24 self-center bg-slate-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
