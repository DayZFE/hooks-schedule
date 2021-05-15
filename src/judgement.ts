import { useEffect, useRef } from "react";
import { usePreviousRef } from "./basic";

/**
 * judge if state changed
 *
 * @export
 * @param {*} state
 * @return {*}
 */
export function useChangedRef(state: any) {
  const result = useRef(false);
  const previousRef = usePreviousRef(state);
  useEffect(() => {
    if (state !== previousRef.current) {
      result.current = true;
    } else {
      result.current = false;
    }
  }, [state]);
  return result;
}
