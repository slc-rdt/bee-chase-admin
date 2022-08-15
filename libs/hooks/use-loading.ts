import { useState } from "react";

export default function useLoading() {
  const [isLoading, setIsLoading] = useState(false);

  return {
    isLoading,
    doAction: async <T>(promise: Promise<T>) => {
      try {
        setIsLoading(true);
        const result = await promise;
        setIsLoading(false);
        return result;
      } finally {
        setIsLoading(false);
      }
    },
  };
}
