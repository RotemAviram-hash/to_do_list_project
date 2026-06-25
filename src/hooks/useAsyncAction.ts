import { useState } from "react";

// נגדיר הגדרות אופציונליות להוק (קונפיגורציה)

export function useAsyncAction() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const raiseloadingGet = () => setIsLoading(true);

  const removeLoading = () => setIsLoading(false);

  const raiseErrorGet = () => setError(true);

  const clearError = () => setError(false);

  return {
    error,
    isLoading,
    raiseloadingGet,
    removeLoading,
    raiseErrorGet,
    clearError,
  };
}
