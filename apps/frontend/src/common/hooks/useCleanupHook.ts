import { useEffect } from "react";

/**
 * Callback will fire when component will unmount
 * @param callback callback function
 */
export const useComponentUnmount = (callback: () => void) => {
  useEffect(() => {
    let first = 0;
    return () => {
      if (first === 1) {
        callback();
      } else {
        first = 1;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
