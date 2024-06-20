export type TCommentType = 'COMMENTS' | 'REPLIES';
export type TCommentAction = 'UPVOTE' | 'DOWNVOTE';
export type TReaction = 'VOTE' | 'RETRACE';

export interface IComment {
  commentId: string;
  downVotes: { count: number; hasDownVoted: boolean };
  isEdited: boolean;
  message: string;
  postId: string;
  replyCount: number;
  timestamp: string; // Date in ISO 8601 format
  upVotes: { count: number; hasUpVoted: boolean };
  userId: { username: string; _id: string };
}

export interface IGetComments {
  postId: string;
  page: string;
  parentId?: string;
  commentType: TCommentType;
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

export interface ICommentMutations {
  handleCreateComment: (_message: string) => Promise<void>;
  handleDeleteComment: (_commentId: string) => Promise<void>;
  handleEditComment: (_commentId: string, _message: string) => Promise<void>;
  handleUpvoteComment: (
    _commentId: string,
    _reaction: TReaction
  ) => Promise<void>;
  handleDownVoteComment: (
    _commentId: string,
    _reaction: TReaction
  ) => Promise<void>;
}
