import { useState } from "react";

export default function useDebounce() {
  const [timeoutId, setTimeoutId] = useState(-1);

  const debounce = (fn: Function, delay = 250) => {
    if (timeoutId !== -1) clearTimeout(timeoutId);
    const newTimeoutId = setTimeout(fn, delay);
    setTimeoutId(newTimeoutId);
  };

  return debounce;
}
