import { AxiosRequestConfig } from 'axios';
import { SERVER_ROUTES } from '@/constants/routes';
import { TCommentType } from '@/types/comments';

export const getCommentsObj = ({
  postId,
  page,
  parentId = undefined,
  commentType,
}: {
  postId: string;
  page: string;
  parentId?: string;
  commentType: TCommentType;
}) => {
  const params = { postId, page, commentType, ...(parentId && { parentId }) };
  const requestObj: AxiosRequestConfig<any> = {
    url: SERVER_ROUTES.GETCOMMENT,
    params,
    method: 'GET',
  };

  return requestObj;
};
