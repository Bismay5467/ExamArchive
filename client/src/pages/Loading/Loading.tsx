import React, { useEffect } from 'react';

const LOADING_PERCENT = 50;
const COMPLETE_PERCENT = 100;

export default function Loading({
  setProgress,
}: {
  setProgress: React.Dispatch<React.SetStateAction<number>>;
}) {
  useEffect(() => {
    setProgress(LOADING_PERCENT);
    return () => setProgress(COMPLETE_PERCENT);
  });
  return null;
}
