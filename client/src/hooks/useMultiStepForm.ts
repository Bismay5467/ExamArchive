import { ReactElement, useState } from 'react';

const useMultiStepForm = (steps: ReactElement[]) => {
  const [stepIndex, setStepIndex] = useState(0);

  const next = () => {
    setStepIndex((prev) => prev + 1);
  };

  const prev = () => {
    setStepIndex((prev) => prev - 1);
  };

  const isFirstStep = () => {
    return stepIndex === 0;
  };

  const isLastStep = () => {
    return stepIndex === steps.length;
  };

  return { step: steps[stepIndex], next, prev, isFirstStep, isLastStep };
};

export default useMultiStepForm;
