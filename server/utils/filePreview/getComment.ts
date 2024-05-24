const getComment = ({
  message,
  postId,
  commentId,
}: {
  message: string;
  postId: string;
  commentId: string;
}) => {
  const postLink = `${process.env.DOMAIN_URL}/filePreview/${postId}#${commentId}`;
  return { postLink, message };
};

export default getComment;
