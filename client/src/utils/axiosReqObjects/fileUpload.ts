import { SERVER_ROUTES } from '@/constants/routes';
import { TFileUploadFormFields } from '@/types/upload';
import { useAuth } from '@/hooks/useAuth';

export default (fileUploadData: TFileUploadFormFields[]) => {
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
