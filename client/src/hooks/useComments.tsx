/* eslint-disable no-confusing-arrow */
/* eslint-disable function-paren-newline */
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';
import {
  getCommentsObj,
  postCommentObj,
  deleteCommentObj,
  editCommentObj,
} from '@/utils/axiosReqObjects';
import { IComment, TCommentType } from '@/types/comments';
import { TEMP_COMMENT_ID } from '@/constants/shared';
import { useAuth } from './useAuth';
import fetcher from '@/utils/fetcher/fetcher';

export const useComments = (commentType: TCommentType, parentId?: string) => {
  const {
    authState: { username, userId, jwtToken },
  } = useAuth();
  const { paperid: postId } = useParams();

  const getKey: SWRInfiniteKeyLoader = (pageIndex, previousPageData) => {
    // TODO: Content of previousPageData needs further testing

    if (previousPageData && !previousPageData.hasMore) return null;
    if (!postId) return null;
    return getCommentsObj(
      {
        postId,
        commentType,
        page: String(pageIndex + 1),
        parentId,
      },
      jwtToken
    );
  };
  const { data: response, setSize, isLoading, mutate } = useSWRInfinite(getKey);

  const createCommentOptions = (newData: any) => ({
    optimisticData: (staleData: any) => {
      const tmpComment: IComment = {
        commentId: TEMP_COMMENT_ID,
        downVotes: { count: 0, hasDownVoted: false },
        isEdited: false,
        message: newData.message,
        postId: postId!,
        replyCount: 0,
        timestamp: new Date().toISOString(),
        upVotes: { count: 0, hasUpVoted: false },
        userId: { _id: userId!, username: username! },
      };
      const tempData = {
        data: {
          comments: [tmpComment],
        },
      };
      // console.log([tempData, ...staleData]);

      return [tempData, ...staleData];
    },
    rollbackOnError: true,
    populateCache: (res: any, staleData: any) => {
      const newComment: IComment = {
        commentId: res.commentId,
        downVotes: { count: 0, hasDownVoted: false },
        isEdited: false,
        message: newData.message,
        postId: postId!,
        replyCount: 0,
        timestamp: new Date().toISOString(),
        upVotes: { count: 0, hasUpVoted: false },
        userId: { _id: userId!, username: username! },
      };
      const updatedData = {
        data: {
          comments: [newComment],
        },
      };
      // console.log([updatedData, ...staleData]);

      return [updatedData, ...staleData];
    },
    revalidate: false,
  });

  const deleteCommentOptions = (toDelete: any) => ({
    optimisticData: (staleData: any) => {
      const updatedData = staleData.map((resObj: any) => ({
        ...resObj,
        data: {
          ...resObj.data,
          comments: resObj.data.comments.filter(
            (comment: IComment) => comment.commentId !== toDelete.commentId
          ),
        },
      }));
      return updatedData;
    },
    rollbackOnError: true,
    populateCache: (_: any, staleData: any) => {
      const updatedData = staleData.map((resObj: any) => ({
        ...resObj,
        data: {
          ...resObj.data,
          comments: resObj.data.comments.filter(
            (comment: IComment) => comment.commentId !== toDelete.commentId
          ),
        },
      }));
      return updatedData;
    },
    revalidate: false,
  });

  const editCommentOptions = (toEdit: any) => ({
    optimisticData: (staleData: any) => {
      const updatedData = staleData.map((resObj: any) => ({
        ...resObj,
        data: {
          ...resObj.data,
          comments: resObj.data.comments.map((comment: IComment) =>
            comment.commentId === toEdit.commentId
              ? { ...comment, message: toEdit.message }
              : comment
          ),
        },
      }));

      return updatedData;
    },
    rollbackOnError: true,
    populateCache: (_: any, staleData: any) => {
      const updatedData = staleData.map((resObj: any) => ({
        ...resObj,
        data: {
          ...resObj.data,
          comments: resObj.data.comments.map((comment: IComment) =>
            comment.commentId === toEdit.commentId
              ? { ...comment, message: toEdit.message }
              : comment
          ),
        },
      }));

      return updatedData;
    },
    revalidate: false,
  });

  const handleCreateComment = async (message: string) => {
    if (!postId) {
      toast.error('Somthing went wrong!', {
        description: 'Unknown error',
        duration: 5000,
      });
      return;
    }
    const newPost = { message, postId, ...(parentId && { parentId }) };
    const reqObject = postCommentObj(newPost, jwtToken);
    if (!reqObject) {
      toast.error('Somthing went wrong!', {
        duration: 5000,
      });
      return;
    }
    try {
      await mutate(async () => {
        const res = await fetcher(reqObject);
        return res.data;
      }, createCommentOptions(newPost));
    } catch (err) {
      toast.error('Somthing went wrong!', {
        description: `${err}`,
        duration: 5000,
      });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!postId) {
      toast.error('Somthing went wrong!', {
        description: 'Unknown error',
        duration: 5000,
      });
      return;
    }
    const deletePost = { commentId, ...(parentId && { parentId }) };
    const reqObject = deleteCommentObj(deletePost, jwtToken);
    if (!reqObject) {
      toast.error('Somthing went wrong!', {
        duration: 5000,
      });
      return;
    }
    try {
      await mutate(async () => {
        const res = await fetcher(reqObject);
        return res.data;
      }, deleteCommentOptions(deletePost));
    } catch (err) {
      toast.error('Somthing went wrong!', {
        description: `${err}`,
        duration: 5000,
      });
    }
  };

  const handleEditComment = async (commentId: string, message: string) => {
    if (!postId) {
      toast.error('Somthing went wrong!', {
        description: 'Unknown error',
        duration: 5000,
      });
      return;
    }
    const editPost = { commentId, message };
    const reqObject = editCommentObj(editPost, jwtToken);
    if (!reqObject) {
      toast.error('Somthing went wrong!', {
        duration: 5000,
      });
      return;
    }
    try {
      await mutate(async () => {
        const res = await fetcher(reqObject);
        return res.data;
      }, editCommentOptions(editPost));
    } catch (err) {
      toast.error('Somthing went wrong!', {
        description: `${err}`,
        duration: 5000,
      });
    }
  };

  return {
    response,
    handleCreateComment,
    handleDeleteComment,
    handleEditComment,
    setSize,
    isLoading,
  };
};
