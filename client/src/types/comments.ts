export type TCommentType = 'COMMENTS' | 'REPLIES';
export type TCommentAction = 'UPVOTE' | 'DOWNVOTE';
export type TReaction = 'SET' | 'RESET';

export interface IComment {
  replyCount: number;
  timestamp: string; // ISO date string
  userId: { _id: string | null; username: string };
  postId: string;
  commentId: string;
  isEdited: boolean;
  message: string;
  upVotes: {
    count: number;
    hasUpVoted: boolean;
  };
  downVotes: {
    count: number;
    hasDownVoted: boolean;
  };
  replyComments: IComment[] | null;
}

export interface ICommentContext {
  commentData: IComment[];
  setPostId(): void;
  createComment(): void;
  editComment(): void;
  deleteComment(): void;
  react(): void;
}

export interface IPostComment {
  parentId?: string;
  postId: string;
  message: string;
}

export interface IEditComment {
  commentId: string;
  message: string;
}

export interface IDeleteComment {
  commentId: string;
  parentId?: string;
}

export interface IReactToComment {
  commentId: string;
  action: TCommentAction;
  reaction: TReaction;
}
