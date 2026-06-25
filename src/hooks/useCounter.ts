import { useState, useCallback } from "react";

function useCounter(initialValue = 0, initialStep = 1) {
  const [count, setCount] = useState(initialValue);
  const [step, setStep] = useState(initialStep);

  const handleInc = useCallback(() => {
    setCount((prev) => prev + step);
  }, [step]);

  const handleDec = useCallback(() => {
    setCount((prev) => prev - step);
  }, [step]);

const setStepValue = useCallback((newStep: number) => {
    setStep(newStep);
  }
, []);

const resetCount = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  return { count, step, handleInc, handleDec, setStepValue, resetCount };
}

export default useCounter;
