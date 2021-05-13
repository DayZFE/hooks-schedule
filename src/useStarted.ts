import { useEffect, useRef } from "react";

/**
 * get if state initialized condition
 *
 * @export
 * @template T
 * @param {T} state
 * @return {*}
 */
export function useStarted<T>(state: T) {
  const started = useRef(false);
  useEffect(() => {
    Promise.resolve().then(() => {
      started.current = true;
    });
  }, [state]);
  return started;
}
