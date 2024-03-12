const calculateRating = ({
  totalRating,
  avgRating,
  newRating,
}: {
  totalRating: number;
  avgRating: number;
  newRating: number;
}) => {
  if (totalRating < 0 || avgRating < 0 || newRating < 0) return avgRating;
  return (avgRating * totalRating + newRating) / (totalRating + 1);
};

export default calculateRating;
