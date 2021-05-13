import { useEffect, useRef } from "react";

/**
 * get previous value
 *
 * @export
 * @template T
 * @param {T} state
 * @return {*}
 */
export function usePrevious<T>(state: T) {
  const pre = useRef<T | undefined>();
  useEffect(() => {
    Promise.resolve().then(() => {
      pre.current = state;
    });
  }, [state]);
  return pre;
}
