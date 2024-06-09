import { ReactElement, useState } from 'react';

const useMultiStepForm = (steps: ReactElement[]) => {
  const [stepIndex, setStepIndex] = useState(0);

  const next = () => {
    setStepIndex((prev) => prev + 1);
  };

  const prev = () => {
    setStepIndex((prevState) => prevState - 1);
  };

  const isFirstStep = () => stepIndex === 0;

  const isLastStep = () => stepIndex === steps.length - 1;

  return {
    step: steps[stepIndex],
    next,
    prev,
    isFirstStep,
    isLastStep,
    stepIndex,
  };
};

export default useMultiStepForm;
