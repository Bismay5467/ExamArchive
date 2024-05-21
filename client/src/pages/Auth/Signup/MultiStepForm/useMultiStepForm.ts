import { ReactElement, useState } from 'react';

const useMultiStepForm = (steps: ReactElement[]) => {
  const [stepIndex, setStepIndex] = useState(0);

  const next = () => {
    setStepIndex((prev) => prev + 1);
  };

  const isFirstStep = () => {
    return stepIndex === 0;
  };

  return { step: steps[stepIndex], next, isFirstStep };
};

export default useMultiStepForm;
