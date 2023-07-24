/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

/**
 * Callback will fire when component will unmount
 * @param callback callback function
 */
export const useComponentUnmount = (callback: () => void) => {
  let first = 0;
  useEffect(() => {
    return () => {
      if (first === 1) {
        callback();
      } else {
        first = 1;
      }
    };
  }, []);
};
