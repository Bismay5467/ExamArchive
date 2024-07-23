/* eslint-disable indent */
/* eslint-disable no-confusing-arrow */
/* eslint-disable function-paren-newline */
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite';
import { toast } from 'sonner';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  getCommentsObj,
  postCommentObj,
  deleteCommentObj,
  editCommentObj,
  reactToCommentObj,
} from '@/utils/axiosReqObjects';
import {
  IComment,
  IReactToComment,
  TCommentType,
  TReaction,
} from '@/types/comments';
import { RETRACE_VOTE, TEMP_COMMENT_ID, VOTE } from '@/constants/shared';
import { useAuth } from './useAuth';
import fetcher from '@/utils/fetcher/fetcher';
import { IsUserAuthenticated } from '@/utils/helpers';

export const useComments = (commentType: TCommentType, parentId?: string) => {
  const {
    authState: { username, userId, jwtToken, isAuth },
  } = useAuth();
  const { paperid: postId } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [startFetching, setStartFetching] = useState<boolean>(false);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);

  const getKey: SWRInfiniteKeyLoader = (pageIndex, previousPageData) => {
    // TODO: Content of previousPageData needs further testing

    if (previousPageData && !previousPageData.data.hasMore) return null;
    if (!postId || !startFetching) return null;
    return getCommentsObj(
      {
        postId,
        commentType,
        page: (pageIndex + 1).toString(),
        parentId,
      },
      jwtToken
    );
  };
  const {
    data: response,
    size,
    setSize,
    isLoading,
    mutate,
    error,
    isValidating,
  } = useSWRInfinite(getKey);

  useEffect(() => {
    if (response && response?.length > 0) {
      setIsLastPage(!response.at(response.length - 1).data.hasMore);
    }
  }, [response]);

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
              ? { ...comment, message: toEdit.message, isEdited: true }
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
              ? { ...comment, message: toEdit.message, isEdited: true }
              : comment
          ),
        },
      }));

      return updatedData;
    },
    revalidate: false,
  });

  const upvoteCommentOptions = (toUpvote: IReactToComment) => ({
    optimisticData: (staleData: any) => {
      const updatedData = staleData.map((resObj: any) => ({
        ...resObj,
        data: {
          ...resObj.data,
          comments: resObj.data.comments.map((comment: IComment) =>
            comment.commentId === toUpvote.commentId
              ? {
                  ...comment,
                  upVotes: {
                    hasUpVoted: toUpvote.reaction === 'VOTE',
                    count:
                      comment.upVotes.count +
                      (toUpvote.reaction === 'VOTE' ? VOTE : RETRACE_VOTE),
                  },
                }
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
            comment.commentId === toUpvote.commentId
              ? {
                  ...comment,
                  upVotes: {
                    hasUpVoted: toUpvote.reaction === 'VOTE',
                    count:
                      comment.upVotes.count +
                      (toUpvote.reaction === 'VOTE' ? VOTE : RETRACE_VOTE),
                  },
                }
              : comment
          ),
        },
      }));

      return updatedData;
    },
    revalidate: false,
  });

  const downVoteCommentOptions = (toDownVote: IReactToComment) => ({
    optimisticData: (staleData: any) => {
      const updatedData = staleData.map((resObj: any) => ({
        ...resObj,
        data: {
          ...resObj.data,
          comments: resObj.data.comments.map((comment: IComment) =>
            comment.commentId === toDownVote.commentId
              ? {
                  ...comment,
                  downVotes: {
                    hasDownVoted: toDownVote.reaction === 'VOTE',
                    count:
                      comment.downVotes.count +
                      (toDownVote.reaction === 'VOTE' ? VOTE : RETRACE_VOTE),
                  },
                }
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
            comment.commentId === toDownVote.commentId
              ? {
                  ...comment,
                  downVotes: {
                    hasDownVoted: toDownVote.reaction === 'VOTE',
                    count:
                      comment.downVotes.count +
                      (toDownVote.reaction === 'VOTE' ? VOTE : RETRACE_VOTE),
                  },
                }
              : comment
          ),
        },
      }));

      return updatedData;
    },
    revalidate: false,
  });

  const handleCreateComment = async (message: string) => {
    if (!IsUserAuthenticated(isAuth, navigate, pathname)) {
      return;
    }
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
    // console.log(startFetching);
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
    if (!IsUserAuthenticated(isAuth, navigate, pathname)) {
      return;
    }
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
    if (!IsUserAuthenticated(isAuth, navigate, pathname)) {
      return;
    }
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

  const handleUpvoteComment = async (
    commentId: string,
    reaction: TReaction
  ) => {
    if (!IsUserAuthenticated(isAuth, navigate, pathname)) {
      return;
    }
    if (!postId) {
      toast.error('Somthing went wrong!', {
        description: 'Unknown error',
        duration: 5000,
      });
      return;
    }
    const upvotePost: IReactToComment = {
      commentId,
      action: 'UPVOTE',
      reaction,
    };
    const reqObject = reactToCommentObj(upvotePost, jwtToken);
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
      }, upvoteCommentOptions(upvotePost));
    } catch (err) {
      toast.error('Somthing went wrong!', {
        description: `${err}`,
        duration: 5000,
      });
    }
  };

  const handleDownVoteComment = async (
    commentId: string,
    reaction: TReaction
  ) => {
    if (!IsUserAuthenticated(isAuth, navigate, pathname)) {
      return;
    }
    if (!postId) {
      toast.error('Somthing went wrong!', {
        description: 'Unknown error',
        duration: 5000,
      });
      return;
    }
    const downVotePost: IReactToComment = {
      commentId,
      action: 'DOWNVOTE',
      reaction,
    };
    const reqObject = reactToCommentObj(downVotePost, jwtToken);
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
      }, downVoteCommentOptions(downVotePost));
    } catch (err) {
      toast.error('Somthing went wrong!', {
        description: `${err}`,
        duration: 5000,
      });
    }
  };

  return {
    response,
    setStartFetching,
    mutations: {
      handleCreateComment,
      handleDeleteComment,
      handleEditComment,
      handleUpvoteComment,
      handleDownVoteComment,
    },
    size,
    setSize,
    isLoading,
    isValidating,
    error,
    isLastPage,
  };
};
