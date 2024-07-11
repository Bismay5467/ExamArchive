import { Button } from '@nextui-org/react';
import { toast } from 'sonner';
import { useNavigate, useRouteError } from 'react-router-dom';
import { IoIosRefresh, IoMdArrowRoundBack } from 'react-icons/io';

export default function ForbiddenPage() {
  const navigate = useNavigate();
  const error: any = useRouteError();
  // console.log(error.message);

  toast.error('Somthing went wrong!', {
    description: error.message,
    duration: 5000,
  });

  return (
    <div className="flex flex-col gap-y-3 font-natosans text-lg justify-center items-center">
      <img
        width={400}
        height={400}
        src="https://res.cloudinary.com/dzorpsnmn/image/upload/v1720589128/EXAM-ARCHIVE-ASSETS/gkvernwxjgfprl1krxoi.png"
        alt="Forbidden"
        className="mb-7"
      />
      <p className="text-slate-800 text-sm text-center sm:text-medium">
        Oops! Something went wrong.
      </p>
      <p className="text-slate-500 text-sm text-center sm:text-medium">
        We apologize for the inconvenience. Please try refreshing the page or
        come back later.
      </p>
      <p className="text-slate-500 text-sm text-center sm:text-medium">
        If the issue persists, contact our support team for assistance.
      </p>
      <div>
        <Button
          color="primary"
          radius="sm"
          variant="bordered"
          className="border-transparent"
          startContent={<IoMdArrowRoundBack />}
          onClick={() => navigate('/')}
        >
          Go to home page
        </Button>
        <Button
          color="primary"
          radius="sm"
          variant="bordered"
          className="border-transparent"
          startContent={<IoIosRefresh />}
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>
      </div>
    </div>
  );
}
