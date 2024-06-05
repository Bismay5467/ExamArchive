import { SERVER_ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { TFileUploadFormFields } from '@/types/upload';

export const getFileFileUploadObj = (
  fileUploadData: TFileUploadFormFields[]
) => {
  const url = SERVER_ROUTES.UPLOAD;
  const {
    authState: { jwtToken },
  } = useAuth();
  if (!jwtToken) return null;
  const axiosObj = {
    url,
    data: { data: fileUploadData },
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
    withCredentials: true,
  };

  return axiosObj;
};
