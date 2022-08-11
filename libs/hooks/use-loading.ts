import { useState } from "react";

export default function useLoading() {
  const [isLoading, setIsLoading] = useState(false);

  return {
    isLoading,
    doAction: async <T>(fn: () => Promise<T>) => {
      try {
        setIsLoading(true);
        const result = await fn();
        setIsLoading(false);
        return result;
      } finally {
        setIsLoading(false);
      }
    },
  };
}
