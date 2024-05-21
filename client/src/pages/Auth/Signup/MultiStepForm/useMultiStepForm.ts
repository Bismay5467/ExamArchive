import { ReactElement, useState } from 'react';

const useMultiStepForm = (steps: ReactElement[]) => {
  const [stepIndex, setStepIndex] = useState(0);

  const next = () => {
    setStepIndex((prev) => prev + 1);
  };

  return { step: steps[stepIndex], next };
};

export default useMultiStepForm;
