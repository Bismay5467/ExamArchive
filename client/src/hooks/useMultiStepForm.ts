import { ReactElement, useState } from 'react';

const START_INDEX = 0;

const useMultiStepForm = (steps: ReactElement[]) => {
  const [stepIndex, setStepIndex] = useState(START_INDEX);

  const next = () => {
    setStepIndex((prev) => prev + 1);
  };

  const prev = () => {
    setStepIndex((prevState) => prevState - 1);
  };

  const isFirstStep = () => stepIndex === START_INDEX;

  const isLastStep = () => stepIndex === steps.length - 1;

  const resetMultiStepForm = () => {
    setStepIndex(START_INDEX);
  };

  return {
    step: steps[stepIndex],
    next,
    prev,
    isFirstStep,
    isLastStep,
    stepIndex,
    resetMultiStepForm,
  };
};

export default useMultiStepForm;
